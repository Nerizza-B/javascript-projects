let _listeners = [];

function init(container) {
  const input      = container.querySelector('#jf-input');
  const output     = container.querySelector('#jf-output');
  const statusEl   = container.querySelector('#jf-status');
  const prettifyBtn= container.querySelector('#jf-prettify');
  const minifyBtn  = container.querySelector('#jf-minify');
  const copyBtn    = container.querySelector('#jf-copy');
  const clearBtn   = container.querySelector('#jf-clear');

  let copyTimer = null;

  function setStatus(msg, ok) {
    statusEl.textContent = msg;
    statusEl.className = 'jf-status ' + (ok ? 'ok' : 'err');
  }

  function parse() {
    try { return { ok: true, val: JSON.parse(input.value.trim()) }; }
    catch (e) { return { ok: false, err: e.message }; }
  }

  function prettify() {
    if (!input.value.trim()) return;
    const { ok, val, err } = parse();
    if (!ok) { setStatus('Error: ' + err, false); return; }
    output.textContent = JSON.stringify(val, null, 2);
    setStatus('Valid JSON — prettified.', true);
  }

  function minify() {
    if (!input.value.trim()) return;
    const { ok, val, err } = parse();
    if (!ok) { setStatus('Error: ' + err, false); return; }
    output.textContent = JSON.stringify(val);
    setStatus('Valid JSON — minified.', true);
  }

  async function copy() {
    const text = output.textContent;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard!', true);
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { statusEl.textContent = ''; }, 2000);
  }

  function clear() {
    input.value = '';
    output.textContent = '';
    statusEl.textContent = '';
    statusEl.className = 'jf-status';
  }

  const handlers = [
    { el: prettifyBtn, type: 'click', fn: prettify },
    { el: minifyBtn,   type: 'click', fn: minify },
    { el: copyBtn,     type: 'click', fn: copy },
    { el: clearBtn,    type: 'click', fn: clear },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
