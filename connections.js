// Connections Game — Synge Street CBS Edition
// Final classroom-friendly version: 10×10 questions, green/red feedback, accent-tolerant

document.addEventListener("DOMContentLoaded", () => {

  const levelList = document.getElementById("level-list");
  const mainMenu = document.getElementById("main-menu");
  const game = document.getElementById("game");
  const questionsDiv = document.getElementById("questions");
  const resultsDiv = document.getElementById("results");
  const timerDisplay = document.getElementById("timer");
  const levelLabel = document.getElementById("level-label");
  const submitBtn = document.getElementById("submit");
  const backBtn = document.getElementById("back-button");

  let currentLevel = 1, startTime = 0, timer = null, quiz = [];

  const bestKey = l => `connections_best_${l}`;
  const unlockKey = l => `connections_unlocked_${l}`;
  const getBest = l => parseInt(localStorage.getItem(bestKey(l))) || null;
  const saveBest = (l, s) => {
    const b = getBest(l);
    if (!b || s < b) localStorage.setItem(bestKey(l), s);
  };
  const isUnlocked = l => l === 1 || localStorage.getItem(unlockKey(l)) === "true";
  const unlock = l => localStorage.setItem(unlockKey(l), "true");

  const normalize = s =>
    s.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g,"")
     .replace(/[¡!¿?.,;:"]/g,"")
     .trim();

  const equal = (a,b) => normalize(a) === normalize(b);

  // ---------- 10 levels (10 questions each) ----------
  const DATA = {
    1:[
      {en:"I like Spanish and music",es:"Me gusta el espanol y la musica"},
      {en:"I have a brother and a sister",es:"Tengo un hermano y una hermana"},
      {en:"I play football and basketball",es:"Juego al futbol y al baloncesto"},
      {en:"I eat apples and oranges",es:"Como manzanas y naranjas"},
      {en:"I drink water and juice",es:"Bebo agua y zumo"},
      {en:"I sing and dance",es:"Canto y bailo"},
      {en:"I walk and talk with friends",es:"Camino y hablo con amigos"},
      {en:"I listen and learn",es:"Escucho y aprendo"},
      {en:"I read and write every day",es:"Leo y escribo todos los dias"},
      {en:"I laugh and smile",es:"Rio y sonrio"}
    ],
    2:[
      {en:"I like tea but not coffee",es:"Me gusta el te pero no el cafe"},
      {en:"I study but I am tired",es:"Estudio pero estoy cansado"},
      {en:"I eat fruit but I prefer chocolate",es:"Como fruta pero prefiero el chocolate"},
      {en:"I play football but not tennis",es:"Juego al futbol pero no al tenis"},
      {en:"I work but I dont earn much",es:"Trabajo pero no gano mucho"},
      {en:"I help but sometimes forget",es:"Ayudo pero a veces olvido"},
      {en:"I travel but rarely",es:"Viajo pero raramente"},
      {en:"I talk a lot but listen a little",es:"Hablo mucho pero escucho poco"},
      {en:"I study but Im bored",es:"Estudio pero estoy aburrido"},
      {en:"I run but Im slow",es:"Corro pero soy lento"}
    ],
    3:[
      {en:"I study because I want to pass",es:"Estudio porque quiero aprobar"},
      {en:"I eat well because I like health",es:"Como bien porque me gusta la salud"},
      {en:"I learn Spanish because I travel",es:"Aprendo espanol porque viajo"},
      {en:"I sleep because Im tired",es:"Duermo porque estoy cansado"},
      {en:"I stay home because it rains",es:"Me quedo en casa porque llueve"},
      {en:"I work because I need money",es:"Trabajo porque necesito dinero"},
      {en:"I run because its fun",es:"Corro porque es divertido"},
      {en:"I help because I care",es:"Ayudo porque me importa"},
      {en:"I study because I love languages",es:"Estudio porque me encantan los idiomas"},
      {en:"I smile because Im happy",es:"Sonrio porque estoy feliz"}
    ],
    4:[
      {en:"I get up then have breakfast",es:"Me levanto y luego desayuno"},
      {en:"I finish class then go home",es:"Termino la clase y luego voy a casa"},
      {en:"I do homework then relax",es:"Hago los deberes y despues me relajo"},
      {en:"I shower then sleep",es:"Me ducho y luego duermo"},
      {en:"I read then write",es:"Leo y luego escribo"},
      {en:"I train then eat",es:"Entreno y luego como"},
      {en:"I clean then rest",es:"Limpio y luego descanso"},
      {en:"I cook then wash dishes",es:"Cocino y luego lavo los platos"},
      {en:"I walk then run",es:"Camino y luego corro"},
      {en:"I play then study",es:"Juego y luego estudio"}
    ],
    5:[
      {en:"Although it rains I play",es:"Aunque llueve juego"},
      {en:"Although Im tired I study",es:"Aunque estoy cansado estudio"},
      {en:"Although its late I read",es:"Aunque es tarde leo"},
      {en:"Although its cold I swim",es:"Aunque hace frio nado"},
      {en:"Although I have homework I watch TV",es:"Aunque tengo deberes veo la tele"},
      {en:"Although its hard I try",es:"Aunque es dificil intento"},
      {en:"Although Im hungry I wait",es:"Aunque tengo hambre espero"},
      {en:"Although its noisy I sleep",es:"Aunque hay ruido duermo"},
      {en:"Although Im busy I help",es:"Aunque estoy ocupado ayudo"},
      {en:"Although its small its nice",es:"Aunque es pequeno es bonito"}
    ],
    6:[
      {en:"If it rains I stay home",es:"Si llueve me quedo en casa"},
      {en:"If I study I pass",es:"Si estudio apruebo"},
      {en:"If Im late I call",es:"Si llego tarde llamo"},
      {en:"If Im hungry I eat",es:"Si tengo hambre como"},
      {en:"If Im bored I read",es:"Si estoy aburrido leo"},
      {en:"If I have time I play",es:"Si tengo tiempo juego"},
      {en:"If its sunny I go out",es:"Si hace sol salgo"},
      {en:"If Im tired I sleep",es:"Si estoy cansado duermo"},
      {en:"If Im cold I wear a coat",es:"Si tengo frio llevo abrigo"},
      {en:"If I have money I travel",es:"Si tengo dinero viajo"}
    ],
    7:[
      {en:"I study so that I can travel",es:"Estudio para que pueda viajar"},
      {en:"I work so that I can buy a car",es:"Trabajo para que pueda comprar un coche"},
      {en:"I run so that I stay fit",es:"Corro para que este en forma"},
      {en:"I read so that I know more",es:"Leo para que sepa mas"},
      {en:"I learn so that I understand",es:"Aprendo para que entienda"},
      {en:"I eat healthy so that I feel good",es:"Como sano para que me sienta bien"},
      {en:"I practise so that I improve",es:"Practico para que mejore"},
      {en:"I study hard so that I pass",es:"Estudio mucho para que apruebe"},
      {en:"I write so that I remember",es:"Escribo para que recuerde"},
      {en:"I save money so that I can travel",es:"Ahorro dinero para que pueda viajar"}
    ],
    8:[
      {en:"Its difficult however I try",es:"Es dificil sin embargo intento"},
      {en:"It rains however I run",es:"Llueve sin embargo corro"},
      {en:"Im tired however I study",es:"Estoy cansado sin embargo estudio"},
      {en:"Its late however I read",es:"Es tarde sin embargo leo"},
      {en:"Its cold however I swim",es:"Hace frio sin embargo nado"},
      {en:"Its boring however I help",es:"Es aburrido sin embargo ayudo"},
      {en:"Its noisy however I sleep",es:"Hay ruido sin embargo duermo"},
      {en:"Its small however its nice",es:"Es pequeno sin embargo es bonito"},
      {en:"Its far however I walk",es:"Esta lejos sin embargo camino"},
      {en:"Its hard however I continue",es:"Es dificil sin embargo continuo"}
    ],
    9:[
      {en:"I go out unless it rains",es:"Salgo a menos que llueva"},
      {en:"I study unless Im sick",es:"Estudio a menos que este enfermo"},
      {en:"I work unless Im tired",es:"Trabajo a menos que este cansado"},
      {en:"I play unless I have homework",es:"Juego a menos que tenga deberes"},
      {en:"I travel unless its expensive",es:"Viajo a menos que sea caro"},
      {en:"I eat out unless Im broke",es:"Como fuera a menos que este sin dinero"},
      {en:"I run unless its cold",es:"Corro a menos que haga frio"},
      {en:"I help unless Im busy",es:"Ayudo a menos que este ocupado"},
      {en:"I read unless Im tired",es:"Leo a menos que este cansado"},
      {en:"I sleep unless Im hungry",es:"Duermo a menos que tenga hambre"}
    ],
    10:[
      {en:"Despite being tired I study",es:"A pesar de estar cansado estudio"},
      {en:"Despite the rain I go out",es:"A pesar de la lluvia salgo"},
      {en:"Despite the noise I sleep",es:"A pesar del ruido duermo"},
      {en:"Despite the cold I swim",es:"A pesar del frio nado"},
      {en:"Despite the time I read",es:"A pesar de la hora leo"},
      {en:"Despite the homework I play",es:"A pesar de los deberes juego"},
      {en:"Despite the price I buy it",es:"A pesar del precio lo compro"},
      {en:"Despite the pain I run",es:"A pesar del dolor corro"},
      {en:"Despite being busy I help",es:"A pesar de estar ocupado ayudo"},
      {en:"Despite being small its nice",es:"A pesar de ser pequeno es bonito"}
    ]
  };

  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  function renderLevels() {
    levelList.innerHTML = "";
    for (let i=1;i<=10;i++) {
      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.textContent = `Level ${i}`;
      const best=getBest(i);
      if(best){
        const span=document.createElement("span");
        span.className="best";
        span.textContent=`Best: ${best}s`;
        btn.appendChild(span);
      }
      btn.disabled=!isUnlocked(i);
      btn.addEventListener("click",()=>startLevel(i));
      levelList.appendChild(btn);
    }
  }

  function startLevel(lvl) {
    currentLevel = lvl;
    mainMenu.style.display="none";
    game.style.display="block";
    resultsDiv.innerHTML="";
    levelLabel.textContent=`Level ${lvl}`;
    quiz = shuffle([...DATA[lvl]]);
    renderQuestions();
    startTimer();
  }

  function renderQuestions() {
    questionsDiv.innerHTML="";
    quiz.forEach((q,i)=>{
      const div=document.createElement("div");
      div.className="q";
      div.innerHTML=`<div class="prompt">${i+1}. ${q.en}</div>`;
      const input=document.createElement("input");
      input.type="text";
      input.placeholder="Type in Spanish...";
      q.user="";
      input.addEventListener("input",e=>q.user=e.target.value);
      div.appendChild(input);
      questionsDiv.appendChild(div);
    });
  }

  function startTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      const t=Math.floor((Date.now()-startTime)/1000);
      timerDisplay.textContent=`Time: ${t}s`;
    },300);
  }
  function stopTimer(){clearInterval(timer);return Math.floor((Date.now()-startTime)/1000);}

  submitBtn.addEventListener("click",()=>{
    const time=stopTimer();
    let correct=0;
    document.querySelectorAll("#questions input").forEach((inp,i)=>{
      const q=quiz[i];
      const fb=document.createElement("div");
      fb.className="feedback";
      if(equal(q.user,q.es)){
        inp.classList.add("good");
        fb.style.color="#2ecc71"; // green
        fb.innerHTML=`✅ Correct!`;
        correct++;
      } else {
        inp.classList.add("bad");
        fb.style.color="#e74c3c"; // red
        fb.innerHTML=`❌ Incorrect.<br><em>Correct answer:</em> ${q.es}`;
      }
      inp.parentElement.appendChild(fb);
      inp.disabled=true;
    });
    const score=time;
    saveBest(currentLevel,score);
    if(currentLevel<10) unlock(currentLevel+1);
    resultsDiv.innerHTML=`<p><strong>Score:</strong> ${score}s<br>Correct: ${correct}/${quiz.length}</p>`;
  });

  backBtn.addEventListener("click",()=>{
    game.style.display="none";
    mainMenu.style.display="block";
    clearInterval(timer);
    renderLevels();
  });

  unlock(1);
  renderLevels();
});
