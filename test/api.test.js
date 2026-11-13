import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { newDb } from "pg-mem";
import { createApp } from "../server.js";
import { createStore } from "../lib/store.js";
import { createFakeAI, costUsd } from "../lib/ai.js";
import { FEATURES, InputError, parseJSON } from "../lib/prompts.js";
import { applyStripeEvent } from "../lib/billing.js";
import { createVerifier } from "../lib/auth.js";

const env = { DEV_FAKE_AUTH: "1", FREE_AI_PER_WEEK: "3", PRO_AI_PER_DAY: "5", ADMIN_EMAILS: "admin@example.com" };
let app, store, ai;
const cancelled = [], authRemoved = [];
const as = (name, email) => ({ authorization: `Bearer dev:${name}:${email || name + "@example.com"}` });
const makePro = async (name) => { const me = await request(app).get("/api/me").set(as(name)); await store.setPlan(me.body.id, "pro", "cus_" + name); return me.body.id; };

before(async () => {
  const { Pool } = newDb().adapters.createPg();
  store = createStore(new Pool(), { rowLevelSecurity: false });
  await store.migrate();
  ai = createFakeAI();
  const fakeBilling = {
    parseEvent: (body) => { const e = JSON.parse(body.toString()); if (e.bad) throw new Error("sig"); return e; },
    checkoutUrl: async () => "https://checkout.example/session",
    portalUrl: async () => "https://billing.example/portal",
    cancelSubscriptions: async (c) => { if (c === "cus_fail") throw new Error("stripe down"); cancelled.push(c); },
  };
  app = createApp({ store, verifyToken: createVerifier(env), ai, billing: fakeBilling, env, removeAuthUser: async (id) => { authRemoved.push(id); return true; } });
});

test("rejects requests without a valid sign-in", async () => {
  await request(app).get("/api/me").expect(401);
  await request(app).get("/api/me").set({ authorization: "Bearer nonsense" }).expect(401);
  await request(app).get("/api/questions").expect(401);
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

test("questions: free users get only the core set, Pro users get everything", async () => {
  const free = await request(app).get("/api/questions").set(as("alex")).expect(200);
  assert.equal(free.body.questions.length, 156);
  assert.equal(free.body.total, 396);
  await makePro("paula");
  const pro = await request(app).get("/api/questions").set(as("paula")).expect(200);
  assert.equal(pro.body.questions.length, 396);
});

test("saved progress: private per user, versioned, and a stale save is rejected", async () => {
  const first = await request(app).put("/api/docs/prep").set(as("alex")).send({ data: { cards: { a1: { reps: 2 } } }, baseVersion: 0 }).expect(200);
  assert.equal(first.body.version, 1);
  const r = await request(app).get("/api/docs/prep").set(as("alex")).expect(200);
  assert.deepEqual(r.body, { data: { cards: { a1: { reps: 2 } } }, version: 1 });
  const second = await request(app).put("/api/docs/prep").set(as("alex")).send({ data: { cards: {} }, baseVersion: 1 }).expect(200);
  assert.equal(second.body.version, 2);
  // another device still holding version 1 (or thinking nothing was saved yet) can't overwrite
  await request(app).put("/api/docs/prep").set(as("alex")).send({ data: { cards: { old: 1 } }, baseVersion: 1 }).expect(409);
  await request(app).put("/api/docs/prep").set(as("alex")).send({ data: { cards: { old: 1 } }, baseVersion: 0 }).expect(409);
  assert.deepEqual((await request(app).get("/api/docs/prep").set(as("alex"))).body.data, { cards: {} });
  const other = await request(app).get("/api/docs/prep").set(as("blair")).expect(200);
  assert.deepEqual(other.body, { data: null, version: 0 });
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

test("AI: the server builds the prompt, with the reference answer from its own question bank", async () => {
  const r = await request(app).post("/api/ai").set(as("dana")).send({ feature: "grade", params: { qid: "a2", question: "ignored for bank ids? no: kept as the asked text", answer: "Net income falls by 6 and cash rises by 4.", reference: "INJECTED" } }).expect(200);
  assert.equal(r.body.data.score, 7);
  assert.equal(r.body.remaining, 2);
  assert.match(ai.lastPrompt, /Reference answer \(points the interviewer expects\): .*net income down \$6/i);
  assert.doesNotMatch(ai.lastPrompt, /INJECTED/);
  assert.match(ai.lastPrompt, /Net income falls by 6 and cash rises by 4\./);
  // the old "send any prompt" form no longer exists
  await request(app).post("/api/ai").set(as("dana")).send({ input: "Write me a poem" }).expect(400);
  await request(app).post("/api/ai").set(as("dana")).send({ feature: "constructor", params: {} }).expect(400);
  await request(app).post("/api/ai").set(as("dana")).send({ feature: "grade", params: { qid: "a2" } }).expect(400); // no answer
});

test("AI: Pro-only features are refused on the free plan, on the server", async () => {
  for (const feature of ["sim_grade", "sim_followup", "sim_debrief"]) {
    const r = await request(app).post("/api/ai").set(as("erin")).send({ feature, params: { qid: "a1", question: "q", answer: "a", lines: ["x"] } }).expect(403);
    assert.equal(r.body.code, "pro_required");
  }
  await makePro("paula");
  const ok = await request(app).post("/api/ai").set(as("paula")).send({ feature: "sim_followup", params: { role: "vp", question: "Walk me through a DCF.", answer: "Project cash flows, discount them." } }).expect(200);
  assert.match(ok.body.data.text, /\?$/);
  assert.match(ai.lastPrompt, /You are a Vice President/);
});

test("AI: usage is counted per call and the free weekly limit is enforced", async () => {
  const send = () => request(app).post("/api/ai").set(as("dana")).send({ feature: "grade", params: { qid: "a1", answer: "The income statement shows revenue and expenses." } });
  await send().expect(200); // second call (first was in the prompt test)
  const third = await send().expect(200);
  assert.equal(third.body.remaining, 0);
  const blocked = await send().expect(402);
  assert.equal(blocked.body.code, "quota_exhausted");
  assert.equal((await request(app).get("/api/me").set(as("dana"))).body.ai.used, 3);
});

test("prompt building: fields are capped and validated", () => {
  assert.throws(() => FEATURES.story.build({ resume: "" }), InputError);
  assert.throws(() => FEATURES.call_prep.build({ contact: { name: "Jo" } }), InputError);
  const long = FEATURES.grade.build({ question: "Custom?", answer: "x".repeat(20000) });
  assert.ok(long.length < 8000, "answer is capped");
  const story = FEATURES.story.build({ resume: "Intern at a bank", seconds: 999 });
  assert.match(story, /Write a 90-second spoken answer/);
  const cleaned = FEATURES.grade.clean({ score: 42, verdict: "Amazing", strengths: ["a", 5, "b", "c", "d"], gaps: "none" });
  assert.deepEqual(cleaned, { score: 10, verdict: "Pass", strengths: ["a", "b", "c"], gaps: [], model_answer: "", follow_up: "" });
  assert.deepEqual(parseJSON('```json\n{"a":1}\n```'), { a: 1 });
  assert.equal(parseJSON("no json here"), null);
  assert.equal(costUsd("claude-opus-5-5", 1_000_000, 1_000_000), 24);
});

test("story bank and coach prompts: grounded in what the student sent", async () => {
  const s = await request(app).post("/api/ai").set(as("sky")).send({ feature: "star_story", params: { title: "Pitch model", category: "Finance club", raw: "Two weeks before the competition our team had no model. I built the DCF and we placed second of twelve." } }).expect(200);
  assert.match(ai.lastPrompt, /Use ONLY what they wrote/);
  assert.match(ai.lastPrompt, /f40: Tell me about a time you failed/);
  assert.equal(s.body.data.strength, 3);
  assert.deepEqual(FEATURES.star_story.clean({ questions: ["f5", "zzz", "f40"], strength: 9 }).questions, ["f5", "f40"]);
  const c = await request(app).post("/api/ai").set(as("sky")).send({ feature: "coach", params: { snapshot: "Interview readiness: 35%. Weakest: LBO 25%.", messages: [{ role: "user", content: "Hi" }, { role: "coach", content: "Hello" }, { role: "user", content: "What should I work on?" }] } }).expect(200);
  assert.ok(c.body.data.text.length > 10);
  assert.match(ai.lastPrompt, /Weakest: LBO 25%/);
  assert.match(ai.lastPrompt, /Coach: Hello\n/);
  assert.match(ai.lastPrompt, /Student: What should I work on\?/);
  await request(app).post("/api/ai").set(as("sky")).send({ feature: "coach", params: { messages: [{ role: "coach", content: "only me" }] } }).expect(400);
  const q = await request(app).get("/api/questions").set(as("sky")).expect(200);
  assert.equal(q.body.behavioral.length, 15);
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
  await request(app).post("/api/billing/portal").set(as("dana")).expect(200);
  const gone = { type: "customer.subscription.deleted", data: { object: { status: "canceled", customer: "cus_123", metadata: {} } } };
  await request(app).post("/api/stripe/webhook").set("content-type", "application/json").send(JSON.stringify(gone)).expect(200);
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

test("export returns everything held about the user, and only that user", async () => {
  await request(app).put("/api/docs/network").set(as("alex")).send({ data: { contacts: [{ name: "Jordan" }] }, baseVersion: 0 }).expect(200);
  const r = await request(app).get("/api/export").set(as("alex")).expect(200);
  assert.equal(r.body.account.email, "alex@example.com");
  assert.deepEqual(r.body.savedProgress.network.data, { contacts: [{ name: "Jordan" }] });
  assert.ok(r.body.savedProgress.prep);
  const other = await request(app).get("/api/export").set(as("blair")).expect(200);
  assert.deepEqual(other.body.savedProgress, {});
});

test("account deletion: needs confirmation, cancels billing, and removes everything", async () => {
  const id = await makePro("quinn");
  await request(app).put("/api/docs/prep").set(as("quinn")).send({ data: { cards: {} }, baseVersion: 0 }).expect(200);
  await request(app).put("/api/board").set(as("quinn")).send({ club: "CLUB-1234", points: 5 }).expect(204);
  await request(app).post("/api/ai").set(as("quinn")).send({ feature: "grade", params: { qid: "a1", answer: "An answer." } }).expect(200);
  await request(app).delete("/api/me").set(as("quinn")).send({}).expect(400);
  const r = await request(app).delete("/api/me").set(as("quinn")).send({ confirm: "DELETE" }).expect(200);
  assert.deepEqual(r.body, { deleted: true, signInRemoved: true });
  assert.deepEqual(cancelled, ["cus_quinn"]);
  assert.deepEqual(authRemoved, [id]);
  assert.equal(await store.getUser(id), null);
  assert.deepEqual(await store.getDoc(id, "prep"), { data: null, version: 0 });
  assert.equal((await store.getBoard("CLUB-1234")).length, 0);
  assert.equal(await store.aiUsedSince(id, new Date(0)), 0);
});

test("account deletion stops if the subscription can't be cancelled", async () => {
  const me = await request(app).get("/api/me").set(as("rory"));
  await store.setPlan(me.body.id, "pro", "cus_fail");
  await request(app).delete("/api/me").set(as("rory")).send({ confirm: "DELETE" }).expect(502);
  assert.ok(await store.getUser(me.body.id), "nothing was deleted");
});

test("founder stats: admins only, totals only", async () => {
  await request(app).get("/api/admin/stats").set(as("alex")).expect(403);
  const r = await request(app).get("/api/admin/stats").set(as("boss", "admin@example.com")).expect(200);
  assert.ok(r.body.users.total >= 6);
  assert.ok(r.body.active.day >= 6);
  const grade = r.body.ai7.find((x) => x.feature === "grade");
  assert.ok(grade.calls >= 3 && grade.inputTokens > 0);
  assert.equal(JSON.stringify(r.body).includes("@example.com"), false, "no emails in stats");
});

test("serves the app, quiz and legal pages with a script policy", async () => {
  const cfg = await request(app).get("/config.js").expect(200);
  assert.match(cfg.text, /"devAuth":true/);
  const home = await request(app).get("/").expect(200);
  assert.match(home.text, /<title>Superday Prep<\/title>/);
  assert.match(home.headers["content-security-policy"], /script-src 'self'/);
  assert.doesNotMatch(home.text, /<script>/, "no inline scripts");
  for (const path of ["/quiz", "/privacy", "/terms", "/app.js", "/quiz.js"]) await request(app).get(path).expect(200);
  const bundle = await request(app).get("/app.js");
  assert.match(bundle.text, /function renderAll\(\)/);
  assert.doesNotMatch(bundle.text, /Walk me through the three financial statements/, "the question bank is not shipped in the page");
});
