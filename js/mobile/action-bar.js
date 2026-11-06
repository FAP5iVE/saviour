// Mobile floating action bar (Lane B): WhatsApp, Call and Free quote, always within thumb reach.
// It stays out of the way while the hero is on screen and slides up once the visitor scrolls past.
// It also steps aside while the contact section is on screen: the section has its own WhatsApp
// button and phone number, and the bar would cover the lower edge of the form.
// CSS shows it at all times when JavaScript is off.

/** @returns {() => void} cleanup */
export function initActionBar() {
  const bar = document.querySelector('[data-action-bar]');
  const hero = document.querySelector('[data-hero]');
  const contact = document.getElementById('contact');
  if (!bar || !hero) return () => {};

  let pastHero = false;
  let inContact = false;
  let pulsed = false;

  function apply() {
    const show = pastHero && !inContact;
    bar.classList.toggle('is-visible', show);
    if (show && !pulsed) {
      pulsed = true;
      bar.dataset.pulse = ''; // the one-time WhatsApp pulse (CSS plays it once)
    }
  }

  // The top 30% of the screen is ignored, so the bar appears a little before the hero is gone.
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      pastHero = !entry.isIntersecting;
      apply();
    },
    { rootMargin: '-30% 0px 0px 0px' },
  );
  heroObserver.observe(hero);

  let contactObserver = null;
  if (contact) {
    contactObserver = new IntersectionObserver(([entry]) => {
      inContact = entry.isIntersecting;
      apply();
    });
    contactObserver.observe(contact);
  }

  return function destroy() {
    heroObserver.disconnect();
    contactObserver?.disconnect();
    bar.classList.remove('is-visible');
    delete bar.dataset.pulse;
  };
}
