// Mobile menu sheet (Lane B). The main nav list becomes a full-screen sheet below 1024px.
// Same links as the desktop nav: the markup is written once.
//
// Disclosure pattern: a button with aria-expanded controls the nav. While it is open, the rest of
// the page is inert, Tab cycles inside the header and the sheet, Escape closes it, and focus goes
// back to the button. destroy() puts everything back, so crossing 1024px with the sheet open is safe.

import { gsap } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initMenuSheet() {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  if (!header || !button || !nav) return () => {};

  const links = [...nav.querySelectorAll('a')];
  const inertTargets = ['main', '.sv-footer', '[data-action-bar]']
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);

  const ctx = gsap.context(() => {});
  let open = false;
  let intro = null;

  root.dataset.menu = 'closed';

  function setOpen(next, { returnFocus = true } = {}) {
    if (next === open) return;
    open = next;

    root.dataset.menu = open ? 'open' : 'closed';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    inertTargets.forEach((element) => {
      element.inert = open;
    });

    intro?.kill();
    intro = null;

    if (open) {
      if (!prefersReducedMotion()) {
        // Links rise in one after another with a small overshoot.
        ctx.add(() => {
          intro = gsap.fromTo(
            links,
            { y: MOTION.menu.itemOffset, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION.duration.reveal,
              ease: MOTION.ease.spring,
              stagger: MOTION.stagger,
              clearProps: 'transform,opacity',
            },
          );
        });
      }
      // Wait one frame so the sheet is visible before it takes focus.
      requestAnimationFrame(() => {
        if (open) links[0]?.focus({ preventScroll: true });
      });
    } else if (returnFocus) {
      button.focus({ preventScroll: true });
    }
  }

  function onButtonClick() {
    setOpen(!open);
  }

  function onKeydown(event) {
    if (!open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    // Keep Tab inside the header and the sheet.
    const loop = [...header.querySelectorAll('a[href], button')].filter(
      (element) => element.getClientRects().length > 0, // skips elements with display: none
    );
    if (loop.length === 0) return;
    const first = loop[0];
    const last = loop[loop.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Choosing a link closes the sheet. The shared nav code then moves the page and the focus.
  function onNavClick(event) {
    if (event.target.closest('a')) setOpen(false, { returnFocus: false });
  }

  button.addEventListener('click', onButtonClick);
  nav.addEventListener('click', onNavClick);
  document.addEventListener('keydown', onKeydown);

  return function destroy() {
    button.removeEventListener('click', onButtonClick);
    nav.removeEventListener('click', onNavClick);
    document.removeEventListener('keydown', onKeydown);

    intro?.kill();
    ctx.revert();
    inertTargets.forEach((element) => {
      element.inert = false;
    });
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
    delete root.dataset.menu;
  };
}
