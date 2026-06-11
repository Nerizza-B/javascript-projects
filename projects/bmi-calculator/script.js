function getCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', pos: 5 };
  if (bmi < 25)   return { label: 'Normal weight', pos: 35 };
  if (bmi < 30)   return { label: 'Overweight', pos: 65 };
  return { label: 'Obese', pos: 90 };
}

function compute(container, unit) {
  let bmi;
  if (unit === 'metric') {
    const h = parseFloat(container.querySelector('#bmi-height-cm').value) / 100;
    const w = parseFloat(container.querySelector('#bmi-weight-kg').value);
    if (!h || !w || h <= 0 || w <= 0) return;
    bmi = w / (h * h);
  } else {
    const ft = parseFloat(container.querySelector('#bmi-height-ft').value) || 0;
    const inch = parseFloat(container.querySelector('#bmi-height-in').value) || 0;
    const lb = parseFloat(container.querySelector('#bmi-weight-lb').value);
    const totalIn = ft * 12 + inch;
    if (!totalIn || !lb) return;
    bmi = (lb / (totalIn * totalIn)) * 703;
  }

  const result = container.querySelector('#bmi-result');
  result.style.display = 'block';
  container.querySelector('#bmi-value').textContent = bmi.toFixed(1);
  const cat = getCategory(bmi);
  container.querySelector('#bmi-cat').textContent = cat.label;
  container.querySelector('#bmi-marker').style.left = cat.pos + '%';
}

export function init(container) {
  let unit = 'metric';

  container.querySelectorAll('.bmi-unit').forEach(btn => {
    btn.addEventListener('click', () => {
      unit = btn.dataset.unit;
      container.querySelectorAll('.bmi-unit').forEach(b => b.classList.toggle('active', b === btn));
      container.querySelector('#bmi-metric').style.display = unit === 'metric' ? 'flex' : 'none';
      container.querySelector('#bmi-imperial').style.display = unit === 'imperial' ? 'flex' : 'none';
      container.querySelector('#bmi-result').style.display = 'none';
    });
  });

  container.querySelector('#bmi-calc').addEventListener('click', () => compute(container, unit));
}

export function destroy() {}
