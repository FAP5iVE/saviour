// FAQ accordion for both modes (Lane D). A thin wrapper around the shared accordion: one answer
// open at a time, every question a real button with aria-expanded and aria-controls.
//
// Opening or closing an answer moves everything below it, so the scroll triggers are measured
// again once the row has finished moving. With no JavaScript every answer is simply visible.
//
// This file must not import from desktop/ or mobile/.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';
import { initAccordion } from './accordion.js';
import { MOTION } from './motion-tokens.js';

/** @returns {() => void} cleanup */
export function initFaq() {
  const list = document.querySelector('[data-accordion="faq"]');
  if (!list) return () => {};

  let timer = 0;
  const accordion = initAccordion(list, {
    single: true,
    onToggle: () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), MOTION.faq.refreshDelay);
    },
  });

  return () => {
    clearTimeout(timer);
    accordion.destroy();
  };
}
