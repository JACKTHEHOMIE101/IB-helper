/* Superday Prep · Shared state, saving, helpers and routing.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Question bank (loaded from the server) ---------- */
const BANK = window.__BANK || [];           // sent by the server: the core set on Free, everything on Pro
const BANK_TOTAL = window.__BANK_TOTAL || BANK.length;
const CORE = new Set('a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12 a13 a15 a17 a20 a21 a23 a24 a29 a30 a32 a33 a35 a38 a40 a43 a44 e1 e2 e3 e4 e5 e6 e7 e8 e11 e12 e13 e15 e16 e17 e20 e24 e34 v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v14 v17 v18 v19 v20 v41 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d12 d13 d14 d17 d18 d19 d21 d22 d24 d27 d29 d30 d32 l1 l2 l3 l4 l5 l6 l7 l8 l9 l13 l14 l15 l17 l19 l21 l23 l24 l25 l34 l36 l43 m1 m2 m3 m4 m5 m6 m7 m8 m10 m12 m13 m15 m19 m21 m25 m29 m30 b1 b3 b5 b6 b10 b14 b15 b16 b17 b18 b24 b28 b48 b51 f1 f2 f3 f4 f5 f6 f7 f8 f9 f13 f14 f15 f16 f21 f23 f25 f32 f34 f38 f51'.split(" "));
const TOPICS = ["Accounting","Enterprise Value","Valuation","DCF","LBO","M&A","Brain Teasers","Fit"];
const STAGES = ["Identified","Emailed","Replied","Call set","Called","Thanked","Referred"];
const DAY = 864e5;

/* ---------- State and persistence ---------- */
const UID = (window.__ME && window.__ME.id) || "anon";
const LS = "superday-prep-v1:" + UID;
let S = {cards:{}, reviewLog:{}, contacts:[], settings:{}, mockHist:[], simHist:[], firms:{}};
function lsRead(){try{const r=localStorage.getItem(LS);if(r)Object.assign(S,JSON.parse(r));}catch(e){}}
function lsWrite(){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}}
lsRead();
let dbRefs=null, saveTimer=null, saving=false, pending=false;
const saveEl=document.getElementById("saveState");
function save(){
  lsWrite();
  try{pushStats();}catch(e){}
  if(!dbRefs) return;
  clearTimeout(saveTimer); saveTimer=setTimeout(flush,700);
}
async function flush(){
  if(!dbRefs) return;
  if(saving){pending=true;return;}
  saving=true; saveEl.textContent="Saving...";
  try{
    const savePrep=dbRefs.prep.set({cards:S.cards, reviewLog:S.reviewLog, newLog:S.newLog||{}, mockHist:S.mockHist.slice(0,40), simHist:(S.simHist||[]).slice(0,20), readyLog:S.readyLog||{}, peerHist:(S.peerHist||[]).slice(0,20), updated:Date.now()});
    const saveNet=dbRefs.net.set({contacts:S.contacts, settings:S.settings, firms:S.firms||{}, tlChecks:S.tlChecks||{}, story:S.story||{}, apps:S.apps||[], updated:Date.now()});
    // saved separately, so a conflict on one doesn't drop changes to the other
    if((await Promise.allSettled([savePrep,saveNet])).some(r=>r.status==="rejected"))throw new Error("save failed");
    saveEl.textContent="Saved to your account";
  }catch(e){saveEl.textContent="Saved in this browser (account save failed)";}
  saving=false; if(pending){pending=false;flush();}
}
(async()=>{
  if(!window.claude?.use) return;
  try{
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    const col=db.collection("data/users/"+id);
    const refs={prep:col.doc("prep"),net:col.doc("network")};
    const timeout=new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),10000));
    const [p,n]=await Promise.race([Promise.all([refs.prep.get(),refs.net.get()]),timeout]);
    const pd=p.data(), nd=n.data();
    if(pd){S.cards=pd.cards||{};S.reviewLog=pd.reviewLog||{};S.newLog=pd.newLog||{};S.mockHist=pd.mockHist||[];S.simHist=pd.simHist||[];S.readyLog=pd.readyLog||{};S.peerHist=pd.peerHist||[];}
    if(nd){S.contacts=nd.contacts||[];S.settings=nd.settings||{};S.firms=nd.firms||{};S.tlChecks=nd.tlChecks||{};S.story=nd.story||{};S.apps=nd.apps||[];}
    dbRefs=refs;
    if(!pd||!nd) flush(); else saveEl.textContent="Saved to your account";
    lsWrite(); renderAll(); maybeOnboard();
  }catch(e){}
})();

/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d;};
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0");};
const parseIso=s=>{if(!s)return null;const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(n)=>iso(new Date(today().getTime()+n*DAY));
const fmtInt=d=>d<1?"<10m":d<30?Math.round(d)+"d":d<365?Math.round(d/30)+"mo":(d/365).toFixed(1)+"y";
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2200);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast("Copied");}catch(e){const r=document.createRange();r.selectNodeContents($("#emOut"));const s=getSelection();s.removeAllRanges();s.addRange(r);toast("Selected. Press Ctrl/Cmd+C to copy");}}

/* ---------- Routing ---------- */
// Top-level sections and the pages inside each. A page's id is also its #link.
const SECTIONS=[
  {label:"Dashboard",views:[["dashboard","Dashboard"]]},
  {label:"Academy",views:[["drill","Technicals drill"]]},
  {label:"Interview Lab",views:[["superday","Superday simulation"],["mock","Mock interview"],["story","Your story"]]},
  {label:"Networking",views:[["network","Contacts"],["firms","Firm prep"]]},
  {label:"Recruiting HQ",views:[["apps","Applications"],["timeline","Timeline"]]},
  {label:"Community",views:[["club","Club leaderboard"]]},
];
const VIEWS=SECTIONS.flatMap(s=>s.views.map(v=>v[0]));
function route(){
  const v=VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):"dashboard";
  document.querySelectorAll("[data-panel]").forEach(p=>p.hidden=p.dataset.panel!==v);
  const sec=SECTIONS.find(s=>s.views.some(x=>x[0]===v));
  $("#mainNav").innerHTML=SECTIONS.map(s=>`<a href="#${s.views[0][0]}" ${s===sec?'aria-current="page"':""}>${s.label}</a>`).join("");
  const sub=$("#subNav"); sub.hidden=sec.views.length<2;
  sub.innerHTML=sec.views.map(([id,label])=>`<a href="#${id}" ${id===v?'aria-current="page"':""}>${label}</a>`).join("");
  return v;
}
addEventListener("hashchange",()=>{const v=route();if(v==="timeline")renderTimeline();if(v==="dashboard")renderDash();if(v==="apps")renderApps();scrollTo({top:0});});
