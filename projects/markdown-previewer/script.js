let _listeners = [];
function on(el, evt, fn) { el.addEventListener(evt, fn); _listeners.push([el, evt, fn]); }

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function inline(s) {
  // code spans first so inner content is not further processed
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`);
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
  s = s.replace(/_(.+?)_/g, '<em>$1</em>');
  s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const safeSrc = /^(https?:|\/|\.\/)/.test(src) ? src : '#';
    return `<img src="${esc(safeSrc)}" alt="${esc(alt)}" style="max-width:100%">`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
    const safeHref = /^(https?:|mailto:|\/|#|\.\/)/.test(href) ? href : '#';
    return `<a href="${esc(safeHref)}" target="_blank" rel="noopener">${text}</a>`;
  });
  return s;
}

function parse(md) {
  const lines = md.split('\n');
  let html = '', inFence = false, fenceLines = [], inList = false, listTag = '';

  function closeList() {
    if (inList) { html += `</${listTag}>`; inList = false; listTag = ''; }
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (!inFence) { closeList(); inFence = true; fenceLines = []; continue; }
      html += `<pre><code>${esc(fenceLines.join('\n'))}</code></pre>`;
      inFence = false; fenceLines = []; continue;
    }
    if (inFence) { fenceLines.push(line); continue; }

    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) { closeList(); html += `<h${hm[1].length}>${inline(esc(hm[2]))}</h${hm[1].length}>`; continue; }

    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) { closeList(); html += '<hr>'; continue; }

    if (line.startsWith('> ')) { closeList(); html += `<blockquote>${inline(esc(line.slice(2)))}</blockquote>`; continue; }

    const ul = line.match(/^[-*+]\s+(.*)/);
    if (ul) {
      if (!inList || listTag !== 'ul') { closeList(); html += '<ul>'; inList = true; listTag = 'ul'; }
      html += `<li>${inline(esc(ul[1]))}</li>`; continue;
    }
    const ol = line.match(/^\d+\.\s+(.*)/);
    if (ol) {
      if (!inList || listTag !== 'ol') { closeList(); html += '<ol>'; inList = true; listTag = 'ol'; }
      html += `<li>${inline(esc(ol[1]))}</li>`; continue;
    }

    closeList();
    if (line.trim() === '') { html += '<br>'; continue; }
    html += `<p>${inline(esc(line))}</p>`;
  }
  if (inFence) html += `<pre><code>${esc(fenceLines.join('\n'))}</code></pre>`;
  closeList();
  return html;
}

export function init(container) {
  const inputEl   = container.querySelector('#mp-input');
  const previewEl = container.querySelector('#mp-preview');
  const render = () => { previewEl.innerHTML = parse(inputEl.value); };
  on(inputEl, 'input', render);
  render();
}

export function destroy() {
  _listeners.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  _listeners = [];
}
