# Handoff requests

Use this file when you need a change in a file you do not own (see the lane table in AGENTS.md).
Add one entry per request. Do not edit the other lane's file.

Template:

```
## [Lane X to Lane Y] Short title
- What:
- Why:
- Exact selector / function / file:
- Status: open
```

Also list here every item still marked `[TBC]` or `[DRAFT-EDIT]` that the owner must supply.

## Notes from phase 3 (About, services, packages), 4 Nov 2026

**What was built (Lane C):** `#about` (problem statement, two sourced figures, "who we are"), `#services` (nine ruled rows, accordion), `#packages` (three cards, no prices). Everything is content-once in `index.html`; desktop and mobile only differ in CSS and JS.

### Requests and notes for other lanes

- **[Lane C to Lane B / A] Deep links do not land on desktop (found in testing, also in the phase 2 zip).** Opening `index.html#packages` (or `#about`, `#contact`) on a desktop window leaves the page at the top (`scrollY` about 0 to 56 after 2.5 s); on a phone it stops about 80 px short because of the sticky header. Cause is probably Lenis starting at 0 after the browser's own jump (modules are loaded with a dynamic `import()` after the page loads). Suggested fix in `js/core/nav.js` or `js/desktop/smooth-scroll.js`: after the mode's `init()` and `document.fonts.ready`, if `location.hash` matches a section id, call the same `goTo(target)` used for clicks, with `immediate: true` for Lenis. Not changed by Lane C. Matters for WhatsApp and social links that end in `#packages`.
- **[Lane C to Lane E] Quote pre-fill hooks (all in the markup now).**
  - Package buttons: `<a href="#contact" data-package="starter|business|growth">`. `nav.js` already scrolls to `#contact`; `form.js` should listen for clicks on `[data-package]` (delegate on `document`), select that package and focus the form.
  - Service rows have a link `data-service="<slug>"` ("Ask about this"). Slugs: `website`, `starter`, `shop`, `google-business-profile`, `whatsapp-business`, `social-and-brand`, `digital-marketing`, `data-collection`, `maintenance`. Optional: `form.js` can tick the matching add-on (docs/03 section 5 add-ons are the last six). If unused, nothing breaks.
  - Each package `<li>` has `data-pkg="<name>"` and an empty `data-price-from=""` (the `priceFrom` field from the contract). Do not fill it: pricing is quote-only.
- **[Lane C to Lane D] Reusable pieces.**
  - `js/core/accordion.js` is generic. For the FAQ: put `data-accordion="faq"` on the list, `data-accordion-item` on each row, `data-accordion-name` on the heading (its contents become a real `<button>`) and `data-accordion-panel` plus an `id` on the answer. Reuse the `.sv-svc__panel` / `.sv-svc__inner` collapse pattern in `css/base.css` (it is the grid-rows trick, collapses only under `html.js`), or copy it under an `sv-faq` name. Call `initAccordion(list, { single: true })` from a mode file and `destroy()` on cleanup.
  - Mobile `js/mobile/reveal.js` fades up every `[data-reveal]` block once (one batched trigger) and splits `[data-scrub]` into lines. Add `data-reveal` to your blocks to get the mobile reveal for free. Desktop does not touch `[data-reveal]`: desktop motion is per feature.
- **[Lane C to Lane F] `.sv-section` on desktop** now has extra right padding (`--gutter` plus `--space-4`) so text never sits under the section rail from `section-rail.js` (at 1440 px the rail's number overlapped the About statement). All later sections inherit it. Change it in `css/desktop.css`, block "generic".
- **[Lane C to Lane A] Tokens added to `css/tokens.css`:** `--text-h3`, `--text-statement`, `--text-stat`, `--measure`, `--rule-thick`, `--lift`. **To `js/core/motion-tokens.js`:** groups `about`, `services`, `packages`. **`css/base.css`:** one new block, "Shared components: about, services, packages" (also `.sv-sr` for screen-reader-only text and `.sv-btn--ghost`). Status: done, nothing to action.
- **[Lane C to Lane B] Fold 1 (Hero to About).** `.sv-about` has a solid `background: var(--bg)` on desktop so it can slide over the pinned hero. About starts with `[data-scrub]` text that is scrubbed; if the fold pins the hero for a long stretch, check the scrub `start` in `MOTION.about.scrubStart` still lands after the fold.
- **Package cards on phones:** the recommended card (Business) is first on a phone via CSS `order`, as in docs/01 section 7.4. The DOM order stays Starter, Business, Growth, so the tab order differs from the visual order on phones only. Between 768 and 1023 px the Business card spans the full row and the other two sit side by side.

### Content decisions in phase 3 (nothing invented)

- Every cell that is `[TBC]` in docs/03 (timelines, page counts, maintenance terms) is **left off the page**, not shown as a placeholder. Nothing in `index.html` for this phase contains `[TBC]`, so the QA script has no new failures.
- Service 07 (Digital marketing) shows only the one-liner and "What suits you depends on your business, so we set it out in your written quote." Service 08 (Data collection) lists only the three areas the owner confirmed (digital forms, research, field data collection) plus the same quote line. Replace these when the owner gives the detail.
- Statistics, both re-checked on 4 Nov 2026 against the source pages:
  - 4.02 million internet users in Malawi, October 2025. DataReportal, *Digital 2026: Malawi*, published 8 Nov 2025. https://datareportal.com/reports/digital-2026-malawi
  - "Almost 1.6 million MSMEs" (employing about 1.8 million) from the 2019 FinScope MSME Survey, as reported in a World Bank *Africa Can End Poverty* blog post by Efrem Chilima, 30 May 2022. https://blogs.worldbank.org/en/africacan/supporting-malawis-small-enterprises-spur-economic-growth-and-create-more-job
  - Not used: the 2.40 million social media figure, the GDP and employment shares, and the 18% internet figure (docs/03 says to verify those first). No "Chamber of Commerce" or Airtel Money market-share claims.
- "A five-person team in Blantyre" comes from the owner's brief (docs/00 and the skill). The founding story sentence from docs/03 section 3 is **not** on the page (still unknown).
- Payment line ("Pay by Airtel Money, TNM Mpamba or bank transfer.") and the instalment wording appear exactly as in docs/03. No instalment numbers anywhere.

### Team block (not on the page yet, on purpose)

Names, roles, bios and photos are not available, so no team markup exists. When the owner supplies them, add this inside `#about`, after `.sv-about__who`, and add its CSS (a plain grid with `--space-3` gaps, two columns on a phone, five on desktop, photos with `width`/`height`, no card styling):

```html
<div class="sv-team" data-reveal>
  <h3 class="sv-team__title">The team</h3>
  <ul class="sv-team__list">
    <li class="sv-team__person">
      <picture>
        <source type="image/avif" srcset="assets/img/team-NAME-400.avif 400w, assets/img/team-NAME-800.avif 800w" sizes="(min-width: 1024px) 18vw, 45vw" />
        <img src="assets/img/team-NAME-400.webp" srcset="assets/img/team-NAME-400.webp 400w, assets/img/team-NAME-800.webp 800w" sizes="(min-width: 1024px) 18vw, 45vw" alt="FULL NAME, ROLE" width="400" height="500" loading="lazy" decoding="async" />
      </picture>
      <p class="sv-team__name">FULL NAME</p>
      <p class="sv-team__role">ROLE</p>
    </li>
  </ul>
</div>
```

### Open owner items added by phase 3

- Digital marketing: what is included (service 07).
- Data collection: the detail of digital forms, research and field data collection (service 08).
- Timelines for each service and package page counts (docs/03 tables). Maintenance terms per package.
- Team: five names, roles, one-line bios, photos (already listed below). Founding story, one true sentence.
- Whether the "Recommended" label on Business is what the owner wants (it is a proposal from docs/01).

## Notes from phase 2 (hero and navigation), 4 Nov 2026

- **[Lane B to Lane A] Tokens added to `css/tokens.css` and `js/core/motion-tokens.js`:** `--rule-on-dark`, `--focus-on-dark`, `--icon`, `--header-h` (3.5rem mobile, 4.5rem desktop), `--action-h`, `--z-*`, `--radius-lg`, `--shadow-bar`, `--t-fade`, `--t-fade-out`, `--t-reveal`, `--ease-out`, `--veil`, `--veil-opacity`; and the `hero`, `menu`, `header` groups in `MOTION`. Status: done, nothing to action.
- **[Lane B to Lane A] `css/base.css`:** added shared `.sv-icon`, button hover/active and `.sv-btn--slim`, `.sv-link-quiet`, hero media and text styles, the `html.js` hero hidden state with its 4 second failsafe, smooth scrolling, and a 44 px skip link. Status: done.
- **[Lane B to Lane G] `scripts/qa-check.sh` (both copies):** the `<title>` check now reads the whole file, because Prettier wraps the title over several lines and the old single-line check always failed. `scripts/build.mjs` now skips `hero-poster.png` and `hero-og.mp4` (raw sources). Status: done.
- **[Lane B to motion pass] Fold 1 and the hero scroll effect:** `js/desktop/hero-scroll.js` scales the hero media and deepens the veil as it scrolls away. When `fold.js` pins the hero, merge the two so they do not fight over the same trigger.
- **[Lane B to Lane C] Nav list:** six links as in the plan (Packages and FAQ have no link; Packages lights up the Services link). Add a nav link only with the owner's approval.
- **Veil strength:** `--veil-opacity: 0.62` gives white text at least 5.2:1 over the current stand-in poster. If the owner picks different footage, re-check contrast and adjust that one token.
- **Videos:** `assets/video/hero-720.mp4` and `hero-480.mp4` must be present for the video to play. Without them the poster shows and nothing breaks (the loader gives up on a failed request).
- **Contact placeholders (intentional QA failures until real details exist).** `index.html` has three links with `[TBC]`: the header WhatsApp button, the action bar WhatsApp item (both `https://wa.me/265[TBC]?text=...`) and the Call item (`tel:+265[TBC]`). Replace `[TBC]` with the number without a leading 0 (WhatsApp) and with the number in the same form for `tel:`. Search the project for `265[TBC]`.

## Open owner items

- What **Digital marketing** includes, and the detail and timelines for **Data collection** (digital forms, research, field data collection) (docs/03 rows 07 and 08)
- How a finished site goes live, since Saviour does not register domains or host sites (docs/03 FAQ 4). Domain registration and hosting are both confirmed as not offered

- Phone / WhatsApp number, email, Blantyre street address, opening hours
- Real social profile links
- Team: five names, roles, bios, photos
- Logo files
- Domain name
- Hero footage decision (see docs/06-hero-footage-shortlist.md)
- Instalment terms (draft in docs/03-content-and-copy.md section 5.1)
