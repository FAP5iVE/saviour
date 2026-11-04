// Shared accordion for both modes (built for the services list, reusable for the FAQ).
// This file must not import from desktop/ or mobile/.
//
// Markup it expects inside the root element:
//   [data-accordion-item]            one row; gets data-open when open
//     [data-accordion-name]          the heading. Its contents become the label of a real <button>
//     [data-accordion-panel] (id)    the part that opens and closes
//
// The page is complete without this script: all rows are open and visible. CSS only collapses
// them under html.js, and boot.js removes that class if scripts fail.
//
// A row's open state lives in the data-open attribute. destroy() leaves it alone, so the state
// survives a desktop/mobile mode swap.

/**
 * @param {Element} root the list element
 * @param {{ single?: boolean, openFirst?: boolean, onToggle?: (item: Element, open: boolean) => void }} [options]
 *   single: opening a row closes the others. openFirst: open row one if no row is open yet.
 * @returns {{ open: (item: Element) => void, close: (item: Element) => void, toggle: (item: Element) => void,
 *            items: Element[], destroy: () => void }}
 */
export function initAccordion(root, { single = true, openFirst = false, onToggle } = {}) {
  const items = root ? [...root.querySelectorAll(':scope > [data-accordion-item]')] : [];
  if (!items.length) {
    return { open() {}, close() {}, toggle() {}, items: [], destroy() {} };
  }

  const triggers = new Map(); // item -> button

  for (const item of items) {
    const name = item.querySelector('[data-accordion-name]');
    const panel = item.querySelector('[data-accordion-panel]');
    if (!name || !panel) continue;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sv-accordion__trigger';
    if (panel.id) button.setAttribute('aria-controls', panel.id);
    button.append(...name.childNodes);
    name.append(button);
    triggers.set(item, button);
  }

  if (openFirst && !items.some((item) => item.hasAttribute('data-open'))) {
    items[0].setAttribute('data-open', '');
  }
  // Collapsed is the default once scripts run (CSS collapses rows without data-open).
  sync();

  function sync() {
    for (const [item, button] of triggers) {
      button.setAttribute('aria-expanded', String(item.hasAttribute('data-open')));
    }
  }

  function setOpen(item, open) {
    if (!triggers.has(item) || item.hasAttribute('data-open') === open) return;
    if (open && single) {
      for (const other of items) {
        if (other !== item && other.hasAttribute('data-open')) setOpen(other, false);
      }
    }
    item.toggleAttribute('data-open', open);
    sync();
    onToggle?.(item, open);
  }

  const open = (item) => setOpen(item, true);
  const close = (item) => setOpen(item, false);
  const toggle = (item) => setOpen(item, !item.hasAttribute('data-open'));

  function onClick(event) {
    const button = event.target.closest?.('.sv-accordion__trigger');
    if (!button) return;
    const item = button.closest('[data-accordion-item]');
    if (item && triggers.get(item) === button) toggle(item);
  }

  root.addEventListener('click', onClick);

  return {
    open,
    close,
    toggle,
    items,
    destroy() {
      root.removeEventListener('click', onClick);
      for (const [item, button] of triggers) {
        const name = item.querySelector('[data-accordion-name]');
        name?.append(...button.childNodes);
        button.remove();
      }
      triggers.clear();
    },
  };
}
