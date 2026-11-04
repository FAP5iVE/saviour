// Mobile reveals (Lane C): lighter than desktop, and once only (no scrub).
//   - The About statement fades up line by line.
//   - Every other [data-reveal] block (sourced numbers, "who we are", package cards) fades up
//     as it comes in, using one batched trigger instead of one per element.
// Opacity and transform only. The caller skips this for reduced motion.
// Makes its own gsap.context; the returned cleanup removes triggers and inline styles.

import { gsap, ScrollTrigger, SplitText } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initReveal() {
  const statements = [...document.querySelectorAll('[data-scrub]')];
  const blocks = [...document.querySelectorAll('[data-reveal]')];
  if (!statements.length && !blocks.length) return () => {};

  gsap.registerPlugin(ScrollTrigger, SplitText);
  let cancelled = false;

  const ctx = gsap.context(() => {
    gsap.set(blocks, { opacity: 0, y: MOTION.about.riseOffset });

    ScrollTrigger.batch(blocks, {
      start: 'top 90%',
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

  // Lines are measured after fonts load, or they would break in the wrong places.
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (cancelled) return;
    ctx.add(() => {
      for (const el of statements) {
        SplitText.create(el, {
          type: 'lines',
          autoSplit: true, // splits again if the width changes (rotating the phone)
          onSplit(self) {
            return gsap.from(self.lines, {
              opacity: 0,
              y: MOTION.about.riseOffset,
              duration: MOTION.duration.reveal,
              ease: MOTION.ease.out,
              stagger: MOTION.about.lineStagger,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
          },
        });
      }
    });
  });

  return () => {
    cancelled = true;
    ctx.revert();
  };
}
