/* Superday Prep · First-run setup and startup. Loaded last.
   Files in /app are plain scripts loaded in order by bootstrap.js and share one global scope. */
/* ---------- First-run setup ---------- */
function maybeOnboard(){
  if(S.settings.onboarded||S.settings.name||!$("#onboardDlg"))return;
  const d=$("#onboardDlg"); $("#obName").value=(window.__ME&&window.__ME.name)||"";
  d.showModal();
  const done=()=>{S.settings.onboarded=true;save();d.close();renderAll();};
  $("#obSkip").onclick=done;
  $("#onboardForm").onsubmit=e=>{e.preventDefault();
    const name=$("#obName").value.trim(), school=$("#obSchool").value.trim();
    Object.assign(S.settings,{name,school,short:$("#obShort").value.trim()||school,year:$("#obYear").value,major:$("#obMajor").value.trim()});
    const g=guessGrad(); if(g&&!S.settings.gradYear)S.settings.gradYear=g;
    if(name&&window.__setName)window.__setName(name);
    done(); toast("You're set up. Start with today's drill questions");};
}
function renderAll(){renderDrill();renderHist();renderNetwork();renderSim();renderFirms();renderTimeline();renderStory();setMockMode(mockMode);renderBoard();}
route(); pickMock(); renderAll();
