// Postgres data access. Takes any pg-compatible pool (pg.Pool in production, pg-mem in tests and local dev).
import fs from "node:fs";

const SCHEMA = fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

export function createStore(pool) {
  const q = (text, params = []) => pool.query(text, params);
  const day = (d = new Date()) => d.toISOString().slice(0, 10);

  return {
    async migrate() {
      // pg-mem runs one statement per call; real Postgres accepts either.
      for (const stmt of SCHEMA.split(";").map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean)) await q(stmt);
    },

    async ensureUser({ id, email, name }) {
      await q(
        `insert into users (id, email, display_name) values ($1, $2, $3)
         on conflict (id) do update set email = excluded.email`,
        [id, email || null, name || null]
      );
      return this.getUser(id);
    },
    async getUser(id) {
      const { rows } = await q(`select * from users where id = $1`, [id]);
      return rows[0] || null;
    },
    async setDisplayName(id, name) {
      await q(`update users set display_name = $2 where id = $1`, [id, name]);
    },
    async setPlan(id, plan, customerId) {
      await q(`update users set plan = $2, stripe_customer_id = coalesce($3, stripe_customer_id) where id = $1`, [id, plan, customerId || null]);
    },
    async setPlanByCustomer(customerId, plan) {
      await q(`update users set plan = $2 where stripe_customer_id = $1`, [customerId, plan]);
    },
    async userIdByCustomer(customerId) {
      const { rows } = await q(`select id from users where stripe_customer_id = $1`, [customerId]);
      return rows[0]?.id || null;
    },

    async getDoc(userId, doc) {
      const { rows } = await q(`select data from user_docs where user_id = $1 and doc = $2`, [userId, doc]);
      return rows[0]?.data ?? null;
    },
    async putDoc(userId, doc, data) {
      await q(
        `insert into user_docs (user_id, doc, data, updated_at) values ($1, $2, $3, now())
         on conflict (user_id, doc) do update set data = excluded.data, updated_at = now()`,
        [userId, doc, JSON.stringify(data)]
      );
    },

    async getClub(code) {
      const { rows } = await q(`select * from clubs where code = $1`, [code]);
      return rows[0] || null;
    },
    async createClubIfMissing(code, name, ownerId) {
      await q(`insert into clubs (code, name, owner_id) values ($1, $2, $3) on conflict (code) do nothing`, [code, name || null, ownerId]);
    },
    async getBoard(code) {
      const { rows } = await q(`select user_id, data from board where club_code = $1`, [code]);
      return rows.map((r) => ({ ...r.data, id: r.user_id }));
    },
    async getBoardRow(userId) {
      const { rows } = await q(`select user_id, club_code from board where user_id = $1`, [userId]);
      return rows[0] || null;
    },
    async putBoard(userId, code, data) {
      await q(
        `insert into board (user_id, club_code, data, updated_at) values ($1, $2, $3, now())
         on conflict (user_id) do update set club_code = excluded.club_code, data = excluded.data, updated_at = now()`,
        [userId, code, JSON.stringify(data)]
      );
    },
    async deleteBoard(userId) {
      await q(`delete from board where user_id = $1`, [userId]);
    },
    // Display names, only for people who are on a leaderboard (their names are already visible there).
    async boardNames(ids) {
      if (!ids.length) return {};
      const marks = ids.map((_, i) => "$" + (i + 1)).join(", ");
      const { rows } = await q(
        `select u.id, u.display_name, u.email from users u join board b on b.user_id = u.id where u.id in (${marks})`,
        ids
      );
      return Object.fromEntries(rows.map((r) => [r.id, { id: r.id, name: r.display_name || (r.email || "").split("@")[0] || "" }]));
    },

    async aiUsedSince(userId, since) {
      const { rows } = await q(`select coalesce(sum(count), 0) as n from ai_usage where user_id = $1 and day >= $2`, [userId, day(since)]);
      return Number(rows[0]?.n || 0);
    },
    async aiIncrement(userId) {
      await q(
        `insert into ai_usage (user_id, day, count) values ($1, $2, 1)
         on conflict (user_id, day) do update set count = ai_usage.count + 1`,
        [userId, day()]
      );
    },
  };
}
