# 01. Design Plan

## 1. Design thesis

**Direct, bold, local, and built for phones.** The site should feel like a confident Malawian studio, not a SaaS template. Three levers do the work: **big type**, **generous space**, and **motion that explains**. Structure comes from scale, hairline rules and whitespace, not from boxing every block.

Mood words: confident, clear, warm, precise. Not: techy-neon, futuristic, corporate-stock.

## 2. What an "AI-looking" site is, and what we do instead

Researched from current design write-ups on "AI slop" landing pages. The repeated tells:

| AI tell | What we do instead |
|---|---|
| Centered hero headline, pill button, then three feature cards | Left-aligned oversized headline over full-bleed video. One primary action. Next section is a scroll-scrubbed statement, not cards |
| Purple/violet or neon gradient meshes | Flat cobalt, orange and warm white. At most one subtle blue overlay on the video |
| Eyebrow chips ("✨ New") with no meaning | No eyebrow chips. Section numbers appear only in the side rail as wayfinding |
| Three identical icon cards for "features" | Services as a numbered list of rows with hairlines |
| Floating browser/laptop mockup in the hero | The hero is the video. Mockups only appear in the Showcase, and they are built in code per business |
| Emoji as icons | Custom SVG line icons (section 8) |
| Generic stock-photo people | Real team photos. Showcase built in code. Hero footage chosen deliberately |
| Buzzword copy ("unlock", "seamless", "game-changer") | Plain Malawian-context copy. Banned-words list in file 03 |
| Dead footer links (`#`) | Footer lists only real destinations. The QA script fails the build on `href="#"` |
| Tailwind-default look (same blues, same rounded cards, same shadows) | Custom tokens, hairlines, almost no shadow, custom radius scale |

## 3. Palette (provisional until the logo is final)

All values live in `css/tokens.css`. Contrast ratios below were **computed** (WCAG formula), not eyeballed.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#14171C` | Charcoal: body text, the one dark section |
| `--paper` | `#FAF9F6` | Warm white page background |
| `--white` | `#FFFFFF` | Surfaces where you need pure white (pricing tiers, form) |
| `--blue` | `#1546B8` | Primary brand: links, buttons, key lines |
| `--blue-deep` | `#0A2260` | Hero overlay, dark blue moments |
| `--blue-tint` | `#E8EEFB` | Soft blue backgrounds |
| `--orange` | `#F26A1B` | Accent: highlights, lines, large display numerals, button fill (with charcoal text) |
| `--orange-deep` | `#B94406` | Orange when it must be **text** on a light background |
| `--orange-tint` | `#FFF1E8` | Soft orange backgrounds |
| `--muted` | `#5B6270` | Secondary text on light |
| `--muted-on-dark` | `#A9B0BC` | Secondary text on charcoal |

Verified contrast pairs:

| Pair | Ratio | Verdict |
|---|---|---|
| Ink on paper | 17.06 | AAA |
| Muted on paper | 5.82 | AA |
| Blue on paper / white | 7.67 / 8.08 | AAA |
| White on blue (primary button) | 8.08 | AAA |
| White on blue-deep (over hero) | 14.89 | AAA |
| **Ink on orange (orange button)** | 5.86 | AA |
| Orange-deep on white / paper | 5.40 / 5.12 | AA |
| Orange on ink (accent on dark section) | 5.86 | AA |
| Muted-on-dark on ink | 8.23 | AAA |
| **Orange on white (as text)** | **3.06** | **Fails for small text** |
| **White on orange** | **3.06** | **Fails for small text** |

**Rules that follow from the numbers:**
1. Never set small text in `--orange` on white or paper. Use `--orange-deep`.
2. Orange buttons use **charcoal** text, never white.
3. Never use `--muted` on the charcoal section; use `--muted-on-dark`.
4. Orange is an accent. Roughly: 60% paper/white, 20% ink and blue text, 10% blue fills, under 10% orange.

## 4. Typography

| Use | Font | Notes |
|---|---|---|
| Headings, big numerals | **Clash Display**, weights 500 and 600 | From Fontshare. Fontshare fonts are published free for personal and commercial use under the ITF Free Font License and offer WOFF2 files for self-hosting. **Read the license file inside your download and keep a copy in `/assets/fonts/LICENSE`** |
| Body, UI, forms | **Inter** (variable) | Open source (SIL OFL). Download the variable WOFF2 |

How we load them (data is expensive in Malawi, so this matters):
- Self-host WOFF2, **Latin subset only**. Target under about 40 KB per file; measure after subsetting.
- Preload only the two files above the fold (Clash Display 600, Inter variable).
- `font-display: swap`, plus a tuned system fallback with `size-adjust` so the swap doesn't shift the layout.
- Fluid scale with `clamp()`. Starting scale (tune on a real phone):

| Token | Mobile | Desktop |
|---|---|---|
| `--fs-hero` | 2.9rem | 7.5rem |
| `--fs-h2` | 2.1rem | 4.5rem |
| `--fs-h3` | 1.35rem | 1.9rem |
| `--fs-body` | 1rem | 1.0625rem |
| `--fs-small` | 0.875rem | 0.9375rem |

- Tight tracking and line-height (about 0.95 to 1.05) for display sizes; 1.55 for body. Inter body uses tabular numerals for prices and phone numbers.

## 5. Layout system

- **Grid:** 12 columns on desktop (1024 px and up), 4 columns on mobile. Max container about 1440 px, side padding 16 px mobile, 48 px desktop.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 72, 112, 160. Section padding is generous (112 to 160 px desktop, 72 px mobile).
- **Shape language:** square-ish. Radius scale of 0, 4, 12 and full only for the cursor dot and avatars. Hairline rules (1 px, ink at 12% opacity) separate content.
- **Shadows:** almost none. One soft shadow token for the floating mobile action bar and the nav when scrolled.

## 5.1 Breakpoints and the two modules

| Range | Layout module | Notes |
|---|---|---|
| Under 768 px | `mobile` | Single column, bottom action bar, native scroll |
| 768 to 1023 px | `mobile` (tablet adjustments inside `mobile.css`) | Two-column where useful. Still native scroll |
| 1024 px and up | `desktop` | Pinned sections, horizontal showcase, Lenis |
| `(hover: hover) and (pointer: fine)` | cursor module on top of either | An iPad in landscape gets the desktop layout but **not** the custom cursor |

Details of how the modules load are in file 02.

## 6. When to use cards (researched) and the rule we follow

Sources I read: Cognite's design system ("don't use cards to create unnecessary containers; use separators and spacing"), a Glide UI design skill ("default: no cards"), the European Commission component library (cards suit browsing and scanning; keep to small groups, 3 to 4 per row; don't use them as image galleries), Visa's design system (no more than 2 columns of content cards on mobile), Queensland Health's design system (if content should be read in order, use a list or paragraphs; don't use cards instead of table rows), and Ramotion's card guide (one subject per card; weak for comparable data).

**The card test. A block becomes a card only if all four are true:**
1. It is **one self-contained thing** (a plan, a person, a project), not a step in a story.
2. The reader **compares or browses** several of them side by side.
3. It stands as an **independent, clickable or decision-bearing unit**.
4. Removing the container would make the grouping **unclear**. If spacing and a hairline can do the job, no card.

**Applied to this site:**

| Section | Treatment | Why |
|---|---|---|
| Services | **No cards.** Numbered rows divided by hairlines; row expands on interaction | Reader scans a list; it is a catalogue, and cards would just add boxes |
| About / problem | **No cards.** Large editorial text with a scrubbed reveal | A story read in order |
| Team | **No cards.** Photo, name, role directly on the page in a grid | A person is not a box |
| Showcase | **Large media panels**, not cards | Image-led gallery; EU guidance says don't use cards for galleries |
| **Packages** | **Cards, yes** | Three parallel options the reader compares before deciding; the recommended one is highlighted |
| Why choose us | **No cards.** Big typographic statements on the dark section | Persuasive statements, not data |
| FAQ | Accordion rows with hairlines | Sequential Q and A |
| Contact | Open form with underline fields, no box around it | One task; extra container adds nothing |

Result: **exactly one card pattern (packages)** in the whole site.

## 7. Section-by-section design (flow, content, desktop vs mobile)

Navigation has the six sections you listed. Packages live inside "Our Services".

### 7.0 Loader / intro (≤ 1.2 s, first visit only)
The logo mark draws itself in a single SVG stroke, then the page curtain lifts. Skipped on repeat visits within the session and entirely for reduced motion.

### 7.1 Navigation
- **Desktop:** transparent bar over the hero, turns solid paper after the hero, hides when scrolling down and returns when scrolling up. Six links, a slim "WhatsApp us" button, and a small section-progress rail on the right edge.
- **Mobile:** compact bar with wordmark and a menu button. The menu is a full-screen sheet with big type; links stagger in. A **floating bottom action bar** keeps "WhatsApp" and "Call" always reachable (this is the highest-conversion element for Malawi visitors).

### 7.2 Home (hero)
- Full-bleed video loop behind a blue-deep overlay (about 45 to 60% opacity; test for legibility). Footage: see `06-hero-footage-shortlist.md`.
- Huge left-aligned headline, a one-line subhead, **one** primary button ("Get a free quote" opening the contact section or WhatsApp) and one quiet text link ("See our work").
- Not split-screen. No gradients. No mockup. No chips.
- Candidate headlines (pick or edit; all avoid hype):
  1. "Your business, online and easy to find."
  2. "Websites that bring customers to your door."
  3. "A real website for your Malawian business."
- Below the hero, the page **folds**: About slides over the pinned hero (see file 04).

### 7.3 About Us (and the problem)
- Opens with a large statement of the problem, revealed word by word as you scroll. The problem is stated plainly and tied to **sourced** numbers (file 03).
- Then who we are, then the five-person team as a clean photo grid (no cards).
- Mobile: the scrubbed reveal becomes a simple line-by-line fade (less jank on low-end phones). Team becomes a two-column grid.

### 7.4 Our Services
- Left: a sticky title and short intro. Right: nine rows, each with number, name and one line; opening a row reveals what you get and who it is for.
- Desktop: hover opens a row and draws its line icon; mobile: tap to open.
- Then **Packages**: three cards. Middle one recommended. Each lists what is included, ends with "Request a quote", and carries the public instalment wording (no numbers; see file 03). **No prices are shown. Clicking "Request a quote" scrolls to the contact form and pre-selects that package; add-on tick boxes (Google Business Profile, WhatsApp Business setup, brand basics, digital marketing, data collection, maintenance) and the WhatsApp button then build a pre-filled quote request.** A single shared row below the cards lists payment methods: Airtel Money, TNM Mpamba, bank transfer (confirm any others).
- Pricing card design: clean white surface, hairline border, no heavy shadow, a numbered feature list with check marks drawn in SVG, recommended tier marked with a blue top rule and a small label. On mobile the cards stack with the recommended one first.

### 7.5 Business Showcase (concept demos)
- Five concept demos, **clearly labelled "Concept demo, not a client"**.
- Desktop: the section pins and the five panels move **horizontally** as you scroll vertically, with a progress line and a "drag/view" cursor state.
- Mobile: a native swipe row with scroll-snap and a peek of the next panel (no pinning).
- Each panel is a miniature site built in HTML and CSS (not a screenshot), so it stays crisp and light, with a business type, a one-line "what this site does", and the features it includes.

### 7.6 Why Choose Us
- The one **charcoal** section. Six large statements, one per line, revealing as they scroll. Each ends with a sentence of proof. Statements only go in if you confirm they are true (file 03).
- Instalments get their own statement.

### 7.6.1 Testimonials (hidden for now)
A pull-quote component is built, but the section does not render until you provide real quotes with permission. No invented names, ever.

### 7.7 FAQ
Six accordion questions (timeline, what you need to provide, payments and instalments, your web address, support after launch, updates).

### 7.8 Contact Us
- Two columns on desktop, stacked on mobile.
- Left: large "Start on WhatsApp" button, phone, email, Blantyre address, hours, a map link (an external link, not an embedded map, to save weight).
- Right: the form (name, phone/WhatsApp, email, service, budget range, message, consent line). Underline fields, label float, inline validation, clear success and failure states.
- Footer: wordmark, six anchor links, contact details, real socials only, privacy link. Nothing links to `#`.

## 8. Icons and imagery

- **Icons:** custom inline SVG, 24 px grid, 1.5 px stroke, round caps. Needed: 9 service icons (website, starter site, shop/catalogue, search/pin, WhatsApp, social/brand, digital marketing/megaphone, data collection/clipboard, maintenance/wrench), plus UI icons (arrow, plus/close, check, phone, mail, pin, menu). Brand-new drawing, no icon-pack look.
- **WhatsApp icon:** use the official WhatsApp glyph only for the WhatsApp button; follow their brand guidelines.
- **Photos:** real team photos only; one consistent crop and tone. Convert to AVIF/WebP at two sizes.
- **Showcase visuals:** code-built mini-sites. No AI-generated imagery.

## 9. Design acceptance checks (for the reviewer)

- Squint test: can you tell where each section starts without boxes?
- Is there exactly one card pattern?
- Any orange small text on white? (must be none)
- Does the mobile view feel *designed for the phone*, not shrunk?
- Delete the logo. Does it still feel like Saviour? (Colour, type and tone should carry it.)
