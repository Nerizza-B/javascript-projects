let _listeners = [];

function init(container) {
  const input = container.querySelector("#ng-input");
  const guessBtn = container.querySelector("#ng-guess");
  const hintEl = container.querySelector("#ng-hint");
  const attemptsEl = container.querySelector("#ng-attempts");
  const historyEl = container.querySelector("#ng-history");
  const resetBtn = container.querySelector("#ng-reset");

  let secret, attempts, done;

  function newGame() {
    secret = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    done = false;
    input.value = "";
    input.disabled = false;
    guessBtn.disabled = false;
    hintEl.textContent = "";
    hintEl.style.color = "";
    attemptsEl.textContent = "0";
    historyEl.innerHTML = "";
    input.focus();
  }

  function guess() {
    if (done) return;
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100) {
      hintEl.textContent = "Enter a number between 1 and 100";
      hintEl.style.color = "#f97316";
      return;
    }
    attempts++;
    attemptsEl.textContent = attempts;

    let chipClass = "";
    if (val === secret) {
      hintEl.textContent = `🎉 Correct! It was ${secret}. (${attempts} attempt${attempts > 1 ? "s" : ""})`;
      hintEl.style.color = "#4ade80";
      chipClass = "win";
      done = true;
      input.disabled = true;
      guessBtn.disabled = true;
    } else if (val > secret) {
      hintEl.textContent = "⬇ Too high!";
      hintEl.style.color = "#f472b6";
      chipClass = "high";
    } else {
      hintEl.textContent = "⬆ Too low!";
      hintEl.style.color = "#60a5fa";
      chipClass = "low";
    }

    const chip = document.createElement("span");
    chip.className = `ng-chip ${chipClass}`;
    chip.textContent = val;
    historyEl.prepend(chip);
    input.value = "";
    if (!done) input.focus();
  }

  function onKey(e) {
    if (e.key === "Enter") guess();
  }

  const handlers = [
    { el: guessBtn, type: "click", fn: guess },
    { el: resetBtn, type: "click", fn: newGame },
    { el: input, type: "keydown", fn: onKey },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
  newGame();
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
