// Mobile mode (below 1024px). Native scroll, no Lenis, no pinning.
// Add features as separate files in this folder and call them from init(). Each one returns a
// cleanup function; destroy() runs them all, then reverts the GSAP context.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from '../core/env.js';
import { initHeroIntro } from '../core/hero-intro.js';
import { initFaq } from '../core/faq.js';
import { initForm } from '../core/form.js';
import { initHeroVideo } from '../core/hero-video.js';
import { initNav } from '../core/nav.js';
import { initWhyReveal } from '../core/why-reveal.js';
import { initActionBar } from './action-bar.js';
import { initMenuSheet } from './menu-sheet.js';
import { initReveal } from './reveal.js';
import { initServicesAccordion } from './services-accordion.js';
import { initShowcaseSwipe } from './showcase-swipe.js';

let ctx = null;
let cleanups = [];

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  cleanups = [];

  // gsap.context collects everything created inside it, so destroy() can revert it all.
  ctx = gsap.context(() => {
    // Section animations are added here, one file per feature.
  });

  cleanups.push(
    initNav(), // native smooth scroll
    initMenuSheet(),
    initActionBar(),
    initHeroVideo(),
    initHeroIntro(),
    initServicesAccordion(), // tap a service row to open it
    initShowcaseSwipe(), // dots under the native swipe row (phase 4)
    initFaq(), // FAQ accordion (phase 4)
    initForm(), // contact form and quote pre-fill (phase 5)
  );

  // About, packages and showcase reveals (phase 3 and 4). Each makes its own gsap.context and
  // cleans itself up.
  if (!prefersReducedMotion()) cleanups.push(initReveal(), initWhyReveal());

  // Positions depend on font metrics, so measure again once fonts are ready.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function destroy() {
  cleanups.reverse().forEach((undo) => undo());
  cleanups = [];
  ctx?.revert();
  ctx = null;
}
