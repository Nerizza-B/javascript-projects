const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board, gameOver, scores, cells, statusEl, _listeners = [];

function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function winner(b) {
  for (const [a,bx,c] of WINS) if (b[a] && b[a] === b[bx] && b[a] === b[c]) return b[a];
  return b.includes('') ? null : 'draw';
}

function minimax(b, isMax) {
  const w = winner(b);
  if (w === 'O') return 10; if (w === 'X') return -10; if (w === 'draw') return 0;
  const scores = [];
  b.forEach((v, i) => {
    if (!v) { b[i] = isMax ? 'O' : 'X'; scores.push(minimax(b, !isMax)); b[i] = ''; }
  });
  return isMax ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(b) {
  let best = -Infinity, idx = -1;
  b.forEach((v, i) => {
    if (!v) { b[i] = 'O'; const s = minimax(b, false); b[i] = ''; if (s > best) { best = s; idx = i; } }
  });
  return idx;
}

function render(container) {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.dataset.mark = board[i];
    cell.disabled = !!board[i] || gameOver;
  });
}

function checkEnd(container) {
  const w = winner(board);
  if (!w) return false;
  gameOver = true;
  if (w === 'X') { scores.wins++; container.querySelector('#ttt-wins').textContent = scores.wins; statusEl.textContent = 'You win!'; }
  else if (w === 'O') { scores.losses++; container.querySelector('#ttt-losses').textContent = scores.losses; statusEl.textContent = 'CPU wins!'; }
  else { scores.draws++; container.querySelector('#ttt-draws').textContent = scores.draws; statusEl.textContent = 'Draw!'; }
  cells.forEach(c => c.disabled = true);
  return true;
}

function cpuTurn(container) {
  if (gameOver) return;
  const idx = bestMove(board);
  if (idx === -1) return;
  board[idx] = 'O';
  render(container);
  if (!checkEnd(container)) statusEl.textContent = 'Your turn (X)';
}

export function init(container) {
  board = Array(9).fill('');
  gameOver = false;
  scores = { wins: 0, draws: 0, losses: 0 };
  statusEl = container.querySelector('#ttt-status');
  cells = [...container.querySelectorAll('.ttt-cell')];

  cells.forEach(cell => on(cell, 'click', () => {
    const i = +cell.dataset.idx;
    if (board[i] || gameOver) return;
    board[i] = 'X';
    render(container);
    if (!checkEnd(container)) { statusEl.textContent = 'CPU thinking…'; setTimeout(() => cpuTurn(container), 300); }
  }));

  on(container.querySelector('#ttt-reset'), 'click', () => {
    board = Array(9).fill(''); gameOver = false;
    statusEl.textContent = 'Your turn (X)';
    render(container);
  });

  render(container);
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = []; board = null; cells = null; statusEl = null;
}
