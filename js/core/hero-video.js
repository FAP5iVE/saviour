// Hero video loader (Lane B). The poster is already on screen; this only adds the clip when
// the visitor's setup can afford it (see canPlayHeroVideo in env.js).
//
//   - Waits for the page "load" event, so the video never competes with first paint.
//   - Desktop layout gets the 720 clip, mobile layout the lighter 480 clip.
//   - Plays only while the hero is on screen and the tab is visible. No sound, ever.
//   - Any error leaves the poster showing.
//
// This file must not import from desktop/ or mobile/.

import { REDUCED_MOTION_QUERY, canPlayHeroVideo, isDesktopLayout } from './env.js';

/** @returns {() => void} cleanup */
export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return () => {};

  const hero = video.closest('[data-hero]') ?? video.parentElement;
  const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const cleanups = [];

  let started = false;
  let heroVisible = true;
  let tabVisible = !document.hidden;
  let disposed = false;

  const on = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  function sync() {
    if (!started) return;
    if (heroVisible && tabVisible && !reducedQuery.matches) {
      video.play().catch(() => {
        /* Autoplay can be refused. The poster stays, which is fine. */
      });
    } else {
      video.pause();
    }
  }

  function giveUp() {
    started = false;
    video.pause();
    video.classList.remove('is-playing');
    video.removeAttribute('src');
    video.hidden = true;
  }

  function start() {
    if (disposed || !canPlayHeroVideo()) return;

    const wanted = isDesktopLayout() ? video.dataset.srcDesktop : video.dataset.srcMobile;
    if (!wanted) return;

    video.muted = true; // iOS needs the property, not only the attribute
    video.hidden = false;
    started = true;

    // Same file as before (mode swap that did not change the clip): keep playing, do not reload.
    if (video.getAttribute('src') !== wanted) {
      video.classList.remove('is-playing');
      video.preload = 'auto';
      video.src = wanted;
    } else if (!video.paused) {
      video.classList.add('is-playing');
    }
    sync();
  }

  on(video, 'playing', () => video.classList.add('is-playing'));
  on(video, 'error', giveUp);

  on(document, 'visibilitychange', () => {
    tabVisible = !document.hidden;
    sync();
  });

  // The visitor turns reduced motion on while the page is open: stop at once.
  on(reducedQuery, 'change', () => {
    if (reducedQuery.matches) giveUp();
  });

  const observer = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    sync();
  });
  observer.observe(hero);
  cleanups.push(() => observer.disconnect());

  if (document.readyState === 'complete') {
    start();
  } else {
    on(window, 'load', start, { once: true });
  }

  return function destroy() {
    disposed = true;
    cleanups.forEach((undo) => undo());
    // The clip is left as it is: a mode swap re-runs init, which keeps it playing if it fits.
  };
}
