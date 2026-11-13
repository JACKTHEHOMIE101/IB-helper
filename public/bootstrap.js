/* Superday Prep bootstrap: signs the user in, connects the app to the server, then loads the app.
   The app (served as /app.js, built from the files in /app) expects window.claude.use("db" | "user" | "sample"), an interface from the platform the app
   was first built on. This file provides that interface backed by this app's own API. */
(function () {
  const C = window.__CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const DEV_KEY = "superday-dev-token";
  let sb = null, ME = null;

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Failed to load " + src)); document.head.appendChild(s); });
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
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  async function signOut() { try { localStorage.removeItem(DEV_KEY); } catch (e) {} if (sb) await sb.auth.signOut(); location.href = "/"; }

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

  /* ---------- account bar, account dialog, upgrade dialog ---------- */
  const creditsText = () => (ME.ai ? `${ME.ai.remaining} AI credit${ME.ai.remaining === 1 ? "" : "s"} left ${ME.ai.period === "day" ? "today" : "this week"}` : "");
  function renderAcct() {
    const a = $("#acct"); if (!a || !ME) return;
    a.innerHTML = `<span class="planchip ${ME.pro ? "pro" : ""}">${ME.pro ? "Pro" : "Free"}</span>
      <span class="hint" id="acctCredits">${creditsText()}</span>
      ${!ME.pro && C.billing ? '<button class="linkbtn" id="acctUpgrade">Upgrade</button>' : ""}
      ${ME.isAdmin ? '<button class="linkbtn" id="acctAdmin">Founder stats</button>' : ""}
      <button class="linkbtn who" id="acctOpen">${esc(ME.name || ME.email)}</button>`;
    const up = $("#acctUpgrade"); if (up) up.onclick = () => openPaywall("menu");
    const ad = $("#acctAdmin"); if (ad) ad.onclick = openAdmin;
    $("#acctOpen").onclick = openAccount;
  }
  function openAccount() {
    $("#adName").value = ME.name || ""; $("#adEmail").textContent = ME.email || "";
    $("#adPlan").textContent = (ME.pro ? "Pro" : "Free") + " plan · " + creditsText();
    $("#adBilling").hidden = !ME.canManageBilling; $("#adUpgrade").hidden = ME.pro || !C.billing;
    $("#adDeleteBox").hidden = true; $("#adDeleteConfirm").value = ""; $("#adMsg").textContent = "";
    $("#acctDlg").showModal();
  }
  async function setName(name) {
    await api("/api/me", { method: "PATCH", body: JSON.stringify({ name }) }); ME.name = name; renderAcct();
  }
  window.__setName = (n) => setName(n).catch(() => {});
  function wireAccount() {
    $("#adClose").onclick = () => $("#acctDlg").close();
    $("#adNameForm").onsubmit = async (e) => { e.preventDefault(); const n = $("#adName").value.trim(); if (!n) return;
      try { await setName(n); $("#adMsg").textContent = "Name saved."; } catch (err) { $("#adMsg").textContent = err.message; } };
    $("#adUpgrade").onclick = () => { $("#acctDlg").close(); openPaywall("menu"); };
    $("#adBilling").onclick = async () => { try { location.href = (await api("/api/billing/portal", { method: "POST" })).url; } catch (e) { $("#adMsg").textContent = e.message; } };
    $("#adSignOut").onclick = signOut;
    $("#adExport").onclick = async () => {
      try {
        const data = await api("/api/export");
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        const a = document.createElement("a"); a.href = url; a.download = "superday-prep-data.json"; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        $("#adMsg").textContent = "Your data file was downloaded.";
      } catch (e) { $("#adMsg").textContent = e.message; }
    };
    $("#adDelete").onclick = () => { $("#adDeleteBox").hidden = false; $("#adDeleteConfirm").focus(); };
    $("#adDeleteGo").onclick = async () => {
      if ($("#adDeleteConfirm").value.trim() !== "DELETE") { $("#adMsg").textContent = "Type DELETE in capitals to confirm."; return; }
      $("#adDeleteGo").disabled = true;
      try {
        await api("/api/me", { method: "DELETE", body: JSON.stringify({ confirm: "DELETE" }) });
        try { Object.keys(localStorage).filter((k) => k.startsWith("superday-")).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
        await signOut();
      } catch (e) { $("#adDeleteGo").disabled = false; $("#adMsg").textContent = e.message; }
    };
  }
  const WHY = {
    full: "The full set adds 240 more questions, including the harder technicals bulge bracket banks ask.",
    sim: "Superday simulations run back-to-back interviews with an associate, a VP and an MD, with follow-ups and a full scorecard.",
    ai: "You've used this week's free AI credits. Pro gives you daily AI practice.",
    menu: "Everything you need for recruiting season.",
  };
  function openPaywall(reason) {
    if (ME && ME.pro) { if (reason === "ai") toastMsg("You've reached today's AI limit. It resets at midnight UTC."); return; }
    $("#payWhy").textContent = WHY[reason] || WHY.menu;
    $("#payPrice").textContent = C.priceLabel || "";
    $("#payGo").disabled = !C.billing;
    $("#payGo").textContent = C.billing ? "Upgrade" : "Payments aren't set up yet";
    $("#paywall").showModal();
  }
  window.openPaywall = openPaywall;
  function wirePaywall() {
    $("#payClose").onclick = () => $("#paywall").close();
    $("#payGo").onclick = async () => {
      $("#payGo").disabled = true;
      try { location.href = (await api("/api/billing/checkout", { method: "POST" })).url; }
      catch (e) { $("#payGo").disabled = false; $("#payWhy").textContent = e.message; }
    };
  }

  /* ---------- founder stats (admins only; totals, never anyone's private data) ---------- */
  const FEATURE_NAMES = { grade: "Mock interview grading", sim_grade: "Superday answer grading", sim_followup: "Superday follow-ups", sim_debrief: "Superday debriefs", call_prep: "Call prep", why_firm: "Why-this-firm drafts", story: "Resume stories" };
  async function openAdmin() {
    const box = $("#adminBody"); box.innerHTML = '<p class="hint">Loading...</p>'; $("#adminDlg").showModal();
    try {
      const s = await api("/api/admin/stats");
      const money = (n) => "$" + Number(n || 0).toFixed(2);
      const aiTable = (rows) => rows.length ? `<div class="tablewrap"><table class="board"><thead><tr><th>Feature</th><th class="num">Calls</th><th class="num">Tokens in</th><th class="num">Tokens out</th><th class="num">Cost</th></tr></thead><tbody>${
        rows.map((r) => `<tr><td>${esc(FEATURE_NAMES[r.feature] || r.feature)}</td><td class="num">${r.calls}</td><td class="num">${r.inputTokens.toLocaleString()}</td><td class="num">${r.outputTokens.toLocaleString()}</td><td class="num">${money(r.cost)}</td></tr>`).join("")
      }<tr><td><b>Total</b></td><td class="num"><b>${rows.reduce((a, r) => a + r.calls, 0)}</b></td><td></td><td></td><td class="num"><b>${money(rows.reduce((a, r) => a + r.cost, 0))}</b></td></tr></tbody></table></div>` : '<p class="hint">No AI calls in this period.</p>';
      const tile = (n, l) => `<div><b>${n}</b><span>${l}</span></div>`;
      box.innerHTML = `<div class="stats">${tile(s.users.total, "Registered")}${tile(s.users.pro, "On Pro")}${tile(s.users.new7, "New in 7 days")}${tile(s.clubs, "Clubs")}</div>
        <div class="stats">${tile(s.active.day, "Active today")}${tile(s.active.week, "Active in 7 days")}${tile(s.active.month, "Active in 30 days")}${tile(s.users.total ? Math.round((s.users.pro / s.users.total) * 100) + "%" : "–", "Paying")}</div>
        <div class="stats" style="grid-template-columns:repeat(3,minmax(0,1fr))">${tile(s.study7.reviews, "Drill reviews, 7 days")}${tile(s.study7.simulations, "Simulations, 7 days")}${tile(s.study7.mockAnswers, "Mock answers, 7 days")}</div>
        <h3>AI cost, last 7 days</h3>${aiTable(s.ai7)}
        <h3>AI cost, last 30 days</h3>${aiTable(s.ai30)}
        <p class="hint">Costs are estimates from token counts and list prices. Check the Anthropic console for the bill. As of ${new Date(s.generatedAt).toLocaleString()}.</p>`;
    } catch (e) { box.innerHTML = `<p>${esc(e.message)}</p>`; }
  }

  /* ---------- the window.claude interface, backed by this server ---------- */
  // AI: the app names a feature and passes its fields; the server builds the prompt and returns cleaned-up data.
  const ai = {
    async run(feature, params, opts = {}) {
      try {
        const r = await api("/api/ai", { method: "POST", body: JSON.stringify({ feature, params }), signal: opts.signal });
        if (ME.ai && typeof r.remaining === "number") { ME.ai.remaining = r.remaining; const el = $("#acctCredits"); if (el) el.textContent = creditsText(); }
        return r.data;
      } catch (e) {
        if (e && e.code === "quota_exhausted") openPaywall("ai");
        if (e && e.code === "pro_required") openPaywall("sim");
        throw { code: (e && e.code) || "error", message: (e && e.message) || "AI request failed" };
      }
    },
  };

  // Saved progress, with a version check so an old copy on another device can't overwrite newer progress.
  const versions = {};
  let conflictShown = false;
  // Leaderboard polling: refresh every 20 seconds while visible, and right after this user writes.
  const refreshers = new Set();
  const refreshAll = () => refreshers.forEach((f) => f());
  function docRef(path) {
    const parts = path.split("/");
    if (parts[0] === "data" && parts[1] === "users") {
      const doc = parts[3];
      return {
        get: async () => { const r = await api("/api/docs/" + doc); versions[doc] = r.version || 0; return { id: doc, exists: !!r.data, data: () => r.data || undefined }; },
        set: async (data) => {
          try { const r = await api("/api/docs/" + doc, { method: "PUT", body: JSON.stringify({ data, baseVersion: versions[doc] || 0 }) }); versions[doc] = r.version; }
          catch (e) {
            if (e.code === "conflict" && !conflictShown) {
              conflictShown = true; toastMsg("Your progress changed on another device. Loading the latest...");
              try { Object.keys(localStorage).filter((k) => k.startsWith("superday-prep-v1:")).forEach((k) => localStorage.removeItem(k)); } catch (err) {}
              setTimeout(() => location.reload(), 1500);
            }
            throw e;
          }
        },
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
    wireAuth(); wireAccount(); wirePaywall();
    $("#adminClose").onclick = () => $("#adminDlg").close();
    if (!(await token())) { showAuth(); return; }
    let bank;
    try { ME = await api("/api/me"); bank = await api("/api/questions"); }
    catch (e) { showAuth(e.status === 401 ? "" : "We couldn't reach the server. Reload to try again."); return; }
    window.__ME = ME; window.__BANK = bank.questions; window.__BANK_TOTAL = bank.total;
    window.claude = { use: async (name) => ({ sample: ai, db, user }[name] || null) };
    $("#authScreen").hidden = true; $("#appShell").hidden = false;
    renderAcct();
    await loadScript("/app.js");
    if (new URLSearchParams(location.search).has("upgraded")) {
      history.replaceState(null, "", location.pathname + location.hash);
      // The Stripe webhook can take a few seconds; check a few times, then reload so the full question bank loads.
      for (let i = 0; i < 6 && !ME.pro; i++) { await new Promise((r) => setTimeout(r, 2000)); try { ME = window.__ME = await api("/api/me"); } catch (e) {} }
      if (ME.pro) { try { sessionStorage.setItem("superday-welcome-pro", "1"); } catch (e) {} location.reload(); }
      else toastMsg("Payment received. Pro will switch on within a minute; reload if it doesn't.");
    }
    try { if (sessionStorage.getItem("superday-welcome-pro")) { sessionStorage.removeItem("superday-welcome-pro"); toastMsg("Welcome to Pro"); } } catch (e) {}
  }
  start();
})();
