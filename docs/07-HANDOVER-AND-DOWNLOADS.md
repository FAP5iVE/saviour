# 07. Handover and downloads

Written Tue 3 Nov 2026, updated Fri 6 Nov 2026 after phase 7. Business deadline: **Sunday 8 Nov 2026**.
Read this first if you are picking the project up. Then read `AGENTS.md` and `docs/00` to `docs/06`.

---

## 1. Where the project stands

### Phase 7 done in the repo (Fri 6 Nov 2026): QA and launch preparation (Lane G). Not deployed: needs the owner's accounts and details
- **Checks run in Chromium against `dist/`** (with the real `_headers`): console and CSP clean at 375, 768, 1024, 1440 px; no sideways scroll; mode swap across 1023/1024 px clean; links, headings, labels, tap targets, keyboard (69 stops), reduced motion, no-JS, Back/Forward, 404 page, and a mocked end-to-end form submission with a key filled in. Throttled phone (slow 4G, 4x CPU): LCP 2.04 s, CLS 0. Full list in `docs/HANDOFF.md` (phase 7 entry).
- **Found, not fixed:** desktop-only layout shift of 0.74 when fold 2 releases (visually nothing jumps; field CLS only); phone total blocking time about 700 ms under throttling; desktop LCP waits for the loader; ESLint version bug in `package.json` (needs internet to fix, see the runbook). Options and reasons are in `docs/HANDOFF.md`.
- **Added:** `scripts/launch-fill.mjs` (`npm run launch:fill`), launch mode in the QA script (`npm run qa:launch`), `docs/08-LAUNCH-RUNBOOK.md`. No site code, CSS or copy changed.
- **What is left is the owner's:** Web3Forms key, domain, street address, opening days, social links, retention period, the deploy, Lighthouse and a real-phone test. Follow `docs/08`.

### Phase 6 done (Fri 6 Nov 2026): motion pass (loader, folds, cursor, magnetic button) and the open nav fixes
- **Loader (`js/core/loader.js`, markup at the top of `<body>`, CSS in `css/base.css`):** first visit of a browser session only, never with reduced motion. The two blue shapes of the mark draw as outlines (DrawSVG) and fill, the finished `favicon.svg` fades in over them, then a paper curtain slides up (about 1.25 s on desktop, 1.0 s on a phone). The hero headline waits for the curtain to start clearing (`introGate()`, used by `hero-intro.js`). The inline script in `index.html` now also adds `sv-loading` to `<html>` (so there is no flash for a returning visitor); **its hash in `_headers` was updated, `npm run csp:check` passes**. A CSS failsafe hides the loader after 4 s if the script never arrives; if the script is slow, the finished logo shows as a quiet splash after 0.6 s.
- **Folds (`js/desktop/fold.js`, replaces `hero-scroll.js`):** fold 1 pins the hero while About slides over it (the hero shrinks to 0.96, the picture still grows 1 to 1.08, the veil deepens, the text fades to 40%). Fold 2 pins the **FAQ** by its bottom edge while Contact slides over it (shrinks to 0.96 and dims). `pinSpacing: false`, so no space is added. A dark page backdrop shows only while a fold runs (`html[data-folding]`). **Deviation:** the docs say "Why to Contact", but the FAQ sits between Why and Contact on the page, so Contact folds over the section just before it. Phones: no pin; About's head and Contact's intro and form fade up with the existing `data-reveal` code.
- **Custom cursor (`js/desktop/cursor.js`) and magnetic button (`js/desktop/magnetic.js`):** desktop layout and `(hover: hover) and (pointer: fine)` and no reduced motion only. Dot plus ring; ring grows over links and buttons; orange "View" disc over the showcase screens; hides (ordinary cursor returns) over form fields, labels and while selecting text, and when the mouse leaves the window. The hero button leans up to 8 px toward the mouse (`--mx`/`--my` variables and the `translate` property, so the press scale still works).
- **Fixes from earlier hand-off requests:** (1) nav links and deep links to pinned sections now measure the `.pin-spacer` wrapper (`nav.js`); (2) `index.html#section` is honoured after the page is measured, on both modes (`nav.js`, `smooth-scroll.js` now calls `lenis.resize()` first); (3) services row 1 opens without a transition at start-up, so nothing below it moves 240 px later (`services-hover.js`); (4) the mobile action bar hides while `#contact` is on screen (`action-bar.js`); (5) triggers re-measure after fonts and the page `load` (`js/core/refresh.js`).
- **Verified in Chromium (6 Nov 2026):** loader frames at 250 to 2600 ms (desktop) and 350 ms (375 px); repeat load has no loader; both folds at several scroll positions (transforms, dim layer, backdrop attribute, three pin spacers); cursor states (default, link, disc "View", field, window leave); magnetic pull 6.5 px at 30 px from the button and back to 0; deep links and nav clicks for packages, showcase, why, faq, contact, about, home all land the same distance (80 px, the header offset) above the section; resize 1400, 375, 1400, 800, 1280 px leaves 3 spacers, one cursor and one dim layer on desktop and none on mobile; reduced motion (no loader, no pins, no cursor, text visible); no JS (loader hidden); a touch screen at 1280 px gets the desktop layout but no cursor; no console errors or warnings; `npm run qa` 0 failures (same 3 warnings as before); CSP hash matches; Prettier clean on the new files.
- **Not run (build environment cannot run npm):** `npm run lint` as configured (a temporary ESLint config on `js/` passed except one pre-existing `console` call in `form.js`), Lighthouse, a real phone, keyboard tab-through of the folds, back and forward buttons. See `docs/HANDOFF.md` for a bug in `package.json` (ESLint version) that Lane G must fix first.
- **Left out on purpose:** the large footer wordmark that drifts (docs/04 section 7) because the footer has no wordmark element yet; adding one is a design decision.

### Phase 5 done (Thu 5 Nov 2026): contact, form, privacy, SEO (Lane E)
- **Contact (`#contact`):** title, WhatsApp button and phone link on the left (sticky on desktop), quote form on the right. Underline fields with floating labels, package select, six add-on tick boxes, free-text budget and message, consent box, "Send request" and "Send via WhatsApp instead". Success, failure and error states are in the page (no pop-ups, no redirect).
- **Form code:** `js/core/form.js`, started from both modes. Web3Forms by `fetch`, honeypot, loose phone check, pre-fill from `data-package`, `data-service`, `data-demo`, copy-phone on mouse devices. Works without scripts (native post).
- **`privacy.html`, `404.html`:** plain reading pages styled by `css/legal.css`, no scripts. 404 uses root-relative paths.
- **SEO:** canonical, `og:url`, JSON-LD `ProfessionalService` (name, phone, Blantyre, Malawi, logo, image), sitemap entry for `/privacy`.
- **Blocked on the owner:** Web3Forms key, domain, email, street address, hours, socials, retention period. Full list and details in `docs/HANDOFF.md` (top entry).

### Phase 4 done (Thu 5 Nov 2026): showcase, why choose us, FAQ (Lane D) and the hero video fix
- **Showcase (`#showcase`):** five concept demos, each a mini-site built in HTML and CSS (hair and beauty studio, hardware and building supplies, restaurant and takeaway, farm produce and agro-dealer, private tutoring and training). Every panel says "Concept demo, not a client.", names what the site does, lists its features and has an "Ask for a site like this" link to `#contact` (`data-demo="salon|hardware|restaurant|agro|tutoring"`). Mini-sites use only generic labels and grey bars for prices, hours and addresses, so nothing is invented. The mini-site is `aria-hidden`; the text beside it carries the meaning.
  - **Desktop:** `js/desktop/showcase-horizontal.js` pins the section and slides the track sideways as you scroll (scrub 1 s), with a progress line and a 10 px parallax inside each frame. Tabbing into an off-screen panel scrolls the page to show it. Without the pin (reduced motion, scripts failed) it is a native sideways scroll row.
  - **Mobile and tablet:** `js/mobile/showcase-swipe.js` adds dots under a native scroll-snap row (next panel peeks in). No scroll hijacking.
- **Why choose us (`#why`, the one charcoal section):** six large statements with one proof line each, shared reveal in `js/core/why-reveal.js` (SplitText lines, then the proof fades in, once). Every proof line only says what the site already says elsewhere (see HANDOFF for the list the owner must confirm).
- **FAQ (`#faq`):** six questions in the same ruled-row accordion as services, wrapper `js/core/faq.js` around `initAccordion(list, { single: true })`. Without scripts every answer is open. Answers contain no timelines, prices or support terms (not supplied).
- **Hero video fix:** the video played on localhost but not once deployed, because `isLocalDev()` skipped the connection checks locally while the deployed rule only allowed `effectiveType === '4g'` (and blocked every phone whose browser does not report a connection). New rule in `js/core/env.js` (`heroVideoBlocker()`): blocked only by reduced motion, Save-Data or a 2g-class connection. A 3g connection gets the 480 clip. `js/core/hero-video.js` also retries on the first tap if autoplay is refused, re-checks if the connection improves, and writes the reason to `data-state` on the `<video>` (`blocked:save-data`, `blocked:slow-connection`, `blocked:reduced-motion`, `needs-tap`, `failed:<code>`, `loading`, `playing`). **If the video still does not play on the live site, open DevTools, select the `<video>` and read `data-state`.**
- **New files:** `js/desktop/showcase-horizontal.js`, `js/mobile/showcase-swipe.js`, `js/core/faq.js`, `js/core/why-reveal.js`. New blocks in `css/base.css`, `desktop.css`, `mobile.css`. `MOTION` gained `showcase`, `why`, `faq`.
- **Verified in Chromium (5 Nov 2026):** desktop 1440 px (pin starts and ends exactly, track travels 0 to the full 3608 px, progress line, rail follows, keyboard reveals the last panel, one FAQ answer open at a time); 375 px and 768 px (no sideways page scroll, dots follow the swipe including the last panel); resizing 1440, 375 and 1300 px leaves one pin spacer or none, no stray dots, no leftover inline styles; reduced motion (native row, everything visible); scripts off (all FAQ answers open); no console errors; CSP hash matches; `bash scripts/qa-check.sh` exits 0. Video: on a non-localhost hostname the original code blocked 3g and every phone with an unknown connection; the new code plays them, and 2g, Save-Data and reduced motion still block. **Not run:** `npm run lint`, `format:check`, Lighthouse, a real phone, and the real hero clips (stand-in clips were used).
- **Found and handled:** the first service row finishes opening after the scroll triggers are measured, which moved everything below it down 243 px and made the pin start early. The pin now re-measures when the page above it changes height. The root cause is in Lane C's accordion (see HANDOFF).
- **Found, not fixed (other lane):** nav links to `#showcase` from further down the page land on the last panel (end of the pin). See HANDOFF.

### Phase 3 done (Wed 4 Nov 2026): about, services, packages (Lane C)
- **About (`#about`):** title left, big statement right (desktop: words scrub from faint to full; mobile: lines fade up once), two sourced figures with "Source, year" links (4.02 million internet users, October 2025; almost 1.6 million MSMEs, 2019), and "who we are". Figures count up once on desktop; the real number is in the HTML.
- **Services (`#services`):** nine ruled rows (no cards). Desktop: sticky title column, row 1 open, hover intent opens a row, the icon draws itself (DrawSVG). Mobile: tap to open, one open at a time. Both use `js/core/accordion.js`, which turns each heading into a real `<button>` and works for the FAQ too. Without JS every row is open.
- **Packages (`#packages`):** three cards (the only cards on the site), Business recommended with a blue top rule, check icons, instalment wording, quote-only buttons with `data-package`. Shared payment line and add-ons line underneath. Desktop cards rise with a small overshoot and lift on hover; on a phone they stack with Business first.
- **Added later the same day, from the owner:** WhatsApp number (+265 886 02 34 82, QA now exits 0), founding story with the Saviour pun, detail for services 07 and 08, and a three-person team block with photos. Details and open questions at the top of `docs/HANDOFF.md`. The team is three people (the old "five" is removed from the page).
- **Left off the page on purpose:** all timelines, page counts and maintenance terms (all `[TBC]` in docs/03).
- **New files:** `js/core/accordion.js`, `js/desktop/scrub-text.js`, `count-up.js`, `packages-rise.js`, `team-reveal.js`, `services-hover.js`, `js/mobile/services-accordion.js`, `reveal.js`.
- **Verified in Chromium (4 Nov 2026):** 375, 768 and 1440 px screenshots; tap, hover-intent, keyboard (Enter, Tab order, focus ring); DrawSVG draws; resizing 1400, 900, 375, 700, 1300 px leaves one button per heading, one rail and no pin spacers; reduced motion shows everything at once; no-JS shows every row open; no console errors; `npm run qa` has no new failures (only the three phase 2 contact `[TBC]` links); CSP hash still matches. **Not run:** `npm run lint`, `format:check`, Lighthouse and a real phone (the build environment cannot run npm).
- **Found in phase 3, fixed in phase 6:** deep links such as `index.html#packages` did not scroll to the section on desktop. See the phase 6 block.

### Phase 2 done (Wed 4 Nov 2026): hero and navigation (Lane B)
- **Markup:** header (brand, six links, WhatsApp button, menu button), hero (poster picture, video element, veil, headline, lead, two actions, scroll cue), mobile action bar.
- **Hero poster:** `assets/img/hero-poster-800.avif/.webp` and `hero-poster-1600.avif/.webp` made from `assets/img/hero-poster.png` (AVIF 23 KB and 57 KB). The PNG stays as the source and is skipped by `npm run build`.
- **Hero video:** `js/core/hero-video.js` loads `assets/video/hero-720.mp4` (desktop layout) or `hero-480.mp4` (mobile layout) after the page `load` event, unless the visitor has reduced motion or Save-Data on, or the browser reports a 2g-class connection (3g gets the 480 clip; since phase 4, see the hero video fix above); pauses off-screen and in hidden tabs. These two files must exist in `assets/video/` (they were removed from the zip only to keep it small).
- **Hero entrance:** `js/core/hero-intro.js` (SplitText headline lines, then lead and buttons). Plays once per page load. CSS hides the text only under `html.js`, with a 4 second failsafe.
- **Desktop:** `smooth-scroll.js` (Lenis), `header-scroll.js` (transparent over hero, solid after, hides on scroll down), `hero-scroll.js` (media grows 1 to 1.08, veil deepens; merged into `fold.js` in phase 6), `section-rail.js` (right-edge rail).
- **Mobile:** `menu-sheet.js` (full-screen sheet, focus trap, Escape, inert page), `action-bar.js` (WhatsApp, Call, Free quote; appears after the hero).
- **Shared:** `js/core/nav.js` (current-section highlight, in-page anchors with history and focus).
- **Services:** hosting removed, digital marketing and data collection added (docs 00, 01, 03, this file, icons).
- **Not done in phase 2, on purpose:** page-load loader, fold transitions, custom cursor, magnetic button, DrawSVG icons (motion pass, step 6). `data-magnetic` is already on the hero button as the hook.

### Done
- Planning pack: `docs/00` to `docs/06` (design, architecture, copy, motion, roadmap, hero footage shortlist).
- Agent rules: `AGENTS.md`, `CLAUDE.md`, `.claude/skills/saviour-digital-site-builder/` (skill plus `qa-check.sh`).
- Project setup: `package.json`, `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc`, Prettier, ESLint, VS Code settings.
- Scripts: `vendor`, `pin`, `build`, `csp:check`, `qa` (all in `scripts/`).
- Page skeleton: `index.html` with all 8 section IDs, headings only. No body copy yet.
- CSS: `tokens.css` (all colours, type, space), `base.css` (fonts, reset, focus, button), `mobile.css`, `desktop.css` (header, hero, generic section, footer only).
- JS: `boot.js` (swaps desktop and mobile modules at 1024 px), `core/env.js`, `core/motion-tokens.js`, `desktop/index.js` (GSAP plus Lenis wiring), `mobile/index.js` (GSAP only).
- Deploy files: `_headers` (CSP plus cache rules), `robots.txt`, `sitemap.xml` (placeholder domain).

### Verified offline (3 Nov 2026)
JS syntax; JSON validity; QA script (0 failures); gitignore rules; CSP hash matches the inline script; pin script with fake packages; `build.mjs` output contains only public files; `boot.js` mode swap and failure path in Node and in real Chromium (375 px and 1400 px, with a **stand-in** vendor file).

### done and verified
- **hero video and hero poster are in the project.**
- fonts are in `assets/fonts/`
- No logo, no icons, no photos, no copy beyond the hero headline, no contact details, no form.


Do not add any other font. Rule: no third typeface, no Google Fonts link tags.


From the source, make three files with the ffmpeg commands in `06-hero-footage-shortlist.md`:

| Final file | Target size |
|---|---|
| `assets/video/hero-720.mp4` (desktop) |
| `assets/video/hero-480.mp4` (mobile) |
| `assets/video/hero-poster.avif` plus `assets/video/hero-poster.webp` (fallback) | under about 60 KB |

Hero code: `js/core/hero-video.js` is written (phase 2). It expects `assets/video/hero-720.mp4` and `hero-480.mp4`.

### 3.4 Logo and brand files (owner)

The logo is being designed. When it is ready, we need:

| File | Where | Notes |
|---|---|---|
| `logo.svg` (single stroke path if possible, for the DrawSVG loader) | inline in `index.html`, source in `assets/icons/` | Then confirm or adjust the palette in `css/tokens.css` |
| `favicon.svg` | `assets/img/favicon.svg` | |
| `favicon.ico` (32x32) | site root | |
| `apple-touch-icon.png` (180x180) | `assets/img/` | |
| `og-image.jpg` (1200x630, under 150 KB) | `assets/img/og-image.jpg` | Link preview on WhatsApp and Facebook |

### 3.5 Team photos (owner)

Five people. Per person, `assets/img/team-<firstname>-400.avif`, `-800.avif`, plus `.webp` versions of both. One consistent crop and tone. Names, roles and bios go in `docs/HANDOFF.md` first, then the page.

---

## 4. Icons

**Decision (3 Nov 2026, evening):** all line icons come from **Lucide** (ISC licence), built by `npm run icons`. The owner's own picked icons (multicolour, from different packs) were not used: they mix five styles and colours, and their licences are unknown. Custom-drawn service icons can replace the Lucide ones later without touching the page code (same file names).

**Format for every icon:** SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, round caps and joins. Colour comes from CSS (`color`), never from the file. Not PNG, not an icon font.


| File in `assets/icons/` | Lucide icon | Used for |
|---|---|---|
| `arrow-right.svg` | `arrow-right` | Links and buttons |
| `plus.svg` | `plus` | Accordions (rotates 45 degrees into a cross) |
| `close.svg` | `x` | Close menu, dialogs |
| `check.svg` | `check` | Package lists, form success |
| `phone.svg` | `phone` | Call button, contact |
| `mail.svg` | `mail` | Email link |
| `map-pin.svg` | `map-pin` | Address |
| `menu.svg` | `menu` | Mobile menu button |
| `service-website.svg` | `app-window` | Business website |
| `service-starter.svg` | `layout-template` | One-page starter site |
| `service-shop.svg` | `store` | Online catalogue or shop |
| `service-search.svg` | `map-pinned` | Google and Maps visibility |
| `service-social.svg` | `share-2` | Social media and brand basics |
| `service-marketing.svg` | `megaphone` | Digital marketing (added 4 Nov, replaces hosting) |
| `service-data.svg` | `clipboard-list` | Data collection (added 4 Nov) |
| `service-maintenance.svg` | `wrench` | Maintenance and support |
| `whatsapp.svg` | (not Lucide) | WhatsApp button **and** the WhatsApp service row. Official glyph, added by hand, single colour (`currentColor`). `npm run icons` copies it into the sprite as `#whatsapp` |
| `social-<name>.svg` (for example `social-facebook.svg`) | (not Lucide) | Footer links, **only for profiles that really exist** |

**Use on the page**
- Repeated UI icons: `<svg class="sv-icon" aria-hidden="true"><use href="assets/icons/sprite.svg#arrow-right"></use></svg>`
- Service icons that draw themselves on hover (DrawSVG): paste the file's markup **inline**. DrawSVG cannot reach paths inside `<use>`.
- Icon next to text: `aria-hidden="true"`. Icon alone (menu button): put the label on the button, `aria-label="Open menu"`.

**WhatsApp and social glyphs.** Brand logos are not drawn by us. Use a single-colour version so they follow the palette, per each brand's guidelines (WhatsApp: https://about.meta.com/brand/resources/whatsapp/ ; Facebook: Meta brand resources). Save as `whatsapp.svg` / `social-facebook.svg`, set `fill="currentColor"`, remove any hard-coded colours.

## 5. Folders that exist but are empty (fill these, do not recreate them)

| Folder | Currently | Fill with |
|---|---|---|
| `assets/fonts/` | README only | `clash-display-600.woff2`, `inter-latin-var.woff2` (auto), Clash licence |
| `assets/vendor/` | empty | `vendor.js`, `VERSIONS.txt` (from `npm run vendor`; commit them) |
| `assets/video/` | `.gitkeep` | `hero-720.mp4`, `hero-480.mp4`, `hero-poster.avif/.webp` |
| `assets/img/` | `.gitkeep` | team photos, `og-image.jpg`, favicon set |
| `assets/icons/` | `.gitkeep` | Icons from section 4: run `npm run icons`, then add `whatsapp.svg` and any real social icons by hand |
| `js/core/` | `env.js`, `motion-tokens.js`, `nav.js`, `hero-video.js`, `hero-intro.js`, `accordion.js`, `faq.js`, `why-reveal.js` | add `form.js` |
| `js/desktop/` | `index.js`, `smooth-scroll.js`, `header-scroll.js`, `fold.js`, `cursor.js`, `magnetic.js`, `section-rail.js`, `scrub-text.js`, `count-up.js`, `packages-rise.js`, `team-reveal.js`, `services-hover.js`, `showcase-horizontal.js` | (phase 6 added `fold.js`, `cursor.js`, `magnetic.js`; `js/core/` gained `loader.js`, `refresh.js`) |
| `js/mobile/` | `index.js`, `menu-sheet.js`, `action-bar.js`, `services-accordion.js`, `reveal.js`, `showcase-swipe.js` | |

Files that do not exist yet: `privacy.html` (required by Malawi's Data Protection Act, 2024), `404.html`, `.env.example` (not needed: the Web3Forms key is public by design and goes in the form markup).

Each new JS file in `desktop/` or `mobile/` must be called from that mode's `init()` and cleaned up in `destroy()`. Do not import desktop or mobile files from `core/` (ESLint blocks it).

---

## 6. What to build next, in order

Follow the lanes in `AGENTS.md` section 5 and the schedule in `docs/05`.


4. **Done (5 Nov 2026). Showcase, why, FAQ** (Lane D). See the phase 4 block in section 1.
5. **Done (5 Nov 2026). Contact, form, privacy, SEO** (Lane E). See the phase 5 block in section 1. Still needs the owner's Web3Forms key and domain.
6. **Done (6 Nov 2026). Motion pass**: loader, section folds (twice only), scrub text, cursor, magnetic button. See the phase 6 block in section 1.
7. **Done in the repo (6 Nov 2026). QA and launch preparation** (Lane G). See the phase 7 block in section 1. **NEXT: the launch itself**, by the owner, with `docs/08-LAUNCH-RUNBOOK.md`: fix ESLint, `npm run launch:fill`, `npm run qa:launch`, deploy to Cloudflare Pages (build `npm run build`, output `dist`), connect the domain, test live, Search Console, Business Profile, uptime monitor.

Do not add `data-reveal` hiding styles until the reveal code exists. Hidden "before animation" states must live only under `html.js`.

---

## 7. Decisions already made (do not reopen)

Fonts Clash Display plus Inter; palette cobalt blue, orange, white and one charcoal section (provisional until the logo); pricing is quote-only with package buttons that pre-fill the form; instalments are mentioned without numbers (draft terms in `docs/03` section 5.1 stay out of the site); payment methods Airtel Money, TNM Mpamba and bank transfer; English only; hosting Cloudflare Pages (backup Netlify, avoid Vercel Hobby for commercial use); admin dashboard later (Cloudflare Workers plus PostgreSQL); business name exactly "Saviour Digital Solutions".

## 8. Still needed from the owner

Phone and WhatsApp number, email, Blantyre address, opening hours; real social links; five team names, roles, bios, photos; logo; domain; hero footage choice (A yes or no, or own footage); instalment terms; Web3Forms access key (free at web3forms.com).

## 9. Rules that must not be broken

Never invent facts, prices, stats, testimonials or contact details. Never commit secrets. Self-host everything. No `href="#"`, no emoji icons, no banned words. Run `npm run check` before saying anything is done, and report what you could not test.
