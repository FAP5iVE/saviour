// Desktop About statement (Lane C): each word fades from faint to full as you scroll past it.
// Scrubbed to the scroll position, opacity only. Skipped for reduced motion (the caller checks).
// Makes its own gsap.context, so the returned cleanup removes every trigger and puts the text back.

import { gsap, ScrollTrigger, SplitText } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initScrubText() {
  const targets = [...document.querySelectorAll('[data-scrub]')];
  if (!targets.length) return () => {};

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const ctx = gsap.context(() => {
    for (const el of targets) {
      // Words only: SplitText adds an aria-label to the paragraph and hides the pieces from
      // screen readers, so the sentence is still read as one.
      const split = SplitText.create(el, { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: MOTION.about.scrubFrom },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: MOTION.about.scrubStart,
            end: MOTION.about.scrubEnd,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  });

  return () => ctx.revert();
}
