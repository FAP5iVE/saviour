// Measure the scroll triggers again once the things that change the page's height have settled:
// fonts (text re-flows when the real font arrives) and the page "load" (images and styles).
// docs/04 section 9. Both modes call this once from init(); the cleanup removes the listener.
//
// This file must not import from desktop/ or mobile/.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';

/** @returns {() => void} cleanup */
export function refreshWhenReady() {
  let cancelled = false;
  const run = () => {
    if (!cancelled) ScrollTrigger.refresh();
  };

  document.fonts?.ready.then(run);
  if (document.readyState !== 'complete') window.addEventListener('load', run, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', run);
  };
}
