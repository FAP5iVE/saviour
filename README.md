# Saviour Digital Solutions: website

Site for Saviour Digital Solutions, Blantyre, Malawi.
Plain HTML, CSS and JavaScript (ES modules). No framework.



## Fonts

- **Inter**
- **Clash Display**

Until the Clash Display file exists, headings use a fallback font.


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

