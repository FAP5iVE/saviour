# Saviour Digital Solutions: agent instructions (same content as the skill)

Plan files 01 to 06 are the source of truth. Read them before coding.


# Saviour Digital Solutions: Site Builder Skill

You are building a **bold, minimal, heavily animated, mobile-first** single-page website for **Saviour Digital Solutions**, a five-person web and digital-services business in **Blantyre, Malawi** that helps small businesses and new entrepreneurs get online. This skill tells you what to do, what never to do, and how to prove it is done.

Read these plan files in `docs/` (or the plan folder) before you write code. Do not guess; they hold the decisions.

| Read | When |
|---|---|
| `01-design-plan.md` | Any visual or layout work |
| `02-architecture-and-stack.md` | Any file structure, loading, form, SEO, performance work |
| `03-content-and-copy.md` | Any text, numbers, claims |
| `04-motion-spec.md` | Any animation |
| `05-roadmap-schedule-risks.md` | Scope questions, "is this in or out?" |

## 1. What success looks like

- The site loads fast on a cheap Android phone on mobile data (about 1 MB first load or less).
- It looks designed for a phone **and** for a desktop. Resizing across 1024 px swaps modules live with nothing broken.
- It does not look AI-generated: no purple gradients, no centered-hero-plus-three-cards, no emoji icons, no buzzword copy, no dead links.
- Every claim is true or sourced. Every link goes somewhere real. The form and WhatsApp work.
- Motion is smooth, purposeful and fully optional (reduced-motion users get a complete static site).

## 2. Non-negotiables (break one and the work is rejected)

1. **Never invent facts**: no made-up statistics, testimonials, client names, awards, years of experience, prices, team details, addresses or phone numbers. Unknown = `[TBC]`.
2. **One HTML document, content written once.** Do not duplicate content for desktop and mobile.
3. **Separate modules:** desktop and mobile each have their own CSS and JS (`css/desktop.css`, `css/mobile.css`, `js/desktop/`, `js/mobile/`). `core/` never imports from either.
4. **Self-host everything**: fonts, GSAP, Lenis, icons. No CDN script or stylesheet tags, no Google Fonts links.
5. **No framework.** HTML, CSS, JavaScript (ES modules). No Tailwind, no React.
6. **Contrast and colour rules** in section 6 are mandatory.
7. **Transform and opacity only** in scroll-driven animation.
8. **Reduced motion and no-JS must work.** Hidden "before animation" states exist **only** under `html.js`.
9. **No `href="#"`, no empty links, no emoji icons, no lorem ipsum, no banned words.**
10. **Cards are the exception.** The only card pattern on the site is the pricing packages (see section 6.4).

## 3. Locked decisions (3 Nov 2026)

| Topic | Decision |
|---|---|
| Business name | **Saviour Digital Solutions**, written exactly like this |
| Palette | Cobalt blue + orange + white + one charcoal section (values in section 6.1) |
| Pricing | **Request a quote only. Never show prices.** Package buttons pre-fill the form (see section 5, "Quote pre-fill") |
| Instalments | Public wording only: "Pay in instalments. We agree a payment plan in your written quote." **Never publish numbers or terms.** Draft terms in file 03 section 5.1 are marked `[DRAFT-EDIT]` and must not reach the site |
| Payment methods | Airtel Money, TNM Mpamba, bank transfer |
| Hero footage | Stock placeholder from `06-hero-footage-shortlist.md` until the owner picks final footage; the hero must work with the poster alone |
| Language | English only |

## 4. DO and DON'T

| DO | DON'T |
|---|---|
| Left-aligned, oversized headlines; hairline rules; whitespace; big type | Centered headline + pill CTA + three cards |
| Cobalt blue + orange + warm white + one charcoal section | Purple, violet, neon, magenta gradients, mesh gradients, glow |
| Custom inline SVG line icons (24 px grid, 1.5 px stroke) | Emoji as icons, icon-pack look, icon-in-a-circle-in-a-card repetition |
| Real team photos; showcase mini-sites built in HTML/CSS | Stock "people on laptops", AI-generated people, floating browser mockup hero |
| Plain, local, specific copy | "Delve, tapestry, realm, beacon, game-changer, unlock, elevate, seamless, leverage, empower, cutting-edge, in today's fast-paced digital world" |
| Footer links to real anchors, contact methods and real socials | Placeholder social links, `#` links, invented company names |
| Charcoal text on orange buttons; `--orange-deep` for orange text | Orange small text on white, white text on orange |
| Poster-first hero; video as enhancement | Autoplaying heavy video on every connection |
| `gsap.context()` / `matchMedia` with `destroy()` cleanup | Orphan ScrollTriggers, global listeners never removed |
| Native scroll on touch devices | Lenis on touch (breaks native momentum) |
| One motion focus per viewport; a few well-chosen pins | Everything animating at once; pinning every section |
| Ask the owner when a fact is missing | Fill gaps with plausible-sounding text |

## 5. Architecture contract

### Files and who owns them (for multi-agent work)

| Lane | Owns (only this lane edits these) |
|---|---|
| **A. Foundation** | `css/tokens.css`, `css/base.css`, `js/boot.js`, `js/core/env.js`, `js/core/motion-tokens.js`, `index.html` skeleton and head/meta, `_headers`, `robots.txt`, `sitemap.xml` |
| **B. Nav, hero, loader, fold** | nav and hero markup blocks, `js/core/nav.js`, `js/core/hero-video.js`, `js/desktop/fold.js`, `js/desktop/smooth-scroll.js`, `js/mobile/menu-sheet.js`, `js/mobile/action-bar.js`, `js/core/hero-intro.js`, `js/desktop/header-scroll.js`, `js/core/loader.js`, `js/core/refresh.js`, `js/desktop/cursor.js`, `js/desktop/magnetic.js`, `js/desktop/section-rail.js` |
| **C. About, team, services, packages** | those markup blocks, `js/desktop/scrub-text.js`, `js/desktop/services-hover.js`, `js/mobile/services-accordion.js` |
| **D. Showcase, why, FAQ** | those markup blocks, `js/desktop/showcase-bar.js`, `js/mobile/showcase-swipe.js` |
| **E. Contact, form, privacy, SEO** | contact block, `js/core/form.js`, `privacy.html`, `404.html`, JSON-LD, meta |
| **F. Layout CSS (per mode)** | `css/desktop.css` and `css/mobile.css`, split by clearly commented `/* === SECTION: name === */` blocks so lanes don't collide |
| **G. QA and release** | `scripts/qa-check.sh`, `scripts/launch-fill.mjs`, Lighthouse reports, deploy config |

If you need a change in a file you don't own, **don't edit it**. Write the request in `docs/HANDOFF.md` (what, why, exact selector or function), and continue.

### Contracts between lanes

- **Section IDs:** `#home`, `#about`, `#services`, `#packages`, `#showcase`, `#why`, `#faq`, `#contact`.
- **Class prefix:** `sv-` with BEM (`sv-hero`, `sv-hero__title`, `sv-pkg--featured`).
- **JS hooks are data attributes, never styling classes:** `data-reveal`, `data-split="lines|words"`, `data-scrub`, `data-fold`, `data-showcase`, `data-showcase-track`, `data-accordion`, `data-cursor="view|drag"`, `data-magnetic`.
- **Mode API:** each of `js/desktop/index.js` and `js/mobile/index.js` exports `init()` and `destroy()`. `destroy()` must kill every ScrollTrigger, Lenis instance, listener and timer that mode created.
- **Mode flag:** `document.documentElement.dataset.mode` is `"desktop"` or `"mobile"`. Layout switches at **1024 px** by width. Mouse-only features (custom cursor, magnetic button, hover effects, Lenis) additionally require `(hover: hover) and (pointer: fine)`.
- **Tokens only:** no hard-coded colours, font sizes, spacings or durations outside `tokens.css` / `motion-tokens.js`.
- **Quote pre-fill:** each package button carries `data-package="starter|business|growth"`; `form.js` reads it, selects the package in the form, and builds the WhatsApp message from package + add-ons. No prices anywhere.
- **Packages data fields** (keep consistent): name, audience, included list, `priceFrom` (empty = "Request a quote"), instalment note.

## 6. Design rules

### 6.1 Palette (provisional until the logo is final; values in `tokens.css` only)
`--ink #14171C` · `--paper #FAF9F6` · `--white #FFFFFF` · `--blue #1546B8` · `--blue-deep #0A2260` · `--blue-tint #E8EEFB` · `--orange #F26A1B` · `--orange-deep #B94406` · `--orange-tint #FFF1E8` · `--muted #5B6270` · `--muted-on-dark #A9B0BC`

### 6.2 Colour rules
1. Orange as **text** on light backgrounds must be `--orange-deep` (orange on white is only 3.06:1).
2. Orange buttons use **charcoal** text (5.86:1). Never white on orange.
3. On the charcoal section use `--muted-on-dark`, never `--muted`.
4. Orange stays under about 10% of any viewport.
5. One charcoal section only (Why Choose Us).

### 6.3 Typography
Clash Display 500/600 for headings; Inter variable for everything else. Latin subset, WOFF2, two preloads, `font-display: swap`, fallback with `size-adjust`. Fluid `clamp()` scale. Display line-height about 0.95 to 1.05. No third typeface.

### 6.4 The card test
A block becomes a card only if **all four** are true: (1) it is one self-contained thing; (2) the reader compares or browses several side by side; (3) it is an independent decision or click unit; (4) removing the container would make the grouping unclear.
Result: **services = ruled rows**, **about = editorial text**, **team = photos on the page**, **showcase = media panels**, **why = big statements**, **FAQ = accordion**, **contact = open underline form**, **packages = cards** (the only ones). If you are about to add a rounded box with a shadow, stop and re-read this.

### 6.5 Icons and images
Custom inline SVG icons only. AVIF with WebP fallback, `srcset`, explicit `width` and `height`, lazy-load below the fold. Descriptive `alt` text. No decorative emoji anywhere.

## 7. Motion rules (summary of `04-motion-spec.md`)

- GSAP + ScrollTrigger + SplitText + DrawSVG; Lenis on **desktop fine-pointer, non-reduced-motion only**, `syncTouch: false`.
- Wire Lenis: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`.
- Durations: micro 150 to 250 ms, reveal 600 to 800 ms, page-level 900 to 1200 ms. Exits about 70% of the entrance. Overshoot via `back.out(1.4)`, sparingly.
- Horizontal showcase: desktop pins and moves the track; **mobile is a native snap swipe row with no pin**.
- "Folding sections" = stacking overlays, used **twice only** (Hero to About, Why to Contact).
- Refresh triggers after `document.fonts.ready` and image load. `invalidateOnRefresh: true` where sizes are measured. Use `ScrollTrigger.batch` for lists.
- Keyboard route for the pinned showcase: focus into a panel scrolls the page so the panel is visible.
- Pause hero video off-screen and when the tab is hidden.
- Reduced motion: no loader, no Lenis, no pin, no scrub, no parallax, no cursor effects; everything visible immediately.

## 8. Content rules (summary of `03-content-and-copy.md`)

- Plain English; short sentences; "we" and "you"; written for a shop owner reading on a phone.
- Banned: delve, tapestry, realm, beacon, game-changer, unlock, elevate, seamless, leverage, empower, cutting-edge, revolutionize, supercharge, synergy, "fast-paced digital world", "take your business to the next level", "transform your business", lorem ipsum.
- Statistics: only the sourced ones in file 03, each with "Source, year" and link. Never present 2019 data as current.
- Showcase demos are labelled **"Concept demo, not a client."** Use generic descriptors, not invented business names.
- Testimonials section stays **hidden** until real quotes with permission exist.
- Payment methods: Airtel Money, TNM Mpamba, bank transfer (owner confirms others). Instalments: say it exists; **do not state terms** until confirmed.
- English only.

## 9. Contact, form and WhatsApp

- Real `tel:`, `mailto:` and `https://wa.me/265XXXXXXXXX` links (country code 265, no leading 0 or plus). Details come from the owner, never invented.
- Form via Web3Forms `fetch` POST; honeypot field; disable button while sending; inline validation; success and failure states in the page; on failure show WhatsApp and email fallbacks.
- Consent checkbox and link to `privacy.html`. Malawi's Data Protection Act, 2024 applies (consent, MACRA as regulator). Privacy page is required.
- Never put a secret in client code. (The Web3Forms access key is designed to be public.)

## 10. Performance and accessibility gates

| Gate | Pass condition |
|---|---|
| First-load weight | About 1 MB or less; hard fail above 1.2 MB |
| Core Web Vitals (throttled mid-range Android) | LCP at or under 2.5 s, INP at or under 200 ms, CLS at or under 0.1 |
| Fonts | Two preloaded WOFF2 files, Latin subset |
| Hero | Poster paints first; video conditional (no Save-Data, no reduced motion, acceptable connection) |
| Keyboard | Everything reachable; visible focus; skip link |
| Contrast | All used pairs at least AA (follow section 6.2) |
| Tap targets | At least 44 by 44 px |
| Reduced motion | Verified on |
| No JS | Content visible; WhatsApp and mailto still work |
| Mode swap | Resize 1400 px to 375 px and back: no leftover pin spacers, no duplicate animations, no errors |

## 11. Verification (do this before saying "done")

1. Run the QA script (bundled in this skill's `scripts/` folder; you may copy it into the project's `scripts/`) from the site's project root:
   ```bash
   bash <path-to-this-skill>/scripts/qa-check.sh .
   ```
   It must exit 0. It catches the main banned words, not every one (for example "journey" as a metaphor); read the copy yourself against section 8 as well. It checks: dead links, empty links, emoji, banned words, lorem ipsum, leftover `[TBC]`, `[DRAFT-EDIT]` or TODO, images without alt, CDN tags, `console.log`, core-imports-mode violations, hard-coded hex colours outside tokens, missing `lang` and viewport. Warnings need a reason in your notes; failures must be fixed. On launch day run it as `bash scripts/qa-check.sh . --launch` (`npm run qa:launch`): the empty Web3Forms key, the leftover domain placeholder and a missing `Sitemap:` line in `robots.txt` then fail instead of warn. Fill them with `npm run launch:fill`.
2. Open the page at 375 px, 768 px and 1440 px. Look at it. Scroll all the way. Resize across 1024 px.
3. Run Lighthouse (mobile) and record the numbers against the gates above.
4. Test the form end to end (a real submission arrives) and every `tel:`, `mailto:` and WhatsApp link.
5. Tab through the whole page with the keyboard. Turn on reduced motion and reload.
6. Report honestly: what you ran, what passed, what you could not test (for example, no physical device).

## 12. Definition of done, per section

- [ ] Content is real or marked `[TBC]` and listed in `docs/HANDOFF.md`
- [ ] Looks right at 375, 768, 1024 and 1440 px (not just shrunk)
- [ ] Motion works in its mode, is cleaned up by `destroy()`, and is off under reduced motion
- [ ] Uses tokens only; passes colour rules
- [ ] Semantic HTML, headings in order, labelled controls
- [ ] No new third-party requests
- [ ] QA script clean for your files

## 13. When to stop and ask the owner

Ask (don't guess) when you need: contact details, team names or photos, logo, prices, instalment terms, support terms, testimonials, domain, footage, or any statistic not already listed as sourced. Also ask before adding a new library, a new section, a second typeface, a new card pattern, or anything that raises first-load weight by more than about 20 KB.
