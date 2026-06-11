function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyze(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length || 1;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const ease = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllableCount / wordCount);
  const grade = 0.39 * (wordCount / sentences) + 11.8 * (syllableCount / wordCount) - 15.59;

  return {
    ease: Math.max(0, Math.min(100, ease)),
    grade: Math.max(0, grade),
    words: wordCount,
    sentences,
  };
}

function levelLabel(ease) {
  if (ease >= 90) return 'Very Easy — 5th grade';
  if (ease >= 80) return 'Easy — 6th grade';
  if (ease >= 70) return 'Fairly Easy — 7th grade';
  if (ease >= 60) return 'Standard — 8th–9th grade';
  if (ease >= 50) return 'Fairly Difficult — 10th–12th grade';
  if (ease >= 30) return 'Difficult — College level';
  return 'Very Confusing — Professional';
}

let debounceTimer = null;

export function init(container) {
  const textarea = container.querySelector('#rs-text');
  const results = container.querySelector('#rs-results');

  textarea.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const text = textarea.value.trim();
      if (text.length < 20) {
        container.querySelector('#rs-ease').textContent = '—';
        container.querySelector('#rs-grade').textContent = '—';
        container.querySelector('#rs-words').textContent = '—';
        container.querySelector('#rs-sentences').textContent = '—';
        container.querySelector('#rs-level-label').textContent = 'Keep typing…';
        container.querySelector('#rs-level-fill').style.width = '0%';
        return;
      }
      const { ease, grade, words, sentences } = analyze(text);
      container.querySelector('#rs-ease').textContent = ease.toFixed(1);
      container.querySelector('#rs-grade').textContent = grade.toFixed(1);
      container.querySelector('#rs-words').textContent = words;
      container.querySelector('#rs-sentences').textContent = sentences;
      container.querySelector('#rs-level-label').textContent = levelLabel(ease);
      container.querySelector('#rs-level-fill').style.width = ease.toFixed(1) + '%';
    }, 300);
  });
}

export function destroy() {
  clearTimeout(debounceTimer);
  debounceTimer = null;
}
