// Desktop mode (1024px and up). GSAP, plus Lenis smooth scroll for mouse users.
// Add features as separate files in this folder (fold.js, cursor.js, scrub-text.js, ...) and call them from init().
// Features that create ScrollTriggers either do it inside the gsap.context below, so ctx.revert()
// removes them, or make their own gsap.context and return a cleanup that reverts it (phase 3 files).
// Each feature may also return a cleanup function for DOM changes and listeners.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from '../core/env.js';
import { initHeroIntro } from '../core/hero-intro.js';
import { initFaq } from '../core/faq.js';
import { initForm } from '../core/form.js';
import { initHeroVideo } from '../core/hero-video.js';
import { initLoader } from '../core/loader.js';
import { initNav } from '../core/nav.js';
import { refreshWhenReady } from '../core/refresh.js';
import { initWhyReveal } from '../core/why-reveal.js';
import { initHeaderScroll } from './header-scroll.js';
import { initCountUp } from './count-up.js';
import { initFolds } from './fold.js';
import { initFooterDrift } from './footer-drift.js';
import { initMagnetic } from './magnetic.js';
import { initPackagesRise } from './packages-rise.js';
import { initScrubText } from './scrub-text.js';
import { initSectionRail } from './section-rail.js';
import { initServicesHover } from './services-hover.js';
import { initShowcaseHorizontal } from './showcase-horizontal.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initTeamReveal } from './team-reveal.js';

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
    // Section animations are added here, one file per feature.
  });

  cleanups.push(
    initLoader(), // first visit only; must come before the hero entrance, which waits for it
    initNav({ scrollTo: smooth?.scrollTo }), // Lenis when it runs, native smooth scroll otherwise
    initHeroVideo(),
    initHeroIntro(),
    initServicesHover(), // services list: works for everyone, draws icons unless reduced motion
    initFaq(), // FAQ accordion (phase 4): works for everyone
    initForm(), // contact form and quote pre-fill (phase 5): works for everyone
  );

  // About, services and packages (phase 3). Each makes its own gsap.context and cleans itself up.
  if (!reduced) {
    cleanups.push(initScrubText(), initCountUp(), initTeamReveal(), initPackagesRise());
  }

  // Phase 6 motion pass: the two folds (Hero to About, FAQ to Contact; they also hold the hero's
  // scroll effect), the custom cursor and the magnetic button. The folds pin and scrub, so reduced
  // motion skips them. The cursor and the magnetic button check for a mouse themselves.
  if (!reduced) cleanups.push(initFolds());
  // The custom cursor (js/desktop/cursor.js) is switched off at the owner's request: visitors get
  // the ordinary cursor. To turn it back on, import initCursor and add it to this push.
  cleanups.push(initMagnetic());

  // Showcase, why and FAQ (phase 4). The pinned showcase goes after the sections above it, so
  // its pin spacing is counted in the right order. With reduced motion the showcase stays a
  // plain sideways scroll row and the statements are simply visible.
  if (!reduced) cleanups.push(initShowcaseHorizontal(), initWhyReveal());

  // Footer wordmark drift. Last of the scroll triggers, so it measures after every pin above it.
  if (!reduced) cleanups.push(initFooterDrift());

  // Positions depend on font metrics and images, so measure again once they are ready.
  cleanups.push(refreshWhenReady());
}

export function destroy() {
  cleanups.reverse().forEach((undo) => undo());
  cleanups = [];
  ctx?.revert();
  smooth?.destroy();
  ctx = null;
  smooth = null;
}
