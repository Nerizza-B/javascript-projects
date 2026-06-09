import { addInterval, destroyAll } from '../../core/teardown.js';

const PASSAGES = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
  'To be or not to be that is the question whether tis nobler in the mind to suffer.',
  'All that glitters is not gold often have you heard that told many a man his life hath sold.',
  'It was the best of times it was the worst of times it was the age of wisdom and foolishness.',
  'In the beginning God created the heavens and the earth and the earth was without form and void.',
];

function init(container) {
  const passageEl  = container.querySelector('#ts-passage');
  const inputEl    = container.querySelector('#ts-input');
  const wpmEl      = container.querySelector('#ts-wpm');
  const accEl      = container.querySelector('#ts-acc');
  const timeEl     = container.querySelector('#ts-time');
  const restartBtn = container.querySelector('#ts-restart');

  let words, typed, started, seconds, timerID;

  function render() {
    const typedWords = typed.split(' ');
    passageEl.innerHTML = words.map((word, wi) => {
      const typedWord = typedWords[wi] ?? '';
      const isCurrent = wi === typedWords.length - 1;
      const chars = word.split('').map((ch, ci) => {
        const tc = typedWord[ci];
        if (tc === undefined) {
          const cls = isCurrent && ci === typedWord.length ? 'cursor' : '';
          return `<span class="${cls}">${ch}</span>`;
        }
        return `<span class="${tc === ch ? 'correct' : 'wrong'}">${ch}</span>`;
      }).join('');
      return `<span>${chars}</span>`;
    }).join(' ');
  }

  function calcStats() {
    const typedWords = typed.trim().split(/\s+/).filter(Boolean);
    const elapsed = Math.max(seconds, 1);
    let correct = 0, total = 0;
    typedWords.forEach((tw, i) => {
      const ref = words[i] ?? '';
      for (let j = 0; j < Math.max(tw.length, ref.length); j++) {
        total++;
        if (tw[j] === ref[j]) correct++;
      }
    });
    wpmEl.textContent = Math.round((typedWords.length / elapsed) * 60);
    accEl.textContent = total ? Math.round((correct / total) * 100) : 100;
  }

  function newGame() {
    clearInterval(timerID);
    const passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
    words   = passage.split(' ');
    typed   = '';
    started = false;
    seconds = 60;
    wpmEl.textContent = '0';
    accEl.textContent = '100';
    timeEl.textContent = '60';
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.focus();
    render();
  }

  function onInput() {
    if (!started) {
      started = true;
      timerID = setInterval(() => {
        seconds--;
        timeEl.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(timerID);
          inputEl.disabled = true;
        }
      }, 1000);
      addInterval(timerID);
    }
    typed = inputEl.value;
    calcStats();
    render();

    const typedWords = typed.split(' ');
    if (typedWords.length > words.length) {
      inputEl.disabled = true;
      clearInterval(timerID);
    }
  }

  const handlers = [
    { el: inputEl,    type: 'input', fn: onInput },
    { el: restartBtn, type: 'click', fn: newGame },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  newGame();
}

function destroy() {
  destroyAll();
}

export { init, destroy };
