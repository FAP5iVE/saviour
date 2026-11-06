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

## Update 6 Nov 2026 (evening): phase 9 (showcase redesign, live project, analytics, Google guide)

**Done:**
- **Showcase redesigned.** The five concept demos no longer share one template. Each has its own layout, type treatment and palette: salon (blush, arch and circle, rounded buttons), hardware (hazard yellow and black, numbered grid), restaurant (dark, centred, dotted menu), farm produce (side column and a season calendar), tutoring (squared paper and a weekly timetable). Still HTML and CSS only, no images, hidden from screen readers, "Concept demo, not a client." on each. Colours come from new `--demo-*` tokens in `tokens.css` (they colour the pretend client sites, not ours). CSS is in `css/base.css`, block "The mini-site frame".
- **Live project added, first in the row: SMS Malawi** (https://sms-malawi.vercel.app/), labelled "Live project." with a "Visit the live site" link (new tab, `rel="noopener noreferrer"`) and its own "Ask for a site like this" button that pre-fills the form ("I would like a site like the SMS Malawi school website."; `data-demo-live` in `form.js`). The copy uses only what the live page shows. The panel picture is a **drawing** in the school's navy (the live site's theme colour), because this environment could not open the site to screenshot it. The showcase now has six panels; the lead text, aria-label, progress dots and pin all follow.
- **Privacy-friendly analytics prepared:** Cloudflare Web Analytics. `_headers` CSP allows `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (connect); `privacy.html` "Cookies" paragraph now says visits are counted without cookies. Nothing is added to the page; it only counts once the owner switches it on in Cloudflare (Pages, Metrics, Web Analytics). If it is never switched on, the privacy page overstates, so switch it on at launch or revert both changes.
- **New guide:** `docs/10-FIND-US-ON-GOOGLE-AND-ANALYTICS.md` (Google Business Profile, Search Console, analytics, Facebook). `docs/08` item 4 points to it.

**Checked in Chromium:** all six panels at 375 and 1440 px (contact sheets); desktop pin runs through all six (pin distance 4598 px), progress line fills; mode swap 1400, 375, 1400, 900, 1400 (3 spacers on desktop, 0 on mobile, no sideways scroll); 6 progress dots on phones; every showcase link 44 px or more; no console errors; the live-project button pre-fills the form. `npm run qa`: 0 failures (3 launch warnings). `npm run csp:check`: OK. **Not run:** Lighthouse after the showcase change (the new CSS adds a few KB), real phone, Prettier.

**SMS Malawi follow-up (6 Nov 2026, 23:00):** the live site could not be opened from this environment (the proxy refuses vercel.app, 403), so there is still **no real screenshot**. The public GitHub repo `FAP5iVE/sms-malawi` cloned, but it is a Next.js app that needs a package install, a database and keys, which this session cannot do. The login given in chat was **not used**. What was learned from the repo: it is a school management system by 5iveStack Labs, shown with a demo school ("Chikangawa Hills Academy") and demo data; the hero photo (students in uniform) looks AI-generated, so it is **not** used on this site. The drawing now uses the app's real brand colours (`#1e3a5f` navy, `#2e86ab` teal blue) and the panel says "Live project, shown with demo data." To get a real picture: send 1 or 2 screenshots of the public home page (not the admin area), and Claude will compress them to WebP and put them in the panel. The password shared in chat should be changed.

**Owner to do:**
1. **Facebook:** send the page's full web address. It goes in the footer and the JSON-LD `sameAs`. It is **not** added yet because no address was supplied and none can be guessed.
2. **SMS Malawi:** send a real screenshot (and permission to show it) if you want the drawing replaced; confirm the "5iveStack Labs" credit on that site is fine; confirm the exam results page has data before relying on it as proof (it showed "Data unavailable" when the page was read).
3. After launch: do `docs/10` (Google Business Profile, Search Console, switch on analytics).

## Update 6 Nov 2026 (night): phase 8 (owner corrections and footer)

**Done (owner's requests, no new section):**
- **Name:** the founder is **Saviour Kumalawi**, not Banda. Changed in `index.html` (founding story, team name, photo alt text) and in every doc. No "Banda" is left in the project. The email `saviourkumalawi@gmail.com` already matched.
- **Fyaupi:** the role line is **Developer**. "Electronics and Computer Engineer" is in his bio: "Electronics and Computer Engineer with a big interest in software and embedded systems. He likes turning ideas into things that work." Nothing new is claimed.
- **Footer restyled** (`.sv-footer`, markup at the end of `index.html`): flat blue-tint band with a short orange rule on its top edge; a tagline; three ruled columns (Explore: six anchors; Talk to us: WhatsApp, phone, email, quote; Find us: Blantyre, Malawi and the 7:30 to 4:30 hours already on the page); a huge two-line **wordmark** ("Saviour / Digital Solutions", Clash Display, sized by `--text-wordmark` so the long line fills the page width); a bottom bar with (c) 2026, Privacy policy and Back to top. All facts were already on the page. No cards, no shadows, no new colours, no new third-party request. It is **not** a second dark section.
- **Footer wordmark drift (docs/04 section 7, left out in phase 6) is now built:** `js/desktop/footer-drift.js` (`MOTION.footer.drift`), desktop only, skipped for reduced motion. The wordmark rises 28% out from behind the bottom bar, scrubbed to scroll, transform only. Phones: static.
- **Files touched:** `index.html` (footer, team, founding story), `css/tokens.css` (`--text-wordmark`), `css/base.css` (block "Shared components: footer"), `css/desktop.css` and `css/mobile.css` (footer blocks), `js/core/motion-tokens.js` (`footer`), `js/desktop/index.js` (one import, one line), `js/desktop/footer-drift.js` (new), docs. Lane owners: all of these were done in one pass at the owner's request; review if you split lanes again.

**Checked in Chromium (served from the project folder, not `dist/`):** footer at 375, 768 and 1440 px (no sideways scroll, wordmark fits); mode swap 1400, 375, 1400, 800, 1280, 1023, 1024 px (3 pin spacers on desktop, 0 on mobile, wordmark transform cleared on mobile); no console errors or warnings; drift moves 50 px at mid-scroll and sits at 0 at the bottom; Back to top returns to 0; reduced motion (no transform, wordmark visible); no JS (wordmark visible, all links 44 px or more); every footer link tap target is 44 px at 375 px; muted text on the tint is 5.27:1, blue 6.94:1 (AA). `npm run qa`: 0 failures (the 4 warnings are the owner's launch items plus the known phone-menu orange false positive). `npm run csp:check`: OK. **Not run:** Prettier, ESLint, Lighthouse, a real phone.

**Web3Forms key (added 6 Nov 2026, 10:00):** the owner's key is now in the hidden `access_key` field of `index.html` (set with `npm run launch:fill -- --key`, CSP hash still valid, `npm run csp:check` OK). The form QA warning is gone. A mocked submission posts once with the key and shows the success state. **A real delivery has not been tested; do it on the live site.** How to change the key later: `docs/09-CHANGE-WEB3FORMS-KEY.md` (new).

**Custom cursor switched off (6 Nov 2026, 10:10):** the owner wants the ordinary cursor. `js/desktop/index.js` no longer calls `initCursor()`; `cursor.js`, its CSS and tokens stay in the project, dormant. No cursor element, no `cursor: none`, links show the normal pointer (checked in Chromium at 1440 px, no errors). The orange "View" disc on the showcase is gone with it. To restore: import `initCursor` and add it to the `cleanups.push(...)` next to `initMagnetic()`. The magnetic hero button is unchanged.

**Owner to check:**
1. **Team photos.** The Saviour and Charity images still look like stock or placeholder pictures, not matching portraits (see the 4 Nov entry). Please replace them with real, matching photos of the actual people, and confirm you have the right to use every photo on the site.
2. The footer says "(c) 2026". Change the year when needed.
3. Still open from before: domain, street address, opening days, social links, retention period (see `docs/08-LAUNCH-RUNBOOK.md`).

## Update 6 Nov 2026 (evening): phase 7 (QA and launch, Lane G)

**What was done:** every check that can run offline, a launch runbook (`docs/08-LAUNCH-RUNBOOK.md`), a one-command fill-in for the domain and form key (`scripts/launch-fill.mjs`), and a launch mode for the QA script. **No site code, copy or CSS was changed.** The site is not deployed: that needs the owner's accounts.

### Changed (Lane G files only)
- `scripts/qa-check.sh` (both copies): `bash scripts/qa-check.sh . --launch` (or `npm run qa:launch`) turns the three launch gates into failures: empty Web3Forms key, `REPLACE-WITH-DOMAIN` left in html, xml or txt, and no live `Sitemap:` line in `robots.txt`. Normal runs still warn only. `dist/` is now excluded from the scan.
- `scripts/launch-fill.mjs` (new): `npm run launch:fill -- --domain <bare domain> --key <Web3Forms key>`. Validates both, fills them in, leaves the CSP hash intact, safe to run twice. Tested on a copy: after it, `qa:launch` has 0 failures and a mocked form submission carries the key.
- `package.json`: two new scripts only (`qa:launch`, `launch:fill`).
- `docs/08-LAUNCH-RUNBOOK.md` (new), `docs/07` (phase 7 block), `docs/05` (checklist status), `docs/00` (file table), lane tables in `AGENTS.md`, `SKILL.md` and `.claude/skills/.../SKILL.md` (Lane G row lists `launch-fill.mjs`).

### Open items for the owner or the next session
1. **ESLint version bug is NOT fixed in the zip** (as the phase 6 note asked). `package.json` says `"eslint": "^4.0.0"` and the lock file pins 4.0.0; `eslint.config.js` is a flat config. Run `npm install --save-dev eslint@9` on a computer with internet and commit both files. Not done here on purpose: editing `package.json` without regenerating the lock would make `npm ci` (which Cloudflare Pages runs) fail. Until then `npm run lint` and `npm run check` fail at the lint step; `npm run qa` and `npm run csp:check` work.
2. **Desktop CLS from fold 2 (found in this pass).** When the FAQ pin releases (scroll about 12,800 px at 1440 wide), Chrome records one layout shift of 0.742 (`#faq` and `.sv-fold-dim`). It repeats at every scroll speed tested. Nothing visibly jumps: the FAQ moves about 12 px and is already covered by Contact. Cause: GSAP switches the pinned FAQ from `position: fixed` to `position: relative` plus a `translateY(900px)` transform, and Chrome's shift tracker ignores the transform but sees the layout position change. The hero pin does not do it because its fixed position and flow position are both `top: 0`. Phones have no pins and measured 0. Lighthouse does not scroll, so it will not report it. It matters only for desktop field data (Core Web Vitals). Options, cheapest first: (a) accept and note it; (b) replace the FAQ pin with `position: sticky` (top = viewport height minus FAQ height, set on each refresh) and trigger the scrub from `#contact` (`start: 'top bottom'`), which removes the position switch, but `nav.js` `anchorFor()` then measures a stuck FAQ and would need to use the section's flow position (it currently relies on `.pin-spacer`); (c) drop fold 2 (the cut list in docs/05 puts it first). Not attempted at launch.
3. **Total blocking time on a throttled phone is about 700 ms** (slow 4G, 4x CPU, 375 px): a 362 ms task at 1.3 s and a 316 ms task at 3.5 s, causes not traced. Probably the largest drag on the Lighthouse performance score. Profile with Chrome DevTools Performance on a real phone. Cheapest known lever from phase 6: shorten or skip the loader (`MOTION.loader`), then check what `boot.js` loads before first paint.
4. **Desktop LCP is the hero lead paragraph (about 1.9 s on a fast connection)**, because the text waits for the loader curtain (`introGate()`). On a phone the LCP is the hero picture (about 0.3 s unthrottled, 2.0 s throttled). On a slow desktop connection the LCP gate could be missed because of the loader.
5. **Keyboard wrap-around:** after the last link (Privacy policy) the next Tab goes to the Skip link and Lenis glides the page back to the top over about 1.5 s, so for that moment the focused Skip link is off screen. Harmless; call `lenis.scrollTo(0, { immediate: true })` on `focusin` of `.sv-skip` if it bothers anyone.
6. **Back/forward lands about 60 px away from where a click landed** for `#services` (3267 against 3327). Same section, still on screen. Left alone.
7. **Everything in "Owner to supply before launch" in the phase 5 entry below is still open**: Web3Forms key, domain, street address, opening days, social links, retention period. Also still open from earlier entries: instalment terms, timelines, how a finished site goes live, photos, logo, the "Owner to confirm" lists.

### Checked in Chromium (Playwright, 6 Nov 2026), served from `dist/` with the real `_headers` applied
- **Console and CSP:** no errors or warnings at 375, 768, 1024 and 1440 px, including a full scroll. No CSP violations.
- **Layout:** no sideways scroll at any of the four widths. Resize 1400, 375, 1400, 800, 1280, 1023, 1024 px: correct mode each time (1023 mobile, 1024 desktop); desktop always has 3 pin spacers, 1 cursor, 1 dim layer, 1 rail; mobile has none; 9 services buttons each time.
- **Weight (uncompressed, served by a plain static server):** first load without video 360 to 470 KB; video 1.3 MB (phone) or 3.5 MB (desktop) after `load`. Inside the 1 MB gate; the video is outside "first load" by design.
- **Throttled phone (slow 4G, 4x CPU):** FCP and LCP 2.04 s, CLS 0 (see items 3 and 4 above for TBT).
- **Links:** 35 anchors all resolve; 2 external source links have `noopener noreferrer`; `tel:+265886023482`, `mailto:saviourkumalawi@gmail.com`, WhatsApp `wa.me/265886023482` with encoded message; `/privacy.html` 200; unknown paths return the 404 page with its CSS and icons.
- **Semantics:** one `h1`, headings in order (h2 sections, h3 items), `lang="en"`, all fields labelled, every image has an `alt` attribute (the poster and loader logo are `alt=""`, decorative).
- **Tap targets at 375 px:** every control is 44 px or more in hit area. The accordion buttons measure 22 px tall alone, but their `::after` covers the whole row (74 to 177 px). Checkbox labels are 44 px.
- **Keyboard:** 69 tab stops in a sensible order, skip link first; every stop scrolls into view; focus ring present (accordion rings are drawn on the button's `::after`, so a check of the button's own outline reports "none" falsely).
- **Reduced motion:** no loader, no pin spacers, no cursor, video blocked with `blocked:reduced-motion`, nothing faint after scrolling the whole page.
- **No JavaScript:** headline visible, loader hidden, every FAQ and service answer open, no sideways scroll.
- **Form (mocked Web3Forms, key filled by `launch-fill`):** one POST on desktop and on a 375 px phone, with the key and consent in the body, success state shown, no CSP errors. A real delivery was not tested.
- **History:** nav clicks write the hash; Back and Forward return to the same sections (desktop and phone).
- **Contrast:** the orange current link in the phone menu is on `--blue-deep` at 4.86:1 (AA). The QA "orange text" warning is a false positive for that rule.
- **Share assets:** `og-image.jpg` is 1200 x 630 and 58 KB; `apple-touch-icon.png` 180 x 180; icons linked from `assets/img/`.

### Not run (cannot run here)
`npm run lint` and `npm run format:check` (no ESLint 9 or Prettier offline), Lighthouse, a real phone (low-end Android, iPhone), Safari and Firefox, a screen reader, a real Web3Forms delivery, the deploy itself, Search Console, Business Profile, uptime monitor.

## Update 6 Nov 2026: phase 6 (motion pass) and the open hand-off requests

**What was built (Lane B and the motion pass):** loader, two folds, custom cursor, magnetic button, and the nav, deep-link, services and action-bar fixes. Details in `docs/07` section 1 (phase 6 block).

### Requests closed in this pass (all status: done)
- **[Lane D to Lane B] Nav links to a pinned section:** fixed in `js/core/nav.js` (`anchorFor()` measures the `.pin-spacer` wrapper). This covers the showcase and both folds, and it also fixes the deep link on load.
- **[Lane C to Lane B / A] Deep links on desktop and phone:** fixed (`nav.js` jumps after fonts and the first measure; `smooth-scroll.js` calls `lenis.resize()` first, because Lenis learns the new page height a frame late). Links land 80 px above the section, the same as a click (the header offset, `scroll-padding-top`).
- **[Lane D to Lane C] Services row 1 grows after the triggers are measured:** fixed by opening row 1 with the CSS transition switched off for that moment (`services-hover.js`). Token `MOTION.services.refreshDelay` added (used by the existing toggle refresh).
- **[Lane E to motion pass] Mobile action bar over the form:** hides while `#contact` is on screen (`action-bar.js`).
- **[Lane B to motion pass] Hero scroll effect merged with fold 1:** `js/desktop/hero-scroll.js` is deleted; its effect lives in `js/desktop/fold.js`. Lane tables in `AGENTS.md`, `SKILL.md` and `.claude/skills/.../SKILL.md` updated.
- **[Lane C to Lane B] Fold 1 and the About scrub start:** checked. About's scrub text starts after the fold (the hero pin is one screen; scrub starts when About is on screen).
- **[Lane D to Lane F / motion pass] `data-cursor="view"` hook:** used by `cursor.js`.

### Files outside the motion pass's lane that were changed (for the lane owners to review)
- **Lane A:** `index.html` (inline script now also sets `sv-loading`; loader block after `<body>`; `data-reveal` added to `.sv-about__head`, `.sv-contact__intro`, `.sv-contact__formwrap` for the phone fade), `_headers` (new inline-script hash), `css/tokens.css` (`--z-loader`, `--z-cursor`, `--logo-blue`, `--loader-mark`, `--cursor-dot`, `--cursor-ring`, `--cursor-line`, `--cursor-label`), `js/core/motion-tokens.js` (groups `loader`, `fold`, `cursor`, `magnetic`; `services.refreshDelay`).
- **Lane F:** `css/base.css` (block "Shared components: loader"), `css/desktop.css` (blocks "folds" and "custom cursor and magnetic button"; `.sv-about`, `.sv-contact` z-index; `.sv-faq` `position: relative`; light sections now have an explicit background through a zero-specificity `:where()` rule).
- **Lane C:** `js/desktop/services-hover.js` (one change, above).

### Decisions
- **Fold 2 is FAQ to Contact, not Why to Contact.** The page order is Why, FAQ, Contact, so Why is not next to Contact. Contact slides over the section just before it. If the owner wants the charcoal Why involved, the cheapest honest option is to move the FAQ above Why in `index.html` (a content-order decision for Lane D) and change `under` in `foldContact()` to `#why`.
- **Loader length** is about 1.25 s on desktop and 1.0 s on a phone (docs/01 says at most 1.2 s, docs/04 says "about 0.9 s" for the drawing). Numbers are in `MOTION.loader`. It is the first thing to cut if Lighthouse Speed Index suffers, since Lighthouse always sees a first visit.
- **Loader repeat rule:** once per browser session (`sessionStorage` key `sv-seen`); blocked storage means no loader.
- **Hero fold shrinks the whole hero (0.96) with a dark backdrop,** not only the text, so the picture and text move together.
- **Footer wordmark drift (docs/04 section 7) not built:** there is no wordmark in the footer; adding one is a design decision.

### Notes for Lane G (QA and launch)
- **`package.json` has `"eslint": "^4.0.0"` and `package-lock.json` locks eslint 4.0.0,** but `eslint.config.js` is a flat config and `@eslint/js` is ^9. ESLint 4 cannot read flat config, so `npm run lint` will fail after `npm install`. Set eslint to `^9` (same line as `@eslint/js`), run `npm install` to refresh the lock file. Not changed here because the lock file cannot be regenerated offline.
- Test on a real phone and run Lighthouse mobile with the loader on (first visit). Watch LCP and Speed Index. The hero picture is the LCP element and paints under the loader.
- Back and forward buttons after anchor clicks were not tested.
- Keyboard: tab through the page while the FAQ fold and hero fold are active (focus inside a pinned section that is covered scrolls normally).

## Update 5 Nov 2026 (copy correction session): founding story brief, email, hours, Fyaupi bio

Text-only pass. No new section, no new files, no phase work started.

**Adopted from the owner's founding-story brief**
- Zantchito Entrepreneurship Incubation Programme, and that the founder took part in it (answers the old open question "who was taught": the founder, Saviour Kumalawi). The programme also covered business development and managing money.
- The business is new and still starting out, so "Who we are" now says "a new team" and the page makes no claim of finished client work. The showcase stays labelled as concept demos.
- Individuals, start-ups, NGOs and other organisations are named as welcome, while small businesses and new entrepreneurs stay the focus.
- Meta description (page, og and JSON-LD, all three kept identical) rewritten. The old one read "Saviour Digital Solutions build digital footprint...", which was ungrammatical.

**Not adopted, and why**
- The long vision and mission text, the "Our Commitment" paragraph and the sector list (retail, agriculture, hospitality...): generic wording, and the sector list is a claim of reach the business has not earned yet. No vision or mission section was added (a new section needs the owner's approval).
- "Digital Business Solutions" as a sixth service: too vague to quote on. The nine services already cover the brief's five (website, data collection, marketing, maintenance and support).
- Data collection: the page already separates online forms and surveys from physical data collection, so the brief's suggested split is covered. Left unchanged.
- Phrases such as "embrace digital technology", "data-driven", "empowering", "technology should connect people to possibilities": filler, and "empower" is on the banned list.

**Owner details now on the page**
- Email saviourkumalawi@gmail.com: contact block, form failure message (text and link), footer, privacy page (two places), JSON-LD `email`.
- Hours: "Open 7:30 am to 4:30 pm. You can still reach us by phone, WhatsApp or email at any time." in the contact block. JSON-LD `openingHours` was **not** added: it needs the days of the week, and none were given.
- Fyaupi's bio shortened to two plain sentences in his team card (`.sv-team__does`). The full supplied bio was too long for a three-column card and leaned on "enthusiast" and "innovative technology".

**Owner to confirm**
1. Was the Rynberg Stacks lesson part of the Zantchito programme? The About text now reads as if it was.
2. Which days the 7:30 to 4:30 hours apply to (Monday to Friday? Saturday?), so the days can be added to the page and JSON-LD.
3. The "Owner to supply" item 3 below (email address) is done. Phone, WhatsApp and email are all in place; Web3Forms key and domain are still open.

## Update 5 Nov 2026 (later): phase 5 (contact, form, privacy, SEO)

**What was built (Lane E):** the `#contact` section (WhatsApp button, phone link, quote form), `js/core/form.js`, `privacy.html`, `404.html`, JSON-LD, canonical and `og:url`, the footer privacy and phone links, and a sitemap entry for `/privacy`.

### Owner to supply before launch (nothing was invented; each is left off the page, not shown as a placeholder)

1. **Web3Forms access key.** Make a free key at web3forms.com (it is tied to the email that should receive requests) and paste it into `<input type="hidden" name="access_key" value="">` in `index.html`. **Until then the form cannot send:** it shows the "Sorry, that didn't send" state with WhatsApp and call links, and logs a console warning. The key is public by design.
2. **Domain.** `REPLACE-WITH-DOMAIN` appears in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD), `privacy.html` (canonical), `sitemap.xml`. `robots.txt` has the Sitemap line commented out until the domain exists.
3. **Email address.** When supplied: add it to the failure block in the form (`data-form-fail`), to the contact details list (`.sv-contact__details`), to `privacy.html` ("Who we are" and "Your rights") and to the JSON-LD (`"email"`).
4. **Street address, opening hours, map link, real social profiles.** Add to `.sv-contact__details` and to the JSON-LD (`streetAddress`, `openingHours`, `sameAs`). Only real profiles.
5. **Retention period.** `privacy.html` says requests are kept "only for as long as we need it", with no number. Pick one (for example 12 months after the last contact) and state it.

### Notes for other lanes
- **[Lane E to Lane A] Wiring:** `initForm()` is called from `js/desktop/index.js` and `js/mobile/index.js` (one import and one line each). `form.js` keeps its state on the form element (`data-source`, `data-autofill`) so it survives the desktop/mobile swap on resize.
- **[Lane E to Lane A] CSS:** one shared block in `css/base.css` ("Shared components: contact and form"), one contact block each in `css/desktop.css` and `css/mobile.css`, and the desktop footer now wraps (`flex-wrap`) because it has six links. New file `css/legal.css` for `privacy.html` and `404.html` only. No tokens added. No change to `_headers`: the CSP already allows `connect-src https://api.web3forms.com` and `form-action`.
- **[Lane E to Lane G] `scripts/qa-check.sh` (both copies):** new check 13 warns when the Web3Forms key is empty and when `REPLACE-WITH-DOMAIN` is still in html, xml or txt files. **On launch day change both `warn` to `fail`** (they are warnings now so `npm run check` stays at 0 failures while the owner's details are missing).
- **[Lane E to Lane G] Test the real form once deployed:** send a request with a real key and confirm the email arrives. In testing, Web3Forms was mocked (the sandbox cannot reach it).
- **[Lane E to motion pass] Mobile action bar:** its "Free quote" item still shows while the visitor is already in `#contact` and can cover the form's lower edge. Consider hiding the bar while `#contact` is in view.
- **[Lane E] 404 page:** all its asset addresses start with `/` on purpose, because the host serves it for missing paths any number of folders deep. Do not make them relative.

### Decisions in phase 5
- **Form fields** are named as the future database columns: `name`, `phone`, `email`, `package`, `add_ons`, `budget_range`, `message`, `consent`, plus `source` (which button brought the visitor: `form`, `package:business`, `service:maintenance`, `demo:salon`) and `consent_at` (browser time). Budget is free text ("Budget in kwacha (optional)"), not ranges, because the owner has not given price bands and the site shows no prices.
- **Phone check is loose on purpose:** 9 to 15 digits, optional leading `+`, spaces, dashes and brackets ignored. It accepts local (0886 023 482) and international numbers.
- **Spam:** Web3Forms `botcheck` honeypot. If it is ticked the page shows success and sends nothing.
- **No-JS:** the `<form>` posts straight to Web3Forms, and the WhatsApp links work as plain links.
- **WhatsApp links** inside the form are rebuilt on every keystroke from what the visitor typed (package, add-ons, message, budget, name), so the failure fallback carries the request.
- **Pre-fill hooks:** `data-package` selects the package; `data-service` ticks the matching add-on (Starter service selects the Starter package; Website and Shop add a line to the message); `data-demo` adds "I would like a site like the ... concept." Typed text is never overwritten, only appended to.
- **Phone click on a mouse device** also copies the number and says "Number copied." (no phone app on most desktops).
- **Meta title and description were left as the owner had them.** One suggestion for the description (currently "...build digital footprint for small businesses..."): "Websites, Google Business Profile, WhatsApp Business setup and digital marketing for small businesses in Malawi. Request a quote." If changed, change the JSON-LD `description` to match.
- **Privacy policy** is plain-language and states only what the site does today: no cookies set by us, no analytics, form data goes to Web3Forms by email, host may keep technical logs. **It has not been reviewed by a lawyer.** If analytics is added before launch, add a line. Links: Web3Forms home page only (its policy page address could not be verified), MACRA named without a link (its web address could not be verified). The Data Protection Act, 2024 wording (rights, MACRA as regulator) came from a law-firm overview; check with a Malawian lawyer.
- **Sitemap lists `/privacy`**, not `/privacy.html` (Cloudflare Pages and Netlify redirect `.html` to the clean address).

### Checked in Chromium (375, 768, 1024, 1440 px)
38 scripted checks pass (validation, send, rejected and offline failure, honeypot, every pre-fill hook, copy, three resize swaps still send exactly one request). No CSP violations with the real `_headers` policy, no console errors, no horizontal scroll. ESLint clean on the changed JS; Prettier clean on the new files. Not tested: a real submission to Web3Forms, a real screen reader, Safari and Firefox.

## Update 5 Nov 2026: phase 4 (showcase, why, FAQ) and the hero video fix

**What was built (Lane D):** `#showcase` (five concept demos, desktop pin or phone swipe row), `#why` (six statements on the charcoal section), `#faq` (six questions). Details in `docs/07` section 1.

### Requests and notes for other lanes

- **[Lane D to Lane B] Nav links to a pinned section.** Clicking Showcase (or `#showcase` from anywhere below it) scrolls to where the section sits *after* the pin, which is the end of the pin: the last panel shows. From above it lands correctly. Suggested fix in `js/core/nav.js` `goTo()` (and the future deep-link on load): if `ScrollTrigger.getAll().find((st) => st.pin === target)` exists, scroll to that trigger's `start` instead of the element's position. Same root cause will apply to the hero fold pin. Status: open.
- **[Lane D to Lane C] The first service row opens after ScrollTriggers are measured.** `js/desktop/services-hover.js` opens row 1 at init, and its CSS transition grows the row by about 243 px over 300 ms, after the triggers have measured (measured `#showcase` top 5992 px at 100 ms, 6090 px from 300 ms on). Every trigger below Services (rail, packages rise, the showcase pin) starts early until something refreshes. The pin now protects itself (it re-measures when the page above it changes height, and that refresh also fixes the other triggers), but the clean fix is yours: call `ScrollTrigger.refresh()` once the opening transition ends, or open row 1 without a transition on first paint. Status: open, not urgent.
- **[Lane D to Lane E] `data-demo` hook.** Each showcase panel has `<a href="#contact" data-demo="salon|hardware|restaurant|agro|tutoring">Ask for a site like this</a>`. `form.js` can delegate on `[data-demo]` the same way as `[data-package]` and `[data-service]` (for example put "I would like a site like the hair and beauty studio concept" in the message box). If unused nothing breaks. The FAQ intro also has a WhatsApp link with the text "Hello Saviour Digital Solutions, I have a question."
- **[Lane D to Lane F / motion pass] Hooks left for the motion pass.** Showcase screens carry `data-cursor="view"` (cursor.js: labelled disc). The showcase and the Why section are not part of any fold transition yet. Fold 2 (Why to Contact) is still to do; `#why` is not pinned, so a fold can use it as the incoming or outgoing layer.
- **[Lane D to Lane A] Tokens added to `js/core/motion-tokens.js`:** groups `showcase` (`scrub`, `parallax`), `why` (`riseOffset`, `proofDelay`), `faq` (`refreshDelay`). **`css/base.css`:** one new block, "Shared components: showcase, why, FAQ". No new CSS tokens. Status: done, nothing to action.
- **[Lane D to Lane B] Hero video (your file, changed at the owner's request).** `js/core/env.js` and `js/core/hero-video.js` were changed to fix the video not playing once deployed. The rule that blocks the clip is now `heroVideoBlocker()`; `canPlayHeroVideo()` is kept. The old `connectionAllowsVideo()` is removed (no other file used it). `docs/02` section on hero video updated to match. Status: done.

### Owner to confirm (nothing invented, but these are claims about the business)

- **Why choose us, six statements.** Each proof line repeats only what the site already says elsewhere. Confirm they are all true, and say if you want to add or drop any:
  1. "Built for phones first." (mobile-first design is in every package)
  2. "Local, in Blantyre." (a team in Blantyre; call or WhatsApp). Left out: that people can visit or meet in person (not confirmed).
  3. "Pay in instalments." (plan agreed in the written quote; no numbers)
  4. "Pay the way you already pay." (Airtel Money, TNM Mpamba, bank transfer)
  5. "A clear written quote." (details and payment plan set out in writing)
  6. "We can look after it after launch." (maintenance and support is a service). Left out: any support terms or response times (not supplied).
  Not used because unconfirmed: owning the site outright, free changes, response times, years of experience.
- **FAQ answers.** Q1 (how long) has **no timeline**, because none was supplied: it says it depends on the package and on how soon content arrives. Q4 says we do not register domains or host sites, then tells people to ask how a site goes live, because that process is not yet written down. Please supply: a real timeline range per package, and how a finished site goes live (who arranges the domain and hosting, and what it costs the client). Then those two answers can be made specific.
- **Concept demos.** The five business types are taken from `docs/03`. Say if you want different ones. If a real client site replaces a concept later, remove its "Concept demo, not a client." label only then.
- **Video.** Put the real `hero-720.mp4`, `hero-480.mp4` back in `assets/video/` before deploying (they are not in the zip). Open question: Save-Data still blocks the video on purpose (the visitor asked their phone to save data). If you want it to play even then, change `heroVideoBlocker()` in `js/core/env.js`.

## Update 4 Nov 2026 (later): owner supplied story, services detail, team and WhatsApp number

- **WhatsApp / phone:** +265 886 02 34 82 is now in the three links that were `[TBC]` (`https://wa.me/265886023482`, `tel:+265886023482`). The QA script now exits 0. Lane E: use the same number in the contact block and JSON-LD (display format `+265 886 02 34 82`).
- **Team size:** the owner listed **three** people, not five. The "five-person team" wording is **removed** from the page ("a team in Blantyre"). **Owner to confirm** whether there are two more people to add. docs/00 and docs/03 still say five in places: treat them as superseded.
- **Team block is live** inside `#about` (`.sv-team`): Saviour Kumalawi (Founder; data collection and digital marketing), Fyaupi Guthrie Mwenelupembe (role Developer; bio starts "Electronics and Computer Engineer", 6 Nov 2026), Charity Phiri (Digital marketing and content creation; also data collection). No bios on the page (none were supplied and none were invented). Photos in `assets/img/team-*-{400,800}.{avif,webp}`, all cropped to 4:5. Fyaupi's photo is the suit portrait (sharper and better framed than the hoodie selfie).
  - **Photo quality, owner to act:** the Saviour and Charity images are small, differently lit and differently framed (574 px and 1425 px wide; Charity has no 800 px version because the source is too small). Replace with matching portraits (same distance, plain or blurred background, at least 1000 px wide) when available. Confirm the owner has the right to use them.
  - Desktop: photos rise in one by one (`js/desktop/team-reveal.js`). Phone: one photo per row, then three columns from 768 px. Mobile uses the generic `[data-reveal]` fade.
- **Founding story is live** under "How we started" in `#about`. The pun is on the name (also the founder's name). It names Rynberg Stacks as the source of the digital and entrepreneurship lesson. It deliberately does not say who was taught, or when, or where. **Owner to confirm** who was taught (if it was the founder, the first sentence can name Saviour Kumalawi) and that naming Rynberg Stacks is fine.
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
