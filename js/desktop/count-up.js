// Desktop sourced numbers (Lane C): each figure counts up once, the first time it scrolls into
// view. The real number is already in the HTML, so no JavaScript, reduced motion and a failed
// script all show the true figure. The caller skips this for reduced motion.
// Makes its own gsap.context; the returned cleanup stops the counting and restores the text.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

/** @returns {() => void} cleanup */
export function initCountUp() {
  const targets = [...document.querySelectorAll('[data-count]')];
  if (!targets.length) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const originals = new Map(targets.map((el) => [el, el.textContent]));

  const ctx = gsap.context(() => {
    for (const el of targets) {
      const end = Number.parseFloat(el.dataset.count);
      const decimals = Number.parseInt(el.dataset.decimals ?? '0', 10);
      if (!Number.isFinite(end)) continue;

      const counter = { value: 0 };
      el.textContent = counter.value.toFixed(decimals);

      gsap.to(counter, {
        value: end,
        duration: MOTION.about.countDuration,
        ease: MOTION.ease.out,
        onUpdate: () => {
          el.textContent = counter.value.toFixed(decimals);
        },
        onComplete: () => {
          el.textContent = originals.get(el); // exactly what the HTML says
        },
        scrollTrigger: { trigger: el, start: MOTION.start, once: true },
      });
    }
  });

  return () => {
    ctx.revert();
    originals.forEach((text, el) => {
      el.textContent = text;
    });
  };
}
