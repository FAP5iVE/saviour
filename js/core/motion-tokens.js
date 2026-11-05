// Motion values used by every animation. Change them here, not inside individual files.
// Mirrors docs/04-motion-spec.md.

export const MOTION = Object.freeze({
  duration: Object.freeze({
    micro: 0.2, // hover, press, small state changes
    reveal: 0.7, // content entering
    page: 1.0, // page-level moves (folds, hero)
  }),
  ease: Object.freeze({
    out: 'power3.out',
    in: 'power2.in',
    spring: 'back.out(1.4)', // sparingly
  }),
  exitFactor: 0.7, // exits run at about 70% of the entrance duration
  stagger: 0.08,
  start: 'top 85%', // default ScrollTrigger start for reveals

  // Hero (js/core/hero-intro.js, js/desktop/hero-scroll.js)
  hero: Object.freeze({
    lineOffset: 110, // yPercent the headline lines start from (hidden under their mask)
    riseOffset: 24, // px the lead and buttons rise from
    overlap: 0.4, // seconds the lead starts before the headline finishes
    scaleEnd: 1.08, // media scale at the end of the hero scroll (desktop)
    veilEnd: 0.85, // veil opacity at the end of the hero scroll (desktop)
  }),

  // About, services and packages (phase 3)
  about: Object.freeze({
    scrubFrom: 0.2, // word opacity before it is "read" (desktop scrub)
    scrubStart: 'top 80%',
    scrubEnd: 'bottom 50%',
    countDuration: 1.4, // seconds for a sourced number to count up (desktop, once)
    riseOffset: 24, // px a block rises from on mobile
    lineStagger: 0.06, // seconds between lines of the statement on mobile
  }),
  services: Object.freeze({
    hoverIntent: 140, // ms the pointer must rest on a row before it opens (desktop)
    drawDuration: 0.7, // seconds the service icon takes to draw
    drawStagger: 0.06,
  }),
  packages: Object.freeze({
    riseOffset: 56, // px the cards rise from (desktop)
    ruleDuration: 0.8, // seconds the featured top rule takes to draw
  }),

  // Showcase, why and FAQ (phase 4)
  showcase: Object.freeze({
    scrub: 1, // seconds the horizontal track takes to catch up with the scroll (desktop pin)
    parallax: 10, // px the mini-site inside a panel drifts either way (desktop pin). Keep it below the frame's side padding.
  }),
  why: Object.freeze({
    riseOffset: 20, // px the proof line rises from
    proofDelay: 0.25, // seconds the proof line waits after its statement starts
  }),
  faq: Object.freeze({
    refreshDelay: 400, // ms to wait for a row to finish opening before measuring the page again
  }),

  // Mobile menu sheet and action bar
  menu: Object.freeze({
    itemOffset: 28, // px the menu links rise from
  }),

  // Header on desktop
  header: Object.freeze({
    hideAfter: 120, // px scrolled before the bar may hide
    minDelta: 6, // px of scroll that counts as a direction change
  }),
});
