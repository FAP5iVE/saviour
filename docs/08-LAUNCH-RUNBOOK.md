# 08. Launch runbook

Written Fri 6 Nov 2026 (phase 7, QA and launch). Business deadline: **Sunday 8 Nov 2026**.
Follow it top to bottom. Each step says what "done" looks like. Dashboard menu names change
now and then: if a label differs, look for the closest one and check the host's own help page.

## 0. What you need in your hand before you start

| Item | Where it goes | Status on 6 Nov |
|---|---|---|
| Domain name (for example `saviourdigital.mw`, a bare name with no `https://`) | `npm run launch:fill` | Not chosen yet |
| Web3Forms access key (free at web3forms.com, made with the email that should receive requests) | `npm run launch:fill` | Not made yet |
| GitHub account (or skip it and use the drag-and-drop route in step 4B) | Cloudflare Pages | Owner |
| Street address, days for the 7:30 to 4:30 hours, real social links | Contact block, JSON-LD (`streetAddress`, `openingHours`, `sameAs`), Google Business Profile | Not supplied. Leave them off the page until real |

## 1. On your computer: fix, fill, check (about 15 minutes)

Open a terminal in the project folder. Node 20 or newer.

1. **Fix the linter once.** `package.json` asks for ESLint 4 but the config needs ESLint 9, so `npm run lint` fails.
   Run `npm install --save-dev eslint@9` (it takes the newest 9.x, the same major as `@eslint/js`). This rewrites `package.json` and `package-lock.json` together. Commit both.
   (The fix was not made in the zip because the lock file cannot be rebuilt offline, and a mismatch would break `npm ci` on the host.)
2. `npm install`, then `npm run check`. Expected: lint, csp:check and qa all pass. Then `npm run format:check`.
3. **Fill in the domain and the key** (one command, safe to run twice):
   `npm run launch:fill -- --domain YOURDOMAIN --key YOUR-WEB3FORMS-KEY`
   It sets the canonical link, `og:url`, `og:image`, `twitter:image`, the JSON-LD addresses, `sitemap.xml`, the `privacy.html` canonical,
   the live `Sitemap:` line in `robots.txt`, and the key in the form. It checks that the CSP hash still matches.
4. `npm run qa:launch` must say **0 failure(s)**. One warning stays and is a false alarm: "Orange used as text colour" for the
   current link in the phone menu, which sits on the dark blue sheet at 4.86:1 (passes AA).
5. `npm run build`, then `npx serve dist` and open http://localhost:3000 once. Click through. Send one test request through the form.
6. Optional but wanted: `npm run lighthouse` (needs internet and Chrome). Save the report. Targets: LCP 2.5 s or less, CLS 0.1 or less,
   accessibility 90 or more. See "Known results" at the end for what the lab checks here showed.

## 2. Pick one web address

Choose **either** `yourdomain` **or** `www.yourdomain` as the main address, and send the other one to it.
The site's canonical link, share image and sitemap all use the bare name you gave `launch:fill`. If you prefer `www`, run
`launch:fill` with `--domain www.yourdomain` instead.

## 3. Put the code on GitHub

Create a private repository, push the project (the `.gitignore` already keeps `node_modules/`, `dist/` and secrets out).
Tag the launch: `git tag v1.0-launch && git push --tags`. That tag is your rollback point in code.

## 4. Deploy on Cloudflare Pages

**4A. From Git (updates deploy by themselves).** Workers and Pages, Create, Pages, Connect to Git, choose the repository.
Build command `npm run build`. Build output directory `dist`. Add the environment variable `NODE_VERSION` = `22`.
The build copies only public files (docs, scripts and plans are never published). Expect about 6.7 MB in `dist` including both hero videos.

**4B. Drag and drop (no Git, no npm on the host).** Run `npm run build` on your computer, then upload the **`dist`** folder in
Pages, Create, Pages, Upload assets. Use this if the Git build fails for any reason. `_headers` (security headers and caching)
is inside `dist` and is honoured by both routes.

Done when: the `*.pages.dev` address opens the site and the hero video plays.

## 5. Connect the domain

In the Pages project open Custom domains and add your domain. If the domain is registered somewhere else, either add the
CNAME record Cloudflare shows you, or move the domain's nameservers to Cloudflare (needed if you want Cloudflare to do the
www redirect for you). SSL is automatic. DNS can take from minutes to a day: if it is slow, launch on the `*.pages.dev`
address first, then switch (tell people only the final address).

Done when: `https://yourdomain/` opens, the other form (www or bare) redirects to it, and the padlock shows.

## 6. Test the live site (do all of these, on a real phone too)

- Fill and send the form with a real request. The email must arrive (look in spam the first time). Then send once with
  the phone's data turned off to see the "Sorry, that didn't send" state with the WhatsApp and call links.
- Tap **WhatsApp** (header, hero, contact): the chat opens with the pre-filled message to +265 886 02 34 82.
- Tap **Call** and the email link.
- Send the site link to yourself on WhatsApp: the preview should show the share image and title.
- Open `/privacy`, `/robots.txt`, `/sitemap.xml`, and a made-up address such as `/nothing-here` (shows the 404 page).
- Hero video: if it does not play on the live site, open DevTools, select the `<video>` and read `data-state`
  (the values are listed in `docs/07`, phase 4 block).
- Back and forward buttons after clicking the menu links (tested in Chromium on 6 Nov: they work).

## 7. After it is live (the same day if you can)

1. **Google Search Console:** add the site (a Domain property is verified with one DNS TXT record), then submit `https://yourdomain/sitemap.xml`.
2. **Google Business Profile:** create or claim it for the Blantyre address, with the same name, phone and the site link. This needs the street address and opening days.
3. **Uptime monitor:** a free monitor (for example UptimeRobot or Better Stack; check their current free limits) that checks the home page every 5 minutes and emails you.
4. **Analytics (optional, decide first).** The privacy page says the site uses no analytics. If you turn on Cloudflare Web Analytics you must
   (a) add the two allowed addresses listed in the comments at the top of `_headers`, (b) add one line to `privacy.html`, and (c) re-run `npm run csp:check`.
5. **Real social links** into the footer and JSON-LD `sameAs`, only for profiles that exist.

## 8. Rollback

Cloudflare Pages keeps every deployment. In the project open Deployments, pick the last good one, and use its Rollback (or Promote)
action. In code, `git revert` the bad commit or check out `v1.0-launch`.

## 9. Soon after launch

- Ask a Malawian lawyer to read `privacy.html` (it states only what the site does today, and has not been legally reviewed).
- Choose a retention period for requests (for example 12 months after the last contact) and state it in `privacy.html`.
- Work through the open owner items at the top of `docs/HANDOFF.md` (timelines, how a finished site goes live, instalment terms, photos, logo).
- Back to the owner's wishlist in `docs/05`: data files for content, own form endpoint, then the admin dashboard.

## Known results from the 6 Nov lab checks (so you are not surprised)

These came from Chromium here, not from Lighthouse (it could not be installed offline). Run the real thing and keep its report.

- **Page weight, first load, no video:** about 360 to 470 KB uncompressed (`html` 75, `css` 56, `js` 203 to 231, fonts 63, hero picture 56 to 90, icons 14).
  The host compresses text files, so real transfer is lower. The hero video (1.3 MB phone clip, 3.5 MB desktop clip) loads only after the page `load` event.
- **Phone (375 px, slow 4G, 4x slower CPU):** FCP and LCP about 2.0 s (the hero picture), CLS 0. Total blocking time about 700 ms in this setup:
  one 360 ms task about 1.3 s in and one 316 ms task about 3.5 s in (not traced to a cause). This is the number most likely to hold the Lighthouse performance score below 90.
- **Desktop:** LCP about 1.9 s on a fast connection, because the hero text waits for the loader curtain (1.25 s). On a slow desktop connection that can pass 2.5 s.
- **Desktop CLS in real use:** scrolling to the end of the page records one layout shift of about 0.74 when fold 2 (FAQ to Contact) releases its pin.
  Nothing visibly jumps (the section moves 12 px behind the Contact section), but Chrome counts it, so field data for desktop visitors could show a poor CLS.
  Lighthouse does not scroll, so it will not show it, and phones have no pins and measured 0. Options are in `docs/HANDOFF.md` (phase 7 update).
- **Not tested:** a real phone, Safari, Firefox, a screen reader, `npm run lint`, `npm run format:check`, Lighthouse, a real Web3Forms delivery.
