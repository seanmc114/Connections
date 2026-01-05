(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const QUESTIONS_PER_LEVEL = 10;
  const PENALTY = 30;
  const THRESHOLD = {1:200,2:180,3:160,4:140,5:120,6:100,7:80,8:60,9:50,10:40};
  const STORE_PREFIX = "connections:v1";

  // dataset (shortened for brevity—keep your existing one)
  const DATA = { /* … your 10-level data from before … */ };

  let currentLevel = 1, quiz = [], startTime = 0, timer = null;

  const norm = s => (s||"").trim().toLowerCase();
  const compare = (a,b) => norm(a)===norm(b);
  const keyBest = lvl => `${STORE_PREFIX}:best:${lvl}`;
  const keyUnlocked = lvl => `${STORE_PREFIX}:unlocked:${lvl}`;
  const getBest = lvl => parseInt(localStorage.getItem(keyBest(lvl)))||null;
  const saveBest = (lvl,score)=>{const b=getBest(lvl);if(!b||score<b)localStorage.setItem(keyBest(lvl),score);};
  const isUnlocked = lvl => lvl===1 || localStorage.getItem(keyUnlocked(lvl))==="1";
  const unlock = lvl => localStorage.setItem(keyUnlocked(lvl),"1");

  function renderLevels(){
    const list=$("#level-list"); list.innerHTML="";
    for(let i=1;i<=10;i++){
      const btn=document.createElement("button");
      btn.className="level-btn";
      const unlocked=isUnlocked(i);
      btn.disabled=!unlocked;
      const best=getBest(i);
      btn.textContent=`Level ${i}`;
      if(unlocked && best){
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
      const input=document.createElement("input");
      input.type="text";
      input.placeholder="Type in Spanish...";
      input.oninput=e=>quiz[i].user=e.target.value;
      div.appendChild(p); div.appendChild(input);
      qwrap.appendChild(div);
    });
  }

  function startTimer(){
    startTime=Date.now();
    timer=setInterval(()=>{
      const t=Math.floor((Date.now()-startTime)/1000);
      $("#timer").textContent=`Time: ${t}s`;
    },200);
  }
  function stopTimer(){clearInterval(timer);return Math.floor((Date.now()-startTime)/1000);}

  $("#submit").onclick=()=>{
    const time=stopTimer();
    let correct=0,wrong=0;
    $$("#questions input").forEach((inp,i)=>{
      const q=quiz[i];
      if(compare(q.user,q.es)){
        inp.classList.add("good"); correct++;
        const fb=document.createElement("div");
        fb.className="feedback";
        fb.innerHTML=`<span class="right">✅ Correct!</span>`;
        inp.parentElement.appendChild(fb);
      } else {
        inp.classList.add("bad"); wrong++;
        const fb=document.createElement("div");
        fb.className="feedback";
        fb.innerHTML=`<span class="wrong">❌ Incorrect.</span> <br><em>Correct answer:</em> <strong>${q.es}</strong>`;
        inp.parentElement.appendChild(fb);
      }
      inp.disabled=true;
    });

    const score=time+(wrong*PENALTY);
    saveBest(currentLevel,score);
    const best=getBest(currentLevel);
    let unlockMsg="";
    if(currentLevel<10){
      const need=THRESHOLD[currentLevel];
      if(score<=need){ unlock(currentLevel+1); unlockMsg=`🎉 Level ${currentLevel+1} unlocked!`; }
      else unlockMsg=`Need ${score-need}s less to unlock next level.`;
    } else unlockMsg="🏁 Final level complete!";

    $("#results").innerHTML=
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
      c.style.backgroundColor=["#2F3C7E","#F9A602","#2ECC71","#E74C3C"][i%4];
      c.style.animationDelay=(Math.random()*1000)+"ms";
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),1600);
    }
  }

  document.addEventListener("DOMContentLoaded",()=>{
    unlock(1);
    renderLevels();
  });
})();
