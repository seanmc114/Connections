// TURBO · LC Spanish · Connectors (EN → ES)
// Modes: Classic, Sudden Death, Speed Challenge (60s), Team Relay
// Fair play across devices: SAME Match Code => same 10 prompts.
// Each attempt produces a Result Code; Compare declares winner.
//
// Turbo mechanics preserved:
// - 10 questions
// - +30s per wrong/blank
// - unlock thresholds 200→40
// - best saved per (mode, level)
// - global ES reads tokens cap 7 (commit-on-finish), +1 token on perfect
// - confetti/banner on perfect

(() => {
  const $  = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const QUESTIONS_PER_ROUND = 10;
  const PENALTY_PER_WRONG   = 30;
  const SPEED_CAP_SECONDS   = 60;

  const BASE_THRESH = { 1:200, 2:180, 3:160, 4:140, 5:120, 6:100, 7:80, 8:60, 9:40 };

  const GLOBAL_READS_MAX = 7;
  const GLOBAL_READS_KEY = "turboConnectors:globalReads:vFINAL";

  const STORAGE_PREFIX = "turboConnectors:vFINAL";
  const bestKey = (mode, lvl) => `${STORAGE_PREFIX}:best:${mode}:${lvl}`;

  const RESULT_SALT = "TURBO_CONNECTORS_FINAL_SALT_2026";

  const MODE_LABELS = {
    classic: "Classic",
    suddendeath: "Sudden Death",
    speed: "Speed Challenge (60s)",
    team: "Team Relay"
  };

  // ===================== DATASET (Levels 1–10) =====================
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
      { en: "until", answers: ["hasta", "hasta que"] },
      { en: "since (time)", answers: ["desde"] },
      { en: "later", answers: ["más tarde"] },
      { en: "nowadays", answers: ["hoy en día"] },
      { en: "in the end", answers: ["al final"] },
      { en: "for example", answers: ["por ejemplo"] },
      { en: "also (adding)", answers: ["además"] },
      { en: "in general", answers: ["en general"] },
      { en: "as soon as", answers: ["en cuanto", "tan pronto como"] },
      { en: "in the meantime", answers: ["mientras tanto"] }
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
      { en: "all the same", answers: ["de todos modos"] },
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
      { en: "in that case", answers: ["en ese caso"] },
      { en: "in any case", answers: ["en cualquier caso", "de todos modos"] },
      { en: "whether", answers: ["si", "ya sea"] },
      { en: "either…or…", answers: ["o…o…", "ya sea…o…"] },
      { en: "as a rule", answers: ["por regla general"] },
      { en: "generally speaking", answers: ["en general"] },
      { en: "to the extent that", answers: ["hasta cierto punto", "hasta el punto de que"] },
      { en: "given that", answers: ["dado que"] },
      { en: "as soon as", answers: ["en cuanto", "tan pronto como"] }
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
      { en: "thereby / in this way", answers: ["de este modo", "así"] },
      { en: "consequently", answers: ["por consiguiente"] },
      { en: "hence", answers: ["de ahí que"] },
      { en: "insofar as", answers: ["en la medida en que"] },
      { en: "to begin with", answers: ["para empezar"] }
    ],
    8: [
      { en: "despite the fact that", answers: ["a pesar de que"] },
      { en: "even though (formal)", answers: ["si bien", "aunque"] },
      { en: "all the same", answers: ["de todos modos"] },
      { en: "anyway", answers: ["de todos modos"] },
      { en: "after all", answers: ["al fin y al cabo"] },
      { en: "indeed", answers: ["en efecto"] },
      { en: "in any event", answers: ["en cualquier caso", "en todo caso"] },
      { en: "no matter what", answers: ["pase lo que pase"] },
      { en: "in view of", answers: ["en vista de"] },
      { en: "in the light of", answers: ["a la luz de"] },
      { en: "once (as soon as)", answers: ["una vez que"] },
      { en: "whenever", answers: ["cada vez que", "siempre que"] },
      { en: "nevertheless (formal)", answers: ["no obstante"] },
      { en: "however (formal)", answers: ["sin embargo"] },
      { en: "be that as it may", answers: ["sea como sea"] }
    ],
    9: [
      { en: "in the first place", answers: ["en primer lugar"] },
      { en: "in the second place", answers: ["en segundo lugar"] },
      { en: "lastly", answers: ["por último", "finalmente"] },
      { en: "not only… but also…", answers: ["no solo… sino también…"] },
      { en: "to the extent that", answers: ["hasta el punto de que"] },
      { en: "so much so that", answers: ["tanto que"] },
      { en: "with the aim of", answers: ["con el objetivo de", "con el fin de"] },
      { en: "either way", answers: ["de una forma u otra"] },
      { en: "as a consequence", answers: ["en consecuencia"] },
      { en: "therefore (high register)", answers: ["por ende"] },
      { en: "thus", answers: ["así", "de este modo"] },
      { en: "for that matter", answers: ["por cierto"] },
      { en: "in other words (formal)", answers: ["dicho de otro modo"] },
      { en: "seeing that", answers: ["visto que"] },
      { en: "considering that", answers: ["teniendo en cuenta que"] }
    ],
    10: [
      { en: "notwithstanding", answers: ["no obstante"] },
      { en: "on the grounds that", answers: ["con el argumento de que"] },
      { en: "for fear that", answers: ["por miedo a que", "por temor a que"] },
      { en: "so as not to", answers: ["para no"] },
      { en: "it follows that", answers: ["se deduce que"] },
      { en: "inasmuch as", answers: ["en tanto que"] },
      { en: "in accordance with", answers: ["de acuerdo con", "conforme a"] },
      { en: "in the event that", answers: ["en el supuesto de que"] },
      { en: "in any event (very formal)", answers: ["en cualquier caso", "en todo caso"] },
      { en: "given that", answers: ["dado que"] },
      { en: "seeing that", answers: ["visto que"] },
      { en: "to the extent that (formal)", answers: ["en la medida en que"] },
      { en: "nonetheless", answers: ["con todo", "aun así", "aún así"] },
      { en: "therefore (formal)", answers: ["por consiguiente"] },
      { en: "with regard to (formal)", answers: ["en lo que respecta a"] }
    ]
  };

  // ===================== Normalisation =====================
  // Accents REQUIRED; capitals ignored; ñ counts as n.
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

  // ===================== TTS =====================
  function speak(text, lang){
    try{
      if(!("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }catch{}
  }

  // ===================== Global reads tokens =====================
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
    updateReadsPill();
  }
  function updateReadsPill(){
    const now = getGlobalReads();
    const pill = $("#reads-pill");
    if (pill) pill.textContent = `${now}/${GLOBAL_READS_MAX}`;
  }

  // ===================== Best / unlocks =====================
  function getBest(mode, lvl){
    const v = localStorage.getItem(bestKey(mode,lvl));
    const n = v == null ? null : parseInt(v,10);
    return Number.isFinite(n) ? n : null;
  }
  function saveBest(mode, lvl, score){
    const prev = getBest(mode,lvl);
    if (prev == null || score < prev) localStorage.setItem(bestKey(mode,lvl), String(score));
  }
  function isUnlocked(mode, lvl){
    if (lvl === 1) return true;
    const need = BASE_THRESH[lvl - 1];
    const prev = getBest(mode, lvl - 1);
    return prev != null && (need == null || prev <= need);
  }

  // ===================== Seeded same-10 selection =====================
  function xmur3(str){
    let h = 1779033703 ^ str.length;
    for (let i=0; i<str.length; i++){
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function(){
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, seedInt){
    const r = mulberry32(seedInt);
    const a = arr.slice();
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(r() * (i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function makeMatchCode(){
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)];
    return out;
  }

  // ===================== Result Code encode/decode =====================
  function base64urlEncode(str){
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  }
  function base64urlDecode(str){
    const pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
    const s = (str + pad).replace(/-/g,"+").replace(/_/g,"/");
    return decodeURIComponent(escape(atob(s)));
  }
  function simpleHash(str){
    let h = 2166136261;
    for (let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8,"0");
  }
  function makeResultCode(payloadObj){
    const payloadJson = JSON.stringify(payloadObj);
    const sig = simpleHash(payloadJson + "|" + RESULT_SALT);
    return `${base64urlEncode(payloadJson)}.${sig}`;
  }
  function parseResultCode(code){
    try{
      const parts = (code || "").trim().split(".");
      if (parts.length !== 2) return { ok:false, error:"Invalid format." };
      const json = base64urlDecode(parts[0]);
      const sig = parts[1];
      const expected = simpleHash(json + "|" + RESULT_SALT);
      if (sig !== expected) return { ok:false, error:"Signature mismatch (code edited or corrupted)." };
      const obj = JSON.parse(json);
      return { ok:true, data: obj };
    }catch{
      return { ok:false, error:"Could not parse code." };
    }
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

  // ===================== State =====================
  let currentLevel = null;
  let currentMode = "classic";
  let currentMatchCode = "";
  let teamSize = 4;

  let quiz = [];
  let t0 = 0;
  let timerId = null;
  let submitted = false;

  // attempt-local reads snapshot
  let readsUsedThisRound = 0;
  let globalSnapshotAtStart = 0;
  const attemptReadsLeft = () => Math.max(0, globalSnapshotAtStart - readsUsedThisRound);

  function clampInt(v, min, max, fallback){
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function modeChanged(){
    currentMode = $("#mode").value;
    $("#teamSizeField").style.display = (currentMode === "team") ? "block" : "none";
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
      9: "Advanced linking (no solo… sino también…, tanto que…).",
      10:"Very formal nuance (en el supuesto de que, se deduce que…)."
    };
    return map[lvl] || "Connectors";
  }

  function renderLevels(){
    const host = $("#level-list");
    host.innerHTML = "";

    for (let lvl=1; lvl<=10; lvl++){
      const unlocked = isUnlocked(currentMode, lvl);
      const best = getBest(currentMode, lvl);

      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.disabled = !unlocked;

      const title = unlocked ? `Level ${lvl}` : `🔒 Level ${lvl}`;
      const bestTxt = best == null ? "Best: —" : `Best: ${best}s`;

      btn.innerHTML = `
        <div class="level-top">
          <div class="level-title">${title}</div>
          <div class="best">${bestTxt}</div>
        </div>
        <div class="level-desc">${levelDesc(lvl)}</div>
      `;

      if (unlocked) btn.addEventListener("click", () => startLevel(lvl));
      host.appendChild(btn);
    }

    $("#menu").style.display = "block";
    $("#game").style.display = "none";
    updateReadsPill();
  }

  function startTimer(){
    t0 = Date.now();
    clearInterval(timerId);
    timerId = setInterval(() => {
      const t = Math.floor((Date.now() - t0) / 1000);
      $("#timer").textContent = `Time: ${t}s`;
      if (currentMode === "speed" && t >= SPEED_CAP_SECONDS){
        if (!submitted) finishAndCheck(true);
      }
    }, 200);
  }
  function stopTimer(){
    clearInterval(timerId);
    timerId = null;
    return Math.floor((Date.now() - t0) / 1000);
  }

  function buildQuiz(lvl, mode, matchCode){
    const pool = CONNECTORS[lvl] || [];
    const seedStr = `${matchCode}|L${lvl}|M${mode}`;
    const seedInt = xmur3(seedStr)();
    const shuffled = seededShuffle(pool, seedInt);

    const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_ROUND, shuffled.length));
    while (selected.length < QUESTIONS_PER_ROUND){
      selected.push(shuffled[selected.length % shuffled.length]);
    }

    return selected.map((it, idx) => ({
      prompt: it.en,
      answers: it.answers.slice(),
      user: "",
      playerNo: (mode === "team") ? ((idx % teamSize) + 1) : null
    }));
  }

  function startLevel(lvl){
    currentLevel = lvl;
    currentMode = $("#mode").value;
    teamSize = clampInt($("#teamSize").value, 2, 8, 4);

    const rawCode = ($("#matchCode").value || "").trim().toUpperCase();
    currentMatchCode = rawCode || makeMatchCode();
    $("#matchCode").value = currentMatchCode;

    submitted = false;
    readsUsedThisRound = 0;
    globalSnapshotAtStart = getGlobalReads();
    $("#reads-left").textContent = String(attemptReadsLeft());

    $("#speedCap").style.display = (currentMode === "speed") ? "block" : "none";

    $("#game-title").textContent = `Level ${lvl}`;
    $("#modeLabel").textContent = MODE_LABELS[currentMode] || currentMode;
    $("#matchLabel").textContent = currentMatchCode;

    const subtitleMap = {
      classic: "Translate the connector into Spanish.",
      suddendeath: "One mistake = fail. (You still get full feedback.)",
      speed: "Speed Challenge: 60 seconds. Auto-submits at 60s.",
      team: "Pass the device! Each question assigns Player 1…N."
    };
    $("#game-subtitle").textContent = subtitleMap[currentMode] || "Translate the connector into Spanish.";

    quiz = buildQuiz(lvl, currentMode, currentMatchCode);

    $("#results").innerHTML = "";
    $("#menu").style.display = "none";
    $("#game").style.display = "block";

    renderQuiz();
    startTimer();
  }

  function updateSpanishButtonsState(container){
    const left = attemptReadsLeft();
    $("#reads-left").textContent = String(left);
    container.querySelectorAll('button[data-role="es-tts"]').forEach(btn => {
      btn.disabled = left <= 0;
      btn.title = left > 0 ? `Read Spanish target (uses 1; left: ${left})` : "No Spanish reads left for this attempt";
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

      const leftSide = document.createElement("span");
      const teamTag = (currentMode === "team") ? ` · <small>Player ${q.playerNo}</small>` : "";
      leftSide.innerHTML = `${i+1}. ${q.prompt}${teamTag}`;

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
      esBtn.dataset.role = "es-tts";
      esBtn.addEventListener("click", () => {
        if (attemptReadsLeft() <= 0) { updateSpanishButtonsState(qwrap); return; }
        speak(q.answers[0], "es-ES");
        readsUsedThisRound += 1;
        updateSpanishButtonsState(qwrap);
      });

      tools.appendChild(enBtn);
      tools.appendChild(esBtn);

      prompt.appendChild(leftSide);
      prompt.appendChild(tools);

      const ans = document.createElement("div");
      ans.className = "answer";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = (currentMode === "team") ? `Player ${q.playerNo} types here…` : "Type the Spanish connector…";
      input.addEventListener("input", (e) => { quiz[i].user = e.target.value; });

      ans.appendChild(input);
      row.appendChild(prompt);
      row.appendChild(ans);
      qwrap.appendChild(row);
    });

    updateSpanishButtonsState(qwrap);

    $("#submit").disabled = false;
    $("#submit").textContent = "Finish & Check";
    $("#submit").onclick = () => finishAndCheck(false);

    $("#back-button").onclick = backToMenu;
  }

  function finishAndCheck(isAuto=false){
    if (submitted) return;
    submitted = true;

    const elapsed = stopTimer();
    const cappedElapsed = (currentMode === "speed") ? Math.min(elapsed, SPEED_CAP_SECONDS) : elapsed;

    const inputs = $$("#questions input");
    inputs.forEach((inp, i) => { quiz[i].user = inp.value; });

    let correct = 0;
    let wrong = 0;
    const perQ = [];

    quiz.forEach((q, i) => {
      const ok = isCorrect(q.user, q.answers);
      perQ.push(ok);
      if (ok) correct++;
      else wrong++;

      inputs[i].classList.remove("good","bad");
      inputs[i].classList.add(ok ? "good" : "bad");
      inputs[i].readOnly = true;
      inputs[i].disabled = true;
    });

    const died = (currentMode === "suddendeath") && (wrong > 0);

    const penalties = wrong * PENALTY_PER_WRONG;
    const finalScore = cappedElapsed + penalties;

    $("#submit").disabled = true;
    $("#submit").textContent = isAuto ? "Auto-checked" : "Checked";

    // Commit global reads
    let after = clampReads(globalSnapshotAtStart - readsUsedThisRound);
    const perfect = (correct === quiz.length);
    if (perfect && after < GLOBAL_READS_MAX) after = clampReads(after + 1);
    setGlobalReads(after);

    // Unlock message
    let unlockMsg = "";
    if (currentLevel < 10){
      const need = BASE_THRESH[currentLevel];
      if (typeof need === "number"){
        if (died){
          unlockMsg = `💀 Sudden Death: failed (wrong/blank detected). No unlock.`;
        } else {
          unlockMsg = (finalScore <= need)
            ? `🎉 Next level unlocked! (Needed ≤ ${need}s)`
            : `🔓 Need ${finalScore - need}s less to unlock Level ${currentLevel + 1} (Target ≤ ${need}s).`;
        }
      }
    } else {
      unlockMsg = died ? "💀 Sudden Death failed on the final level." : "🏁 Final level — brilliant work.";
    }

    if (!died){
      saveBest(currentMode, currentLevel, finalScore);
    }

    const payload = {
      v: "FINAL",
      lvl: currentLevel,
      mode: currentMode,
      match: currentMatchCode,
      score: finalScore,
      elapsed: cappedElapsed,
      wrong,
      correct,
      readsUsed: readsUsedThisRound,
      perfect,
      died,
      ts: Date.now()
    };
    const resultCode = makeResultCode(payload);

    const results = $("#results");
    results.innerHTML = "";

    const summary = document.createElement("div");
    summary.className = "result-summary";
    summary.innerHTML = `
      <div class="line" style="font-size:1.35rem; font-weight:950; color: var(--text);">
        ${died ? "💀 SUDDEN DEATH: FAILED" : "🏁 FINAL SCORE"}: ${finalScore}s
      </div>
      <div class="line">⏱️ Time: <strong>${cappedElapsed}s</strong>${currentMode==="speed" ? " (cap 60s)" : ""}</div>
      <div class="line">➕ Penalties: <strong>${wrong} × ${PENALTY_PER_WRONG}s = ${penalties}s</strong></div>
      <div class="line">✅ Correct: <strong>${correct}/${quiz.length}</strong></div>
      <div class="line" style="margin-top:8px;"><strong>${unlockMsg}</strong></div>
      <div class="line" style="margin-top:8px;">🔊 Spanish reads used: <strong>${readsUsedThisRound}</strong> · Global after commit: <strong>${after}/${GLOBAL_READS_MAX}</strong></div>
    `;

    if (perfect && !died){
      showPerfectCelebration();
      summary.classList.add("tq-shake");
    }

    const codeBoxMatch = document.createElement("div");
    codeBoxMatch.className = "codebox";
    codeBoxMatch.innerHTML = `
      <div class="label">Match Code (same prompts across devices)</div>
      <div>${currentMatchCode}</div>
    `;

    const codeBox = document.createElement("div");
    codeBox.className = "codebox";
    codeBox.innerHTML = `
      <div class="label">Result Code (copy/paste for comparison)</div>
      <div>${resultCode}</div>
    `;

    const ul = document.createElement("ul");
    quiz.forEach((q, idx) => {
      const ok = perQ[idx];
      const li = document.createElement("li");
      li.className = ok ? "correct" : "incorrect";
      const accepted = q.answers.join(" / ");
      const teamLine = (currentMode === "team") ? `<div>👤 Player ${q.playerNo}</div>` : "";
      li.innerHTML = `
        ${teamLine}
        <div><strong>${q.prompt}</strong></div>
        <div>✅ Answer: <strong>${accepted}</strong></div>
        ${ok ? `<div>🎯 You: <strong>${q.user}</strong></div>`
             : `<div>❌ You: <strong>${q.user || "(blank)"}</strong></div>`}
      `;
      ul.appendChild(li);
    });

    const again = document.createElement("button");
    again.className = "btn primary";
    again.style.marginTop = "14px";
    again.textContent = "Try Again (same match code)";
    again.onclick = () => startLevel(currentLevel);

    results.appendChild(summary);
    results.appendChild(codeBoxMatch);
    results.appendChild(codeBox);
    results.appendChild(ul);
    results.appendChild(again);

    // refresh menu (best/unlocks)
    renderLevels();
    // keep game view visible
    $("#menu").style.display = "none";
    $("#game").style.display = "block";

    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function backToMenu(){
    try{ stopTimer(); }catch{}
    submitted = true;
    $("#menu").style.display = "block";
    $("#game").style.display = "none";
    renderLevels();
  }

  // ===================== Compare =====================
  function compareCodes(){
    const out = $("#compareOut");
    out.innerHTML = "";

    const a = parseResultCode($("#codeA").value);
    const b = parseResultCode($("#codeB").value);

    if (!a.ok || !b.ok){
      out.innerHTML = `
        <div class="warn">
          <div><strong>Could not verify codes.</strong></div>
          <div>${!a.ok ? "A: " + a.error : ""}</div>
          <div>${!b.ok ? "B: " + b.error : ""}</div>
        </div>
      `;
      return;
    }

    const A = a.data, B = b.data;
    const sameLevel = A.lvl === B.lvl;
    const sameMode  = A.mode === B.mode;
    const sameMatch = (A.match || "") === (B.match || "");

    if (!(sameLevel && sameMode && sameMatch)){
      out.innerHTML = `
        <div class="warn">
          <div><strong>Not comparable (must match level + mode + match code).</strong></div>
          <div>Player A: level ${A.lvl}, mode ${MODE_LABELS[A.mode]||A.mode}, match ${A.match}</div>
          <div>Player B: level ${B.lvl}, mode ${MODE_LABELS[B.mode]||B.mode}, match ${B.match}</div>
        </div>
      `;
      return;
    }

    let winner = "Tie";
    if (A.mode === "suddendeath"){
      const aAlive = !A.died, bAlive = !B.died;
      if (aAlive && !bAlive) winner = "Player A";
      else if (!aAlive && bAlive) winner = "Player B";
      else if (A.correct !== B.correct) winner = (A.correct > B.correct) ? "Player A" : "Player B";
      else if (A.score !== B.score) winner = (A.score < B.score) ? "Player A" : "Player B";
    } else if (A.mode === "speed"){
      // Speed: higher correct wins; tie -> fewer wrong; tie -> lower score
      if (A.correct !== B.correct) winner = (A.correct > B.correct) ? "Player A" : "Player B";
      else if (A.wrong !== B.wrong) winner = (A.wrong < B.wrong) ? "Player A" : "Player B";
      else if (A.score !== B.score) winner = (A.score < B.score) ? "Player A" : "Player B";
    } else {
      if (A.score !== B.score) winner = (A.score < B.score) ? "Player A" : "Player B";
    }

    out.innerHTML = `
      <div class="win">
        <div style="font-weight:950; font-size:16px;">🏆 Winner: ${winner}</div>
        <div style="margin-top:6px;">Level <strong>${A.lvl}</strong> · Mode <strong>${MODE_LABELS[A.mode]||A.mode}</strong> · Match <strong>${A.match}</strong></div>
      </div>
      <div class="win">
        <div><strong>Player A</strong> — Score: ${A.score}s · Correct: ${A.correct}/10 · Wrong: ${A.wrong} · Time: ${A.elapsed}s ${A.died ? "· 💀 died" : ""}</div>
        <div style="margin-top:6px;"><strong>Player B</strong> — Score: ${B.score}s · Correct: ${B.correct}/10 · Wrong: ${B.wrong} · Time: ${B.elapsed}s ${B.died ? "· 💀 died" : ""}</div>
      </div>
    `;
  }

  // ===================== Init =====================
  document.addEventListener("DOMContentLoaded", () => {
    setGlobalReads(getGlobalReads());
    updateReadsPill();

    $("#mode").addEventListener("change", () => {
      modeChanged();
      renderLevels();
    });

    $("#teamSize").addEventListener("change", () => {
      teamSize = clampInt($("#teamSize").value, 2, 8, 4);
    });

    $("#genCode").addEventListener("click", () => {
      $("#matchCode").value = makeMatchCode();
    });

    $("#compareBtn").addEventListener("click", compareCodes);
    $("#clearCompare").addEventListener("click", () => {
      $("#codeA").value = "";
      $("#codeB").value = "";
      $("#compareOut").innerHTML = "";
    });

    modeChanged();
    renderLevels();
  });
})();
