# Saviour Digital Solutions: Website Plan (read this first)

Planning pack, kept up to date as phases finish. Build status is in `07-HANDOVER-AND-DOWNLOADS.md`. The deadline is Sunday 8 Nov 2026.

## Files in this pack

| File | What it covers |
|---|---|
| `00-START-HERE.md` | How I read your answers, decisions I need from you, hosting answer, inputs checklist |
| `01-design-plan.md` | Brand, palette, type, layout, the cards rule, section-by-section design |
| `02-architecture-and-stack.md` | Folder structure, separate desktop/mobile modules, hosting, form, SEO, performance, accessibility |
| `03-content-and-copy.md` | Voice, banned words, services, packages, showcase, sourced statistics, privacy outline |
| `04-motion-spec.md` | Motion rules, libraries, choreography per section on desktop vs mobile, cursor, reduced motion |
| `05-roadmap-schedule-risks.md` | Admin-dashboard roadmap, day-by-day schedule to Sunday, cut list, risks |
| `06-hero-footage-shortlist.md` | Stock hero footage I found, what I rejected and why, shot list for your own footage |
| `08-LAUNCH-RUNBOOK.md` | Launch day, step by step: fix, fill in domain and key, deploy, domain, live tests, Search Console, rollback |
| `09-CHANGE-WEB3FORMS-KEY.md` | How to swap the Web3Forms key later (three ways), redeploy and test |
| `saviour-digital-site-builder/SKILL.md` | The skill for other agents: do's, don'ts, gates, hand-off rules |
| `saviour-digital-site-builder/scripts/qa-check.sh` | A runnable check for dead links, emoji, banned words, leftover placeholders |

## How I read your answers

| You said | What the plan does |
|---|---|
| Fonts: A, self-host | **Clash Display** (headings) + **Inter** (body), downloaded and served from our own files |
| Light with charcoal, brand colours orange, blue, white | Light site, **one** charcoal section for contrast. Blue + orange + white are the brand palette (locked 3 Nov) |
| Logo being designed | Placeholder wordmark in SVG now; every colour lives in one `tokens.css` so the final logo is a one-file swap |
| Scroll motion: my pick | **GSAP + ScrollTrigger + SplitText** for motion, **Lenis** for smooth scroll on desktop only |
| Desktop and mobile as separate modules, my pick | One HTML file, separate `desktop` and `mobile` CSS and JS modules chosen live by `matchMedia`, so resizing reflows instantly |
| Backend as JS, admin dashboard later | No database at launch. Form goes to email plus WhatsApp. A JS (Cloudflare Workers) + PostgreSQL plan is in file 05 |
| Single long scroll, folding sections, bold hero with video loop, not split | Full-bleed bold hero with a video loop behind it, no split layout. Two "folding" section transitions, not more |
| Custom cursor, horizontal scroll on desktop | Yes to both. Cursor is fine-pointer devices only. Horizontal showcase collapses to a swipe row on mobile |
| Pricing packages in kwacha, modern cards | Packages section with real card treatment (this is a valid card use). Quote-only, with a pre-filled quote request (locked 3 Nov) |
| Services list as drafted, English only, payments listed | Nine services (hosting removed 4 Nov; digital marketing and data collection added), payment routes mentioned, English only |
| Showcase: my choice. Why Choose Us: my best selection with instalments | Five labelled concept demos. Six differentiators with instalments in (each one marked "confirm true") |
| Real statistics and testimonials only | Statistics are sourced with year and link. Testimonials stay **hidden** until you have real ones |
| Netlify or Vercel? | See hosting answer below |
| Deadline Sunday | Must / Should / Later list in file 05 so Sunday is safe |

## Decisions (locked 3 Nov 2026)

| # | Topic | Decision |
|---|---|---|
| 1 | Colours | Cobalt blue + orange + white, with one charcoal section. Hex values stay provisional until the logo is final |
| 2 | Pricing | **Request a quote only. No prices are shown.** My implementation: clicking "Request a quote" on a package scrolls to the form, pre-selects that package and offers add-on tick boxes; the WhatsApp button then sends a pre-filled quote request. The `priceFrom` field stays empty and ready for later |
| 3 | Hero | Poster image first; video loads only on good connections; lighter clip or the still on mobile. Footage: stock first (see `06-hero-footage-shortlist.md`), your own Blantyre footage to compare |
| 4 | Instalments | A **draft** arrangement is written in `03-content-and-copy.md` section 5.1, marked `[DRAFT-EDIT]`. Public pages use number-free wording ("We agree a payment plan in your written quote") until you confirm the real terms |
| 5 | Business name | **Saviour Digital Solutions** (confirmed) |
| 6 | Payment methods | Airtel Money, TNM Mpamba and bank transfer (confirmed) |

The QA script fails any build that still contains `[TBC]` or `[DRAFT-EDIT]`, so draft terms cannot reach the public site by accident.

## Hosting: Vercel or something else?

**I'd avoid Vercel's free plan for this site, and I'd use Cloudflare Pages.** Vercel's own fair-use guidelines restrict the free Hobby plan to non-commercial personal use, and commercial use needs the Pro plan (listed at $20 per user per month in the 2026 comparisons I found). A business website that collects enquiries is commercial use, so launching on Hobby would put your account at risk of suspension.

- **Cloudflare Pages (my pick):** free tier allows commercial use, unlimited bandwidth for static files in the comparisons I found, free SSL and custom domains, and the same account later gives you Workers (JavaScript backend) for the admin phase.
- **Netlify (good backup):** free plan allows commercial use, about 100 GB/month bandwidth. Slightly easier drag-and-drop deploys.
- **Vercel Pro:** works fine if you prefer it, but you pay $20/month and our site is plain static files, so Vercel's main strength (Next.js) goes unused.

These limits come from third-party comparisons dated 2026. Check each provider's pricing page on the day you deploy.

## What I still need from you, ideally by Wednesday midday

- [ ] Phone/WhatsApp number (with +265), email, Blantyre street address, opening hours
- [ ] Social links that really exist (Facebook, Instagram, LinkedIn, TikTok, others)
- [x] Team members supplied 4 Nov 2026: three people (names, roles, photos). Still open: are there two more? Better, matching photos for Saviour and Charity (at least 1000 px wide, similar framing).
- [ ] Logo files (SVG or PNG), or tell me to build a temporary wordmark
- [ ] Domain name chosen and who will register it (start today; DNS can take time)
- [ ] Your view on hero clip A (see file 06) and, when ready, your own footage
- [ ] What "Digital marketing" includes, the detail of each "Data collection" area (digital forms, research, field data), and timelines for both (file 03 rows 07 and 08)
- [ ] How a finished site goes live now that you offer neither domain registration nor hosting (file 03 FAQ 4)
- [ ] Edits to the draft instalment arrangement (file 03, section 5.1) whenever you are ready
- [ ] Any real past work or testimonials (even one), with written permission to publish
- [ ] Two links to pricing cards or sites you like, so I match your taste and not a default

## Things I could not verify

- I could not view Oxnod's live demo motion. The Webflow page gave me its structure (bold, modern, creative-agency template by Topnotch Studio; sections for projects, services, pricing, why-us, testimonials, FAQ, insights; interactions throughout) but not frame-level animation details. The motion in file 04 is built from your brief plus standard scroll-motion patterns, **not copied** from Oxnod. Please send a screen recording or timestamps of the Oxnod moments you love most, and I will match the *feel*.
- Oxnod is a licensed commercial template. We take inspiration only; no code, layouts or assets are copied.
