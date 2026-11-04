# Saviour Digital Solutions: website

Single long-scroll site for Saviour Digital Solutions, Blantyre, Malawi.
Plain HTML, CSS and JavaScript (ES modules). No framework. GSAP and Lenis are bundled and self-hosted.

Plans and rules: `docs/` (start with `docs/00-START-HERE.md`). Agent rules: `AGENTS.md`.

## Quick start (VS Code)

You need Node.js 20 or newer (`node -v`).

```bash
npm install          # 1. installs the packages
npm run pin          # 2. replaces "latest" in package.json with the exact versions installed
npm run vendor       # 3. builds assets/vendor/vendor.js and copies the Inter font
npm run format       # 4. one-time: lets Prettier tidy every file
npm run dev          # 5. serves the site at http://localhost:3000
```

Then commit `package.json` **and** `package-lock.json` together.

Open the folder in VS Code and accept the "install recommended extensions" prompt (Prettier, ESLint, EditorConfig, Live Server).

### Why `latest` in package.json?

The starter was prepared without access to the npm registry, so it could not look up version numbers.
Steps 1 and 2 do that on your machine and lock the result. Do not leave `latest` in a committed manifest.

## Fonts

- **Inter**: copied automatically by `npm run vendor`.
- **Clash Display**: download by hand from Fontshare. See `assets/fonts/README.md`.

Until the Clash Display file exists, headings use a fallback font.

## Scripts

| Command                           | What it does                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`                     | Local server on port 3000                                                         |
| `npm run vendor`                  | Builds `assets/vendor/vendor.js` (GSAP, ScrollTrigger, SplitText, DrawSVG, Lenis) |
| `npm run pin`                     | Pins `latest` to real `^versions`                                                 |
| `npm run build`                   | Copies only the public files into `dist/`                                         |
| `npm run lint`                    | ESLint on `js/` and `scripts/`                                                    |
| `npm run format` / `format:check` | Prettier write / check                                                            |
| `npm run csp:check`               | Verifies the inline-script hash in `_headers` matches `index.html`                |
| `npm run qa`                      | Project rules check (dead links, banned words, emoji, CDN tags, and more)         |
| `npm run check`                   | lint + csp:check + qa                                                             |
| `npm run lighthouse`              | Mobile Lighthouse run against the dev server (start `npm run dev` first)          |
| `npm run deps:outdated`           | Shows packages with newer versions                                                |

## Structure

```
index.html          one page, content written once
css/                tokens.css, base.css, mobile.css, desktop.css
js/boot.js          picks desktop or mobile module at 1024px, swaps live
js/core/            shared code (nav, hero video, hero intro); never imports from desktop/ or mobile/
js/desktop/         desktop-only modules (each exports init and destroy)
js/mobile/          mobile-only modules
assets/vendor/      generated vendor bundle (committed on purpose)
assets/fonts/       self-hosted fonts
scripts/            build, vendor, pin, CSP check, QA
docs/               plans, copy, motion spec, roadmap
_headers            security and cache headers (Cloudflare Pages / Netlify)
```

## Deploy

Cloudflare Pages (backup: Netlify):

- Build command: `npm run build`
- Output directory: `dist`

`dist/` contains only public files, so `docs/`, `scripts/` and config are never published.
Before going live: replace the domain in `sitemap.xml` and `robots.txt`, and add the real contact details.

Avoid Vercel Hobby: its free tier is for non-commercial use only.

## Still needed from the owner

See `docs/HANDOFF.md` (contact details, team, logo, domain, footage decision, instalment terms, Web3Forms access key).

## Rules to remember

- Never invent facts, prices or contact details.
- Never commit `.env` files or keys.
- Self-host everything: no CDN tags.
