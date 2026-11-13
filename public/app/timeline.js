/* Superday Prep · Recruiting timeline.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Recruiting timeline ---------- */
// Phases are relative to graduation year G. Months are 0-based. The target is the internship the summer after junior year.
const PHASES=[
 {id:"fr",title:"Freshman year",tag:"Build the foundation",from:[-4,7],to:[-3,6],calls:"2–4",
  hiring:["Early insight programs"],
  goal:"Get on banks' radar and build a resume that survives a screen.",
  items:[
   {t:"Join your finance or investment club, and aim for a role by spring."},
   {t:"Take financial accounting (or learn it on your own) and keep your GPA at 3.5 or higher. Many banks screen on it."},
   {t:"Write a one-page resume in the standard banking format."},
   {t:"Apply to freshman and sophomore early insight or diversity programs. Deadlines are often in the winter."},
   {t:"Have 5–10 conversations with alumni in finance to learn how they got in.",go:"network",label:"Open networking"},
   {t:"Get a summer job. Work-ethic stories help with fit questions later."}]},
 {id:"sf",title:"Sophomore fall",tag:"Learn technicals, start networking for real",from:[-3,7],to:[-3,11],calls:"8–12",
  hiring:["Insight programs","A few early applications"],
  goal:"Be interview-ready by January.",
  warn:"At many large banks, applications for the internship the summer after junior year open in the winter of sophomore year. If you wait until spring to network, you'll miss them.",
  items:[
   {t:"Learn accounting, enterprise value and valuation. Drill the core set every day.",go:"drill",label:"Open drill"},
   {t:"Build a target list of 30–50 firms across bulge bracket, middle market and boutiques.",go:"firms",label:"Open firm prep"},
   {t:"Do 2–3 networking calls a week and log every one.",go:"network",label:"Open networking"},
   {t:"Finalize your resume and ask an alum in banking to review it."},
   {t:"Apply to sophomore insight and diversity programs. Some lead to fast-track interviews."},
   {t:"Start searching for a sophomore summer internship: a boutique, PE or VC firm, corporate finance or wealth management."}]},
 {id:"ss",title:"Sophomore spring",tag:"Bulge bracket and elite boutique recruiting",from:[-2,0],to:[-2,4],calls:"8–12",
  hiring:["Bulge bracket","Elite boutique","Some middle market"],
  goal:"Turn networking into interviews.",
  items:[
   {t:"Apply as soon as applications open. Many are reviewed on a rolling basis."},
   {t:"Expect online assessments and recorded video interviews before any live rounds."},
   {t:"Run a superday simulation every week once interviews start.",go:"superday",label:"Open superday sim"},
   {t:"Prepare a \"Why us?\" answer for every firm from your call notes.",go:"firms",label:"Open firm prep"},
   {t:"Keep networking. Ask contacts for a referral once you've built a relationship."},
   {t:"Lock in a sophomore summer internship. For non-target students it often decides junior fall."}]},
 {id:"su",title:"Sophomore summer",tag:"Get relevant experience",from:[-2,5],to:[-2,7],calls:"4–8",
  hiring:["Middle market opening","Regional banks opening"],
  goal:"Come out with real analytical work to talk about.",
  items:[
   {t:"Do your internship well, and ask for analytical work: models, comps, research."},
   {t:"Keep 1–2 networking calls a week, especially with middle-market and regional banks.",go:"network",label:"Open networking"},
   {t:"Keep technicals fresh with drill reviews a few times a week.",go:"drill",label:"Open drill"},
   {t:"Update your resume with concrete results before fall."}]},
 {id:"jf",title:"Junior fall",tag:"Middle-market and regional recruiting",from:[-2,8],to:[-2,11],calls:"6–10",
  hiring:["Middle market","Regional banks","Boutiques","Remaining bulge bracket spots"],
  goal:"Land the junior summer offer.",
  items:[
   {t:"Apply broadly to middle-market and regional banks. Many Midwest offices hire in this window."},
   {t:"Set your superday date in the drill to get a daily study plan.",go:"drill",label:"Open drill"},
   {t:"Run a superday simulation before every real one.",go:"superday",label:"Open superday sim"},
   {t:"Send a thank-you note within 24 hours of every interview.",go:"network",label:"Open email drafter"},
   {t:"If you already have an offer, decide by the deadline. Never renege on an accepted offer."}]},
 {id:"js",title:"Junior spring",tag:"Late recruiting and backup plans",from:[-1,0],to:[-1,4],calls:"6–10",
  hiring:["Boutiques","Late and unfilled spots"],
  goal:"Secure a finance internship either way.",
  items:[
   {t:"Keep applying to boutiques and late openings. Spots open up as other candidates decline."},
   {t:"If you still need an offer, look at related roles: valuation, Big Four transaction services, corporate development, commercial banking, equity research."},
   {t:"Ask your network who's still hiring. This is when referrals matter most.",go:"network",label:"Open networking"},
   {t:"If you have an offer, prepare: Excel shortcuts, basic modeling, and your group's sector."}]},
 {id:"js2",title:"Junior summer",tag:"Earn the return offer",from:[-1,5],to:[-1,7],calls:"",
  hiring:["Return offers"],
  goal:"Turn the internship into a full-time offer.",
  items:[
   {t:"Be reliable and careful. Small mistakes count more than you'd think."},
   {t:"Ask for feedback halfway through the summer, and act on it."},
   {t:"Build relationships across your intern class and the group."},
   {t:"Keep notes on the deals you worked on. You'll talk about them for years."}]},
 {id:"sr",title:"Senior year",tag:"Full-time recruiting if needed",from:[-1,8],to:[0,4],calls:"",
  hiring:["Full-time analyst roles","Off-cycle hiring"],
  goal:"Start as a full-time analyst.",
  items:[
   {t:"If you have a return offer, decide and accept by the deadline."},
   {t:"If not, recruit for full-time roles in the fall using your internship experience.",go:"firms",label:"Open firm prep"},
   {t:"Consider a path in: start in a related role and move into banking after 1–2 years, or do a master's in finance."}]}
];
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let tlOpen=null;
function guessGrad(){
  const n=new Date(), acad=n.getMonth()>=7?n.getFullYear():n.getFullYear()-1, y=(S.settings.year||"").toLowerCase();
  const off={freshman:4,"first":4,sophomore:3,"second":3,junior:2,"third":2,senior:1,"fourth":1};
  for(const k in off)if(y.includes(k))return acad+off[k];
  return null;
}
function phaseDates(p,G){
  const s=new Date(G+p.from[0],p.from[1],1), e=new Date(G+p.to[0],p.to[1]+1,0,23,59);
  return {s,e,label:`${MON[s.getMonth()]} ${s.getFullYear()} – ${MON[e.getMonth()]} ${e.getFullYear()}`};
}
function monthCounts(){
  const ym=iso(new Date()).slice(0,7); let calls=0, touches=0;
  S.contacts.forEach(c=>{calls+=((c.notes||"").match(new RegExp("Call "+ym+"-\\d{2}:","g"))||[]).length;if((c.last||"").startsWith(ym))touches++;});
  return {calls,touches};
}
function renderTimeline(){
  const root=$("#tlRoot"); if(!root)return;
  const G=+S.settings.gradYear||guessGrad();
  const nowY=new Date().getFullYear();
  const opts=[];for(let y=nowY;y<=nowY+5;y++)opts.push(y);
  const picker=`<div class="row"><label for="tlGrad" style="margin:0">Graduation year</label><select id="tlGrad" style="width:auto"><option value="">Choose</option>${opts.map(y=>`<option ${y===G?"selected":""}>${y}</option>`).join("")}</select></div>`;
  const caveat=`<p class="hint" style="margin:0">Timelines shift every year and differ by bank. This is the typical pattern for the internship the summer after junior year, not exact dates. Check each firm's careers page, and ask your contacts what they're seeing.</p>`;
  if(!G){root.innerHTML=`<div class="card stack"><span class="eyebrow">Recruiting timeline</span><h2>When does recruiting happen for you?</h2><p style="margin:0;max-width:62ch">Banks hire for the internship the summer after junior year much earlier than most students expect, often more than a year ahead. Pick your graduation year to see your own timeline and what to do right now.</p>${picker}${caveat}</div>`;bindTl();return;}
  const now=new Date(), ph=PHASES.map(p=>({...p,...phaseDates(p,G)}));
  let cur=ph.findIndex(p=>now>=p.s&&now<=p.e);
  if(cur<0)cur=now<ph[0].s?-1:ph.length;
  // overlaps (sophomore summer ends in Aug, junior fall starts in Sep): pick the first match
  if(tlOpen==null)tlOpen=Math.max(0,Math.min(cur,ph.length-1));
  const checks=S.tlChecks||{};
  const nextBig=ph.find(p=>p.id==="ss"&&now<p.s);
  const monthsTo=d=>Math.max(0,(d.getFullYear()-now.getFullYear())*12+d.getMonth()-now.getMonth());
  const C=monthCounts(), r=readiness();
  const P=ph[cur];
  const summary=cur<0?`<p style="margin:0">Recruiting hasn't started for you yet. Use freshman year to build the foundation below.</p>`
    :cur>=ph.length?`<p style="margin:0">Your recruiting timeline for this internship has passed. If you're still looking, focus on full-time and related roles.</p>`
    :`<div class="tl-now"><div><span class="eyebrow">You are here</span><h2>${P.title}</h2><p style="margin:2px 0 0;color:var(--muted)">${P.tag} · ${P.label}</p></div>
      <div class="tl-stats">
        <div><b>${C.calls}</b><span>Calls logged this month${P.calls?` · aim for ${P.calls}`:""}</span></div>
        <div><b>${C.touches}</b><span>Contacts reached this month</span></div>
        <div><b>${r.score}%</b><span>Superday readiness</span></div>
      </div></div>
      ${nextBig?`<p class="tl-alert">Bulge bracket recruiting for your internship typically opens around <b>${MON[nextBig.s.getMonth()]} ${nextBig.s.getFullYear()}</b>, in about ${monthsTo(nextBig.s)} month${monthsTo(nextBig.s)===1?"":"s"}. Be interview-ready before then.</p>`:""}`;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><div><span class="eyebrow">Recruiting timeline</span><h3 style="margin-top:2px">Class of ${G} · targeting the summer ${G-1} internship</h3></div>${picker}</div>
      ${summary}
      ${caveat}
    </div>
    <ol class="tl">${ph.map((p,k)=>{
      const st=k<cur?"done":k===cur?"now":"later", done=p.items.filter((_,j)=>checks[p.id+":"+j]).length, open=tlOpen===k;
      return `<li class="tl-item ${st}">
        <span class="tl-dot" aria-hidden="true">${st==="done"?"✓":""}</span>
        <div class="tl-body">
          <button class="tl-head" data-tl="${k}" aria-expanded="${open}">
            <span><b>${p.title}</b> <span class="hint">· ${p.tag}</span></span>
            <span class="tl-meta">${st==="now"?'<span class="stage hot">Now</span>':""}<span class="dates">${p.label}</span><span class="dates">${done}/${p.items.length}</span></span>
          </button>
          ${open?`<div class="tl-detail">
            <div class="chips" style="margin:0">${p.hiring.map(h=>`<span class="chip static">${esc(h)}</span>`).join("")}</div>
            <p style="margin:0"><b>Goal:</b> ${p.goal}</p>
            ${p.warn?`<p class="tl-alert" style="margin:0">${p.warn}</p>`:""}
            <ul class="tl-check">${p.items.map((it,j)=>{const id=p.id+":"+j;return `<li><input type="checkbox" id="tl-${id}" data-chk="${id}" ${checks[id]?"checked":""}><label for="tl-${id}">${it.t}</label>${it.go?`<a class="linkbtn" href="#${it.go}">${it.label}</a>`:""}</li>`;}).join("")}</ul>
          </div>`:""}
        </div></li>`;}).join("")}</ol>
  </div>`;
  bindTl();
}
function bindTl(){
  const g=$("#tlGrad"); if(g)g.onchange=e=>{S.settings.gradYear=e.target.value?+e.target.value:"";tlOpen=null;save();renderTimeline();};
}
$("#tlRoot").addEventListener("click",e=>{const h=e.target.closest("[data-tl]");if(!h)return;const k=+h.dataset.tl;tlOpen=tlOpen===k?-1:k;renderTimeline();});
$("#tlRoot").addEventListener("change",e=>{const c=e.target.closest("[data-chk]");if(!c)return;S.tlChecks=S.tlChecks||{};if(c.checked)S.tlChecks[c.dataset.chk]=true;else delete S.tlChecks[c.dataset.chk];save();
  const li=c.closest(".tl-item"), k=[...li.parentNode.children].indexOf(li), p=PHASES[k];
  li.querySelectorAll(".dates")[1].textContent=`${p.items.filter((_,j)=>S.tlChecks[p.id+":"+j]).length}/${p.items.length}`;});
