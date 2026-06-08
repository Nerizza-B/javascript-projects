let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function fmt(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function calculate(container) {
  const P = parseFloat(container.querySelector('#loan-principal').value) || 0;
  const r = (parseFloat(container.querySelector('#loan-rate').value) || 0) / 100 / 12;
  const n = (parseInt(container.querySelector('#loan-term').value) || 0) * 12;

  let monthly = 0;
  if (r === 0) {
    monthly = n > 0 ? P / n : 0;
  } else {
    monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  const total    = monthly * n;
  const interest = total - P;

  container.querySelector('#loan-monthly').textContent  = fmt(monthly);
  container.querySelector('#loan-total').textContent    = fmt(total);
  container.querySelector('#loan-interest').textContent = fmt(Math.max(0, interest));
}

export function init(container) {
  ['#loan-principal', '#loan-rate', '#loan-term'].forEach(sel => {
    on(container.querySelector(sel), 'input', () => calculate(container));
  });
  calculate(container);
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
