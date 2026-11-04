// Desktop mode (1024px and up). GSAP, plus Lenis smooth scroll for mouse users.
// Add features as separate files in this folder (fold.js, scrub-text.js, ...) and call them from init().
// Features that create ScrollTriggers either do it inside the gsap.context below, so ctx.revert()
// removes them, or make their own gsap.context and return a cleanup that reverts it (phase 3 files).
// Each feature may also return a cleanup function for DOM changes and listeners.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from '../core/env.js';
import { initHeroIntro } from '../core/hero-intro.js';
import { initHeroVideo } from '../core/hero-video.js';
import { initNav } from '../core/nav.js';
import { initHeaderScroll } from './header-scroll.js';
import { initCountUp } from './count-up.js';
import { initHeroScroll } from './hero-scroll.js';
import { initPackagesRise } from './packages-rise.js';
import { initScrubText } from './scrub-text.js';
import { initSectionRail } from './section-rail.js';
import { initServicesHover } from './services-hover.js';
import { initSmoothScroll } from './smooth-scroll.js';

let ctx = null;
let smooth = null;
let cleanups = [];

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  cleanups = [];
  const reduced = prefersReducedMotion();

  // Lenis first, so every ScrollTrigger below is created against the smoothed scroll.
  smooth = initSmoothScroll();

  // gsap.context collects everything created inside it, so destroy() can revert it all.
  ctx = gsap.context(() => {
    cleanups.push(initHeaderScroll({ allowHide: !reduced }));
    cleanups.push(initSectionRail());
    if (!reduced) initHeroScroll();
    // Section animations are added here, one file per feature.
  });

  cleanups.push(
    initNav({ scrollTo: smooth?.scrollTo }), // Lenis when it runs, native smooth scroll otherwise
    initHeroVideo(),
    initHeroIntro(),
    initServicesHover(), // services list: works for everyone, draws icons unless reduced motion
  );

  // About, services and packages (phase 3). Each makes its own gsap.context and cleans itself up.
  if (!reduced) {
    cleanups.push(initScrubText(), initCountUp(), initPackagesRise());
  }

  // Positions depend on font metrics, so measure again once fonts are ready.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function destroy() {
  cleanups.reverse().forEach((undo) => undo());
  cleanups = [];
  ctx?.revert();
  smooth?.destroy();
  ctx = null;
  smooth = null;
}
