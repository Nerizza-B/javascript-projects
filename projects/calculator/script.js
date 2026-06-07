let display = "";
const valEl = document.getElementById("calc-val");
const exprEl = document.getElementById("calc-expr");

function updateDisplay() {
  valEl.textContent = display || "0";
}

function setError(message) {
  display = message;
  valEl.classList.add("error");
}

function clearError() {
  valEl.classList.remove("error");
}

document.querySelector(".calc-keys").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  // Numbers
  if ("0123456789".includes(action)) {
    display += action;
  }

  // Operators
  else if ("+-*/".includes(action)) {
    const lastChar = display.slice(-1);

    if (!"0123456789".includes(lastChar)) return;

    if (action === "*") display += "×";
    else if (action === "/") display += "÷";
    else display += action;
  }

  // Decimal
  else if (action === ".") {
    display += ".";
  }

  // Clear
  else if (action === "clear") {
    display = "";
    exprEl.textContent = "";
  }

  // Sign (+/-)
  else if (action === "sign") {
    if (display.startsWith("-")) {
      display = display.slice(1);
    } else {
      display = "-" + display;
    }
  }

  // Equals
  else if (action === "=") {
    try {
      exprEl.textContent = display + " =";

      // prevent divide by zero BEFORE eval (better UX)
      if (/\/0(?!\.)/.test(display)) {
        setError("Cannot divide by 0");
        updateDisplay();
        return;
      }

      const result = eval(display);

      if (result === Infinity || result === -Infinity) {
        setError("Cannot divide by 0");
      } else if (isNaN(result)) {
        setError("Error");
      } else {
        clearError();
        display = result.toString();
      }
    } catch {
      setError("Error");
    }
  }

  // Percentage
  else if (action === "%") {
    try {
      const match = display.match(/(\d+\.?\d*)$/);
      if (!match) return;

      const num = parseFloat(match[1]);

      // check previous operator
      const before = display.slice(0, -match[1].length).trim();
      const lastOp = before.slice(-1);

      let result;

      if (lastOp === "+" || lastOp === "-") {
        result = (num / 100) * parseFloat(before.slice(0, -1));
      } else {
        result = num / 100;
      }

      display = display.replace(/(\d+\.?\d*)$/, result);
      updateDisplay();
    } catch {
      display = "Error";
      updateDisplay();
    }
  }

  updateDisplay();
});

// init
updateDisplay();
