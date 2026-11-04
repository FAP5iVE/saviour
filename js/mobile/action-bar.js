// Mobile floating action bar (Lane B): WhatsApp, Call and Free quote, always within thumb reach.
// It stays out of the way while the hero is on screen and slides up once the visitor scrolls past.
// CSS shows it at all times when JavaScript is off.

/** @returns {() => void} cleanup */
export function initActionBar() {
  const bar = document.querySelector('[data-action-bar]');
  const hero = document.querySelector('[data-hero]');
  if (!bar || !hero) return () => {};

  // The top 30% of the screen is ignored, so the bar appears a little before the hero is gone.
  const observer = new IntersectionObserver(
    ([entry]) => {
      const show = !entry.isIntersecting;
      bar.classList.toggle('is-visible', show);
      if (show) bar.dataset.pulse = ''; // the one-time WhatsApp pulse (CSS plays it once)
    },
    { rootMargin: '-30% 0px 0px 0px' },
  );
  observer.observe(hero);

  return function destroy() {
    observer.disconnect();
    bar.classList.remove('is-visible');
    delete bar.dataset.pulse;
  };
}
