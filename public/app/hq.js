/* Superday Prep · Recruiting HQ: application tracker, 30-day agenda and interview prep workspaces.
   Files in /app are plain scripts joined by the server into /app.js and share one global scope. */
/* ---------- Recruiting HQ ---------- */
const APP_STAGES=["Researching","Networking","Applied","First Round","Superday","Offer","Rejected","Withdrawn"];
const APP_TIERS=["Dream","Target","Safety"];
const CLOSED_STAGES=["Offer","Rejected","Withdrawn"];
const FINAL_CHECKS=["I know who I'm meeting and their backgrounds","Three printed resumes (or the video link tested)","Outfit and travel sorted","Two questions ready for each interviewer","Thank-you notes drafted to send the same day"];
let appFilter=null, appEditing=null, hqOpen=null, appDelArmed=false;
const daysUntil=d=>Math.round((parseIso(d)-today())/DAY);
const dayLabel=n=>n<0?`${-n}d overdue`:n===0?"today":n===1?"tomorrow":`in ${n} days`;
const apps=()=>S.apps||(S.apps=[]);
const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

// Everything with a date, from applications, firm pages, the study plan and networking. Used by the agenda and the dashboard.
function upcomingEvents(){
  const ev=[], seen=new Set();
  const add=(date,kind,label,sub,go,key)=>{if(!date)return;const k=key||kind+label+date;if(seen.has(k))return;seen.add(k);ev.push({date,kind,label,sub:sub||"",go,days:daysUntil(date)});};
  apps().forEach(a=>{
    if(CLOSED_STAGES.includes(a.stage))return;
    if(a.deadline&&["Researching","Networking"].includes(a.stage))add(a.deadline,"deadline",`${a.firm} application due`,a.role,"apps");
    if(a.interviewDate)add(a.interviewDate,"interview",`${a.firm} ${a.interviewType==="Superday"?"superday":"first round"}`,a.role,"apps","iv:"+fkey(a.firm)+a.interviewDate);
  });
  Object.values(S.firms||{}).forEach(f=>{if(f.date&&f.name)add(f.date,"interview",`${f.name} interview`,f.group||"","firms","iv:"+fkey(f.name)+f.date);});
  if(S.settings.superday&&!ev.some(e=>e.kind==="interview"&&e.date===S.settings.superday))add(S.settings.superday,"interview","Superday (study plan date)","","drill");
  S.contacts.forEach(c=>{if(!c.next)return;
    if(c.stage==="Call set")add(c.next,"call",`Call with ${c.name}`,c.firm,"network");
    else add(c.next,"followup",`Follow up with ${c.name}`,c.firm,"network");});
  return ev.sort((a,b)=>a.date.localeCompare(b.date));
}
const EVENT_TAG={deadline:"Deadline",interview:"Interview",call:"Call",followup:"Follow-up"};

function workspaceHtml(a){
  const info=(S.firms||{})[fkey(a.firm)]||{}, people=S.contacts.filter(c=>fkey(c.firm)===fkey(a.firm));
  const d=a.interviewDate?daysUntil(a.interviewDate):null, r=readiness();
  const recentSim=(S.simHist||[]).find(h=>h.firm&&fkey(h.firm)===fkey(a.firm)&&Date.now()-h.at<14*DAY);
  const rows=[
    {ok:(info.whyUs||"").length>50,t:`"Why ${esc(a.firm)}?" answer written`,note:info.whyUs?"":"Built from your call notes in Firm prep",act:"firm",btn:"Open firm prep"},
    {ok:people.some(c=>c.notes),t:`Spoken with someone at ${esc(a.firm)}`,note:`${people.length} contact${people.length===1?"":"s"}, ${people.filter(c=>c.notes).length} with call notes`,act:"firm",btn:"See contacts"},
    {ok:!!(S.story&&S.story.story),t:"Resume walk-through ready",note:(S.story&&S.story.rehearsals||[]).length?`${S.story.rehearsals.length} timed run-through${S.story.rehearsals.length===1?"":"s"}`:"Not rehearsed yet",act:"story",btn:"Open your story"},
    {ok:r.score>=65,t:`Technicals at first-round level (${r.score}% ready)`,note:a.interviewDate&&S.settings.superday!==a.interviewDate?"Your study plan isn't set to this date":"Study plan is set to this date",act:a.interviewDate&&S.settings.superday!==a.interviewDate?"plan":"drill",btn:a.interviewDate&&S.settings.superday!==a.interviewDate?"Plan my studying for this date":"Open drill"},
    {ok:!!recentSim,t:`Superday simulation for ${esc(a.firm)}`,note:recentSim?`Scored ${recentSim.overall.toFixed(1)}/10 on ${fmtDay(new Date(recentSim.at))}`:"None in the last two weeks",act:"sim",btn:"Run a simulation",pro:true},
    {ok:(info.ask||[]).length>0,t:"Questions to ask your interviewers",note:(info.ask||[]).slice(0,1).join("")||"Drafted with your Why-this-firm answer",act:"firm",btn:"Open firm prep"},
  ];
  const checks=a.checks||{}, done=rows.filter(x=>x.ok).length+FINAL_CHECKS.filter((_,i)=>checks[i]).length, total=rows.length+FINAL_CHECKS.length;
  return `<div class="card stack ws">
    <div class="row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Interview prep workspace</span><h2 style="margin-top:2px">${esc(a.firm)} · ${esc(a.interviewType||"Interview")}</h2>
      <p class="hint" style="margin:2px 0 0">${esc(a.role||"")}${a.office?" · "+esc(a.office):""}${a.interviewDate?` · ${fmtDay(parseIso(a.interviewDate))}`:""}</p></div>
      <div class="row">${d!=null?`<span class="cd-num" style="font-size:1.8rem">${Math.max(d,0)}</span><span class="hint">${d<0?"interview passed":d===1?"day to go":"days to go"}</span>`:`<span class="hint">Add an interview date for a countdown</span>`}<button class="btn sm" data-hq="closews">Close</button></div></div>
    <div class="bar" style="max-width:none" role="img" aria-label="${done} of ${total} ready"><i style="width:${Math.round(done/total*100)}%"></i></div>
    <ul class="wslist">${rows.map(x=>`<li class="${x.ok?"ok":""}"><span class="wsmark" aria-hidden="true">${x.ok?"✓":""}</span><div><b>${x.t}</b><span class="hint">${esc(x.note)}</span></div><button class="btn sm" data-hq="ws:${x.act}">${x.btn}${x.pro&&!isPro()?'<span class="pro">PRO</span>':""}</button></li>`).join("")}</ul>
    <div><h3 style="margin-bottom:8px">Day-before checklist</h3><ul class="tl-check">${FINAL_CHECKS.map((c,i)=>`<li><input type="checkbox" id="fc${i}" data-fc="${i}" ${checks[i]?"checked":""}><label for="fc${i}">${c}</label></li>`).join("")}</ul></div>
  </div>`;
}
function renderApps(){
  const root=$("#appsRoot"); if(!root)return;
  const A=apps(), list=A.filter(a=>!appFilter||a.stage===appFilter);
  const open=hqOpen&&A.find(a=>a.id===hqOpen);
  const ev=upcomingEvents().filter(e=>e.days>=-7&&e.days<=30);
  const tierCls={Dream:"hot",Target:"",Safety:""};
  root.innerHTML=`
    <div class="pipe pipe8">${APP_STAGES.map(s=>`<button data-astage="${s}" aria-pressed="${appFilter===s}"><b>${A.filter(a=>a.stage===s).length}</b><span>${s}</span></button>`).join("")}</div>
    ${open?workspaceHtml(open):""}
    <div class="split">
      <div class="stack">
        <div class="row" style="justify-content:space-between"><h2>${appFilter?esc(appFilter)+" ("+list.length+")":"Applications ("+A.length+")"}</h2><button class="btn primary" data-hq="add">Add application</button></div>
        ${A.length?(list.length?`<div class="clist">${list.map(a=>{
          const dl=a.deadline&&!CLOSED_STAGES.includes(a.stage)&&["Researching","Networking"].includes(a.stage)?daysUntil(a.deadline):null, iv=a.interviewDate&&!CLOSED_STAGES.includes(a.stage)?daysUntil(a.interviewDate):null;
          return `<div class="contact appRow">
            <div class="who"><b>${esc(a.firm)}${a.tier?` <span class="stage ${tierCls[a.tier]||""}">${esc(a.tier)}</span>`:""}</b><span>${esc(a.role||"")}${a.office?" · "+esc(a.office):""}</span></div>
            <div class="dates">${dl!=null?`<span class="${dl<=3?"late":dl<=7?"soon":""}">Due ${dayLabel(dl)}</span><br>`:""}${iv!=null?`<span class="${iv>=0&&iv<=7?"soon":""}">${esc(a.interviewType||"Interview")} ${dayLabel(iv)}</span>`:a.appliedOn?"Applied "+esc(a.appliedOn):dl==null?"No dates yet":""}</div>
            <div class="row"><label class="sr" for="st-${a.id}">Stage</label><select id="st-${a.id}" data-stagesel="${a.id}" style="width:auto;padding:4px 6px;font-size:.82rem">${APP_STAGES.map(s=>`<option ${a.stage===s?"selected":""}>${s}</option>`).join("")}</select>
              ${a.interviewDate||["First Round","Superday"].includes(a.stage)?`<button class="btn sm primary" data-hq="open:${a.id}">Prep</button>`:""}<button class="btn sm" data-hq="edit:${a.id}">Edit</button></div>
          </div>`;}).join("")}</div>`:`<div class="card empty"><p>No applications at this stage.</p></div>`)
        :`<div class="card empty"><h3>Track every application in one place</h3><p>Add each firm and role you're going for, with its deadline and stage. When you get an interview, a prep workspace opens with everything you need for that firm: your "Why us?" answer, the people you've spoken with, a study plan and a checklist.</p><div class="row"><button class="btn primary" data-hq="add">Add your first application</button></div></div>`}
      </div>
      <aside class="card stack" style="gap:10px"><h3>Next 30 days</h3>
        ${ev.length?`<ul class="agenda">${ev.map(e=>`<li><span class="adate ${e.days<0?"late":e.days<=3?"soon":""}">${e.days<0?dayLabel(e.days):fmtDay(parseIso(e.date))}</span><div><a href="#${e.go}"><b>${esc(e.label)}</b></a><span class="hint">${EVENT_TAG[e.kind]}${e.sub?" · "+esc(e.sub):""}${e.days>=0?" · "+dayLabel(e.days):""}</span></div></li>`).join("")}</ul>`
        :`<p class="hint" style="margin:0">Deadlines, interviews, calls and follow-ups show up here as you add them.</p>`}
      </aside>
    </div>`;
}
function openApp(id){
  appEditing=id; appDelArmed=false;
  const a=id?apps().find(x=>x.id===id):{stage:"Researching",tier:"Target",role:"Summer Analyst",interviewType:"First Round"};
  $("#appDlgTitle").textContent=id?"Edit application":"Add application";
  const firms=[...new Set([...firmList().map(f=>f.name),...apps().map(x=>x.firm)])];
  $("#apFirms").innerHTML=firms.map(f=>`<option value="${esc(f)}">`).join("");
  $("#apStage").innerHTML=APP_STAGES.map(s=>`<option>${s}</option>`).join("");
  $("#apTier").innerHTML=APP_TIERS.map(s=>`<option>${s}</option>`).join("");
  const set=(k,v)=>$("#"+k).value=v||"";
  set("apFirm",a.firm);set("apRole",a.role);set("apOffice",a.office);set("apStage",a.stage);set("apTier",a.tier||"Target");
  set("apDeadline",a.deadline);set("apApplied",a.appliedOn);set("apIvDate",a.interviewDate);set("apIvType",a.interviewType||"First Round");set("apNotes",a.notes);
  $("#apDelete").hidden=!id; $("#apDelete").textContent="Delete";
  $("#appDlg").showModal();
}
function syncFirmFromApp(a){ // keeps the firm's prep page in step with the application
  if(!a.firm)return; const f=finfo(a.firm);
  if(a.interviewDate){f.date=a.interviewDate;f.stage=a.interviewType==="Superday"?"Superday":"First round";}
  else if(a.stage==="Applied"&&!f.stage)f.stage="Applied";
}
$("#appForm").addEventListener("submit",e=>{
  e.preventDefault(); const v=k=>$("#"+k).value.trim();
  const prev=appEditing?apps().find(x=>x.id===appEditing):null;
  const a={...(prev||{id:newId(),created:Date.now()}),firm:v("apFirm"),role:v("apRole"),office:v("apOffice"),stage:v("apStage"),tier:v("apTier"),deadline:v("apDeadline"),appliedOn:v("apApplied"),interviewDate:v("apIvDate"),interviewType:v("apIvType"),notes:v("apNotes")};
  if(a.stage==="Applied"&&!a.appliedOn)a.appliedOn=iso(new Date());
  if(a.interviewDate&&["Researching","Networking","Applied"].includes(a.stage))a.stage=a.interviewType==="Superday"?"Superday":"First Round";
  if(prev)apps()[apps().indexOf(prev)]=a; else apps().push(a);
  syncFirmFromApp(a);
  if(a.interviewDate&&!prev?.interviewDate)hqOpen=a.id; // an interview was just scheduled: open its workspace
  save(); $("#appDlg").close(); renderApps(); renderFirms(); renderDash(); toast(a.interviewDate&&!prev?.interviewDate?"Interview added. Your prep workspace is ready":"Application saved");
});
$("#apCancel").onclick=()=>$("#appDlg").close();
$("#apDelete").onclick=()=>{const b=$("#apDelete");if(!appDelArmed){appDelArmed=true;b.textContent="Click again to delete";return;}
  S.apps=apps().filter(x=>x.id!==appEditing); if(hqOpen===appEditing)hqOpen=null; save(); $("#appDlg").close(); renderApps(); renderDash(); toast("Application deleted");};
$("#appsRoot").addEventListener("click",e=>{
  const st=e.target.closest("[data-astage]"); if(st){appFilter=appFilter===st.dataset.astage?null:st.dataset.astage;renderApps();return;}
  const b=e.target.closest("[data-hq]"); if(!b)return;
  const [act,arg]=b.dataset.hq.split(":"), a=hqOpen&&apps().find(x=>x.id===hqOpen);
  if(act==="add")openApp(null);
  else if(act==="edit")openApp(arg);
  else if(act==="open"){hqOpen=arg;renderApps();root_scroll();}
  else if(act==="closews"){hqOpen=null;renderApps();}
  else if(act==="ws"&&a){
    if(arg==="firm"){finfo(a.firm);selFirm=a.firm;prepOpen=null;save();renderFirms();location.hash="#firms";}
    else if(arg==="story")location.hash="#story";
    else if(arg==="drill")location.hash="#drill";
    else if(arg==="plan"){S.settings.superday=a.interviewDate;extraNew=0;Object.keys(S.cards).forEach(id=>S.cards[id]=capped(S.cards[id]));save();renderDrill();renderApps();renderDash();toast("Study plan set to "+fmtDay(parseIso(a.interviewDate)));}
    else if(arg==="sim"){
      if(!isPro()){window.openPaywall&&window.openPaywall("sim");return;}
      if(sim&&sim.stage!=="done"){toast("Finish or end your current simulation first");location.hash="#superday";return;}
      sim=null;persistLive();simPrefill={firm:a.firm,group:((S.firms||{})[fkey(a.firm)]||{}).group||""};location.hash="#superday";renderSim();
    }
  }
});
function root_scroll(){const w=$("#appsRoot .ws");if(w)w.scrollIntoView({behavior:"smooth",block:"start"});}
$("#appsRoot").addEventListener("change",e=>{
  const s=e.target.closest("[data-stagesel]");
  if(s){const a=apps().find(x=>x.id===s.dataset.stagesel);if(!a)return;a.stage=s.value;if(a.stage==="Applied"&&!a.appliedOn)a.appliedOn=iso(new Date());syncFirmFromApp(a);save();renderApps();renderDash();return;}
  const c=e.target.closest("[data-fc]");
  if(c){const a=apps().find(x=>x.id===hqOpen);if(!a)return;a.checks=a.checks||{};if(c.checked)a.checks[c.dataset.fc]=true;else delete a.checks[c.dataset.fc];save();renderApps();}
});
