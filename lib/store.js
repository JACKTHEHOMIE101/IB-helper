// Postgres data access. Takes any pg-compatible pool (pg.Pool in production, pg-mem in tests and local dev).
import fs from "node:fs";

const SCHEMA = fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
const day = (d = new Date()) => d.toISOString().slice(0, 10);

export class ConflictError extends Error {}

export function createStore(pool, { rowLevelSecurity = true } = {}) {
  const q = (text, params = []) => pool.query(text, params);

  return {
    async migrate() {
      // One statement per call. The in-memory test database doesn't know row-level security, so it skips those lines.
      const statements = SCHEMA.replace(/--.*$/gm, "").split(";").map((s) => s.trim()).filter(Boolean);
      for (const stmt of statements) {
        if (!rowLevelSecurity && /enable row level security/i.test(stmt)) continue;
        await q(stmt);
      }
    },

    /* ---- users ---- */
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
    // Removes the user and, through cascading deletes, their saved progress, leaderboard row, AI history and activity.
    async deleteUser(id) {
      await q(`delete from users where id = $1`, [id]);
    },

    /* ---- private saved progress ---- */
    async getDoc(userId, doc) {
      const { rows } = await q(`select data, version from user_docs where user_id = $1 and doc = $2`, [userId, doc]);
      return rows[0] ? { data: rows[0].data, version: rows[0].version } : { data: null, version: 0 };
    },
    // Saves only if the caller last saw `baseVersion`. Returns the new version, or throws ConflictError.
    async putDoc(userId, doc, data, baseVersion) {
      const body = JSON.stringify(data);
      if (!baseVersion) {
        // First save. If a copy already exists (another device saved first), that's a conflict.
        const existing = await q(`select 1 from user_docs where user_id = $1 and doc = $2`, [userId, doc]);
        if (existing.rows.length) throw new ConflictError();
        try { await q(`insert into user_docs (user_id, doc, data, version) values ($1, $2, $3, 1)`, [userId, doc, body]); }
        catch (e) { if (e?.code === "23505") throw new ConflictError(); throw e; } // lost a race with another first save
        return 1;
      }
      const up = await q(
        `update user_docs set data = $3, version = version + 1, updated_at = now()
         where user_id = $1 and doc = $2 and version = $4 returning version`,
        [userId, doc, body, baseVersion]
      );
      if (up.rows.length) return up.rows[0].version;
      throw new ConflictError();
    },
    async allDocs(userId) {
      const { rows } = await q(`select doc, data, updated_at from user_docs where user_id = $1`, [userId]);
      return Object.fromEntries(rows.map((r) => [r.doc, { data: r.data, updated_at: r.updated_at }]));
    },

    /* ---- clubs and leaderboard ---- */
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
      const { rows } = await q(`select user_id, club_code, data from board where user_id = $1`, [userId]);
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

    /* ---- AI usage ---- */
    async aiUsedSince(userId, since) {
      const { rows } = await q(`select count(*) as n from ai_calls where user_id = $1 and created_at >= $2`, [userId, since]);
      return Number(rows[0]?.n || 0);
    },
    async recordAiCall(userId, { feature, model, inputTokens, outputTokens, cost }) {
      await q(
        `insert into ai_calls (user_id, feature, model, input_tokens, output_tokens, cost_usd) values ($1, $2, $3, $4, $5, $6)`,
        [userId, feature, model, inputTokens || 0, outputTokens || 0, Number((cost || 0).toFixed(5))]
      );
    },
    async aiSummary(userId) {
      const { rows } = await q(`select feature, count(*) as calls from ai_calls where user_id = $1 group by feature`, [userId]);
      return rows.map((r) => ({ feature: r.feature, calls: Number(r.calls) }));
    },

    /* ---- activity and founder stats ---- */
    async touchActivity(userId, d = new Date()) {
      await q(`insert into activity (user_id, day) values ($1, $2) on conflict (user_id, day) do nothing`, [userId, day(d)]);
    },
    async stats(now = new Date()) {
      const ago = (n) => new Date(now.getTime() - n * 864e5);
      const one = async (text, params) => Number((await q(text, params)).rows[0]?.n || 0);
      const active = (n) => one(`select count(distinct user_id) as n from activity where day >= $1`, [day(ago(n - 1))]);
      const ai = async (since) => {
        const { rows } = await q(
          `select feature, count(*) as calls, sum(input_tokens) as input_tokens, sum(output_tokens) as output_tokens, sum(cost_usd) as cost
           from ai_calls where created_at >= $1 group by feature`,
          [since]
        );
        return rows.map((r) => ({ feature: r.feature, calls: Number(r.calls), inputTokens: Number(r.input_tokens), outputTokens: Number(r.output_tokens), cost: Number(r.cost) }))
          .sort((a, b) => b.cost - a.cost);
      };
      // Study activity lives inside each user's saved progress. Fine to scan at this scale; move to a table if it grows.
      const { rows: docs } = await q(`select data from user_docs where doc = 'prep' limit 5000`);
      const weekAgo = day(ago(6));
      let reviews7 = 0, sims7 = 0, mocks7 = 0;
      for (const { data } of docs) {
        for (const [d, n] of Object.entries(data?.reviewLog || {})) if (d >= weekAgo) reviews7 += Number(n) || 0;
        sims7 += (data?.simHist || []).filter((h) => h.at >= ago(7).getTime()).length;
        mocks7 += (data?.mockHist || []).filter((h) => h.at >= ago(7).getTime()).length;
      }
      return {
        generatedAt: now.toISOString(),
        users: { total: await one(`select count(*) as n from users`), pro: await one(`select count(*) as n from users where plan = 'pro'`), new7: await one(`select count(*) as n from users where created_at >= $1`, [ago(7)]) },
        active: { day: await active(1), week: await active(7), month: await active(30) },
        study7: { reviews: reviews7, simulations: sims7, mockAnswers: mocks7 },
        clubs: await one(`select count(*) as n from clubs`),
        ai7: await ai(ago(7)),
        ai30: await ai(ago(30)),
      };
    },
  };
}
