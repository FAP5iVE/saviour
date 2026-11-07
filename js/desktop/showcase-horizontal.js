// Compatibility file. The pinned sideways showcase was replaced by the scroll bar in
// showcase-bar.js. This file only passes the old name on, so an index.js from an earlier copy that
// still imports initShowcaseHorizontal keeps working instead of taking the whole desktop mode down.
// New code should import initShowcaseBar from './showcase-bar.js'.

export { initShowcaseBar as initShowcaseHorizontal } from './showcase-bar.js';
