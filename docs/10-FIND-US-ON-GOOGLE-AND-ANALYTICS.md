# 10. Google Business Profile, Search Console, analytics and Facebook

Written Fri 6 Nov 2026. These are accounts in your name, so you do the clicking. The site is already prepared; this file says what to do and in what order. Do it **after the site is live on its real domain**.

Keep the business details the **same everywhere** (the site, Google, Facebook): the name **Saviour Digital Solutions**, the phone **+265 886 02 34 82**, the town **Blantyre, Malawi**, and the hours. Google trusts a business more when these match.

---

## 1. Google Business Profile (so you show up on Google Maps and local search)

**Why:** someone in Blantyre searching "website developer Blantyre" or "web design Malawi" can see you on the map and call or WhatsApp you from the result.

**You need first:** your final domain, a phone number, and a decision: do customers visit an office, or do you go to them?

1. Go to **business.google.com** and sign in with the Google account you want to own the profile (use a business account that more than one person can reach, not a personal one you may lose).
2. Choose **Add your business**. Name: `Saviour Digital Solutions` (exactly, no extra keywords).
3. Category: pick the closest one Google offers, for example **Website designer** or **Web designer**. You can add one or two more (for example an internet marketing category).
4. **Location:**
   - If clients visit an office, enter the street address.
   - If you work from home or go to clients, choose the option to **hide the address** and list **Blantyre** (and nearby areas) as your service area.
5. Phone: `+265 886 02 34 82`. Website: your domain.
6. Hours: only the days and times you really answer. (The site shows 7:30 am to 4:30 pm. Once you confirm the days, give them to Claude too so the page matches.)
7. **Verify.** Google will ask you to confirm the business (a phone call, a text, a video or a postcard, depending on what it offers). Follow what it shows. Nothing appears on Maps until this is done.
8. After verifying: add your logo, a few real photos (the team, your workspace, finished sites), a two-line description in plain words, and your services.
9. Reviews: ask **real clients** to leave one. Never write or buy reviews.

**Check:** search your business name on your phone and see that the card shows the right phone number and website.

---

## 2. Google Search Console (so Google knows your pages exist)

**Why:** it tells you whether Google can read the site, which searches find you, and what is broken.

1. Go to **search.google.com/search-console** and sign in with the **same Google account** as above.
2. Add a property. The easiest is **Domain**: enter your domain (for example `yourdomain.com`). Google gives you a **TXT record**.
3. Add the TXT record where your domain's DNS is managed (if Cloudflare manages it: Cloudflare dashboard, your domain, **DNS**, **Add record**, type TXT, paste the value). Go back to Search Console and press **Verify**. It can take a few minutes.
4. **Sitemaps** (left menu): enter `sitemap.xml` and submit. The site already has one, and `robots.txt` points to it once the domain is filled in.
5. **URL inspection**: paste your home page address, press Enter, then **Request indexing**.
6. Come back after a few weeks. Look at **Pages** (is everything indexed?) and **Performance** (what people searched to find you).

**If you prefer not to use DNS:** choose the **URL prefix** option and the **HTML tag** method. Google gives you one line starting `<meta name="google-site-verification"`. Send it to Claude, who adds it inside `<head>` in `index.html`, or paste it there yourself, then redeploy (see `docs/08`) and press Verify.

---

## 3. Analytics: Cloudflare Web Analytics (no cookies, no banner)

**Why:** you can see how many people visit, which pages, and from what kind of device, without following anyone around the web.

**What is already done in the site:**
- The security policy in `_headers` allows Cloudflare's small counting script and its report address (`static.cloudflareinsights.com` and `cloudflareinsights.com`).
- `privacy.html` now says in plain words that Cloudflare Web Analytics counts visits without cookies.
- Nothing is added to the page itself. Cloudflare adds the counter for you when you switch it on.

**What you do:**
1. Cloudflare dashboard, **Workers & Pages**, open your site's project, then **Metrics**.
2. Find **Web Analytics** and press **Enable**. (If you do not see it there, go to **Analytics & Logs**, then **Web Analytics**, and add your site.)
3. Wait a day, visit your own site a few times, then look at the report.

**If you ever turn it off or switch to something else:** tell Claude. The two addresses in `_headers` and the paragraph under "Cookies" in `privacy.html` must change at the same time, otherwise the privacy page will say something that is no longer true. Do not add any other analytics or tracking tool without changing both.

Until you switch it on, the site simply does not count visits. Nothing breaks.

---

## 4. Facebook page

The page name is **Saviour Digital Solutions**. To put it on the site, Claude needs the **full web address** of the page (open the page, copy the address from the browser, something like `https://www.facebook.com/...`).

When you have it, it goes in three places:
1. The footer, under "Talk to us" or "Find us" (a link that opens in a new tab).
2. The `sameAs` list in the JSON-LD block in `index.html` (this helps Google connect the page to the site).
3. The Google Business Profile (it has a place for social links).

**Do by hand if you prefer:** in `index.html`, find the footer list under `Talk to us` and add:

```html
<li>
  <a href="YOUR-FACEBOOK-ADDRESS" target="_blank" rel="noopener noreferrer">Facebook</a>
</li>
```

and in the JSON-LD block near the top add `"sameAs": ["YOUR-FACEBOOK-ADDRESS"],` after the `"email"` line.

Also put your website address in the Facebook page's "Website" field and a WhatsApp button if Facebook offers one, so people can move between the two.
