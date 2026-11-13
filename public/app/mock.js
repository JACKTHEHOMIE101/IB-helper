/* Superday Prep · AI mock interview.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Mock interview ---------- */
let mockQ=null, sampleFn=null, mockBusy=false;
let sampleReadyResolve; const sampleReady=new Promise(r=>sampleReadyResolve=r);
(async()=>{if(window.claude?.use){try{sampleFn=await claude.use("sample");}catch(e){}}if(!sampleFn){$("#mockHint").textContent="AI grading isn't available in this view. You can still compare your answer to the model answer.";$("#mockGrade").textContent="Show model answer";}sampleReadyResolve();})();
$("#mockTopic").innerHTML=`<option value="">All topics</option>`+TOPICS.map(t=>`<option>${t}</option>`).join("");
function pickMock(){
  const t=$("#mockTopic").value; const pool=setBank().filter(b=>!t||b.t===t);
  let q; do{q=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&mockQ&&q.id===mockQ.id);
  setMock(q);
}
function setMock(q){mockQ=q;$("#mockMeta").textContent=q.followUp?"Follow-up question":`${q.t} · ${q.l}`;$("#mockQ").textContent=q.q;$("#mockAnswer").value="";$("#mockResult").innerHTML="";}
$("#mockNext").onclick=pickMock; $("#mockTopic").onchange=pickMock;
function renderHist(){
  const h=S.mockHist; $("#mockCount").textContent=h.length;
  $("#mockAvg").textContent=h.length?(h.reduce((a,b)=>a+b.score,0)/h.length).toFixed(1)+"/10":"–";
  $("#mockHist").innerHTML=h.length?h.slice(0,12).map(x=>`<li><b>${x.score}</b><span>${esc(x.q)}</span></li>`).join(""):`<li><b>–</b><span class="hint">Graded answers show up here.</span></li>`;
}
$("#mockGrade").onclick=async()=>{
  if(mockBusy)return;
  const ans=$("#mockAnswer").value.trim(); const out=$("#mockResult");
  if(!sampleFn){out.innerHTML=`<div class="card"><h3>Model answer</h3><div class="ans" style="border:0;padding-top:8px">${mockQ.a||"No reference answer for this follow-up."}</div></div>`;return;}
  if(ans.length<15){toast("Write out your answer first");return;}
  mockBusy=true;$("#mockGrade").disabled=true;
  out.innerHTML=`<div class="card thinking"><span class="dot"></span>Your interviewer is reading your answer...</div>`;
  try{
    const r=await sampleFn.run("grade",{qid:mockQ.id||mockQ.refId||"",question:mockQ.q,topic:mockQ.t,context:mockQ.context||"",notes:mockQ.notes||"",notesKind:mockQ.notesKind||"firm",answer:ans});
    const score=Math.max(0,Math.min(10,Math.round(+r.score||0)));
    const verdict=["Strong","Pass","Borderline","Fail"].includes(r.verdict)?r.verdict:(score>=8?"Pass":score>=5?"Borderline":"Fail");
    const li=a=>(Array.isArray(a)&&a.length?a:["–"]).map(x=>`<li>${esc(x)}</li>`).join("");
    out.innerHTML=`<div class="card stack">
      <div class="score"><b>${score}<small>/10</small></b><span class="verdict v-${verdict}">${verdict}</span>${mockQ.id?`<span class="hint">Logged to your drill deck as "${score>=8?"Good":score>=5?"Hard":"Again"}"</span>`:""}</div>
      <div class="grid2 fb"><div><h3>What landed</h3><ul>${li(r.strengths)}</ul></div><div><h3>What to fix</h3><ul>${li(r.gaps)}</ul></div></div>
      <div><h3 style="margin-bottom:6px">Say it like this</h3><div class="model">${esc(r.model_answer||"")}</div></div>
      ${r.follow_up?`<div><span class="eyebrow">Interviewer follows up</span><p style="margin:4px 0 10px;font-weight:500">${esc(r.follow_up)}</p><button class="btn" id="takeFollow">Answer the follow-up</button></div>`:""}
    </div>`;
    if(r.follow_up)$("#takeFollow").onclick=()=>{setMock({q:r.follow_up,followUp:true,context:mockQ.q,t:mockQ.t});$("#mockAnswer").focus();};
    S.mockHist.unshift({q:mockQ.q,t:mockQ.t,score,at:Date.now()}); S.mockHist=S.mockHist.slice(0,40);
    if(mockQ.id) grade(mockQ.id,score>=8?2:score>=5?1:0,"mock"); else save();
    renderHist();
  }catch(e){
    const msg=e?.code==="quota_exhausted"?"You're out of AI credits for now. Compare with the model answer below, or upgrade to Pro for more practice.":e?.code==="rate_limited"?"Too many requests at once. Wait a minute and try again.":"Grading didn't go through. Try again in a moment.";
    out.innerHTML=`<div class="card stack"><p style="margin:0">${msg}</p>${mockQ.a?`<div class="ans" style="border:0;padding:0">${mockQ.a}</div>`:""}</div>`;
  }
  mockBusy=false;$("#mockGrade").disabled=false;
};
