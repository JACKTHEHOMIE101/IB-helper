import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { newDb } from "pg-mem";
import { createApp } from "../server.js";
import { createStore } from "../lib/store.js";
import { createFakeAI, normalizeInput } from "../lib/ai.js";
import { applyStripeEvent } from "../lib/billing.js";
import { createVerifier } from "../lib/auth.js";

const env = { DEV_FAKE_AUTH: "1", FREE_AI_PER_WEEK: "3", PRO_AI_PER_DAY: "5", ADMIN_EMAILS: "admin@example.com" };
let app, store;
const as = (name, email) => ({ authorization: `Bearer dev:${name}:${email || name + "@example.com"}` });

before(async () => {
  const { Pool } = newDb().adapters.createPg();
  store = createStore(new Pool());
  await store.migrate();
  const fakeBilling = {
    parseEvent: (body) => { const e = JSON.parse(body.toString()); if (e.bad) throw new Error("sig"); return e; },
    checkoutUrl: async () => "https://checkout.example/session",
    portalUrl: async () => "https://billing.example/portal",
  };
  app = createApp({ store, verifyToken: createVerifier(env), ai: createFakeAI(), billing: fakeBilling, env });
});

test("rejects requests without a valid sign-in", async () => {
  await request(app).get("/api/me").expect(401);
  await request(app).get("/api/me").set({ authorization: "Bearer nonsense" }).expect(401);
});

test("dev sign-in is refused in production", async () => {
  const verify = createVerifier({ DEV_FAKE_AUTH: "1", NODE_ENV: "production" });
  assert.equal(await verify("dev:alex:alex@example.com"), null);
});

test("creates the user on first request and reports the free plan", async () => {
  const r = await request(app).get("/api/me").set(as("alex")).expect(200);
  assert.equal(r.body.plan, "free");
  assert.equal(r.body.pro, false);
  assert.deepEqual(r.body.ai, { used: 0, limit: 3, period: "week", remaining: 3 });
});

test("saves and reloads private progress, and keeps it private", async () => {
  await request(app).put("/api/docs/prep").set(as("alex")).send({ data: { cards: { a1: { reps: 2 } } } }).expect(204);
  const r = await request(app).get("/api/docs/prep").set(as("alex")).expect(200);
  assert.deepEqual(r.body.data, { cards: { a1: { reps: 2 } } });
  const other = await request(app).get("/api/docs/prep").set(as("blair")).expect(200);
  assert.equal(other.body.data, null);
  await request(app).get("/api/docs/secrets").set(as("alex")).expect(404);
  await request(app).put("/api/docs/prep").set(as("alex")).send({ data: [1, 2] }).expect(400);
});

test("leaderboard: members write their own row, read the club, and see names", async () => {
  await request(app).put("/api/board").set(as("alex")).send({ club: "MIZZOU-AB12", clubName: "Mizzou Investment Club", week: "2026-11-02", points: 67, readiness: 12, hack: "x" }).expect(204);
  await request(app).put("/api/board").set(as("blair")).send({ club: "mizzou-ab12", points: 140, readiness: "58" }).expect(204);
  const r = await request(app).get("/api/board?club=MIZZOU-AB12").set(as("casey")).expect(200);
  assert.equal(r.body.rows.length, 2);
  const blair = r.body.rows.find((x) => x.id === "dev-blair");
  assert.equal(blair.points, 140);
  assert.equal(blair.readiness, 58);
  assert.equal(r.body.rows.find((x) => x.id === "dev-alex").hack, undefined);
  const names = await request(app).post("/api/profiles").set(as("casey")).send({ ids: ["dev-alex", "dev-blair", "dev-casey"] }).expect(200);
  assert.equal(names.body["dev-alex"].name, "alex");
  assert.equal(names.body["dev-casey"], undefined, "people not on a board get no name lookup");
  await request(app).get("/api/board?club=bad code!").set(as("alex")).expect(400);
});

test("leaderboard: only yourself, the club creator or an admin can remove a row", async () => {
  await request(app).delete("/api/board/dev-alex").set(as("casey")).expect(403);
  await request(app).delete("/api/board/dev-blair").set(as("alex")).expect(204); // alex created the club
  await request(app).put("/api/board").set(as("blair")).send({ club: "MIZZOU-AB12", points: 1 }).expect(204);
  await request(app).delete("/api/board/dev-blair").set(as("boss", "admin@example.com")).expect(204);
  await request(app).delete("/api/board/dev-alex").set(as("alex")).expect(204);
  const r = await request(app).get("/api/board?club=MIZZOU-AB12").set(as("alex")).expect(200);
  assert.equal(r.body.rows.length, 0);
});

test("AI: returns text, counts usage, and stops at the free weekly limit", async () => {
  const prompt = "Grade this answer. Reply with JSON only.";
  for (let i = 0; i < 3; i++) {
    const r = await request(app).post("/api/ai").set(as("dana")).send({ input: prompt }).expect(200);
    assert.equal(JSON.parse(r.body.text).score, 7);
    assert.equal(r.body.remaining, 2 - i);
  }
  const blocked = await request(app).post("/api/ai").set(as("dana")).send({ input: prompt }).expect(402);
  assert.equal(blocked.body.code, "quota_exhausted");
});

test("AI: rejects malformed or oversized input", async () => {
  await request(app).post("/api/ai").set(as("erin")).send({ input: "" }).expect(400);
  await request(app).post("/api/ai").set(as("erin")).send({ input: "x".repeat(40001) }).expect(400);
  await request(app).post("/api/ai").set(as("erin")).send({ input: [{ role: "assistant", content: "hi" }] }).expect(400);
  assert.ok(normalizeInput([{ role: "user", content: "a" }, { role: "assistant", content: "b" }, { role: "user", content: "c" }]));
});

test("billing: checkout, then the webhook upgrades and later downgrades the user", async () => {
  const c = await request(app).post("/api/billing/checkout").set(as("dana")).expect(200);
  assert.match(c.body.url, /checkout/);
  const me = await request(app).get("/api/me").set(as("dana")).expect(200);
  const completed = { type: "checkout.session.completed", data: { object: { mode: "subscription", client_reference_id: me.body.id, customer: "cus_123" } } };
  await request(app).post("/api/stripe/webhook").set("content-type", "application/json").send(JSON.stringify(completed)).expect(200);
  let r = await request(app).get("/api/me").set(as("dana")).expect(200);
  assert.equal(r.body.pro, true);
  assert.equal(r.body.ai.period, "day");
  await request(app).post("/api/ai").set(as("dana")).send({ input: "Reply with JSON only." }).expect(200); // Pro limit is separate
  await request(app).post("/api/billing/portal").set(as("dana")).expect(200);
  const cancelled = { type: "customer.subscription.deleted", data: { object: { status: "canceled", customer: "cus_123", metadata: {} } } };
  await request(app).post("/api/stripe/webhook").set("content-type", "application/json").send(JSON.stringify(cancelled)).expect(200);
  r = await request(app).get("/api/me").set(as("dana")).expect(200);
  assert.equal(r.body.pro, false);
  await request(app).post("/api/stripe/webhook").set("content-type", "application/json").send(JSON.stringify({ bad: true })).expect(400);
});

test("subscription status changes map to plans", async () => {
  const u = await store.ensureUser({ id: "u-sub", email: "s@example.com" });
  await applyStripeEvent(store, { type: "customer.subscription.updated", data: { object: { status: "active", customer: "cus_9", metadata: { user_id: u.id } } } });
  assert.equal((await store.getUser(u.id)).plan, "pro");
  await applyStripeEvent(store, { type: "customer.subscription.updated", data: { object: { status: "unpaid", customer: "cus_9", metadata: {} } } });
  assert.equal((await store.getUser(u.id)).plan, "free");
});

test("serves the app, the quiz and the public config", async () => {
  const cfg = await request(app).get("/config.js").expect(200);
  assert.match(cfg.text, /window\.__CONFIG=/);
  assert.match(cfg.text, /"devAuth":true/);
  const home = await request(app).get("/").expect(200);
  assert.match(home.text, /<title>Superday Prep<\/title>/);
  await request(app).get("/quiz").expect(200);
  await request(app).get("/app.js").expect(200);
});
