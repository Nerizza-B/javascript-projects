const CODE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..',
  J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.',
  S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--',
  '-':'-....-','/':'-..-.','(':'-.--.',')'  :'-.--.-',
  '&':'.-...','@':'.--.-.','=':'-...-',
};
const DECODE = Object.fromEntries(Object.entries(CODE).map(([k,v]) => [v,k]));

let audioCtx = null;
let playing = false;
let playTimeout = null;

function encode(text) {
  return text.toUpperCase().split('').map(ch => {
    if (ch === ' ') return '/';
    return CODE[ch] || '';
  }).filter(s => s !== '').join(' ');
}

function decode(morse) {
  return morse.trim().split(' / ').map(word =>
    word.split(' ').map(code => DECODE[code] || '?').join('')
  ).join(' ');
}

function beep(freq, dur) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + dur);
}

async function playMorse(morseStr) {
  if (playing) return;
  playing = true;
  const unit = 80;
  let i = 0;
  const symbols = morseStr.split('');

  const step = () => {
    if (!playing || i >= symbols.length) { playing = false; return; }
    const ch = symbols[i++];
    if (ch === '.') { beep(650, unit / 1000 * 0.9); playTimeout = setTimeout(step, unit * 1.5); }
    else if (ch === '-') { beep(650, unit * 3 / 1000 * 0.9); playTimeout = setTimeout(step, unit * 3.5); }
    else if (ch === ' ') { playTimeout = setTimeout(step, unit * 2); }
    else if (ch === '/') { playTimeout = setTimeout(step, unit * 5); }
    else step();
  };
  step();
}

export function init(container) {
  let dir = 'encode';

  const tabs = container.querySelectorAll('.morse-tab');
  const encPanel = container.querySelector('#morse-encode-panel');
  const decPanel = container.querySelector('#morse-decode-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dir = tab.dataset.dir;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      encPanel.style.display = dir === 'encode' ? 'flex' : 'none';
      decPanel.style.display = dir === 'decode' ? 'flex' : 'none';
    });
  });

  const textInput = container.querySelector('#morse-text-input');
  const codeOut = container.querySelector('#morse-code-output');
  textInput.addEventListener('input', () => {
    codeOut.textContent = encode(textInput.value);
  });

  const codeInput = container.querySelector('#morse-code-input');
  const textOut = container.querySelector('#morse-text-output');
  codeInput.addEventListener('input', () => {
    textOut.textContent = decode(codeInput.value);
  });

  container.querySelector('#morse-copy-enc').addEventListener('click', () => {
    navigator.clipboard.writeText(codeOut.textContent).catch(() => {});
  });
  container.querySelector('#morse-copy-dec').addEventListener('click', () => {
    navigator.clipboard.writeText(textOut.textContent).catch(() => {});
  });

  container.querySelector('#morse-play').addEventListener('click', () => {
    if (codeOut.textContent) playMorse(codeOut.textContent);
  });
}

export function destroy() {
  playing = false;
  if (playTimeout) clearTimeout(playTimeout);
  playTimeout = null;
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}
