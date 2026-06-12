let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function words(s) {
  return s.trim().replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/).filter(Boolean);
}

const converters = {
  lower:    s => s.toLowerCase(),
  upper:    s => s.toUpperCase(),
  title:    s => words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' '),
  sentence: s => { const t = s.toLowerCase(); return t ? t[0].toUpperCase() + t.slice(1) : ''; },
  camel:    s => { const ws = words(s); return ws[0].toLowerCase() + ws.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''); },
  pascal:   s => words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
  snake:    s => words(s).map(w => w.toLowerCase()).join('_'),
  kebab:    s => words(s).map(w => w.toLowerCase()).join('-'),
  constant: s => words(s).map(w => w.toUpperCase()).join('_'),
};

const labels = {
  lower: 'lowercase', upper: 'UPPERCASE', title: 'Title Case', sentence: 'Sentence case',
  camel: 'camelCase', pascal: 'PascalCase', snake: 'snake_case', kebab: 'kebab-case', constant: 'CONSTANT_CASE',
};

export function init(container) {
  const inputEl      = container.querySelector('#tcc-input');
  const outputEl     = container.querySelector('#tcc-output');
  const activeCaseEl = container.querySelector('#tcc-active-case');

  container.querySelectorAll('.tcc-btn').forEach(btn => {
    on(btn, 'click', () => {
      const type = btn.dataset.case;
      outputEl.value = converters[type](inputEl.value);
      activeCaseEl.textContent = '— ' + labels[type];
      container.querySelectorAll('.tcc-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  on(container.querySelector('#tcc-copy'), 'click', () => {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value);
  });
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
