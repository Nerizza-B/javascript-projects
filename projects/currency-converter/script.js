const RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 153.2, CAD: 1.37, AUD: 1.54,
  CHF: 0.90, CNY: 7.24, INR: 83.5, MXN: 17.2, BRL: 5.05, KRW: 1340,
  SGD: 1.35, HKD: 7.82, SEK: 10.5, NOK: 10.8, NZD: 1.64, ZAR: 18.6,
  AED: 3.67, THB: 35.8,
};
const NAMES = {
  USD:'US Dollar', EUR:'Euro', GBP:'British Pound', JPY:'Japanese Yen',
  CAD:'Canadian Dollar', AUD:'Australian Dollar', CHF:'Swiss Franc',
  CNY:'Chinese Yuan', INR:'Indian Rupee', MXN:'Mexican Peso',
  BRL:'Brazilian Real', KRW:'South Korean Won', SGD:'Singapore Dollar',
  HKD:'Hong Kong Dollar', SEK:'Swedish Krona', NOK:'Norwegian Krone',
  NZD:'New Zealand Dollar', ZAR:'South African Rand', AED:'UAE Dirham', THB:'Thai Baht',
};

function convert(amount, from, to) {
  return (amount / RATES[from]) * RATES[to];
}

function update(container) {
  const amount = parseFloat(container.querySelector('#cc-amount').value) || 0;
  const from = container.querySelector('#cc-from').value;
  const to = container.querySelector('#cc-to').value;
  const result = convert(amount, from, to);
  container.querySelector('#cc-result').value = result.toFixed(4);
  const rate = convert(1, from, to);
  container.querySelector('#cc-rate').textContent =
    `1 ${from} = ${rate.toFixed(4)} ${to}`;

  const grid = container.querySelector('#cc-grid');
  grid.innerHTML = '';
  const popular = ['USD','EUR','GBP','JPY','CAD','AUD','CHF','CNY','INR','MXN'];
  popular.filter(c => c !== from).slice(0, 8).forEach(c => {
    const val = convert(amount, from, c);
    const div = document.createElement('div');
    div.className = 'cc-grid-item';
    const nameEl = document.createElement('div');
    nameEl.className = 'cc-cname';
    nameEl.textContent = `${c} — ${NAMES[c]}`;
    const valEl = document.createElement('div');
    valEl.className = 'cc-cval';
    valEl.textContent = val.toFixed(2);
    div.appendChild(nameEl);
    div.appendChild(valEl);
    grid.appendChild(div);
  });
}

export function init(container) {
  const fromSel = container.querySelector('#cc-from');
  const toSel = container.querySelector('#cc-to');

  Object.keys(RATES).forEach(c => {
    [fromSel, toSel].forEach(sel => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `${c} — ${NAMES[c]}`;
      sel.appendChild(opt);
    });
  });

  fromSel.value = 'USD';
  toSel.value = 'EUR';

  container.querySelector('#cc-amount').addEventListener('input', () => update(container));
  fromSel.addEventListener('change', () => update(container));
  toSel.addEventListener('change', () => update(container));

  container.querySelector('#cc-swap').addEventListener('click', () => {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    update(container);
  });

  update(container);
}

export function destroy() {}
