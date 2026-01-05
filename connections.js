/* ---------------------------------
   Connections – The Words That Connect
   Phase 1 core logic
-----------------------------------*/
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // ---------- CONFIG ----------
  const QUESTIONS_PER_LEVEL = 10;
  const PENALTY = 30;
  const THRESHOLD = {1:200,2:180,3:160,4:140,5:120,6:100,7:80,8:60,9:50,10:40};
  const STORE_PREFIX = "connections:v1";

  // ---------- DATA ----------
  // 10-level conjunctions dataset (simplified inline; can be moved to JSON later)
  const DATA = {
    1:[{en:"I like Spanish and music",es:"Me gusta el español y la música"},
       {en:"I have a brother and a sister",es:"Tengo un hermano y una hermana"},
       {en:"I study and work",es:"Estudio y trabajo"},
       {en:"I go out on Saturday or Sunday",es:"Salgo el sábado o el domingo"},
       {en:"I play football and basketball",es:"Juego al fútbol y al baloncesto"},
       {en:"I drink water and juice",es:"Bebo agua y zumo"},
       {en:"I sing and dance",es:"Canto y bailo"},
       {en:"I read or watch TV",es:"Leo o veo la tele"},
       {en:"I listen to music and relax",es:"Escucho música y me relajo"},
       {en:"I write and draw",es:"Escribo y dibujo"}],
    2:[{en:"I like tea but not coffee",es:"Me gusta el té pero no el café"},
       {en:"I study but I am tired",es:"Estudio pero estoy cansado"},
       {en:"I eat fruit but I prefer chocolate",es:"Como fruta pero prefiero el chocolate"},
       {en:"I play football but not tennis",es:"Juego al fútbol pero no al tenis"},
       {en:"I go out but not every day",es:"Salgo pero no todos los días"},
       {en:"I read but I don’t write",es:"Leo pero no escribo"},
       {en:"I like dogs but not cats",es:"Me gustan los perros pero no los gatos"},
       {en:"I travel but rarely",es:"Viajo pero raramente"},
       {en:"I talk a lot but listen a little",es:"Hablo mucho pero escucho poco"},
       {en:"I work but I don’t earn much",es:"Trabajo pero no gano mucho"}],
    3:[{en:"I study because I want to pass",es:"Estudio porque quiero aprobar"},
       {en:"I eat well because I like health",es:"Como bien porque me gusta la salud"},
       {en:"I run because it’s fun",es:"Corro porque es divertido"},
       {en:"I learn Spanish because I travel",es:"Aprendo español porque viajo"},
       {en:"I sleep because I am tired",es:"Duermo porque estoy cansado"},
       {en:"I stay home because it rains",es:"Me quedo en casa porque llueve"},
       {en:"I smile because I am happy",es:"Sonrío porque estoy feliz"},
       {en:"I work because I need money",es:"Trabajo porque necesito dinero"},
       {en:"I help because I care",es:"Ayudo porque me importa"},
       {en:"I study because I love languages",es:"Estudio porque me encantan los idiomas"}],
    4:[{en:"I get up then have breakfast",es:"Me levanto y luego desayuno"},
       {en:"I finish class then go home",es:"Termino la clase y luego voy a casa"},
       {en:"I do homework then relax",es:"Hago los deberes y después me relajo"},
       {en:"I eat lunch then play",es:"Como y luego juego"},
       {en:"I shower then sleep",es:"Me ducho y luego duermo"},
       {en:"I run then stretch",es:"Corro y luego estiro"},
       {en:"I read then write",es:"Leo y luego escribo"},
       {en:"I clean then rest",es:"Limpio y luego descanso"},
       {en:"I work then cook",es:"Trabajo y luego cocino"},
       {en:"I train then eat",es:"Entreno y luego como"}],
    5:[{en:"Although it rains, I play",es:"Aunque llueve, juego"},
       {en:"Although I’m tired, I study",es:"Aunque estoy cansado, estudio"},
       {en:"Although it’s late, I read",es:"Aunque es tarde, leo"},
       {en:"Although it’s cold, I swim",es:"Aunque hace frío, nado"},
       {en:"Although I have homework, I watch TV",es:"Aunque tengo deberes, veo la tele"},
       {en:"Although I’m hungry, I wait",es:"Aunque tengo hambre, espero"},
       {en:"Although it’s hard, I try",es:"Aunque es difícil, intento"},
       {en:"Although it’s noisy, I sleep",es:"Aunque hay ruido, duermo"},
       {en:"Although I’m busy, I help",es:"Aunque estoy ocupado, ayudo"},
       {en:"Although it’s small, it’s nice",es:"Aunque es pequeño, es bonito"}],
    6:[{en:"If it rains, I stay home",es:"Si llueve, me quedo en casa"},
       {en:"If I study, I pass",es:"Si estudio, apruebo"},
       {en:"If I’m late, I call",es:"Si llego tarde, llamo"},
       {en:"If I’m hungry, I eat",es:"Si tengo hambre, como"},
       {en:"If I’m bored, I read",es:"Si estoy aburrido, leo"},
       {en:"If I have time, I play",es:"Si tengo tiempo, juego"},
       {en:"If it’s sunny, I go out",es:"Si hace sol, salgo"},
       {en:"If I’m tired, I sleep",es:"Si estoy cansado, duermo"},
       {en:"If I’m cold, I wear a coat",es:"Si tengo frío, llevo abrigo"},
       {en:"If I have money, I travel",es:"Si tengo dinero, viajo"}],
    7:[{en:"I study so that I can travel",es:"Estudio para que pueda viajar"},
       {en:"I work so that I can buy a car",es:"Trabajo para que pueda comprar un coche"},
       {en:"I run so that I stay fit",es:"Corro para que esté en forma"},
       {en:"I learn so that I understand",es:"Aprendo para que entienda"},
       {en:"I read so that I know more",es:"Leo para que sepa más"},
       {en:"I save money so that I can go on holiday",es:"Ahorro dinero para que pueda ir de vacaciones"},
       {en:"I eat healthy so that I feel good",es:"Como sano para que me sienta bien"},
       {en:"I study hard so that I pass",es:"Estudio mucho para que apruebe"},
       {en:"I practise so that I improve",es:"Practico para que mejore"},
       {en:"I write so that I remember",es:"Escribo para que recuerde"}],
    8:[{en:"It’s difficult; however I try",es:"Es difícil; sin embargo intento"},
       {en:"It rains; however I run",es:"Llueve; sin embargo corro"},
       {en:"I’m tired; however I study",es:"Estoy cansado; sin embargo estudio"},
       {en:"It’s late; however I read",es:"Es tarde; sin embargo leo"},
       {en:"It’s cold; however I swim",es:"Hace frío; sin embargo nado"},
       {en:"It’s boring; however I help",es:"Es aburrido; sin embargo ayudo"},
       {en:"It’s noisy; however I sleep",es:"Hay ruido; sin embargo duermo"},
       {en:"It’s small; however it’s nice",es:"Es pequeño; sin embargo es bonito"},
       {en:"It’s far; however I walk",es:"Está lejos; sin embargo camino"},
       {en:"It’s hard; however I continue",es:"Es difícil; sin embargo continúo"}],
    9:[{en:"I go out unless it rains",es:"Salgo a menos que llueva"},
       {en:"I study unless I’m sick",es:"Estudio a menos que esté enfermo"},
       {en:"I work unless I’m tired",es:"Trabajo a menos que esté cansado"},
       {en:"I travel unless it’s expensive",es:"Viajo a menos que sea caro"},
       {en:"I play unless I have homework",es:"Juego a menos que tenga deberes"},
       {en:"I eat out unless I’m broke",es:"Como fuera a menos que esté sin dinero"},
       {en:"I run unless it’s cold",es:"Corro a menos que haga frío"},
       {en:"I help unless I’m busy",es:"Ayudo a menos que esté ocupado"},
       {en:"I read unless I’m tired",es:"Leo a menos que esté cansado"},
       {en:"I sleep unless I’m hungry",es:"Duermo a menos que tenga hambre"}],
    10:[{en:"Despite being tired, I study",es:"A pesar de estar cansado, estudio"},
        {en:"Despite the rain, I go out",es:"A pesar de la lluvia, salgo"},
        {en:"Despite the noise, I sleep",es:"A pesar del ruido, duermo"},
        {en:"Despite the cold, I swim",es:"A pesar del frío, nado"},
        {en:"Despite the time, I read",es:"A pesar de la hora, leo"},
        {en:"Despite the homework, I play",es:"A pesar de los deberes, juego"},
        {en:"Despite the price, I buy it",es:"A pesar del precio, lo compro"},
        {en:"Despite the pain, I run",es:"A pesar del dolor, corro"},
        {en:"Despite being busy, I help",es:"A pesar de estar ocupado, ayudo"},
        {en:"Despite being small, it’s nice",es:"A pesar de ser pequeño, es bonito"}]
  };

  // ---------- STATE ----------
  let currentLevel = 1, quiz = [], startTime = 0, timer = null;

  // ---------- HELPERS ----------
  function norm(s){ return (s||"").trim().toLowerCase(); }
  function compare(a,b){ return norm(a)===norm(b); }
  const keyBest = lvl => `${STORE_PREFIX}:best:${lvl}`;
  const keyUnlocked = lvl => `${STORE_PREFIX}:unlocked:${lvl}`;
  const getBest = lvl => parseInt(localStorage.getItem(keyBest(lvl)))||null;
  const saveBest = (lvl,score)=>{const b=getBest(lvl);if(!b||score<b)localStorage.setItem(keyBest(lvl),score);};
  const isUnlocked = lvl => lvl===1 || localStorage.getItem(keyUnlocked(lvl))==="1";
  const unlock = lvl => localStorage.setItem(keyUnlocked(lvl),"1");

  // ---------- RENDER ----------
  function renderLevels(){
    const list=$("#level-list"); list.innerHTML="";
    for(let i=1;i<=10;i++){
      const btn=document.createElement("button");
      btn.className="level-btn";
      const unlocked=isUnlocked(i);
      btn.disabled=!unlocked;
      const best=getBest(i);
      btn.textContent=unlocked?`Level ${i}`:`Level ${i}`;
      if(unlocked && best) {
        const span=document.createElement("span");
        span.className="best";
        span.textContent=`Best: ${best}s`;
        btn.appendChild(span);
      }
      btn.onclick=()=>startLevel(i);
      list.appendChild(btn);
    }
  }

  function startLevel(lvl){
    currentLevel=lvl;
    $("#main-menu").style.display="none";
    $("#game").style.display="block";
    $("#results").innerHTML="";
    $("#level-label").textContent=`Level ${lvl}`;
    quiz=[...DATA[lvl]];
    startTimer();
    renderQuestions();
  }

  function renderQuestions(){
    const qwrap=$("#questions"); qwrap.innerHTML="";
    quiz.forEach((q,i)=>{
      const div=document.createElement("div"); div.className="q";
      const p=document.createElement("div"); p.className="prompt"; p.textContent=`${i+1}. ${q.en}`;
      const input=document.createElement("input"); input.type="text"; input.placeholder="Type in Spanish...";
      input.oninput=e=>quiz[i].user=e.target.value;
      div.appendChild(p); div.appendChild(input); qwrap.appendChild(div);
    });
  }

  // ---------- TIMER ----------
  function startTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      const t=Math.floor((Date.now()-startTime)/1000);
      $("#timer").textContent=`Time: ${t}s`;
    },200);
  }
  function stopTimer(){clearInterval(timer);return Math.floor((Date.now()-startTime)/1000);}

  // ---------- GAME FLOW ----------
  $("#submit").onclick=()=>{
    const time=stopTimer();
    let correct=0,wrong=0;
    $$("#questions input").forEach((inp,i)=>{
      const q=quiz[i];
    if (compare(q.user, q.es)) {
  inp.classList.add("good");
  correct++;

  // NEW: show learning feedback
  const fb = document.createElement("div");
  fb.className = "feedback";
  fb.innerHTML = `<span class="right">✅ Correct!</span>`;
  inp.parentElement.appendChild(fb);

} else {
  inp.classList.add("bad");
  wrong++;

  // NEW: show correct version
  const fb = document.createElement("div");
  fb.className = "feedback";
  fb.innerHTML = `<span class="wrong">❌ Incorrect.</span> <br><em>Correct answer:</em> <strong>${quiz[i].es}</strong>`;
  inp.parentElement.appendChild(fb);
}

inp.disabled = true;
 
    });
    const score=time+(wrong*PENALTY);
    const results=$("#results");
    const best=getBest(currentLevel);
    saveBest(currentLevel,score);
    let unlockMsg="";
    if(currentLevel<10){
      const need=THRESHOLD[currentLevel];
      if(score<=need){ unlock(currentLevel+1); unlockMsg=`🎉 Level ${currentLevel+1} unlocked!`; }
      else unlockMsg=`Need ${score-need}s less to unlock next level.`;
    } else unlockMsg="🏁 Final level complete!";
    results.innerHTML=
      `<p><strong>Score:</strong> ${score}s<br>
       Correct: ${correct}/${quiz.length}<br>
       ${unlockMsg}</p>`;
    confetti(correct===quiz.length);
  };

  $("#back-button").onclick=()=>{
    stopTimer();
    $("#game").style.display="none";
    $("#main-menu").style.display="block";
    renderLevels();
  };

  function confetti(show){
    if(!show)return;
    for(let i=0;i<80;i++){
      const c=document.createElement("div");
      c.className="confetti";
      c.style.left=Math.random()*window.innerWidth+"px";
      c.style.backgroundColor=["#FF6F61","#6E7FCA","#2ECC71","#FFD60A"][i%4];
      c.style.animationDelay=(Math.random()*1000)+"ms";
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),1600);
    }
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded",()=>{
    unlock(1); // ensure level 1 unlocked
    renderLevels();
  });
})();
