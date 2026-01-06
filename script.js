:root{
  --text: #0b1020;
  --muted: rgba(11,16,32,.70);
  --stroke: rgba(11,16,32,.10);
  --shadow: 0 16px 45px rgba(11,16,32,.14);
  --radius: 22px;

  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;

  --cardTop: rgba(255,255,255,.86);
  --cardBot: rgba(255,255,255,.74);

  --primaryA: #2563eb; /* blue */
  --primaryB: #22c55e; /* green */
  --accent:  #a855f7;  /* purple */
  --sun:     #f59e0b;  /* amber */
}

*{ box-sizing:border-box; }
html,body{ height:100%; }

body{
  margin:0;
  font-family: var(--sans);
  color: var(--text);

  /* brighter, youthful background */
  background:
    radial-gradient(900px 520px at 15% 12%, rgba(37,99,235,.22), transparent 60%),
    radial-gradient(860px 520px at 85% 18%, rgba(34,197,94,.20), transparent 62%),
    radial-gradient(820px 520px at 60% 92%, rgba(168,85,247,.18), transparent 60%),
    linear-gradient(135deg, #f7fbff, #f3fff8 45%, #fff7fb);
  overflow-x:hidden;
}

.crest{
  position:fixed; inset:0;
  background-image: url("crest.png");
  background-repeat:no-repeat;
  background-position:center;
  background-size: min(82vmin, 760px);
  opacity: .10;
  mix-blend-mode: multiply;
  filter: contrast(1.08) saturate(1.1);
  pointer-events:none;
  z-index:0;
}

.shell{
  position:relative;
  z-index:1;
  max-width: 1040px;
  margin: 26px auto 44px;
  padding: 0 16px;
}

.header{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:16px;
  margin-bottom: 14px;
  flex-wrap:wrap;
}

h1{ margin:0; font-size: 30px; letter-spacing: .2px; }
.turbo{
  display:inline-block;
  font-weight: 950;
  letter-spacing: .8px;
  transform: skewX(-10deg);
  background: linear-gradient(90deg, var(--primaryA), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.subtitle{ margin: 6px 0 0; color: var(--muted); font-size: 13px; }

.meta{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
.pill{
  display:flex; align-items:center; gap:10px;
  padding: 10px 12px;
  border-radius: 999px;
  border:1px solid var(--stroke);
  background: rgba(255,255,255,.72);
  backdrop-filter: blur(10px);
}
.pill-label{ color: rgba(11,16,32,.62); font-size: 12px; }
.pill-value{ font-family: var(--mono); font-size: 12px; }

.card{
  background: linear-gradient(180deg, var(--cardTop), var(--cardBot));
  border:1px solid var(--stroke);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  overflow:hidden;
  margin-bottom: 14px;
}

.card-head{ padding: 18px 18px 12px; border-bottom: 1px solid rgba(11,16,32,.08); }
.card-head h2{ margin:0 0 6px; font-size: 18px; }
.card-head p{ margin:0; color: var(--muted); font-size: 13px; line-height:1.35; }

.card-foot{ padding: 12px 18px 16px; border-top: 1px solid rgba(11,16,32,.08); }
.hint{ color: var(--muted); font-size: 13px; }

.menu-grid{
  padding: 14px 18px 0;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 780px){ .menu-grid{ grid-template-columns: 1fr; } }

.field label{
  display:block;
  font-size: 12px;
  color: rgba(11,16,32,.66);
  margin-bottom: 6px;
}
.field input, .field select, .field textarea{
  width:100%;
  padding: 11px 12px;
  border-radius: 14px;
  border: 1px solid rgba(11,16,32,.14);
  background: rgba(255,255,255,.86);
  color: var(--text);
  outline:none;
  font-size: 14px;
}
.field textarea{ resize: vertical; min-height: 70px; }
.field input:focus, .field select:focus, .field textarea:focus{
  border-color: rgba(37,99,235,.35);
  box-shadow: 0 0 0 4px rgba(37,99,235,.12);
}
.help{ margin-top: 6px; color: rgba(11,16,32,.62); font-size: 12px; line-height: 1.25; }
.row{ display:flex; gap: 10px; align-items:center; }

.levels{
  display:grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  padding: 14px 18px 14px;
}
@media (max-width: 900px){ .levels{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
@media (max-width: 560px){ .levels{ grid-template-columns: repeat(2, minmax(0,1fr)); } }

.level-btn{
  width:100%;
  text-align:left;
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.12);
  background: rgba(255,255,255,.78);
  color: var(--text);
  padding: 12px 12px;
  cursor:pointer;
  transition: transform .12s ease, box-shadow .12s ease;
  min-height: 80px;
}
.level-btn:hover:enabled{
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(11,16,32,.12);
}
.level-btn:disabled{ opacity:.55; cursor:not-allowed; }
.level-top{ display:flex; justify-content:space-between; gap:10px; align-items:baseline; }
.level-title{ font-weight: 950; font-size: 13px; letter-spacing:.2px; }
.best{ font-family: var(--mono); font-size: 12px; color: rgba(11,16,32,.62); }
.level-desc{ margin-top: 8px; color: var(--muted); font-size: 12px; line-height: 1.25; }

.game-head{ display:flex; justify-content:space-between; gap: 14px; align-items:flex-start; flex-wrap:wrap; }
.timer{
  font-family: var(--mono);
  font-size: 13px;
  padding: 9px 12px;
  border-radius: 14px;
  border: 1px solid rgba(11,16,32,.12);
  background: rgba(255,255,255,.85);
}
.smallline{ margin-top: 8px; color: var(--muted); font-size: 12px; }
.reads-small{ margin-top: 8px; color: var(--muted); font-size: 12px; }

/* NEW: mode rules banner */
.mode-rules{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.12);
  background:
    linear-gradient(90deg, rgba(37,99,235,.12), rgba(34,197,94,.10), rgba(168,85,247,.10));
  color: rgba(11,16,32,.85);
  font-size: 12.5px;
  line-height: 1.25;
}

.questions{ padding: 12px 18px 0; display:grid; gap: 10px; }
.q{
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.10);
  background: rgba(255,255,255,.78);
  padding: 12px;
}
.prompt{
  font-weight: 950;
  letter-spacing: .15px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  flex-wrap:wrap;
}
.tools{ display:flex; gap: 8px; align-items:center; flex-wrap:wrap; }
.toolbtn{
  border-radius: 999px;
  border: 1px solid rgba(11,16,32,.14);
  background: rgba(255,255,255,.88);
  color: var(--text);
  padding: 6px 10px;
  cursor:pointer;
  font-size: 12px;
}
.toolbtn:disabled{ opacity:.5; cursor:not-allowed; }

.answer{ margin-top: 10px; }
.answer input{
  width:100%;
  padding: 11px 12px;
  border-radius: 14px;
  border: 1px solid rgba(11,16,32,.14);
  background: rgba(255,255,255,.90);
  color: var(--text);
  outline:none;
  font-size: 14px;
}
.answer input:focus{
  border-color: rgba(37,99,235,.35);
  box-shadow: 0 0 0 4px rgba(37,99,235,.12);
}
.answer input.good{ background-color: rgba(34, 197, 94, 0.14); border-color: rgba(34, 197, 94, 0.45); }
.answer input.bad{ background-color: rgba(239, 68, 68, 0.14); border-color: rgba(239, 68, 68, 0.45); }

.controls{
  padding: 14px 18px 16px;
  display:flex;
  gap: 10px;
  justify-content:flex-end;
  flex-wrap:wrap;
}
.btn{
  border-radius: 999px;
  border: 1px solid rgba(11,16,32,.14);
  padding: 10px 14px;
  font-weight: 950;
  cursor:pointer;
  background: rgba(255,255,255,.88);
  color: var(--text);
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn:hover{
  transform: translateY(-1px);
  box-shadow: 0 12px 25px rgba(11,16,32,.12);
}
.btn.primary{
  border: none;
  color: #fff;
  background: linear-gradient(90deg, var(--primaryA), var(--accent));
}
.btn.ghost{ background: rgba(255,255,255,.78); }

.results{ padding: 0 18px 18px; }
.result-summary{ text-align:center; margin: 12px 0 12px 0; }
.result-summary .line{ margin: 5px 0; color: var(--muted); }
.result-summary .line strong{ color: var(--text); }

.results ul{
  list-style:none;
  padding:0;
  margin: 0 auto;
  width:100%;
  max-width: 860px;
  display:grid;
  gap: 8px;
}
.results li{
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.10);
  background: rgba(255,255,255,.78);
  padding: 10px 12px;
  font-size: 13px;
  color: var(--muted);
}
.results li.correct{ border-color: rgba(34, 197, 94, 0.35); }
.results li.incorrect{ border-color: rgba(239, 68, 68, 0.35); }

.codebox{
  margin: 10px auto 0;
  max-width: 860px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.12);
  background: rgba(255,255,255,.80);
  font-family: var(--mono);
  font-size: 12px;
  overflow-wrap:anywhere;
}
.codebox .label{
  font-family: var(--sans);
  font-weight: 950;
  font-size: 12px;
  color: rgba(11,16,32,.70);
  margin-bottom: 6px;
}

.compare-grid{
  padding: 14px 18px 0;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 780px){ .compare-grid{ grid-template-columns: 1fr; } }

.compare-out{
  padding: 0 18px 18px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.35;
}
.compare-out .win{
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(11,16,32,.12);
  background: rgba(255,255,255,.78);
  color: var(--text);
}
.compare-out .warn{
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(245,158,11,.35);
  background: rgba(245,158,11,.15);
  color: rgba(11,16,32,.92);
}

/* footer */
.footer{
  margin-top: 10px;
  padding: 6px 4px 0;
  text-align:center;
  font-size: 12px;
  color: rgba(11,16,32,.65);
}

/* PERFECT celebration (unchanged) */
@keyframes tq-burst { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
@keyframes tq-pop { 0%{transform:scale(0.6); opacity:0} 25%{transform:scale(1.05); opacity:1} 60%{transform:scale(1)} 100%{opacity:0} }
@keyframes tq-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
.tq-celebrate-overlay{ position:fixed; inset:0; z-index:9999; pointer-events:none; }
.tq-confetti{ position:absolute; width:8px; height:14px; border-radius:2px; opacity:0.95; will-change:transform,opacity; animation:tq-burst 1600ms ease-out forwards; }
.tq-perfect-banner{
  position:fixed; left:50%; top:14%;
  transform:translateX(-50%);
  padding:10px 18px; border-radius:999px;
  font-weight: 950; font-size: 28px; letter-spacing: 1px;
  color:#fff;
  background: linear-gradient(90deg, var(--primaryA), var(--primaryB));
  box-shadow:0 10px 30px rgba(11,16,32,.20);
  animation:tq-pop 1800ms ease-out forwards;
  text-shadow:0 1px 2px rgba(0,0,0,.25);
}
.tq-shake{ animation:tq-shake 650ms ease-in-out; }
