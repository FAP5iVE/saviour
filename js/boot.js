// Entry point. Picks the layout module by width and swaps it live when the window crosses 1024px.
// Each module exports init() and destroy(). Everything it creates is removed by destroy().

import { LAYOUT_QUERY } from './core/env.js';

const query = window.matchMedia(LAYOUT_QUERY);
const root = document.documentElement;

let active = null; // { mode, module }
let queue = Promise.resolve();

const modeFor = (matches) => (matches ? 'desktop' : 'mobile');

async function activate(mode) {
  if (active?.mode === mode) return;

  if (active) {
    try {
      await active.module.destroy();
    } catch (error) {
      console.error('Saviour: destroy failed for', active.mode, error);
    }
    active = null;
  }

  const module = await import(`./${mode}/index.js`);
  await module.init();
  active = { mode, module };
  root.dataset.mode = mode;
  window.dispatchEvent(new CustomEvent('sv:modechange', { detail: { mode } }));
}

function request(mode) {
  queue = queue.then(() => activate(mode)).catch(fail);
  return queue;
}

function fail(error) {
  console.error('Saviour: scripts failed, showing the static page.', error);
  root.classList.remove('js');
  root.dataset.mode = 'static';
}

query.addEventListener('change', (event) => request(modeFor(event.matches)));
request(modeFor(query.matches));
