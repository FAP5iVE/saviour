// Desktop hero scroll effect (Lane B): as the hero leaves, the poster or video grows slowly
// (1 to 1.08) and the blue veil deepens. Scrubbed to the scroll position, transform and opacity only.
// Create this inside the mode's gsap.context so ctx.revert() removes it.
//
// Note for the motion pass: Fold 1 (Hero to About) will pin the hero. When it is built, merge
// this effect into fold.js so the two do not fight over the same trigger.

import { gsap } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

export function initHeroScroll() {
  const hero = document.querySelector('[data-hero]');
  const media = hero?.querySelector('[data-hero-media]');
  const veil = hero?.querySelector('[data-hero-veil]');
  if (!hero || !media || !veil) return;

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    .to(media, { scale: MOTION.hero.scaleEnd }, 0)
    .to(veil, { opacity: MOTION.hero.veilEnd }, 0);
}
