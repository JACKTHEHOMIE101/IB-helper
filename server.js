// Superday Prep server: serves the app and its API (account, saved progress, leaderboard, AI, billing).
import "dotenv/config";
import express from "express";
import pg from "pg";
import { fileURLToPath } from "node:url";
import { createStore } from "./lib/store.js";
import { createVerifier } from "./lib/auth.js";
import { createAI, normalizeInput, RefusalError } from "./lib/ai.js";
import { createBilling, applyStripeEvent } from "./lib/billing.js";
import { planLimits, aiAllowance, isPro } from "./lib/plans.js";

const DOCS = new Set(["prep", "network"]);
const CLUB_CODE = /^[A-Z0-9-]{4,24}$/;
const NUM_FIELDS = ["reviews", "sims", "peers", "calls", "points", "readiness", "learned", "streak", "bestSim"];

export function createApp({ store, verifyToken, ai, billing, env = process.env }) {
  const app = express();
  const limits = planLimits(env);
  const admins = new Set((env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  const publicDir = fileURLToPath(new URL("./public/", import.meta.url));

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "DENY" });
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
      devAuth: env.DEV_FAKE_AUTH === "1" && env.NODE_ENV !== "production",
      billing: !!billing,
    };
    res.type("application/javascript").set("Cache-Control", "no-store").send(`window.__CONFIG=${JSON.stringify(cfg)};`);
  });

  // Everything else under /api requires a signed-in user.
  const api = express.Router();
  api.use(async (req, res, next) => {
    try {
      const token = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
      const who = await verifyToken(token);
      if (!who) return res.status(401).json({ code: "unauthenticated", message: "Please sign in again." });
      const user = await store.ensureUser(who);
      user.isAdmin = admins.has((user.email || "").toLowerCase());
      req.user = user;
      next();
    } catch (e) { next(e); }
  });

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

  api.get("/docs/:doc", async (req, res) => {
    if (!DOCS.has(req.params.doc)) return res.status(404).json({ code: "not_found" });
    res.json({ data: await store.getDoc(req.user.id, req.params.doc) });
  });
  api.put("/docs/:doc", async (req, res) => {
    if (!DOCS.has(req.params.doc)) return res.status(404).json({ code: "not_found" });
    const data = req.body?.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return res.status(400).json({ code: "invalid" });
    await store.putDoc(req.user.id, req.params.doc, data);
    res.status(204).end();
  });

  // Leaderboard. Anyone signed in can read a club's board by code; each person writes only their own row.
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

  // AI, limited by plan, plus a short burst limit per user.
  const bursts = new Map();
  api.post("/ai", async (req, res) => {
    const messages = normalizeInput(req.body?.input);
    if (!messages) return res.status(400).json({ code: "invalid", message: "That request is too long or malformed." });
    const now = Date.now(), recent = (bursts.get(req.user.id) || []).filter((t) => now - t < 60000);
    if (recent.length >= 20) return res.status(429).json({ code: "rate_limited", message: "Too many requests at once. Wait a minute and try again." });
    recent.push(now); bursts.set(req.user.id, recent);
    const allowance = await aiAllowance(store, req.user, limits);
    if (allowance.remaining <= 0) {
      return res.status(402).json({ code: "quota_exhausted", message: isPro(req.user) ? "You've reached today's AI limit. It resets at midnight UTC." : "You've used this week's free AI credits.", ai: allowance });
    }
    try {
      const out = await ai.complete({ messages, tier: req.body?.tier === "quick" ? "quick" : "default" });
      await store.aiIncrement(req.user.id);
      res.json({ ...out, remaining: allowance.remaining - 1 });
    } catch (e) {
      if (e instanceof RefusalError) return res.status(422).json({ code: "refused", message: e.message });
      console.error("ai", e?.status || "", e?.message);
      res.status(502).json({ code: "ai_error", message: "The AI didn't respond. Try again in a moment." });
    }
  });

  api.post("/billing/checkout", async (req, res) => {
    if (!billing) return res.status(503).json({ code: "billing_off", message: "Payments aren't set up yet." });
    if (isPro(req.user)) return res.status(400).json({ code: "already_pro", message: "You're already on Pro." });
    res.json({ url: await billing.checkoutUrl(req.user) });
  });
  api.post("/billing/portal", async (req, res) => {
    if (!billing || !req.user.stripe_customer_id) return res.status(400).json({ code: "no_customer", message: "There's no subscription to manage yet." });
    res.json({ url: await billing.portalUrl(req.user) });
  });

  app.use("/api", api);
  app.get("/quiz", (req, res) => res.sendFile("quiz.html", { root: publicDir }));
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
  return new pg.Pool({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = process.env;
  if (!env.DATABASE_URL) { console.error("Set DATABASE_URL (see .env.example)."); process.exit(1); }
  const store = createStore(await makePool(env.DATABASE_URL));
  await store.migrate();
  const app = createApp({ store, verifyToken: createVerifier(env), ai: createAI(env), billing: createBilling(env), env });
  const port = Number(env.PORT || 3000);
  app.listen(port, () => console.log(`Superday Prep running on http://localhost:${port}`));
}
