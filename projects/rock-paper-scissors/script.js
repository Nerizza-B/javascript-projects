let _listeners = [];

const MOVES  = ['rock', 'paper', 'scissors'];
const EMOJI  = { rock: '🪨', paper: '📄', scissors: '✂️' };
const BEATS  = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

function init(container) {
  const playerHand = container.querySelector('#rps-player-hand');
  const cpuHand    = container.querySelector('#rps-cpu-hand');
  const resultEl   = container.querySelector('#rps-result');
  const winEl      = container.querySelector('#rps-win');
  const drawEl     = container.querySelector('#rps-draw');
  const lossEl     = container.querySelector('#rps-loss');
  const resetBtn   = container.querySelector('#rps-reset');
  const choices    = container.querySelector('.rps-choices');

  let wins = 0, draws = 0, losses = 0;

  function play(e) {
    const btn = e.target.closest('[data-move]');
    if (!btn) return;
    const player = btn.dataset.move;
    const cpu    = MOVES[Math.floor(Math.random() * 3)];

    playerHand.textContent = EMOJI[player];
    cpuHand.textContent    = EMOJI[cpu];

    if (player === cpu) {
      draws++;
      drawEl.textContent = draws;
      resultEl.textContent = "It's a tie!";
      resultEl.style.color = '#eab308';
    } else if (BEATS[player] === cpu) {
      wins++;
      winEl.textContent = wins;
      resultEl.textContent = 'You win! 🎉';
      resultEl.style.color = '#4ade80';
    } else {
      losses++;
      lossEl.textContent = losses;
      resultEl.textContent = 'CPU wins!';
      resultEl.style.color = '#f472b6';
    }
  }

  function reset() {
    wins = draws = losses = 0;
    winEl.textContent = drawEl.textContent = lossEl.textContent = '0';
    playerHand.textContent = '🤜';
    cpuHand.textContent = '🤛';
    resultEl.textContent = 'Choose your move!';
    resultEl.style.color = '';
  }

  const handlers = [
    { el: choices,  type: 'click', fn: play },
    { el: resetBtn, type: 'click', fn: reset },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
