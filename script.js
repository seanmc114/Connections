/* Synge Connectors — Conjunctions / Linking words
   - 10 questions per round
   - score = elapsed time + 30s per wrong/blank
   - feedback screen + best time per level
   - accents required; ignore capitals; allow ñ typed as n
*/

const CREST_URL = "https://cdn.glitch.global/621e9193-d872-47a1-a722-a7a9e3ce934f/background.jpg.jfif";
const QUESTIONS_PER_ROUND = 10;
const PENALTY_SECONDS = 30;

// ----------------------- DATASET (Levels 1–10) -----------------------
// Each item: { en: "prompt", answers: ["spanish", "alt"] }
const LEVELS = [
  {
    id: 1,
    name: "Level 1 — Basics",
    desc: "Simple, high-frequency connectors",
    bank: [
      { en: "and", answers: ["y", "e"] },
      { en: "or", answers: ["o", "u"] },
      { en: "but", answers: ["pero"] },
      { en: "because", answers: ["porque"] },
      { en: "also", answers: ["también"] },
      { en: "so / therefore (simple)", answers: ["así que"] },
      { en: "if", answers: ["si"] },
      { en: "then", answers: ["entonces"] },
      { en: "with", answers: ["con"] },
      { en: "without", answers: ["sin"] },
      { en: "for example", answers: ["por ejemplo"] },
      { en: "in the end / finally", answers: ["al final", "finalmente"] },
      { en: "now", answers: ["ahora"] },
      { en: "still / yet", answers: ["todavía"] },
      { en: "only", answers: ["solo", "solamente"] },
    ]
  },
  {
    id: 2,
    name: "Level 2 — Time & Order",
    desc: "Sequencing and time words",
    bank: [
      { en: "first", answers: ["primero"] },
      { en: "then / next", answers: ["después", "luego"] },
      { en: "after", answers: ["después de"] },
      { en: "before", answers: ["antes de"] },
      { en: "later", answers: ["más tarde"] },
      { en: "at the same time", answers: ["al mismo tiempo"] },
      { en: "when", answers: ["cuando"] },
      { en: "while", answers: ["mientras"] },
      { en: "until", answers: ["hasta"] },
      { en: "since (time)", answers: ["desde"] },
      { en: "every day", answers: ["cada día"] },
      { en: "sometimes", answers: ["a veces"] },
      { en: "usually", answers: ["normalmente"] },
      { en: "always", answers: ["siempre"] },
      { en: "never", answers: ["nunca"] },
    ]
  },
  {
    id: 3,
    name: "Level 3 — Cause & Effect",
    desc: "Reasons, results, and explanations",
    bank: [
      { en: "because of", answers: ["a causa de", "por culpa de"] },
      { en: "thanks to", answers: ["gracias a"] },
      { en: "therefore", answers: ["por lo tanto"] },
      { en: "as a result", answers: ["como resultado"] },
      { en: "that's why", answers: ["por eso"] },
      { en: "so that", answers: ["para que"] },
      { en: "in order to", answers: ["para", "con el fin de"] },
      { en: "since (because)", answers: ["ya que", "puesto que"] },
      { en: "because (formal)", answers: ["debido a que"] },
      { en: "for this reason", answers: ["por esta razón"] },
      { en: "that is to say", answers: ["es decir"] },
      { en: "in other words", answers: ["en otras palabras"] },
      { en: "in fact", answers: ["de hecho"] },
      { en: "of course", answers: ["por supuesto"] },
      { en: "clearly", answers: ["claramente"] },
    ]
  },
  {
    id: 4,
    name: "Level 4 — Contrast",
    desc: "Comparisons, opposites, concessions (intro)",
    bank: [
      { en: "however", answers: ["sin embargo"] },
      { en: "nevertheless", answers: ["no obstante"] },
      { en: "on the other hand", answers: ["por otro lado"] },
      { en: "instead", answers: ["en vez de", "en lugar de"] },
      { en: "although", answers: ["aunque"] },
      { en: "even though", answers: ["aunque", "aun así"] },
      { en: "despite", answers: ["a pesar de"] },
      { en: "in spite of", answers: ["a pesar de"] },
      { en: "whereas", answers: ["mientras que"] },
      { en: "rather", answers: ["más bien"] },
      { en: "at least", answers: ["por lo menos", "al menos"] },
      { en: "in contrast", answers: ["en cambio"] },
      { en: "still / even so", answers: ["aun así"] },
      { en: "instead of that", answers: ["en lugar de eso"] },
      { en: "but rather", answers: ["sino"] },
    ]
  },
  {
    id: 5,
    name: "Level 5 — Adding & Structuring",
    desc: "Organising ideas, adding points",
    bank: [
      { en: "moreover", answers: ["además"] },
      { en: "furthermore", answers: ["además", "asimismo"] },
      { en: "also (formal)", answers: ["asimismo"] },
      { en: "in addition", answers: ["además"] },
      { en: "above all", answers: ["sobre todo"] },
      { en: "especially", answers: ["especialmente"] },
      { en: "in summary", answers: ["en resumen"] },
      { en: "to sum up", answers: ["en conclusión"] },
      { en: "in conclusion", answers: ["en conclusión"] },
      { en: "in the first place", answers: ["en primer lugar"] },
      { en: "secondly", answers: ["en segundo lugar"] },
      { en: "finally (structuring)", answers: ["por último", "finalmente"] },
      { en: "on the one hand", answers: ["por un lado"] },
      { en: "on the other hand", answers: ["por otro lado"] },
      { en: "in general", answers: ["en general"] },
    ]
  },
  {
    id: 6,
    name: "Level 6 — Conditions & Hypotheses",
    desc: "If, unless, provided that…",
    bank: [
      { en: "if (formal)", answers: ["si"] },
      { en: "provided that", answers: ["siempre que"] },
      { en: "as long as", answers: ["mientras", "siempre que"] },
      { en: "unless", answers: ["a menos que"] },
      { en: "in case", answers: ["en caso de que"] },
      { en: "otherwise", answers: ["si no"] },
      { en: "even if", answers: ["aunque", "incluso si"] },
      { en: "as soon as", answers: ["tan pronto como"] },
      { en: "as long as (duration)", answers: ["durante el tiempo que"] },
      { en: "in that case", answers: ["en ese caso"] },
      { en: "in any case", answers: ["en cualquier caso"] },
      { en: "whether", answers: ["si", "ya sea"] },
      { en: "either…or…", answers: ["o…o…", "ya sea…o…"] },
      { en: "if not", answers: ["si no"] },
      { en: "in case of", answers: ["en caso de"] },
    ]
  },
  {
    id: 7,
    name: "Level 7 — Nuance & Register",
    desc: "More precise connectors, opinion framing",
    bank: [
      { en: "from my point of view", answers: ["desde mi punto de vista"] },
      { en: "in my opinion", answers: ["en mi opinión"] },
      { en: "as far as I’m concerned", answers: ["en cuanto a mí"] },
      { en: "regarding", answers: ["con respecto a", "en cuanto a"] },
      { en: "as for", answers: ["en cuanto a"] },
      { en: "in relation to", answers: ["en relación con"] },
      { en: "according to", answers: ["según"] },
      { en: "for instance", answers: ["por ejemplo"] },
      { en: "in particular", answers: ["en particular"] },
      { en: "to a certain extent", answers: ["hasta cierto punto"] },
      { en: "in the same way", answers: ["de la misma manera"] },
      { en: "in the same sense", answers: ["en el mismo sentido"] },
      { en: "on the contrary", answers: ["al contrario"] },
      { en: "as a matter of fact", answers: ["de hecho"] },
      { en: "as a consequence", answers: ["en consecuencia"] },
    ]
  },
  {
    id: 8,
    name: "Level 8 — Concession & Emphasis",
    desc: "Despite…, even so…, nevertheless…",
    bank: [
      { en: "despite the fact that", answers: ["a pesar de que"] },
      { en: "even so", answers: ["aun así"] },
      { en: "nevertheless (formal)", answers: ["no obstante"] },
      { en: "however (formal)", answers: ["sin embargo"] },
      { en: "although (formal)", answers: ["si bien"] },
      { en: "even though (formal)", answers: ["aunque"] },
      { en: "in spite of (that)", answers: ["a pesar de ello"] },
      { en: "all the same", answers: ["de todos modos"] },
      { en: "anyway", answers: ["de todos modos"] },
      { en: "after all", answers: ["al fin y al cabo"] },
      { en: "above all (emphasis)", answers: ["sobre todo"] },
      { en: "indeed", answers: ["en efecto"] },
      { en: "in any event", answers: ["en cualquier caso"] },
      { en: "no matter what", answers: ["pase lo que pase"] },
      { en: "no matter how", answers: ["por muy que"] },
    ]
  },
  {
    id: 9,
    name: "Level 9 — Advanced Linking",
    desc: "Complex structuring and logic",
    bank: [
      { en: "to begin with", answers: ["para empezar"] },
      { en: "in the meantime", answers: ["mientras tanto"] },
      { en: "thereby", answers: ["de este modo"] },
      { en: "hence", answers: ["de ahí que"] },
      { en: "consequently", answers: ["por consiguiente"] },
      { en: "thus", answers: ["así", "de este modo"] },
      { en: "insofar as", answers: ["en la medida en que"] },
      { en: "as long as (condition)", answers: ["siempre que"] },
      { en: "not only… but also…", answers: ["no solo… sino también…"] },
      { en: "either way", answers: ["de una forma u otra"] },
      { en: "in any case (formal)", answers: ["en todo caso"] },
      { en: "with the aim of", answers: ["con el objetivo de"] },
      { en: "to the extent that", answers: ["hasta el punto de que"] },
      { en: "so much so that", answers: ["tanto que"] },
      { en: "for that matter", answers: ["por cierto"] },
    ]
  },
  {
    id: 10,
    name: "Level 10 — Very Difficult",
    desc: "High-register / nuanced connectors",
    bank: [
      { en: "therefore (high register)", answers: ["por ende"] },
      { en: "nonetheless", answers: ["con todo"] },
      { en: "notwithstanding", answers: ["no obstante"] },
      { en: "be that as it may", answers: ["sea como sea"] },
      { en: "as a rule", answers: ["por regla general"] },
      { en: "on the grounds that", answers: ["con el argumento de que"] },
      { en: "for fear that", answers: ["por miedo a que"] },
      { en: "so as not to", answers: ["para no"] },
      { en: "as soon as / the moment", answers: ["en cuanto"] },
      { en: "once (as soon as)", answers: ["una vez que"] },
      { en: "whenever", answers: ["siempre que", "cada vez que"] },
      { en: "in the light of", answers: ["a la luz de"] },
      { en: "in view of", answers: ["en vista de"] },
      { en: "with regard to", answers: ["en lo que respecta a"] },
      { en: "it follows that", answers: ["se deduce que"] },
    ]
  }
];

// ----------------------- UI refs -----------------------
const elMenu = document.getElementById("menu");
const elGame = document.getElementById("game");
const elResults = document.getElementById("results");

const elLevels = document.getElementById("levels");
const elStartBtn = document.getElementById("startBtn");
const elHowBtn = document.getElementById("howBtn");
const elHowPanel = document.getElementById("howPanel");

const elHudLevel = document.getElementById("hudLevel");
const elHudTime = document.getElementById("hudTime");
const elHudPenalty = document.getElementById("hudPenalty");

const elGameTitle = document.getElementById("gameTitle");
const elQuizForm = document.getElementById("quizForm");
const elSubmitBtn = document.getElementById("submitBtn");
const elBackToMenuBtn = document.getElementById("backToMenuBtn");

const elResultsSummary = document.getElementById("resultsSummary");
const elRawTime = document.getElementById("rawTime");
const elPenalties = document.getElementById("penalties");
const elFinalScore = document.getElementById("finalScore");
const elBestScore = document.getElementById("bestScore");
const elFeedback = document.getElementById("feedback");

const elTryAgainBtn = document.getElementById("tryAgainBtn");
const elMenuBtn = document.getElementById("menuBtn");
const elNextLevelBtn = document.getElementById("nextLevelBtn");

// background crest
document.querySelector(".bg-crest").style.backgroundImage = `url("${CREST_URL}")`;

// ----------------------- Game state -----------------------
let selectedLevelId = null;
let currentRound = null; // { levelId, questions: [{en, answers}], startedAt, timerId }
let elapsedMs = 0;

// ----------------------- Helpers -----------------------
function pad2(n){ return String(n).padStart(2,"0"); }
function formatMs(ms){
  const totalSec = Math.max(0, Math.round(ms/1000));
  const m = Math.floor(totalSec/60);
  const s = totalSec % 60;
  return `${pad2(m)}:${pad2(s)}`;
}
function normalize(str){
  // accents required -> do NOT strip accents
  // ignore capitals, allow ñ typed as n
  return (str ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ñ", "n")
    .replace(/\s+/g, " ")
    .replace(/^[¿?¡!.,;:()\[\]“”"']+|[¿?¡!.,;:()\[\]“”"']+$/g, "");
}
function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

function bestKey(levelId){
  return `synge_connectors_best_level_${levelId}`;
}
function getBest(levelId){
  const raw = localStorage.getItem(bestKey(levelId));
  const n = raw ? Number(raw) : null;
  return Number.isFinite(n) ? n : null;
}
function setBest(levelId, ms){
  localStorage.setItem(bestKey(levelId), String(ms));
}

function renderLevels(){
  elLevels.innerHTML = "";
  LEVELS.forEach(lvl=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "level-btn";
    btn.dataset.levelId = String(lvl.id);

    const best = getBest(lvl.id);
    btn.innerHTML = `
      <div class="level-top">
        <div class="level-title">${lvl.name}</div>
        <div class="level-best">${best == null ? "Best: —" : `Best: ${formatMs(best)}`}</div>
      </div>
      <div class="level-desc">${lvl.desc}</div>
    `;

    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".level-btn").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedLevelId = lvl.id;
      elStartBtn.disabled = false;
    });

    elLevels.appendChild(btn);
  });
}

function show(section){
  elMenu.hidden = section !== "menu";
  elGame.hidden = section !== "game";
  elResults.hidden = section !== "results";
}

function buildRound(levelId){
  const level = LEVELS.find(l=>l.id===levelId);
  const bank = shuffle(level.bank);

  // ensure we can always get 10 prompts:
  let chosen = bank.slice(0, QUESTIONS_PER_ROUND);
  if(chosen.length < QUESTIONS_PER_ROUND){
    // repeat if bank was smaller (shouldn't happen here)
    while(chosen.length < QUESTIONS_PER_ROUND) chosen.push(choice(level.bank));
  }

  return {
    levelId,
    questions: chosen.map(q => ({
      en: q.en,
      answers: q.answers.slice()
    })),
    startedAt: null,
    timerId: null
  };
}

function renderQuiz(round){
  elQuizForm.innerHTML = "";
  round.questions.forEach((q, idx)=>{
    const row = document.createElement("div");
    row
