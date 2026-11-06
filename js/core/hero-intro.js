// Hero entrance (Lane B): headline lines slide up from under a mask, then the lead and
// buttons rise and fade in. Plays once per page load, in both modes.
//
// Before this runs, CSS keeps the text hidden (only under html.js, with a 4 second failsafe).
// Adding .sv-intro-done is what makes it visible, so it is always added, even when we skip
// the animation (reduced motion, or a mode swap after the first play).
//
// This file must not import from desktop/ or mobile/.

import { gsap, SplitText } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from './env.js';
import { introGate } from './loader.js';
import { MOTION } from './motion-tokens.js';

const DONE_CLASS = 'sv-intro-done';
let played = false;

/** @returns {() => void} cleanup */
export function initHeroIntro() {
  const root = document.documentElement;
  const title = document.querySelector('[data-hero-title]');
  const rest = [...document.querySelectorAll('[data-hero-in]')];

  if (played || prefersReducedMotion() || !title) {
    played = true;
    root.classList.add(DONE_CLASS);
    return () => {};
  }
  played = true;

  gsap.registerPlugin(SplitText);
  let cancelled = false;
  const ctx = gsap.context(() => {});

  // Lines are measured after the fonts load, otherwise they would break in the wrong places.
  // On a first visit the entrance also waits for the loader curtain to start clearing.
  const ready = Promise.all([document.fonts?.ready ?? Promise.resolve(), introGate()]);
  ready.then(() => {
    if (cancelled) return;
    ctx.add(() => {
      SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true, // splits again if the width changes or a font arrives late
        onSplit(self) {
          root.classList.add(DONE_CLASS); // title becomes visible, lines are still hidden below
          const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } });
          tl.fromTo(
            self.lines,
            { yPercent: MOTION.hero.lineOffset },
            {
              yPercent: 0,
              duration: MOTION.duration.reveal + 0.1,
              stagger: MOTION.stagger,
            },
          );
          tl.fromTo(
            rest,
            { opacity: 0, y: MOTION.hero.riseOffset },
            { opacity: 1, y: 0, duration: MOTION.duration.reveal, stagger: MOTION.stagger },
            `-=${MOTION.hero.overlap}`,
          );
          return tl;
        },
      });
    });
  });

  return function destroy() {
    cancelled = true;
    ctx.revert();
    // Whatever happens, the text must stay visible after a mode swap.
    root.classList.add(DONE_CLASS);
  };
}
