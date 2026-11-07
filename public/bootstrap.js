/* Superday Prep bootstrap: signs the user in, connects the app to the server, then loads the app.
   The app was first built for a platform that offered window.claude.use("db" | "user" | "sample").
   This file provides the same interface backed by this app's own API, so the app code runs unchanged. */
(function () {
  const C = window.__CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const DEV_KEY = "superday-dev-token";
  let sb = null;

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  async function token() {
    if (C.devAuth) { try { const t = localStorage.getItem(DEV_KEY); if (t) return t; } catch (e) {} }
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session ? data.session.access_token : null;
  }
  async function api(path, opts = {}) {
    const t = await token();
    const r = await fetch(path, { ...opts, headers: { "content-type": "application/json", ...(opts.headers || {}), ...(t ? { authorization: "Bearer " + t } : {}) } });
    if (r.status === 204) return null;
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (r.status === 401) showAuth("Your session ended. Sign in again.");
      throw Object.assign(new Error(body.message || r.statusText), { status: r.status, code: body.code || "error", body });
    }
    return body;
  }
  function toastMsg(m) { if (typeof window.toast === "function") window.toast(m); }

  /* ---------- sign-in ---------- */
  function showAuth(msg) {
    $("#appShell").hidden = true; $("#authScreen").hidden = false;
    if (msg) $("#authMsg").textContent = msg;
  }
  function wireAuth() {
    $("#authGoogle").hidden = !sb;
    $("#devForm").hidden = !C.devAuth;
    $("#authForm").hidden = !sb;
    if (!sb && !C.devAuth) $("#authMsg").textContent = "Sign-in isn't configured. Set SUPABASE_URL and SUPABASE_ANON_KEY on the server.";
    $("#authForm").onsubmit = async (e) => {
      e.preventDefault(); if (!sb) return;
      const email = $("#authEmail").value.trim(); $("#authSubmit").disabled = true;
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } });
      $("#authSubmit").disabled = false;
      $("#authMsg").textContent = error ? "We couldn't send the link: " + error.message : "Check your email for a sign-in link. You can close this tab.";
    };
    $("#authGoogle").onclick = () => sb && sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin } });
    $("#devForm").onsubmit = (e) => {
      e.preventDefault(); const n = $("#devName").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (!n) return; try { localStorage.setItem(DEV_KEY, `dev:${n}:${n}@example.com`); } catch (err) {} location.reload();
    };
  }

  /* ---------- account bar and upgrade dialog ---------- */
  let ME = null;
  function renderAcct() {
    const a = $("#acct"); if (!a || !ME) return;
    const credits = ME.ai ? `${ME.ai.remaining} AI credit${ME.ai.remaining === 1 ? "" : "s"} left ${ME.ai.period === "day" ? "today" : "this week"}` : "";
    a.innerHTML = `<button class="linkbtn who" id="acctName" title="Change your display name">${escapeHtml(ME.name || ME.email)}</button>
      <span class="planchip ${ME.pro ? "pro" : ""}">${ME.pro ? "Pro" : "Free"}</span>
      <span class="hint" id="acctCredits">${credits}</span>
      ${ME.pro ? (ME.canManageBilling ? '<button class="linkbtn" id="acctBilling">Manage billing</button>' : "") : (C.billing ? '<button class="linkbtn" id="acctUpgrade">Upgrade</button>' : "")}
      <button class="linkbtn" id="acctOut">Sign out</button>`;
    $("#acctName").onclick = async () => {
      const n = (window.prompt("Your name on club leaderboards", ME.name || "") || "").trim();
      if (!n) return;
      try { await api("/api/me", { method: "PATCH", body: JSON.stringify({ name: n }) }); ME.name = n; renderAcct(); toastMsg("Name updated"); } catch (e) { toastMsg(e.message); }
    };
    const up = $("#acctUpgrade"); if (up) up.onclick = () => openPaywall("menu");
    const bill = $("#acctBilling"); if (bill) bill.onclick = async () => { try { location.href = (await api("/api/billing/portal", { method: "POST" })).url; } catch (e) { toastMsg(e.message); } };
    $("#acctOut").onclick = async () => { try { localStorage.removeItem(DEV_KEY); } catch (e) {} if (sb) await sb.auth.signOut(); location.reload(); };
  }
  function escapeHtml(s) { return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  const WHY = {
    full: "The full set adds 240 more questions, including the harder technicals bulge bracket banks ask.",
    sim: "Superday simulations run back-to-back interviews with an associate, a VP and an MD, with follow-ups and a full scorecard.",
    ai: "You've used this week's free AI credits. Pro gives you daily AI practice.",
    menu: "Everything you need for recruiting season.",
  };
  function openPaywall(reason) {
    if (ME && ME.pro && reason === "ai") { toastMsg("You've reached today's AI limit. It resets at midnight UTC."); return; }
    $("#payWhy").textContent = WHY[reason] || WHY.menu;
    $("#payPrice").textContent = C.priceLabel || "";
    $("#payGo").disabled = !C.billing;
    $("#payGo").textContent = C.billing ? "Upgrade" : "Payments aren't set up yet";
    $("#paywall").showModal();
  }
  window.openPaywall = openPaywall;
  $("#payClose").onclick = () => $("#paywall").close();
  $("#payGo").onclick = async () => {
    $("#payGo").disabled = true;
    try { location.href = (await api("/api/billing/checkout", { method: "POST" })).url; }
    catch (e) { $("#payGo").disabled = false; $("#payWhy").textContent = e.message; }
  };

  /* ---------- the window.claude interface, backed by this server ---------- */
  function parseJSON(text) {
    const t = String(text || "").replace(/^\s*```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    try { return JSON.parse(t); } catch (e) {}
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1));
    throw { code: "bad_json", message: "The AI's answer wasn't in the expected format." };
  }
  async function sample(input, opts = {}) {
    try {
      const r = await api("/api/ai", { method: "POST", body: JSON.stringify({ input, tier: opts.modelTier === "quick" ? "quick" : "default" }), signal: opts.signal });
      if (ME && ME.ai && typeof r.remaining === "number") { ME.ai.remaining = r.remaining; const el = $("#acctCredits"); if (el) el.textContent = `${r.remaining} AI credit${r.remaining === 1 ? "" : "s"} left ${ME.ai.period === "day" ? "today" : "this week"}`; }
      if (opts.onText) opts.onText({ text: r.text, delta: r.text });
      return { text: r.text, truncated: !!r.truncated };
    } catch (e) {
      if (e && e.code === "quota_exhausted") openPaywall("ai");
      throw { code: (e && e.code) || "error", message: (e && e.message) || "AI request failed" };
    }
  }
  sample.json = async (input, opts) => parseJSON((await sample(input, opts)).text);
  sample.limits = async () => ({ images: false });

  // Leaderboard polling: refresh every 20 seconds while visible, and right after this user writes.
  const refreshers = new Set();
  const refreshAll = () => refreshers.forEach((f) => f());
  function docRef(path) {
    const parts = path.split("/");
    if (parts[0] === "data" && parts[1] === "users") {
      const doc = parts[3];
      return {
        get: async () => { const r = await api("/api/docs/" + doc); return { id: doc, exists: !!r.data, data: () => r.data || undefined }; },
        set: async (data) => { await api("/api/docs/" + doc, { method: "PUT", body: JSON.stringify({ data }) }); },
      };
    }
    if (parts[0] === "board") {
      const id = parts[1];
      return {
        set: async (data) => { await api("/api/board", { method: "PUT", body: JSON.stringify(data) }); refreshAll(); },
        delete: async () => { await api("/api/board/" + encodeURIComponent(id), { method: "DELETE" }); refreshAll(); },
      };
    }
    throw new Error("Unsupported path: " + path);
  }
  const db = {
    doc: (path) => docRef(path),
    collection(path) {
      return {
        doc: (id) => docRef(path + "/" + id),
        where(field, op, value) {
          return {
            onSnapshot(next, onError) {
              let stopped = false, loaded = false;
              const tick = async () => {
                if (stopped) return;
                try {
                  const r = await api("/api/board?club=" + encodeURIComponent(value));
                  if (stopped) return; loaded = true;
                  next({ docs: r.rows.map((x) => ({ id: x.id, exists: true, data: () => x })), size: r.rows.length, empty: !r.rows.length, docChanges: () => [] });
                } catch (e) { if (!loaded && !stopped && onError) onError(e); }
              };
              refreshers.add(tick); tick();
              const iv = setInterval(() => { if (document.visibilityState === "visible") tick(); }, 20000);
              return () => { stopped = true; clearInterval(iv); refreshers.delete(tick); };
            },
          };
        },
      };
    },
  };
  const user = {
    id: async () => ME.id,
    me: async () => ({ id: ME.id, name: ME.name || "" }),
    isOwner: async () => !!ME.isAdmin,
    canEdit: async () => true,
    can: async () => true,
    profiles: async (ids) => api("/api/profiles", { method: "POST", body: JSON.stringify({ ids }) }),
  };

  /* ---------- start ---------- */
  async function start() {
    if (C.supabaseUrl && C.supabaseAnonKey) {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js");
        sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey);
        sb.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") showAuth(); });
      } catch (e) { console.error("Supabase failed to load", e); }
    }
    wireAuth();
    if (!(await token())) { showAuth(); return; }
    try { ME = await api("/api/me"); } catch (e) { showAuth(e.status === 401 ? "" : "We couldn't reach the server. Reload to try again."); return; }
    window.__ME = ME;
    window.claude = { use: async (name) => ({ sample, db, user }[name] || null) };
    $("#authScreen").hidden = true; $("#appShell").hidden = false;
    renderAcct();
    await loadScript("/app.js");
    if (new URLSearchParams(location.search).has("upgraded")) {
      history.replaceState(null, "", location.pathname + location.hash);
      // The Stripe webhook can take a few seconds; check a few times.
      for (let i = 0; i < 6 && !ME.pro; i++) { await new Promise((r) => setTimeout(r, 2000)); try { ME = window.__ME = await api("/api/me"); } catch (e) {} }
      renderAcct();
      if (ME.pro) { toastMsg("Welcome to Pro"); if (typeof window.renderAll === "function") window.renderAll(); }
    }
  }
  start();
})();
