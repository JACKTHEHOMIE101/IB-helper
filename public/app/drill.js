/* Superday Prep · Technicals drill: spaced repetition, superday countdown and readiness score.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Spaced repetition ---------- */
let drillFilter=new Set(TOPICS), current=null, revealed=false;
const cs=id=>S.cards[id]||{reps:0,ease:2.5,ivl:0,due:0};
function schedule(c,g){ // g: 0 again,1 hard,2 good,3 easy; returns new state
  let {reps,ease,ivl}=c; const n={...c}; n.last=g;
  if(g===0){n.reps=0;n.ease=Math.max(1.3,ease-.2);n.ivl=0;n.due=Date.now()+10*6e4;n.lapses=(c.lapses||0)+1;return n;}
  if(g===1){n.ivl=reps===0?1:Math.max(1,ivl*1.2);n.ease=Math.max(1.3,ease-.15);}
  if(g===2){n.ivl=reps===0?1:reps===1?3:ivl*ease;}
  if(g===3){n.ivl=reps===0?3:reps===1?5:ivl*ease*1.3;n.ease=ease+.15;}
  n.reps=reps+1; n.due=today().getTime()+Math.round(n.ivl)*DAY; return n;
}
let extraNew=0;
const isPro=()=>!!(window.__ME&&window.__ME.pro);
const isFull=()=>S.settings.studySet==="full"&&isPro();
const inSet=b=>isFull()||CORE.has(b.id);
const setBank=()=>BANK.filter(inSet);
const setLabel=()=>isFull()?"":"core ";
function plan(){
  const d=S.settings.superday; if(!d) return null;
  const date=parseIso(d), days=Math.round((date-today())/DAY);
  if(days<0) return {days,past:true,date};
  const unseen=setBank().filter(b=>!S.cards[b.id]).length;
  const introduced=(S.newLog||{})[iso(new Date())]||0;
  const learnDays=Math.max(1,days-2); // keep the last two days for review only
  const perDay=Math.ceil((unseen+introduced)/learnDays);
  const finish=new Date(today().getTime()+(Math.ceil(unseen/Math.max(perDay,1))-(introduced<perDay?1:0))*DAY);
  return {days,date,unseen,introduced,perDay,left:Math.max(0,perDay-introduced),finish};
}
function capped(n){ // never schedule a review after the interview
  const p=plan(); if(!p||p.past||p.days<1) return n;
  const cutoff=p.date.getTime()-DAY;
  if(n.due>cutoff&&cutoff>=today().getTime()) n.due=cutoff;
  return n;
}
function queue(){
  if(focusIds&&focusIds.length)return {due:[],fresh:[],allFresh:[],p:plan(),focus:true,list:focusIds.map(byId).filter(Boolean)};
  const now=Date.now(), pool=BANK.filter(b=>drillFilter.has(b.t));
  const due=pool.filter(b=>S.cards[b.id]&&S.cards[b.id].due<=now).sort((a,b)=>S.cards[a.id].due-S.cards[b.id].due);
  const allFresh=pool.filter(b=>inSet(b)&&!S.cards[b.id]); // reviews of anything already learned still show up
  const p=plan(), cap=p&&!p.past?p.left+extraNew:Infinity;
  const fresh=allFresh.slice(0,cap);
  return {due,fresh,allFresh,p,list:[...due,...fresh]};
}
const fmtDay=d=>d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
function renderCountdown(q){
  const N=setBank().length, L=setLabel();
  const p=q.p, box=$("#countdown"), hdr=$("#hdrCount");
  const input=`<div class="cd-date"><label for="sdDate">Superday date</label><input type="date" id="sdDate" value="${esc(S.settings.superday||"")}" min="${iso(new Date())}"></div>`;
  if(!p){hdr.textContent="";box.innerHTML=`<div class="countdown"><div class="cd-body"><h2>When is your superday?</h2><p>Set the date and you'll get a daily goal that gets you through all ${N} ${L}questions in time, with the last two days kept for review.</p></div>${input}</div>`;return;}
  if(p.past){hdr.textContent="";box.innerHTML=`<div class="countdown urgent"><div class="cd-body"><h2>Your superday date has passed</h2><p>Set the date of your next interview to get a new daily plan.</p></div>${input}</div>`;return;}
  const seen=N-p.unseen, pct=Math.round(seen/N*100);
  hdr.textContent=p.days===0?"Superday is today":p.days===1?"1 day to superday":p.days+" days to superday";
  let msg;
  if(p.days===0) msg=`Interview day. Skim the reviews below, keep your answers short and structured, and good luck.`;
  else if(p.unseen===0) msg=isFull()?`You've seen all ${N} questions. From here it's reviews only, and every review lands before ${fmtDay(new Date(p.date.getTime()-DAY))}.`:`You've seen all ${N} core questions. Keep up with reviews, or switch to the full set below to keep learning new ones.`;
  else if(p.days<=2) msg=`Final stretch. Today: <b>${p.left} new</b> and <b>${q.due.length} due for review</b>. Focus on the reviews you keep missing.`;
  else if(p.left===0) msg=`<b>Today's goal is done:</b> ${p.introduced} new question${p.introduced===1?"":"s"} learned${q.due.length?` and <b>${q.due.length} review${q.due.length===1?"":"s"}</b> still due`:""}. You're on track to see all ${N} ${L}questions by ${fmtDay(p.finish)}.`;
  else msg=`Today's goal: <b>${p.left} new question${p.left===1?"":"s"}</b> and <b>${q.due.length} due for review</b>. At this pace you'll have seen all ${N} ${L}questions by ${fmtDay(p.finish)}, leaving the last two days for review.`;
  box.innerHTML=`<div class="countdown ${p.days<=7?"urgent":""}"><div class="cd-body"><div class="cd-main"><span class="cd-num">${p.days}</span><h2>${p.days===1?"day":"days"} until superday · ${fmtDay(p.date)}</h2></div><p>${msg}</p><div class="bar" role="img" aria-label="${seen} of ${N} ${L}questions seen"><i style="width:${pct}%"></i></div><p style="margin-top:4px;font-size:.78rem">${seen} of ${N} ${L}questions seen (${pct}%)</p></div>${input}</div>`;
}
$("#countdown").addEventListener("change",e=>{if(e.target.id!=="sdDate")return;S.settings.superday=e.target.value||"";extraNew=0;
  // pull any reviews scheduled past the new date back before it
  const p=plan(); if(p&&!p.past) Object.keys(S.cards).forEach(id=>S.cards[id]=capped(S.cards[id]));
  save();renderDrill();toast(e.target.value?"Superday date saved":"Superday date cleared");});
function grade(id,g,src){
  const k=iso(new Date());
  if(!S.cards[id]){S.newLog=S.newLog||{};S.newLog[k]=(S.newLog[k]||0)+1;if(extraNew>0)extraNew--;}
  S.cards[id]=capped(schedule(cs(id),g));
  S.reviewLog[k]=(S.reviewLog[k]||0)+1;
  if(focusIds){focusIds=focusIds.filter(x=>x!==id);if(!focusIds.length){focusIds=null;toast("Focus session done");}}
  save(); if(src!=="mock"){current=null;revealed=false;} renderDrill();
}
function streak(){let n=0,d=today();if(!S.reviewLog[iso(d)])d=new Date(d.getTime()-DAY);while(S.reviewLog[iso(d)]){n++;d=new Date(d.getTime()-DAY);}return n;}
/* ---------- Readiness score ---------- */
// How much each topic counts toward overall readiness, roughly by how often it comes up at a superday.
const TOPIC_W={"Accounting":.18,"Enterprise Value":.12,"Valuation":.14,"DCF":.16,"LBO":.12,"M&A":.10,"Brain Teasers":.06,"Fit":.12};
let focusIds=null, showBreakdown=false;
try{showBreakdown=localStorage.getItem("superday-rb")==="1";}catch(e){}
function strength(c){ // 0..1: how well a card is known
  if(!c)return 0;
  if(c.reps===0)return .15;
  let s=Math.min(1,.35+.65*Math.min(c.ivl||0,21)/21);
  if((Date.now()-c.due)/DAY>Math.max(2,c.ivl||0))s*=.8; // badly overdue
  return s;
}
function perfScores(t){
  const sims=(S.simHist||[]).filter(h=>h.topics&&h.topics[t]!=null).slice(0,3).flatMap(h=>[h.topics[t],h.topics[t]]); // simulations count double
  const mocks=(S.mockHist||[]).filter(h=>h.t===t).slice(0,6).map(h=>h.score);
  return [...sims,...mocks];
}
function readiness(){
  const SB=setBank();
  const topics=TOPICS.map(t=>{
    const qs=SB.filter(b=>b.t===t);
    const K=qs.length?qs.reduce((a,b)=>a+strength(S.cards[b.id]),0)/qs.length:0;
    const ps=perfScores(t), P=ps.length?ps.reduce((a,b)=>a+b,0)/ps.length/10:null;
    return {t,K,P,R:P==null?K*.85:.6*K+.4*P,n:qs.length,seen:qs.filter(b=>S.cards[b.id]).length};
  });
  const score=Math.round(100*topics.reduce((a,x)=>a+x.R*TOPIC_W[x.t],0));
  const label=score>=80?"Superday ready":score>=65?"First-round ready":score>=40?"Getting there":"Early days";
  const slipping=Object.entries(S.cards).filter(([,c])=>(c.lapses||0)>0||c.last===0).map(([id,c])=>({b:byId(id),c})).filter(x=>x.b)
    .sort((a,b)=>(b.c.lapses||0)-(a.c.lapses||0)||a.c.ease-b.c.ease).slice(0,5);
  return {score,label,topics,slipping};
}
function logReady(score){
  const k=iso(new Date()); S.readyLog=S.readyLog||{};
  if(S.readyLog[k]===score)return;
  S.readyLog[k]=score;
  const keys=Object.keys(S.readyLog).sort(); keys.slice(0,Math.max(0,keys.length-60)).forEach(x=>delete S.readyLog[x]);
  save();
}
function nextAction(r){
  const dueAll=Object.values(S.cards).filter(c=>c.due<=Date.now()).length;
  const lastSim=(S.simHist||[])[0];
  const seenPct=r.topics.reduce((a,x)=>a+x.seen,0)/Math.max(1,r.topics.reduce((a,x)=>a+x.n,0));
  const weak=[...r.topics].sort((a,b)=>a.R-b.R)[0];
  if(!Object.keys(S.cards).length)return {text:"Start with today's drill questions below. Every card you learn raises your score."};
  if(dueAll>=15)return {text:`Clear your ${dueAll} due reviews. They're the fastest points you can win back.`};
  if(seenPct>=.3&&(!lastSim||Date.now()-lastSim.at>7*DAY))return {text:"Run a superday simulation. Interview practice makes up 40% of each topic's score, and you haven't done one this week.",btn:"Start a simulation",act:"sim"};
  if(weak.R<.6)return {text:`Focus on ${weak.t}. It's your weakest area at ${Math.round(weak.R*100)}%.`,btn:`Drill ${weak.t}`,act:"topic:"+weak.t};
  return {text:"You're in good shape. Keep up with today's goal and run a simulation every few days."};
}
function sparkline(){
  const e=Object.entries(S.readyLog||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  if(e.length<2)return `<span class="hint">Your trend appears after your second day of practice.</span>`;
  const vals=e.map(x=>x[1]), n=vals.length, w=132, h=36;
  const lo=Math.max(0,Math.min(...vals)-5), hi=Math.min(100,Math.max(...vals)+5), span=Math.max(1,hi-lo);
  const pts=vals.map((v,i)=>[4+i*(w-8)/(n-1),h-4-(v-lo)/span*(h-8)].map(x=>x.toFixed(1)));
  const weekAgo=iso(new Date(today().getTime()-7*DAY));
  const refs=e.filter(([d])=>d<=weekAgo), ref=refs.length?refs[refs.length-1]:e[0];
  const d=vals[n-1]-ref[1];
  const when=refs.length?"this week":"since "+fmtDay(parseIso(ref[0]));
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${pts[n-1][0]}" cy="${pts[n-1][1]}" r="3" style="fill:var(--accent)"/></svg>
    <span class="hint"><b style="color:${d>=0?"var(--accent)":"var(--red)"}">${d>=0?"+":""}${d} pts</b> ${when}</span>`;
}
function renderReadiness(){
  const r=readiness(); logReady(r.score);
  const col=r.score>=80?"var(--blue)":r.score>=65?"var(--accent)":r.score>=40?"var(--amber)":"var(--red)";
  const a=nextAction(r);
  $("#hdrReady").textContent=`Readiness ${r.score}%`;
  const rows=[...r.topics].sort((x,y)=>x.R-y.R).map(x=>{const p=Math.round(x.R*100),c=p>=70?"var(--accent)":p>=50?"var(--amber)":"var(--red)";
    return `<div class="trow"><span>${esc(x.t)}</span><div class="bar"><i style="width:${p}%;background:${c}"></i></div><b>${p}%</b><small>Knowledge ${Math.round(x.K*100)}% · ${x.P==null?"no interview practice yet":"interviews "+(x.P*10).toFixed(1)+"/10"} · ${x.seen}/${x.n} seen</small></div>`;}).join("");
  const slip=r.slipping.length?`<ul class="slip">${r.slipping.map(s=>`<li><span class="eyebrow">${esc(s.b.t)}${s.c.lapses?` · missed ${s.c.lapses}×`:""}</span>${esc(s.b.q)}</li>`).join("")}</ul><button class="btn" data-ract="focus">Drill these ${r.slipping.length} now</button>`
    :`<p class="hint" style="margin:0">Nothing yet. Questions you mark "Again" or score low on in interviews show up here.</p>`;
  $("#readiness").innerHTML=`<div class="ready">
    <div class="ring" style="--p:${r.score};--rc:${col}" role="img" aria-label="Readiness ${r.score} percent"><span>${r.score}<small>%</small></span></div>
    <div class="ready-mid"><span class="eyebrow">Superday readiness${isFull()?"":" · core set"}</span><h2>${r.label}</h2><p>${a.text}</p>${a.btn?`<button class="btn primary" data-ract="${esc(a.act)}">${esc(a.btn)}</button>`:""}</div>
    <div class="ready-trend">${sparkline()}<button class="linkbtn" data-ract="toggle" aria-expanded="${showBreakdown}">${showBreakdown?"Hide breakdown":"See breakdown"}</button></div>
  </div>
  ${showBreakdown?`<div class="rb card"><div><h3>By topic</h3><p class="hint" style="margin:2px 0 12px">Weakest first. Each topic blends what you know from the drill (60%) with how you score in mock interviews and simulations (40%).</p><div class="trows">${rows}</div></div><div><h3>Keeps slipping</h3><p class="hint" style="margin:2px 0 12px">Questions you've missed in the drill or scored low on.</p>${slip}</div></div>`:""}`;
}
$("#readiness").addEventListener("click",e=>{const b=e.target.closest("[data-ract]");if(!b)return;const a=b.dataset.ract;
  if(a==="toggle"){showBreakdown=!showBreakdown;try{localStorage.setItem("superday-rb",showBreakdown?"1":"0");}catch(err){}renderDrill();return;}
  if(a==="sim"){location.hash="#superday";return;}
  if(a.startsWith("topic:"))drillFilter=new Set([a.slice(6)]),focusIds=null;
  if(a==="focus")focusIds=readiness().slipping.map(s=>s.b.id);
  current=null;revealed=false;renderDrill();$("#drillCard").scrollIntoView({behavior:"smooth",block:"start"});
});

function renderDrill(){
  const q=queue(); renderCountdown(q); renderReadiness(); const SB=setBank(), learned=SB.filter(b=>S.cards[b.id]&&S.cards[b.id].reps>=2).length;
  $("#drillStats").innerHTML=`<div><b>${q.due.length}</b><span>Due for review</span></div><div><b>${q.fresh.length}</b><span>${q.p&&!q.p.past?"New left today · "+q.allFresh.length+" unseen":"New questions"}</span></div><div><b>${S.reviewLog[iso(new Date())]||0}</b><span>Reviewed today · ${streak()}-day streak</span></div><div><b>${learned}/${SB.length}</b><span>${isFull()?"Questions":"Core questions"} learned</span></div>`;
  $("#setBar").innerHTML=`<span class="eyebrow">Study set</span><div class="seg" role="group" aria-label="Study set"><button data-set="core" aria-pressed="${!isFull()}">Core<small>${CORE.size}</small></button><button data-set="full" aria-pressed="${isFull()}">Full<small>${BANK_TOTAL}</small>${isPro()?"":'<span class="pro">PRO</span>'}</button></div><span class="hint">${isFull()?"Every question in the bank.":"The most-asked questions in each topic. Switch to Full once you've covered them."}</span>`;
  $("#drillChips").innerHTML=TOPICS.map(t=>`<button class="chip" data-topic="${t}" aria-pressed="${drillFilter.has(t)}">${t}<small>${SB.filter(b=>b.t===t).length}</small></button>`).join("");
  if(!current||!q.list.find(x=>x.id===current.id)){current=q.list[0]||null;revealed=false;}
  const box=$("#drillCard");
  if(!current&&q.allFresh.length){
    box.innerHTML=`<div class="card empty"><h2>Today's goal is done</h2><p>You've covered today's new questions and every review that's due. Tomorrow's set is ready when you are. If you have time now, you can get ahead.</p><div class="row"><button class="btn primary" id="moreNew">Do 5 more new questions</button><a class="btn" href="#mock" style="text-decoration:none">Practice a mock interview</a></div></div>`;
    $("#moreNew").onclick=()=>{extraNew+=5;renderDrill();};
    return;
  }
  if(!current){
    const next=Object.entries(S.cards).filter(([id])=>drillFilter.has(BANK.find(b=>b.id===id)?.t)).map(([,c])=>c.due).sort((a,b)=>a-b)[0];
    box.innerHTML=`<div class="card empty"><h2>You're caught up</h2><p>Nothing is due in the topics you picked.${next?` Next review is ${new Date(next).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})}.`:""} Run a mock interview to practice saying answers out loud, or add more topics above.</p><div class="row"><a class="btn primary" href="#mock" style="text-decoration:none">Start a mock interview</a></div></div>`;
    return;
  }
  const c=cs(current.id), isNew=!S.cards[current.id];
  const labels=[["Again","g-again"],["Hard","g-hard"],["Good","g-good"],["Easy","g-easy"]];
  box.innerHTML=`<div class="card">
    <div class="qmeta">${q.focus?`<span class="eyebrow" style="color:var(--amber)">Focus session · ${q.list.length} left</span><button class="linkbtn" id="exitFocus">Exit</button>`:""}<span class="eyebrow">${esc(current.t)}</span><span class="eyebrow">${esc(current.l)}</span><span class="eyebrow">${isNew?"New":"Review "+(c.reps+1)}</span></div>
    <p class="q">${esc(current.q)}</p>
    ${revealed?`<div class="ans">${current.a}</div>
      <p class="hint" style="margin:14px 0 0">How close was your answer?</p>
      <div class="grades">${labels.map(([n,cl],i)=>{const s=capped(schedule(c,i));return `<button class="btn ${cl}" data-g="${i}"><span>${n} <kbd>${i+1}</kbd></span><small>${i===0?"<10m":fmtInt(Math.max(0,Math.round((s.due-today().getTime())/DAY))||1)}</small></button>`}).join("")}</div>`
    :`<div class="row"><button class="btn primary" id="reveal">Show answer</button><span class="hint">Say your answer out loud first. <kbd>Space</kbd></span></div>`}
  </div>`;
}
$("#setBar").addEventListener("click",e=>{const b=e.target.closest("[data-set]");if(!b)return;const v=b.dataset.set;
  if(v==="full"&&!isPro()){window.openPaywall&&window.openPaywall("full");return;}if((v==="full")===isFull())return;
  S.settings.studySet=v;extraNew=0;current=null;save();renderDrill();toast(v==="full"?"Switched to the full set":"Switched to the core set");});
$("#drillChips").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(!b)return;const t=b.dataset.topic;
  if(drillFilter.has(t)&&drillFilter.size>1)drillFilter.delete(t);else drillFilter.add(t);current=null;renderDrill();});
$("#drillCard").addEventListener("click",e=>{if(e.target.closest("#exitFocus")){focusIds=null;current=null;revealed=false;renderDrill();return;}if(e.target.closest("#reveal")){revealed=true;renderDrill();}const g=e.target.closest("[data-g]");if(g)grade(current.id,+g.dataset.g);});
addEventListener("keydown",e=>{
  if($("#v-drill").hidden||e.target.matches("input,textarea,select")||!current)return;
  if(e.code==="Space"&&!revealed){e.preventDefault();revealed=true;renderDrill();}
  else if(revealed&&["1","2","3","4"].includes(e.key))grade(current.id,+e.key-1);
});
