# 07. Handover and downloads

Written Tue 3 Nov 2026, updated Wed 4 Nov 2026 after phase 3. Business deadline: **Sunday 8 Nov 2026**.
Read this first if you are picking the project up. Then read `AGENTS.md` and `docs/00` to `docs/06`.

---

## 1. Where the project stands

### Phase 3 done (Wed 4 Nov 2026): about, services, packages (Lane C)
- **About (`#about`):** title left, big statement right (desktop: words scrub from faint to full; mobile: lines fade up once), two sourced figures with "Source, year" links (4.02 million internet users, October 2025; almost 1.6 million MSMEs, 2019), and "who we are". Figures count up once on desktop; the real number is in the HTML.
- **Services (`#services`):** nine ruled rows (no cards). Desktop: sticky title column, row 1 open, hover intent opens a row, the icon draws itself (DrawSVG). Mobile: tap to open, one open at a time. Both use `js/core/accordion.js`, which turns each heading into a real `<button>` and works for the FAQ too. Without JS every row is open.
- **Packages (`#packages`):** three cards (the only cards on the site), Business recommended with a blue top rule, check icons, instalment wording, quote-only buttons with `data-package`. Shared payment line and add-ons line underneath. Desktop cards rise with a small overshoot and lift on hover; on a phone they stack with Business first.
- **Left off the page on purpose:** the team block (no names or photos yet; template in `docs/HANDOFF.md`), all timelines, page counts and maintenance terms (all `[TBC]` in docs/03), and detail for services 07 and 08.
- **New files:** `js/core/accordion.js`, `js/desktop/scrub-text.js`, `count-up.js`, `packages-rise.js`, `services-hover.js`, `js/mobile/services-accordion.js`, `reveal.js`.
- **Verified in Chromium (4 Nov 2026):** 375, 768 and 1440 px screenshots; tap, hover-intent, keyboard (Enter, Tab order, focus ring); DrawSVG draws; resizing 1400, 900, 375, 700, 1300 px leaves one button per heading, one rail and no pin spacers; reduced motion shows everything at once; no-JS shows every row open; no console errors; `npm run qa` has no new failures (only the three phase 2 contact `[TBC]` links); CSP hash still matches. **Not run:** `npm run lint`, `format:check`, Lighthouse and a real phone (the build environment cannot run npm).
- **Found, not fixed (other lane):** deep links such as `index.html#packages` do not scroll to the section on desktop (also true of the phase 2 zip). See `docs/HANDOFF.md`.

### Phase 2 done (Wed 4 Nov 2026): hero and navigation (Lane B)
- **Markup:** header (brand, six links, WhatsApp button, menu button), hero (poster picture, video element, veil, headline, lead, two actions, scroll cue), mobile action bar.
- **Hero poster:** `assets/img/hero-poster-800.avif/.webp` and `hero-poster-1600.avif/.webp` made from `assets/img/hero-poster.png` (AVIF 23 KB and 57 KB). The PNG stays as the source and is skipped by `npm run build`.
- **Hero video:** `js/core/hero-video.js` loads `assets/video/hero-720.mp4` (desktop layout) or `hero-480.mp4` (mobile layout) after the page `load` event, only on good connections, never with reduced motion or Save-Data; pauses off-screen and in hidden tabs. These two files must exist in `assets/video/` (they were removed from the zip only to keep it small).
- **Hero entrance:** `js/core/hero-intro.js` (SplitText headline lines, then lead and buttons). Plays once per page load. CSS hides the text only under `html.js`, with a 4 second failsafe.
- **Desktop:** `smooth-scroll.js` (Lenis), `header-scroll.js` (transparent over hero, solid after, hides on scroll down), `hero-scroll.js` (media grows 1 to 1.08, veil deepens), `section-rail.js` (right-edge rail).
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
| `js/core/` | `env.js`, `motion-tokens.js`, `nav.js`, `hero-video.js`, `hero-intro.js`, `accordion.js` | add `form.js` |
| `js/desktop/` | `index.js`, `smooth-scroll.js`, `header-scroll.js`, `hero-scroll.js`, `section-rail.js`, `scrub-text.js`, `count-up.js`, `packages-rise.js`, `services-hover.js` | add `fold.js`, `showcase-horizontal.js` |
| `js/mobile/` | `index.js`, `menu-sheet.js`, `action-bar.js`, `services-accordion.js`, `reveal.js` | add `showcase-swipe.js` |

Files that do not exist yet: `privacy.html` (required by Malawi's Data Protection Act, 2024), `404.html`, `.env.example` (not needed: the Web3Forms key is public by design and goes in the form markup).

Each new JS file in `desktop/` or `mobile/` must be called from that mode's `init()` and cleaned up in `destroy()`. Do not import desktop or mobile files from `core/` (ESLint blocks it).

---

## 6. What to build next, in order

Follow the lanes in `AGENTS.md` section 5 and the schedule in `docs/05`.


4. **NEXT PHASE. Showcase, why, FAQ** (Lane D): desktop horizontal pin, mobile swipe row, charcoal "why" section, FAQ accordion (reuse `js/core/accordion.js`, see `docs/HANDOFF.md`). Label demos "Concept demo, not a client."
5. **Contact, form, privacy, SEO** (Lane E): Web3Forms form with honeypot, WhatsApp link, `privacy.html`, `404.html`, JSON-LD, Open Graph tags.
6. **Motion pass**: loader, section folds (twice only), scrub text, cursor, magnetic button. See `docs/04`.
7. **QA and launch** (Lane G): `npm run check`, Lighthouse mobile, form test, keyboard and reduced-motion checks, deploy to Cloudflare Pages (build `npm run build`, output `dist`), then replace the placeholder domain in `sitemap.xml` and `robots.txt`.

Do not add `data-reveal` hiding styles until the reveal code exists. Hidden "before animation" states must live only under `html.js`.

---

## 7. Decisions already made (do not reopen)

Fonts Clash Display plus Inter; palette cobalt blue, orange, white and one charcoal section (provisional until the logo); pricing is quote-only with package buttons that pre-fill the form; instalments are mentioned without numbers (draft terms in `docs/03` section 5.1 stay out of the site); payment methods Airtel Money, TNM Mpamba and bank transfer; English only; hosting Cloudflare Pages (backup Netlify, avoid Vercel Hobby for commercial use); admin dashboard later (Cloudflare Workers plus PostgreSQL); business name exactly "Saviour Digital Solutions".

## 8. Still needed from the owner

Phone and WhatsApp number, email, Blantyre address, opening hours; real social links; five team names, roles, bios, photos; logo; domain; hero footage choice (A yes or no, or own footage); instalment terms; Web3Forms access key (free at web3forms.com).

## 9. Rules that must not be broken

Never invent facts, prices, stats, testimonials or contact details. Never commit secrets. Self-host everything. No `href="#"`, no emoji icons, no banned words. Run `npm run check` before saying anything is done, and report what you could not test.
