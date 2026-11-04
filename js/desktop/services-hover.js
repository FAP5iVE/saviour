// Desktop services list (Lane C). The same accordion as on mobile, plus:
//   - Row 1 starts open, so the list shows what a row does.
//   - Resting the mouse on a row for a moment opens it (hover intent), so a quick pass over the
//     list does not make it jump. Rows never close on mouse-leave: that would shift the page
//     under the pointer. Click or Enter still toggles a row, so touch and keyboard work.
//   - The service icon draws itself each time its row opens (DrawSVG). Reduced motion: no drawing.
//
// It makes its own gsap.context, so the icon tweens it starts later are reverted by the cleanup.

import { gsap, DrawSVGPlugin, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { initAccordion } from '../core/accordion.js';
import { hasFinePointer, prefersReducedMotion } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initServicesHover() {
  const list = document.querySelector('[data-accordion="services"]');
  if (!list) return () => {};

  gsap.registerPlugin(DrawSVGPlugin);
  const ctx = gsap.context(() => {}, list);
  const reduced = prefersReducedMotion();

  function drawIcon(item) {
    if (reduced) return;
    // The WhatsApp glyph is a filled shape, not a line drawing, so it is left as it is.
    const parts = item.querySelectorAll('.sv-svc__icon:not(.sv-svc__icon--solid) :is(path, circle, rect, line, polyline, polygon, ellipse)');
    if (!parts.length) return;
    ctx.add(() => {
      gsap.fromTo(
        parts,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: MOTION.services.drawDuration,
          stagger: MOTION.services.drawStagger,
          ease: MOTION.ease.out,
          overwrite: 'auto',
          clearProps: 'strokeDasharray,strokeDashoffset', // back to a plain stroke when done
        },
      );
    });
  }

  // Rows moving makes the page below them move, so measure the scroll triggers again afterwards.
  let refreshTimer = 0;
  const accordion = initAccordion(list, {
    single: true,
    openFirst: true,
    onToggle: (item, isOpen) => {
      if (isOpen) drawIcon(item);
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
    },
  });

  // Hover intent: mouse only (a fine pointer), never touch. Opening one row moves the rows
  // below it, and scrolling moves rows under a still mouse. Both make the browser report a
  // "new" hover without the mouse moving, so a row only opens when the mouse itself moved
  // and the page was not just scrolling.
  const timers = new Map();
  const removers = [];
  const MOVE_INTENT = MOTION.services.hoverIntent;
  const MOVE_MIN = 8; // px the mouse must travel after a row opened before another may open
  const SCROLL_QUIET = 200; // ms after scrolling during which hover is ignored
  let last = { x: 0, y: 0 };
  let anchor = null; // mouse position when a row last opened
  let lastScroll = 0;

  const onScroll = () => {
    lastScroll = performance.now();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  removers.push(() => window.removeEventListener('scroll', onScroll));

  if (hasFinePointer()) {
    for (const item of accordion.items) {
      const onMove = (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        last = { x: event.clientX, y: event.clientY };
        if (item.hasAttribute('data-open')) return;
        if (anchor && Math.hypot(last.x - anchor.x, last.y - anchor.y) < MOVE_MIN) return;
        if (performance.now() - lastScroll < SCROLL_QUIET) return;
        clearTimeout(timers.get(item));
        timers.set(
          item,
          setTimeout(() => {
            anchor = { ...last };
            accordion.open(item);
          }, MOVE_INTENT),
        );
      };
      const onLeave = () => clearTimeout(timers.get(item));
      item.addEventListener('pointermove', onMove);
      item.addEventListener('pointerleave', onLeave);
      removers.push(() => {
        item.removeEventListener('pointermove', onMove);
        item.removeEventListener('pointerleave', onLeave);
      });
    }
  }

  return function destroy() {
    clearTimeout(refreshTimer);
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    removers.forEach((undo) => undo());
    ctx.revert();
    accordion.destroy();
  };
}
