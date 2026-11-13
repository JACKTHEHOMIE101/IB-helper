/* Superday Prep · Networking tracker and email drafter.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Networking ---------- */
let stageFilter=null, editing=null;
const EXAMPLES=[
  {name:"Jordan Ellis",firm:"Stifel",role:"Analyst, Industrials",tie:"Mizzou '24, Finance",email:"",stage:"Emailed",last:addDays(-9),next:addDays(-2),notes:"Found on LinkedIn via Trulaske alumni filter.",example:true},
  {name:"Priya Raman",firm:"Houlihan Lokey",role:"Associate, Restructuring",tie:"Mizzou '20; Finance Club",email:"",stage:"Called",last:addDays(0),next:addDays(0),notes:"Said the Chicago office hires from the Midwest. Recommended reading Restructuring 101 posts. Offered to pass resume to recruiting.",example:true},
  {name:"Marcus Webb",firm:"William Blair",role:"VP, Healthcare",tie:"KC native, Rockhurst HS",email:"",stage:"Identified",last:"",next:addDays(1),notes:"Priya's suggestion.",example:true},
];
function nextDefault(stage){return {Emailed:addDays(7),Replied:addDays(2),Called:addDays(0),Thanked:addDays(30),Referred:addDays(14)}[stage];}
function renderNetwork(){
  const C=S.contacts;
  $("#pipe").innerHTML=STAGES.map(s=>`<button data-stage="${s}" aria-pressed="${stageFilter===s}"><b>${C.filter(c=>c.stage===s).length}</b><span>${s}</span></button>`).join("");
  const t0=today().getTime();
  const due=C.filter(c=>c.next&&parseIso(c.next).getTime()<=t0+DAY).sort((a,b)=>a.next.localeCompare(b.next));
  $("#dueBox").innerHTML=due.length?`<div class="due"><span class="eyebrow">Follow-ups due</span><ul>${due.map(c=>{const d=Math.round((parseIso(c.next).getTime()-t0)/DAY);return `<li><b>${esc(c.name)}</b><span class="hint">${esc(c.firm)} · ${esc(c.stage)}</span><span class="${d<0?"late":"soon"}">${d<0?-d+"d overdue":d===0?"today":"tomorrow"}</span><button class="btn" data-draft="${C.indexOf(c)}" style="padding:3px 10px;font-size:.8rem">Draft email</button></li>`}).join("")}</ul></div>`:"";
  const list=C.map((c,i)=>({c,i})).filter(x=>!stageFilter||x.c.stage===stageFilter);
  $("#listTitle").textContent=stageFilter?stageFilter+" ("+list.length+")":"All contacts ("+C.length+")";
  const hot=["Replied","Call set","Called"];
  $("#contactList").innerHTML=C.length?(list.length?`<div class="clist">${list.map(({c,i})=>`<div class="contact">
      <div class="who"><b>${esc(c.name)}${c.example?'<span class="ex">EXAMPLE</span>':""}</b><span>${esc(c.role?c.role+", ":"")}${esc(c.firm)}${c.tie?" · "+esc(c.tie):""}</span></div>
      <div class="dates">${c.last?"Last "+esc(c.last):"Not contacted"}${c.next?"<br>Next "+esc(c.next):""}</div>
      <div class="row"><span class="stage ${hot.includes(c.stage)?"hot":""}">${esc(c.stage)}</span><button class="btn sm" data-prepc="${i}">Prep</button><button class="btn sm" data-edit="${i}">Edit</button></div>
    </div>`).join("")}</div>`:`<div class="card empty"><p>No contacts at this stage.</p></div>`)
    :`<div class="card empty"><h3>Start your outreach list</h3><p>Add alumni you want to reach: name, firm, and how you're connected (same school, hometown, club). Superday Prep reminds you when to follow up and drafts the emails.</p><div class="row"><button class="btn primary" data-act="add">Add your first contact</button><button class="btn" data-act="examples">Load 3 example contacts</button></div></div>`;
  const sel=$("#emContact"), prev=sel.value;
  sel.innerHTML=C.length?C.map((c,i)=>`<option value="${i}">${esc(c.name)} · ${esc(c.firm)}</option>`).join(""):`<option value="">Sample contact</option>`;
  if(prev&&C[prev])sel.value=prev;
  renderEmail();
  renderFirms();
}
function me(){const s=S.settings;return{name:s.name||"[Your name]",school:s.school||"the University of Missouri",short:s.short||s.school||"Mizzou",year:s.year||"[year]",major:s.major||"[major]",target:s.target||"an investment banking summer analyst role"};}
function renderEmail(){
  const c=S.contacts[$("#emContact").value]||{name:"Jordan Ellis",firm:"Stifel",role:"Analyst, Industrials",tie:"Mizzou '24",notes:""};
  const m=me(), first=(c.name||"").split(" ")[0]||"there";
  const sameSchool=c.tie&&m.short&&c.tie.toLowerCase().includes(m.short.toLowerCase().slice(0,4));
  const role=c.role?` as ${/^[aeiou]/i.test(c.role)?"an":"a"} ${c.role}`:"";
  const lastNote=((c.notes||"").split("\n").map(s=>s.trim()).filter(Boolean).pop()||"").replace(/^Call \d{4}-\d{2}-\d{2}:\s*/,"").split(/[.;]/).map(s=>s.trim()).filter(Boolean)[0];
  const T={
    cold:`Subject: ${m.short} student interested in ${c.firm}

Hi ${first},

My name is ${m.name}, and I'm a ${m.year} at ${m.school} studying ${m.major}. ${sameSchool?`I saw that you're also a ${m.short} grad and are now at ${c.firm}${role}.`:`I came across your background${c.tie?` (${c.tie})`:""} and your work at ${c.firm}${role}.`}

I'm working toward ${m.target}, and since ${m.short} doesn't have a big on-campus banking pipeline, I'm reaching out to people who have made the move. I'd really value hearing how you got to ${c.firm} and what you'd do differently.

Would you have 15 minutes for a quick call over the next couple of weeks? I'm flexible around your schedule.

Thank you for your time,
${m.name}`,
    bump:`Subject: Re: ${m.short} student interested in ${c.firm}

Hi ${first},

I wanted to follow up on my note below in case it got buried. I know things are busy at ${c.firm}, so even 10 minutes would be a big help as I prepare for recruiting.

Thanks again,
${m.name}`,
    thanks:`Subject: Thank you

Hi ${first},

Thank you for taking the time to speak with me today. ${lastNote?`I especially appreciated your point that ${lastNote.charAt(0).toLowerCase()+lastNote.slice(1)}.`:"Your advice on how to approach recruiting was really helpful."}

I'm going to put that into practice as I keep preparing. If there's anyone else at ${c.firm} you think I should speak with, I'd be grateful for an introduction.

Best,
${m.name}`,
    checkin:`Subject: Quick update

Hi ${first},

I hope things are going well at ${c.firm}. I wanted to share a quick update since we spoke: [one concrete thing you did with their advice, e.g. finished a DCF model, joined the investment club, landed a first-round].

Thanks again for your help. I'll keep you posted as recruiting picks up.

Best,
${m.name}`};
  $("#emOut").textContent=T[$("#emType").value];
}
$("#pipe").addEventListener("click",e=>{const b=e.target.closest("[data-stage]");if(!b)return;stageFilter=stageFilter===b.dataset.stage?null:b.dataset.stage;renderNetwork();});
$("#emContact").onchange=renderEmail; $("#emType").onchange=renderEmail;
$("#emCopy").onclick=()=>copy($("#emOut").textContent);
$("#emLog").onclick=()=>{
  const i=$("#emContact").value, c=S.contacts[i]; if(!c){toast("Add a contact first");return;}
  const t=$("#emType").value; c.last=iso(new Date());
  if(t==="cold"||t==="bump"){if(["Identified","Emailed"].includes(c.stage))c.stage="Emailed";c.next=addDays(7);}
  else if(t==="thanks"){c.stage="Thanked";c.next=addDays(30);}
  else c.next=addDays(30);
  save();renderNetwork();toast(`Logged. Next follow-up ${c.next}`);
};
$("#v-network").addEventListener("click",e=>{
  const pc=e.target.closest("[data-prepc]"); if(pc){const i=+pc.dataset.prepc;selFirm=S.contacts[i].firm;prepOpen=i;justLogged=null;location.hash="#firms";if(!S.contacts[i].prep)generatePrep(i);else renderFirms();return;}
  const ed=e.target.closest("[data-edit]"); if(ed)openContact(+ed.dataset.edit);
  const dr=e.target.closest("[data-draft]"); if(dr){const c=S.contacts[dr.dataset.draft];$("#emContact").value=dr.dataset.draft;$("#emType").value=c.stage==="Called"?"thanks":c.stage==="Emailed"?"bump":c.stage==="Thanked"||c.stage==="Referred"?"checkin":"cold";renderEmail();$("#emOut").scrollIntoView({behavior:"smooth",block:"center"});}
  const a=e.target.closest("[data-act]");
  if(a?.dataset.act==="add")openContact(null);
  if(a?.dataset.act==="examples"){S.contacts=EXAMPLES.map(x=>({...x}));save();renderNetwork();}
});
$("#cStage").innerHTML=STAGES.map(s=>`<option>${s}</option>`).join("");
$("#cStage").onchange=()=>{const d=nextDefault($("#cStage").value);if(d)$("#cNext").value=d;};
function openContact(i){
  editing=i; const c=i==null?{stage:"Identified",next:addDays(1)}:S.contacts[i];
  $("#dlgTitle").textContent=i==null?"Add contact":"Edit contact";
  $("#cName").value=c.name||"";$("#cFirm").value=c.firm||"";$("#cRole").value=c.role||"";$("#cTie").value=c.tie||"";
  $("#cEmail").value=c.email||"";$("#cStage").value=c.stage;$("#cLast").value=c.last||"";$("#cNext").value=c.next||"";$("#cNotes").value=c.notes||"";
  $("#cDelete").hidden=i==null; $("#cDelete").textContent="Delete"; $("#cDelete").dataset.armed="";
  $("#contactDlg").showModal();
}
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const c={name:$("#cName").value.trim(),firm:$("#cFirm").value.trim(),role:$("#cRole").value.trim(),tie:$("#cTie").value.trim(),email:$("#cEmail").value.trim(),stage:$("#cStage").value,last:$("#cLast").value,next:$("#cNext").value,notes:$("#cNotes").value.trim()};
  if(editing==null)S.contacts.push(c);else S.contacts[editing]=c;
  save();$("#contactDlg").close();renderNetwork();toast("Contact saved");
});
$("#cCancel").onclick=()=>$("#contactDlg").close();
$("#cDelete").onclick=()=>{const b=$("#cDelete");if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Click again to delete";return;}
  S.contacts.splice(editing,1);save();$("#contactDlg").close();renderNetwork();toast("Contact deleted");};
$("#addBtn").onclick=()=>openContact(null);
$("#settingsBtn").onclick=()=>{const s=S.settings;$("#sName").value=s.name||"";$("#sSchool").value=s.school||"";$("#sShort").value=s.short||"";$("#sYear").value=s.year||"";$("#sMajor").value=s.major||"";$("#sTarget").value=s.target||"";$("#settingsDlg").showModal();};
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();S.settings={...S.settings,name:$("#sName").value.trim(),school:$("#sSchool").value.trim(),short:$("#sShort").value.trim(),year:$("#sYear").value.trim(),major:$("#sMajor").value.trim(),target:$("#sTarget").value.trim()};save();$("#settingsDlg").close();renderEmail();toast("Details saved");});
$("#sCancel").onclick=()=>$("#settingsDlg").close();
