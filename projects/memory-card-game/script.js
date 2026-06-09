import { addInterval, destroyAll } from '../../core/teardown.js';

const EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function init(container) {
  const grid      = container.querySelector('#mc-grid');
  const movesEl   = container.querySelector('#mc-moves');
  const timeEl    = container.querySelector('#mc-time');
  const pairsEl   = container.querySelector('#mc-pairs');
  const restartBtn= container.querySelector('#mc-restart');

  let flipped = [], matched = 0, moves = 0, seconds = 0, lock = false, timerID = null;

  function startTimer() {
    clearInterval(timerID);
    seconds = 0;
    timerID = setInterval(() => { seconds++; timeEl.textContent = seconds + 's'; }, 1000);
    addInterval(timerID);
  }

  function buildGrid() {
    const cards = shuffle([...EMOJIS, ...EMOJIS]);
    grid.innerHTML = cards.map((emoji, i) => `
      <div class="mc-card" data-index="${i}" data-emoji="${emoji}">
        <div class="mc-front">?</div>
        <div class="mc-back">${emoji}</div>
      </div>`).join('');
  }

  function newGame() {
    flipped = []; matched = 0; moves = 0; lock = false;
    movesEl.textContent = '0';
    timeEl.textContent  = '0s';
    pairsEl.textContent = '0';
    buildGrid();
    startTimer();
  }

  function onCardClick(e) {
    const card = e.target.closest('.mc-card');
    if (!card || lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length < 2) return;

    lock = true;
    moves++;
    movesEl.textContent = moves;

    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched');
      b.classList.add('matched');
      matched++;
      pairsEl.textContent = matched;
      flipped = [];
      lock = false;
      if (matched === 8) clearInterval(timerID);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
        lock = false;
      }, 900);
    }
  }

  grid.addEventListener('click', onCardClick);
  restartBtn.addEventListener('click', newGame);
  newGame();
}

function destroy() {
  destroyAll();
}

export { init, destroy };
