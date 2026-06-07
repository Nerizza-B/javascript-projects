let _btn, _dob, _listeners = [];

function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function calculate(container) {
  const dob = new Date(container.querySelector('#age-dob').value);
  const resultEl = container.querySelector('#age-result');
  if (!container.querySelector('#age-dob').value) return;

  const today = new Date(); today.setHours(0,0,0,0); dob.setHours(0,0,0,0);
  if (dob > today) return;

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  container.querySelector('#age-years').textContent = years;
  container.querySelector('#age-months').textContent = months;
  container.querySelector('#age-days').textContent = days;

  const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (next <= today) next.setFullYear(today.getFullYear() + 1);
  const diff = Math.round((next - today) / 86400000);
  container.querySelector('#age-extra').textContent = diff === 0
    ? 'Happy Birthday!'
    : `Next birthday in ${diff} day${diff !== 1 ? 's' : ''}.`;

  resultEl.hidden = false;
}

export function init(container) {
  const dobEl = container.querySelector('#age-dob');
  dobEl.max = new Date().toISOString().slice(0, 10);
  on(container.querySelector('#age-calc'), 'click', () => calculate(container));
  on(dobEl, 'change', () => calculate(container));
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
