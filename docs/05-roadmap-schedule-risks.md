# 05. Roadmap, Schedule and Risks

## 1. Do you need a database?

**Not for launch.** The contact form delivers to your email through Web3Forms, and WhatsApp covers the fastest route. A database becomes useful when you want to *manage* leads, edit content without touching code, or run a client portal. You said PostgreSQL or MySQL and a JS backend: **PostgreSQL is the plan** (more flexible features, and the managed options below are Postgres-first). MySQL would work, but gives no advantage here.

## 2. Admin dashboard roadmap (after Sunday)

| Phase | When | What | Tech (JS) |
|---|---|---|---|
| **0. Launch** | Sun 8 Nov | Static site, Web3Forms email, WhatsApp link, analytics | Cloudflare Pages |
| **1. Content in data files** | Week 2 to 3 | Move services, packages, showcase, team, FAQ into `data/*.json`; a small Node script renders them into the HTML at build time (no runtime cost, SEO intact) | Node build script |
| **2. Own the form** | Week 3 to 5 | Form posts to our endpoint; leads saved to PostgreSQL; email and WhatsApp notification; bot protection (Cloudflare Turnstile); rate limiting | Cloudflare Workers / Pages Functions (JS) + managed Postgres (Supabase or Neon; check free-tier limits and pause rules at that time) |
| **3. Admin dashboard** | Week 5 to 8 | Login; leads list with status (new, contacted, quoted, won, lost) and notes; edit packages, showcase and FAQ; approve testimonials; export CSV | Small JS front end + the same API; managed auth |
| **4. Client portal (optional)** | Later | Project status, file sharing, instalment tracker | Same stack |

**Preparing for it now (costs nothing on Sunday):**
- Keep repeating blocks (services, packages, showcase, team, FAQ) in **consistent, structured markup** with `data-` hooks, so moving them to JSON is mechanical.
- Name form fields exactly as the future database columns.
- Keep the package `priceFrom` field in the markup.

**Draft schema (for phase 2):**
`leads` (id, created_at, name, phone, email, service, budget_range, message, source, status, consent_at, consent_text_version) · `lead_notes` (id, lead_id, author_id, note, created_at) · `packages` · `showcase_items` · `testimonials` (id, quote, name, business, approved, permission_ref) · `users` (admin accounts via managed auth).

**Security basics for phase 2 and 3:** no secrets in the browser; row-level security or equivalent; hashed passwords or a trusted auth provider; HTTPS only; rate limiting; backups; data-retention rule matching the privacy page (Malawi's Data Protection Act, 2024 applies; have it reviewed).

## 3. Schedule: Tuesday 3 Nov to Sunday 8 Nov, 2026

| Day | Goal | Output |
|---|---|---|
| **Tue 3 Nov (today)** | Plan approved; decisions 1 to 5 settled. Start collecting inputs. Register the domain. Download fonts | Decisions logged; repo scaffolded; tokens, fonts and vendor libraries in place |
| **Wed 4 Nov** | Foundations and the first screen | `tokens.css`, `base.css`, nav (desktop + mobile), hero with poster-first video, loader, About/problem; boot.js with live mode swap |
| **Thu 5 Nov** | The core sections | Team, Services list, Packages cards, Showcase (horizontal on desktop, swipe on mobile), Why choose us, FAQ |
| **Fri 6 Nov** | Conversion and trust | Contact section, working form, WhatsApp, `tel:`/`mailto:`, privacy page, JSON-LD, sitemap/robots, real content swapped in |
| **Sat 7 Nov** | Polish and proof | Folds, cursor, micro-interactions, performance budget pass, accessibility pass, real-device testing, Cloudflare Pages deploy to a preview URL, domain connected |
| **Sun 8 Nov** | Launch | Final content freeze by morning; QA script and Lighthouse pass; launch by midday; submit to Google Search Console; create or verify Google Business Profile; share the live link |

**Dependencies that can delay us:** logo, real contact details, team photos, instalment terms, domain DNS, hero footage. Missing items ship as clean placeholders and are swapped later (the QA script will flag them, so ship day should have none).

## 4. Scope tiers (so Sunday is safe)

**Must ship (non-negotiable):**
All six sections · separate desktop and mobile modules · scroll reveals and smooth scroll on desktop · responsive and mobile-first · packages with quote pre-fill · working form + WhatsApp · privacy page · SEO basics and JSON-LD · accessibility basics and reduced-motion support · performance budget met.

**Should ship (aim for Sunday):**
Loader · custom cursor · horizontal pinned showcase · both folding transitions · DrawSVG icons · hero video loop (poster-only fallback is acceptable).

**Later (after launch):**
Live demo pages behind each showcase panel · testimonials (when real) · data-file build step · own backend and admin dashboard · client portal · additional languages (English only for now) · blog.

If time runs short, cut in this order: Fold 2 → custom cursor → loader → horizontal pin on desktop (fall back to the swipe row) → hero video (fall back to poster).

## 5. Risks and responses

| Risk | Likelihood | Response |
|---|---|---|
| Very advanced motion eats the schedule | High | Scope tiers above; motion built after core content works; cut list |
| Hero video too heavy for 3G | High | Poster first; conditional video; lighter mobile clip; budget enforced |
| Pinned sections break on iOS or low-end Android | Medium | Test early (Wed/Thu, not Sat); mobile has no pins by design |
| Missing real content (photos, details, terms) | High | Request by Wed midday; placeholders flagged by QA |
| DNS and domain delays | Medium | Register today; launch on the `*.pages.dev` address if DNS slips, then switch |
| Hosting terms (Vercel Hobby) | Avoided | Use Cloudflare Pages or Netlify |
| Invented claims slip into copy | Medium | `[TBC]` rule; QA script; owner sign-off on all claims |
| Form lands in spam or fails | Medium | Test end-to-end on Fri; WhatsApp and mailto fallback always visible |
| Legal: privacy and data protection | Medium | Privacy page with consent; have a lawyer review soon after launch |
| Licenses (fonts, GSAP, Oxnod inspiration) | Low | Keep license files in the repo; no Oxnod code or assets used |

## 6. Launch checklist

- [ ] Domain live over HTTPS; www redirects to the main address
- [ ] Contact details are real and tested (call, WhatsApp, email, form)
- [ ] No `[TBC]`, no `href="#"`, no placeholder text, no emoji icons (QA script clean)
- [ ] Privacy page live; consent line on form
- [ ] Lighthouse mobile run saved; budgets met
- [ ] Real-device test done (low-end Android and iPhone)
- [ ] Google Search Console verified; sitemap submitted
- [ ] Google Business Profile created or verified for the Blantyre address
- [ ] Analytics receiving data
- [ ] Uptime monitor on
- [ ] Share image and favicon display correctly when sharing the link on WhatsApp
- [ ] Rollback point noted
