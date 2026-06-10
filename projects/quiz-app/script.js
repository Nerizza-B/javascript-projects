import { addInterval, addTimeout, destroyAll } from "../../core/teardown.js";

const QUESTIONS = [
  {
    q: "Which language runs in a web browser?",
    choices: ["Java", "C", "JavaScript", "Python"],
    a: 2,
  },
  {
    q: "What does CSS stand for?",
    choices: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    a: 1,
  },
  {
    q: "Which HTML tag creates a hyperlink?",
    choices: ["<link>", "<a>", "<href>", "<url>"],
    a: 1,
  },
  {
    q: "What does DOM stand for?",
    choices: [
      "Document Object Model",
      "Data Object Map",
      "Display Object Module",
      "Document Order Model",
    ],
    a: 0,
  },
  {
    q: "Which symbol is used for JavaScript single-line comments?",
    choices: ["#", "//", "<!--", "**"],
    a: 1,
  },
  {
    q: "What is the result of 0.1 + 0.2 === 0.3 in JavaScript?",
    choices: ["true", "false", "undefined", "NaN"],
    a: 1,
  },
  {
    q: "Which method adds an element to the end of an array?",
    choices: ["push()", "pop()", "shift()", "unshift()"],
    a: 0,
  },
  {
    q: "What keyword declares a constant in JavaScript?",
    choices: ["let", "var", "const", "static"],
    a: 2,
  },
  {
    q: "What does JSON stand for?",
    choices: [
      "JavaScript Object Notation",
      "Java Standard Object Nodes",
      "JavaScript Open Network",
      "Joint Standard Object Notation",
    ],
    a: 0,
  },
  {
    q: "Which CSS property controls text size?",
    choices: ["text-size", "font-style", "font-size", "text-scale"],
    a: 2,
  },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function init(container) {
  const questionEl = container.querySelector("#qa-question");
  const choicesEl = container.querySelector("#qa-choices");
  const progressEl = container.querySelector("#qa-progress");
  const timerEl = container.querySelector("#qa-timer");
  const barFill = container.querySelector("#qa-bar-fill");
  const resultEl = container.querySelector("#qa-result");
  const scoreValEl = container.querySelector("#qa-score-val");
  const restartBtn = container.querySelector("#qa-restart");

  let questions = [];
  let current = 0;
  let score = 0;

  let timer = null;
  let locked = false;

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function renderChoices(q) {
    choicesEl.innerHTML = "";

    q.choices.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.className = "qa-choice";
      btn.dataset.idx = i;

      // IMPORTANT FIX: prevents <a>, <link> from breaking layout
      btn.textContent = c;

      choicesEl.appendChild(btn);
    });
  }

  function showQuestion() {
    clearTimer();
    locked = false;

    if (current >= questions.length) {
      showResult();
      return;
    }

    const q = questions[current];

    progressEl.textContent = `Question ${current + 1} / ${questions.length}`;
    questionEl.textContent = q.q;

    let secs = 15;
    timerEl.textContent = `${secs}s`;
    timerEl.classList.remove("urgent");
    barFill.style.width = "100%";

    renderChoices(q);

    timer = setInterval(() => {
      secs--;
      timerEl.textContent = `${secs}s`;
      barFill.style.width = (secs / 15) * 100 + "%";

      if (secs <= 5) timerEl.classList.add("urgent");

      if (secs <= 0) {
        clearTimer();
        markAnswer(-1, q.a);
      }
    }, 1000);

    addInterval(timer);
  }

  function markAnswer(chosen, correct) {
    if (locked) return;
    locked = true;

    clearTimer();

    const buttons = choicesEl.querySelectorAll(".qa-choice");

    buttons.forEach((btn, i) => {
      btn.disabled = true;

      if (i === correct) btn.classList.add("correct");
      else if (i === chosen) btn.classList.add("wrong");
    });

    if (chosen === correct) score++;

    const tid = setTimeout(() => {
      current++;
      showQuestion();
    }, 1200);

    addTimeout(tid);
  }

  // SINGLE event listener (no stacking bug)
  choicesEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-idx]");
    if (!btn || locked) return;

    clearTimer();

    markAnswer(parseInt(btn.dataset.idx, 10), questions[current].a);
  });

  function showResult() {
    clearTimer();

    questionEl.textContent = "";
    choicesEl.innerHTML = "";
    progressEl.textContent = "";
    timerEl.textContent = "";
    barFill.style.width = "0";

    resultEl.hidden = false;

    const pct = Math.round((score / questions.length) * 100);

    scoreValEl.textContent =
      `You scored ${score} / ${questions.length} (${pct}%) ` +
      (pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪");
  }

  function startQuiz() {
    destroyAll();

    resultEl.hidden = true;

    questions = shuffle(QUESTIONS);
    current = 0;
    score = 0;

    showQuestion();
  }

  restartBtn.addEventListener("click", startQuiz);

  startQuiz();
}

function destroy() {
  destroyAll();
}

export { init, destroy };
