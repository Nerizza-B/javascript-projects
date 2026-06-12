let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function run(container) {
  const pattern     = container.querySelector('#rx-pattern').value;
  const flags       = container.querySelector('#rx-flags').value.replace(/[^gimsuy]/g, '');
  const testStr     = container.querySelector('#rx-test').value;
  const errorEl     = container.querySelector('#rx-error');
  const statsEl     = container.querySelector('#rx-stats');
  const matchesEl   = container.querySelector('#rx-matches');
  const highlightEl = container.querySelector('#rx-highlighted');

  errorEl.textContent = '';
  matchesEl.innerHTML = '';
  highlightEl.innerHTML = '';

  if (!pattern) {
    statsEl.textContent = 'Enter a pattern above.';
    highlightEl.textContent = testStr;
    return;
  }

  let re;
  try {
    re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
  } catch (e) {
    errorEl.textContent = e.message;
    statsEl.textContent = 'Invalid pattern.';
    highlightEl.textContent = testStr;
    return;
  }

  const matches = [...testStr.matchAll(re)];
  statsEl.textContent = matches.length === 0 ? 'No matches' : `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;

  // Build highlighted text
  let lastIdx = 0;
  let hlHtml  = '';
  for (const m of matches) {
    hlHtml += escHtml(testStr.slice(lastIdx, m.index));
    hlHtml += `<mark class="rx-mark">${escHtml(m[0])}</mark>`;
    lastIdx  = m.index + m[0].length;
    if (m[0].length === 0) lastIdx++; // avoid infinite loop on zero-width match
  }
  hlHtml += escHtml(testStr.slice(lastIdx));
  highlightEl.innerHTML = hlHtml;

  // List individual matches
  matches.slice(0, 50).forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'rx-match-row';
    const idx  = document.createElement('span');
    idx.className = 'rx-match-idx';
    idx.textContent = `#${i + 1}`;
    const val  = document.createElement('span');
    val.className = 'rx-match-val';
    val.textContent = m[0] || '(empty)';
    const pos  = document.createElement('span');
    pos.className = 'rx-match-pos';
    pos.textContent = `@ ${m.index}`;
    row.append(idx, val, pos);
    matchesEl.appendChild(row);
  });
  if (matches.length > 50) {
    const more = document.createElement('p');
    more.className = 'rx-more';
    more.textContent = `…and ${matches.length - 50} more`;
    matchesEl.appendChild(more);
  }
}

export function init(container) {
  on(container.querySelector('#rx-pattern'), 'input', () => run(container));
  on(container.querySelector('#rx-flags'),   'input', () => run(container));
  on(container.querySelector('#rx-test'),    'input', () => run(container));
  run(container);
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
