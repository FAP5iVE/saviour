// Hero video loader (Lane B). The poster is already on screen; this only adds the clip when
// the visitor's setup can afford it (see heroVideoBlocker in env.js).
//
//   - Waits for the page "load" event, so the video never competes with first paint.
//   - Desktop layout gets the 720 clip, mobile layout the lighter 480 clip. A 3g connection
//     also gets the 480 clip.
//   - Plays only while the hero is on screen and the tab is visible. No sound, ever.
//   - Any error leaves the poster showing.
//   - The video element carries data-state so you can see in DevTools what happened:
//       waiting | blocked:<reason> | loading | playing | needs-tap | failed:<code>
//
// This file must not import from desktop/ or mobile/.

import {
  REDUCED_MOTION_QUERY,
  connectionIsModest,
  heroVideoBlocker,
  isDesktopLayout,
} from './env.js';

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
  let waitingForTap = false;

  const on = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const setState = (state) => {
    video.dataset.state = state;
  };

  // Some phones refuse autoplay until the visitor touches the page (iOS Low Power Mode, some
  // data-saver browsers). Try again on the first tap, key press or click.
  const TAP_EVENTS = ['pointerdown', 'touchend', 'keydown'];
  function armTapRetry() {
    if (waitingForTap) return;
    waitingForTap = true;
    setState('needs-tap');
    const retry = () => {
      disarmTapRetry();
      sync();
    };
    TAP_EVENTS.forEach((type) => document.addEventListener(type, retry, { passive: true }));
    disarmTapRetry = () => {
      TAP_EVENTS.forEach((type) => document.removeEventListener(type, retry));
      waitingForTap = false;
    };
  }
  let disarmTapRetry = () => {};
  cleanups.push(() => disarmTapRetry());

  function sync() {
    if (!started) return;
    if (heroVisible && tabVisible && !reducedQuery.matches) {
      video.play().catch((error) => {
        // NotAllowedError = autoplay refused. The poster stays and we wait for a tap.
        if (error?.name === 'NotAllowedError') armTapRetry();
      });
    } else {
      video.pause();
    }
  }

  function giveUp(state) {
    started = false;
    video.pause();
    video.classList.remove('is-playing');
    video.removeAttribute('src');
    video.hidden = true;
    setState(state);
  }

  function start() {
    if (disposed || started) return;

    const blocker = heroVideoBlocker();
    if (blocker) {
      setState(`blocked:${blocker}`);
      return;
    }

    const wantMobile = !isDesktopLayout() || connectionIsModest();
    const wanted = wantMobile ? video.dataset.srcMobile : video.dataset.srcDesktop;
    if (!wanted) return;

    video.muted = true; // iOS needs the property, not only the attribute
    video.hidden = false;
    started = true;

    // Same file as before (mode swap that did not change the clip): keep playing, do not reload.
    if (video.getAttribute('src') !== wanted) {
      video.classList.remove('is-playing');
      setState('loading');
      video.preload = 'auto';
      video.src = wanted;
    } else if (!video.paused) {
      video.classList.add('is-playing');
      setState('playing');
    }
    sync();
  }

  on(video, 'playing', () => {
    video.classList.add('is-playing');
    setState('playing');
  });
  on(video, 'error', () => giveUp(`failed:${video.error?.code ?? 'unknown'}`));

  on(document, 'visibilitychange', () => {
    tabVisible = !document.hidden;
    sync();
  });

  // The visitor turns reduced motion on while the page is open: stop at once.
  on(reducedQuery, 'change', () => {
    if (reducedQuery.matches) giveUp('blocked:reduced-motion');
  });

  // The browser's idea of the connection can improve after the page loaded (for example from
  // "2g" to "4g" once the radio wakes up). If the clip was blocked only for that, try again.
  const connection = navigator.connection;
  if (connection?.addEventListener) {
    on(connection, 'change', () => {
      if (!started && document.readyState === 'complete') start();
    });
  }

  const observer = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    sync();
  });
  observer.observe(hero);
  cleanups.push(() => observer.disconnect());

  setState('waiting');
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
