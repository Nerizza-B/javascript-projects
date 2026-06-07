let _listeners = [];

// Get all elements from the page
function init(container) {
  const textarea = container.querySelector("#wc-text");
  const wordsEl = container.querySelector("#wc-words");
  const charsEl = container.querySelector("#wc-chars");
  const noSpaceEl = container.querySelector("#wc-no-space");
  const sentEl = container.querySelector("#wc-sentences");
  const paraEl = container.querySelector("#wc-para");
  const readEl = container.querySelector("#wc-read");
  const clearBtn = container.querySelector("#wc-clear");

  // Calculate and display all statistics
  function update() {
    const text = textarea.value;

    // Count words
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Update word count
    wordsEl.textContent = words;

    // Count all characters (including spaces)
    charsEl.textContent = text.length;

    // Count characters without spaces
    noSpaceEl.textContent = text.replace(/\s/g, "").length;

    // Count sentences based on ., !, or ?
    sentEl.textContent = text.trim()
      ? (text.match(/[^.!?]+[.!?]+/g) || []).length || 1
      : 0;

    // Count paragraphs (blank lines separate paragraphs)
    paraEl.textContent = text.trim()
      ? text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length ||
        1
      : 0;

    // Estimate reading time
    // Average reading speed = 200 words per minute
    readEl.textContent = Math.max(1, Math.ceil(words / 200));
  }

  // Clear the textarea and refresh stats
  function onClear() {
    textarea.value = "";
    update();
  }

  // All event listeners used by this project
  const handlers = [
    {
      el: textarea,
      type: "input",
      fn: update,
    },
    {
      el: clearBtn,
      type: "click",
      fn: onClear,
    },
  ];

  // Add all event listeners
  handlers.forEach(({ el, type, fn }) => {
    el.addEventListener(type, fn);
  });

  // Save listeners for cleanup later
  _listeners = handlers;
}

function destroy() {
  // Remove all event listeners
  _listeners.forEach(({ el, type, fn }) => {
    el.removeEventListener(type, fn);
  });

  // Reset the listener list
  _listeners = [];
}

export { init, destroy };
