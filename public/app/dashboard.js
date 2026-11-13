/* Superday Prep · Dashboard: readiness, today's plan, countdowns and the weekly report.
   Files in /app are plain scripts joined by the server into /app.js and share one global scope.
   Everything here is computed from the student's saved activity. Nothing is AI-generated. */
/* ---------- Dashboard ---------- */
function weekRange(offset){const s=weekStart().getTime()+offset*7*DAY;return [s,s+7*DAY];}
function reviewsBetween(a,b){return Object.entries(S.reviewLog||{}).filter(([d])=>{const t=parseIso(d).getTime();return t>=a&&t<b;}).reduce((n,[,c])=>n+c,0);}
function weeklyReport(){
  const [a0,a1]=weekRange(0), [b0,b1]=weekRange(-1);
  const mocks=(lo,hi)=>(S.mockHist||[]).filter(h=>h.at>=lo&&h.at<hi);
  const avgScore=l=>l.length?l.reduce((n,h)=>n+h.score,0)/l.length:null;
  const calls=(lo,hi)=>{let n=0;S.contacts.forEach(c=>{for(const m of (c.notes||"").matchAll(/Call (\d{4}-\d{2}-\d{2}):/g)){const t=parseIso(m[1]).getTime();if(t>=lo&&t<hi)n++;}});return n;};
  const log=Object.entries(S.readyLog||{}).sort(([x],[y])=>x.localeCompare(y));
  const weekAgo=iso(new Date(today().getTime()-7*DAY)), before=log.filter(([d])=>d<=weekAgo).pop(); // same baseline as the trend line
  const now=readiness().score;
  return {
    reviews:[reviewsBetween(a0,a1),reviewsBetween(b0,b1)],
    mockAvg:[avgScore(mocks(a0,a1)),avgScore(mocks(b0,b1))], mockCount:mocks(a0,a1).length,
    sims:[(S.simHist||[]).filter(h=>h.at>=a0&&h.at<a1).length,(S.simHist||[]).filter(h=>h.at>=b0&&h.at<b1).length],
    calls:[calls(a0,a1),calls(b0,b1)],
    readiness:[now,before?before[1]:null],
  };
}
// Today's plan: a short list built from what's due, what's weak and what's coming up, trimmed to the minutes the student has.
function todaysPlan(){
  const items=[], now=Date.now(), r=readiness(), p=plan(), todayIso=iso(new Date());
  const due=Object.values(S.cards).filter(c=>c.due<=now).length, reviewedToday=(S.reviewLog||{})[todayIso]||0;
  const ev=upcomingEvents();
  const add=(prio,mins,text,go,done,act)=>items.push({prio,mins,text,go,done:!!done,act});
  // interviews and deadlines in the next 7 days come first
  ev.filter(e=>e.kind==="interview"&&e.days>=0&&e.days<=7).slice(0,1).forEach(e=>{
    const a=apps().find(x=>x.interviewDate===e.date&&e.label.startsWith(x.firm));
    const firm=a?a.firm:e.label.replace(/ (interview|superday|first round)$/,""), info=(S.firms||{})[fkey(firm)]||{};
    if(a)add(0,15,`Work through your ${firm} prep workspace (${e.label.includes("superday")?"superday":"interview"} ${dayLabel(e.days)})`,"apps",false,"ws:"+a.id);
    else if(e.go==="firms"&&!(info.whyUs||"").length)add(0,15,`Write your "Why ${firm}?" answer (interview ${dayLabel(e.days)})`,"firms");
  });
  ev.filter(e=>e.kind==="deadline"&&e.days>=0&&e.days<=7).slice(0,2).forEach(e=>add(1,20,`${e.label} ${dayLabel(e.days)}`,"apps"));
  const fu=S.contacts.filter(c=>c.next&&daysUntil(c.next)<=0);
  if(fu.length)add(1,5*Math.min(fu.length,3),`Send ${fu.length} follow-up${fu.length===1?"":"s"}: ${fu.slice(0,3).map(c=>c.name.split(" ")[0]).join(", ")}${fu.length>3?" and others":""}`,"network");
  // spaced repetition
  if(due>0)add(2,Math.max(5,Math.ceil(due*0.75)),`Review ${due} card${due===1?"":"s"} that ${due===1?"is":"are"} due`,"drill");
  else if(Object.keys(S.cards).length&&reviewedToday)add(2,0,"Reviews done for today","drill",true);
  const unseen=setBank().filter(b=>!S.cards[b.id]).length, newToday=(S.newLog||{})[todayIso]||0, target=p&&!p.past?p.perDay:5;
  if(unseen>0||newToday>0){const left=p&&!p.past?p.left:Math.max(0,Math.min(target,unseen+newToday)-newToday);
    add(3,Math.max(5,left*2),left>0?`Learn ${left} new question${left===1?"":"s"}`:`New questions done (${newToday} today)`,"drill",left===0);}
  // weakest topic, once there's enough data to call it weak
  const weak=[...r.topics].filter(t=>t.seen>0).sort((a,b)=>a.R-b.R)[0];
  if(weak&&weak.R<.6)add(4,10,`10 minutes on ${weak.t}, your weakest topic at ${Math.round(weak.R*100)}%`,"drill",false,"topic:"+weak.t);
  // speaking practice
  const mocksToday=(S.mockHist||[]).filter(h=>h.at>=today().getTime()).length;
  add(5,10,mocksToday>=2?`Mock answers done (${mocksToday} today)`:`Answer ${2-mocksToday} mock question${2-mocksToday===1?"":"s"} out loud`,"mock",mocksToday>=2);
  if(!(S.story&&S.story.story))add(6,15,"Build your resume walk-through","story");
  const lastSim=(S.simHist||[])[0];
  if(isPro()&&Object.keys(S.cards).length>=30&&(!lastSim||now-lastSim.at>7*DAY))add(6,25,"Run a superday simulation (none this week)","superday");
  if(!S.contacts.length)add(7,10,"Add three alumni to reach out to","network");
  // fit the list to the time available; finished items always show
  const budget=+S.settings.dailyMins||45; let used=0; const out=[];
  items.sort((a,b)=>a.prio-b.prio).forEach(it=>{if(it.done){out.push(it);return;}if(used+it.mins<=budget||!out.some(x=>!x.done)){out.push(it);used+=it.mins;}});
  return {items:out,mins:used,budget};
}
function slipInsight(){
  const by={}; Object.entries(S.cards).forEach(([id,c])=>{if((c.lapses||0)>0){const b=byId(id);if(b)by[b.t]=(by[b.t]||0)+1;}});
  const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];
  return top&&top[1]>=3?`You've missed ${top[1]} ${top[0]} questions at least once. A focus session on them is the quickest win.`:"";
}
function renderDash(){
  const root=$("#dashRoot"); if(!root)return;
  const r=readiness(), W=weeklyReport(), P=todaysPlan(), act=nextAction(r), insight=slipInsight();
  const col=r.score>=80?"var(--blue)":r.score>=65?"var(--accent)":r.score>=40?"var(--amber)":"var(--red)";
  const h=new Date().getHours(), hello=h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  const first=(S.settings.name||(window.__ME&&window.__ME.name)||"").split(" ")[0];
  const ev=upcomingEvents().filter(e=>e.days>=0&&e.kind!=="followup").slice(0,5);
  const A=apps(), applied=A.filter(a=>a.appliedOn||["Applied","First Round","Superday","Offer","Rejected"].includes(a.stage)).length, interviews=A.filter(a=>["First Round","Superday","Offer"].includes(a.stage)).length;
  const learned=setBank().filter(b=>S.cards[b.id]&&S.cards[b.id].reps>=2).length, mc=monthCounts();
  const delta=(now,prev,fmt)=>{if(now==null||prev==null)return "";const d=now-prev;if(Math.abs(d)<.05)return `<span class="dl">same as last week</span>`;return `<span class="dl ${d>0?"up":"down"}">${d>0?"+":""}${fmt?fmt(d):d} vs last week</span>`;};
  const tile=(v,l,d)=>`<div><b>${v}</b><span>${l}</span>${d||""}</div>`;
  const topics=[...r.topics].sort((x,y)=>x.R-y.R).map(x=>{const pct=Math.round(x.R*100),c=pct>=70?"var(--accent)":pct>=50?"var(--amber)":"var(--red)";
    return `<div class="trow"><span>${esc(x.t)}</span><div class="bar"><i style="width:${pct}%;background:${c}"></i></div><b>${pct}%</b></div>`;}).join("");
  const done=P.items.filter(i=>i.done).length;
  root.innerHTML=`<div class="stack">
    <div class="row" style="justify-content:space-between;align-items:flex-end"><div><h2 style="font-size:1.6rem">${hello}${first?", "+esc(first):""}</h2><p class="hint" style="margin:2px 0 0">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}${S.settings.gradYear?` · Class of ${S.settings.gradYear}`:""}</p></div>
      <div class="row"><label for="dashMins" class="hint" style="margin:0;font-weight:400">Time today</label><select id="dashMins" style="width:auto;padding:4px 6px;font-size:.85rem">${[20,45,60,90].map(m=>`<option value="${m}" ${m===P.budget?"selected":""}>${m} min</option>`).join("")}</select></div></div>
    <div class="dashgrid">
      <section class="card stack" aria-labelledby="dPlan">
        <div class="row" style="justify-content:space-between"><h3 id="dPlan">Today's plan</h3><span class="hint">${done} of ${P.items.length} done · about ${P.mins} min left</span></div>
        <ul class="plan">${P.items.map(it=>`<li class="${it.done?"done":""}"><span class="wsmark" aria-hidden="true">${it.done?"✓":""}</span><span class="ptext">${esc(it.text)}</span>${it.done?"":`<span class="hint pmin">${it.mins} min</span><button class="btn sm" data-dash="${it.act||"go:"+it.go}">${it.done?"Open":"Start"}</button>`}</li>`).join("")}</ul>
        ${insight?`<p class="tl-alert" style="background:var(--bg)">${esc(insight)} <button class="linkbtn" data-dash="focus">Start a focus session</button></p>`:""}
      </section>
      <section class="card stack" aria-labelledby="dReady">
        <h3 id="dReady">Interview readiness${isFull()?"":" · core set"}</h3>
        <div class="row" style="flex-wrap:nowrap;gap:16px;align-items:center"><div class="ring" style="--p:${r.score};--rc:${col}" role="img" aria-label="Readiness ${r.score} percent"><span>${r.score}<small>%</small></span></div>
          <div class="stack" style="gap:4px;min-width:0"><b style="font:600 1.15rem var(--display)">${r.label}</b><span class="hint">${esc(act.text)}</span><div class="row">${sparkline()}</div></div></div>
        <div class="trows dtopics">${topics}</div>
        <p class="hint" style="margin:0">From your drill history (60%) and your mock and simulation scores (40%). <a class="linkbtn" href="#drill">See the breakdown</a></p>
      </section>
      <section class="card stack" aria-labelledby="dNext">
        <div class="row" style="justify-content:space-between"><h3 id="dNext">Coming up</h3><a class="linkbtn" href="#apps">Recruiting HQ</a></div>
        ${ev.length?`<ul class="agenda">${ev.map(e=>`<li><span class="cdn ${e.days<=3?"soon":""}">${e.days}<small>${e.days===1?"day":"days"}</small></span><div><a href="#${e.go}"><b>${esc(e.label)}</b></a><span class="hint">${EVENT_TAG[e.kind]} · ${fmtDay(parseIso(e.date))}${e.sub?" · "+esc(e.sub):""}</span></div></li>`).join("")}</ul>`
        :`<p class="hint" style="margin:0">No interviews, deadlines or calls on the calendar yet. Add your applications and they'll count down here.</p><div class="row"><a class="btn sm" href="#apps">Add an application</a></div>`}
      </section>
      <section class="card stack" aria-labelledby="dWeek">
        <h3 id="dWeek">This week</h3>
        <div class="wk">
          ${tile(W.reviews[0],"Drill reviews",delta(W.reviews[0],W.reviews[1]))}
          ${tile(W.mockAvg[0]!=null?W.mockAvg[0].toFixed(1):"–",`Mock average${W.mockCount?` (${W.mockCount})`:""}`,delta(W.mockAvg[0],W.mockAvg[1],d=>d.toFixed(1)))}
          ${tile(W.readiness[0]+"%","Readiness",delta(W.readiness[0],W.readiness[1],d=>d+" pts"))}
          ${tile(W.sims[0],"Simulations",delta(W.sims[0],W.sims[1]))}
          ${tile(W.calls[0],"Networking calls",delta(W.calls[0],W.calls[1]))}
          ${tile(streak()+"d","Study streak")}
        </div>
        <h3>Overall</h3>
        <div class="wk">
          ${tile(`${learned}/${setBank().length}`,"Questions learned")}
          ${tile(S.contacts.length,"Contacts")}
          ${tile(mc.calls,"Calls this month")}
          ${tile(applied,"Applications sent")}
          ${tile(interviews,"Interviews")}
          ${tile((S.simHist||[]).length,"Simulations run")}
        </div>
      </section>
    </div>
  </div>`;
  $("#dashMins").onchange=e=>{S.settings.dailyMins=+e.target.value;save();renderDash();};
}
$("#dashRoot").addEventListener("click",e=>{
  const b=e.target.closest("[data-dash]"); if(!b)return;
  const a=b.dataset.dash;
  if(a.startsWith("go:"))location.hash="#"+a.slice(3);
  else if(a.startsWith("ws:")){hqOpen=a.slice(3);location.hash="#apps";renderApps();}
  else if(a.startsWith("topic:")){drillFilter=new Set([a.slice(6)]);focusIds=null;current=null;revealed=false;renderDrill();location.hash="#drill";}
  else if(a==="focus"){focusIds=readiness().slipping.map(s=>s.b.id);current=null;revealed=false;renderDrill();location.hash="#drill";}
});
