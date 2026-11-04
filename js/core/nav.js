// Shared navigation behaviour for both modes (Lane B).
//   1. Marks the nav link of the section on screen with aria-current="location".
//   2. Handles in-page anchor links: moves the page, updates the address bar so Back works,
//      and moves keyboard focus to the section so screen reader and keyboard users arrive there.
//
// Desktop passes its own scrollTo (Lenis). Mobile passes nothing and uses native smooth scrolling.
// This file must not import from desktop/ or mobile/.

import { prefersReducedMotion } from './env.js';

// Sections that have no link of their own light up their parent's link.
const PARENT_LINK = { packages: 'services' };

/**
 * @param {{ scrollTo?: (target: Element) => void }} [options]
 * @returns {() => void} cleanup
 */
export function initNav({ scrollTo } = {}) {
  const nav = document.querySelector('[data-nav]');
  const links = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const sections = [...document.querySelectorAll('main > section[id]')];

  // 1. Current section.
  function markCurrent(sectionId) {
    const linkId = PARENT_LINK[sectionId] ?? sectionId;
    for (const link of links) {
      if (link.getAttribute('href') === `#${linkId}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  // A thin band across the middle of the screen: the section crossing it is the current one.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));

  // 2. Anchor links anywhere on the page (nav, buttons, footer, skip link).
  function focusTarget(target) {
    if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  }

  function goTo(target) {
    if (scrollTo) {
      scrollTo(target);
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    focusTarget(target);
  }

  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (hash.length < 2) return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    goTo(target);
  }

  document.addEventListener('click', onClick);

  return function destroy() {
    document.removeEventListener('click', onClick);
    observer.disconnect();
    links.forEach((link) => link.removeAttribute('aria-current'));
  };
}
