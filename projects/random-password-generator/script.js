let activeListeners = [];

const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  num: "0123456789",
  sym: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generate(length, selectedSets) {
  const charPool = selectedSets.join("");
  if (!charPool) return "";

  const resultChars = [];

  selectedSets.forEach((set) =>
    resultChars.push(set[Math.floor(Math.random() * set.length)]),
  );

  while (resultChars.length < length) {
    resultChars.push(charPool[Math.floor(Math.random() * charPool.length)]);
  }

  return resultChars.sort(() => Math.random() - 0.5).join("");
}

function strength(password) {
  let score = 0;

  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

function init(container) {
  const pwEl = container.querySelector("#pg-password");
  const copyBtn = container.querySelector("#pg-copy");
  const genBtn = container.querySelector("#pg-gen");
  const lenSlider = container.querySelector("#pg-len");
  const lenVal = container.querySelector("#pg-len-val");

  const strengthEl = container.querySelector("#pg-strength");
  const strengthTextEl = container.querySelector("#pg-strength-text");
  const strengthFillEl = container.querySelector("#pg-strength-fill");

  const copiedEl = container.querySelector("#pg-copied");

  const upperCb = container.querySelector("#pg-upper");
  const lowerCb = container.querySelector("#pg-lower");
  const numCb = container.querySelector("#pg-num");
  const symCb = container.querySelector("#pg-sym");

  if (!pwEl || !strengthEl || !strengthTextEl || !strengthFillEl) return;

  let copyTimer = null;

  function updatePassword() {
    const selectedSets = [];

    if (upperCb.checked) selectedSets.push(CHAR_SETS.upper);
    if (lowerCb.checked) selectedSets.push(CHAR_SETS.lower);
    if (numCb.checked) selectedSets.push(CHAR_SETS.num);
    if (symCb.checked) selectedSets.push(CHAR_SETS.sym);

    const password = generate(parseInt(lenSlider.value), selectedSets);

    pwEl.textContent = password || "— select at least one type —";

    const score = password ? strength(password) : 0;

    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

    const colors = ["#ef4444", "#f97316", "#eab308", "#4ade80", "#22c55e"];

    const maxScore = 4;
    const percent = (score / maxScore) * 100;

    const labelIndex = Math.min(score, labels.length - 1);

    strengthTextEl.textContent = password ? labels[labelIndex] : "—";

    strengthFillEl.style.width = password ? `${percent}%` : "0%";
    strengthFillEl.style.background = colors[labelIndex] ?? "#ef4444";

    copiedEl.textContent = "";
  }

  function handleLengthChange() {
    lenVal.textContent = lenSlider.value;
    updatePassword();
  }

  async function copyPassword() {
    const password = pwEl.textContent;
    if (!password || password.startsWith("—")) return;

    await navigator.clipboard.writeText(password);

    copiedEl.textContent = "Copied!";

    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copiedEl.textContent = "";
    }, 2000);
  }

  const listeners = [
    { el: genBtn, type: "click", fn: updatePassword },
    { el: copyBtn, type: "click", fn: copyPassword },
    { el: lenSlider, type: "input", fn: handleLengthChange },
    { el: upperCb, type: "change", fn: updatePassword },
    { el: lowerCb, type: "change", fn: updatePassword },
    { el: numCb, type: "change", fn: updatePassword },
    { el: symCb, type: "change", fn: updatePassword },
  ];

  listeners.forEach(({ el, type, fn }) => el.addEventListener(type, fn));

  activeListeners = listeners;
  updatePassword();
}

function destroy() {
  activeListeners.forEach(({ el, type, fn }) =>
    el.removeEventListener(type, fn),
  );

  activeListeners = [];
}

export { init, destroy };
