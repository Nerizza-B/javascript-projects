let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function calculate(container) {
  const bill = parseFloat(container.querySelector('#tip-bill').value) || 0;
  const pct  = parseFloat(container.querySelector('#tip-pct').value)  || 0;
  const ppl  = Math.max(1, parseInt(container.querySelector('#tip-people').value) || 1);
  const tip   = bill * pct / 100;
  const total = bill + tip;
  container.querySelector('#tip-tip').textContent   = '$' + tip.toFixed(2);
  container.querySelector('#tip-total').textContent = '$' + total.toFixed(2);
  container.querySelector('#tip-per').textContent   = '$' + (total / ppl).toFixed(2);
}

export function init(container) {
  const pctInput = container.querySelector('#tip-pct');
  const presets  = [...container.querySelectorAll('.tip-preset')];

  ['#tip-bill', '#tip-pct', '#tip-people'].forEach(sel => {
    on(container.querySelector(sel), 'input', () => calculate(container));
  });

  presets.forEach(btn => on(btn, 'click', () => {
    presets.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pctInput.value = btn.dataset.pct;
    calculate(container);
  }));

  calculate(container);
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
