// Desktop footer (Lane B): the big wordmark drifts up into place as the footer scrolls into view,
// rising out from behind the bottom bar. Transform only, scrubbed to the scroll. The caller skips
// this for reduced motion. Makes its own gsap.context; the returned cleanup reverts it.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initFooterDrift() {
  const footer = document.querySelector('[data-footer]');
  const wordmark = footer?.querySelector('[data-footer-wordmark]');
  if (!footer || !wordmark) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    gsap.fromTo(
      wordmark,
      { yPercent: MOTION.footer.drift },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return () => ctx.revert();
}
