// Desktop team entrance (Lane C): the photos rise and fade in one after the other, the first time
// the team comes into view. Opacity and transform only. The caller skips this for reduced motion.
// Makes its own gsap.context; the returned cleanup removes triggers and inline styles.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initTeamReveal() {
  const people = [...document.querySelectorAll('[data-team-person]')];
  if (!people.length) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.set(people, { opacity: 0, y: MOTION.about.riseOffset * 1.5 });

    ScrollTrigger.batch(people, {
      start: MOTION.start,
      once: true,
      onEnter: (batch) => {
        ctx.add(() => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            ease: MOTION.ease.out,
            stagger: MOTION.stagger,
            clearProps: 'opacity,transform',
          });
        });
      },
    });
  });

  return () => ctx.revert();
}
