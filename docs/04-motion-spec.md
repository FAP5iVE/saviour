# 04. Motion Spec

Goal: **scroll motion that tells the story and never gets in the way.** Oxnod-style polish (smooth scroll, text reveals, pinned sections, hover detail), built by us, tuned for cheap phones.

## 1. Principles

1. **Motion has a job.** It guides attention, shows hierarchy, or confirms an action. If it does none of those, remove it.
2. **One main motion per viewport.** Never three things competing.
3. **Transform and opacity only.** No animating `width`, `height`, `top`, `left`, `margin` inside scroll handlers (layout thrash). Height reveals use the CSS `grid-template-rows: 0fr → 1fr` technique or a single measured tween.
4. **Content first.** Reveals start slightly before the element enters (about 85% down the viewport) so nobody waits to read.
5. **Never block interaction.** No locked scrolling except the short intro and a few pinned sections that earn it.
6. **Graceful degradation.** No JS, slow JS or reduced motion all produce a complete, readable page.
7. **Desktop gets richer motion; mobile gets lighter motion.** Same story, fewer layers.

## 2. Libraries (all self-hosted, pinned in `assets/vendor/VERSIONS.txt`)

| Library | Used for | Mode |
|---|---|---|
| GSAP core | Tweens, timelines, ticker | both |
| ScrollTrigger | Reveals, pin, scrub, horizontal scroll | both (different configs) |
| SplitText | Line and word splitting for headline and statement reveals | both |
| DrawSVG | Line-drawing for logo, icons, underlines, check marks | both |
| Lenis | Smooth scroll | **desktop fine-pointer only** |
| Lottie | **Not used.** Adds a player and weight; our needs are covered by inline SVG + DrawSVG, which is lighter | n/a |

GSAP's research notes: the core is small by itself, plugins load separately, and as of 2025 all plugins are free. Re-check the license page at ship time. Pin exact versions seen at build; the research encountered GSAP 3.15.x and Lenis 1.3.x.

### Lenis rules
- Enable only when `(hover: hover) and (pointer: fine)` **and** no `prefers-reduced-motion`.
- `syncTouch: false`. Lenis's own docs note touch smoothing is unstable on some iOS versions, so phones keep native momentum scrolling.
- Wire to ScrollTrigger exactly:
  ```js
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- Mark internal scrollable regions (menu sheet, any overflow box) with `data-lenis-prevent`.
- Anchor links use `lenis.scrollTo()` on desktop and native smooth scrolling on mobile.

## 3. Motion tokens (`js/core/motion-tokens.js` and `css/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 150 to 250 ms | Hovers, presses, focus |
| `--dur-reveal` | 600 to 800 ms | Scroll reveals |
| `--dur-page` | 900 to 1200 ms | Loader, folds |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `power3.out`) | Default entrances |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` (GSAP: `power2.in`) | Exits |
| **Spring (overshoot)** | GSAP `back.out(1.4)` for entrances that should settle with a slight bounce | Pricing cards rising, check marks, button success state, menu items |
| Exit rule | Exits last about **70%** of the entrance duration | "Exit slightly faster than enter" from your brief |
| Stagger | 60 to 90 ms per item, max 8 items per group | Lists |

Spring/overshoot is used **sparingly**: it should feel like a soft settle, not a bounce toy. Overshoot amount stays small (about 4 to 6% of travel).

## 4. Choreography, section by section

| Section | Desktop (≥1024 px) | Mobile (<1024 px) |
|---|---|---|
| **Loader** (first visit only) | SVG logo mark draws (DrawSVG, about 0.9 s), then curtain slides up. Hero headline starts as the curtain clears | Same, shorter (about 0.7 s). Skipped on repeat visits and for reduced motion |
| **Nav** | Transparent → solid on scroll; hides on scroll down, shows on scroll up; right-edge **vertical wheel** (a scale on a 3D drum with a numbered tick per section and a fixed orange needle; no background, takes the page colour; it turns as you scroll) | Compact bar; menu button opens full-screen sheet; links stagger in with a small overshoot; **floating bottom action bar** (WhatsApp, Call) slides up after the hero |
| **Hero** | Headline lines reveal with masked slide-up (SplitText lines, 0.8 s, 80 ms stagger). Video fades in once ready. On scroll: video scales 1 → 1.08 and the overlay deepens. Primary button is "magnetic" (subtle pull toward the cursor, max about 8 px). Scroll cue loops gently | Same headline reveal. Poster or light clip only. No scale-on-scroll. No magnetic button (no hover on touch) |
| **Fold 1 (Hero → About)** | Hero stays pinned; About slides up over it while the hero dims and shrinks to about 0.96 scale | No pin. About simply rises with a fade and 24 px slide |
| **About and problem** | Words scrub from 20% to 100% opacity tied to scroll position (`scrub: true`). Stat numerals count up **once**, only for sourced figures | Line-by-line fade-up, triggered once (no scrub) |
| **Team** | Photos reveal with a clip-path wipe, 80 ms stagger. Hover shows the role line | Two-column grid, simple fade-up |
| **Services** | Sticky left title. Row hover: hairline draws left to right, icon line-draws, row padding eases open to reveal detail (grid-rows trick) | Tap accordion. Open state rotates the plus into a cross; detail slides open |
| **Packages** | Three cards rise with overshoot, 80 ms stagger; hover lifts 4 px; recommended card's top rule draws in blue | Cards stack; each fades up as it enters. No hover effects |
| **Showcase** | **No pin (changed in phase 10):** the page scrolls straight through the section. Six panels sit in a sideways row moved by a **custom scroll bar** under it (draggable blue thumb, a notch per project, a 01 / 06 counter; also arrow keys and a sideways trackpad swipe); the row settles on a panel after each move. Vertical mouse-wheel scrolling is never captured. Reduced motion: same bar, moves instantly | Native horizontal swipe row with `scroll-snap-type: x mandatory`, a peek of the next panel, and dot indicators. **No pinning** |
| **Fold 2 (Why → Contact)** | Why section (charcoal) is pinned while Contact slides over it | Fade-up only |
| **Why choose us** | Each statement reveals line by line (SplitText) and its proof line fades in after | Same without scrub |
| **FAQ** | Accordion with hairline draw | Same |
| **Contact** | Input underline grows from left on focus; label floats up; submit button morphs: idle → sending (spinner) → success (check draws, small overshoot) | Same; the button is full width |
| **Footer** | Large wordmark drifts up slightly as it enters | Static |

### "Folding sections", defined
The user's phrase for sections that fold: implement as **stacking overlays**, where the next section slides over the previous one (previous scales to about 0.96, dims, and sits pinned underneath). Use it **twice only** (Fold 1 and Fold 2). More than that fights the horizontal pin and wrecks scroll feel on mid-range laptops. On mobile it is replaced by a simple fade-and-rise.

## 5. Custom cursor (desktop fine-pointer only)

- A small dot (8 px) that follows instantly, plus a ring (36 px) that follows with `gsap.quickTo` smoothing.
- **States:**
  - default: dot + ring
  - links and buttons: ring grows, dot fades
  - showcase panels: ring becomes a labelled disc ("Drag" or "View")
  - text selection and form fields: custom cursor hides; native I-beam stays
  - mouse leaves the window: cursor fades out
- Rules: never hide the native cursor on inputs; keep `pointer-events: none` on the cursor elements; skip entirely on touch and with reduced motion; hide the native cursor only when the custom one is confirmed running.

## 6. Micro-interactions (the "confirms your action" layer)

- **Buttons:** hover fills sweep left to right (about 200 ms); press scales to 0.97; focus ring always visible.
- **Form inputs:** underline grows; label floats; valid fields get a small check that draws; errors shake once (about 4 px, 250 ms) and are announced to screen readers.
- **Copy to clipboard** on phone and email (desktop): toast confirms "Copied".
- **Toggles / accordions:** icon rotates; state change under 250 ms.
- **WhatsApp button:** tiny pulse on first paint of the action bar (once, not looping).

## 7. SVG line drawing

Logo mark, service icons, link underlines and success checks use inline SVG with DrawSVG. Keep each icon under about 1 KB. All icons share one stroke width (1.5 px) and cap style.

## 8. Reduced motion

Use `gsap.matchMedia()` so animations only exist when allowed:

```js
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => { /* all motion here */ });
mm.add('(prefers-reduced-motion: reduce)', () => { /* static, instantly visible */ });
```

With reduced motion: no loader, no Lenis, no pinning, no parallax, no scrubbing, no cursor effects. Elements are visible immediately; hover states change colour only.

## 9. Performance and stability rules

- Batch similar reveals with `ScrollTrigger.batch` instead of one trigger per element.
- Limit simultaneous `scrub` animations to what the page can hold; test with CPU 4x slowdown.
- Refresh triggers after `document.fonts.ready` and after hero/team images load; set `invalidateOnRefresh: true` on any trigger that depends on measured sizes.
- Use `will-change` only during an animation, then remove it.
- Pause hero video when it leaves the viewport and when the tab is hidden.
- Use `svh`/`dvh` for full-height sections on mobile browsers (address-bar resize).
- On breakpoint swap, `destroy()` must kill **every** trigger and listener created by the previous mode.
- Never hide content in base CSS. Initial states are applied only under `html.js`.

## 10. Motion QA checklist

- [ ] Scroll the whole page at normal speed on a real low-end Android: no stutter, no jumps
- [ ] Reduced-motion on: page fully readable, nothing missing
- [ ] Resize across 1024 px repeatedly: no leftover pin spacers, no double animations
- [ ] Keyboard-tab through the showcase: each panel scrolls into view
- [ ] Fonts loading late doesn't shift pinned sections
- [ ] Back/forward and anchor-link jumps land correctly
- [ ] Video pauses off-screen; no sound; `playsinline` set
- [ ] No console errors; no layout shift above 0.1 CLS

## 11. As built (phase 6, 6 Nov 2026)

- **Loader:** `js/core/loader.js`. Two blue outlines draw (DrawSVG), fill, the finished `favicon.svg` fades in over them, a paper curtain slides up. About 1.25 s desktop, 1.0 s phone. First visit of a session; never with reduced motion. Timings in `MOTION.loader`.
- **Folds:** `js/desktop/fold.js`. Fold 1 is Hero to About. **Fold 2 is FAQ to Contact** (the FAQ sits between Why and Contact on the page). Both use `pin: true, pinSpacing: false` and scrub; the FAQ is pinned by its bottom edge. Phones fade and rise (`data-reveal`) instead.
- **Cursor and magnetic button:** `js/desktop/cursor.js`, `js/desktop/magnetic.js`. Fine pointer, desktop layout, no reduced motion. The pull uses the `translate` property through `--mx`/`--my` so it never fights the button's `transform`.
- **Refresh:** `js/core/refresh.js` measures again after fonts and the page `load`.
- **Built in phase 8:** footer wordmark drift (`js/desktop/footer-drift.js`).
