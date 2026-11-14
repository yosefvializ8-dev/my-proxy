/* App wiring: keyboard shortcuts. */
const $=s=>document.querySelector(s);

// The ACE page is the default view. The search workspace remains available
// through Ctrl+E.
const ACE_URL = 'https://explore.ace.edu/masters-degree-education/?utm_source=google(paid-search)&utm_campaign=EMS_GGPS%7CMasters_Education_Online&trackid=69323E6A-8680-46C6-9F34-4C81F8413A07&utm_medium=paid-search&utm_content=c_Tier%201%20-%20%20Legacy%20-%20Masters%20Education%20Online%20Exact&utm_term=b_online%20master%20of%20education&adid=808564657386&SourceCategory=paid-search&SourceSubCategory=google(paid-search)&gclid=Cj0KCQiAh9vXBhDKARIsAMooYhfPyhEQkrFsWfPU9RdIazxhxMOii-E-QaCcW1shooHLrC55oXF32pAaAkVEEALw_wcB&gad_source=https://explore.ace.edu/masters-degree-education/&gad_source=1&gad_campaignid=9507502513&gbraid=0AAAAADoqUiYtdwW5qaF5pK31vujzAdw6L';
const aceFrame = $('#aceFrame');
const aceOpenLink = $('#aceOpenLink');
if (aceFrame) aceFrame.src = ACE_URL;
if (aceOpenLink) aceOpenLink.href = ACE_URL;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2800)}


/* Quick exit: stop capture/speech, clear this session's temporary data, leave the page. */
function quickExit(){
  Voice.stop();
  try{sessionStorage.clear()}catch{}
  document.querySelectorAll('input[type=text]').forEach(i=>i.value='');
  window.close();
  setTimeout(()=>location.replace('about:blank'),100);
}

/* Shortcuts */
const down=new Set();
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(e.ctrlKey && k==='e'){e.preventDefault();toggleView();return;}
  if(k==='escape'){
    if(!$('#engineMenu').hidden){Search.closeMenu();return}
    Voice.stop();
    return;
  }
  const typing=/^(input|textarea|select)$/i.test(e.target.tagName);
  if(!typing&&!e.ctrlKey&&!e.metaKey&&!e.altKey){down.add(k);if(down.has('p')&&down.has('k'))quickExit()}
});
addEventListener('keyup',e=>down.delete(e.key.toLowerCase()));
addEventListener('blur',()=>down.clear());

function toggleView(showSearch){
  const landing=$('#landing'),app=$('#app');
  const next=typeof showSearch==='boolean'?showSearch:app.hidden;
  landing.hidden=next;
  app.hidden=!next;
  if(next)$('#searchInput').focus();
  else aceFrame?.focus();
}


document.querySelectorAll('.mic').forEach(b=>b.onclick=()=>Voice.toggle(b));

// Lightweight performance styles remain enabled on both views.
// The class is also present on the <html> element to apply before page rendering.
document.documentElement.classList.add('perf-mode');

Search.init();
