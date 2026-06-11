let stops = [];

function buildGradient(type, angle) {
  const stopsStr = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
  if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`;
  if (type === 'radial') return `radial-gradient(circle, ${stopsStr})`;
  return `conic-gradient(from ${angle}deg, ${stopsStr})`;
}

function update(container) {
  const type = container.querySelector('#cgg-type').value;
  const angle = container.querySelector('#cgg-angle').value;
  const grad = buildGradient(type, angle);
  container.querySelector('#cgg-preview').style.background = grad;
  container.querySelector('#cgg-css').textContent = `background: ${grad};`;
}

function renderStops(container) {
  const el = container.querySelector('#cgg-stops');
  el.innerHTML = '';
  stops.forEach((stop, i) => {
    const row = document.createElement('div');
    row.className = 'cgg-stop-row';

    const colorIn = document.createElement('input');
    colorIn.type = 'color';
    colorIn.className = 'cgg-color-input';
    colorIn.value = stop.color;
    colorIn.addEventListener('input', () => { stops[i].color = colorIn.value; update(container); });

    const posIn = document.createElement('input');
    posIn.type = 'number';
    posIn.className = 'cgg-pos-input';
    posIn.min = 0; posIn.max = 100;
    posIn.value = stop.pos;
    posIn.addEventListener('input', () => {
      stops[i].pos = Math.max(0, Math.min(100, +posIn.value));
      update(container);
    });

    const pct = document.createElement('span');
    pct.textContent = '%';

    const rm = document.createElement('button');
    rm.className = 'cgg-remove-btn';
    rm.textContent = '✕';
    rm.title = 'Remove stop';
    rm.addEventListener('click', () => {
      if (stops.length > 2) { stops.splice(i, 1); renderStops(container); update(container); }
    });

    row.appendChild(colorIn);
    row.appendChild(posIn);
    row.appendChild(pct);
    row.appendChild(rm);
    el.appendChild(row);
  });
}

export function init(container) {
  stops = [
    { color: '#111111', pos: 0 },
    { color: '#ffffff', pos: 100 },
  ];

  renderStops(container);
  update(container);

  container.querySelector('#cgg-type').addEventListener('change', () => {
    const isLinOrConic = ['linear','conic'].includes(container.querySelector('#cgg-type').value);
    container.querySelector('#cgg-angle-row').style.display = isLinOrConic ? 'flex' : 'none';
    update(container);
  });

  container.querySelector('#cgg-angle').addEventListener('input', () => {
    container.querySelector('#cgg-angle-val').textContent =
      container.querySelector('#cgg-angle').value;
    update(container);
  });

  container.querySelector('#cgg-add').addEventListener('click', () => {
    if (stops.length < 6) {
      const lastPos = stops[stops.length - 1].pos;
      const newPos = Math.min(100, lastPos + Math.round((100 - lastPos) / 2));
      stops.push({ color: '#888888', pos: newPos });
      renderStops(container);
      update(container);
    }
  });

  container.querySelector('#cgg-copy').addEventListener('click', () => {
    const text = container.querySelector('#cgg-css').textContent;
    navigator.clipboard.writeText(text).catch(() => {});
  });
}

export function destroy() {
  stops = [];
}
