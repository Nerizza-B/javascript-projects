//Store all event listeners so they can be removed when the project is closed
let _listeners = [];

const TEMPERATURE_HINTS = [
  [-273.15, "Absolute zero — the coldest possible temperature"],
  [0, "Water freezes at 0 °C"],
  [20, "Room temperature ~20 °C"],
  [37, "Human body temperature ~37 °C"],
  [100, "Water boils at 100 °C"],
];

//Returns a hint for the given Celsius temperature, or an empty string if no hint is available
function getHint(celsius) {
  const match = TEMPERATURE_HINTS.find(
    ([temp]) => Math.abs(celsius - temp) <= 0.5,
  );
  return match ? match[1] : "";
}

//Round numbers to 2 decimal places
function round(num) {
  return Math.round(num * 100) / 100;
}

function init(container) {
  // Get all elements from the page
  const celsiusInput = container.querySelector("#tc-celsius");
  const fahrenheitInput = container.querySelector("#tc-fahrenheit");
  const kelvinInput = container.querySelector("#tc-kelvin");
  const hintText = container.querySelector("#tc-hint");
  const resetButton = container.querySelector("#tc-reset");

  let isUpdating = false;

  // Convert from Celsius
  function updateFromCelsius() {
    if (isUpdating) return;
    isUpdating = true;

    fahrenheitInput.value = round((celsiusInput.value * 9) / 5 + 32);
    kelvinInput.value = round(parseFloat(celsiusInput.value) + 273.15);
    hintText.textContent = getHint(parseFloat(celsiusInput.value));
    isUpdating = false;
  }

  // Convert from Fahrenheit
  function updateFromFahrenheit() {
    if (isUpdating) return;
    isUpdating = true;

    celsiusInput.value = round(((fahrenheitInput.value - 32) * 5) / 9);
    kelvinInput.value = round(((fahrenheitInput.value - 32) * 5) / 9 + 273.15);
    hintText.textContent = getHint(parseFloat(celsiusInput.value));
    isUpdating = false;
  }

  // Convert from Kelvin
  function updateFromKelvin() {
    if (isUpdating) return;
    isUpdating = true;
    celsiusInput.value = round(kelvinInput.value - 273.15);
    fahrenheitInput.value = round(((kelvinInput.value - 273.15) * 9) / 5 + 32);
    hintText.textContent = getHint(parseFloat(celsiusInput.value));
    isUpdating = false;
  }

  // Reset all fields and hints
  function resetConverter() {
    celsiusInput.value = "";
    fahrenheitInput.value = "";
    kelvinInput.value = "";
    hintText.textContent = "";
  }

  // Input event handler
  function handleCelsiusInput() {
    if (celsiusInput.value === "") return;
    updateFromCelsius(parseFloat(celsiusInput.value));
  }

  function handleFahrenheitInput() {
    if (fahrenheitInput.value === "") return;
    updateFromFahrenheit(parseFloat(fahrenheitInput.value));
  }

  function handleKelvinInput() {
    if (kelvinInput.value === "") return;
    updateFromKelvin(parseFloat(kelvinInput.value));
  }

  // List of all event listeners
  const eventListeners = [
    {
      el: celsiusInput,
      type: "input",
      fn: handleCelsiusInput,
    },
    {
      el: fahrenheitInput,
      type: "input",
      fn: handleFahrenheitInput,
    },
    {
      el: kelvinInput,
      type: "input",
      fn: handleKelvinInput,
    },
    {
      el: resetButton,
      type: "click",
      fn: resetConverter,
    },
  ];

  //Add all listeners
  eventListeners.forEach(({ el, type, fn }) => el.addEventListener(type, fn));

  //Store listeners for later removal
  _listeners = eventListeners;
}

//Remove all event listeners when the project is closed
function destroy() {
  _listeners.forEach(({ el, type, fn }) => {
    if (el && typeof el.removeEventListener === "function") {
      el.removeEventListener(type, fn);
    }
  });
  _listeners = [];
}

export { init, destroy };
