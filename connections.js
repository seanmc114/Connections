// --- inside your current connections.js ---
// Replace the submitBtn.addEventListener("click", ...) section with this one:

submitBtn.addEventListener("click", () => {
  const time = stopTimer();
  let correct = 0;
  let incorrect = 0;

  document.querySelectorAll("#questions input").forEach((inp, i) => {
    const q = quiz[i];
    const fb = document.createElement("div");
    fb.className = "feedback";

    if (equal(q.user, q.es)) {
      inp.classList.add("good");
      fb.style.color = "#2ecc71"; // green
      fb.innerHTML = `✅ Correct!`;
      correct++;
    } else {
      inp.classList.add("bad");
      fb.style.color = "#e74c3c"; // red
      fb.innerHTML = `❌ Incorrect.<br><em>Correct answer:</em> ${q.es}`;
      incorrect++;
    }

    inp.parentElement.appendChild(fb);
    inp.disabled = true;
  });

  // --- new scoring logic ---
  const penalty = incorrect * 30; // 30 seconds per wrong/missing
  const finalScore = time + penalty;

  saveBest(currentLevel, finalScore);
  if (currentLevel < 10) unlock(currentLevel + 1);

  resultsDiv.innerHTML = `
    <p>
      <strong>Time:</strong> ${time}s<br>
      <strong>Incorrect:</strong> ${incorrect} × 30s penalty = ${penalty}s<br>
      <strong>Final Score:</strong> ${finalScore}s<br>
      Correct: ${correct}/${quiz.length}
    </p>
  `;
});
