/* Superday Prep · Firm prep: call prep, call log and Why-this-firm answers.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Firm prep: networking to interview ---------- */
const FIRM_STAGES=["Networking","Applied","First round","Superday","Offer"];
let selFirm=null, prepOpen=null, prepBusy=null, whyBusy=false, justLogged=null, logIdx=null, simPrefill=null;
const fkey=f=>String(f||"").trim().toLowerCase();
const lowerFirst=s=>s?s.charAt(0).toLowerCase()+s.slice(1):s;
const lastNoteLine=c=>((c.notes||"").split("\n").map(s=>s.trim()).filter(Boolean).pop()||"").replace(/^Call \d{4}-\d{2}-\d{2}:\s*/,"");
function firmList(){
  const m=new Map();
  S.contacts.forEach(c=>{if(!c.firm)return;const k=fkey(c.firm);if(!m.has(k))m.set(k,{name:c.firm.trim(),people:[]});m.get(k).people.push(c);});
  Object.entries(S.firms||{}).forEach(([k,v])=>{if(!m.has(k))m.set(k,{name:v.name||k,people:[]});});
  return [...m.values()].map(f=>({...f,info:(S.firms||{})[fkey(f.name)]||{}}))
    .sort((a,b)=>(a.info.date||"9999").localeCompare(b.info.date||"9999")||b.people.length-a.people.length||a.name.localeCompare(b.name));
}
function finfo(name){S.firms=S.firms||{};const k=fkey(name);return S.firms[k]||(S.firms[k]={name});}
let fpSaveT; function fpSave(){clearTimeout(fpSaveT);fpSaveT=setTimeout(save,700);}

/* call prep */
function seniority(role){const r=(role||"").toLowerCase();return /\b(md|managing director|director|vp|vice president|partner|head)\b/.test(r)?"senior":/associate/.test(r)?"associate":"analyst";}
function fallbackPrep(c){
  const m=me(), first=(c.name||"").split(" ")[0]||"there", lvl=seniority(c.role);
  const Q={
    analyst:["What does a typical week look like in your group right now?","What surprised you most about your first year?",`How did you approach recruiting${c.tie?" coming from "+c.tie.split(/[',;]/)[0].trim():""}, and what would you do differently?`,"What separates the analysts who do best in the group?","Is there anyone else at the firm you'd suggest I speak with?"],
    associate:["What's a recent deal you enjoyed working on, and why?","When you interview analyst candidates, what makes someone stand out?","How has the group's deal flow changed over the past year?","What do the strongest first-year analysts do differently?","Would you be open to me staying in touch as recruiting picks up?"],
    senior:["Which sectors or deal types is the group most focused on going forward?","What do you look for in an analyst in their first year?","What do you wish more candidates understood about the firm?","How did your own path shape the way you think about recruiting?","Is there someone on the team you'd suggest I connect with next?"]
  }[lvl];
  return {opener:`Thanks so much for making the time, ${first}. I'm a ${m.year} at ${m.school} studying ${m.major}, working toward ${m.target}. ${c.tie?"Since we share a connection through "+c.tie+", ":""}I'd love to hear how you got to ${c.firm} and what your work looks like day to day.`,
    questions:Q,avoid:["Don't ask about pay, bonuses or hours.","Don't ask for a referral or a job outright. Earn it by being prepared, and let them offer."],
    close:`"This has been really helpful. Would it be all right if I followed up as recruiting gets closer, and is there anyone else you'd suggest I speak with?"`,ai:false};
}
async function generatePrep(i){
  const c=S.contacts[i]; if(!c)return;
  prepBusy=i; renderFirms();
  await sampleReady;
  let prep=null;
  if(sampleFn){
    const m=me(), others=S.contacts.filter(x=>x!==c&&fkey(x.firm)===fkey(c.firm)&&x.notes).map(x=>`${x.name}${x.role?" ("+x.role+")":""}: ${x.notes}`).join(" | ").slice(0,800);
    try{
      const r=await sampleFn.run("call_prep",{me:m,contact:{name:c.name,role:c.role||"",firm:c.firm,tie:c.tie||"",stage:c.stage||"",notes:c.notes||""},others});
      const arr=(a,n)=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,n):[];
      if(r&&typeof r.opener==="string"&&arr(r.questions,5).length)prep={opener:r.opener,questions:arr(r.questions,6),avoid:arr(r.avoid,3),close:typeof r.close==="string"?r.close:"",ai:true};
    }catch(e){}
  }
  if(S.contacts[i]===c){c.prep={...(prep||fallbackPrep(c)),at:Date.now()};save();}
  prepBusy=null; renderFirms();
}
function prepText(c){const p=c.prep;return [`Call prep: ${c.name}, ${c.role?c.role+", ":""}${c.firm}`,"","Opener:",p.opener,"","Questions:",...p.questions.map((q,k)=>`${k+1}. ${q}`),"","Avoid:",...p.avoid.map(x=>"- "+x),"","Close:",p.close].join("\n");}

/* why us */
function templateWhy(firm,info,people){
  const m=me();
  const mention=people.filter(c=>c.notes).slice(0,2).map(c=>{
    const s=lastNoteLine(c).split(/[.;]/)[0].trim().replace(/^(said|says|mentioned|told me|explained)\s+(that\s+)?/i,"");
    return `${(c.name||"").split(" ")[0]} told me ${lowerFirst(s)}`;});
  return `A few things draw me to ${firm}. First, the people. ${mention.length?"In my conversations here, "+mention.join(", and ")+". ":"[Name someone you've spoken with and what they told you.] "}Second, ${info.draw?lowerFirst(info.draw.trim().replace(/\.$/,"")):"[what draws you: the group's focus, the size of deals, the office]"}. ${info.deals?"I've also been following "+lowerFirst(info.deals.trim().replace(/\.$/,""))+". ":""}And as a ${m.short} student who built my own path into finance, I want a place where analysts get real responsibility early, which is what I've heard consistently about ${firm}.`;
}
async function draftWhy(f){
  const info=finfo(f.name); whyBusy=true; renderFirms();
  await sampleReady;
  let done=false;
  if(sampleFn){
    const m=me();
    const ppl=f.people.map(c=>`- ${c.name}${c.role?", "+c.role:""}${c.tie?" ("+c.tie+")":""}. Stage: ${c.stage}. Notes: ${c.notes||"none"}`).join("\n");
    try{
      const r=await sampleFn.run("why_firm",{me:m,firm:f.name,group:info.group||"",people:ppl,draw:info.draw||"",deals:info.deals||""});
      const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
      if(r&&typeof r.answer==="string"&&r.answer.length>40){Object.assign(info,{whyUs:r.answer,talking:arr(r.talking_points),ask:arr(r.ask_interviewer),gaps:arr(r.gaps),ai:true});done=true;}
    }catch(e){}
  }
  if(!done){Object.assign(info,{whyUs:templateWhy(f.name,info,f.people),talking:[],ask:[],gaps:f.people.some(c=>c.notes)?[]:["Talk to at least one person at the firm, then log the call."],ai:false});toast(sampleFn?"Couldn't reach the AI, so here's a template to edit":"Here's a template built from your notes");}
  info.updated=Date.now(); save(); whyBusy=false; renderFirms();
}
function cheatSheet(f){
  const info=(S.firms||{})[fkey(f.name)]||{};
  const L=[`${f.name}: interview cheat sheet`,[info.stage,info.date&&fmtDay(parseIso(info.date)),info.group].filter(Boolean).join(" · "),"",`WHY ${f.name.toUpperCase()}?`,info.whyUs||"(not written yet)",""];
  if(f.people.length){L.push("PEOPLE TO MENTION");f.people.forEach(c=>L.push(`- ${c.name}${c.role?" ("+c.role+")":""}${c.notes?": "+lastNoteLine(c):""}`));L.push("");}
  if(info.deals)L.push("DEALS AND FACTS",info.deals,"");
  if(info.ask?.length){L.push("QUESTIONS TO ASK");info.ask.forEach(q=>L.push("- "+q));}
  return L.join("\n").trim();
}

/* rendering */
function renderFirms(){
  const root=$("#firmRoot"); if(!root)return;
  const list=firmList();
  if(selFirm&&!list.some(f=>fkey(f.name)===fkey(selFirm)))selFirm=null;
  if(!selFirm&&list.length)selFirm=list[0].name;
  const f=list.find(x=>fkey(x.name)===fkey(selFirm));
  const side=`<aside class="card stack" style="gap:8px"><h3>Your firms</h3>
    ${list.length?`<ul class="flist">${list.map(x=>`<li><button data-firm="${esc(x.name)}" aria-current="${f&&x===f}"><b>${esc(x.name)}</b><span>${x.people.length} ${x.people.length===1?"person":"people"}${x.info.stage?" · "+esc(x.info.stage):""}${x.info.date?" · "+fmtDay(parseIso(x.info.date)):""}</span></button></li>`).join("")}</ul>`:`<p class="hint" style="margin:0">Firms appear here from your networking contacts, or add one below.</p>`}
    <form id="addFirm" class="row" style="flex-wrap:nowrap"><label for="newFirm" class="sr">Firm name</label><input id="newFirm" placeholder="Add a firm" style="min-width:0"><button class="btn sm" type="submit">Add</button></form>
  </aside>`;
  if(!f){root.innerHTML=`<div class="firmgrid">${side}<div class="card empty"><h2>Turn your networking into interview answers</h2><p>Each firm gets a prep page: call prep for every person you talk to, a place to log what they told you, and a "Why us?" answer built from those conversations. Start by adding contacts in Networking, or add a firm on the left.</p><div class="row"><a class="btn primary" href="#network">Go to Networking</a></div></div></div>`;bindFirmSide();return;}
  const info=(S.firms||{})[fkey(f.name)]||{};
  const people=f.people.map(c=>({c,i:S.contacts.indexOf(c)}));
  const hot=["Replied","Call set","Called","Thanked","Referred"];
  const li=a=>(a||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const personHtml=({c,i})=>`<div class="person">
    <div class="row" style="justify-content:space-between"><div><b>${esc(c.name)}</b>${c.example?'<span class="ex">EXAMPLE</span>':""}<span class="hint"> ${esc(c.role||"")}${c.tie?" · "+esc(c.tie):""}</span></div><span class="stage ${hot.includes(c.stage)?"hot":""}">${esc(c.stage)}</span></div>
    <p class="pnotes">${c.notes?esc(c.notes):'<i class="hint">No notes yet. After your call, log what they told you.</i>'}</p>
    ${justLogged===i?`<div class="logged"><span>Call logged. Send your thank-you today.</span><button class="btn sm primary" data-fp="thanks:${i}">Draft thank-you</button></div>`:""}
    <div class="row"><button class="btn sm" data-fp="prep:${i}" aria-expanded="${prepOpen===i}">${prepOpen===i?"Hide call prep":"Prep for call"}</button><button class="btn sm" data-fp="log:${i}">Log a call</button><button class="linkbtn" data-fp="edit:${i}">Edit</button></div>
    ${prepOpen===i?(prepBusy===i?`<div class="prep thinking"><span class="dot"></span>Writing your call prep...</div>`:c.prep?`<div class="prep">
      <div><span class="eyebrow">Open with</span><p style="margin:4px 0 0">${esc(c.prep.opener)}</p></div>
      <div><span class="eyebrow">Questions to ask</span><ol>${li(c.prep.questions)}</ol></div>
      <div class="grid2"><div><span class="eyebrow">Avoid</span><ul>${li(c.prep.avoid)}</ul></div><div><span class="eyebrow">Close</span><p style="margin:4px 0 0">${esc(c.prep.close)}</p></div></div>
      <div class="row"><button class="btn sm" data-fp="copyprep:${i}">Copy</button><button class="linkbtn" data-fp="regen:${i}">${sampleFn?"Regenerate":"Refresh"}</button>${c.prep.ai?"":`<span class="hint">Template prep${sampleFn?"":". AI prep isn't available in this view"}.</span>`}</div>
    </div>`:""):""}
  </div>`;
  const withNotes=f.people.filter(c=>c.notes).length;
  root.innerHTML=`<div class="firmgrid">${side}<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h2>${esc(f.name)}</h2>${info.date?`<span class="hdr-count">${(()=>{const d=Math.round((parseIso(info.date)-today())/DAY);return d<0?"Interview passed":d===0?"Interview today":d+(d===1?" day":" days")+" to interview";})()}</span>`:""}</div>
      <div class="grid3">
        <div><label for="fpStage">Where you are</label><select id="fpStage"><option value="">Not set</option>${FIRM_STAGES.map(s=>`<option ${info.stage===s?"selected":""}>${s}</option>`).join("")}</select></div>
        <div><label for="fpDate">Interview date</label><input id="fpDate" type="date" value="${esc(info.date||"")}"></div>
        <div><label for="fpGroup">Group</label><input id="fpGroup" value="${esc(info.group||"")}" placeholder="Industrials"></div>
      </div>
    </div>
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>People you've spoken with</h3><button class="btn sm" data-fp="addperson">Add person</button></div>
      ${people.length?people.map(personHtml).join(""):`<p class="hint" style="margin:0">No one at ${esc(f.name)} yet. Add the people you plan to reach out to, then prep for each call here.</p>`}
    </div>
    <div class="card stack">
      <div><h3>Why ${esc(f.name)}?</h3><p class="hint" style="margin:2px 0 0">Built from your own call notes, so it names real conversations. ${sampleFn?"The AI only uses what's on this page and won't invent facts about the firm.":"Fill in the boxes and build a draft from your notes."}</p></div>
      <div class="grid2">
        <div><label for="fpDraw">What draws you to ${esc(f.name)}?</label><textarea id="fpDraw" style="min-height:80px" placeholder="Lean deal teams, the Chicago office, the group's healthcare focus...">${esc(info.draw||"")}</textarea></div>
        <div><label for="fpDeals">Deals or facts you know</label><textarea id="fpDeals" style="min-height:80px" placeholder="From the firm's website or recent news. Only what you've actually read.">${esc(info.deals||"")}</textarea></div>
      </div>
      <div class="row"><button class="btn primary" data-fp="draft" ${whyBusy?"disabled":""}>${info.whyUs?"Redraft my answer":"Draft my answer"}</button><span class="hint">${withNotes} conversation${withNotes===1?"":"s"} with notes will be used</span></div>
      ${whyBusy?`<div class="thinking"><span class="dot"></span>Drafting from your notes...</div>`:""}
      <div><label for="fpWhy">Your answer (edit it until it sounds like you)</label><textarea id="fpWhy" placeholder="Draft your answer above, or write it here.">${esc(info.whyUs||"")}</textarea></div>
      ${(info.talking?.length||info.gaps?.length||info.ask?.length)?`<div class="grid3 fb">
        <div><h3>Talking points</h3><ul>${li(info.talking)||"<li>–</li>"}</ul></div>
        <div><h3>Make it stronger</h3><ul>${li(info.gaps)||"<li>Looks solid. Practice it out loud.</li>"}</ul></div>
        <div><h3>Ask your interviewer</h3><ul>${li(info.ask)||"<li>–</li>"}</ul></div></div>`:""}
      <div class="row"><button class="btn" data-fp="mock">Practice in a mock interview</button><button class="btn" data-fp="sim">Run a superday for ${esc(f.name)}</button><button class="btn" data-fp="sheet">Copy cheat sheet</button></div>
      <textarea id="fpCopyBox" readonly hidden style="min-height:160px"></textarea>
    </div>
  </div></div>`;
  bindFirmSide();
  const upd=(k,v)=>{finfo(f.name)[k]=v;fpSave();};
  $("#fpStage").onchange=e=>{upd("stage",e.target.value);save();renderFirms();};
  $("#fpDate").onchange=e=>{upd("date",e.target.value);save();renderFirms();};
  $("#fpGroup").oninput=e=>upd("group",e.target.value.trim());
  $("#fpDraw").oninput=e=>upd("draw",e.target.value);
  $("#fpDeals").oninput=e=>upd("deals",e.target.value);
  $("#fpWhy").oninput=e=>upd("whyUs",e.target.value);
}
function bindFirmSide(){
  $("#addFirm").onsubmit=e=>{e.preventDefault();const v=$("#newFirm").value.trim();if(!v)return;finfo(v).name=v;selFirm=v;prepOpen=null;save();renderFirms();};
}
$("#firmRoot").addEventListener("click",async e=>{
  const fb=e.target.closest("[data-firm]"); if(fb){selFirm=fb.dataset.firm;prepOpen=null;justLogged=null;renderFirms();return;}
  const b=e.target.closest("[data-fp]"); if(!b)return;
  const [act,arg]=b.dataset.fp.split(":"), i=arg!=null?+arg:null, f=firmList().find(x=>fkey(x.name)===fkey(selFirm));
  if(act==="prep"){if(prepOpen===i){prepOpen=null;renderFirms();return;}prepOpen=i;if(!S.contacts[i].prep)generatePrep(i);else renderFirms();}
  else if(act==="regen")generatePrep(i);
  else if(act==="copyprep"){const t=prepText(S.contacts[i]);try{await navigator.clipboard.writeText(t);toast("Call prep copied");}catch(err){const box=$("#fpCopyBox");box.hidden=false;box.value=t;box.select();toast("Select the text and copy it");}}
  else if(act==="log")openLog(i);
  else if(act==="edit")openContact(i);
  else if(act==="addperson"){openContact(null);$("#cFirm").value=f.name;}
  else if(act==="thanks"){justLogged=null;location.hash="#network";renderNetwork();$("#emContact").value=String(i);$("#emType").value="thanks";renderEmail();setTimeout(()=>$("#emOut").scrollIntoView({behavior:"smooth",block:"center"}),50);}
  else if(act==="draft")draftWhy(f);
  else if(act==="mock"){
    const ref=byId("f3"), info=(S.firms||{})[fkey(f.name)]||{};
    setMock({q:`Why ${f.name}?`,t:"Fit",l:"Basic",a:ref.a,refId:"f3",notes:[firmNotes(f.name),info.deals?"Deals they know: "+info.deals:""].filter(Boolean).join(" | ")});
    setMockMode("ai"); location.hash="#mock"; setTimeout(()=>$("#mockAnswer").focus(),50);
  }
  else if(act==="sim"){
    if(sim&&sim.stage!=="done"){toast("Finish or end your current simulation first");location.hash="#superday";return;}
    sim=null;persistLive();simPrefill={firm:f.name,group:((S.firms||{})[fkey(f.name)]||{}).group||""};location.hash="#superday";renderSim();
  }
  else if(act==="sheet"){const t=cheatSheet(f);try{await navigator.clipboard.writeText(t);toast("Cheat sheet copied");}catch(err){const box=$("#fpCopyBox");box.hidden=false;box.value=t;box.select();toast("Select the text and copy it");}}
});

/* log a call */
function openLog(i){
  logIdx=i; const c=S.contacts[i];
  $("#logTitle").textContent=`Log your call with ${c.name}`;
  ["lgLearned","lgAdvice","lgNext"].forEach(id=>$("#"+id).value="");$("#lgRef").checked=false;$("#lgDate").value=iso(new Date());
  $("#logDlg").showModal();
}
$("#logForm").addEventListener("submit",e=>{
  e.preventDefault(); const c=S.contacts[logIdx]; if(!c)return;
  const d=$("#lgDate").value||iso(new Date()), learned=$("#lgLearned").value.trim(), advice=$("#lgAdvice").value.trim(), nxt=$("#lgNext").value.trim();
  const parts=[learned,advice&&"Advice: "+advice,nxt&&"Suggested I talk to: "+nxt].filter(Boolean);
  if(parts.length)c.notes=(c.notes?c.notes.trim()+"\n":"")+`Call ${d}: `+parts.map(x=>/[.!?]$/.test(x)?x:x+".").join(" ");
  c.stage=$("#lgRef").checked?"Referred":"Called"; c.last=d; c.next=iso(new Date());
  delete c.example;
  justLogged=logIdx; save(); $("#logDlg").close(); renderNetwork(); renderFirms(); toast("Call logged");
});
$("#lgCancel").onclick=()=>$("#logDlg").close();
