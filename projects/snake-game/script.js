import { addInterval, addListener, destroyAll } from '../../core/teardown.js';

const GRID = 20, SIZE = 400 / GRID;

const DIRS = {
  up:    { x: 0, y: -1 }, down:  { x: 0, y: 1 },
  left:  { x: -1, y: 0 }, right: { x: 1, y: 0 },
};
const KEY_MAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
};
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

function init(container) {
  const canvas  = container.querySelector('#sn-canvas');
  const ctx     = canvas.getContext('2d');
  const scoreEl = container.querySelector('#sn-score');
  const bestEl  = container.querySelector('#sn-best');
  const msgEl   = container.querySelector('#sn-msg');
  const dpad    = container.querySelector('.sn-dpad');

  let snake, dir, next, food, score, best = 0, running = false, dirName = 'right';

  function randFood() {
    let pos;
    do { pos = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) }; }
    while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  function draw() {
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, 400, 400);

    // Grid dots
    ctx.fillStyle = '#1a1d2755';
    for (let x = 0; x < GRID; x++)
      for (let y = 0; y < GRID; y++)
        ctx.fillRect(x*SIZE+SIZE/2-1, y*SIZE+SIZE/2-1, 2, 2);

    if (!food || !snake) return;

    // Food
    ctx.font = `${SIZE-4}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍎', food.x*SIZE+SIZE/2, food.y*SIZE+SIZE/2);

    // Snake
    snake.forEach((seg, i) => {
      const t = i / snake.length;
      ctx.fillStyle = `hsl(${140 - t*40}, 70%, ${50 + t*15}%)`;
      ctx.beginPath();
      ctx.roundRect(seg.x*SIZE+1, seg.y*SIZE+1, SIZE-2, SIZE-2, 4);
      ctx.fill();
    });
  }

  function step() {
    dir = next; dirName = Object.keys(DIRS).find(k => DIRS[k] === dir);
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      running = false;
      if (score > best) { best = score; bestEl.textContent = best; }
      msgEl.textContent = `Game over! Score: ${score}. Press an arrow key to restart.`;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++; scoreEl.textContent = score;
      food = randFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function startGame() {
    snake   = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir     = DIRS.right; dirName = 'right';
    next    = DIRS.right;
    score   = 0;
    scoreEl.textContent = '0';
    food    = randFood();
    running = true;
    msgEl.textContent = '';
    destroyAll();
    draw();
    const id = setInterval(() => { if (running) step(); }, 120);
    addInterval(id);
    reattach();
  }

  function changeDir(d) {
    if (!running) { startGame(); return; }
    if (OPPOSITE[d] !== dirName) next = DIRS[d];
  }

  function onKey(e) {
    const d = KEY_MAP[e.key];
    if (!d) return;
    e.preventDefault();
    changeDir(d);
  }

  function onDpad(e) {
    const btn = e.target.closest('[data-dir]');
    if (btn) changeDir(btn.dataset.dir);
  }

  function reattach() {
    addListener(document, 'keydown', onKey);
    addListener(dpad, 'click', onDpad);
  }

  draw();
  reattach();
}

function destroy() {
  destroyAll();
}

export { init, destroy };
