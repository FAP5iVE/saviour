// Page loader (Lane B). First visit of a session only: the logo mark draws itself, the finished
// logo fades in, and a paper curtain slides up. The hero headline starts as the curtain clears.
//
// Who decides whether it runs: the inline script in index.html adds .sv-loading to <html> on the
// first visit and never with reduced motion. This file only animates what that class switched on,
// so a repeat visit, reduced motion, or a failed script all get no loader and no wait.
//
// The mark is two blue outlines (DrawSVG), then the finished favicon.svg fades in over them.
// Transform and opacity only, apart from the stroke drawing itself.
//
// Both modes call initLoader(); the first call plays it, later calls (after a resize across
// 1024 px) do nothing. This file must not import from desktop/ or mobile/.

import { gsap, DrawSVGPlugin } from '../../assets/vendor/vendor.js';
import { isDesktopLayout, prefersReducedMotion } from './env.js';
import { MOTION } from './motion-tokens.js';

const root = document.documentElement;
const LOADING = 'sv-loading';

let started = false;
let openGate = () => {};
const gate = new Promise((resolve) => {
  openGate = resolve;
});

/**
 * Resolves when the hero may start its entrance: straight away when there is no loader, otherwise
 * as the curtain starts to clear. A timer stops the hero waiting for ever if the loader stalls.
 * @returns {Promise<void>}
 */
export function introGate() {
  if (!root.classList.contains(LOADING)) return Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, MOTION.loader.failsafe));
  return Promise.race([gate, timeout]);
}

/** @returns {() => void} cleanup */
export function initLoader() {
  const el = document.querySelector('[data-loader]');

  function finish() {
    root.classList.remove(LOADING);
    el?.remove();
    openGate();
  }

  if (started || !el) return () => {};
  if (!root.classList.contains(LOADING)) {
    el.remove(); // a repeat visit: nothing to play, and nothing needs to stay in the page
    return () => {};
  }
  if (prefersReducedMotion()) {
    finish();
    return () => {};
  }
  started = true;

  gsap.registerPlugin(DrawSVGPlugin);
  const T = MOTION.loader;
  const desktop = isDesktopLayout();
  const draw = desktop ? T.draw : T.drawMobile;
  const curtain = desktop ? T.curtain : T.curtainMobile;

  const shapes = el.querySelectorAll('[data-loader-shape]');
  const svg = el.querySelector('[data-loader-svg]');
  const logo = el.querySelector('[data-loader-logo]');
  const mark = el.querySelector('[data-loader-mark]');
  el.classList.add('is-running');

  const ctx = gsap.context(() => {
    gsap.set(shapes, { drawSVG: '0%', fillOpacity: 0 });
    gsap.set(svg, { opacity: 1 });
    gsap.set(logo, { opacity: 0, y: T.logoRise });

    const tl = gsap.timeline({ onComplete: finish });
    // 1. The outlines draw, then fill with the logo blue.
    tl.to(shapes, { drawSVG: '100%', duration: draw * 0.7, ease: 'power2.inOut' }, 0);
    tl.to(shapes, { fillOpacity: 1, duration: draw * 0.3, ease: MOTION.ease.out }, draw * 0.6);
    // 2. The finished logo (blue shapes plus the orange lettering) fades in on top. It matches the
    //    outlines exactly, so the drawing underneath is switched off once the logo is solid.
    tl.to(logo, { opacity: 1, y: 0, duration: draw * 0.4, ease: MOTION.ease.out }, draw * 0.6);
    tl.set(svg, { opacity: 0 }, draw);
    // 3. A short rest, then the curtain lifts. Exits run faster than entrances.
    const lift = draw + T.hold;
    tl.to(el, { yPercent: -100, duration: curtain, ease: 'power3.inOut' }, lift);
    tl.to(
      mark,
      { y: -T.markLift, opacity: 0, duration: curtain * MOTION.exitFactor, ease: MOTION.ease.in },
      lift,
    );
    tl.call(openGate, null, lift + curtain * T.gateAt);
  }, el);

  return function destroy() {
    ctx.revert();
    finish();
  };
}
