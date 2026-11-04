// Entry file for the vendor bundle. esbuild turns this into ONE self-hosted file:
// assets/vendor/vendor.js. Site code imports from that file, never from a CDN.
//
// Add a GSAP plugin here only if the motion spec (docs/04-motion-spec.md) needs it.

export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
export { SplitText } from 'gsap/SplitText';
export { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Lenis exposes its class as the default export in 1.x. Accept a named export too,
// so a future major version doesn't break the bundle silently.
import * as LenisModule from 'lenis';
export const Lenis = LenisModule.default ?? LenisModule.Lenis;
