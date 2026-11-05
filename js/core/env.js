// Environment checks shared by both modes. This file must not import from desktop/ or mobile/.
//
// Two separate questions:
//   1. Which LAYOUT module? Decided by width only (LAYOUT_QUERY).
//   2. Which mouse-only EXTRAS (custom cursor, magnetic buttons, Lenis)? Need a fine pointer
//      and no reduced-motion preference, regardless of width.

export const LAYOUT_QUERY = '(min-width: 1024px)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const isDesktopLayout = () => window.matchMedia(LAYOUT_QUERY).matches;
export const hasFinePointer = () => window.matchMedia(FINE_POINTER_QUERY).matches;
export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** True when mouse-only motion extras are allowed. */
export const allowPointerExtras = () => hasFinePointer() && !prefersReducedMotion();

export const saveDataOn = () => navigator.connection?.saveData === true;

/**
 * The connection type the browser reports, or null when it does not say (Safari, Firefox).
 * "effectiveType" is a guess from recent round-trip time, not a speed test. On Malawian mobile
 * networks it often says "3g" or even "2g" on a perfectly usable 4G line, so it is only used to
 * rule out the very slow cases and to pick the lighter clip.
 */
export const connectionType = () => navigator.connection?.effectiveType ?? null;

/** True when the connection is modest: the video still plays, but the light mobile clip is used. */
export const connectionIsModest = () => connectionType() === '3g';

/** True when the page is served from the developer's own machine (npm run dev). */
export const isLocalDev = () =>
  ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ||
  location.hostname.endsWith('.localhost');

/**
 * Why the hero video must NOT load right now, or null when it may.
 * The reason is also written to the video element (data-state) so it can be read in DevTools.
 *
 * Blocked only when the visitor asked for less (reduced motion, Save-Data) or the browser reports
 * a 2g-class connection. Everything else plays, including 3g and "unknown": the poster is already
 * on screen, the clip loads after the page "load" event, and 3g visitors get the light clip.
 */
export function heroVideoBlocker() {
  if (prefersReducedMotion()) return 'reduced-motion';
  // Local testing: the connection and Save-Data checks are about real visitors on slow or
  // metered networks. They do not apply on localhost, even when offline or throttled.
  if (isLocalDev()) return null;
  if (saveDataOn()) return 'save-data';
  const type = connectionType();
  if (type === 'slow-2g' || type === '2g') return 'slow-connection';
  return null;
}

/** Hero video is an enhancement. Poster alone must always work. */
export const canPlayHeroVideo = () => heroVideoBlocker() === null;
