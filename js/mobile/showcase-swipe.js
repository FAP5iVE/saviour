// Mobile showcase (Lane D): the five concept demos are a native swipe row (CSS scroll-snap, the
// next panel peeks in at the edge). No pinning and no scroll hijacking. This file only adds the
// dot indicators under the row and keeps the current dot in step with the swipe.
//
// The dots are decoration (aria-hidden). The row itself is a labelled, keyboard-scrollable region
// in the markup. Works with reduced motion: nothing here animates the scroll.

/** @returns {() => void} cleanup */
export function initShowcaseSwipe() {
  const section = document.querySelector('[data-showcase]');
  const viewport = section?.querySelector('[data-showcase-viewport]');
  const panels = viewport ? [...viewport.querySelectorAll('[data-showcase-panel]')] : [];
  if (!viewport || panels.length < 2) return () => {};

  const dots = document.createElement('div');
  dots.className = 'sv-showcase__dots';
  dots.setAttribute('aria-hidden', 'true');
  const dotEls = panels.map(() => {
    const dot = document.createElement('span');
    dot.className = 'sv-showcase__dot';
    dots.append(dot);
    return dot;
  });
  viewport.after(dots);

  function current() {
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    if (atEnd) return panels.length - 1; // the last panel can never reach the left edge
    let best = 0;
    let bestGap = Infinity;
    panels.forEach((panel, index) => {
      const gap = Math.abs(panel.offsetLeft - viewport.scrollLeft);
      if (gap < bestGap) {
        best = index;
        bestGap = gap;
      }
    });
    return best;
  }

  let frame = 0;
  function update() {
    frame = 0;
    const active = current();
    dotEls.forEach((dot, index) => dot.toggleAttribute('data-active', index === active));
  }

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  viewport.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  return function destroy() {
    cancelAnimationFrame(frame);
    viewport.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    dots.remove();
  };
}
