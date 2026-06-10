let _listeners = [];

function init(container) {
  const list = container.querySelector('#ac-list');

  function onToggle(e) {
    const header = e.target.closest('.ac-header');
    if (!header) return;
    const item = header.closest('.ac-item');
    const isOpen = item.classList.contains('open');

    // Close all
    list.querySelectorAll('.ac-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.ac-header').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  }

  list.addEventListener('click', onToggle);
  _listeners = [{ el: list, type: 'click', fn: onToggle }];
}

function destroy() {
  _listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  _listeners = [];
}

export { init, destroy };
