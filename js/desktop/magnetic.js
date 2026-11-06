// Magnetic button (Lane B). Elements marked data-magnetic (the hero's "Get a free quote") lean a
// few pixels toward the mouse when it comes near, and settle back when it leaves.
// Mouse users only (a fine pointer, no reduced motion). Max pull is MOTION.magnetic.max px.
//
// The pull is written to two CSS variables (--mx, --my). The stylesheet turns them into the
// individual `translate` property, so it never fights the button's own `transform` (the press
// scale on :active) or its CSS transitions. The returned cleanup removes the variables.

import { gsap } from '../../assets/vendor/vendor.js';
import { allowPointerExtras } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** @returns {() => void} cleanup */
export function initMagnetic() {
  if (!allowPointerExtras()) return () => {};

  const items = [...document.querySelectorAll('[data-magnetic]')].map((el) => ({
    el,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  }));
  if (!items.length) return () => {};

  const { max, reach, follow } = MOTION.magnetic;

  function onMove(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      // Measure from where the button rests, not from where it has been pulled to.
      const cx = rect.left + rect.width / 2 - item.x;
      const cy = rect.top + rect.height / 2 - item.y;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const halfW = rect.width / 2 + reach;
      const halfH = rect.height / 2 + reach;
      if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
        item.targetX = 0;
        item.targetY = 0;
      } else {
        item.targetX = clamp(dx / halfW, -1, 1) * max;
        item.targetY = clamp(dy / halfH, -1, 1) * max;
      }
    }
  }

  function release(event) {
    if (event?.type === 'mouseout' && event.relatedTarget) return; // still inside the window
    for (const item of items) {
      item.targetX = 0;
      item.targetY = 0;
    }
  }

  // Ease toward the target a little each frame (frame-rate independent).
  function tick(_time, deltaTime) {
    const k = 1 - Math.pow(1 - follow, deltaTime / 16.667);
    for (const item of items) {
      const nextX = item.x + (item.targetX - item.x) * k;
      const nextY = item.y + (item.targetY - item.y) * k;
      const settled =
        item.targetX === 0 &&
        item.targetY === 0 &&
        Math.abs(nextX) < 0.05 &&
        Math.abs(nextY) < 0.05;
      if (settled) {
        if (item.x !== 0 || item.y !== 0) {
          item.x = 0;
          item.y = 0;
          item.el.style.removeProperty('--mx');
          item.el.style.removeProperty('--my');
        }
        continue;
      }
      if (Math.abs(nextX - item.x) < 0.01 && Math.abs(nextY - item.y) < 0.01) continue;
      item.x = nextX;
      item.y = nextY;
      item.el.style.setProperty('--mx', `${nextX.toFixed(2)}px`);
      item.el.style.setProperty('--my', `${nextY.toFixed(2)}px`);
    }
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('mouseout', release);
  window.addEventListener('blur', release);
  gsap.ticker.add(tick);

  return function destroy() {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('mouseout', release);
    window.removeEventListener('blur', release);
    gsap.ticker.remove(tick);
    for (const item of items) {
      item.el.style.removeProperty('--mx');
      item.el.style.removeProperty('--my');
    }
  };
}
