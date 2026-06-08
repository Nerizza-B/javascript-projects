let _listeners = [];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      default: h = ((r-g)/d + 4)/6;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

function init(container) {
  const picker   = container.querySelector('#cp-input');
  const preview  = container.querySelector('#cp-preview');
  const hexEl    = container.querySelector('#cp-hex');
  const rgbEl    = container.querySelector('#cp-rgb');
  const hslEl    = container.querySelector('#cp-hsl');
  const copiedEl = container.querySelector('#cp-copied');
  const copyBtns = container.querySelectorAll('.cp-copy');

  let copyTimer = null;

  function update() {
    const hex = picker.value;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    hexEl.textContent = hex;
    rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
    hslEl.textContent = `hsl(${h}, ${s}%, ${l}%)`;
    preview.style.background = hex;
    preview.style.boxShadow = `0 0 40px ${hex}66`;
  }

  async function onCopy(e) {
    const btn = e.target.closest('[data-target]');
    if (!btn) return;
    const text = container.querySelector('#' + btn.dataset.target).textContent;
    await navigator.clipboard.writeText(text);
    copiedEl.textContent = `Copied: ${text}`;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copiedEl.textContent = ''; }, 2000);
  }

  const handlers = [
    { el: picker, type: 'input', fn: update },
    { el: container.querySelector('.cp-values'), type: 'click', fn: onCopy },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
  update();
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
