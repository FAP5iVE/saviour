# 06. Hero Footage Shortlist (stock placeholder)

**Status:** you asked me to choose from stock so you can compare it with your own footage. Here is what I found, and the limits of what I could check.

## What I could and could not check

I could read each clip's page (tags, resolution, licence label). I **could not watch the videos**, and I cannot download media in this workspace (outbound access is limited). So I can vouch for what the pages say, not for how the footage looks, whether faces are identifiable, or whether it loops cleanly. **Please open the links and judge the look yourself.**

## Selection criteria

1. Real (not AI-generated) footage of a market or street, which fits the story of small businesses.
2. 1080p or higher, landscape, free for commercial use.
3. No close-up of one identifiable person, because the hero implies "our customers".
4. Avoids the generic "person typing on a laptop" look.
5. Works under a blue overlay with big white text on top (not too busy, not too dark).

## Shortlist

| # | Clip | Page says | Fit | Concerns |
|---|---|---|---|---|
| **A (stock pick)** | [Market, African Market, Addis Ababa](https://pixabay.com/videos/market-african-market-addis-ababa-152308/) | Tags: market, Ethiopia, Africa, African city. 1920×1080, 29 fps, about 13 s per the search listing. Pixabay Content License | Real African market scene; matches the "small business" theme | It is **Ethiopia, not Malawi**. The page doesn't say how the camera moves or who appears. Check for identifiable faces |
| **B (your footage)** | Your own Blantyre clips | n/a | Best fit: genuinely local, no mismatch | Needs a short shoot (shot list below) |

## Clips I looked at and rejected

| Clip | Why not |
|---|---|
| [Market, Nigeria, Africa, Animal](https://pixabay.com/videos/market-nigeria-africa-animal-377690/) | The page is labelled **AI generated**. That is exactly the look we're avoiding, and it would be misleading as a real market |
| [Trader, Woman, Portrait](https://pixabay.com/videos/trader-woman-portrait-people-275172/) | A portrait of one identifiable person (tagged Nigerian, Lagos). Using her as the face of a Malawian studio's hero is a poor fit |
| Mixkit "small business" collection | Mostly office and laptop footage; no market or vendor clips on the page |
| Coverr "Africa" category | Listed clips weren't African scenes (mostly Christmas, family and generic) |

## My recommendation

Use **clip A as a temporary placeholder** so we can build and test the hero. Treat **your own Blantyre footage as the real hero**. A Malawian visitor will notice an Ethiopian market, and local footage is also a trust signal. The page must never depend on the video: the hero works with the poster alone.

## Licence note

Pixabay's pages say the clip is free for use under the **Pixabay Content License** (Pixabay's page also says no attribution required). I did not read the full licence text. Read Pixabay's licence summary when you download, and keep a screenshot of the clip page and its licence in `docs/`.

## Shot list for your own footage (phone is fine)

Shoot landscape, steady, 10 to 15 seconds each, no talking, daylight:
1. A busy street or market stall row in Blantyre (wide, slow pan)
2. A shopfront with its signboard, customers passing
3. A shop owner serving a customer (**get permission**; avoid close-ups of faces if you can)
4. Hands holding a phone with a WhatsApp order on the screen (blur or fake any private numbers)
5. A mobile-money payment at a counter (screen not readable)
6. A craftsperson or vendor at work

Rules: no one's face as the main subject unless they have agreed in writing (a WhatsApp message is fine); no visible car plates or private screens; no audio needed.

## Preparing the clip (for whoever builds the hero)

Proposed targets (tune after measuring): loop of 8 to 12 seconds, **no audio**, desktop file under about 2 MB, mobile file under about 800 KB, poster image under about 60 KB.

```bash
# Desktop clip (starting values; check the file size, adjust the CRF if needed)
ffmpeg -i assets/video/hero-og.mp4 -an -t 10 -vf "scale=1280:-2,fps=24" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -movflags +faststart assets/video/hero-720.mp4

# Mobile clip
ffmpeg -i assets/video/hero-og.mp4 -an -t 10 -vf "scale=854:-2,fps=24" -c:v libx264 -preset medium -crf 30 -pix_fmt yuv420p -movflags +faststart assets/video/hero-480.mp4

# Poster frame (then convert to AVIF/WebP)
ffmpeg -i assets/video/hero-og.mp4 -ss 1 -frames:v 1 -vf "scale=1600:-2" hero-poster.png
```

Loop seam: if the clip jumps when it restarts, crossfade the last second into the first, or pick footage with steady motion.

## What I need from you

- [ ] Open clip A. Reply "yes", "no", or "different mood" (market, street, shopfront?).
- [ ] Send your own footage when you have it; I'll set both side by side in the hero for a direct comparison.
