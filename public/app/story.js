/* Superday Prep · Resume story builder.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Your story: "Walk me through your resume" ---------- */
let storyBusy=false, rehearse=null, rehTick=null, pdfBusy=false, rehFeedback="";
const ST=()=>S.story||(S.story={});
const wordsOf=t=>(t||"").trim().split(/\s+/).filter(Boolean).length;
const speakSecs=t=>Math.round(wordsOf(t)/150*60);
const timeClass=(secs,tgt)=>Math.abs(secs-tgt)<=Math.max(10,tgt*.15)?"ok":secs>tgt?"long":"short";
function templateStory(tgt){
  const m=me();
  return {story:`I grew up in [hometown], and I chose ${m.school} because [one honest reason: a scholarship, family, a strong program]. I got interested in finance when [the moment: a class, a family business, investing your own money]. Since then I've tried to build real experience. At [your most relevant experience], I [what you did], which taught me [what you learned]. Then at [your second experience], I [what you did], and that's where I realized I wanted to work on transactions. ${m.short} doesn't have a big banking pipeline, so I've built my own path: [your networking, technical prep and clubs]. That's why I'm here. I want the steep learning curve of investment banking, and [why this firm].`,
    beats:[{label:"Background",cue:"Hometown, why my school",seconds:12},{label:"The spark",cue:"When finance clicked",seconds:14},{label:"Experience 1",cue:"Role, task, lesson",seconds:20},{label:"Experience 2",cue:"Role, task, why deals",seconds:20},{label:"Building my path",cue:"Non-target hustle",seconds:10},{label:"Why banking, why here",cue:"Learning curve, this firm",seconds:14}].map(b=>({...b,seconds:Math.round(b.seconds*tgt/90)})),
    follow_ups:["What did you actually do day to day in your most recent role?","What's the most analytical project on your resume, and what did you find?","Why did you choose your major?","What's one thing on your resume you're most proud of?","Tell me about something on your resume that didn't go to plan.","What would your last manager say you need to work on?"],
    flags:[],ai:false};
}
async function buildStory(){
  const s=ST();
  s.resume=$("#stResume").value.trim(); s.bg=$("#stBg").value.trim(); s.why=$("#stWhy").value.trim(); s.target=+$("#stLen").value||90;
  if(s.resume.length<60){toast("Paste your resume first, or upload the PDF");return;}
  storyBusy=true; save(); renderStory();
  await sampleReady;
  let out=null; const tgt=s.target, words=Math.round(tgt/60*150);
  if(sampleFn){
    const m=me();
    try{
      const r=await sampleFn.run("story",{me:m,resume:s.resume,bg:s.bg||"",why:s.why||"",seconds:tgt});
      const strs=(a,n)=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,n):[];
      if(r&&typeof r.story==="string"&&r.story.length>150){
        const beats=(Array.isArray(r.beats)?r.beats:[]).filter(b=>b&&b.label).slice(0,7).map(b=>({label:String(b.label),cue:String(b.cue||""),seconds:Math.max(3,Math.round(+b.seconds||10))}));
        const flags=(Array.isArray(r.flags)?r.flags:[]).filter(f=>f&&f.issue).slice(0,4).map(f=>({issue:String(f.issue),framing:String(f.framing||"")}));
        out={story:r.story,beats:beats.length?beats:templateStory(tgt).beats,follow_ups:strs(r.follow_ups,8),flags,ai:true};
      }
    }catch(e){}
  }
  if(!out){out=templateStory(tgt);toast(sampleFn?"Couldn't reach the AI, so here's a template to fill in":"Here's a template to fill in from your resume");}
  Object.assign(s,out,{built:Date.now()}); storyBusy=false; save(); renderStory();
}
function loadScript(src){return new Promise((res,rej)=>{const el=document.createElement("script");el.src=src;el.onload=res;el.onerror=rej;document.head.appendChild(el);});}
async function readPdf(file){
  const base="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  if(!window.pdfjsLib){await loadScript(base+"pdf.worker.min.js");await loadScript(base+"pdf.min.js");} // worker in the page itself: no separate worker file needed
  const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
  const lines=[];
  for(let p=1;p<=Math.min(pdf.numPages,4);p++){
    const tc=await (await pdf.getPage(p)).getTextContent(); let lastY=null, line="";
    tc.items.forEach(it=>{const y=Math.round(it.transform[5]);if(lastY!==null&&Math.abs(y-lastY)>2){lines.push(line);line="";}line+=it.str+" ";lastY=y;});
    lines.push(line);
  }
  return lines.map(l=>l.replace(/\s+/g," ").trim()).filter(Boolean).join("\n");
}
function practiceInMock(q,full){
  const s=ST();
  const ctx=`Resume: ${(s.resume||"").slice(0,2500)}${full&&s.story?" | The story they prepared: "+s.story.slice(0,1500):""}`;
  setMock({q,t:"Fit",l:full?"Basic":"Intermediate",a:full?byId("f1").a:"",refId:full?"f1":"",notes:ctx,notesKind:full?"resume_story":"resume"});
  setMockMode("ai"); location.hash="#mock"; setTimeout(()=>$("#mockAnswer").focus(),50);
}
function renderStory(){
  const root=$("#storyRoot"); if(!root)return;
  clearInterval(rehTick);
  const s=ST(), tgt=s.target||90, secs=speakSecs(s.story), blanks=((s.story||"").match(/\[[^\]]+\]/g)||[]).length;
  const tc=s.story?timeClass(secs,tgt):"";
  const att=(s.rehearsals||[]).slice(0,8);
  const beatsHtml=(s.beats||[]).map(b=>`<div class="beat" style="flex-grow:${b.seconds}"><span class="eyebrow">${esc(b.label)} · ${b.seconds}s</span><b>${esc(b.cue)}</b></div>`).join("");
  let reh;
  if(rehearse){
    reh=`<div class="reh"><span class="reh-timer" id="rehT">0:00</span><span class="hint">Target ${fmtT(tgt)} · say it out loud, start to finish</span>
      <ol class="cues">${(s.beats||[]).map(b=>`<li><small>${esc(b.label)}</small>${esc(b.cue)}</li>`).join("")}</ol>
      <div class="row"><button class="btn primary" data-st="rehdone">Done</button><button class="btn" data-st="rehcancel">Cancel</button></div></div>`;
  }else{
    reh=`<div class="row"><button class="btn primary" data-st="reh" ${s.story?"":"disabled"}>Start a timed run-through</button>${rehFeedback?`<span class="hint" style="color:var(--ink)">${esc(rehFeedback)}</span>`:""}</div>
      ${att.length?`<div><span class="eyebrow">Recent run-throughs</span><div class="attempts">${att.map(a=>`<span class="${timeClass(a.secs,a.tgt||tgt)==="ok"?"ok":"off"}">${fmtT(a.secs)}</span>`).join("")}</div></div>`:""}`;
  }
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div><span class="eyebrow">Your story</span><h2 style="margin-top:4px">"Walk me through your resume"</h2>
      <p class="hint" style="margin:6px 0 0;max-width:64ch">Almost every interview opens with this, and it sets the tone for everything after. Paste your resume, add two things a resume can't show, and get a story you can rehearse. Your resume is saved only to your account.</p></div>
      <div><div class="row" style="justify-content:space-between;margin-bottom:4px"><label for="stResume" style="margin:0">Resume text</label><span class="row"><button class="btn sm" data-st="pdf" ${pdfBusy?"disabled":""}>${pdfBusy?"Reading PDF...":"Upload PDF"}</button><input type="file" id="stPdf" accept="application/pdf,.pdf" hidden></span></div>
        <textarea id="stResume" style="min-height:170px" placeholder="Paste your resume here, or upload the PDF.">${esc(s.resume||"")}</textarea></div>
      <div class="grid2">
        <div><label for="stBg">Where you're from, and why you chose your school</label><input id="stBg" value="${esc(s.bg||"")}" placeholder="Grew up outside Kansas City; in-state scholarship"></div>
        <div><label for="stWhy">How you got interested in finance</label><input id="stWhy" value="${esc(s.why||"")}" placeholder="Helped with my parents' small business books in high school"></div>
      </div>
      <div class="row"><label for="stLen" class="sr">Length</label><select id="stLen" style="width:auto">${[[60,"60 seconds"],[90,"90 seconds"],[120,"2 minutes"]].map(([v,l])=>`<option value="${v}" ${v===tgt?"selected":""}>${l}</option>`).join("")}</select>
        <button class="btn primary" data-st="build" ${storyBusy?"disabled":""}>${s.story?"Rebuild my story":"Build my story"}</button>${s.story?`<span class="hint">Rebuilding replaces your edits.</span>`:""}</div>
      ${storyBusy?`<div class="thinking"><span class="dot"></span>Turning your resume into a story...</div>`:""}
    </div>
    ${s.story?`<div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>Your ${tgt===120?"2-minute":tgt+"-second"} story</h3><span class="stime ${tc}" id="stTime">${wordsOf(s.story)} words · about ${fmtT(secs)} spoken</span></div>
      <div class="beats">${beatsHtml}</div>
      <label for="stStory" class="sr">Your story</label><textarea id="stStory" style="min-height:230px">${esc(s.story)}</textarea>
      ${blanks?`<p class="tl-alert" style="background:var(--bg)">Fill in the ${blanks} [bracketed] part${blanks>1?"s":""} with your own details before you rehearse.</p>`:""}
      <div class="row"><button class="btn" data-st="copy">Copy</button><span class="hint">Edit until it sounds like you talking, not like your resume.${s.ai?"":" This is a template; fill it in from your resume."}</span></div>
    </div>
    <div class="card stack"><div><h3>Rehearse out loud</h3><p class="hint" style="margin:2px 0 0">Say it out loud using only the cues, and stop the clock when you finish. Aim for ${fmtT(tgt)}, give or take ${Math.max(10,Math.round(tgt*.15))} seconds.</p></div>${reh}</div>
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>Questions they'll ask about your resume</h3><button class="btn primary sm" data-st="mockfull">Practice the full walk-through</button></div>
      ${(s.follow_ups||[]).length?`<ul class="hooks">${s.follow_ups.map((q,i)=>`<li><span>${esc(q)}</span><button class="btn sm" data-st="mock:${i}">Practice</button></li>`).join("")}</ul>`:""}
      ${(s.flags||[]).length?`<div><h3 style="margin-bottom:6px">Be ready to explain</h3><ul class="flags">${s.flags.map(f=>`<li><b>${esc(f.issue)}</b><span>${esc(f.framing)}</span></li>`).join("")}</ul></div>`:""}
      <p class="hint" style="margin:0">Practice opens the mock interviewer with your resume attached, so the grade reflects your real experience. The superday simulation uses your resume for its opening question too.</p>
    </div>`:""}
  </div>`;
  const s2=ST();
  $("#stResume").oninput=e=>{s2.resume=e.target.value;fpSave();};
  $("#stBg").oninput=e=>{s2.bg=e.target.value;fpSave();};
  $("#stWhy").oninput=e=>{s2.why=e.target.value;fpSave();};
  $("#stPdf").onchange=async e=>{const f=e.target.files[0];if(!f)return;pdfBusy=true;renderStory();
    try{const t=await readPdf(f);if(t.length<40)throw new Error("empty");s2.resume=t;save();toast("Resume loaded. Check the text, then build your story");}
    catch(err){toast("Couldn't read that PDF. Paste the text instead");}
    pdfBusy=false;renderStory();};
  const ta=$("#stStory");
  if(ta)ta.oninput=e=>{s2.story=e.target.value;fpSave();const sec=speakSecs(s2.story),el=$("#stTime");el.textContent=`${wordsOf(s2.story)} words · about ${fmtT(sec)} spoken`;el.className="stime "+timeClass(sec,s2.target||90);};
  if(rehearse)rehTick=setInterval(()=>{const t=$("#rehT");if(!t)return clearInterval(rehTick);t.textContent=fmtT((Date.now()-rehearse.start)/1000);},250);
}
$("#storyRoot").addEventListener("click",async e=>{
  const b=e.target.closest("[data-st]"); if(!b)return;
  const [act,arg]=b.dataset.st.split(":"), s=ST();
  if(act==="build")buildStory();
  else if(act==="pdf")$("#stPdf").click();
  else if(act==="copy"){try{await navigator.clipboard.writeText(s.story);toast("Story copied");}catch(err){$("#stStory").select();toast("Select the text and copy it");}}
  else if(act==="reh"){rehearse={start:Date.now()};rehFeedback="";renderStory();}
  else if(act==="rehcancel"){rehearse=null;renderStory();}
  else if(act==="rehdone"){
    const secs=Math.round((Date.now()-rehearse.start)/1000), tgt=s.target||90; rehearse=null;
    if(secs>=10){s.rehearsals=[{at:Date.now(),secs,tgt},...(s.rehearsals||[])].slice(0,20);save();}
    const d=secs-tgt, c=timeClass(secs,tgt);
    rehFeedback=secs<10?"That was under 10 seconds, so it wasn't saved.":c==="ok"?`${fmtT(secs)}. Right on time.`:c==="long"?`${fmtT(secs)}, about ${d} seconds long. Cut the weakest beat or shorten the experiences.`:`${fmtT(secs)}, about ${-d} seconds short. Add one concrete detail to an experience.`;
    renderStory();
  }
  else if(act==="mockfull")practiceInMock("Walk me through your resume.",true);
  else if(act==="mock")practiceInMock(s.follow_ups[+arg],false);
});
