const VALS = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
  [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I'],
];

function toRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let result = '';
  for (const [val, sym] of VALS) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(str) {
  const s = str.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(s)) return null;
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]], next = map[s[i+1]] || 0;
    total += cur < next ? -cur : cur;
  }
  const check = toRoman(total);
  if (check !== s) return null;
  return total;
}

export function init(container) {
  container.querySelector('#rn-to-roman').addEventListener('click', () => {
    const n = parseInt(container.querySelector('#rn-num').value, 10);
    const out = container.querySelector('#rn-roman-out');
    const result = toRoman(n);
    out.classList.toggle('error', !result);
    out.textContent = result || 'Enter a number between 1 and 3999';
  });

  container.querySelector('#rn-num').addEventListener('keydown', e => {
    if (e.key === 'Enter') container.querySelector('#rn-to-roman').click();
  });

  container.querySelector('#rn-to-num').addEventListener('click', () => {
    const s = container.querySelector('#rn-roman').value;
    const out = container.querySelector('#rn-num-out');
    const result = fromRoman(s);
    out.classList.toggle('error', result === null);
    out.textContent = result !== null ? result : 'Invalid Roman numeral';
  });

  container.querySelector('#rn-roman').addEventListener('keydown', e => {
    if (e.key === 'Enter') container.querySelector('#rn-to-num').click();
  });

  const ref = [
    [1,'I'],[4,'IV'],[5,'V'],[9,'IX'],[10,'X'],[40,'XL'],
    [50,'L'],[90,'XC'],[100,'C'],[400,'CD'],[500,'D'],[900,'CM'],[1000,'M'],
  ];
  const grid = container.querySelector('#rn-table');
  ref.forEach(([v, s]) => {
    const cell = document.createElement('div');
    cell.className = 'rn-cell';
    const sym = document.createElement('div');
    sym.className = 'sym';
    sym.textContent = s;
    const val = document.createElement('div');
    val.className = 'val';
    val.textContent = v;
    cell.appendChild(sym);
    cell.appendChild(val);
    grid.appendChild(cell);
  });
}

export function destroy() {}
