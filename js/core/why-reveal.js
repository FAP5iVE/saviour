// "Why choose us" reveal for both modes (Lane D). Each big statement slides up line by line from
// under a mask (SplitText), then its proof line fades in. Plays once, no scrub, so it is the same
// light effect on a phone and on a desktop. Opacity and transform only.
//
// Makes its own gsap.context; the returned cleanup removes the triggers and puts the text back.
// The caller skips this for reduced motion. This file must not import from desktop/ or mobile/.

import { gsap, ScrollTrigger, SplitText } from '../../assets/vendor/vendor.js';
import { MOTION } from './motion-tokens.js';

/** @returns {() => void} cleanup */
export function initWhyReveal() {
  const items = [...document.querySelectorAll('[data-why-item]')];
  if (!items.length) return () => {};

  gsap.registerPlugin(ScrollTrigger, SplitText);
  let cancelled = false;
  const ctx = gsap.context(() => {});

  // Lines are measured after the fonts load, or they would break in the wrong places.
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (cancelled) return;
    ctx.add(() => {
      for (const item of items) {
        const statement = item.querySelector('[data-split="lines"]');
        const proof = item.querySelector('[data-why-proof]');
        if (!statement) continue;

        SplitText.create(statement, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true, // splits again if the width changes (resize, rotating the phone)
          onSplit(self) {
            const tl = gsap.timeline({
              defaults: { ease: MOTION.ease.out },
              scrollTrigger: { trigger: item, start: MOTION.start, once: true },
            });
            tl.fromTo(
              self.lines,
              { yPercent: MOTION.hero.lineOffset },
              { yPercent: 0, duration: MOTION.duration.reveal, stagger: MOTION.stagger },
            );
            if (proof) {
              tl.fromTo(
                proof,
                { opacity: 0, y: MOTION.why.riseOffset },
                {
                  opacity: 1,
                  y: 0,
                  duration: MOTION.duration.reveal,
                  clearProps: 'opacity,transform',
                },
                MOTION.why.proofDelay,
              );
            }
            return tl;
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
