// Custom cursor (Lane B). Desktop layout, mouse users only (a fine pointer and no reduced motion).
// An 8 px dot follows the mouse at once; a 36 px ring follows a moment later (gsap.quickTo).
//
// States (docs/04 section 5):
//   default   dot and ring
//   link      over links and buttons: the ring grows, the dot fades
//   disc      over [data-cursor="view|drag"] (the showcase screens): the ring becomes an orange
//             disc with a label
//   native    over text fields, selects, checkboxes, labels, and while text is being selected:
//             the custom cursor hides and the ordinary mouse cursor comes back
//   gone      the mouse is outside the window, or has not moved yet: faded out
//
// Rules: the elements are aria-hidden and ignore the pointer; the ordinary cursor is hidden only
// after the custom one has actually appeared (html.sv-cursor-on), and never over form fields.
// Decoration only: nothing depends on it. Make the cursor's own gsap.context; the returned
// cleanup removes the elements, the listeners and both html classes.

import { gsap } from '../../assets/vendor/vendor.js';
import { allowPointerExtras } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

const FIELDS =
  'input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select, [contenteditable=""], [contenteditable="true"]';
const LINKS = 'a[href], button:not(:disabled), [role="button"], summary, [data-magnetic]';

/** @returns {() => void} cleanup */
export function initCursor() {
  if (!allowPointerExtras()) return () => {};

  const T = MOTION.cursor;
  const root = document.documentElement;

  const el = document.createElement('div');
  el.className = 'sv-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="sv-cursor__ring"><span class="sv-cursor__disc"></span><span class="sv-cursor__label"></span></div>' +
    '<div class="sv-cursor__dot"></div>';
  document.body.append(el);

  const ring = el.querySelector('.sv-cursor__ring');
  const disc = el.querySelector('.sv-cursor__disc');
  const label = el.querySelector('.sv-cursor__label');
  const dot = el.querySelector('.sv-cursor__dot');

  let moveRingX;
  let moveRingY;
  let setDotX;
  let setDotY;

  const ctx = gsap.context(() => {
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });
    gsap.set(el, { opacity: 0 });
    setDotX = gsap.quickSetter(dot, 'x', 'px');
    setDotY = gsap.quickSetter(dot, 'y', 'px');
    moveRingX = gsap.quickTo(ring, 'x', { duration: T.ringDuration, ease: MOTION.ease.out });
    moveRingY = gsap.quickTo(ring, 'y', { duration: T.ringDuration, ease: MOTION.ease.out });
  }, el);

  // What the pointer is over, and whether the custom cursor should be showing at all.
  let kind = 'default'; // default | link | disc
  let labelText = '';
  let native = false; // over a form field, or selecting text
  let inside = false; // the pointer is inside the window and has moved
  let selecting = false;
  let pressed = false;
  let x = 0;
  let y = 0;
  let drawn = { kind: '', native: null, inside: null, labelText: null };

  function classify(target) {
    if (!(target instanceof Element)) return { kind: 'default', labelText: '', native: false };
    if (target.closest(FIELDS)) return { kind: 'default', labelText: '', native: true };
    const marked = target.closest('[data-cursor]');
    if (marked) {
      const text = T.labels[marked.dataset.cursor];
      if (text) return { kind: 'disc', labelText: text, native: false };
    }
    if (target.closest(LINKS)) return { kind: 'link', labelText: '', native: false };
    // A label that is not a link (for example the floating labels of the form) belongs to a field.
    if (target.closest('label')) return { kind: 'default', labelText: '', native: true };
    return { kind: 'default', labelText: '', native: false };
  }

  function render() {
    const shown = inside && !native && !selecting;
    if (
      drawn.kind === kind &&
      drawn.native === shown &&
      drawn.inside === inside &&
      drawn.labelText === labelText
    ) {
      return;
    }
    drawn = { kind, native: shown, inside, labelText };

    // The ordinary cursor comes back whenever ours hides, so a text field always has its I-beam.
    root.classList.toggle('sv-cursor-native', !shown);
    el.dataset.state = kind;
    label.textContent = labelText;

    ctx.add(() => {
      gsap.to(el, {
        opacity: shown ? 1 : 0,
        duration: T.dotFade,
        ease: MOTION.ease.out,
        overwrite: 'auto',
      });
      gsap.to(disc, {
        scale: kind === 'disc' ? T.discScale : kind === 'link' ? T.linkScale : 1,
        duration: T.dotFade * 1.5,
        ease: MOTION.ease.out,
        overwrite: 'auto',
      });
      gsap.to(dot, {
        opacity: kind === 'default' ? 1 : 0,
        duration: T.dotFade,
        overwrite: 'auto',
      });
      gsap.to(label, {
        opacity: kind === 'disc' ? 1 : 0,
        duration: T.dotFade,
        overwrite: 'auto',
      });
    });
  }

  function update(target) {
    const next = classify(target);
    kind = next.kind;
    labelText = next.labelText;
    native = next.native;
    render();
  }

  function place(clientX, clientY, first) {
    x = clientX;
    y = clientY;
    setDotX(x);
    setDotY(y);
    if (first) {
      // Start the ring on the dot instead of flying in from the corner.
      gsap.set(ring, { x, y });
    }
    moveRingX(x);
    moveRingY(y);
  }

  function onMove(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const first = !inside;
    inside = true;
    if (first) {
      root.classList.add('sv-cursor-on'); // from now on the ordinary cursor is hidden
    }
    place(event.clientX, event.clientY, first);
    update(event.target);
  }

  function onDown(event) {
    if (event.button !== 0) return;
    pressed = true;
  }

  function onUp() {
    pressed = false;
    if (selecting) {
      selecting = false;
      render();
    }
  }

  // Dragging across text selects it: show the ordinary cursor for that.
  function onSelection() {
    const selection = document.getSelection();
    const now = pressed && !!selection && !selection.isCollapsed;
    if (now !== selecting) {
      selecting = now;
      render();
    }
  }

  // The pointer left the window: it has no element to move to (relatedTarget is null).
  function onOut(event) {
    if (event.relatedTarget) return;
    inside = false;
    render();
  }

  function onBlur() {
    inside = false;
    render();
  }

  // Scrolling moves things under a still mouse without any pointer event, so look again.
  let scrollFrame = 0;
  function onScroll() {
    if (scrollFrame || !inside) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      update(document.elementFromPoint(x, y));
    });
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('selectionchange', onSelection);
  document.addEventListener('mouseout', onOut);
  window.addEventListener('blur', onBlur);

  return function destroy() {
    cancelAnimationFrame(scrollFrame);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('selectionchange', onSelection);
    document.removeEventListener('mouseout', onOut);
    window.removeEventListener('blur', onBlur);
    ctx.revert();
    el.remove();
    root.classList.remove('sv-cursor-on', 'sv-cursor-native');
  };
}
