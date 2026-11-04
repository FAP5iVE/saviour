// Desktop header behaviour (Lane B), driven by ScrollTrigger:
//   - Over the hero the bar is transparent with white text (data-over-hero).
//   - Past the hero it turns solid paper.
//   - Scrolling down hides it, scrolling up brings it back (data-hidden).
// Without JavaScript the bar is simply solid. Create this inside the mode's gsap.context so
// ctx.revert() kills the triggers; the returned function undoes the attributes.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/**
 * @param {{ allowHide?: boolean }} [options] allowHide is false for reduced motion
 * @returns {() => void} cleanup
 */
export function initHeaderScroll({ allowHide = true } = {}) {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('[data-hero]');
  if (!header || !hero) return () => {};

  const overHero = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: () => `bottom top+=${header.offsetHeight}`,
    invalidateOnRefresh: true,
    // progress < 1 (not isActive): at scroll position 0 the trigger is not "active", so using
    // isActive left the bar solid after scrolling back to the very top.
    onUpdate: (self) => header.toggleAttribute('data-over-hero', self.progress < 1),
  });
  header.toggleAttribute('data-over-hero', overHero.progress < 1);

  let lastY = window.scrollY;
  const direction = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (!allowHide) return;
      const y = self.scroll();
      const delta = y - lastY;
      if (Math.abs(delta) < MOTION.header.minDelta) return;
      lastY = y;

      const pastStart = y > MOTION.header.hideAfter;
      const scrollingDown = delta > 0;
      const stayVisible = !pastStart || header.hasAttribute('data-over-hero');
      header.toggleAttribute('data-hidden', scrollingDown && !stayVisible);
    },
  });

  return function destroy() {
    overHero.kill();
    direction.kill();
    header.removeAttribute('data-over-hero');
    header.removeAttribute('data-hidden');
  };
}
