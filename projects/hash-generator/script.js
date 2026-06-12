let _listeners = [];

async function computeHash(text, algo) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function init(container) {
  const inputEl  = container.querySelector('#hg-input');
  const resultEl = container.querySelector('#hg-result');
  const statusEl = container.querySelector('#hg-status');
  const copyBtn  = container.querySelector('#hg-copy');
  const tabs     = container.querySelectorAll('.hg-tab');
  let algo = 'SHA-256';

  async function update() {
    const text = inputEl.value;
    if (!text) { resultEl.value = ''; return; }
    resultEl.value = 'Computing…';
    resultEl.value = await computeHash(text, algo);
  }

  function onTab(e) {
    const btn = e.target.closest('.hg-tab');
    if (!btn) return;
    algo = btn.dataset.algo;
    tabs.forEach(t => t.classList.toggle('active', t === btn));
    update();
  }

  function onCopy() {
    if (!resultEl.value) return;
    navigator.clipboard.writeText(resultEl.value).then(() => {
      statusEl.textContent = 'Copied!';
      setTimeout(() => { statusEl.textContent = ''; }, 1500);
    });
  }

  const handlers = [
    { el: inputEl,                              type: 'input',  fn: update },
    { el: container.querySelector('.hg-tabs'),  type: 'click',  fn: onTab },
    { el: copyBtn,                              type: 'click',  fn: onCopy },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
