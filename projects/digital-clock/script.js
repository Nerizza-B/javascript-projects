import { addInterval, addListener, destroyAll } from '../../core/teardown.js';

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function pad(n) { return String(n).padStart(2, '0'); }

function init(container) {
  const timeEl   = container.querySelector('#dc-time');
  const ampmEl   = container.querySelector('#dc-ampm');
  const dateEl   = container.querySelector('#dc-date');
  const toggleBtn= container.querySelector('#dc-toggle');

  let use24 = false;

  function tick() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    dateEl.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    if (use24) {
      timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
      ampmEl.textContent = '';
    } else {
      const h12 = h % 12 || 12;
      timeEl.textContent = `${pad(h12)}:${pad(m)}:${pad(s)}`;
      ampmEl.textContent = h < 12 ? 'AM' : 'PM';
    }
  }

  tick();
  const id = setInterval(tick, 1000);
  addInterval(id);
  addListener(toggleBtn, 'click', () => { use24 = !use24; tick(); });
}

function destroy() { destroyAll(); }

export { init, destroy };
