// Desktop section rail (Lane B): a vertical wheel on the right edge that shows where you are on
// the page. It is a scale on a drum seen from the side: fine ticks, a taller tick for each
// section with its number, and a fixed orange needle in the middle. As you scroll, the drum turns
// so the section you are in sits under the needle; the scale bunches up, shrinks and fades toward
// the top and bottom, which is what gives it the curved, 3D look. It has no background of its own,
// so it takes the colour of the page behind it (dark ticks on a light section, white on a dark one).
// It is a wayfinding aid only (aria-hidden, no links): the real navigation is the header.
// Section numbers appear nowhere else on the site.
//
// Create this inside the mode's gsap.context so ctx.revert() kills the triggers; the returned
// function removes the rail itself.
//
// Transform and opacity only. The drum turns by scroll position, directly: no animation of its own.

import { ScrollTrigger } from '../../assets/vendor/vendor.js';

const TICKS_PER_GAP = 4; // fine ticks between two section ticks
const TAIL_TICKS = 12; // extra ticks past each end of the scale, so it does not stop at 01 and 08
const STEP = 0.21; // radians the drum turns between one section and the next

const pad = (n) => String(n).padStart(2, '0');

/** @returns {() => void} cleanup */
export function initSectionRail() {
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (sections.length < 2) return () => {};
  const last = sections.length - 1;

  const rail = document.createElement('div');
  rail.className = 'sv-rail';
  rail.setAttribute('aria-hidden', 'true');

  const lens = document.createElement('div');
  lens.className = 'sv-rail__lens';
  const drum = document.createElement('div');
  drum.className = 'sv-rail__drum';

  // Each tick stands on the drum at an angle (--a, set here with the style object, which the
  // content security policy allows). Position 3 means "exactly at section 4".
  const majors = [];
  for (let j = -TAIL_TICKS; j <= last * TICKS_PER_GAP + TAIL_TICKS; j += 1) {
    const tick = document.createElement('span');
    tick.className = 'sv-rail__tick';
    const atSection = j >= 0 && j <= last * TICKS_PER_GAP && j % TICKS_PER_GAP === 0;
    tick.dataset.kind = atSection ? 'major' : j % (TICKS_PER_GAP / 2) === 0 ? 'mid' : 'minor';
    if (atSection) {
      const label = document.createElement('b');
      label.textContent = pad(j / TICKS_PER_GAP + 1);
      tick.append(label);
      majors.push(tick);
    }
    tick.append(document.createElement('i'));
    // Going down the page is going down the scale, so later ticks sit lower on the drum.
    tick.style.setProperty('--a', `${(-j / TICKS_PER_GAP) * STEP}rad`);
    drum.append(tick);
  }

  const needle = document.createElement('span');
  needle.className = 'sv-rail__needle';
  lens.append(drum);
  rail.append(lens, needle);
  document.body.append(rail);

  // Dark sections (hero, the charcoal section) need light ticks.
  const isDark = (section) =>
    section.matches('.sv-hero, .sv-section--dark') ? 'dark' : 'light';

  function activate(index) {
    majors.forEach((tick, i) => tick.toggleAttribute('data-active', i === index));
    rail.dataset.tone = isDark(sections[index]);
  }

  // One trigger per section: it says which section is current and where each one starts and ends
  // (ScrollTrigger accounts for the pinned folds).
  const triggers = sections.map((section, index) =>
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) activate(index);
      },
    }),
  );
  activate(0);

  // Turn the drum: whole sections plus how far through the current one you are.
  function update() {
    const y = window.scrollY;
    let place = 0;
    for (let i = 0; i <= last; i += 1) {
      const start = i === 0 ? 0 : triggers[i].start; // the first section counts from the very top
      const end = triggers[i].end;
      if (y >= start && y < end) {
        place = i + (y - start) / Math.max(1, end - start);
        break;
      }
      if (y >= end) place = Math.min(i + 1, last);
    }
    drum.style.setProperty('--rail-angle', `${place * STEP}rad`);
  }

  const watcher = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: update,
    onRefresh: update,
  });
  update();

  return function destroy() {
    watcher.kill();
    triggers.forEach((trigger) => trigger.kill());
    rail.remove();
  };
}
