// Runs against a real Postgres when TEST_DATABASE_URL is set (the other tests use an in-memory stand-in).
// Checks the things the stand-in can't: the row-level-security lock-down and concurrent saves.
//   TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:5432/superday_test npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import { createStore, ConflictError } from "../lib/store.js";

const url = process.env.TEST_DATABASE_URL;
const skip = url ? false : "set TEST_DATABASE_URL to run";
let pool, store;

before(async () => {
  if (!url) return;
  pool = new pg.Pool({ connectionString: url });
  await pool.query(`drop table if exists activity, ai_calls, board, clubs, user_docs, users cascade`);
  store = createStore(pool);
  await store.migrate();
  await store.migrate(); // running it twice must be harmless
});
after(async () => { if (pool) await pool.end(); });

test("every table has row-level security on", { skip }, async () => {
  const { rows } = await pool.query(`select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' order by relname`);
  assert.deepEqual(rows.map((r) => r.relname), ["activity", "ai_calls", "board", "clubs", "user_docs", "users"]);
  assert.ok(rows.every((r) => r.relrowsecurity), "all locked");
});

test("a public (non-owner) role can read and write nothing, even with table permissions", { skip }, async () => {
  await store.ensureUser({ id: "u1", email: "a@example.com" });
  await store.putDoc("u1", "network", { contacts: [{ name: "Private Person" }] }, 0);
  // Supabase's public web API runs as a role like this one: it is granted access to tables, and only row-level security holds it back.
  await pool.query(`do $$ begin if not exists (select from pg_roles where rolname = 'anon_test') then create role anon_test nologin; end if; end $$`);
  await pool.query(`grant usage on schema public to anon_test`);
  await pool.query(`grant all on all tables in schema public to anon_test`);
  const c = await pool.connect();
  try {
    await c.query(`set role anon_test`);
    for (const t of ["users", "user_docs", "board", "clubs", "ai_calls", "activity"]) {
      assert.equal((await c.query(`select count(*)::int as n from ${t}`)).rows[0].n, 0, `${t} is invisible`);
    }
    await assert.rejects(c.query(`insert into users (id, email) values ('evil', 'x@example.com')`), /row-level security/);
    assert.equal((await c.query(`update users set plan = 'pro'`)).rowCount, 0, "can't upgrade anyone");
    assert.equal((await c.query(`delete from user_docs`)).rowCount, 0, "can't delete anything");
  } finally { await c.query(`reset role`); c.release(); }
  assert.deepEqual((await store.getDoc("u1", "network")).data, { contacts: [{ name: "Private Person" }] }, "the server still reads it");
});

test("two devices saving at once: exactly one wins", { skip }, async () => {
  await store.ensureUser({ id: "u2", email: "b@example.com" });
  const first = await Promise.allSettled([store.putDoc("u2", "prep", { from: "phone" }, 0), store.putDoc("u2", "prep", { from: "laptop" }, 0)]);
  assert.equal(first.filter((r) => r.status === "fulfilled").length, 1);
  assert.ok(first.find((r) => r.status === "rejected").reason instanceof ConflictError);
  const next = await Promise.allSettled([store.putDoc("u2", "prep", { n: 1 }, 1), store.putDoc("u2", "prep", { n: 2 }, 1)]);
  assert.equal(next.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await store.getDoc("u2", "prep")).version, 2);
});

test("usage, stats and cascading delete work on real Postgres", { skip }, async () => {
  await store.recordAiCall("u1", { feature: "grade", model: "claude-opus-5-5", inputTokens: 1200, outputTokens: 400, cost: 0.0128 });
  await store.touchActivity("u1");
  assert.equal(await store.aiUsedSince("u1", new Date(Date.now() - 60000)), 1);
  const s = await store.stats();
  assert.equal(s.users.total, 2);
  assert.equal(s.active.day, 1);
  assert.equal(s.ai7[0].cost, 0.0128);
  await store.putBoard("u1", "CLUB-0001", { points: 3 });
  assert.equal((await store.boardNames(["u1", "u2"])).u1.name, "a");
  await store.deleteUser("u1");
  assert.equal((await pool.query(`select count(*)::int as n from user_docs where user_id = 'u1'`)).rows[0].n, 0);
  assert.equal((await pool.query(`select count(*)::int as n from ai_calls`)).rows[0].n, 0);
  assert.equal((await store.getBoard("CLUB-0001")).length, 0);
});
