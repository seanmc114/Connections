// CONNECTIONS – Synge Street CBS Edition
// FINAL VERSION: Turbo-Jump scoring + timed unlock system

document.addEventListener("DOMContentLoaded", () => {

  const $ = id => document.getElementById(id);
  const levelList = $("level-list");
  const mainMenu = $("main-menu");
  const game = $("game");
  const questionsDiv = $("questions");
  const resultsDiv = $("results");
  const timerDisplay = $("timer");
  const levelLabel = $("level-label");
  const submitBtn = $("submit");
  const backBtn = $("back-button");

  let currentLevel = 1;
  let startTime = 0;
  let timer = null;
  let quiz = [];

  /* ---------- STORAGE ---------- */
  const bestKey = l => `connections_best_${l}`;
  const unlockedKey = l => `connections_unlocked_${l}`;
  const getBest = l => parseInt(localStorage.getItem(bestKey(l))) || null;
  const saveBest = (l, s) => {
    const b = getBest(l);
    if (!b || s < b) localStorage.setItem(bestKey(l), s);
  };
  const isUnlocked = l => l === 1 || localStorage.getItem(unlockedKey(l)) === "true";
  const unlock = l => localStorage.setItem(unlockedKey(l), "true");

  /* ---------- THRESHOLDS ---------- */
  const unlockTimeForLevel = lvl => Math.max(180 - (lvl - 2) * 20, 20); // 180,160,140...

  /* ---------- NORMALIZATION ---------- */
  const normalize = s => (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¡!¿?.,;:"]/g, "")
    .trim();

  const equal = (a,b) => normalize(a) === normalize(b);

  /* ---------- QUESTIONS ---------- */
  const DATA = {
    1:[{en:"I like Spanish and music",es:"Me gusta el espanol y la musica"},
       {en:"I have a brother and a sister",es:"Tengo un hermano y una hermana"},
       {en:"I play football and basketball",es:"Juego al futbol y al baloncesto"},
       {en:"I eat apples and oranges",es:"Como manzanas y naranjas"},
       {en:"I drink water and juice",es:"Bebo agua y zumo"},
       {en:"I sing and dance",es:"Canto y bailo"},
       {en:"I walk and talk with friends",es:"Camino y hablo con amigos"},
       {en:"I listen and learn",es:"Escucho y aprendo"},
       {en:"I read and write every day",es:"Leo y escribo todos los dias"},
       {en:"I laugh and smile",es:"Rio y sonrio"}],
    2:[{en:"I like tea but not coffee",es:"Me gusta el te pero no el cafe"},
       {en:"I study but I am tired",es:"Estudio pero estoy cansado"},
       {en:"I eat fruit but I prefer chocolate",es:"Como fruta pero prefiero el chocolate"},
       {en:"I play football but not tennis",es:"Juego al futbol pero no al tenis"},
       {en:"I work but I dont earn much",es:"Trabajo pero no gano mucho"},
       {en:"I help but sometimes forget",es:"Ayudo pero a veces olvido"},
       {en:"I travel but rarely",es:"Viajo pero raramente"},
       {en:"I talk a lot but listen a little",es:"Hablo mucho pero escucho poco"},
       {en:"I study but Im bored",es:"Estudio pero estoy aburrido"},
       {en:"I run but Im slow",es:"Corro pero soy lento"}],
    // Levels 3–10 exactly as before…
  };

  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  /* ---------- MENU ---------- */
  function renderLevels() {
    levelList.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.textContent = `Level ${i}`;
      const best = getBest(i);
      if (best) {
        const span = document.createElement("span");
        span.className = "best";
        span.textContent = `Best: ${best}s`;
        btn.appendChild(span);
      }
      btn.disabled = !isUnlocked(i);
      btn.addEventListener("click", () => startLevel(i));
      levelList.appendChild(btn);
    }
  }

  /* ---------- START LEVEL ---------- */
  function startLevel(lvl) {
    currentLevel = lvl;
    mainMenu.style.display = "none";
    game.style.display = "block";
    resultsDiv.innerHTML = "";
    levelLabel.textContent = `Level ${lvl}`;
    quiz = shuffle([...DATA[lvl]]);
    renderQuestions();
    startTimer();
  }

  /* ---------- RENDER QUESTIONS ---------- */
  function renderQuestions() {
    questionsDiv.innerHTML = "";
    quiz.forEach((q, i) => {
      const div = document.createElement("div");
      div.className = "q";
      div.innerHTML = `<div class="prompt">${i + 1}. ${q.en}</div>`;
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type in Spanish...";
      q.user = "";
      input.addEventListener("input", e => q.user = e.target.value);
      div.appendChild(input);
      questionsDiv.appendChild(div);
    });
  }

  /* ---------- TIMER ---------- */
  function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
      const t = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = `Time: ${t}s`;
    }, 300);
  }
  function stopTimer() {
    clearInterval(timer);
    return Math.floor((Date.now() - startTime) / 1000);
  }

  /* ---------- SCORING ---------- */
  submitBtn.addEventListener("click", () => {
    const time = stopTimer();
    let wrong = 0, correct = 0;

    document.querySelectorAll("#questions input").forEach((inp, i) => {
      const q = quiz[i];
      const fb = document.createElement("div");
      fb.className = "feedback";

      if (equal(q.user, q.es)) {
        inp.classList.add("good");
        fb.style.color = "#2ecc71";
        fb.textContent = "✅ Correct!";
        correct++;
      } else {
        inp.classList.add("bad");
        fb.style.color = "#e74c3c";
        fb.innerHTML = `❌ Incorrect.<br><em>Correct answer:</em> ${q.es}`;
        wrong++;
      }
      inp.disabled = true;
      inp.parentElement.appendChild(fb);
    });

    const penalty = wrong * 30;
    const finalScore = time + penalty;

    // Save best and unlock logic
    saveBest(currentLevel, finalScore);
    const next = currentLevel + 1;
    if (next <= 10 && finalScore <= unlockTimeForLevel(next)) {
      unlock(next);
    }

    resultsDiv.innerHTML = `
      <p>
        <strong>Time:</strong> ${time}s<br>
        <strong>Incorrect:</strong> ${wrong} × 30s = ${penalty}s penalty<br>
        <strong>Final Score:</strong> ${finalScore}s<br>
        Correct: ${correct}/${quiz.length}<br>
        ${next <= 10 ? `<em>Next level unlocks if under ${unlockTimeForLevel(next)}s</em>` : ""}
      </p>`;
  });

  /* ---------- BACK ---------- */
  backBtn.addEventListener("click", () => {
    game.style.display = "none";
    mainMenu.style.display = "block";
    clearInterval(timer);
    renderLevels();
  });

  unlock(1);
  renderLevels();
});
