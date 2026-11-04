// Desktop packages entrance (Lane C): the three cards rise with a small overshoot, one after the
// other, the first time they come into view. The recommended card's blue top rule then draws in
// from the left. Opacity and transform only (the rule scales through a CSS variable).
//
// After the entrance GSAP clears its own transform, so the CSS hover lift can work.
// Makes its own gsap.context; the returned cleanup removes triggers and inline styles.
// The caller skips this for reduced motion.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initPackagesRise() {
  const cards = [...document.querySelectorAll('[data-pkg]')];
  if (!cards.length) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.set(cards, { opacity: 0, y: MOTION.packages.riseOffset });
    gsap.set('.sv-pkg--featured', { '--rule-scale': 0 });

    ScrollTrigger.batch(cards, {
      start: MOTION.start,
      once: true,
      onEnter: (batch) => {
        // These tweens start later, outside the context's setup, so register them with it.
        ctx.add(() => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            ease: MOTION.ease.spring,
            stagger: MOTION.stagger,
            clearProps: 'opacity,transform',
          });
          const featured = batch.find((card) => card.classList.contains('sv-pkg--featured'));
          if (featured) {
            gsap.to(featured, {
              '--rule-scale': 1,
              duration: MOTION.packages.ruleDuration,
              ease: MOTION.ease.out,
              delay: MOTION.duration.reveal * 0.5,
              clearProps: '--rule-scale',
            });
          }
        });
      },
    });
  });

  return () => ctx.revert();
}
