// Superday Prep server: serves the app and its API (account, questions, saved progress, leaderboard, AI, billing, admin).
import "dotenv/config";
import express from "express";
import pg from "pg";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createStore, ConflictError } from "./lib/store.js";
import { createVerifier, deleteAuthUser } from "./lib/auth.js";
import { createAI, RefusalError, costUsd } from "./lib/ai.js";
import { FEATURES, InputError, parseJSON } from "./lib/prompts.js";
import { createBilling, applyStripeEvent } from "./lib/billing.js";
import { planLimits, aiAllowance, isPro } from "./lib/plans.js";
import { BANK, CORE } from "./data/questions.js";

const DOCS = new Set(["prep", "network"]);
const CLUB_CODE = /^[A-Z0-9-]{4,24}$/;
const NUM_FIELDS = ["reviews", "sims", "peers", "calls", "points", "readiness", "learned", "streak", "bestSim"];
const CORE_BANK = BANK.filter((q) => CORE.has(q.id));

export function createApp({ store, verifyToken, ai, billing, env = process.env, removeAuthUser = (id) => deleteAuthUser(id, env) }) {
  const app = express();
  const limits = planLimits(env);
  const admins = new Set((env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  const publicDir = fileURLToPath(new URL("./public/", import.meta.url));
  const supabaseOrigin = env.SUPABASE_URL ? new URL(env.SUPABASE_URL).origin : "";

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      // Only this site's own scripts (plus the two libraries it loads) can run, which limits what injected text could do.
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src https://fonts.gstatic.com",
        `connect-src 'self' ${supabaseOrigin}`.trim(),
        "img-src 'self' data: blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    });
    next();
  });

  // Stripe needs the raw body to verify its signature, so this route comes before the JSON parser.
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    if (!billing) return res.status(404).end();
    let event;
    try { event = billing.parseEvent(req.body, req.get("stripe-signature")); }
    catch { return res.status(400).send("Invalid signature"); }
    try { await applyStripeEvent(store, event); res.json({ received: true }); }
    catch (e) { console.error("webhook", e); res.status(500).end(); }
  });

  app.use(express.json({ limit: "2mb" }));

  // Public config for the browser (the Supabase anon key is meant to be public).
  app.get("/config.js", (req, res) => {
    const cfg = {
      supabaseUrl: env.SUPABASE_URL || "",
      supabaseAnonKey: env.SUPABASE_ANON_KEY || "",
      priceLabel: env.PRICE_LABEL || "$19/month",
      supportEmail: env.SUPPORT_EMAIL || "",
      devAuth: env.DEV_FAKE_AUTH === "1" && env.NODE_ENV !== "production",
      billing: !!billing,
    };
    res.type("application/javascript").set("Cache-Control", "no-store").send(`window.__CONFIG=${JSON.stringify(cfg)};`);
  });

  // Everything else under /api requires a signed-in user.
  const api = express.Router();
  const seenToday = new Set();
  api.use(async (req, res, next) => {
    try {
      const token = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
      const who = await verifyToken(token);
      if (!who) return res.status(401).json({ code: "unauthenticated", message: "Please sign in again." });
      const user = await store.ensureUser(who);
      user.isAdmin = admins.has((user.email || "").toLowerCase());
      req.user = user;
      const key = user.id + ":" + new Date().toISOString().slice(0, 10);
      if (!seenToday.has(key)) { if (seenToday.size > 50000) seenToday.clear(); seenToday.add(key); await store.touchActivity(user.id); }
      next();
    } catch (e) { next(e); }
  });

  /* ---- account ---- */
  api.get("/me", async (req, res) => {
    const u = req.user, allowance = await aiAllowance(store, u, limits);
    res.json({ id: u.id, email: u.email, name: u.display_name || "", plan: u.plan, pro: isPro(u), isAdmin: u.isAdmin, canManageBilling: !!(billing && u.stripe_customer_id), ai: allowance });
  });
  api.patch("/me", async (req, res) => {
    const name = String(req.body?.name || "").trim().slice(0, 60);
    if (!name) return res.status(400).json({ code: "invalid", message: "Enter a name." });
    await store.setDisplayName(req.user.id, name);
    res.json({ name });
  });
  // Everything we hold about the signed-in user, as one file.
  api.get("/export", async (req, res) => {
    const u = req.user, row = await store.getBoardRow(u.id);
    res.set("Content-Disposition", 'attachment; filename="superday-prep-data.json"').json({
      exportedAt: new Date().toISOString(),
      account: { id: u.id, email: u.email, name: u.display_name || "", plan: u.plan, createdAt: u.created_at },
      savedProgress: await store.allDocs(u.id),
      leaderboard: row ? { club: row.club_code, ...row.data } : null,
      aiUsage: await store.aiSummary(u.id),
    });
  });
  // Permanently deletes the account and everything saved under it, and stops any subscription.
  api.delete("/me", async (req, res) => {
    if (req.body?.confirm !== "DELETE") return res.status(400).json({ code: "invalid", message: 'Type DELETE to confirm.' });
    const u = req.user;
    if (billing && u.stripe_customer_id) {
      try { await billing.cancelSubscriptions(u.stripe_customer_id); }
      catch (e) { console.error("cancel on delete", e?.message); return res.status(502).json({ code: "billing_error", message: "We couldn't cancel your subscription, so nothing was deleted. Try again, or cancel it under Manage billing first." }); }
    }
    await store.deleteUser(u.id);
    let signInRemoved = false;
    try { signInRemoved = await removeAuthUser(u.id); } catch (e) { console.error("auth delete", e?.message); }
    res.json({ deleted: true, signInRemoved });
  });

  /* ---- questions: the core set on Free, the whole bank on Pro ---- */
  api.get("/questions", (req, res) => {
    res.set("Cache-Control", "private, no-store").json({ questions: isPro(req.user) ? BANK : CORE_BANK, total: BANK.length });
  });

  /* ---- private saved progress ---- */
  api.get("/docs/:doc", async (req, res) => {
    if (!DOCS.has(req.params.doc)) return res.status(404).json({ code: "not_found" });
    res.json(await store.getDoc(req.user.id, req.params.doc));
  });
  api.put("/docs/:doc", async (req, res) => {
    if (!DOCS.has(req.params.doc)) return res.status(404).json({ code: "not_found" });
    const data = req.body?.data, base = Number(req.body?.baseVersion) || 0;
    if (!data || typeof data !== "object" || Array.isArray(data)) return res.status(400).json({ code: "invalid" });
    try { res.json({ version: await store.putDoc(req.user.id, req.params.doc, data, base) }); }
    catch (e) {
      if (e instanceof ConflictError) return res.status(409).json({ code: "conflict", message: "Your progress was changed on another device." });
      throw e;
    }
  });

  /* ---- leaderboard: anyone signed in can read a club by code; each person writes only their own row ---- */
  api.get("/board", async (req, res) => {
    const code = String(req.query.club || "").toUpperCase();
    if (!CLUB_CODE.test(code)) return res.status(400).json({ code: "invalid", message: "That club code isn't valid." });
    res.json({ rows: await store.getBoard(code) });
  });
  api.put("/board", async (req, res) => {
    const b = req.body || {}, code = String(b.club || "").toUpperCase();
    if (!CLUB_CODE.test(code)) return res.status(400).json({ code: "invalid", message: "That club code isn't valid." });
    const row = { club: code, clubName: String(b.clubName || "").slice(0, 80), week: /^\d{4}-\d{2}-\d{2}$/.test(b.week) ? b.week : "", updated: Date.now() };
    for (const k of NUM_FIELDS) { const n = Number(b[k]); row[k] = Number.isFinite(n) ? Math.max(0, Math.min(n, 1e6)) : 0; }
    await store.createClubIfMissing(code, row.clubName, req.user.id);
    await store.putBoard(req.user.id, code, row);
    res.status(204).end();
  });
  api.delete("/board/:id", async (req, res) => {
    const target = req.params.id, row = await store.getBoardRow(target);
    if (!row) return res.status(204).end();
    const club = await store.getClub(row.club_code);
    const allowed = target === req.user.id || req.user.isAdmin || club?.owner_id === req.user.id;
    if (!allowed) return res.status(403).json({ code: "forbidden", message: "You can only remove your own row." });
    await store.deleteBoard(target);
    res.status(204).end();
  });
  api.post("/profiles", async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((x) => typeof x === "string").slice(0, 100) : [];
    res.json(await store.boardNames(ids));
  });

  /* ---- AI: a named feature plus its fields. Checked against the plan, limited, and logged with its cost ---- */
  const bursts = new Map();
  api.post("/ai", async (req, res) => {
    const name = String(req.body?.feature || ""), feature = Object.hasOwn(FEATURES, name) ? FEATURES[name] : null;
    if (!feature) return res.status(400).json({ code: "invalid", message: "Unknown AI feature." });
    if (feature.pro && !isPro(req.user)) return res.status(403).json({ code: "pro_required", message: "This feature is part of Pro." });
    let prompt;
    try { prompt = feature.build(req.body?.params && typeof req.body.params === "object" ? req.body.params : {}); }
    catch (e) {
      if (e instanceof InputError) return res.status(400).json({ code: "invalid", message: e.message });
      throw e;
    }
    const now = Date.now(), recent = (bursts.get(req.user.id) || []).filter((t) => now - t < 60000);
    if (recent.length >= 20) return res.status(429).json({ code: "rate_limited", message: "Too many requests at once. Wait a minute and try again." });
    recent.push(now); bursts.set(req.user.id, recent);
    const allowance = await aiAllowance(store, req.user, limits);
    if (allowance.remaining <= 0) {
      return res.status(402).json({ code: "quota_exhausted", message: isPro(req.user) ? "You've reached today's AI limit. It resets at midnight UTC." : "You've used this week's free AI credits.", ai: allowance });
    }
    try {
      const out = await ai.complete({ prompt, tier: feature.tier });
      await store.recordAiCall(req.user.id, { feature: name, model: out.model, inputTokens: out.inputTokens, outputTokens: out.outputTokens, cost: costUsd(out.model, out.inputTokens, out.outputTokens) });
      let data;
      if (feature.json) {
        const parsed = parseJSON(out.text);
        if (!parsed) return res.status(502).json({ code: "ai_error", message: "The AI's answer came back in the wrong format. Try again.", remaining: allowance.remaining - 1 });
        data = feature.clean(parsed);
      } else data = feature.clean(out.text);
      res.json({ data, remaining: allowance.remaining - 1 });
    } catch (e) {
      if (e instanceof RefusalError) return res.status(422).json({ code: "refused", message: e.message });
      console.error("ai", name, e?.status || "", e?.message);
      res.status(502).json({ code: "ai_error", message: "The AI didn't respond. Try again in a moment." });
    }
  });

  /* ---- billing ---- */
  api.post("/billing/checkout", async (req, res) => {
    if (!billing) return res.status(503).json({ code: "billing_off", message: "Payments aren't set up yet." });
    if (isPro(req.user)) return res.status(400).json({ code: "already_pro", message: "You're already on Pro." });
    res.json({ url: await billing.checkoutUrl(req.user) });
  });
  api.post("/billing/portal", async (req, res) => {
    if (!billing || !req.user.stripe_customer_id) return res.status(400).json({ code: "no_customer", message: "There's no subscription to manage yet." });
    res.json({ url: await billing.portalUrl(req.user) });
  });

  /* ---- founder dashboard: totals only, never anyone's private data ---- */
  api.get("/admin/stats", async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ code: "forbidden", message: "Admins only." });
    res.json(await store.stats());
  });

  app.use("/api", api);

  // The app's section files are joined, in this order, into one script. They share one scope and must run together.
  const APP_FILES = ["core", "drill", "mock", "network", "superday", "firms", "timeline", "story", "peer", "club", "hq", "dashboard", "main"];
  const buildApp = () => APP_FILES.map((f) => fs.readFileSync(new URL(`./public/app/${f}.js`, import.meta.url), "utf8")).join("\n");
  let appBundle = buildApp();
  app.get("/app.js", (req, res) => {
    if (env.NODE_ENV !== "production") appBundle = buildApp(); // pick up edits without a restart during development
    res.type("application/javascript").send(appBundle);
  });
  app.use("/app", (req, res) => res.status(404).end()); // the pieces aren't served on their own
  app.use(express.static(publicDir, { extensions: ["html"] }));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ code: "server_error", message: "Something went wrong on our side." });
  });
  return app;
}

async function makePool(url) {
  if (url === "pgmem") {
    // In-memory Postgres for local development. Data disappears when the server stops.
    const { newDb } = await import("pg-mem");
    const { Pool } = newDb().adapters.createPg();
    return new Pool();
  }
  return new pg.Pool({ connectionString: url, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false } });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = process.env;
  if (!env.DATABASE_URL) { console.error("Set DATABASE_URL (see .env.example)."); process.exit(1); }
  const store = createStore(await makePool(env.DATABASE_URL), { rowLevelSecurity: env.DATABASE_URL !== "pgmem" });
  await store.migrate();
  const app = createApp({ store, verifyToken: createVerifier(env), ai: createAI(env), billing: createBilling(env), env });
  const port = Number(env.PORT || 3000);
  app.listen(port, () => console.log(`Superday Prep running on http://localhost:${port}`));
}
