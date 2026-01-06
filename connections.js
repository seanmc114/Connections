// Connections — Synge Street CBS Edition
// Turbo-Jump style scoring: +30 s per wrong / blank answer

document.addEventListener("DOMContentLoaded", () => {

  const levelList = document.getElementById("level-list");
  const mainMenu  = document.getElementById("main-menu");
  const game      = document.getElementById("game");
  const questions = document.getElementById("questions");
  const results   = document.getElementById("results");
  const timerBox  = document.getElementById("timer");
  const levelLbl  = document.getElementById("level-label");
  const submitBtn = document.getElementById("submit");
  const backBtn   = document.getElementById("back-button");

  let currentLevel = 1, startTime = 0, timer = null, quiz = [];

  const keyBest  = l => `connections_best_${l}`;
  const keyUnlock= l => `connections_unlocked_${l}`;
  const getBest  = l => parseInt(localStorage.getItem(keyBest(l))) || null;
  const saveBest = (l,s)=>{const b=getBest(l);if(!b||s<b)localStorage.setItem(keyBest(l),s);};
  const unlocked = l => l===1 || localStorage.getItem(keyUnlock(l))==="true";
  const unlock   = l => localStorage.setItem(keyUnlock(l),"true");

  // -------- tolerant comparison --------
  const norm = s => (s||"")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[¡!¿?.,;:"]/g,"")
    .trim();
  const same = (a,b) => norm(a)===norm(b);

  // -------- level data (10×10) --------
  const DATA = { /* keep your full 10-level dataset here exactly as before */ };

  const shuffle = a => a.sort(()=>Math.random()-0.5);

  // -------- build menu --------
  function drawMenu(){
    levelList.innerHTML="";
    for(let i=1;i<=10;i++){
      const b=document.createElement("button");
      b.className="level-btn";
      b.textContent=`Level ${i}`;
      const best=getBest(i);
      if(best){
        const s=document.createElement("span");
        s.className="best";
        s.textContent=`Best: ${best}s`;
        b.appendChild(s);
      }
      b.disabled=!unlocked(i);
      b.onclick=()=>start(i);
      levelList.appendChild(b);
    }
  }

  // -------- start level --------
  function start(l){
    currentLevel=l;
    mainMenu.style.display="none";
    game.style.display="block";
    results.innerHTML="";
    levelLbl.textContent=`Level ${l}`;
    quiz=shuffle([...DATA[l]]);
    showQuestions();
    beginTimer();
  }

  // -------- render questions --------
  function showQuestions(){
    questions.innerHTML="";
    quiz.forEach((q,i)=>{
      const d=document.createElement("div");
      d.className="q";
      d.innerHTML=`<div class="prompt">${i+1}. ${q.en}</div>`;
      const input=document.createElement("input");
      input.type="text";
      input.placeholder="Type in Spanish...";
      q.user="";
      input.oninput=e=>q.user=e.target.value;
      d.appendChild(input);
      questions.appendChild(d);
    });
  }

  // -------- timer --------
  function beginTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      timerBox.textContent=`Time: ${Math.floor((Date.now()-startTime)/1000)}s`;
    },250);
  }
  function stopTimer(){clearInterval(timer);return Math.floor((Date.now()-startTime)/1000);}

  // -------- submit / scoring --------
  submitBtn.onclick=()=>{
    const elapsed = stopTimer();
    let wrong = 0, right = 0;

    document.querySelectorAll("#questions input").forEach((inp,i)=>{
      const q=quiz[i];
      const fb=document.createElement("div");
      fb.className="feedback";

      if(same(q.user,q.es)){
        right++;
        fb.style.color="#2ecc71";
        fb.textContent="✅ Correct!";
        inp.classList.add("good");
      } else {
        wrong++;
        fb.style.color="#e74c3c";
        fb.innerHTML=`❌ Incorrect.<br><em>Correct answer:</em> ${q.es}`;
        inp.classList.add("bad");
      }

      inp.disabled=true;
      inp.parentElement.appendChild(fb);
    });

    const penalty = wrong * 30;
    const total   = elapsed + penalty;

    saveBest(currentLevel,total);
    if(currentLevel<10) unlock(currentLevel+1);

    results.innerHTML = `
      <p>
        <strong>Time:</strong> ${elapsed}s<br>
        <strong>Incorrect:</strong> ${wrong} × 30 = ${penalty}s penalty<br>
        <strong>Final Score:</strong> ${total}s<br>
        Correct: ${right}/${quiz.length}
      </p>`;
  };

  // -------- back to menu --------
  backBtn.onclick=()=>{
    game.style.display="none";
    mainMenu.style.display="block";
    clearInterval(timer);
    drawMenu();
  };

  unlock(1);
  drawMenu();
});
