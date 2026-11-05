// Desktop showcase (Lane D): the section pins to the screen and the five concept demos slide
// sideways as you scroll down. A thin line fills as you go, and the mini-site inside each panel
// drifts a few pixels the other way (a small parallax). Transform only.
//
// Without this file (reduced motion, scripts failed) the same markup is a native sideways scroll
// row, so nothing is lost. data-pinned on the section is what switches the CSS over.
//
// Keyboard: the track is moved by the page scroll, so a link inside an off-screen panel could not
// be reached by Tab alone. When focus lands in a panel that is not fully on screen, the page is
// scrolled to the position where that panel is shown.
//
// Makes its own gsap.context: the returned cleanup removes the pin, its spacer and every inline
// style, and puts back the attributes it changed. The caller skips this for reduced motion.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initShowcaseHorizontal() {
  const section = document.querySelector('[data-showcase]');
  const viewport = section?.querySelector('[data-showcase-viewport]');
  const track = section?.querySelector('[data-showcase-track]');
  const panels = track ? [...track.querySelectorAll('[data-showcase-panel]')] : [];
  if (!section || !viewport || !track || panels.length < 2) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const fill = section.querySelector('[data-showcase-fill]');
  const pages = [...section.querySelectorAll('[data-showcase-page]')];

  // The pinned row is not a scroll area any more, so it stops being a tab stop.
  const hadTabindex = viewport.getAttribute('tabindex');
  viewport.removeAttribute('tabindex');
  section.setAttribute('data-pinned', '');
  viewport.scrollLeft = 0;

  // How far the track has to travel to show the last panel.
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  function restore() {
    section.removeAttribute('data-pinned');
    if (hadTabindex !== null) viewport.setAttribute('tabindex', hadTabindex);
  }

  if (distance() < 2) {
    restore(); // everything already fits: nothing to pin
    return () => {};
  }

  let trigger = null;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        anticipatePin: 1,
        scrub: MOTION.showcase.scrub,
        invalidateOnRefresh: true,
        // The pin adds space above everything below it, so it measures before the other triggers.
        refreshPriority: 1,
      },
    });
    trigger = tl.scrollTrigger;

    tl.to(track, { x: () => -distance() }, 0);
    if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1 }, 0);
    for (const page of pages) {
      tl.fromTo(page, { x: MOTION.showcase.parallax }, { x: -MOTION.showcase.parallax }, 0);
    }
  }, section);

  // The pin starts where the section sits on the page, so anything above it that changes height
  // after the pin was measured (the first service row finishing its opening, a late image, a
  // font) would make the pin start in the wrong place. Watch for that and measure again.
  const anchor = () =>
    section.parentElement?.classList.contains('pin-spacer') ? section.parentElement : section;
  const topOnPage = () => anchor().getBoundingClientRect().top + window.scrollY;
  let measuredTop = topOnPage();
  let settleTimer = 0;
  const watcher = new ResizeObserver(() => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const top = topOnPage();
      if (Math.abs(top - measuredTop) > 1) {
        measuredTop = top;
        ScrollTrigger.refresh();
      }
    }, 100);
  });
  watcher.observe(document.querySelector('main') ?? document.body);

  function onFocusIn(event) {
    const panel = event.target.closest?.('[data-showcase-panel]');
    if (!panel || !trigger) return;

    // Browsers may scroll a clipped box to reveal a focused link. It must stay where it is.
    viewport.scrollLeft = 0;

    const total = distance();
    if (total <= 0) return;

    const shownFrom = trigger.progress * total; // how far the track is moved right now
    const fits =
      panel.offsetLeft >= shownFrom - 1 &&
      panel.offsetLeft + panel.offsetWidth <= shownFrom + viewport.clientWidth + 1;
    if (fits) return;

    const wanted = Math.min(Math.max(panel.offsetLeft, 0), total);
    const top = trigger.start + (wanted / total) * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: 'instant' });
  }

  track.addEventListener('focusin', onFocusIn);

  return function destroy() {
    clearTimeout(settleTimer);
    watcher.disconnect();
    track.removeEventListener('focusin', onFocusIn);
    ctx.revert();
    // None of these had inline styles of their own, so leaving no trace means no style at all.
    [track, fill, ...pages].forEach((el) => el?.removeAttribute('style'));
    restore();
  };
}
