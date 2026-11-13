/* Superday Prep · Finance club leaderboard.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- Finance club leaderboard ---------- */
const APP_URL=location.origin;
const POINTS={review:1,sim:25,peer:15,call:10};
const BOARD_SORTS=[["points","Points this week"],["readiness","Readiness"],["streak","Streak"],["learned","Cards learned"],["bestSim","Best superday"]];
let boardDb=null, boardUser=null, myId=null, isOwnerView=false, canWrite=null, boardUnsub=null, subscribedCode=null;
let boardRows=[], boardState="loading", boardSort="points", lastPush="", pushT=null, profilesCache={}, profilesKey="", leaveArmed=false;
function weekStart(d=new Date()){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return x;}
const weekKey=()=>iso(weekStart());
function myStats(){
  const ws=weekStart().getTime();
  const reviews=Object.entries(S.reviewLog||{}).filter(([d])=>parseIso(d).getTime()>=ws).reduce((a,[,n])=>a+n,0);
  const sims=(S.simHist||[]).filter(h=>h.at>=ws).length, peers=(S.peerHist||[]).filter(h=>h.at>=ws).length;
  let calls=0; S.contacts.forEach(c=>{for(const m of (c.notes||"").matchAll(/Call (\d{4}-\d{2}-\d{2}):/g))if(parseIso(m[1]).getTime()>=ws)calls++;});
  const best=Math.max(0,...(S.simHist||[]).map(h=>h.overall||0));
  return {week:weekKey(),reviews,sims,peers,calls,points:reviews*POINTS.review+sims*POINTS.sim+peers*POINTS.peer+calls*POINTS.call,
    readiness:readiness().score,learned:Object.values(S.cards).filter(c=>c.reps>=2).length,streak:streak(),bestSim:Math.round(best*10)/10};
}
async function initBoard(){
  try{
    if(!window.claude?.use)throw 0;
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user)throw 0;
    myId=await user.id(); if(!myId)throw 0;
    boardDb=db; boardUser=user;
    canWrite=await user.can("data.write"); isOwnerView=await user.isOwner();
    boardState=S.settings.club?"loading":"none";
  }catch(e){boardState="unavailable";}
  renderBoard();
}
function subscribeBoard(code){
  if(subscribedCode===code)return;
  if(boardUnsub)boardUnsub();
  subscribedCode=code; boardState="loading"; boardRows=[];
  const t=setTimeout(()=>{if(boardState==="loading"){boardState="error";renderBoard();}},10000);
  boardUnsub=boardDb.collection("board").where("club","==",code).onSnapshot(snap=>{
    clearTimeout(t); boardRows=snap.docs.map(d=>({id:d.id,...d.data()})); boardState="joined";
    const club=S.settings.club; if(club&&!club.name){const n=boardRows.find(r=>r.clubName)?.clubName;if(n){club.name=n;save();}}
    renderBoard(); pushStats();
  },()=>{clearTimeout(t);boardState="error";renderBoard();});
}
function pushStats(force){
  try{
    if(!boardDb||!myId||!S.settings.club||!canWrite||boardState!=="joined"&&!force)return;
    const body={club:S.settings.club.code,clubName:S.settings.club.name||"",...myStats()}, sig=JSON.stringify(body);
    if(!force&&sig===lastPush)return;
    clearTimeout(pushT);
    pushT=setTimeout(async()=>{try{await boardDb.collection("board").doc(myId).set({...body,updated:Date.now()});lastPush=sig;}catch(e){toast("Couldn't update the leaderboard");}},force?0:3000);
  }catch(e){}
}
function makeCode(name){return (name.toUpperCase().replace(/[^A-Z0-9]+/g,"").slice(0,8)||"CLUB")+"-"+Math.random().toString(36).slice(2,6).toUpperCase();}
function rowVal(r,k){const cur=r.week===weekKey();return k==="points"?(cur?r.points||0:0):+r[k]||0;}
function resolveNames(){
  const ids=boardRows.map(r=>r.id).sort(), key=ids.join(",");
  if(!boardUser||key===profilesKey)return; profilesKey=key;
  boardUser.profiles(ids).then(ps=>{profilesCache=ps||{};renderBoard();}).catch(()=>{});
}
function renderBoard(){
  const root=$("#clubRoot"); if(!root)return;
  const club=S.settings.club;
  if(boardDb&&club&&subscribedCode!==club.code)subscribeBoard(club.code);
  const privacy=`<p class="hint" style="margin:0">Shared with your club: your name, this week's activity counts (reviews, simulations, peer mocks, logged calls), readiness, streak, cards learned and best simulation score. Never shared: your answers, resume, contacts or notes.</p>`;
  const how=`<p class="hint" style="margin:0">Points this week: ${POINTS.review} per drill review · ${POINTS.sim} per superday simulation · ${POINTS.peer} per peer mock · ${POINTS.call} per logged networking call. Resets every Monday.</p>`;
  if(boardState==="unavailable"){
    root.innerHTML=`<div class="card stack"><span class="eyebrow">Finance club leaderboard</span><h2>Compete with your club</h2>
      <p style="margin:0;max-width:62ch">The leaderboard couldn't load. Check your connection and reload the page.</p>
      ${exampleBoard()}${how}</div>`;return;
  }
  if(boardState==="loading"&&!club){root.innerHTML=`<div class="card thinking"><span class="dot"></span>Loading the leaderboard...</div>`;return;}
  if(!club){
    root.innerHTML=`<div class="split">
      <div class="card stack"><span class="eyebrow">Finance club leaderboard</span><h2>Compete with your club</h2>
        <p style="margin:0;max-width:62ch">A weekly leaderboard for your finance or investment club. Everyone's drill reviews, simulations, peer mocks and networking calls earn points, so the people putting in the work show up at the top.</p>
        ${canWrite===false?`<p class="tl-alert" style="background:var(--bg)">You can view a club's board, but to appear on it you need edit access to this page. Ask whoever shared it with you to invite you as an Editor.</p>`:""}
        <form id="clubCreate" class="stack" style="gap:8px"><label for="clubName">Start a club board</label><div class="row" style="flex-wrap:nowrap"><input id="clubName" placeholder="Mizzou Investment Club" style="min-width:0"><button class="btn primary" type="submit" ${canWrite?"":"disabled"}>Create</button></div></form>
        <form id="clubJoin" class="stack" style="gap:8px"><label for="clubCode">Or join with a code</label><div class="row" style="flex-wrap:nowrap"><input id="clubCode" placeholder="MIZZOUIN-7KQ2" style="min-width:0;text-transform:uppercase"><button class="btn" type="submit">${canWrite?"Join":"View"}</button></div></form>
        ${privacy}
      </div>
      <aside class="card stack"><h3>What it looks like</h3>${exampleBoard()}${how}</aside>
    </div>`;
    $("#clubCreate").onsubmit=e=>{e.preventDefault();const n=$("#clubName").value.trim();if(!n){toast("Name your club first");return;}
      S.settings.club={code:makeCode(n),name:n};save();subscribeBoard(S.settings.club.code);pushStats(true);renderBoard();toast("Club created. Share the code with members");};
    $("#clubJoin").onsubmit=e=>{e.preventDefault();const c=$("#clubCode").value.trim().toUpperCase();if(c.length<4){toast("Enter the code from your club leader");return;}
      S.settings.club={code:c,name:""};save();subscribeBoard(c);pushStats(true);renderBoard();};
    return;
  }
  if(boardState==="error"){root.innerHTML=`<div class="card stack"><h2>Couldn't load the leaderboard</h2><p style="margin:0">Check your connection and reload the page.</p><div class="row"><button class="btn" id="clubLeave2">Leave this club</button></div></div>`;$("#clubLeave2").onclick=leaveClub;return;}
  if(boardState!=="joined"){root.innerHTML=`<div class="card thinking"><span class="dot"></span>Loading ${esc(club.name||club.code)}...</div>`;return;}
  resolveNames();
  const rows=[...boardRows].sort((a,b)=>rowVal(b,boardSort)-rowVal(a,boardSort)||rowVal(b,"points")-rowVal(a,"points"));
  const nameOf=r=>(profilesCache[r.id]&&profilesCache[r.id].name)||(r.id===myId?"You":"Club member");
  const myIdx=rows.findIndex(r=>r.id===myId), me=rows[myIdx];
  const lbl=Object.fromEntries(BOARD_SORTS)[boardSort];
  const fmtV=(r,k)=>k==="bestSim"?(r.bestSim?(+r.bestSim).toFixed(1):"–"):k==="readiness"?rowVal(r,k)+"%":k==="streak"?rowVal(r,k)+"d":rowVal(r,k);
  let rankLine="";
  if(me){const above=rows[myIdx-1];rankLine=`You're <b>#${myIdx+1}</b> of ${rows.length} on ${lbl.toLowerCase()}${above?` · ${(rowVal(above,boardSort)-rowVal(me,boardSort)).toFixed(boardSort==="bestSim"?1:0)} behind #${myIdx}`:" · in the lead"}`;}
  else rankLine=canWrite?"Syncing your stats...":"You're viewing this board. You need edit access to appear on it.";
  const invite=`Join the ${club.name||"club"} leaderboard on Superday Prep: open ${APP_URL}, go to the Club tab and join with code ${club.code}`;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Finance club leaderboard</span><h2 style="margin-top:2px">${esc(club.name||"Your club")}</h2><p class="hint" style="margin:2px 0 0">Code <b class="mono">${esc(club.code)}</b> · ${rows.length} member${rows.length===1?"":"s"} · week of ${fmtDay(weekStart())}</p></div>
        <div class="row"><button class="btn primary sm" id="clubInvite">Copy invite</button><button class="btn sm" id="clubLeave">${leaveArmed?"Click again to leave":"Leave"}</button></div></div>
      <p style="margin:0">${rankLine}</p>
      <textarea id="clubInviteBox" readonly hidden style="min-height:70px"></textarea>
    </div>
    <div class="card stack">
      <div class="setbar" style="margin:0"><span class="eyebrow">Rank by</span><div class="seg" role="group" aria-label="Rank by">${BOARD_SORTS.map(([k,l])=>`<button data-bs="${k}" aria-pressed="${boardSort===k}">${l}</button>`).join("")}</div></div>
      <div class="tablewrap"><table class="board"><thead><tr><th>#</th><th>Member</th><th class="num">Points</th><th class="num">Readiness</th><th class="num">Streak</th><th class="num">Learned</th><th class="num">Best sim</th>${isOwnerView?"<th></th>":""}</tr></thead>
        <tbody>${rows.map((r,k)=>`<tr class="${r.id===myId?"me":""}"><td class="rank">${k+1}</td><td>${esc(nameOf(r))}${r.id===myId?' <span class="stage hot">You</span>':""}${r.week===weekKey()?"":' <span class="hint">· inactive this week</span>'}</td>
          ${["points","readiness","streak","learned","bestSim"].map(c=>`<td class="num ${c===boardSort?"sorted":""}">${fmtV(r,c)}</td>`).join("")}
          ${isOwnerView?`<td>${r.id!==myId?`<button class="linkbtn" data-rm="${esc(r.id)}">Remove</button>`:""}</td>`:""}</tr>`).join("")}</tbody></table></div>
      ${rows.length<2?`<p class="hint" style="margin:0">It's just you so far. Copy the invite and send it to your club's group chat.</p>`:""}
      ${how}${privacy}
    </div>
  </div>`;
  root.querySelectorAll("[data-bs]").forEach(b=>b.onclick=()=>{boardSort=b.dataset.bs;renderBoard();});
  $("#clubInvite").onclick=async()=>{try{await navigator.clipboard.writeText(invite);toast("Invite copied");}catch(e){const b=$("#clubInviteBox");b.hidden=false;b.value=invite;b.select();toast("Select the text and copy it");}};
  $("#clubLeave").onclick=()=>{if(!leaveArmed){leaveArmed=true;renderBoard();return;}leaveArmed=false;leaveClub();};
  root.querySelectorAll("[data-rm]").forEach(b=>b.onclick=async()=>{if(b.dataset.armed){try{await boardDb.collection("board").doc(b.dataset.rm).delete();toast("Removed");}catch(e){toast("Couldn't remove that member");}}else{b.dataset.armed="1";b.textContent="Confirm remove";}});
}
async function leaveClub(){
  try{if(boardDb&&myId&&canWrite)await boardDb.collection("board").doc(myId).delete();}catch(e){}
  if(boardUnsub)boardUnsub(); boardUnsub=null; subscribedCode=null; boardRows=[]; lastPush="";
  S.settings.club=null; boardState=boardDb?"none":"unavailable"; save(); renderBoard(); toast("You left the club");
}
function exampleBoard(){
  const ex=[["Example member A",182,64,9,71,"7.8"],["Example member B",140,58,6,60,"7.1"],["Example member C",96,41,3,38,"6.2"]];
  return `<div class="tablewrap"><table class="board"><thead><tr><th>#</th><th>Member</th><th class="num">Points</th><th class="num">Readiness</th><th class="num">Streak</th><th class="num">Learned</th><th class="num">Best sim</th></tr></thead>
    <tbody>${ex.map((r,k)=>`<tr><td class="rank">${k+1}</td><td>${r[0]} <span class="ex">EXAMPLE</span></td><td class="num sorted">${r[1]}</td><td class="num">${r[2]}%</td><td class="num">${r[3]}d</td><td class="num">${r[4]}</td><td class="num">${r[5]}</td></tr>`).join("")}</tbody></table></div>`;
}
initBoard();
