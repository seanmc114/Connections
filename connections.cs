// Connections Game — Synge Street CBS Edition
// Simple single-player version (buttons now guaranteed to appear)

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

  // ===== Game Data (shortened for clarity — you can add more later) =====
  const DATA = {
    1: [
      { en: "I like Spanish and music", es: "Me gusta el español y la música" },
      { en: "I have a brother and a sister", es: "Tengo un hermano y una hermana" },
      { en: "I study and work", es: "Estudio y trabajo" }
    ],
    2: [
      { en: "I like tea but not coffee", es: "Me gusta el té pero no el café" },
      { en: "I study but I am tired", es: "Estudio pero estoy cansado" }
    ]
    // …you can add more levels the same way
  };

  // ===== Game State =====
  let currentLevel = 1;
  let startTime = 0;
  let timer = null;
  let quiz = [];

  // ===== Local Storage Helpers =====
  const bestKey = l => `connections_best_${l}`;
  const unlockedKey = l => `connections_unlocked_${l}`;
  const getBest = l => parseInt(localStorage.getItem(bestKey(l))) || null;
  const saveBest = (l, s) => {
    const b = getBest(l);
    if (!b || s < b) localStorage.setItem(bestKey(l), s);
  };
  const isUnlocked = l => l === 1 || localStorage.getItem(unlockedKey(l)) === "true";
  const unlock = l => localStorage.setItem(unlockedKey(l), "true");

  // ===== Build Level Buttons =====
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

  // ===== Start a Level =====
  function startLevel(level) {
    currentLevel = level;
    mainMenu.style.display = "none";
    game.style.display = "block";
    resultsDiv.innerHTML = "";
    levelLabel.textContent = `Level ${level}`;
    quiz = [...DATA[level]];
    renderQuestions();
    startTimer();
  }

  // ===== Render Questions =====
  function renderQuestions() {
    questionsDiv.innerHTML = "";
    quiz.forEach((q, i) => {
      const wrap = document.createElement("div");
      wrap.className = "q";
      wrap.innerHTML = `<div class="prompt">${i + 1}. ${q.en}</div>`;
      const inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Type in Spanish...";
      q.user = "";
      inp.addEventListener("input", e => q.user = e.target.value);
      wrap.appendChild(inp);
      questionsDiv.appendChild(wrap);
    });
  }

  // ===== Timer =====
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

  // ===== Submit =====
  submitBtn.addEventListener("click", () => {
    const time = stopTimer();
    let correct = 0;
    document.querySelectorAll("#questions input").forEach((input, i) => {
      const q = quiz[i];
      const fb = document.createElement("div");
      fb.className = "feedback";
      if (q.user.trim().toLowerCase() === q.es.trim().toLowerCase()) {
        input.classList.add("good");
        fb.innerHTML = `<span class="right">✅ Correct!</span>`;
        correct++;
      } else {
        input.classList.add("bad");
        fb.innerHTML = `<span class="wrong">❌ Incorrect.</span><br><em>Correct answer:</em> ${q.es}`;
      }
      input.parentElement.appendChild(fb);
      input.disabled = true;
    });
    const score = time;
    saveBest(currentLevel, score);

    if (currentLevel < 10) unlock(currentLevel + 1);

    resultsDiv.innerHTML = `<p><strong>Score:</strong> ${score}s<br>Correct: ${correct}/${quiz.length}</p>`;
  });

  // ===== Back Button =====
  backBtn.addEventListener("click", () => {
    game.style.display = "none";
    mainMenu.style.display = "block";
    clearInterval(timer);
    renderLevels();
  });

  // ===== Initialize =====
  unlock(1);
  renderLevels();
});
connections.js
