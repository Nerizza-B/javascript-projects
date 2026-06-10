import { addInterval, destroyAll } from '../../core/teardown.js';

function fmt(ms) {
  const m  = Math.floor(ms / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
}

function init(container) {
  const display  = container.querySelector('#sw-display');
  const startBtn = container.querySelector('#sw-start');
  const lapBtn   = container.querySelector('#sw-lap');
  const resetBtn = container.querySelector('#sw-reset');
  const lapsList = container.querySelector('#sw-laps');

  let running = false, startTime = 0, elapsed = 0, lapCount = 0, lapStart = 0;

  function render(ms) { display.textContent = fmt(ms); }

  function start() {
    running = true;
    startTime = Date.now() - elapsed;
    lapStart  = lapStart || startTime;
    startBtn.textContent = 'Stop';
    startBtn.classList.add('running');
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    const id = setInterval(() => {
      elapsed = Date.now() - startTime;
      render(elapsed);
    }, 30);
    addInterval(id);
  }

  function stop() {
    running = false;
    destroyAll();
    elapsed = Date.now() - startTime;
    render(elapsed);
    startBtn.textContent = 'Resume';
    startBtn.classList.remove('running');
    lapBtn.disabled = true;
  }

  function lap() {
    if (!running) return;
    const now = Date.now();
    lapCount++;
    const lapTime = now - lapStart;
    lapStart = now;
    const li = document.createElement('li');
    li.innerHTML = `Lap ${lapCount} <span>${fmt(lapTime)}</span>`;
    lapsList.prepend(li);
  }

  function reset() {
    destroyAll();
    running = false; elapsed = 0; lapCount = 0; lapStart = 0;
    render(0);
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    lapsList.innerHTML = '';
  }

  function onStart() { running ? stop() : start(); }

  startBtn.addEventListener('click', onStart);
  lapBtn.addEventListener('click', lap);
  resetBtn.addEventListener('click', reset);
}

function destroy() { destroyAll(); }

export { init, destroy };
