// Shared navigation behaviour for both modes (Lane B).
//   1. Marks the nav link of the section on screen with aria-current="location".
//   2. Handles in-page anchor links: moves the page, updates the address bar so Back works,
//      and moves keyboard focus to the section so screen reader and keyboard users arrive there.
//
// Desktop passes its own scrollTo (Lenis). Mobile passes nothing and uses native smooth scrolling.
// This file must not import from desktop/ or mobile/.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from './env.js';

// Sections that have no link of their own light up their parent's link.
const PARENT_LINK = { packages: 'services' };

let deepLinkDone = false; // the address-bar hash is honoured once per page load

/**
 * Where a section really belongs in the page. A section pinned by ScrollTrigger (the hero fold,
 * the showcase, the FAQ fold) sits inside a "pin-spacer" wrapper that keeps its place in the page,
 * while the section itself can be fixed to the screen. Measuring the section would then land on
 * the end of the pin (the showcase's last panel) or on the wrong screen, so measure the wrapper.
 */
function anchorFor(target) {
  const parent = target.parentElement;
  return parent?.classList.contains('pin-spacer') ? parent : target;
}

/**
 * @param {{ scrollTo?: (target: Element, options?: { immediate?: boolean }) => void }} [options]
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

  function goTo(target, { immediate = false } = {}) {
    const anchor = anchorFor(target);
    if (scrollTo) {
      scrollTo(anchor, { immediate });
    } else {
      anchor.scrollIntoView({
        behavior: immediate ? 'instant' : prefersReducedMotion() ? 'auto' : 'smooth',
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

  // 3. A link that ends in a section (index.html#packages, from WhatsApp or a social post).
  // The browser jumps before the scripts have added pin spacing and before the fonts arrive, so
  // it lands in the wrong place. Once the page has been measured, go to the section again.
  let cancelled = false;
  if (!deepLinkDone && window.location.hash.length > 1) {
    deepLinkDone = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (!target) return;
        ScrollTrigger.refresh();
        goTo(target, { immediate: true });
      });
    });
  } else {
    deepLinkDone = true;
  }

  return function destroy() {
    cancelled = true;
    document.removeEventListener('click', onClick);
    observer.disconnect();
    links.forEach((link) => link.removeAttribute('aria-current'));
  };
}
