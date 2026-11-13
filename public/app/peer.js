/* Superday Prep · Peer mock interviews.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Peer mock: practice with a friend ---------- */
const PEER_LS="superday-peer-live:"+UID;
let mockMode="ai", P=null, peerTick=null, peerQuit=false;
try{mockMode=localStorage.getItem("superday-mockmode")==="peer"?"peer":"ai";}catch(e){}
try{const raw=localStorage.getItem(PEER_LS);if(raw){const x=JSON.parse(raw);if(x&&Date.now()-x.started<12*36e5)P=x;}}catch(e){}
function peerPersist(){try{if(P)localStorage.setItem(PEER_LS,JSON.stringify(P));else localStorage.removeItem(PEER_LS);}catch(e){}}
const RUBRIC=[
  {k:"acc",name:"Accuracy",fitName:"Substance",tip:"Right answer, right direction, no errors",fitTip:"Specific, believable, a real example"},
  {k:"str",name:"Structure",tip:"Headline first, then logical steps"},
  {k:"del",name:"Delivery",tip:"Confident and concise, no rambling"}];
const FOLLOWUPS={
  "Accounting":["Now do it again at a 40% tax rate.","What if it were funded with debt instead of cash?","What happens in year two?","Where does that show up on the balance sheet exactly?"],
  "Enterprise Value":["What if the company also had $50 of preferred stock?","How would your answer change if the cash were trapped overseas?","What happens to equity value in that case?"],
  "Valuation":["Which method would you weight most here, and why?","What would make that multiple too high?","How would you value it if it were private?"],
  "DCF":["What happens to the value if WACC rises by 1%?","How would you sanity-check the terminal value?","Why unlevered free cash flow and not levered?"],
  "LBO":["What if the exit multiple were 2 turns lower?","Roughly what IRR is that?","Which return driver matters most in your example?"],
  "M&A":["What if the deal were funded with debt at 7% instead?","Why might an accretive deal still be a bad idea?","How many synergies would make it break even?"],
  "Brain Teasers":["Walk me through how you got there.","How would you check that answer?","What assumption matters most?"],
  "Fit":["Can you give me a specific example?","What would you do differently now?","What did that teach you about yourself?","Why does that matter for banking?"]};
function keyPoints(html){
  const lis=[...String(html||"").matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>stripTags(m[1]));
  if(lis.length)return lis.slice(0,5);
  return stripTags(html).split(/(?<=[.!?])\s+(?=[A-Z])/).filter(x=>x.length>12).slice(0,4);
}
function peerPick(o){
  const used=new Set(), out=[];
  const base=o.diff==="hard"?BANK.filter(b=>b.l!=="Basic"||b.t==="Fit"):BANK.filter(b=>CORE.has(b.id));
  const TECH=["Accounting","Enterprise Value","Valuation","DCF","LBO","M&A"];
  const seqs={tech:["tech","tech","tech","teaser","tech","tech","tech","tech","teaser","tech"],
    fit:["resume","fit","fit","fit","teaser","fit","fit","fit","fit","fit"],
    mixed:["resume","tech","fit","tech","tech","teaser","fit","tech","tech","fit"]};
  const techOrder=shuffleArr(TECH); let ti=0;
  seqs[o.mix].slice(0,o.n).forEach(kind=>{
    let pool;
    if(kind==="resume")pool=[byId("f1")];
    else if(kind==="fit")pool=base.filter(b=>b.t==="Fit"&&b.id!=="f1"&&b.id!=="f34");
    else if(kind==="teaser")pool=base.filter(b=>b.t==="Brain Teasers");
    else{const t=techOrder[ti++%techOrder.length];pool=base.filter(b=>b.t===t);}
    pool=pool.filter(b=>b&&!used.has(b.id)); if(!pool.length)pool=BANK.filter(b=>!used.has(b.id)&&(kind==="tech"?TECH.includes(b.t):true));
    const b=pool[Math.floor(Math.random()*pool.length)]; used.add(b.id);
    const fu=FOLLOWUPS[b.t]||FOLLOWUPS.Fit;
    out.push({id:b.id,q:b.q,t:b.t,l:b.l,a:b.a,points:keyPoints(b.a),hit:[],scores:{},notes:"",secs:0,fu:fu[Math.floor(Math.random()*fu.length)]});
  });
  return out;
}
function shuffleArr(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const itemScore=it=>{const v=RUBRIC.map(r=>it.scores[r.k]).filter(x=>x);return v.length===3?v.reduce((a,b)=>a+b,0)/3*2:null;};
function startPeer(o){
  P={...o,stage:"q",i:0,started:Date.now(),qStart:Date.now(),items:peerPick(o),strength:"",fix:""};
  peerQuit=false; peerPersist(); renderPeer(); scrollTo({top:0});
}
function peerNext(skip){
  const it=P.items[P.i]; it.secs=Math.round((Date.now()-P.qStart)/1000); if(skip)it.skipped=true;
  if(P.i+1<P.items.length){P.i++;P.qStart=Date.now();}else finishPeer();
  peerPersist(); renderPeer(); scrollTo({top:0});
}
function finishPeer(){
  P.items=P.items.filter((it,k)=>k<=P.i);
  P.stage="done"; P.ended=Date.now();
  const sc=P.items.map(itemScore).filter(x=>x!=null);
  P.overall=sc.length?sc.reduce((a,b)=>a+b,0)/sc.length:null;
  if(P.overall!=null){S.peerHist=[{at:Date.now(),cand:P.cand||"",me:P.me||"",overall:P.overall,n:sc.length,mix:P.mix},...(S.peerHist||[])].slice(0,20);save();}
}
const peerVerdict=o=>o==null?"Not scored":o>=7.5?"Would advance":o>=6?"Borderline":"Not yet";
function peerScorecardText(){
  const L=[`Peer mock interview${P.cand?" for "+P.cand:""}${P.me?" (interviewer: "+P.me+")":""}`,`Result: ${peerVerdict(P.overall)}${P.overall!=null?" · "+P.overall.toFixed(1)+"/10":""}`];
  RUBRIC.forEach(r=>{const v=P.items.map(it=>it.scores[r.k]).filter(Boolean);if(v.length)L.push(`${r.name}: ${(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)}/5`);});
  if(P.strength)L.push("","Biggest strength: "+P.strength);
  if(P.fix)L.push("Fix first: "+P.fix);
  L.push("","Question by question:");
  P.items.forEach((it,k)=>{const s=itemScore(it);L.push(`${k+1}. ${it.q} ${it.skipped?"(skipped)":s!=null?"· "+s.toFixed(1)+"/10":""}`);if(it.notes)L.push("   Note: "+it.notes);});
  L.push("","Practiced with Superday Prep");
  return L.join("\n");
}
function renderPeer(){
  const root=$("#peerRoot"); if(!root)return;
  clearInterval(peerTick);
  if(!P){
    const hist=S.peerHist||[];
    root.innerHTML=`<div class="split">
      <form class="card stack" id="peerForm">
        <div><span class="eyebrow">Practice with a friend</span><h2 style="margin-top:4px">Run a peer mock interview</h2>
        <p class="hint" style="margin:6px 0 0;max-width:62ch">Only the interviewer needs this screen, in person or on a video call. You get each question to read aloud, what a strong answer includes, a follow-up to ask and a simple rubric. At the end there's a scorecard to send. Then swap roles.</p></div>
        <div class="grid2">
          <div><label for="pMe">Interviewer (you)</label><input id="pMe" value="${esc(S.settings.name||"")}" placeholder="Your name"></div>
          <div><label for="pCand">Candidate</label><input id="pCand" placeholder="Your friend's name"></div>
        </div>
        <fieldset class="choice c3"><legend>Questions</legend>
          <label><input type="radio" name="pMix" value="mixed" checked><b>Mixed</b><span>Like a real interview</span></label>
          <label><input type="radio" name="pMix" value="tech"><b>Technical</b><span>Plus a brain teaser</span></label>
          <label><input type="radio" name="pMix" value="fit"><b>Fit</b><span>Stories and judgment</span></label>
        </fieldset>
        <div class="grid2">
          <fieldset class="choice"><legend>Difficulty</legend>
            <label><input type="radio" name="pDiff" value="core" checked><b>Core</b><span>Most-asked questions</span></label>
            <label><input type="radio" name="pDiff" value="hard"><b>Harder</b><span>Bulge bracket level</span></label>
          </fieldset>
          <div><label for="pN">Length</label><select id="pN"><option value="5">5 questions · about 15 min</option><option value="8" selected>8 questions · about 25 min</option><option value="10">10 questions · about 30 min</option></select></div>
        </div>
        <div class="row"><button class="btn primary" type="submit">Start interviewing</button></div>
      </form>
      <aside class="card stack" style="gap:10px">
        <h3>How to be a good mock interviewer</h3>
        <ul class="tips">
          <li><b>Don't help.</b> Let silence sit for 5 seconds before moving on.</li>
          <li><b>Always ask the follow-up</b>, even after a good answer. That's where real interviews separate people.</li>
          <li><b>Score honestly.</b> A generous 9 now is a surprise at the superday.</li>
          <li><b>Write one specific note</b> per question: what to keep and what to fix.</li>
        </ul>
        ${hist.length?`<div><span class="eyebrow">Past peer sessions</span><ul class="hist" style="margin-top:6px">${hist.slice(0,6).map(h=>`<li><b>${h.overall.toFixed(1)}</b><span>${esc(h.cand||"Candidate")}${h.me?" · interviewed by "+esc(h.me):""}<br><span class="hint">${new Date(h.at).toLocaleDateString(undefined,{month:"short",day:"numeric"})} · ${h.n} questions</span></span></li>`).join("")}</ul></div>`:""}
      </aside>
    </div>`;
    $("#peerForm").onsubmit=e=>{e.preventDefault();const f=e.target;startPeer({me:$("#pMe").value.trim(),cand:$("#pCand").value.trim(),mix:f.pMix.value,diff:f.pDiff.value,n:+$("#pN").value});};
    return;
  }
  if(P.stage==="q"){
    const it=P.items[P.i], sec=sectionOf(it.t), fitQ=it.t==="Fit";
    const target=TARGET[sec];
    const allScored=RUBRIC.every(r=>it.scores[r.k]);
    root.innerHTML=`<div class="sim-head">
        <div class="stack" style="gap:6px"><span class="eyebrow">${esc(P.cand||"Candidate")} · question ${P.i+1} of ${P.items.length}</span><div class="dots">${P.items.map((x,k)=>`<i class="${k<P.i?"done":k===P.i?"now":""}"></i>`).join("")}</div></div>
        <div class="row"><span class="timer">This question <b id="pQ">0:00</b></span><button class="btn" id="pQuit">${peerQuit?"Click again to end":"End early"}</button></div>
      </div>
      <div class="peer-grid">
        <div class="stack">
          <div class="card stack">
            <div class="qmeta"><span class="eyebrow">Read aloud</span><span class="eyebrow">${SECTION_NAME[sec]}${sec==="tech"?" · "+esc(it.t):""}</span><span class="hint">aim for about ${target>=120?"2 min":"90 sec"}</span></div>
            <p class="q" style="margin:0;font-size:1.45rem">${esc(it.q)}</p>
          </div>
          <div class="card stack">
            <h3>What a strong answer includes</h3><p class="hint" style="margin:-6px 0 0">Tick each point as they say it.</p>
            <ul class="tl-check">${it.points.map((p,j)=>`<li><input type="checkbox" id="pp${j}" data-pt="${j}" ${it.hit.includes(j)?"checked":""}><label for="pp${j}">${esc(p)}</label></li>`).join("")}</ul>
            <details class="qa" style="border:0;padding:0"><summary><span></span><span class="linkbtn">Show the full model answer</span><span></span></summary><div class="model" style="margin-top:8px">${it.a}</div></details>
          </div>
          <div class="card stack" style="gap:6px">
            <span class="eyebrow">Then ask the follow-up</span>
            <p style="margin:0;font-weight:500;font-size:1.05rem">${esc(it.fu)}</p>
            <button class="linkbtn" id="pFu" style="align-self:flex-start">Different follow-up</button>
          </div>
        </div>
        <div class="card stack">
          <h3>Score this answer</h3>
          ${RUBRIC.map(r=>`<div class="rub"><div><b>${fitQ&&r.fitName?r.fitName:r.name}</b><span class="hint">${fitQ&&r.fitTip?r.fitTip:r.tip}</span></div>
            <div class="r5" role="group" aria-label="${r.name} score">${[1,2,3,4,5].map(v=>`<button data-rk="${r.k}" data-rv="${v}" aria-pressed="${it.scores[r.k]===v}">${v}</button>`).join("")}</div></div>`).join("")}
          <p class="hint" style="margin:0">1 = missed it · 3 = acceptable · 5 = would impress a VP</p>
          <div><label for="pNotes">One note for ${esc(P.cand||"the candidate")}</label><textarea id="pNotes" style="min-height:90px" placeholder="Keep the headline-first start. You forgot the tax effect on cash.">${esc(it.notes)}</textarea></div>
          <div class="row"><button class="btn primary" id="pNext" ${allScored?"":"disabled"}>${P.i+1<P.items.length?"Next question":"Finish and see scorecard"}</button><button class="btn" id="pSkip">Skip</button></div>
          ${allScored?"":`<p class="hint" style="margin:0">Score all three to continue.</p>`}
        </div>
      </div>`;
    root.querySelectorAll("[data-pt]").forEach(c=>c.onchange=()=>{const j=+c.dataset.pt;it.hit=c.checked?[...new Set([...it.hit,j])]:it.hit.filter(x=>x!==j);peerPersist();});
    root.querySelectorAll("[data-rk]").forEach(b=>b.onclick=()=>{it.scores[b.dataset.rk]=+b.dataset.rv;it.notes=$("#pNotes").value;peerPersist();renderPeer();});
    $("#pNotes").oninput=e=>{it.notes=e.target.value;peerPersist();};
    $("#pFu").onclick=()=>{const l=(FOLLOWUPS[it.t]||FOLLOWUPS.Fit).filter(x=>x!==it.fu);it.fu=l[Math.floor(Math.random()*l.length)];peerPersist();renderPeer();};
    $("#pNext").onclick=()=>{it.notes=$("#pNotes").value;peerNext(false);};
    $("#pSkip").onclick=()=>{it.notes=$("#pNotes").value;it.scores={};peerNext(true);};
    $("#pQuit").onclick=()=>{if(!peerQuit){peerQuit=true;$("#pQuit").textContent="Click again to end";return;}peerQuit=false;it.notes=$("#pNotes").value;it.secs=Math.round((Date.now()-P.qStart)/1000);
      if(!RUBRIC.every(r=>it.scores[r.k])){P.i--;}finishPeer();peerPersist();renderPeer();};
    peerTick=setInterval(()=>{const q=$("#pQ");if(!q)return clearInterval(peerTick);const s=(Date.now()-P.qStart)/1000;q.textContent=fmtT(s);q.classList.toggle("over",s>target*1.5);},1000);
    return;
  }
  // scorecard
  const o=P.overall, v=peerVerdict(o), vcls={"Would advance":"v-Strong","Borderline":"v-Borderline","Not yet":"v-Fail","Not scored":"v-Pass"}[v];
  const dim=r=>{const vals=P.items.map(it=>it.scores[r.k]).filter(Boolean);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;};
  const mins=Math.max(1,Math.round((P.ended-P.started)/6e4));
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <span class="eyebrow">Peer mock scorecard${P.cand?" · "+esc(P.cand):""}</span>
      <div class="sc-top"><div class="score"><b>${o!=null?o.toFixed(1):"–"}<small>/10</small></b><span class="verdict ${vcls}">${v}</span></div>
        <p class="hint" style="margin:0">${P.items.length} questions in ${mins} min${P.me?" · interviewed by "+esc(P.me):""}</p></div>
      <div class="secbars">${RUBRIC.map(r=>{const d=dim(r);return d==null?"":`<div class="secrow"><span>${r.name}</span><div class="bar" style="max-width:none;margin:0"><i style="width:${d*20}%"></i></div><b>${d.toFixed(1)}</b></div>`;}).join("")}</div>
      <p class="hint" style="margin:-4px 0 0">Rubric averages out of 5.</p>
      <div class="grid2">
        <div><label for="pStrength">Biggest strength</label><textarea id="pStrength" style="min-height:70px" placeholder="Clear structure on technicals; confident resume story.">${esc(P.strength)}</textarea></div>
        <div><label for="pFix">Fix first</label><textarea id="pFix" style="min-height:70px" placeholder="Cash flow effects in the accounting walk-throughs.">${esc(P.fix)}</textarea></div>
      </div>
      <div class="row"><button class="btn primary" id="pCopy">Copy scorecard to send</button><button class="btn" id="pSwap">Swap roles</button><button class="btn" id="pNew">New session</button></div>
      <textarea id="pCopyBox" readonly hidden style="min-height:180px"></textarea>
      ${o!=null&&!P.counted?`<label style="display:flex;gap:8px;align-items:center;font-weight:500;color:var(--ink);font-size:.9rem;margin:0"><input type="checkbox" id="pMine" style="width:auto"> I was the candidate. Count these scores toward my readiness.</label>`:P.counted?`<p class="hint" style="margin:0">Counted toward your readiness score.</p>`:""}
    </div>
    <div class="card stack" style="gap:8px"><h3>Question by question</h3>
      ${P.items.map((it,k)=>{const s=itemScore(it);return `<details class="qa"><summary><span class="qs ${s==null?"":s>=8?"hi":s>=5?"mid":"lo"}">${s==null?"–":s.toFixed(0)}</span><span>${esc(it.q)}</span><span class="hint">${fmtT(it.secs)}</span></summary>
        <div class="qa-body">
          ${it.skipped?`<p class="hint" style="margin:0">Skipped</p>`:`<div class="hint">${RUBRIC.map(r=>`${r.name} ${it.scores[r.k]||"–"}/5`).join(" · ")} · hit ${it.hit.length} of ${it.points.length} key points</div>`}
          ${it.notes?`<div><span class="eyebrow">Interviewer's note</span><p class="mine">${esc(it.notes)}</p></div>`:""}
          <div><span class="eyebrow">Model answer</span><div class="model">${it.a}</div></div>
        </div></details>`;}).join("")}
    </div>
  </div>`;
  $("#pStrength").oninput=e=>{P.strength=e.target.value;peerPersist();};
  $("#pFix").oninput=e=>{P.fix=e.target.value;peerPersist();};
  $("#pCopy").onclick=async()=>{const t=peerScorecardText();try{await navigator.clipboard.writeText(t);toast("Scorecard copied");}catch(err){const b=$("#pCopyBox");b.hidden=false;b.value=t;b.select();toast("Select the text and copy it");}};
  $("#pSwap").onclick=()=>startPeer({me:P.cand,cand:P.me,mix:P.mix,diff:P.diff,n:P.items.length||8});
  $("#pNew").onclick=()=>{P=null;peerPersist();renderPeer();};
  const mine=$("#pMine");
  if(mine)mine.onchange=()=>{if(!mine.checked)return;
    P.items.forEach(it=>{const s=itemScore(it);if(s!=null){S.mockHist.unshift({q:it.q,t:it.t,score:Math.round(s),at:Date.now(),peer:true});if(it.id)grade(it.id,s>=8?2:s>=5?1:0,"mock");}});
    S.mockHist=S.mockHist.slice(0,40);P.counted=true;save();peerPersist();renderHist();renderPeer();toast("Added to your readiness");};
}
function setMockMode(m){
  mockMode=m; try{localStorage.setItem("superday-mockmode",m);}catch(e){}
  $("#mockAI").hidden=m!=="ai"; $("#peerRoot").hidden=m!=="peer";
  document.querySelectorAll("[data-mm]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mm===m)));
  if(m==="peer")renderPeer();
}
document.querySelectorAll("[data-mm]").forEach(b=>b.onclick=()=>setMockMode(b.dataset.mm));
