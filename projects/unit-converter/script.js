let _listeners = [];

const UNITS = {
  length: [
    { label: "Meter (m)", factor: 1 },
    { label: "Kilometer (km)", factor: 1000 },
    { label: "Centimeter (cm)", factor: 0.01 },
    { label: "Millimeter (mm)", factor: 0.001 },
    { label: "Mile (mi)", factor: 1609.34 },
    { label: "Yard (yd)", factor: 0.9144 },
    { label: "Foot (ft)", factor: 0.3048 },
    { label: "Inch (in)", factor: 0.0254 },
  ],
  weight: [
    { label: "Kilogram (kg)", factor: 1 },
    { label: "Gram (g)", factor: 0.001 },
    { label: "Milligram (mg)", factor: 0.000001 },
    { label: "Pound (lb)", factor: 0.453592 },
    { label: "Ounce (oz)", factor: 0.0283495 },
    { label: "Tonne (t)", factor: 1000 },
  ],
  volume: [
    { label: "Liter (L)", factor: 1 },
    { label: "Milliliter (mL)", factor: 0.001 },
    { label: "Cubic meter (m³)", factor: 1000 },
    { label: "Gallon (gal)", factor: 3.78541 },
    { label: "Quart (qt)", factor: 0.946353 },
    { label: "Pint (pt)", factor: 0.473176 },
    { label: "Cup", factor: 0.24 },
    { label: "Fluid oz (fl oz)", factor: 0.0295735 },
  ],
};

function populateSelect(sel, units, defaultIdx = 0) {
  sel.innerHTML = units
    .map(
      (u, i) =>
        `<option value="${i}" ${i === defaultIdx ? "selected" : ""}>${u.label}</option>`,
    )
    .join("");
}

function init(container) {
  const tabs = container.querySelectorAll(".uc-tab");
  const fromVal = container.querySelector("#uc-from-val");
  const toVal = container.querySelector("#uc-to-val");
  const fromSel = container.querySelector("#uc-from-unit");
  const toSel = container.querySelector("#uc-to-unit");

  let currentType = "length";

  function convert() {
    const units = UNITS[currentType];
    const from = units[parseInt(fromSel.value)].factor;
    const to = units[parseInt(toSel.value)].factor;
    const result = (parseFloat(fromVal.value) * from) / to;
    toVal.value = isNaN(result) ? "" : parseFloat(result.toFixed(8));
  }

  function switchType(type) {
    currentType = type;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.type === type));
    const units = UNITS[type];
    populateSelect(fromSel, units, 0);
    populateSelect(toSel, units, 1);
    fromVal.value = 1;
    convert();
  }

  function onTab(e) {
    const tab = e.target.closest("[data-type]");
    if (tab) switchType(tab.dataset.type);
  }

  const handlers = [
    { el: container.querySelector(".uc-tabs"), type: "click", fn: onTab },
    { el: fromVal, type: "input", fn: convert },
    { el: fromSel, type: "change", fn: convert },
    { el: toSel, type: "change", fn: convert },
  ];
  handlers.forEach(({ el, type, fn }) => el.addEventListener(type, fn));
  _listeners = handlers;
  switchType("length");
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
