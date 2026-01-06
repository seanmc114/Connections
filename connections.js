// Connections Game — Synge Street CBS Edition
// Final version with +30s per incorrect or blank answer

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

  // ---- storage helpers ----
  const bestKey = l => `connections_best_${l}`;
  const unlockKey = l => `connections_unlocked_${l}`;
  const getBest = l => parseInt(localStorage.getItem(bestKey(l))) || null;
  const saveBest = (l,s)=>{const b=getBest(l);if(!b||s<b)localStorage.setItem(bestKey(l),s);};
  const isUnlocked = l => l===1 || localStorage.getItem(unlockKey(l))==="true";
  const unlock = l => localStorage.setItem(unlockKey(l),"true");

  // ---- accent & punctuation tolerant comparison ----
  const normalize = s =>
    (s||"")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[¡!¿?.,;:"]/g,"")
      .trim();
  const equal = (a,b) => normalize(a) === normalize(b);

  // ---- question data (10×10) ----
  const DATA = { /* same as previous full version */ };

  const shuffle = arr => arr.sort(()=>Math.random()-0.5);

  // ---- build level buttons ----
  function renderLevels(){
    levelList.innerHTML="";
    for(let i=1;i<=10;i++){
      const btn=document.createElement("button");
      btn.className="level-btn";
      btn.textContent=`Level ${i}`;
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

  function startLevel(lvl){
    currentLevel=lvl;
    mainMenu.style.display="none";
    game.style.display="block";
    resultsDiv.innerHTML="";
    levelLabel.textContent=`Level ${lvl}`;
    quiz=shuffle([...DATA[lvl]]);
    renderQuestions();
    startTimer();
  }

  function renderQuestions(){
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

  // ---- timer ----
  function startTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      const t=Math.floor((Date.now()-startTime)/1000);
      timerDisplay.textContent=`Time: ${t}s`;
    },300);
  }
  function stopTimer(){clearInterval(timer);return Math.floor((Date.now()-startTime)/1000);}

  // ---- submit ----
  submitBtn.addEventListener("click",()=>{
    const time=stopTimer();
    let correct=0, incorrect=0;

    document.querySelectorAll("#questions input").forEach((inp,i)=>{
      const q=quiz[i];
      const fb=document.createElement("div");
      fb.className="feedback";

      if(equal(q.user,q.es)){
        inp.classList.add("good");
        fb.style.color="#2ecc71"; // green
        fb.innerHTML="✅ Correct!";
        correct++;
      } else {
        inp.classList.add("bad");
        fb.style.color="#e74c3c"; // red
        fb.innerHTML=`❌ Incorrect.<br><em>Correct answer:</em> ${q.es}`;
        incorrect++;
      }

      inp.parentElement.appendChild(fb);
      inp.disabled=true;
    });

    // ---- scoring logic ----
    const penalty = incorrect * 30;
    const finalScore = time + penalty;

    saveBest(currentLevel, finalScore);
    if(currentLevel < 10) unlock(currentLevel + 1);

    resultsDiv.innerHTML = `
      <p>
        <strong>Time:</strong> ${time}s<br>
        <strong>Incorrect:</strong> ${incorrect} × 30s = ${penalty}s penalty<br>
        <strong>Final Score:</strong> ${finalScore}s<br>
        Correct: ${correct}/${quiz.length}
      </p>`;
  });

  // ---- back button ----
  backBtn.addEventListener("click",()=>{
    game.style.display="none";
    mainMenu.style.display="block";
    clearInterval(timer);
    renderLevels();
  });

  unlock(1);
  renderLevels();
});
