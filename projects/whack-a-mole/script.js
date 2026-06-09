import { addInterval, addTimeout, destroyAll } from '../../core/teardown.js';

function init(container) {
  const scoreEl = container.querySelector('#wm-score');
  const timeEl  = container.querySelector('#wm-time');
  const bestEl  = container.querySelector('#wm-best');
  const startBtn= container.querySelector('#wm-start');
  const holes   = container.querySelectorAll('.wm-hole');

  let score = 0, best = 0, running = false, lastHole = -1;

  function randomHole() {
    let idx;
    do { idx = Math.floor(Math.random() * holes.length); } while (idx === lastHole);
    lastHole = idx;
    return holes[idx];
  }

  function showMole() {
    if (!running) return;
    const hole = randomHole();
    hole.classList.add('up');
    const delay = 600 + Math.random() * 600;
    const tid = setTimeout(() => {
      hole.classList.remove('up');
      showMole();
    }, delay);
    addTimeout(tid);
  }

  function whack(e) {
    const hole = e.target.closest('.wm-hole.up');
    if (!hole || !running) return;
    hole.classList.remove('up');
    hole.classList.add('whacked');
    score++;
    scoreEl.textContent = score;
    const tid = setTimeout(() => hole.classList.remove('whacked'), 300);
    addTimeout(tid);
  }

  function startGame() {
    destroyAll();
    score = 0;
    scoreEl.textContent = '0';
    timeEl.textContent = '30';
    holes.forEach(h => h.classList.remove('up', 'whacked'));
    running = true;
    startBtn.textContent = 'Restart';
    showMole();

    let secs = 30;
    const id = setInterval(() => {
      secs--;
      timeEl.textContent = secs;
      if (secs <= 0) {
        clearInterval(id);
        running = false;
        holes.forEach(h => h.classList.remove('up'));
        if (score > best) { best = score; bestEl.textContent = best; }
      }
    }, 1000);
    addInterval(id);
  }

  container.querySelector('.wm-grid').addEventListener('click', whack);
  startBtn.addEventListener('click', startGame);
}

function destroy() {
  destroyAll();
}

export { init, destroy };
