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

## Update 4 Nov 2026 (later): owner supplied story, services detail, team and WhatsApp number

- **WhatsApp / phone:** +265 886 02 34 82 is now in the three links that were `[TBC]` (`https://wa.me/265886023482`, `tel:+265886023482`). The QA script now exits 0. Lane E: use the same number in the contact block and JSON-LD (display format `+265 886 02 34 82`).
- **Team size:** the owner listed **three** people, not five. The "five-person team" wording is **removed** from the page ("a team in Blantyre"). **Owner to confirm** whether there are two more people to add. docs/00 and docs/03 still say five in places: treat them as superseded.
- **Team block is live** inside `#about` (`.sv-team`): Saviour Banda (Founder; data collection and digital marketing), Fyaupi Guthrie Mwenelupembe (Web developer), Charity Phiri (Digital marketing and content creation; also data collection). No bios on the page (none were supplied and none were invented). Photos in `assets/img/team-*-{400,800}.{avif,webp}`, all cropped to 4:5. Fyaupi's photo is the suit portrait (sharper and better framed than the hoodie selfie).
  - **Photo quality, owner to act:** the Saviour and Charity images are small, differently lit and differently framed (574 px and 1425 px wide; Charity has no 800 px version because the source is too small). Replace with matching portraits (same distance, plain or blurred background, at least 1000 px wide) when available. Confirm the owner has the right to use them.
  - Desktop: photos rise in one by one (`js/desktop/team-reveal.js`). Phone: one photo per row, then three columns from 768 px. Mobile uses the generic `[data-reveal]` fade.
- **Founding story is live** under "How we started" in `#about`. The pun is on the name (also the founder's name). It names Rynberg Stacks as the source of the digital and entrepreneurship lesson. It deliberately does not say who was taught, or when, or where. **Owner to confirm** who was taught (if it was the founder, the first sentence can name Saviour Banda) and that naming Rynberg Stacks is fine.
- **Service 07 (Digital marketing)** now reads: social media marketing on Facebook, Instagram and LinkedIn to build engagement, share content and run targeted campaigns (owner's wording, tightened).
- **Service 08 (Data collection)** now has two parts from the owner's text: Online forms and surveys, and Physical data collection (paper questionnaires, face-to-face interviews, focus groups, offline tablet or phone entry, data entry rules, secure storage of sensitive paper forms). The owner's pasted text was cut off mid-word in places ("completion ra", "stored secu"), so the last bullets are completed in plain wording: **owner to read service 08 once and confirm it says what they mean.** The "Encrypted (HTTPS), clear privacy policy" and "stored securely" lines are promises about how Saviour works, so they must be true.
- Still open: timelines, page counts, maintenance terms (all left off), the "Recommended" label on Business.

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
- Services 07 and 08 were first built with minimal wording; the owner then supplied the detail (see the update at the top of this file).
- Statistics, both re-checked on 4 Nov 2026 against the source pages:
  - 4.02 million internet users in Malawi, October 2025. DataReportal, *Digital 2026: Malawi*, published 8 Nov 2025. https://datareportal.com/reports/digital-2026-malawi
  - "Almost 1.6 million MSMEs" (employing about 1.8 million) from the 2019 FinScope MSME Survey, as reported in a World Bank *Africa Can End Poverty* blog post by Efrem Chilima, 30 May 2022. https://blogs.worldbank.org/en/africacan/supporting-malawis-small-enterprises-spur-economic-growth-and-create-more-job
  - Not used: the 2.40 million social media figure, the GDP and employment shares, and the 18% internet figure (docs/03 says to verify those first). No "Chamber of Commerce" or Airtel Money market-share claims.
- The "five-person team" wording came from the original brief and has since been removed (owner listed three people). The founding story is now on the page (see the update at the top of this file).
- Payment line ("Pay by Airtel Money, TNM Mpamba or bank transfer.") and the instalment wording appear exactly as in docs/03. No instalment numbers anywhere.

### Team block

Now built, see the update at the top of this file. To add the other two people (if there are two more), copy one `<li class="sv-team__person" data-reveal data-team-person>` block in `index.html`; the grid is three columns, so for five switch `.sv-team__list` to `repeat(5, ...)` in `css/desktop.css` and `css/mobile.css`.

### Open owner items added by phase 3

- Timelines for each service and package page counts (docs/03 tables). Maintenance terms per package.
- Team: are there two more people? One-line bios if wanted. Better matching photos for Saviour and Charity.
- Founding story: who was taught by Rynberg Stacks, and is naming them fine?
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
- Team: three people supplied. Open: two more people? Matching, better photos for Saviour and Charity.
- Logo files
- Domain name
- Hero footage decision (see docs/06-hero-footage-shortlist.md)
- Instalment terms (draft in docs/03-content-and-copy.md section 5.1)
