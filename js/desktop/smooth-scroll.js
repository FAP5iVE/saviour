// Desktop smooth scroll (Lane B): Lenis, wired to ScrollTrigger.
// Only for mouse users who have not asked for reduced motion. Never on touch.
// Returns null when Lenis is not allowed, so callers fall back to native scrolling.

import { gsap, ScrollTrigger, Lenis } from '../../assets/vendor/vendor.js';
import { allowPointerExtras } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

/**
 * @returns {null | { lenis: Lenis, scrollTo: (target: Element, options?: { immediate?: boolean }) => void, destroy: () => void }}
 */
export function initSmoothScroll() {
  if (!allowPointerExtras()) return null;

  const lenis = new Lenis({ syncTouch: false });

  // The wiring from the motion spec, exactly.
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    scrollTo(target, { immediate = false } = {}) {
      // Lenis learns the page height from a ResizeObserver, which is a frame behind when pin
      // spacing was just added. Without this a jump to a section below the showcase is clamped
      // to the old, shorter page.
      lenis.resize();
      lenis.scrollTo(target, { offset: 0, duration: MOTION.duration.page, immediate });
    },
    destroy() {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's defaults, turned off above for Lenis
      lenis.destroy();
    },
  };
}
