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

/** Connection types too slow for a hero video. Unknown (Safari/Firefox) is handled in canPlayHeroVideo. */
export function connectionAllowsVideo() {
  const type = navigator.connection?.effectiveType;
  if (!type) return null; // unknown
  return type === '4g';
}

/** True when the page is served from the developer's own machine (npm run dev). */
export const isLocalDev = () =>
  ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ||
  location.hostname.endsWith('.localhost');

/** Hero video is an enhancement. Poster alone must always work. */
export function canPlayHeroVideo() {
  if (prefersReducedMotion()) return false;
  // Local testing: the connection and Save-Data checks are about real visitors on slow or
  // metered networks. They do not apply on localhost, even when offline or throttled.
  if (isLocalDev()) return true;
  if (saveDataOn()) return false;
  const known = connectionAllowsVideo();
  if (known === null) return isDesktopLayout(); // unknown connection: desktop layout only
  return known;
}
