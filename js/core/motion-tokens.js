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

  // Hero (js/core/hero-intro.js, and the hero part of js/desktop/fold.js)
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
    refreshDelay: 400, // ms to wait for a row to finish opening before measuring the page again
  }),
  packages: Object.freeze({
    riseOffset: 56, // px the cards rise from (desktop)
    ruleDuration: 0.8, // seconds the featured top rule takes to draw
  }),

  // Footer (desktop): the wordmark rises out from behind the bottom bar
  footer: Object.freeze({
    drift: 28, // yPercent the wordmark starts below its place
  }),

  // Showcase scroll bar (phase 10), why and FAQ (phase 4)
  showcase: Object.freeze({
    settle: 0.55, // seconds the row takes to glide onto a panel after a drag, a key or a swipe
    idle: 160, // ms of stillness after a sideways swipe before the row settles on a panel
    swipeMin: 60, // px of sideways swipe that counts as "go to the next panel" rather than a wobble
    flick: 180, // ms of speed carried on after the pointer is released, for a flick
  }),
  why: Object.freeze({
    riseOffset: 20, // px the proof line rises from
    proofDelay: 0.25, // seconds the proof line waits after its statement starts
  }),
  faq: Object.freeze({
    refreshDelay: 400, // ms to wait for a row to finish opening before measuring the page again
  }),

  // Loader (js/core/loader.js). First visit of a session only. Total about 1.25 s on desktop and
  // 1.0 s on a phone (docs/01 asks for 1.2 s at most; docs/04 for a mark that draws in about 0.9 s).
  loader: Object.freeze({
    draw: 0.75, // seconds the mark takes to draw and fill (desktop)
    drawMobile: 0.55, // same on a phone
    hold: 0.05, // seconds the finished mark rests before the curtain moves
    curtain: 0.45, // seconds the curtain takes to slide up (desktop)
    curtainMobile: 0.4,
    gateAt: 0.4, // share of the curtain move at which the hero headline may start
    logoRise: 10, // px the finished logo rises from while it fades in
    markLift: 28, // px the mark rises as the curtain leaves
    failsafe: 3000, // ms after which the hero stops waiting for the loader
  }),

  // Section folds (js/desktop/fold.js). Desktop only; phones fade and rise instead.
  fold: Object.freeze({
    scale: 0.96, // size the section underneath shrinks to
    dim: 0.55, // opacity of the dark layer over the section underneath at the end of the fold
    contentOpacity: 0.4, // hero text fades to this while the About section covers it
  }),

  // Custom cursor and magnetic button (desktop, fine pointer, no reduced motion)
  cursor: Object.freeze({
    ringDuration: 0.35, // seconds the ring takes to catch up with the dot
    linkScale: 1.6, // ring size over links and buttons
    discScale: 2.2, // ring size when it becomes a labelled disc (showcase)
    dotFade: 0.2, // seconds for dot and ring state changes
    labels: Object.freeze({ view: 'View', drag: 'Drag' }),
  }),
  magnetic: Object.freeze({
    max: 8, // px the button may be pulled toward the pointer
    reach: 56, // px around the button inside which it starts to follow
    follow: 0.18, // share of the remaining distance covered per frame at 60 fps
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
