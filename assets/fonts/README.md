# Fonts (self-hosted)

| File                      | Where it comes from                                                                   | Status     |
| ------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `inter-latin-var.woff2`   | Created by `npm run vendor` from `@fontsource-variable/inter` (SIL Open Font License) | Automatic  |
| `clash-display-600.woff2` | **Download by hand** from Fontshare: https://www.fontshare.com/fonts/clash-display    | You add it |

## Adding Clash Display

1. Download the font kit from Fontshare (free for personal and commercial use under the ITF Free Font License; read the license file inside the download).
2. From the kit's web fonts, take the **SemiBold (600)** WOFF2 and save it here as `clash-display-600.woff2`.
3. Keep the license file next to it as `CLASH-DISPLAY-LICENSE.txt`.
4. Optional: subset to Latin only to make it smaller (aim for roughly 40 KB or less). Tools such as `glyphhanger` or `pyftsubset` work.
5. In `index.html`, uncomment the two `<link rel="preload">` lines for the fonts.

Until `clash-display-600.woff2` exists, headings use the fallback font and the browser console shows one 404 for it. That is expected.
