// Desktop section rail (Lane B): a slim progress rail on the right edge. One tick per section,
// the current section's number shows, and a thin line fills as the page scrolls. It is a
// wayfinding aid only (aria-hidden, no links): the real navigation is the header.
// Section numbers appear nowhere else on the site.
//
// Create this inside the mode's gsap.context so ctx.revert() kills the triggers; the returned
// function removes the rail itself.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';

/** @returns {() => void} cleanup */
export function initSectionRail() {
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (sections.length < 2) return () => {};

  const rail = document.createElement('div');
  rail.className = 'sv-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML =
    '<span class="sv-rail__track"><span class="sv-rail__fill"></span></span>' +
    '<ol class="sv-rail__list">' +
    sections
      .map(
        (_section, index) =>
          `<li class="sv-rail__item"><span class="sv-rail__num">${String(index + 1).padStart(2, '0')}</span><span class="sv-rail__tick"></span></li>`,
      )
      .join('') +
    '</ol>';
  document.body.append(rail);

  const items = [...rail.querySelectorAll('.sv-rail__item')];
  const fill = rail.querySelector('.sv-rail__fill');

  // Dark sections (hero, the charcoal section) need light ticks.
  const isDark = (section) =>
    section.matches('.sv-hero, .sv-section--dark') ? 'dark' : 'light';

  function activate(index) {
    items.forEach((item, i) => item.toggleAttribute('data-active', i === index));
    rail.dataset.tone = isDark(sections[index]);
  }

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) activate(index);
      },
    });
  });
  activate(0);

  gsap.to(fill, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true },
  });

  return function destroy() {
    rail.remove();
  };
}
