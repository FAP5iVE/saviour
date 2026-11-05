# 02. Architecture and Stack

## 1. Stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Markup / style / script | Plain **HTML, CSS, JavaScript (ES modules)**, no framework | Matches your brief; fastest to load; nothing to break before Sunday |
| Motion | **GSAP** (core, ScrollTrigger, SplitText, DrawSVG) | GSAP became free for everyone, plugins included, after Webflow acquired GreenSock (research found this stated on the GSAP repo and in 2026 guides). Confirm the license page on the day you ship |
| Smooth scroll | **Lenis**, desktop fine-pointer only | MIT licensed; runs on native scroll so sticky and anchors keep working |
| Fonts | Clash Display + Inter, self-hosted WOFF2 | Per your choice A |
| Form | **Web3Forms** (email) + **WhatsApp click-to-chat** | No database needed at launch |
| Hosting | **Cloudflare Pages** (backup: Netlify) | Free, commercial use allowed. See file 00 |
| Analytics | Cloudflare Web Analytics (free, no cookies) or Plausible/Umami | Light, privacy-friendly. Avoid GA4 (heavier, needs a consent banner) |
| Database | **None at launch** | PostgreSQL arrives with the admin phase (file 05) |
| Build | **No bundler required.** Vendor the libraries into `assets/vendor/` from npm; optional minify step at the end | Fewer moving parts for a 5-day schedule |

All libraries are **self-hosted** (copied into the repo), not loaded from a CDN. This removes third-party requests and keeps the site working if a CDN is blocked or slow.

## 2. Folder structure

```
saviour-site/
├── index.html                  # the whole single-page site (content authored ONCE)
├── privacy.html                # real privacy page (footer links here)
├── 404.html
├── robots.txt
├── sitemap.xml
├── _headers                    # cache + security headers (Cloudflare Pages / Netlify)
├── _redirects                  # only if needed
├── css/
│   ├── tokens.css              # colours, type scale, spacing, radius, motion tokens (ONLY place for values)
│   ├── base.css                # reset, typography, buttons, forms, a11y helpers, shared components (NO page layout)
│   ├── desktop.css             # layout for >= 1024px   (loaded with media="(min-width:1024px)")
│   └── mobile.css              # layout for < 1024px    (loaded with media="(max-width:1023.98px)")
├── js/
│   ├── boot.js                 # decides desktop vs mobile, mounts/unmounts the right module
│   ├── core/                   # shared by both modes
│   │   ├── env.js              # media queries, reduced-motion, data-saver, connection checks
│   │   ├── motion-tokens.js    # durations and easings (single source of truth)
│   │   ├── reveal.js           # shared reveal helpers
│   │   ├── form.js             # validation, Web3Forms submit, WhatsApp prefill, states
│   │   ├── nav.js              # menu logic (open/close, focus trap, anchor handling)
│   │   ├── hero-video.js       # conditional video loading
│   │   └── a11y.js             # focus management, skip link, announcements
│   ├── desktop/
│   │   ├── index.js            # init() and destroy() for desktop
│   │   ├── smooth-scroll.js    # Lenis + ScrollTrigger sync
│   │   ├── cursor.js           # custom cursor (also guarded by pointer: fine)
│   │   ├── fold.js             # the two "folding" section transitions
│   │   ├── showcase-horizontal.js
│   │   ├── scrub-text.js
│   │   └── services-hover.js
│   └── mobile/
│       ├── index.js            # init() and destroy() for mobile
│       ├── menu-sheet.js       # full-screen menu
│       ├── action-bar.js       # floating WhatsApp/Call bar
│       ├── showcase-swipe.js   # snap carousel with peek
│       └── services-accordion.js
├── assets/
│   ├── fonts/  (clash-display-600.woff2, inter-var.woff2, LICENSE files)
│   ├── img/    (team-*.avif/.webp, og-image.jpg, favicon set)
│   ├── video/  (hero-720.mp4, hero-480.mp4, hero-poster.avif)
│   ├── icons/  (inline SVG sources)
│   └── vendor/ (gsap/, lenis/)   # copied from npm, pinned versions in a VERSIONS.txt
├── data/                       # EMPTY at launch; JSON content arrives in phase 1 (file 05)
└── docs/                       # these plan files
```

## 3. The separate desktop and mobile modules

Two independent axes, kept separate on purpose:
- **Layout mode** is decided by **width**: 1024 px and up is `desktop`, everything below is `mobile`.
- **Interaction features** are decided by **capability**: custom cursor needs `(hover: hover) and (pointer: fine)`; Lenis needs the same plus no reduced-motion; video needs a good connection.

So a large tablet gets the desktop *layout* but never the mouse-only features.

### Rules that keep it clean
1. **One HTML document, content written once.** Never duplicate content for the two modes (hurts SEO, accessibility and maintenance). The two modes restyle and re-animate the same elements.
2. `base.css` has **no page layout**. All layout lives in `desktop.css` or `mobile.css`.
3. Each mode's JS exposes `init()` and `destroy()`. `destroy()` kills every ScrollTrigger, Lenis instance, listener and `gsap.context` the mode created. Resizing across the 1024 px line swaps modes live without a reload.
4. `core/` never imports from `desktop/` or `mobile/`. Dependencies point one way.
5. Where structure truly differs (horizontal showcase vs swipe row), it is **the same list markup**: CSS and JS change its behaviour.

### How the modes load (reference sketch for agents)

```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/desktop.css" media="(min-width: 1024px)">
<link rel="stylesheet" href="css/mobile.css"  media="(max-width: 1023.98px)">
<script>document.documentElement.classList.add('js')</script>
<script type="module" src="js/boot.js"></script>
```

```js
// js/boot.js (sketch, not final code)
import { gsap } from '../assets/vendor/gsap/gsap.min.js';
import { ScrollTrigger } from '../assets/vendor/gsap/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

const mq = window.matchMedia('(min-width: 1024px)');
const loaded = {};
let current = null;

async function mount() {
  const next = mq.matches ? 'desktop' : 'mobile';
  if (next === current) return;
  if (current) loaded[current].destroy();
  loaded[next] ??= await import(`./${next}/index.js`);
  document.documentElement.dataset.mode = next;
  loaded[next].init();
  current = next;
  ScrollTrigger.refresh();
}
mq.addEventListener('change', mount);
mount();
```

Each mode's `init()` should build one `gsap.context()` and `destroy()` should call `ctx.revert()`. (GSAP also offers `gsap.matchMedia()`, which reverts automatically; either is acceptable, but pick one per module and stay consistent.)

### No-JS and slow-JS safety
Initial hidden states for reveals (opacity 0, offsets) are applied **only** under `html.js`. If JavaScript fails or is late, all content is visible and readable. Never hide content in base CSS.

## 4. Hosting and deployment

- **Primary:** Cloudflare Pages connected to a GitHub repo (or direct upload). Every push deploys; every branch gets a preview URL.
- **Domain:** buy it today, then point DNS. Allow time for propagation before Sunday.
- **Headers file (`_headers`):**
  - HTML: short cache or no-cache so updates appear quickly.
  - `/assets/*` and fingerprinted JS/CSS: `Cache-Control: public, max-age=31536000, immutable`.
  - Security: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera/mic/geolocation), and a **Content-Security-Policy** that allows only our own origin plus the form endpoint and analytics beacon. Test the CSP before launch so it doesn't break the form.
- **Uptime:** a free uptime monitor on the homepage and the form endpoint.
- **Rollback:** keep the previous deployment; both Cloudflare Pages and Netlify support instant rollback.

## 5. Contact form and WhatsApp (works on day one, no database)

**Fields:** name, phone/WhatsApp, email (optional), service interested in, budget range, message, consent checkbox.

**Flow:**
1. Client-side validation (clear inline messages, no jargon).
2. Submit via `fetch` to the **Web3Forms** endpoint (free tier: 250 submissions per month, 30-day history, spam protection, hCaptcha option, custom redirects, as published on their pricing pages in 2026). Their access key is designed to be public in the page; still restrict it to your domain if the dashboard allows.
3. Hidden honeypot field for bots. Rate-limit double submits (disable the button while sending).
4. Success state in-page (no redirect). On failure, show a friendly message **and** a ready WhatsApp link and email link so no lead is lost.
5. **WhatsApp:** `https://wa.me/265XXXXXXXXX?text=<url-encoded message>` (Malawi country code 265, number without the leading 0 or plus). A "Send via WhatsApp instead" button builds a pre-filled message from whatever the visitor typed.
6. Phone and email are real `tel:` and `mailto:` links; on desktop they also copy to clipboard with a small toast.

**Consent and privacy:** the form collects personal data, so show a short consent line linking the privacy page. Malawi's Data Protection Act, 2024 came into force on 3 June 2024, with MACRA named as the supervisory authority, and sources describe consent as the primary lawful basis. Treat the privacy page as required, and get a lawyer to review it. Outline in file 03.

**Spam and abuse:** honeypot plus Web3Forms' protections at launch; add Cloudflare Turnstile when you own the backend (phase 2).

## 6. SEO and structured data ("rich" results)

- One `<h1>`, logical heading order, descriptive link text, alt text on all images.
- Unique title and meta description; canonical URL; Open Graph and Twitter tags; a designed 1200×630 share image.
- **JSON-LD** for the business: type `ProfessionalService` (or `LocalBusiness`), with name, URL, logo, phone, email, Blantyre address, opening hours, `areaServed` (Malawi), and `sameAs` listing **only real, existing social profiles**.
- Also `WebSite` and `BreadcrumbList` are unnecessary for a one-pager; skip them.
- Do not expect FAQ rich results; Google restricted those to a few site types, so write the FAQ for people and don't depend on it for search features (verify current Google guidance before promising anything).
- `sitemap.xml`, `robots.txt`, `lang="en"`.
- **Local SEO is mostly off-site:** create and verify a **Google Business Profile** for the Blantyre address; submit the site in **Google Search Console**; keep name, address and phone identical everywhere (NAP consistency).
- Natural keyword phrases to use in copy: "website development in Blantyre", "web design in Malawi", "small business website Malawi", "WhatsApp Business setup", "Google Business Profile setup". Write for humans first.

## 7. Performance budgets (3G and low-end Android first)

| Metric | Target |
|---|---|
| First-load transfer (HTML + CSS + JS + fonts + hero still + above-the-fold images) | **About 1 MB or less** (measure; fail the build above 1.2 MB) |
| JavaScript | Keep total gzipped JS modest; set a number after the first measured build and don't let it grow without a reason |
| LCP / INP / CLS | Standard Core Web Vitals "good" thresholds: LCP at or under 2.5 s, INP at or under 200 ms, CLS at or under 0.1, tested on a throttled mid-range Android profile |
| Fonts | Two preloaded files, Latin subset |
| Images | AVIF with WebP fallback, `srcset`, explicit `width`/`height`, lazy-load below the fold |
| Hero video | Poster paints first. Video loads **after** `load`, only if: no `prefers-reduced-motion`, no Save-Data, the browser does not report a 2g-class connection, and the hero is visible. A 3g report still plays, with the lighter 480 clip; a browser that does not report the connection (Safari, Firefox) plays too. Do not require `4g`: `effectiveType` is a latency guess and says 3g on many good Malawian lines. Mobile gets a smaller clip or just the poster. Pause when off-screen and when the tab is hidden |
| Animation | Only `transform` and `opacity`. No layout-property animation in scroll handlers |

Tooling: Lighthouse and WebPageTest with a throttled profile; Chrome DevTools CPU 4x slowdown for motion checks.

## 8. Accessibility (non-negotiable)

- Respect `prefers-reduced-motion`: no pinning, no parallax, no loader, no smooth scroll; content simply appears.
- Full keyboard path; visible `:focus-visible` rings; a "Skip to content" link.
- **The pinned horizontal showcase needs a keyboard route:** when focus enters an off-screen panel, scroll the page to the matching progress so the panel is brought into view. Test this explicitly.
- Accordions use proper buttons with `aria-expanded` and `aria-controls`.
- Forms: real `<label>`s, error text tied with `aria-describedby`, a live region for success and error.
- Tap targets at least 44×44 px.
- The custom cursor is decoration only; never hide the native cursor over text fields.
- Colour contrast follows file 01 (all pairs in use pass AA).

## 9. Browser and device support

Evergreen Chrome, Edge, Firefox, Safari (including iOS), and Android Chrome. Don't depend on cutting-edge CSS (for example scroll-driven animation APIs) as the *only* path; GSAP is the dependable route, with graceful fallback if a feature is missing.

## 10. QA matrix (run before launch)

| Test | Where |
|---|---|
| Real low-end Android phone, mobile data | Scroll smoothness, load time, bottom action bar, form |
| iPhone Safari | Viewport units (use `svh`/`dvh`), sticky/pinned behaviour, video autoplay (muted, `playsinline`) |
| Desktop Chrome, Firefox, Edge | Lenis, pin, horizontal scroll, cursor |
| Resize from 1400 px to 375 px and back | Mode swap with no reload, no broken state |
| Keyboard only | Whole page reachable, showcase panels reachable |
| Reduced-motion on | Everything readable, nothing hidden |
| JS disabled | Content visible, form still reachable via WhatsApp/mailto |
| Lighthouse (mobile) | Meets budgets in section 7 |
| QA script (`scripts/qa-check.sh`) | Zero dead links, emoji, banned words, leftover placeholders |

---

## Starter project note (3 Nov 2026)

The project skeleton exists. Deploy from `dist/`, not the repo root: `npm run build` copies only public files
(index, css, js, assets, `_headers`, `robots.txt`, `sitemap.xml`) so docs and scripts are never published.
Cloudflare Pages: build command `npm run build`, output directory `dist`.
The vendor bundle (`assets/vendor/vendor.js`) is built by `npm run vendor` and committed to git.
