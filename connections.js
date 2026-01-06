document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const levelList=$("level-list"),mainMenu=$("main-menu"),
        game=$("game"),questionsDiv=$("questions"),
        resultsDiv=$("results"),timerDisplay=$("timer"),
        levelLabel=$("level-label"),submitBtn=$("submit"),
        backBtn=$("back-button");

  let currentLevel=1,startTime=0,timer=null,quiz=[];

  const keyBest=l=>`connections_best_${l}`,
        keyUnlock=l=>`connections_unlocked_${l}`;
  const getBest=l=>parseInt(localStorage.getItem(keyBest(l)))||null;
  const saveBest=(l,s)=>{const b=getBest(l);if(!b||s<b)localStorage.setItem(keyBest(l),s);};
  const isUnlocked=l=>l===1||localStorage.getItem(keyUnlock(l))==="true";
  const unlock=l=>localStorage.setItem(keyUnlock(l),"true");
  const unlockTimeForLevel=l=>Math.max(180-(l-2)*20,20);

  const normalize=s=>(s||"").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[¡!¿?.,;:"]/g,"").trim();
  const equal=(a,b)=>normalize(a)===normalize(b);

  const DATA={
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
    ]
  };

  const shuffle=a=>a.sort(()=>Math.random()-0.5);

  function renderLevels(){
    levelList.innerHTML="";
    for(let i=1;i<=10;i++){
      const b=document.createElement("button");
      b.className="level-btn";
      b.textContent=`Level ${i}`;
      const best=getBest(i);
      if(best){
        const s=document.createElement("span");
        s.className="best";s.textContent=`Best: ${best}s`;
        b.appendChild(s);
      }
      b.disabled=!isUnlocked(i);
      b.addEventListener("click",()=>startLevel(i));
      levelList.appendChild(b);
    }
  }

  function startLevel(l){
    currentLevel=l;
    mainMenu.style.display="none";
    game.style.display="block";
    resultsDiv.innerHTML="";
    levelLabel.textContent=`Level ${l}`;
    quiz=shuffle([...DATA[l]]);
    renderQuestions();
    startTimer();
  }

  function renderQuestions(){
    questionsDiv.innerHTML="";
    quiz.forEach((q,i)=>{
      const d=document.createElement("div");
      d.className="q";
      d.innerHTML=`<div class="prompt">${i+1}. ${q.en}</div>`;
      const inp=document.createElement("input");
      inp.type="text";inp.placeholder="Type in Spanish...";
      inp.addEventListener("input",e=>q.user=e.target.value);
      d.appendChild(inp);questionsDiv.appendChild(d);
    });
  }

  function startTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      const t=Math.floor((Date.now()-startTime)/1000);
      timerDisplay.textContent=`Time: ${t}s`;
    },300);
  }
  function stopTimer(){clearInterval(timer);
    return Math.floor((Date.now()-startTime)/1000);}

  submitBtn.addEventListener("click",()=>{
    const time=stopTimer();let wrong=0,correct=0;
    document.querySelectorAll("#questions input").forEach((inp,i)=>{
      const q=quiz[i],fb=document.createElement("div");
      fb.className="feedback";
      if(equal(q.user,q.es)){
        fb.style.color="#2ecc71";fb.textContent="✅ Correct!";correct++;
      }else{
        fb.style.color="#e74c3c";
        fb.innerHTML=`❌ Incorrect.<br><em>Correct:</em> ${q.es}`;
        wrong++;
      }
      inp.disabled=true;inp.parentElement.appendChild(fb);
    });
    const penalty=wrong*30,final=time+penalty;
    saveBest(currentLevel,final);
    const next=currentLevel+1;
    if(next<=10&&final<=unlockTimeForLevel(next))unlock(next);
    resultsDiv.innerHTML=`
      <p><strong>Time:</strong> ${time}s<br>
      <strong>Incorrect:</strong> ${wrong}×30s=${penalty}s<br>
      <strong>Final Score:</strong> ${final}s</p>`;
  });

  backBtn.addEventListener("click",()=>{
    game.style.display="none";mainMenu.style.display="block";
    clearInterval(timer);renderLevels();
  });

  unlock(1);renderLevels();
});
