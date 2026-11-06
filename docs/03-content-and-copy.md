# 03. Content and Copy

**Rule zero: never invent facts.** Anything that is not confirmed by the owner or backed by a cited source is marked `[TBC]` and must be resolved before launch. The QA script fails if `[TBC]` remains in a build.

## 1. Voice

- Plain English, short sentences, concrete nouns. Written for a shop owner in Blantyre reading on a phone.
- "We" for Saviour, "you" for the customer.
- Say what we do, what it costs *to ask about*, how long it takes, and what happens next.
- Warm, not cute. Confident, not boastful. No jargon without a plain explanation.

### Banned words and patterns (the QA script checks these)
delve, tapestry, realm, beacon, game-changer, game changing, "in today's fast-paced digital world", unlock, elevate, seamless, leverage, empower, cutting-edge, revolutionize, supercharge, synergy, "take your business to the next level", "transform your business", "unleash", "journey" (as a metaphor), lorem ipsum, any invented company, statistic or testimonial.

## 2. Hero and headline candidates

1. "Your business, online and easy to find."
2. "Websites that bring customers to your door."
3. "A real website for your Malawian business."

Subhead (draft): "We design and build websites, set up WhatsApp Business and Google listings, and look after them, for small businesses across Malawi."
Primary button: "Get a free quote". Secondary link: "See our work".

## 3. About and the problem

**The problem (draft, to be tuned with the owner):**
Customers look for businesses on their phones. A business that can't be found online, or only shows up as scattered posts, loses people before they ever call. Many small businesses and new entrepreneurs in Malawi don't have the time, money or technical help to fix that. That is the gap Saviour Digital Solutions exists to close.

**Sourced numbers to support it (verify each one again before publishing, and show the source and year in small print):**

| Fact | Source | Notes |
|---|---|---|
| 4.02 million internet users in Malawi in October 2025 | DataReportal, *Digital 2026: Malawi* (Kepios analysis) | Published Nov 2025 |
| 2.40 million active social media user identities in Malawi in October 2025 | DataReportal, *Digital 2026: Malawi* | "Identities" may not equal unique people; say "accounts" |
| About 1.6 million MSMEs employing about 1.8 million people | 2019 FinScope MSME Survey, as cited by the World Bank *Africa Can End Poverty* blog and Malawi's *Nation* newspaper | Survey is from 2019; say "in 2019" |
| MSMEs about 24% of employment and about 40% of GDP (estimate) | World Bank blog citing the same survey | Another source (MicroSave, older data) gives different shares, so call these "estimates" |
| 18% of Malawi's population used the internet in 2023 | World Bank World Development Indicators (via a data aggregator) | Verify on the World Bank site before use. Different sources give different figures; don't mix definitions |

Do **not** publish: any "Chamber of Commerce" statistic (none was verified), or Airtel Money market-share claims (only one secondary source, 2025, found). Do not state "most customers search online" or similar without a source.

Suggested use: one or two figures only, in large display type, each with a small "Source, year" line linking to the page. Fewer, solid numbers beat a wall of stats.

**Who we are (live):** Saviour Digital Solutions is a team in Blantyre. We build websites and digital services for small businesses and new entrepreneurs. Founding story is live on the page ("How we started", 4 Nov 2026), written from the owner's notes: a lesson in digital and entrepreneurship skills from Rynberg Stacks, a pun on the name Saviour, ambition to go big starting in Blantyre. The owner listed three team members (Saviour Kumalawi, Fyaupi Guthrie Mwenelupembe, Charity Phiri), so the earlier "five" is superseded.

### Team (five people)
For each: full name, role, one-line bio, photo. `[TBC from owner]`

## 4. Services (nine)

Draft descriptions below are capabilities, not promises. Timelines and deliverables are `[TBC]` until the owner confirms.

| # | Service | One-line | What you get (draft) | Timeline |
|---|---|---|---|---|
| 01 | Website design and development | A custom website that fits your business and works on every phone | Design, build, mobile-first layout, contact form, WhatsApp button, basic search setup | `[TBC]` |
| 02 | Starter sites for small businesses | A simple, affordable site to get you online fast | One-page or small site with your story, services, photos, contact and WhatsApp | `[TBC]` |
| 03 | Online shop or catalogue | Show your products and take orders by WhatsApp or form | Product pages or catalogue, order by WhatsApp, simple management | `[TBC]` |
| 04 | Google Business Profile and local SEO | Show up when people nearby search for what you sell | Google Business Profile creation and verification help, local search basics, correct name/address/phone everywhere | `[TBC]` |
| 05 | WhatsApp Business setup | Look professional and answer customers faster | Business profile, catalogue, quick replies, a click-to-chat link on your site | `[TBC]` |
| 06 | Social media and brand basics | A consistent look across your pages | Profile setup, simple logo/colour guidance, shareable image templates | `[TBC]` |
| 07 | Digital marketing | Help the right people find and remember your business | `[TBC: owner to confirm what is included, for example a simple plan, regular posts, adverts, a results summary]` | `[TBC]` |
| 08 | Data collection | Gather the information you need with digital forms, research and field data collection | Digital forms, research, and field data collection `[TBC: owner to confirm the detail of each, for example survey design, collectors, reporting]` | `[TBC]` |
| 09 | Maintenance and support | We keep it running and up to date | Updates, backups, small content changes, fixes | `[TBC]` |

**Change log, 4 Nov 2026:** "Domain and hosting setup" was removed because Saviour does not offer hosting as a service. "Digital marketing" and "Data collection" were added. Row 07 is a wording placeholder and row 08 has its three areas confirmed by the owner (digital forms, research, field data collection) but not their detail. Nothing beyond that may go on the live page until the owner confirms the scope (the QA script fails the build while `[TBC]` remains).

**Change log, 4 Nov 2026 (phase 3 build):** services 01 to 06 and 09 went on the page with the "what you get" lists above (wording tightened, no timelines). Row 04 is shown as "Google Business Profile and local search". Rows 07 and 08 carry only what is confirmed (see `docs/HANDOFF.md`). Statistics on the page: DataReportal 4.02 million (October 2025) and "almost 1.6 million" MSMEs (2019 FinScope survey via the World Bank blog), both re-checked on 4 Nov 2026.

## 5. Packages (three; names are proposals)

Each package has: name, who it is for, included list, public instalment wording, a "Request a quote" button.

**Decision (3 Nov): quote only, no prices shown.** The `priceFrom` field stays in the markup, empty, ready for later.

**Quote pre-fill (the "best implementation"):**
1. Each package button carries `data-package="starter|business|growth"`.
2. Clicking it scrolls to the contact form and pre-selects that package in a "Package" select (Starter / Business / Growth / Not sure).
3. The form also has add-on tick boxes: Google Business Profile, WhatsApp Business setup, Social and brand basics, Digital marketing, Data collection, Maintenance.
4. "Send via WhatsApp" builds a message such as: "Hello Saviour Digital Solutions, I'd like a quote for the Business package with: Google Business Profile, Maintenance. My business: ___."
5. The email submission carries the same fields.
No prices appear anywhere on the site.

| | **Starter** | **Business** (recommended) | **Growth** |
|---|---|---|---|
| For | Getting online quickly | A full small-business site | Selling and growing online |
| Pages | One page `[TBC]` | Up to `[TBC]` pages | Larger site `[TBC]` |
| Mobile-first design | ✓ | ✓ | ✓ |
| Contact form + WhatsApp button | ✓ | ✓ | ✓ |
| Google Business Profile setup | – | ✓ | ✓ |
| Photo gallery or portfolio | – | ✓ | ✓ |
| Online catalogue or shop | – | – | ✓ |
| Local SEO basics | – | ✓ | ✓ |
| Maintenance | `[TBC]` | `[TBC]` | `[TBC]` |
| Instalments | see 5.1 (draft) | see 5.1 (draft) | see 5.1 (draft) |

(The check marks above are plan notation only. On the site, use SVG check icons, never text glyphs or emoji.)

**Payment line (shared):** "Pay by Airtel Money, TNM Mpamba or bank transfer." (confirmed by the owner). **Instalments, public wording:** "Pay in instalments. We agree a payment plan in your written quote." (No numbers on the public site until the owner confirms real terms.)

## 5.1 Instalment arrangement (DRAFT: `[DRAFT-EDIT]`, owner to edit)

You asked me to generate a starting arrangement that you will edit later. This is a **proposal only**. I do not know your costs, cash flow or how clients pay, so every line below is a suggestion in the usual milestone style (pay as work moves forward). **Nothing in this section is published.** The QA script fails the build while any `[DRAFT-EDIT]` remains.

| Package | Payments | Draft schedule `[DRAFT-EDIT]` |
|---|---|---|
| Starter | 2 | 60% to start work, 40% before launch |
| Business | 3 | 40% to start work, 30% when the design is approved, 30% before launch |
| Growth | 4 | 30% to start work, 25% when the design is approved, 25% when the build is complete, 20% before launch |

Draft terms to settle `[DRAFT-EDIT]`:
1. Work starts when the written quote is accepted (a WhatsApp reply is fine) and the first payment arrives.
2. Payment by Airtel Money, TNM Mpamba or bank transfer; a receipt is sent for each payment.
3. The finished site and its files are handed over after the final payment.
4. If a payment is late by `[X days]`, work pauses until it is received.
5. Revisions: `[N]` rounds included per milestone; extra rounds are quoted.
6. Cancellation: the first payment is `[refundable / non-refundable]` once design work has started.
7. Costs paid to other companies (for example a domain name) are separate and paid by the client `[confirm]`.
8. Maintenance, if taken, is billed `[monthly / yearly]` `[confirm]`.

**What goes on the public site until you confirm:** only "Pay in instalments. We agree a payment plan in your written quote." The numbers above live in your quote, not on the page.

## 6. Business showcase: one live project and five concept demos

**Live project (added 6 Nov 2026):** SMS Malawi, a school management system and website (by 5iveStack Labs, shown with a demo school) at https://sms-malawi.vercel.app/, labelled "Live project, shown with demo data." and shown first. Its copy lists only what the live page shows (admissions application, exam results page, student and staff login, news and announcements, contact form and map). The picture beside it is a drawing in the school's navy, not a screenshot. The live site's footer credits "5iveStack Labs"; the owner should confirm that is fine next to the Saviour Digital Solutions name.

The five concept demos are always labelled **"Concept demo, not a client."** Use generic descriptors, not invented business names, so we never clash with a real Malawian business.

| # | Concept | Features it demonstrates |
|---|---|---|
| 1 | Hair and beauty studio | Services and prices list, booking by WhatsApp, photo gallery, opening hours |
| 2 | Hardware and building supplies | Product catalogue by category, price enquiry by WhatsApp, location and hours |
| 3 | Restaurant and takeaway | Menu, order by WhatsApp, delivery area, opening hours |
| 4 | Farm produce and agro-dealer | Product list with seasons, bulk enquiry form, delivery and collection info |
| 5 | Private tutoring and training | Courses, timetable, enrolment form, parent contact |

Phase 2 (after Sunday): turn each panel into a live demo page.

## 7. Why choose us: candidate statements

Every line below is a **candidate**. Keep only the ones the owner confirms as true, and replace "[TBC]" with specifics.

1. **Built for phones first.** Most of your customers will see your site on a phone, so we design for that screen first.
2. **Local, in Blantyre.** You can meet us, call us or message us on WhatsApp. `[TBC: confirm in-person availability]`
3. **Pay in instalments.** We split the cost so a website doesn't wait for a big lump sum. We agree the plan in your written quote.
4. **Pay the way you already pay.** Airtel Money, TNM Mpamba or bank transfer.
5. **A clear written quote.** You see what you get and what it costs before we start. `[TBC: confirm process]`
6. **We stay after launch.** Updates, fixes and support when you need them. `[TBC: confirm support terms]`
7. Possible, only if true: **You own your site**: domain and content are registered in your name.

Do not add: "fastest", "cheapest", "best in Malawi", years of experience, client counts, or awards, unless real and provable.

## 8. Testimonials

Hidden until real. How to collect: ask any real early client (or a pilot client given a discounted site) for two sentences, their name, business and permission to publish, in writing (a WhatsApp message is fine). Show first name, business and town only if they agree.

## 9. FAQ (six, draft answers to be confirmed)

1. How long does a website take? `[TBC]`
2. What do I need to give you? (Business name, logo if any, photos, product or service list, contact details.)
3. How do I pay? (Airtel Money, TNM Mpamba, bank transfer; instalments agreed in your written quote.)
4. Do you register domain names or host websites? No. Saviour does not register domains and does not offer hosting. `[TBC: owner to say how the finished site goes live, so this answer can tell the client what they need to arrange]`
5. What happens after the site goes live? (Support options `[TBC]`.)
6. Can I change things later? (Small updates under maintenance `[TBC]`.)

## 10. Contact block (placeholders until provided)

- WhatsApp / phone: `+265 [TBC]`
- Email: saviourkumalawi@gmail.com (live 5 Nov 2026)
- Address: `[TBC], Blantyre, Malawi`
- Hours: open 7:30 am to 4:30 pm; reachable by phone, WhatsApp and email at any time (live 5 Nov 2026). Days of the week `[TBC]`
- Socials: only those that exist, with real URLs `[TBC]`

## 11. Microcopy

| Place | Copy |
|---|---|
| Primary button | Get a free quote |
| WhatsApp button | Message us on WhatsApp |
| Form heading | Tell us about your business |
| Required field error | Please add your name. / Please add a phone or WhatsApp number we can reach. |
| Invalid phone | That number doesn't look right. Try something like 0999 123 456. `[TBC: validate with real format rules]` |
| Success | Thank you, we received your message. We'll reply on WhatsApp or by email. `[TBC: reply time promise only if true]` |
| Failure | Sorry, that didn't send. Please message us on WhatsApp or email us at the address below. |
| Consent | I agree that Saviour Digital Solutions may contact me about my enquiry. Read our [privacy policy]. |
| 404 | We couldn't find that page. Head back home or message us on WhatsApp. |

## 12. Meta (drafts)

- **Title:** Saviour Digital Solutions | Website Development in Blantyre, Malawi
- **Description:** Websites, Google Business Profile, WhatsApp Business setup and digital marketing for small businesses in Malawi. Pay in instalments. Request a quote.
  (The instalment line is safe to keep: it states no terms.)

## 13. Privacy page outline (lawyer to review)

1. Who we are and how to reach us.
2. What we collect through the form: name, phone/WhatsApp, email, service, budget range, message, and consent timestamp if stored.
3. Why: to reply to your enquiry and send a quote.
4. Who processes it: the form service, the host, the analytics provider (named, with links).
5. How long we keep it `[TBC]`.
6. Your rights (access, correction, deletion, withdrawing consent) and how to use them.
7. Cookies: say plainly if analytics is cookie-free.
8. Complaints: mention the regulator, MACRA, under Malawi's Data Protection Act, 2024.
9. Date of last update.
