// Desktop section folds (Lane B). "Folding" means stacking: the section underneath stays pinned,
// shrinks a little and dims, while the next section slides up over it. Used twice only (docs/04):
//
//   Fold 1  Hero -> About.     The hero stays put and shrinks to 0.96 as About covers it. This file
//                              also holds the older hero scroll effect (the picture grows from 1
//                              to 1.08, the blue veil deepens), so the two share one trigger.
//   Fold 2  FAQ -> Contact.    The FAQ stays put and shrinks and dims as Contact covers it.
//                              (docs/04 says Why -> Contact, but the FAQ sits between them on the
//                              page, so Contact folds over the section just before it. See HANDOFF.)
//
// Both are scrubbed to the scroll, transform and opacity only. The pinned section keeps its place
// without adding space (pinSpacing: false), so the next section simply scrolls over it. A section
// taller than the screen (the FAQ) is pinned by its bottom edge, so the part you were reading is
// the part that stays.
//
// While a fold runs, <html data-folding="hero|contact"> gives the page a dark backdrop, so the thin
// strips left around the shrinking section read as depth and not as a gap.
//
// Everything is created inside one gsap.context, and the returned cleanup reverts it and removes
// the dim layer and the attribute. The caller skips this for reduced motion (no pin, no scrub).

import { gsap, ScrollTrigger } from '../../assets/vendor/vendor.js';
import { MOTION } from '../core/motion-tokens.js';

const root = document.documentElement;

function setFolding(name, on) {
  if (on) root.dataset.folding = name;
  else if (root.dataset.folding === name) delete root.dataset.folding;
}

/** @returns {() => void} cleanup */
export function initFolds() {
  gsap.registerPlugin(ScrollTrigger);
  const extras = [];

  const ctx = gsap.context(() => {
    foldHero();
    foldContact();
  });

  // Fold 1: the hero stays pinned for one screen of scrolling while About slides over it.
  function foldHero() {
    const hero = document.querySelector('[data-hero]');
    const about = document.getElementById('about');
    const media = hero?.querySelector('[data-hero-media]');
    const veil = hero?.querySelector('[data-hero-veil]');
    const content = hero?.querySelector('.sv-hero__content');
    if (!hero || !about || !media || !veil) return;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onToggle: (self) => setFolding('hero', self.isActive),
      },
    });
    tl.to(media, { scale: MOTION.hero.scaleEnd }, 0)
      .to(veil, { opacity: MOTION.hero.veilEnd }, 0)
      .to(hero, { scale: MOTION.fold.scale }, 0);
    if (content) tl.to(content, { opacity: MOTION.fold.contentOpacity }, 0);
  }

  // Fold 2: the FAQ is pinned by its bottom edge while Contact slides over it.
  function foldContact() {
    const under = document.getElementById('faq');
    const over = document.getElementById('contact');
    if (!under || !over) return;

    const dim = document.createElement('div');
    dim.className = 'sv-fold-dim';
    dim.setAttribute('aria-hidden', 'true');
    under.append(dim);
    extras.push(() => dim.remove());

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: under,
          start: 'bottom bottom',
          // Contact covers the screen after one screen of scrolling (less if it is shorter).
          end: () => `+=${Math.min(window.innerHeight, over.offsetHeight)}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          onToggle: (self) => setFolding('contact', self.isActive),
        },
      })
      .to(under, { scale: MOTION.fold.scale, transformOrigin: '50% 100%' }, 0)
      .to(dim, { opacity: MOTION.fold.dim }, 0);
  }

  return function destroy() {
    ctx.revert();
    extras.forEach((undo) => undo());
    delete root.dataset.folding;
  };
}
