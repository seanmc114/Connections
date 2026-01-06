// Connections – Synge Street CBS Edition
// Final classroom version: buttons, 10 levels, feedback, Turbo-Jump scoring (+30s per error)

document.addEventListener("DOMContentLoaded", () => {

  const $ = s => document.querySelector(s);
  const levelList = $("#level-list");
  const mainMenu = $("#main-menu");
  const game = $("#game");
  const questionsDiv = $("#questions");
  const resultsDiv = $("#results");
  const timerDisplay = $("#timer");
  const levelLabel = $("#level-label");
  const submitBtn = $("#submit");
  const backBtn = $("#back-button");

  let currentLevel = 1, startTime = 0, timer = null, quiz = [];

  /* ---------- Local Storage ---------- */
  const bestKey = l => `connections_best_${l}`;
  const unlockedKey = l => `connections_unlocked_${l}`;
  const getBest = l => parseInt(localStorage.getItem(bestKey(l))) || null;
  const saveBest = (l, s) => {
    const b = getBest(l);
    if (!b || s < b) localStorage.setItem(bestKey(l), s);
  };
  const isUnlocked = l => l === 1 || localStorage.getItem(unlockedKey(l)) === "true";
  const unlock = l => localStorage.setItem(unlockedKey(l), "true");

  /* ---------- Accent-tolerant compare ---------- */
  const normalize = s => (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¡!¿?.,;:"]/g, "")
    .trim();
  const equal = (a, b) => normalize(a) === normalize(b);

  /* ---------- Question Data (10 levels × 10 questions) ---------- */
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
      {en:"I
