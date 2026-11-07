// Desktop showcase (Lane D): the section does not pin, so the page scrolls straight through it.
// The six panels sit in a sideways row, and a slim custom scroll bar under the row moves it.
//
// Ways to move the row, all of which keep the bar in step:
//   - drag the blue thumb (the row follows the pointer 1:1, then settles on the nearest panel)
//   - click the track to jump to the panel nearest that spot
//   - arrow keys, Home, End, Page Up and Page Down when the bar has focus (it is a slider)
//   - a sideways trackpad swipe or a mouse with a tilt wheel, over the row
//   - Left and Right arrows while the row itself has focus
// Plain mouse-wheel scrolling (up and down) is never captured: it always scrolls the page.
//
// Without this file (scripts failed) the same markup is a native sideways scroll row with a
// scrollbar, so nothing is lost. data-bar on the section is what switches the CSS over.
//
// The row moves by scrollLeft, which is the browser's own scrolling, not an animated layout
// property. The thumb moves by transform only.
//
// Returns a cleanup that puts back everything it changed.

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { prefersReducedMotion } from '../core/env.js';
import { MOTION } from '../core/motion-tokens.js';

// Values from motion-tokens.js. The defaults only matter if an older motion-tokens.js is paired
// with this file; the bar then still works.
const CFG = { settle: 0.55, idle: 160, flick: 180, swipeMin: 60, ...MOTION.showcase };

const pad = (n) => String(n).padStart(2, '0');

/** @returns {() => void} cleanup */
export function initShowcaseBar() {
  const section = document.querySelector('[data-showcase]');
  const viewport = section?.querySelector('[data-showcase-viewport]');
  const track = section?.querySelector('[data-showcase-track]');
  const panels = track ? [...track.querySelectorAll('[data-showcase-panel]')] : [];
  if (!section || !viewport || !track || panels.length < 2) return () => {};

  // --- Build the bar row: the bar (track, notches, thumb) and a counter ---
  const names = panels.map(
    (panel) => panel.querySelector('.sv-demo__name')?.textContent.trim().replace(/\s+/g, ' ') ?? '',
  );

  const row = document.createElement('div');
  row.className = 'sv-bar-row';

  const bar = document.createElement('div');
  bar.className = 'sv-bar';
  bar.setAttribute('role', 'slider');
  bar.setAttribute('tabindex', '0');
  bar.setAttribute('aria-label', 'Showcase scroll bar. Use the arrow keys to move through the six projects.');
  bar.setAttribute('aria-orientation', 'horizontal');
  bar.setAttribute('aria-valuemin', '1');
  bar.setAttribute('aria-valuemax', String(panels.length));

  const rail = document.createElement('span');
  rail.className = 'sv-bar__track';
  const notches = panels.map(() => {
    const notch = document.createElement('span');
    notch.className = 'sv-bar__notch';
    rail.append(notch);
    return notch;
  });
  const thumb = document.createElement('span');
  thumb.className = 'sv-bar__thumb';
  bar.append(rail, thumb);

  const count = document.createElement('p');
  count.className = 'sv-bar__count';
  count.setAttribute('aria-hidden', 'true');
  const countNow = document.createElement('span');
  count.append(countNow, ` / ${pad(panels.length)}`);

  row.append(bar, count);
  section.append(row);

  const hadTabindex = viewport.getAttribute('tabindex');
  section.setAttribute('data-bar', '');

  // --- Measurements ---
  let stops = []; // scrollLeft value that brings each panel to the left edge (capped at the end)
  let railWidth = 1;
  let thumbWidth = 1;

  const distance = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const clamp = (value) => Math.min(Math.max(value, 0), distance());

  function measure() {
    stops = panels.map((panel) => clamp(panel.offsetLeft));
    railWidth = Math.max(1, rail.getBoundingClientRect().width);
    const share = viewport.scrollWidth > 0 ? viewport.clientWidth / viewport.scrollWidth : 1;
    thumbWidth = Math.min(railWidth, Math.max(48, share * railWidth)); // never thinner than 48 px
    thumb.style.width = `${thumbWidth}px`;
    // A notch marks where the thumb's centre sits when the row is on that panel.
    const total = distance();
    const travel = railWidth - thumbWidth;
    stops.forEach((stop, index) => {
      const at = (total > 0 ? stop / total : 0) * travel + thumbWidth / 2;
      notches[index].style.left = `${at}px`;
    });
  }

  function nearestIndex(x) {
    if (x >= distance() - 2) return stops.length - 1; // the last panel can never reach the left edge
    let best = 0;
    let bestGap = Infinity;
    stops.forEach((stop, index) => {
      const gap = Math.abs(stop - x);
      if (gap < bestGap) {
        best = index;
        bestGap = gap;
      }
    });
    return best;
  }

  // --- Keep the thumb and counter in step with the row ---
  let shown = -1;
  let frame = 0;

  function update() {
    frame = 0;
    const total = distance();
    const x = viewport.scrollLeft;
    const share = total > 0 ? Math.min(Math.max(x / total, 0), 1) : 0;
    thumb.style.transform = `translateX(${share * (railWidth - thumbWidth)}px)`;

    const index = nearestIndex(x);
    if (index !== shown) {
      shown = index;
      countNow.textContent = pad(index + 1);
      bar.setAttribute('aria-valuenow', String(index + 1));
      bar.setAttribute(
        'aria-valuetext',
        `${index + 1} of ${panels.length}${names[index] ? `: ${names[index]}` : ''}`,
      );
    }
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  // --- Moving the row ---
  let tween = null;
  let idleTimer = 0;
  let drag = null;
  let resting = 0; // where the row last came to rest, so a short swipe still moves one panel on

  function stopTween() {
    tween?.kill();
    tween = null;
  }

  function goTo(x) {
    stopTween();
    const target = clamp(x);
    resting = target;
    if (prefersReducedMotion() || Math.abs(target - viewport.scrollLeft) < 1) {
      viewport.scrollLeft = target;
      return;
    }
    tween = gsap.to(viewport, {
      scrollLeft: target,
      duration: CFG.settle,
      ease: MOTION.ease.out,
      overwrite: true,
      onComplete: () => {
        tween = null;
      },
    });
  }

  // After a swipe the row settles on the nearest panel, but a swipe of any real length moves at
  // least one panel in its direction (otherwise a short swipe would just spring back).
  function settle() {
    const x = viewport.scrollLeft;
    const lastIndex = stops.length - 1;
    const from = nearestIndex(resting);
    let to = nearestIndex(x);
    if (x - resting > CFG.swipeMin) to = Math.max(to, Math.min(from + 1, lastIndex));
    else if (resting - x > CFG.swipeMin) to = Math.min(to, Math.max(from - 1, 0));
    goTo(stops[to]);
  }

  function step(direction) {
    const x = viewport.scrollLeft;
    const next =
      direction > 0 ? stops.find((stop) => stop > x + 2) : [...stops].reverse().find((stop) => stop < x - 2);
    if (next !== undefined) goTo(next);
  }

  // A scroll the visitor made without the bar (trackpad swipe, Tab into a panel) ends on a panel.
  function onScroll() {
    schedule();
    clearTimeout(idleTimer);
    if (drag || tween) return;
    idleTimer = setTimeout(settle, CFG.idle);
  }

  // --- Dragging the thumb, or clicking the track ---
  function onPointerDown(event) {
    if (event.button !== 0) return;
    stopTween();
    clearTimeout(idleTimer);

    if (!thumb.contains(event.target)) {
      // A click on the bare track: jump to the panel nearest that spot (the thumb centres on it).
      const box = rail.getBoundingClientRect();
      const travel = Math.max(1, railWidth - thumbWidth);
      const share = Math.min(Math.max((event.clientX - box.left - thumbWidth / 2) / travel, 0), 1);
      goTo(stops[nearestIndex(share * distance())]);
      return;
    }

    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startLeft: viewport.scrollLeft,
      samples: [{ time: event.timeStamp, left: viewport.scrollLeft }],
    };
    bar.setAttribute('data-dragging', '');
    bar.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const travel = Math.max(1, railWidth - thumbWidth);
    // The thumb follows the pointer exactly: its travel along the track maps to the whole row.
    const left = clamp(drag.startLeft + (event.clientX - drag.startX) * (distance() / travel));
    viewport.scrollLeft = left;
    drag.samples.push({ time: event.timeStamp, left });
    if (drag.samples.length > 6) drag.samples.shift();
  }

  function onPointerEnd(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const samples = drag.samples;
    drag = null;
    bar.removeAttribute('data-dragging');
    if (bar.hasPointerCapture(event.pointerId)) bar.releasePointerCapture(event.pointerId);

    // A flick carries on a little: project where the row was heading, then settle there.
    const first = samples[0];
    const latest = samples[samples.length - 1];
    const elapsed = Math.max(1, latest.time - first.time);
    const speed = (latest.left - first.left) / elapsed; // px of scroll per ms
    const recent = event.timeStamp - latest.time < 80;
    const projected = viewport.scrollLeft + (recent ? speed * CFG.flick : 0);
    goTo(stops[nearestIndex(clamp(projected))]);
  }

  // --- Sideways wheel or trackpad over the row. Up and down is left to the page. ---
  function onWheel(event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    stopTween();
    viewport.scrollLeft += event.deltaX;
  }

  // --- Keyboard ---
  function onBarKey(event) {
    const keys = {
      ArrowRight: () => step(1),
      ArrowUp: () => step(1),
      PageDown: () => step(1),
      ArrowLeft: () => step(-1),
      ArrowDown: () => step(-1),
      PageUp: () => step(-1),
      Home: () => goTo(stops[0]),
      End: () => goTo(stops[stops.length - 1]),
    };
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  }

  function onViewportKey(event) {
    if (event.target !== viewport) return; // only when the row itself has focus
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  }

  // --- The page below this section must be measured again if the section changes height ---
  let measuredHeight = section.offsetHeight;
  let heightTimer = 0;
  const watcher = new ResizeObserver(() => {
    measure();
    schedule();
    clearTimeout(heightTimer);
    heightTimer = setTimeout(() => {
      const height = section.offsetHeight;
      if (Math.abs(height - measuredHeight) > 1) {
        measuredHeight = height;
        ScrollTrigger.refresh();
      }
    }, 150);
  });
  watcher.observe(section);
  watcher.observe(viewport);
  watcher.observe(track);
  watcher.observe(bar);

  viewport.scrollLeft = 0;
  measure();
  update();

  viewport.addEventListener('scroll', onScroll, { passive: true });
  viewport.addEventListener('keydown', onViewportKey);
  viewport.addEventListener('wheel', onWheel, { passive: false });
  bar.addEventListener('pointerdown', onPointerDown);
  bar.addEventListener('pointermove', onPointerMove);
  bar.addEventListener('pointerup', onPointerEnd);
  bar.addEventListener('pointercancel', onPointerEnd);
  bar.addEventListener('keydown', onBarKey);

  return function destroy() {
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    clearTimeout(heightTimer);
    stopTween();
    watcher.disconnect();
    viewport.removeEventListener('scroll', onScroll);
    viewport.removeEventListener('keydown', onViewportKey);
    viewport.removeEventListener('wheel', onWheel);
    bar.removeEventListener('pointerdown', onPointerDown);
    bar.removeEventListener('pointermove', onPointerMove);
    bar.removeEventListener('pointerup', onPointerEnd);
    bar.removeEventListener('pointercancel', onPointerEnd);
    bar.removeEventListener('keydown', onBarKey);

    row.remove();
    section.removeAttribute('data-bar');
    viewport.scrollLeft = 0;
    if (hadTabindex !== null) viewport.setAttribute('tabindex', hadTabindex);
  };
}
