/* Superday Prep · Superday simulation.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Superday simulation ---------- */
const SIM_LS="superday-sim-live:"+UID;
let sim=null, simTick=null, quitArmed=false;
const byId=id=>BANK.find(b=>b.id===id);
const stripTags=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const BEHAV="f5 f14 f15 f16 f17 f18 f19 f20 f35 f40 f41 f42 f43 f44 f55".split(" ");
const MARKET="f7 f12 f13 f46".split(" ");
const ROLES={
  associate:{title:"Associate",blurb:"A second-year associate in the group. Mostly technicals, and they'll push on anything vague."},
  vp:{title:"Vice President",blurb:"The VP who runs deals day to day. A mix of fit and harder technicals."},
  md:{title:"Managing Director",blurb:"The MD who decides whether you'd be good in front of clients. Fit, judgment and a brain teaser."}
};
const sectionOf=t=>t==="Fit"?"fit":t==="Brain Teasers"?"teaser":"tech";
const SECTION_NAME={fit:"Fit & behavioral",tech:"Technicals",teaser:"Brain teaser"};
const TARGET={fit:90,tech:120,teaser:120};
const fmtT=s=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
function persistLive(){try{if(sim)localStorage.setItem(SIM_LS,JSON.stringify(sim));else localStorage.removeItem(SIM_LS);}catch(e){}}

function simPlan(len,group){
  const A={role:"associate",slots:[["resume"],["Accounting",true],["Enterprise Value"],[len==="full"?"Valuation":"DCF",true]]};
  if(len==="short") return [A,{role:"md",slots:[["whyfirm"],["behav"],["Brain Teasers"],["closing"]]}];
  const vp={role:"vp",slots:[["whyfirm"],["DCF"],["LBO|M&A",true],["behav"]]};
  if(group) vp.slots.splice(1,0,["whygroup"]);
  return [A,vp,{role:"md",slots:[["whyib"],["Brain Teasers"],["market"],["closing"]]}];
}
function pickQ(kind,used,o){
  const lv=o.bank==="bb"?["Intermediate","Advanced"]:["Basic","Intermediate"];
  const recent=new Set((S.simHist||[]).slice(0,2).flatMap(h=>h.ids||[]));
  if(kind==="resume")return byId("f1");
  if(kind==="whyib")return byId("f2");
  if(kind==="closing")return byId("f34");
  if(kind==="whyfirm"){const f=byId("f3");return o.firm?{...f,q:`Why ${o.firm}?`}:f;}
  if(kind==="whygroup"){const f=byId("f32");return {...f,q:`Why do you want to work in ${o.group}?`};}
  let pool;
  if(kind==="behav")pool=BEHAV.map(byId);
  else if(kind==="market")pool=MARKET.map(byId);
  else{const ts=kind.split("|");pool=BANK.filter(b=>ts.includes(b.t)&&lv.includes(b.l));}
  pool=pool.filter(b=>b&&!used.has(b.id));
  const fresh=pool.filter(b=>!recent.has(b.id)), from=fresh.length?fresh:pool;
  return from[Math.floor(Math.random()*from.length)];
}
function startSim(o){
  const used=new Set();
  sim={...o,stage:"meet",r:0,i:0,started:Date.now(),qStart:0,draft:""};
  sim.rounds=simPlan(o.len,o.group).map(R=>({role:R.role,items:R.slots.map(([kind,fu])=>{
    const b=pickQ(kind,used,o); used.add(b.id);
    return {id:b.id,q:b.q,t:b.t,l:b.l,ref:b.a,kind,fu:!!fu,role:R.role,answer:"",secs:0};
  })}));
  quitArmed=false; persistLive(); renderSim(); scrollTo({top:0});
}
const simCount=()=>sim.rounds.reduce((n,R)=>n+R.items.length,0);

/* grading */
const gq=[]; let gActive=0;
function firmNotes(firm){
  const f=firm.toLowerCase();
  return S.contacts.filter(c=>c.firm&&(c.firm.toLowerCase().includes(f)||f.includes(c.firm.toLowerCase()))&&c.notes)
    .map(c=>`${c.name}${c.role?" ("+c.role+")":""}: ${c.notes}`).join(" | ").slice(0,700);
}
function simGradeParams(it){
  return {qid:it.id||"",question:it.q,topic:it.t,role:it.role,bank:sim.bank,firm:sim.firm||"",followOf:it.followOf||"",prevAnswer:it.prevAnswer||"",
    notes:it.kind==="whyfirm"&&sim.firm?firmNotes(sim.firm):"",
    resume:it.kind==="resume"&&S.story&&S.story.resume?S.story.resume.slice(0,2500):"",
    answer:it.answer};
}
function normResult(r){
  const score=Math.max(0,Math.min(10,Math.round(+r?.score||0)));
  const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
  return {score,strengths:arr(r?.strengths),gaps:arr(r?.gaps),model_answer:typeof r?.model_answer==="string"?r.model_answer:""};
}
function enqueueGrade(it){it.status="pending";gq.push(it);pump();}
function pump(){
  while(gActive<2&&gq.length){
    const it=gq.shift(); gActive++;
    gradeItem(it).finally(()=>{gActive--;persistLive();pump();if(sim&&sim.stage==="scoring"){renderSim();checkScored();}});
  }
}
async function gradeItem(it){
  if(!it.answer.trim()){it.result={score:0,strengths:[],gaps:["No answer given."],model_answer:""};it.status="done";return;}
  await sampleReady;
  if(!sampleFn){it.status="nograde";return;}
  try{it.result=normResult(await sampleFn.run("sim_grade",simGradeParams(it)));it.status="done";}
  catch(e){
    if(e?.code==="rate_limited"&&!it.retried){it.retried=true;await new Promise(r=>setTimeout(r,6000));return gradeItem(it);}
    it.status="error";
  }
}
async function getFollowUp(it){
  await sampleReady;
  if(!sampleFn||!it.answer.trim())return null;
  const ctrl=new AbortController(), t=setTimeout(()=>ctrl.abort(),25000);
  try{
    const r=await sampleFn.run("sim_followup",{role:it.role,question:it.q,answer:it.answer},{signal:ctrl.signal});
    const q=String(r.text||"").trim().replace(/^["'“]+|["'”]+$/g,"");
    return q.length>8&&q.length<400?q:null;
  }catch(e){return null;}finally{clearTimeout(t);}
}

/* flow */
async function submitAnswer(skip){
  const R=sim.rounds[sim.r], it=R.items[sim.i];
  it.answer=skip?"":($("#simAns")?.value||"").trim(); it.secs=Math.round((Date.now()-sim.qStart)/1000); it.done=true; sim.draft="";
  enqueueGrade(it);
  if(it.fu&&it.answer&&!it.fuDone){
    it.fuDone=true; sim.stage="thinking"; persistLive(); renderSim();
    const fq=await getFollowUp(it);
    if(!sim)return;
    if(fq)R.items.splice(sim.i+1,0,{q:fq,t:it.t,l:it.l,ref:"",kind:"followup",role:it.role,followOf:it.q,prevAnswer:it.answer.slice(0,1500),answer:"",secs:0,isFollow:true});
  }
  advance();
}
function advance(){
  const R=sim.rounds[sim.r];
  if(sim.i+1<R.items.length){sim.i++;sim.stage="q";sim.qStart=Date.now();}
  else if(sim.r+1<sim.rounds.length){sim.r++;sim.i=0;sim.stage="meet";}
  else{sim.stage="scoring";sim.endedAt=Date.now();}
  persistLive(); renderSim(); scrollTo({top:0});
  if(sim.stage==="scoring")checkScored();
}
function endEarly(){
  sim.rounds.forEach(R=>R.items=R.items.filter(it=>it.done));
  sim.rounds=sim.rounds.filter(R=>R.items.length);
  if(!sim.rounds.length){sim=null;persistLive();renderSim();return;}
  sim.stage="scoring"; sim.endedAt=Date.now(); sim.early=true; persistLive(); renderSim(); checkScored();
}
const allItems=()=>sim.rounds.flatMap(R=>R.items);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
let finishing=false;
async function checkScored(){
  if(!sim||sim.stage!=="scoring"||finishing)return;
  if(allItems().some(it=>it.status==="pending"))return;
  finishing=true;
  const items=allItems(), scored=items.filter(it=>it.result);
  const sec={}; ["fit","tech","teaser"].forEach(k=>{sec[k]=avg(scored.filter(it=>sectionOf(it.t)===k).map(it=>it.result.score));});
  const overall=avg(scored.map(it=>it.result.score));
  const verdict=overall==null?"Self-review":overall>=7.5&&(sec.tech==null||sec.tech>=7)?"Would advance":overall>=6?"Borderline":"Not yet";
  let summary=null;
  if(sampleFn&&scored.length){
    const lines=items.map(it=>`[${SECTION_NAME[sectionOf(it.t)]}${it.isFollow?", follow-up":""}] "${it.q}" scored ${it.result?it.result.score+"/10":"not scored"}.${it.result?.gaps?.length?" Gaps: "+it.result.gaps.join("; "):""}`);
    try{
      const r=await sampleFn.run("sim_debrief",{firm:sim.firm||"",lines,overall,verdict});
      const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
      summary={headline:typeof r.headline==="string"?r.headline:"",strengths:arr(r.strengths),fixes:arr(r.fixes),plan:arr(r.plan)};
    }catch(e){}
  }
  const prev=(S.simHist||[])[0];
  sim.final={overall,verdict,sec,summary,prevOverall:prev?.overall??null};
  sim.stage="done";
  if(overall!=null){
    S.simHist=[{topics:Object.fromEntries([...new Set(scored.map(it=>it.t))].map(t=>[t,avg(scored.filter(it=>it.t===t).map(it=>it.result.score))])),at:Date.now(),bank:sim.bank,len:sim.len,firm:sim.firm||"",overall,verdict,sec,mins:Math.round((sim.endedAt-sim.started)/6e4),ids:items.filter(it=>it.id).map(it=>it.id)},...(S.simHist||[])].slice(0,20);
    items.forEach(it=>{if(it.id&&it.result)grade(it.id,it.result.score>=8?2:it.result.score>=5?1:0,"mock");});
    save();
  }
  finishing=false; persistLive(); renderSim();
}

/* rendering */
function simHead(){
  const R=sim.rounds[sim.r];
  const dots=R.items.map((it,k)=>`<i class="${k<sim.i||it.done?"done":k===sim.i?"now":""}"></i>`).join("");
  return `<div class="sim-head">
    <div class="stack" style="gap:6px"><span class="eyebrow">Interview ${sim.r+1} of ${sim.rounds.length} · ${ROLES[R.role].title}</span><div class="dots" aria-label="Question ${sim.i+1} of ${R.items.length}">${dots}</div></div>
    <div class="row"><span class="timer">Total <b id="simTotal">${fmtT((Date.now()-sim.started)/1000)}</b></span><button class="btn" id="simQuit">${quitArmed?"Click again to end and score":"End early"}</button></div>
  </div>`;
}
function renderSetup(root){
  const firms=[...new Set(S.contacts.map(c=>c.firm).filter(Boolean))];
  const hist=S.simHist||[];
  root.innerHTML=`<div class="split">
    <form class="card stack" id="simForm">
      <div><span class="eyebrow">Superday simulation</span><h2 style="margin-top:4px">Run a mock superday</h2>
      <p class="hint" style="margin:6px 0 0;max-width:60ch">Back-to-back interviews with an associate, a VP and an MD. Interviewers ask follow-ups based on what you say, and you get no feedback until the end, like the real thing. Then you get a full scorecard.</p></div>
      <fieldset class="choice"><legend>Bank type</legend>
        <label><input type="radio" name="simBank" value="mm" checked><b>Middle market or boutique</b><span>Core technicals, more weight on fit</span></label>
        <label><input type="radio" name="simBank" value="bb"><b>Bulge bracket or elite boutique</b><span>Harder technicals and brain teasers</span></label>
      </fieldset>
      <fieldset class="choice"><legend>Length</legend>
        <label><input type="radio" name="simLen" value="short"><b>Short · about 20 min</b><span>2 interviews, about 9 questions</span></label>
        <label><input type="radio" name="simLen" value="full" checked><b>Full · about 45 min</b><span>3 interviews, about 14 questions</span></label>
      </fieldset>
      <div class="grid2">
        <div><label for="simFirm">Firm (optional)</label><input id="simFirm" list="simFirms" placeholder="Stifel"><datalist id="simFirms">${firms.map(f=>`<option value="${esc(f)}">`).join("")}</datalist></div>
        <div><label for="simGroup">Group (optional, full only)</label><input id="simGroup" placeholder="Industrials"></div>
      </div>
      <p class="hint" style="margin:0">${firms.length?"If you pick a firm from your networking list, your call notes are used to judge your \"Why us?\" answer.":"Add the firm to make the \"Why us?\" question specific."} Type answers the way you'd say them out loud.</p>
      ${sampleFn===null&&sampleChecked?`<p class="hint" style="margin:0;color:var(--amber)">AI scoring isn't available in this view. You can still run the simulation and compare your answers with the model answers.</p>`:""}
      <div class="row"><button class="btn primary" type="submit">Start superday</button>${isPro()?"":'<span class="pro">PRO</span>'}</div>
    </form>
    <aside class="card">
      <h3>Past simulations</h3>
      ${hist.length?`<ul class="hist">${hist.slice(0,8).map(h=>`<li><b>${h.overall.toFixed(1)}</b><span>${esc(h.verdict)} · ${h.len==="full"?"Full":"Short"}, ${h.bank==="bb"?"bulge bracket":"middle market"}${h.firm?" · "+esc(h.firm):""}<br><span class="hint">${new Date(h.at).toLocaleDateString(undefined,{month:"short",day:"numeric"})} · ${h.mins} min</span></span></li>`).join("")}</ul>`
      :`<p class="hint" style="margin:6px 0 0">Your scores show up here so you can see your progress run to run. Most people do one a week, then two in the final week before their superday.</p>`}
    </aside>
  </div>`;
  if(simPrefill){$("#simFirm").value=simPrefill.firm;if(simPrefill.group)$("#simGroup").value=simPrefill.group;simPrefill=null;}
  $("#simForm").onsubmit=e=>{e.preventDefault();if(!isPro()){window.openPaywall&&window.openPaywall("sim");return;}const f=e.target;
    startSim({bank:f.simBank.value,len:f.simLen.value,firm:$("#simFirm").value.trim(),group:f.simLen.value==="full"?$("#simGroup").value.trim():""});};
}
function renderSim(){
  const root=$("#simRoot"); if(!root)return;
  clearInterval(simTick);
  if(!sim){renderSetup(root);return;}
  if(sim.stage==="meet"){
    const R=sim.rounds[sim.r], role=ROLES[R.role];
    root.innerHTML=`${simHead()}<div class="card meet stack">
      <span class="eyebrow">Interview ${sim.r+1} of ${sim.rounds.length}</span>
      <h2>You're meeting the ${role.title.toLowerCase()}</h2>
      <p style="margin:0;max-width:60ch">${role.blurb} About ${R.items.length} questions${R.items.some(it=>it.fu)?", plus follow-ups":""}.</p>
      <div class="row"><button class="btn primary" id="simGo">Start interview</button>${sim.r===0?`<span class="hint">The clock starts now. Take a breath.</span>`:`<span class="hint">Reset. Each interviewer forms their own view.</span>`}</div>
    </div>`;
    $("#simGo").onclick=()=>{sim.stage="q";sim.qStart=Date.now();persistLive();renderSim();};
  }else if(sim.stage==="q"){
    const it=sim.rounds[sim.r].items[sim.i], sec=sectionOf(it.t);
    root.innerHTML=`${simHead()}<div class="card stack">
      <div class="qmeta"><span class="eyebrow">${it.isFollow?"Follow-up":"Question "+(sim.i+1)}</span><span class="eyebrow">${SECTION_NAME[sec]}${sec==="tech"&&!it.isFollow?" · "+esc(it.t):""}</span><span class="eyebrow qtimer" id="simQ">0:00</span><span class="hint">aim for about ${TARGET[sec]/60>=2?"2 min":"90 sec"}</span></div>
      ${it.isFollow?`<p class="hint" style="margin:0">Following up on: ${esc(it.followOf)}</p>`:""}
      <p class="q" style="margin:0">${esc(it.q)}</p>
      <label for="simAns" class="sr">Your answer</label>
      <textarea id="simAns" placeholder="Answer the way you'd say it out loud. Headline first, then the steps.">${esc(sim.draft||"")}</textarea>
      <div class="row"><button class="btn primary" id="simSubmit">Submit answer</button><button class="btn" id="simSkip">Skip</button><span class="hint"><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to submit · no feedback until the end</span></div>
    </div>`;
    const ta=$("#simAns"); ta.focus();
    let dt; ta.oninput=()=>{sim.draft=ta.value;clearTimeout(dt);dt=setTimeout(persistLive,800);};
    ta.onkeydown=e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault();submitAnswer(false);}};
    $("#simSubmit").onclick=()=>{if(!ta.value.trim()){toast("Type an answer, or press Skip");return;}submitAnswer(false);};
    $("#simSkip").onclick=()=>submitAnswer(true);
    simTick=setInterval(()=>{const q=$("#simQ"),t=$("#simTotal");if(!q)return clearInterval(simTick);
      const s=(Date.now()-sim.qStart)/1000;q.textContent=fmtT(s);q.classList.toggle("over",s>TARGET[sec]*1.5);if(t)t.textContent=fmtT((Date.now()-sim.started)/1000);},1000);
  }else if(sim.stage==="thinking"){
    root.innerHTML=`${simHead()}<div class="card thinking"><span class="dot"></span>The ${ROLES[sim.rounds[sim.r].role].title.toLowerCase()} is thinking about your answer...</div>`;
  }else if(sim.stage==="scoring"){
    const items=allItems(), done=items.filter(it=>it.status&&it.status!=="pending").length;
    root.innerHTML=`<div class="card stack"><div class="thinking"><span class="dot"></span>The interviewers are comparing notes...</div>
      <p class="hint" style="margin:0">${done} of ${items.length} answers scored${done===items.length?". Writing your debrief.":". This usually takes under a minute."}</p>
      <div class="bar" style="max-width:none"><i style="width:${Math.round(done/items.length*100)}%"></i></div></div>`;
  }else if(sim.stage==="done") renderScorecard(root);
  if(sim&&sim.stage!=="done"){const qb=$("#simQuit");if(qb)qb.onclick=()=>{if(!quitArmed){quitArmed=true;qb.textContent="Click again to end and score";return;}quitArmed=false;endEarly();};}
}
function scorecardText(){
  const F=sim.final, lines=[`Superday simulation · ${sim.len==="full"?"Full":"Short"} · ${sim.bank==="bb"?"Bulge bracket":"Middle market"}${sim.firm?" · "+sim.firm:""}`,
    `Result: ${F.verdict}${F.overall!=null?` · ${F.overall.toFixed(1)}/10`:""}`];
  ["fit","tech","teaser"].forEach(k=>{if(F.sec[k]!=null)lines.push(`${SECTION_NAME[k]}: ${F.sec[k].toFixed(1)}/10`);});
  if(F.summary?.headline)lines.push("",F.summary.headline);
  if(F.summary?.fixes?.length)lines.push("","Fix first:",...F.summary.fixes.map(x=>"- "+x));
  lines.push("","Practiced with Superday Prep");
  return lines.join("\n");
}
function renderScorecard(root){
  const F=sim.final, items=allItems(), mins=Math.round((sim.endedAt-sim.started)/6e4);
  const vcls={"Would advance":"v-Strong","Borderline":"v-Borderline","Not yet":"v-Fail","Self-review":"v-Pass"}[F.verdict];
  const delta=F.overall!=null&&F.prevOverall!=null?F.overall-F.prevOverall:null;
  const bar=k=>F.sec[k]==null?"":`<div class="secrow"><span>${SECTION_NAME[k]}</span><div class="bar" style="max-width:none;margin:0"><i style="width:${F.sec[k]*10}%"></i></div><b>${F.sec[k].toFixed(1)}</b></div>`;
  const li=a=>(a||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const S2=F.summary;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="sc-top">
        <div class="score"><b>${F.overall!=null?F.overall.toFixed(1):"–"}<small>/10</small></b><span class="verdict ${vcls}">${F.verdict}</span></div>
        <p class="hint" style="margin:0">${sim.len==="full"?"Full":"Short"} superday · ${sim.bank==="bb"?"bulge bracket":"middle market"}${sim.firm?" · "+esc(sim.firm):""} · ${items.length} questions in ${mins<1?"under 1":mins} min${sim.early?" (ended early)":""}${delta!=null?` · <b style="color:${delta>=0?"var(--accent)":"var(--red)"}">${delta>=0?"+":""}${delta.toFixed(1)}</b> vs. your last run`:""}</p>
      </div>
      ${S2?.headline?`<p style="margin:0;font-size:1.1rem;font-weight:500;max-width:65ch">${esc(S2.headline)}</p>`:""}
      ${F.overall!=null?`<div class="secbars">${bar("fit")}${bar("tech")}${bar("teaser")}</div>`:`<p class="hint" style="margin:0">AI scoring wasn't available, so compare each answer with the model answer below.</p>`}
      ${S2?`<div class="grid3 fb"><div><h3>What landed</h3><ul>${li(S2.strengths)}</ul></div><div><h3>Fix first</h3><ul>${li(S2.fixes)}</ul></div><div><h3>Your plan this week</h3><ul>${li(S2.plan)}</ul></div></div>`:""}
      <div class="row"><button class="btn primary" id="simAgain">Run another superday</button><button class="btn" id="simCopy">Copy scorecard</button><a class="btn" href="#drill" style="text-decoration:none">Go to drill</a></div>
      <textarea id="simCopyBox" readonly hidden style="min-height:150px"></textarea>
      ${F.overall!=null?`<p class="hint" style="margin:0">Each graded question also updated your drill deck, so the ones you missed come back sooner.</p>`:""}
    </div>
    ${sim.rounds.map((R,ri)=>`<div class="card stack" style="gap:8px"><h3>Interview ${ri+1} · ${ROLES[R.role].title}</h3>
      ${R.items.map(it=>{const r=it.result;return `<details class="qa"><summary><span class="qs ${r?(r.score>=8?"hi":r.score>=5?"mid":"lo"):""}">${r?r.score:"–"}</span><span>${it.isFollow?"<i>Follow-up:</i> ":""}${esc(it.q)}</span><span class="hint">${fmtT(it.secs)}</span></summary>
        <div class="qa-body">
          <div><span class="eyebrow">Your answer</span><p class="mine">${it.answer?esc(it.answer):"<i>Skipped</i>"}</p></div>
          ${r?.gaps?.length&&it.answer?`<div><span class="eyebrow">What to fix</span><ul>${li(r.gaps)}</ul></div>`:""}
          ${r?.model_answer?`<div><span class="eyebrow">Say it like this</span><div class="model">${esc(r.model_answer)}</div></div>`:it.ref?`<div><span class="eyebrow">Model answer</span><div class="model">${it.ref}</div></div>`:""}
          ${it.status==="error"?`<p class="hint" style="margin:0">This answer couldn't be scored.</p>`:""}
        </div></details>`;}).join("")}
    </div>`).join("")}
  </div>`;
  $("#simAgain").onclick=()=>{sim=null;persistLive();renderSim();scrollTo({top:0});};
  $("#simCopy").onclick=async()=>{const txt=scorecardText();try{await navigator.clipboard.writeText(txt);toast("Scorecard copied");}catch(e){const b=$("#simCopyBox");b.hidden=false;b.value=txt;b.select();toast("Select the text and copy it");}};
}
let sampleChecked=false;
sampleReady.then(()=>{sampleChecked=true;if(!sim)renderSim();});
(function restoreSim(){
  try{const raw=localStorage.getItem(SIM_LS);if(!raw)return;const s=JSON.parse(raw);
    if(!s||!s.rounds||Date.now()-s.started>8*36e5){localStorage.removeItem(SIM_LS);return;}
    sim=s;
    if(sim.stage==="thinking"){advance();}
    if(sim.stage==="q")sim.qStart=Date.now()-0;
    allItems().forEach(it=>{if(it.done&&(!it.status||it.status==="pending"))enqueueGrade(it);});
    if(sim.stage==="scoring")checkScored();
  }catch(e){}
})();
