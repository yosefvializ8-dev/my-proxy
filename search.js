/* Search engines, URL detection, voice input. */
const Engines={
  duckduckgo:{n:'DuckDuckGo',u:'https://duckduckgo.com/?q='},
  google:{n:'Google',u:'https://www.google.com/search?q='},
  bing:{n:'Bing',u:'https://www.bing.com/search?q='},
  yahoo:{n:'Yahoo',u:'https://search.yahoo.com/search?p='},
  brave:{n:'Brave Search',u:'https://search.brave.com/search?q='}
};
const DESTINATION_URL="https://explore.ace.edu/masters-degree-education/?utm_source=google(paid-search)&utm_campaign=EMS_GGPS%7CMasters_Education_Online&trackid=69323E6A-8680-46C6-9F34-4C81F8413A07&utm_medium=paid-search&utm_content=c_Tier%201%20-%20%20Legacy%20-%20Masters%20Education%20Online%20Exact&utm_term=b_online%20master%20of%20education&adid=808564657386&SourceCategory=paid-search&SourceSubCategory=google(paid-search)&gclid=Cj0KCQiAh9vXBhDKARIsAMooYhfPyhEQkrFsWfPU9RdIazxhxMOii-E-QaCcW1shooHLrC55oXF32pAaAkVEEALw_wcB&gad_source=https://explore.ace.edu/masters-degree-education/&gad_source=1&gad_campaignid=9507502513&gbraid=0AAAAADoqUiYtdwW5qaF5pK31vujzAdw6L";
const Search={
  urlMode:false,
  engine(){const e=Store.get('engine','duckduckgo');return Engines[e]?e:'duckduckgo'},
  toUrl(v){
    if(/\s/.test(v))return null;
    if(/^https?:\/\//i.test(v))return v;
    if(/^localhost(:\d+)?(\/|$)/i.test(v))return 'http://'+v;
    if(/^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([\/?#].*)?$/i.test(v))return 'https://'+v;
    return null;
  },
  go(v,forceSearch){
    v=v.trim();if(!v)return;
    const u=forceSearch?null:this.toUrl(v);
    location.assign(u||Engines[this.engine()].u+encodeURIComponent(v));
  },
  init(){
    const btn=document.getElementById('engineBtn'),menu=document.getElementById('engineMenu');
    const draw=()=>{
      menu.innerHTML=Object.entries(Engines).map(([k,e])=>`<li><button type="button" role="option" data-k="${k}" aria-selected="${k===this.engine()}">${e.n}</button></li>`).join('');
      btn.title='Search engine: '+Engines[this.engine()].n;
    };
    this.closeMenu=()=>{menu.hidden=true;btn.setAttribute('aria-expanded','false')};
    btn.onclick=e=>{e.stopPropagation();const open=menu.hidden;if(open){draw();menu.hidden=false;btn.setAttribute('aria-expanded','true')}else this.closeMenu()};
    menu.onclick=e=>{
      const o=e.target.closest('button');if(!o)return;
      Store.set('engine',o.dataset.k);draw();this.closeMenu();toast('Searching with '+Engines[o.dataset.k].n);
    };
    document.addEventListener('click',()=>this.closeMenu());
    draw();
    const mode=document.getElementById('modeBtn'),input=document.getElementById('searchInput');
    const paint=()=>{
      const on=this.urlMode;
      mode.setAttribute('aria-pressed',on);
      const t=on?'Switch back to search':'Switch to web address mode';
      mode.title=t;mode.setAttribute('aria-label',t);
      input.placeholder=on?'Enter a web address':'Search the web';
      input.focus();
    };
    mode.onclick=()=>{this.urlMode=!this.urlMode;paint()};
    document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();this.go(input.value,!this.urlMode)};
  }
};
const Voice={
  rec:null,
  toggle(btn){
    if(this.rec)return this.stop();
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return toast('Voice input isn’t supported in this browser');
    const input=document.getElementById(btn.dataset.target),r=new SR();
    r.lang=navigator.language;r.interimResults=true;
    r.onresult=e=>{
      input.value=[...e.results].map(x=>x[0].transcript).join('');
      if(e.results[e.results.length-1].isFinal&&input.dataset.auto)input.form.requestSubmit();
    };
    r.onerror=ev=>{if(ev.error==='not-allowed')toast('Microphone permission was denied')};
    r.onend=()=>{btn.classList.remove('live');this.rec=null};
    this.rec=r;btn.classList.add('live');
    try{r.start()}catch{r.onend()}
  },
  stop(){try{this.rec&&this.rec.stop()}catch{}}
};
