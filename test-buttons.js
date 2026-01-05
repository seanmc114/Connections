document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("level-list");
  if (!list) {
    alert("No element with id='level-list' found in HTML!");
    return;
  }

  // just create 10 buttons
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    btn.textContent = "Level " + i;
    if (i > 1) btn.disabled = true;
    list.appendChild(btn);
  }
});
