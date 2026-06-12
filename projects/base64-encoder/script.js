let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function setStatus(statusEl, msg, error = false) {
  statusEl.textContent = msg;
  statusEl.dataset.error = error ? '1' : '';
}

export function init(container) {
  const inputEl  = container.querySelector('#b64-input');
  const outputEl = container.querySelector('#b64-output');
  const statusEl = container.querySelector('#b64-status');

  on(container.querySelector('#b64-encode'), 'click', () => {
    try {
      outputEl.value = btoa(unescape(encodeURIComponent(inputEl.value)));
      setStatus(statusEl, 'Encoded successfully.');
    } catch {
      setStatus(statusEl, 'Encoding failed — check your input.', true);
    }
  });

  on(container.querySelector('#b64-decode'), 'click', () => {
    try {
      outputEl.value = decodeURIComponent(escape(atob(inputEl.value.trim())));
      setStatus(statusEl, 'Decoded successfully.');
    } catch {
      setStatus(statusEl, 'Invalid Base64 — could not decode.', true);
    }
  });

  on(container.querySelector('#b64-swap'), 'click', () => {
    const tmp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = tmp;
    setStatus(statusEl, 'Swapped.');
  });

  on(container.querySelector('#b64-copy'), 'click', () => {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value)
      .then(() => setStatus(statusEl, 'Copied to clipboard!'))
      .catch(() => setStatus(statusEl, 'Copy failed.', true));
  });
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
