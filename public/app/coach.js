/* Superday Prep · AI Banking Coach: a chat panel available on every page.
   The coach only knows what's in the snapshot built here from the student's saved data.
   Files in /app are plain scripts joined by the server into /app.js and share one global scope. */
/* ---------- AI coach ---------- */
const COACH_KEY="superday-coach:"+UID;
let coachMsgs=[], coachBusy=false;
try{coachMsgs=JSON.parse(sessionStorage.getItem(COACH_KEY)||"[]");}catch(e){}
// A plain-text summary of the student's saved data. Private notes and the resume are only included if they allow it.
function coachSnapshot(){
  const L=[], st=S.settings, r=readiness(), now=Date.now(), share=!!st.coachShare;
  L.push(`Student: ${st.name||"name not set"}; ${st.year||"year not set"} at ${st.school||"school not set"}; major ${st.major||"not set"}; graduating ${st.gradYear||"not set"}. Plan: ${isPro()?"Pro":"Free"}.`);
  L.push(`Interview readiness: ${r.score}% (${r.label}), measured on the ${isFull()?"full":"core"} question set. Topic readiness, weakest first: ${[...r.topics].sort((a,b)=>a.R-b.R).map(t=>`${t.t} ${Math.round(t.R*100)}% (${t.seen}/${t.n} seen${t.P==null?", no interview practice":`, interview avg ${(t.P*10).toFixed(1)}/10`})`).join("; ")}.`);
  const due=Object.values(S.cards).filter(c=>c.due<=now).length;
  L.push(`Drill: ${Object.keys(S.cards).length} questions seen, ${due} reviews due now, ${streak()}-day study streak, ${reviewsBetween(weekStart().getTime(),now+DAY)} reviews this week.`);
  if(r.slipping.length)L.push(`Questions they keep missing: ${r.slipping.map(s=>`"${s.b.q}" (${s.b.t})`).join("; ")}.`);
  const mocks=(S.mockHist||[]).slice(0,6);
  L.push(mocks.length?`Recent mock answers (newest first): ${mocks.map(m=>`${m.t||"?"} ${m.score}/10`).join(", ")}.`:"No mock interview answers yet.");
  const sims=(S.simHist||[]).slice(0,3);
  L.push(sims.length?`Superday simulations (newest first): ${sims.map(h=>`${h.overall.toFixed(1)}/10 ${h.verdict} on ${iso(new Date(h.at))}${h.firm?" for "+h.firm:""}${h.topics?" ("+Object.entries(h.topics).map(([t,v])=>`${t} ${(+v).toFixed(1)}`).join(", ")+")":""}`).join("; ")}.`:"No superday simulations yet.");
  const ev=upcomingEvents().filter(e=>e.days>=-3).slice(0,8);
  L.push(ev.length?`Calendar: ${ev.map(e=>`${e.label} on ${e.date} (${dayLabel(e.days)})`).join("; ")}.`:"Nothing on their recruiting calendar.");
  const A=apps();
  L.push(A.length?`Applications: ${A.map(a=>`${a.firm} ${a.role||""}${a.office?" ("+a.office+")":""}: ${a.stage}${a.tier?", "+a.tier:""}`).join("; ")}.`:"No applications tracked yet.");
  const overdue=S.contacts.filter(c=>c.next&&daysUntil(c.next)<0).length;
  L.push(`Networking: ${S.contacts.length} contacts${S.contacts.length?" ("+STAGES.map(s=>`${S.contacts.filter(c=>c.stage===s).length} ${s}`).filter(x=>!x.startsWith("0 ")).join(", ")+")":""}; ${overdue} follow-ups overdue; ${monthCounts().calls} calls logged this month.`);
  const sl=S.stories||[], gaps=storyCoverage().filter(c=>!c.stories.length);
  L.push(`Behavioral stories: ${sl.length}${sl.length?" ("+sl.map(s=>`"${s.title||"untitled"}"${s.strength?" strength "+s.strength+"/5":""}`).join(", ")+")":""}. Common questions with no story: ${gaps.length?gaps.slice(0,6).map(g=>shortQ(g.q)).join("; "):"none"}.`);
  L.push(`Resume walk-through: ${S.story&&S.story.story?"written, "+((S.story.rehearsals||[]).length)+" timed run-throughs":"not written"}.`);
  const P=todaysPlan();
  L.push(`Today's plan in the app: ${P.items.map(i=>(i.done?"[done] ":"")+i.text).join("; ")}.`);
  if(share){
    if(S.story&&S.story.resume)L.push(`Resume text: ${S.story.resume.slice(0,1500)}`);
    const notes=S.contacts.filter(c=>c.notes).slice(0,6).map(c=>`${c.name} (${c.role||""}, ${c.firm}): ${c.notes.slice(0,300)}`);
    if(notes.length)L.push(`Networking notes: ${notes.join(" | ")}`);
  }else L.push("The student has not shared their resume text or networking notes with you.");
  return L.join("\n").slice(0,5000);
}
function renderCoach(){
  const box=$("#coachMsgs"); if(!box)return;
  const chips=["What should I work on today?","Am I ready for my next interview?","Quiz me on my weakest topic","Explain WACC simply"];
  box.innerHTML=coachMsgs.length?coachMsgs.map(m=>`<div class="cmsg ${m.role}"><span class="eyebrow">${m.role==="user"?"You":"Coach"}</span><p>${esc(m.content)}</p></div>`).join("")+(coachBusy?`<div class="cmsg coach"><div class="thinking"><span class="dot"></span>Thinking...</div></div>`:"")
    :`<div class="stack" style="gap:10px"><p style="margin:0">Ask anything about technicals, interviews, networking or what to do next. The coach answers from your saved progress in this app, and says so when it doesn't know something.</p>
      <div class="chips" style="margin:0">${chips.map(c=>`<button class="chip" data-chip="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>`;
  box.scrollTop=box.scrollHeight;
  $("#coachShare").checked=!!S.settings.coachShare;
  $("#coachSend").disabled=coachBusy;
}
async function coachAsk(text){
  text=(text||"").trim(); if(!text||coachBusy)return;
  coachMsgs.push({role:"user",content:text}); coachBusy=true; $("#coachInput").value=""; renderCoach();
  await sampleReady;
  try{
    const r=await sampleFn.run("coach",{snapshot:coachSnapshot(),messages:coachMsgs.slice(-8)});
    coachMsgs.push({role:"coach",content:r.text||"I didn't get an answer that time. Try again."});
  }catch(e){
    coachMsgs.push({role:"coach",content:e&&e.code==="quota_exhausted"?"You're out of AI credits for now, so I can't answer until they reset.":e&&e.code==="rate_limited"?"That's a lot of questions at once. Give me a minute.":"I couldn't reach the AI. Try again in a moment."});
  }
  coachBusy=false; coachMsgs=coachMsgs.slice(-30);
  try{sessionStorage.setItem(COACH_KEY,JSON.stringify(coachMsgs));}catch(e){}
  renderCoach(); $("#coachInput").focus();
}
$("#coachFab").onclick=()=>{$("#coachDlg").showModal();renderCoach();$("#coachInput").focus();};
$("#coachClose").onclick=()=>$("#coachDlg").close();
$("#coachClear").onclick=()=>{coachMsgs=[];try{sessionStorage.removeItem(COACH_KEY);}catch(e){}renderCoach();};
$("#coachForm").addEventListener("submit",e=>{e.preventDefault();coachAsk($("#coachInput").value);});
$("#coachInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();coachAsk($("#coachInput").value);}});
$("#coachMsgs").addEventListener("click",e=>{const c=e.target.closest("[data-chip]");if(c)coachAsk(c.dataset.chip);});
$("#coachShare").onchange=e=>{S.settings.coachShare=e.target.checked;save();};
$("#coachFab").hidden=false;
