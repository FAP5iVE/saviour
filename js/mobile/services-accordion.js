// Mobile services list (Lane C): tap a row to open it, tap again to close. One row open at a time.
// The opening itself is CSS (grid rows); the plus turns into a cross with CSS too.
// Opening or closing a row moves everything below it, so the scroll triggers are measured
// again once the row has finished moving.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';
import { initAccordion } from '../core/accordion.js';

/** @returns {() => void} cleanup */
export function initServicesAccordion() {
  const list = document.querySelector('[data-accordion="services"]');
  if (!list) return () => {};

  let timer = 0;
  const accordion = initAccordion(list, {
    single: true,
    onToggle: () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 400);
    },
  });

  return () => {
    clearTimeout(timer);
    accordion.destroy();
  };
}
