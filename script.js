// TURBO · LC Spanish · Connectors (EN → ES)
// Present only. Same core logic as your Turbo scoring/feedback:
// - 10 questions per round
// - +30 seconds per wrong/blank
// - Unlock thresholds 200 → 40
// - Best score saved per level
// - Try Again
// - Perfect round celebration
// - TTS buttons + limited Spanish reads per attempt (cap 7), commit-on-finish (+1 token on perfect)

(() => {
  const $  = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // ===================== CONFIG =====================
  const QUESTIONS_PER_ROUND = 10;
  const PENALTY_PER_WRONG   = 30;

  // Score needed (previous level) to unlock next:
  // If Level 1 best ≤ 200 → unlock L2; L2 best ≤ 180 → unlock L3; ... ; L9 best ≤ 40 → unlock L10
  const BASE_THRESH = { 1:200, 2:180, 3:160, 4:140, 5:120, 6:100, 7:80, 8:60, 9:40 };

  // Limited Spanish reads
  const GLOBAL_READS_MAX = 7;
  const GLOBAL_READS_KEY = "turboConnectors:globalReads";

  // ===================== DATASET (Levels 1–10) =====================
  // Each entry: { en: "meaning", answers: ["acceptable", "alternatives"] }
  const CONNECTORS = {
    1: [
      { en: "and", answers: ["y", "e"] },
      { en: "or", answers: ["o", "u"] },
      { en: "but", answers: ["pero"] },
      { en: "because", answers: ["porque"] },
      { en: "also", answers: ["también"] },
      { en: "so / therefore (simple)", answers: ["así que"] },
      { en: "if", answers: ["si"] },
      { en: "then", answers: ["entonces"] },
      { en: "when", answers: ["cuando"] },
      { en: "before", answers: ["antes"] },
      { en: "after", answers: ["después"] },
      { en: "always", answers: ["siempre"] },
      { en: "never", answers: ["nunca"] },
      { en: "sometimes", answers: ["a veces"] },
      { en: "usually", answers: ["normalmente"] }
    ],
    2: [
      { en: "first(ly)", answers: ["primero", "en primer lugar"] },
      { en: "then / next", answers: ["luego", "después", "a continuación"] },
      { en: "finally", answers: ["finalmente", "por último"] },
      { en: "at the same time", answers: ["al mismo tiempo"] },
      { en: "while", answers: ["mientras"] },
      { en: "until", answers: ["hasta que", "hasta"] },
      { en: "since (time)", answers: ["desde"] },
      { en: "later", answers: ["más tarde"] },
      { en: "nowadays", answers: ["hoy en día"] },
      { en: "in the end", answers: ["al final"] },
      { en: "for example", answers: ["por ejemplo"] },
      { en: "also (adding)", answers: ["además"] },
      { en: "in general", answers: ["en general"] },
      { en: "on Monday / every Monday", answers: ["los lunes", "cada lunes"] },
      { en: "every day", answers: ["cada día"] }
    ],
    3: [
      { en: "because of", answers: ["a causa de", "por"] },
      { en: "thanks to", answers: ["gracias a"] },
      { en: "therefore", answers: ["por lo tanto", "por tanto"] },
      { en: "that's why", answers: ["por eso"] },
      { en: "as a result", answers: ["como resultado"] },
      { en: "so that", answers: ["para que"] },
      { en: "in order to", answers: ["para", "con el fin de"] },
      { en: "since (because)", answers: ["ya que", "puesto que"] },
      { en: "due to", answers: ["debido a"] },
      { en: "for this reason", answers: ["por esta razón"] },
      { en: "that is to say", answers: ["es decir"] },
      { en: "in other words", answers: ["en otras palabras"] },
      { en: "in fact", answers: ["de hecho"] },
      { en: "clearly", answers: ["claramente"] },
      { en: "of course", answers: ["por supuesto"] }
    ],
    4: [
      { en: "however", answers: ["sin embargo"] },
      { en: "nevertheless", answers: ["no obstante"] },
      { en: "on the other hand", answers: ["por otro lado"] },
      { en: "whereas", answers: ["mientras que"] },
      { en: "instead", answers: ["en cambio"] },
      { en: "instead of", answers: ["en vez de", "en lugar de"] },
      { en: "although", answers: ["aunque"] },
      { en: "despite", answers: ["a pesar de"] },
      { en: "even so", answers: ["aun así", "aún así"] },
      { en: "rather", answers: ["más bien"] },
      { en: "at least", answers: ["al menos", "por lo menos"] },
      { en: "but rather (not X, but Y)", answers: ["sino"] },
      { en: "in contrast", answers: ["por el contrario", "en cambio"] },
      { en: "still / all the same", answers: ["de todos modos"] },
      { en: "in spite of that", answers: ["a pesar de eso", "a pesar de ello"] }
    ],
    5: [
      { en: "moreover", answers: ["además"] },
      { en: "furthermore", answers: ["además", "asimismo"] },
      { en: "in addition", answers: ["además"] },
      { en: "also (formal)", answers: ["asimismo"] },
      { en: "above all", answers: ["sobre todo"] },
      { en: "especially", answers: ["especialmente"] },
      { en: "for instance", answers: ["por ejemplo"] },
      { en: "in particular", answers: ["en particular"] },
      { en: "to sum up", answers: ["en resumen", "en conclusión"] },
      { en: "in conclusion", answers: ["en conclusión"] },
      { en: "on the one hand", answers: ["por un lado"] },
      { en: "on the other hand", answers: ["por otro lado"] },
      { en: "as for / regarding", answers: ["en cuanto a", "con respecto a"] },
      { en: "according to", answers: ["según"] },
      { en: "in my opinion", answers: ["en mi opinión"] }
    ],
    6: [
      { en: "provided that", answers: ["siempre que"] },
      { en: "as long as", answers: ["siempre que", "mientras"] },
      { en: "unless", answers: ["a menos que"] },
      { en: "in case", answers: ["en caso de que"] },
      { en: "otherwise", answers: ["si no"] },
      { en: "even if", answers: ["incluso si", "aunque"] },
      { en: "as soon as", answers: ["tan pronto como", "en cuanto"] },
      { en: "in that case", answers: ["en ese caso"] },
      { en: "in any case", answers: ["en cualquier caso", "de todos modos"] },
      { en: "whether", answers: ["si", "ya sea"] },
      { en: "either…or…", answers: ["o…o…", "ya sea…o…"] },
      { en: "as a rule", answers: ["por regla general"] },
      { en: "generally speaking", answers: ["en general"] },
      { en: "as long as (duration)", answers: ["durante el tiempo que"] },
      { en: "if not", answers: ["si no"] }
    ],
    7: [
      { en: "from my point of view", answers: ["desde mi punto de vista"] },
      { en: "as far as I’m concerned", answers: ["en cuanto a mí"] },
      { en: "in relation to", answers: ["en relación con"] },
      { en: "with regard to", answers: ["con respecto a", "en lo que respecta a"] },
      { en: "as for", answers: ["en cuanto a"] },
      { en: "to a certain extent", answers: ["hasta cierto punto"] },
      { en: "in the same way", answers: ["de la misma manera"] },
      { en: "likewise", answers: ["igualmente", "del mismo modo"] },
      { en: "on the contrary", answers: ["al contrario"] },
      { en: "as a matter of fact", answers: ["de hecho"] },
      { en: "in the meantime", answers: ["mientras tanto"] },
      { en: "thereby / in this way", answers: ["de este modo", "así"] },
      { en: "consequently", answers: ["por consiguiente"] },
      { en: "hence", answers: ["de ahí que"] },
      { en: "insofar as", answers: ["en la medida en que"] }
    ],
    8: [
      { en: "despite the fact that", answers: ["a pesar de que"] },
      { en: "even though (formal)", answers: ["si bien", "aunque"] },
      { en: "nevertheless (formal)", answers: ["no obstante"] },
      { en: "however (formal)", answers: ["sin embargo"] },
      { en: "all the same", answers: ["de todos modos"] },
      { en: "anyway", answers: ["de todos modos"] },
      { en: "after all", answers: ["al fin y al cabo"] },
      { en: "indeed", answers: ["en efecto"] },
      { en: "in any event", answers: ["en cualquier caso", "en todo caso"] },
      { en: "no matter what", answers: ["pase lo que pase"] },
      { en: "no matter how", answers: ["por muy", "por muy que"] },
      { en: "in view of", answers: ["en vista de"] },
      { en: "in the light of", answers: ["a la luz de"] },
      { en: "once (as soon as)", answers: ["una vez que"] },
      { en: "whenever", answers: ["cada vez que", "siempre que"] }
    ],
    9: [
      { en: "to begin with", answers: ["para empezar"] },
      { en: "in the first place", answers: ["en primer lugar"] },
      { en: "in the second place", answers: ["en segundo lugar"] },
      { en: "lastly", answers: ["por último", "finalmente"] },
      { en: "not only… but also…", answers: ["no solo… sino también…"] },
      { en: "to the extent that", answers: ["hasta el punto de que"] },
      { en: "so much so that", answers: ["tanto que"] },
      { en: "with the aim of", answers: ["con el objetivo de", "con el fin de"] },
      { en: "in any case (formal)", answers: ["en todo caso"] },
      { en: "either way", answers: ["de una forma u otra"] },
      { en: "as a consequence", answers: ["en consecuencia"] },
      { en: "therefore (high register)", answers: ["por ende"] },
      { en: "thus", answers: ["así", "de este modo"] },
      { en: "for that matter", answers: ["por cierto"] },
      { en: "in other words (formal)", answers: ["dicho de otro modo"] }
    ],
    10: [
      { en: "be that as it may", answers: ["sea como sea"] },
      { en: "nonetheless", answers: ["con todo", "aun así", "aún así"] },
      { en: "notwithstanding", answers: ["no obstante"] },
      { en: "on the grounds that", answers: ["con el argumento de que"] },
      { en: "for fear that", answers: ["por miedo a que", "por temor a que"] },
      { en: "so as not to", answers: ["para no"] },
      { en: "it follows that", answers: ["se deduce que"] },
      { en: "insofar as (formal)", answers: ["en la medida en que"] },
      { en: "inasmuch as", answers: ["en tanto que"] },
      { en: "given that", answers: ["dado que"] },
      { en: "seeing that", answers: ["visto que"] },
      { en: "considering that", answers: ["teniendo en cuenta que"] },
      { en: "in accordance with", answers: ["de acuerdo con", "conforme a"] },
      { en: "in the event that", answers: ["en el supuesto de que"] },
      { en: "in any event (very formal)", answers: ["en cualquier caso", "en todo caso"] }
    ]
  };

  // ===================== Normalisation =====================
  // Accents REQUIRED: we do NOT strip accents.
  // Capital letters ignored.
  // Treat ñ as n.
  // Trim punctuation/spaces at ends and collapse internal spaces.
  function norm(s){
    let t = (s || "").trim().toLowerCase();
    t = t.replace(/ñ/g, "n");
    t = t.replace(/\s+/g, " ");
    t = t.replace(/^[¿¡"“”'().,;:]+|[¿¡"“”'().,;:]+$/g, "");
    return t;
  }

  function isCorrect(user, answers){
    const u = norm(user);
    if (!u) return false;
    return answers.some(a => norm(a) === u);
  }

  // ===================== Speech =====================
  function speak(text, lang){
    try{
      if(!("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }catch{}
  }

  // ===================== Global Spanish reads =====================
  const clampReads = n => Math.max(0, Math.min(GLOBAL_READS_MAX, n|0));
  function getGlobalReads(){
    const v = localStorage.getItem(GLOBAL_READS_KEY);
    if (v == null){
      localStorage.setItem(GLOBAL_READS_KEY, String(GLOBAL_READS_MAX));
      return GLOBAL_READS_MAX;
    }
    const n = parseInt(v,10);
    return Number.isFinite(n) ? clampReads(n) : GLOBAL_READS_MAX;
  }
  function setGlobalReads(n){
    localStorage.setItem(GLOBAL_READS_KEY, String(clampReads(n)));
    updateReadsPills();
  }

  function updateReadsPills(){
    const now = getGlobalReads();
    const pill = $("#reads-pill");
    if (pill) pill.textContent = `${now}/${GLOBAL_READS_MAX}`;
  }

  // ===================== Best/unlocks =====================
  const STORAGE_PREFIX = "turboConnectors:v1";
  const bestKey = lvl => `${STORAGE_PREFIX}:best:${lvl}`;

  function getBest(lvl){
    const v = localStorage.getItem(bestKey(lvl));
    const n = v == null ? null : parseInt(v,10);
    return Number.isFinite(n) ? n : null;
  }
  function saveBest(lvl, score){
    const prev = getBest(lvl);
    if (prev == null || score < prev) localStorage.setItem(bestKey(lvl), String(score));
  }
  function isUnlocked(lvl){
    if (lvl === 1) return true;
    const need = BASE_THRESH[lvl - 1];
    const prev = getBest(lvl - 1);
    return prev != null && (need == null || prev <= need);
  }

  // ===================== Helpers =====================
  function shuffle(a){
    a = a.slice();
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ===================== Celebration =====================
  function showPerfectCelebration(){
    const overlay = document.createElement("div");
    overlay.className = "tq-celebrate-overlay";
    document.body.appendChild(overlay);

    const banner = document.createElement("div");
    banner.className = "tq-perfect-banner";
    banner.textContent = "PERFECT!";
    document.body.appendChild(banner);

    const COLORS = ["#3b82f6","#22c55e","#a855f7","#f59e0b","#ef4444","#06b6d4","#84cc16"];
    const W = window.innerWidth;

    for (let i=0; i<120; i++){
      const c = document.createElement("div");
      c.className = "tq-confetti";
      const size = 6 + Math.random()*8;
      c.style.width  = `${size}px`;
      c.style.height = `${size*1.4}px`;
      c.style.left   = `${Math.random()*W}px`;
      c.style.top    = `${-20 - Math.random()*120}px`;
      c.style.background = COLORS[i % COLORS.length];
      c.style.animationDelay = `${Math.random()*200}ms`;
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      overlay.appendChild(c);
    }

    setTimeout(()=>{ overlay.remove(); banner.remove(); }, 2200);
  }

  // ===================== UI State =====================
  let currentLevel = null;
  let quiz = []; // [{prompt, answers[], user}]
  let t0 = 0;
  let timerId = null;
  let submitted = false;

  // Attempt-local Spanish reads (commit on finish)
  let readsUsedThisRound = 0;
  let globalSnapshotAtStart = 0;
  const attemptReadsLeft = () => Math.max(0, globalSnapshotAtStart - readsUsedThisRound);

  // ===================== Render levels =====================
  function renderLevels(){
    const host = $("#level-list");
    host.innerHTML = "";

    for (let lvl=1; lvl<=10; lvl++){
      const unlocked = isUnlocked(lvl);
      const best = getBest(lvl);

      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.disabled = !unlocked;

      const title = unlocked ? `Level ${lvl}` : `🔒 Level ${lvl}`;
      const desc  = levelDesc(lvl);
      const bestTxt = best == null ? "Best: —" : `Best: ${best}s`;

      btn.innerHTML = `
        <div class="level-top">
          <div class="level-title">${title}</div>
          <div class="best">${bestTxt}</div>
        </div>
        <div class="level-desc">${desc}</div>
      `;

      if (unlocked){
        btn.addEventListener("click", () => startLevel(lvl));
      }
      host.appendChild(btn);
    }

    $("#level-screen").style.display = "block";
    $("#game").style.display = "none";
  }

  function levelDesc(lvl){
    const map = {
      1: "Core basics (y/o/pero/porque…).",
      2: "Time & sequencing (primero, luego…).",
      3: "Cause & result (por eso, por lo tanto…).",
      4: "Contrast (sin embargo, a pesar de…).",
      5: "Adding & structuring (además, en conclusión…).",
      6: "Conditions (a menos que, siempre que…).",
      7: "Opinion & register (según, desde mi punto de vista…).",
      8: "Concession & emphasis (al fin y al cabo, pase lo que pase…).",
      9: "Advanced linking (hasta el punto de que, no solo… sino también…).",
      10:"Very formal nuance (en el supuesto de que, se deduce que…)."
    };
    return map[lvl] || "Connectors";
  }

  // ===================== Game =====================
  function startTimer(){
    t0 = Date.now();
    clearInterval(timerId);
    timerId = setInterval(() => {
      const t = Math.floor((Date.now() - t0) / 1000);
      $("#timer").textContent = `Time: ${t}s`;
    }, 200);
  }

  function stopTimer(){
    clearInterval(timerId);
    timerId = null;
    return Math.floor((Date.now() - t0) / 1000);
  }

  function startLevel(lvl){
    currentLevel = lvl;
    submitted = false;

    // attempt-local reads snapshot
    readsUsedThisRound = 0;
    globalSnapshotAtStart = getGlobalReads();
    $("#reads-left").textContent = String(attemptReadsLeft());

    // build quiz
    const pool = CONNECTORS[lvl] || [];
    const sample = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
    quiz = sample.map(it => ({ prompt: it.en, answers: it.answers.slice(), user: "" }));

    $("#game-title").textContent = `Level ${lvl}`;
    $("#results").innerHTML = "";

    $("#level-screen").style.display = "none";
    $("#game").style.display = "block";

    renderQuiz();
    startTimer();
  }

  function updateSpanishButtonsState(container){
    const left = attemptReadsLeft();
    $("#reads-left").textContent = String(left);

    const esBtns = Array.from(container.querySelectorAll('button[data-role="es-tts"]'));
    esBtns.forEach(btn => {
      btn.disabled = left <= 0;
      btn.title = left > 0
        ? `Read Spanish target (uses 1; left: ${left})`
        : "No Spanish reads left for this attempt";
    });
  }

  function renderQuiz(){
    const qwrap = $("#questions");
    qwrap.innerHTML = "";

    quiz.forEach((q, i) => {
      const row = document.createElement("div");
      row.className = "q";

      const prompt = document.createElement("div");
      prompt.className = "prompt";
      prompt.innerHTML = `<span>${i+1}. ${q.prompt} <small>(type the Spanish)</small></span>`;

      const tools = document.createElement("div");
      tools.className = "tools";

      const enBtn = document.createElement("button");
      enBtn.type = "button";
      enBtn.className = "toolbtn";
      enBtn.textContent = "🔈 EN";
      enBtn.title = "Read English prompt";
      enBtn.addEventListener("click", () => speak(q.prompt, "en-GB"));

      const esBtn = document.createElement("button");
      esBtn.type = "button";
      esBtn.className = "toolbtn";
      esBtn.textContent = "🔊 ES";
      esBtn.title = "Read Spanish target (uses 1)";
      esBtn.dataset.role = "es-tts";
      esBtn.addEventListener("click", () => {
        if (attemptReadsLeft() <= 0) { updateSpanishButtonsState(qwrap); return; }
        // Speak the FIRST accepted answer for clarity
        speak(q.answers[0], "es-ES");
        readsUsedThisRound += 1;
        updateSpanishButtonsState(qwrap);
      });

      tools.appendChild(enBtn);
      tools.appendChild(esBtn);

      prompt.appendChild(tools);

      const ans = document.createElement("div");
      ans.className = "answer";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type the Spanish connector…";
      input.addEventListener("input", (e) => { quiz[i].user = e.target.value; });

      ans.appendChild(input);

      row.appendChild(prompt);
      row.appendChild(ans);
      qwrap.appendChild(row);
    });

    updateSpanishButtonsState(qwrap);

    const submit = $("#submit");
    submit.disabled = false;
    submit.textContent = "Finish & Check";
    submit.onclick = finishAndCheck;

    const back = $("#back-button");
    back.onclick = backToLevels;
  }

  // ===================== Results / feedback =====================
  function finishAndCheck(){
    if (submitted) return;
    submitted = true;

    const elapsed = stopTimer();

    // collect inputs
    const inputs = $$("#questions input");
    inputs.forEach((inp, i) => { quiz[i].user = inp.value; });

    let correct = 0;
    let wrong = 0;

    quiz.forEach((q, i) => {
      const ok = isCorrect(q.user, q.answers);
      if (ok) correct++;
      else wrong++;

      inputs[i].classList.remove("good","bad");
      inputs[i].classList.add(ok ? "good" : "bad");
      inputs[i].readOnly = true;
      inputs[i].disabled = true;
    });

    const penalties = wrong * PENALTY_PER_WRONG;
    const finalScore = elapsed + penalties;

    $("#submit").disabled = true;
    $("#submit").textContent = "Checked";

    // Unlock message
    let unlockMsg = "";
    if (currentLevel < 10){
      const need = BASE_THRESH[currentLevel];
      if (typeof need === "number"){
        unlockMsg = (finalScore <= need)
          ? `🎉 Next level unlocked! (Needed ≤ ${need}s)`
          : `🔓 Need ${finalScore - need}s less to unlock Level ${currentLevel + 1} (Target ≤ ${need}s).`;
      }
    } else {
      unlockMsg = "🏁 Final level — brilliant work.";
    }

    // Commit Spanish reads now
    const before = getGlobalReads();
    let after = clampReads(globalSnapshotAtStart - readsUsedThisRound);
    const perfect = (correct === quiz.length);
    if (perfect && after < GLOBAL_READS_MAX) after = clampReads(after + 1);
    setGlobalReads(after);

    // Save best + rerender levels later
    saveBest(currentLevel, finalScore);

    // Build results UI
    const results = $("#results");
    results.innerHTML = "";

    const summary = document.createElement("div");
    summary.className = "result-summary";
    summary.innerHTML = `
      <div class="line" style="font-size:1.35rem; font-weight:900; color: var(--text);">🏁 FINAL SCORE: ${finalScore}s</div>
      <div class="line">⏱️ Time: <strong>${elapsed}s</strong></div>
      <div class="line">➕ Penalties: <strong>${wrong} × ${PENALTY_PER_WRONG}s = ${penalties}s</strong></div>
      <div class="line">✅ Correct: <strong>${correct}/${quiz.length}</strong></div>
      <div class="line" style="margin-top:8px;"><strong>${unlockMsg}</strong></div>
      <div class="line" style="margin-top:8px;">🔊 Spanish reads used this attempt: <strong>${readsUsedThisRound}</strong> · Global after commit: <strong>${after}/${GLOBAL_READS_MAX}</strong></div>
    `;

    if (perfect){
      showPerfectCelebration();
      summary.classList.add("tq-shake");
    }

    const ul = document.createElement("ul");
    quiz.forEach(q => {
      const ok = isCorrect(q.user, q.answers);
      const li = document.createElement("li");
      li.className = ok ? "correct" : "incorrect";

      const accepted = q.answers.join(" / ");
      li.innerHTML = `
        <div><strong>${q.prompt}</strong></div>
        <div>✅ Answer: <strong>${accepted}</strong></div>
        ${ok ? `<div>🎯 You: <strong>${q.user}</strong></div>`
             : `<div>❌ You: <strong>${q.user || "(blank)"}</strong></div>`}
      `;
      ul.appendChild(li);
    });

    const again = document.createElement("button");
    again.className = "btn primary try-again";
    again.textContent = "Try Again";
    again.onclick = () => startLevel(currentLevel);

    results.appendChild(summary);
    results.appendChild(ul);
    results.appendChild(again);

    // Scroll results into view
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function backToLevels(){
    try{ stopTimer(); }catch{}
    renderLevels();
  }

  // ===================== Init =====================
  document.addEventListener("DOMContentLoaded", () => {
    // initialise global reads
    setGlobalReads(getGlobalReads());
    updateReadsPills();
    renderLevels();
  });

})();
