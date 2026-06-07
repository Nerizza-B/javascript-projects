// Resource manager: for tracking and cleaning up event listeners, timers, and observers

const _reg = {
  listeners: [],
  intervals: [],
  timeouts: [],
  observers: [],
  customs: [],
};

// Register event listener with automatic tracking for cleanup
function addListener(el, type, fn, opts) {
  el.addEventListener(type, fn, opts);
  _reg.listeners.push({ el, type, fn, opts });
}

// Track interval ID for later cleanup
function addInterval(id) {
  _reg.intervals.push(id);
}

// Track timeout ID for later cleanup
function addTimeout(id) {
  _reg.timeouts.push(id);
}

// Track MutationObserver / IntersectionObserver for cleanup
function addObserver(obs) {
  _reg.observers.push(obs);
}

// Track custom cleanup functions
function addCustom(fn) {
  _reg.customs.push(fn);
}

// Cleanup all registered resources (prevents memory leaks)
function destroyAll() {
  _reg.listeners.forEach(({ el, type, fn, opts }) =>
    el.removeEventListener(type, fn, opts),
  );

  _reg.intervals.forEach(clearInterval);
  _reg.timeouts.forEach(clearTimeout);
  _reg.observers.forEach((o) => o.disconnect());
  _reg.customs.forEach((fn) => fn());

  // Reset registry
  Object.keys(_reg).forEach((k) => (_reg[k] = []));
}

export {
  addListener,
  addInterval,
  addTimeout,
  addObserver,
  addCustom,
  destroyAll,
};
