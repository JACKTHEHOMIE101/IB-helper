/* Superday Prep · Behavioral story bank: save experiences, shape them into STAR answers, and see which questions they cover.
   Files in /app are plain scripts joined by the server into /app.js and share one global scope. */
/* ---------- Story bank ---------- */
const STORY_TYPES=["Leadership","Internship","Job","Finance club","Academic project","Sports","Personal challenge","Other"];
const BEHAV_Q=window.__BEHAV||[];   // [{id, q}] sent by the server
let storyOpen=null, storyBusy2=false, storyReh=null, storyRehTick=null, storyDelArmed=false, storyMsg="";
const stories=()=>S.stories||(S.stories=[]);
const shortQ=q=>q.replace(/^Tell me about a time (you |when you )?/i,"").replace(/\.$/,"").replace(/^./,c=>c.toUpperCase());
function storyCoverage(){ // for each behavioral question, the stories mapped to it
  return BEHAV_Q.map(b=>({...b,stories:stories().filter(s=>(s.questions||[]).includes(b.id))}));
}
function storyDetail(s){
  const built=!!(s.short||s.situation), tab=s.tab==="long"?"long":"short", text=s[tab]||"", tgt=tab==="long"?120:60, secs=speakSecs(text);
  const blanks=((s.short||"")+(s.long||"")+(s.result||"")).match(/\[[^\]]+\]/g)||[];
  const att=(s.rehearsals||[]).slice(0,6);
  const star=[["situation","Situation","Where you were and what was going on"],["task","Task","What you were responsible for"],["action","Action","What you personally did. This should be most of the answer"],["result","Result","What happened, with a number if you have one"]];
  return `<div class="card stack">
    <div class="row" style="justify-content:space-between"><button class="linkbtn" data-sb="back">← All stories</button><button class="btn sm" data-sb="del" style="color:var(--red)">${storyDelArmed?"Click again to delete":"Delete"}</button></div>
    <div class="grid2"><div><label for="sbTitle">Story title</label><input id="sbTitle" data-f="title" value="${esc(s.title||"")}" placeholder="Rebuilt the club's stock pitch model" maxlength="120"></div>
      <div><label for="sbType">Type of experience</label><select id="sbType" data-f="category">${STORY_TYPES.map(t=>`<option ${s.category===t?"selected":""}>${t}</option>`).join("")}</select></div></div>
    <div><label for="sbRaw">What happened? Write it roughly; facts matter more than polish</label><textarea id="sbRaw" data-f="raw" style="min-height:120px" placeholder="Two weeks before the competition our team had no model. I split up the research, built the DCF myself and ran practice sessions. We placed second of twelve teams." maxlength="4000">${esc(s.raw||"")}</textarea></div>
    <div class="row"><button class="btn primary" data-sb="build" ${storyBusy2?"disabled":""}>${built?"Rebuild STAR answer":"Build STAR answer"}</button><span class="hint">${built?"Rebuilding replaces your edits below.":"Uses 1 AI credit. The AI only uses what you wrote and marks anything missing in [brackets]."}</span></div>
    ${storyBusy2?`<div class="thinking"><span class="dot"></span>Shaping your story...</div>`:""}${storyMsg?`<p class="hint" style="margin:0;color:var(--ink)">${esc(storyMsg)}</p>`:""}
    <div class="grid2">${star.map(([k,l,h])=>`<div><label for="sb-${k}">${l} <span style="font-weight:400">· ${h}</span></label><textarea id="sb-${k}" data-f="${k}" style="min-height:${k==="action"?110:70}px">${esc(s[k]||"")}</textarea></div>`).join("")}</div>
    ${built?`<div class="stack" style="gap:8px">
      <div class="row" style="justify-content:space-between"><div class="seg" role="group" aria-label="Version"><button data-sb="tab:short" aria-pressed="${tab==="short"}">60 seconds</button><button data-sb="tab:long" aria-pressed="${tab==="long"}">2 minutes</button></div>
        <span class="stime ${text?timeClass(secs,tgt):""}" id="sbTime">${wordsOf(text)} words · about ${fmtT(secs)} spoken</span></div>
      <label for="sbSpoken" class="sr">Spoken version</label><textarea id="sbSpoken" data-f="${tab}" style="min-height:${tab==="long"?200:130}px">${esc(text)}</textarea>
      ${blanks.length?`<p class="tl-alert" style="background:var(--bg)">Fill in the [bracketed] parts with real details. A story without a result is the most common weakness.</p>`:""}
      <div class="row">${storyReh?`<span class="reh-timer" id="sbT" style="font-size:1.6rem">0:00</span><button class="btn primary sm" data-sb="rehdone">Done</button><button class="btn sm" data-sb="rehcancel">Cancel</button><span class="hint">Say it out loud. Target ${fmtT(tgt)}.</span>`
        :`<button class="btn sm" data-sb="reh">Timed run-through</button>${att.length?`<span class="attempts" style="margin:0">${att.map(a=>`<span class="${timeClass(a.secs,a.tgt)==="ok"?"ok":"off"}">${fmtT(a.secs)}</span>`).join("")}</span>`:`<span class="hint">Say it out loud against the clock.</span>`}`}</div>
    </div>
    <div class="grid2">
      <div class="stack" style="gap:8px"><h3>Strength</h3><div class="row"><span class="dots5" role="img" aria-label="${s.strength||0} out of 5">${[1,2,3,4,5].map(i=>`<i class="${i<=(s.strength||0)?"on":""}"></i>`).join("")}</span><span class="hint">${["","Thin","Needs detail","Solid","Strong","Standout"][s.strength||0]||"Not rated yet"}</span></div>
        ${(s.missing||[]).length?`<div><span class="eyebrow">Would make it stronger</span><ul style="margin:4px 0 0;padding-left:18px">${s.missing.map(m=>`<li>${esc(m)}</li>`).join("")}</ul></div>`:""}</div>
      <div class="stack" style="gap:8px"><h3>Follow-ups to expect</h3>${(s.follow_ups||[]).length?`<ul style="margin:0;padding-left:18px">${s.follow_ups.map(q=>`<li>${esc(q)}</li>`).join("")}</ul>`:`<p class="hint" style="margin:0">Build the STAR answer to see likely follow-up questions.</p>`}</div>
    </div>`:""}
    <div class="stack" style="gap:8px"><h3>Questions this story answers</h3><p class="hint" style="margin:0">Tick the ones it genuinely fits. Practice opens the mock interviewer with this story attached.</p>
      <ul class="qmap">${BEHAV_Q.map(b=>{const on=(s.questions||[]).includes(b.id);return `<li><input type="checkbox" id="sq-${b.id}" data-sq="${b.id}" ${on?"checked":""}><label for="sq-${b.id}">${esc(b.q)}</label>${on?`<button class="btn sm" data-sb="practice:${b.id}">Practice</button>`:""}</li>`;}).join("")}</ul></div>
  </div>`;
}
function renderStories(){
  const root=$("#storiesRoot"); if(!root)return;
  clearInterval(storyRehTick);
  const L=stories(), open=storyOpen&&L.find(s=>s.id===storyOpen);
  if(open){
    root.innerHTML=storyDetail(open);
    root.querySelectorAll("[data-f]").forEach(el=>el.oninput=()=>{open[el.dataset.f]=el.value;fpSave();
      if(el.id==="sbSpoken"){const t=$("#sbTime"),sec=speakSecs(el.value);t.textContent=`${wordsOf(el.value)} words · about ${fmtT(sec)} spoken`;t.className="stime "+timeClass(sec,open.tab==="long"?120:60);}});
    $("#sbType").onchange=e=>{open.category=e.target.value;save();};
    if(storyReh)storyRehTick=setInterval(()=>{const t=$("#sbT");if(!t)return clearInterval(storyRehTick);t.textContent=fmtT((Date.now()-storyReh.start)/1000);},250);
    return;
  }
  const cov=storyCoverage(), gaps=cov.filter(c=>!c.stories.length), over=L.filter(s=>(s.questions||[]).length>4);
  root.innerHTML=`<div class="split">
    <div class="stack">
      <div class="row" style="justify-content:space-between"><div><h2>Story bank</h2><p class="hint" style="margin:2px 0 0">Five or six strong stories cover almost every behavioral question. Save yours once and reuse them.</p></div><button class="btn primary" data-sb="add">Add a story</button></div>
      ${L.length?`<div class="clist">${L.map(s=>`<div class="contact storyRow"><div class="who"><b>${esc(s.title||"Untitled story")}</b><span>${esc(s.category||"")}${s.short?"":" · not built yet"}</span></div>
        <div class="dates">${(s.questions||[]).length} question${(s.questions||[]).length===1?"":"s"}${s.strength?` · strength ${s.strength}/5`:""}</div>
        <div class="row"><button class="btn sm" data-sb="open:${s.id}">Open</button></div></div>`).join("")}</div>`
      :`<div class="card empty"><h3>Start with one experience</h3><p>Pick something you led, fixed or learned from: a club project, a job, a team, a setback. Write what happened in a few rough sentences and the app shapes it into a STAR answer with 60-second and 2-minute versions.</p><div class="row"><button class="btn primary" data-sb="add">Add your first story</button></div></div>`}
      ${over.length?`<p class="tl-alert">You're using "${esc(over[0].title||"one story")}" for ${over[0].questions.length} questions. Interviewers compare notes at a superday, so spread your answers across more stories.</p>`:""}
    </div>
    <aside class="card stack" style="gap:10px"><h3>Question coverage</h3><p class="hint" style="margin:0">${BEHAV_Q.length-gaps.length} of ${BEHAV_Q.length} common behavioral questions have a story.</p>
      <div class="bar" style="max-width:none;margin:0"><i style="width:${BEHAV_Q.length?Math.round((BEHAV_Q.length-gaps.length)/BEHAV_Q.length*100):0}%"></i></div>
      <ul class="cov">${cov.map(c=>`<li class="${c.stories.length?"":"gap"}"><span>${esc(shortQ(c.q))}</span><span class="hint">${c.stories.length?c.stories.map(s=>esc(s.title||"Untitled")).join(", "):"No story yet"}</span></li>`).join("")}</ul>
    </aside>
  </div>`;
}
async function buildStar(s){
  if((s.raw||"").trim().length<40){storyMsg="Write a few sentences about what happened first.";renderStories();return;}
  storyBusy2=true; storyMsg=""; renderStories();
  await sampleReady;
  try{
    const r=await sampleFn.run("star_story",{title:s.title||"",category:s.category||"",raw:s.raw});
    if(!r.short)throw {code:"empty"};
    Object.assign(s,{situation:r.situation,task:r.task,action:r.action,result:r.result,short:r.short,long:r.long,strength:r.strength,missing:r.missing,follow_ups:r.follow_ups,built:Date.now()});
    s.questions=[...new Set([...(s.questions||[]),...r.questions])];
    save();
  }catch(e){storyMsg=e&&e.code==="quota_exhausted"?"You're out of AI credits for now. You can still fill in the four STAR boxes yourself.":"The AI didn't respond. Try again, or fill in the four STAR boxes yourself.";}
  storyBusy2=false; renderStories();
}
$("#storiesRoot").addEventListener("click",e=>{
  const b=e.target.closest("[data-sb]"); if(!b)return;
  const [act,arg]=b.dataset.sb.split(":"), s=stories().find(x=>x.id===storyOpen);
  if(act==="add"){const n={id:newId(),title:"",category:"Leadership",raw:"",questions:[],created:Date.now()};stories().push(n);storyOpen=n.id;storyMsg="";save();renderStories();$("#sbTitle").focus();}
  else if(act==="open"){storyOpen=arg;storyDelArmed=false;storyMsg="";storyReh=null;renderStories();scrollTo({top:0});}
  else if(act==="back"){storyOpen=null;storyReh=null;if(s&&!s.title&&!s.raw&&!s.situation)S.stories=stories().filter(x=>x!==s);save();renderStories();renderDash();}
  else if(!s)return;
  else if(act==="del"){if(!storyDelArmed){storyDelArmed=true;renderStories();return;}S.stories=stories().filter(x=>x!==s);storyOpen=null;storyDelArmed=false;save();renderStories();renderDash();toast("Story deleted");}
  else if(act==="build")buildStar(s);
  else if(act==="tab"){s.tab=arg;storyReh=null;renderStories();}
  else if(act==="reh"){storyReh={start:Date.now()};renderStories();}
  else if(act==="rehcancel"){storyReh=null;renderStories();}
  else if(act==="rehdone"){const secs=Math.round((Date.now()-storyReh.start)/1000),tgt=s.tab==="long"?120:60;storyReh=null;
    if(secs>=10){s.rehearsals=[{at:Date.now(),secs,tgt},...(s.rehearsals||[])].slice(0,20);save();}
    const c=timeClass(secs,tgt);toast(secs<10?"Under 10 seconds, so it wasn't saved":c==="ok"?`${fmtT(secs)}. Right on time`:c==="long"?`${fmtT(secs)}. About ${secs-tgt} seconds long`:`${fmtT(secs)}. About ${tgt-secs} seconds short`);renderStories();}
  else if(act==="practice"){const q=BEHAV_Q.find(x=>x.id===arg);if(!q)return;
    setMock({q:q.q,t:"Fit",l:"Intermediate",a:"",refId:arg,notes:(s.long||s.short||[s.situation,s.task,s.action,s.result].filter(Boolean).join(" ")).slice(0,3000),notesKind:"story"});
    setMockMode("ai");location.hash="#mock";setTimeout(()=>$("#mockAnswer").focus(),50);}
});
$("#storiesRoot").addEventListener("change",e=>{
  const c=e.target.closest("[data-sq]"), s=stories().find(x=>x.id===storyOpen); if(!c||!s)return;
  s.questions=c.checked?[...new Set([...(s.questions||[]),c.dataset.sq])]:(s.questions||[]).filter(x=>x!==c.dataset.sq);
  save(); renderStories();
});
