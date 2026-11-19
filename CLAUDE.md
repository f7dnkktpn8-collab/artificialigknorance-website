# artificialigknorance.com | website

Marketing site for Mike's iOS apps under the **Artificial Igknorance**
brand. Mike's role here is **website manager**: engagement, SEO, copy.
Live at https://artificialigknorance.com.

## Stack

- **Astro** + Tailwind (via `src/styles/globals.css`), Inter Variable font
- Deployed to **Netlify** on push to `main`
  (repo: `github.com/f7dnkktpn8-collab/artificialigknorance-website (renamed 2026-11-14, was astro-platform-starter)`)
- **Domain `artificialigknorance.com`:** registered at **GoDaddy**, but
  DNS is delegated to **Netlify** (NS1 nameservers `DNS{1-4}.P06.NSONE.NET`).
  So the domain bill is at GoDaddy; the DNS records that point the site
  live in the Netlify dashboard.
- Single layout: `src/layouts/Layout.astro`. Props: `title`,
  `description`, `ogImage`, `twitterCard`, `smartAppId`, `datePublished`,
  `mainEntityId`. Emits OG/Twitter cards, canonical URL, iOS Smart App
  Banner, JSON-LD `@graph` (Organization + WebSite + WebPage + every
  MobileApplication; the Escalator page adds the Field Guide VideoObject).
  There is deliberately no Person entry (no author name on the site).
- Pages: `index.astro`, `escalator-field-command.astro`,
  `healthtrail-medical.astro`, `clock-in-everyday.astro`,
  `snapledger.astro`, `gold-watcher.astro`, `silver-watcher.astro`,
  `copper-watcher.astro`, `lithium-watcher.astro`, `ridgepacker.astro`,
  `elevator-code-answers.astro` (SEO landing page targeting A17.1/A17.2/
  A17.3/B44 search terms, funnels to Escalator Field Command),
  `family-lists/index.astro`, `junkyard-titans.astro`, `about.astro`,
  `privacy.astro`, `terms.astro`, and `family-lists/delete-account.astro`
  (account-deletion page for the Family Lists app). The Astro starter demo pages (`blobs/`,
  `edge/`, `image-cdn/`, `revalidation/`, `api/`) are inherited and
  `Disallow`-ed in robots.txt.
- **Look: "Daylight"** (light, Apple-style, redesigned Oct 2026 from the old
  dark-blue `#355c7d` glass look). Tokens live in the `@theme` block of
  `src/styles/globals.css`: page `bg-paper` `#fbfbfd`, text `text-ink`
  `#1d1d1f` / `text-body` / `text-muted`, hairlines `border-line`, accent
  teal `text-accent` `#0a7c96` (hover `accent-deep`), dark bands
  `navy` `#0b1f33`. Homepage styles are in `src/styles/home.css`, every
  rule scoped under `.home` so nothing leaks to other pages. Inner pages
  keep their original markup and Tailwind classes, re-skinned to the light
  tokens (white cards with `border-line`, per-app colors darkened to
  `-700`, gradient headings replaced by `text-ink`). `Layout.astro` takes
  `contained={false}` for full-bleed pages (only the homepage).
  Always use the **WHITE** Apple App Store badge at
  `public/images/appstore-badge.svg`, never the plain black one (the
  "white" badge is black with a white outline, so it reads fine on light
  and dark backgrounds).
- **Brand mark:** `public/images/hero-ai-handshake-transparent.png/.webp`
  (human + AI hand shaking, transparent background, cropped from a source
  image Mike generated and dropped on his Desktop). Used as: the small logo
  beside the "Artificial Igknorance" wordmark in the header and footer, the
  logo on the About page and the homepage maker card, the Organization
  JSON-LD `logo` in `Layout.astro`, and the source for
  `apple-touch-icon.png` / `favicon-32x32.png` / `favicon.ico` (a tighter,
  text-free crop of the same art, composited opaque since favicons don't
  need transparency). The old `robot-mascot-transparent.png` file is still
  in `public/images` but no longer referenced anywhere. The logo stays
  SMALL everywhere: the homepage hero is a headline plus a row of real app
  screenshots in phone frames (its LCP preload is the main phone
  screenshot). Don't make the logo a big hero image without checking with
  Mike first, he explicitly downsized it twice.

## App IDs

| App | Store ID | Country | Color theme | Status |
| --- | --- | --- | --- | --- |
| Escalator Field Command | 6756789866 | us | blue/cyan | **SEO priority, first in homepage list** |
| HealthTrail Medical | 6758072258 | us | emerald/teal | shipping |
| Clock-In Everyday | 6791800212 | us | orange/teal | shipping |
| SnapLedger ø | 6759497982 | **ca** | green | shipping |
| Copper Watcher (Cu) | 6757655923 | us | amber | shipping |
| Gold Watcher (Au) | 6758283387 | us | yellow | shipping |
| Silver Watcher (Ag) | 6760270695 | us | slate | shipping |
| Lithium Watcher (Li) | 6761344726 | us | teal | shipping |
| RidgePacker | 6766699306 | us | sky | shipping |
| Family Lists | 6813696329 | us | teal | shipping (also Google Play) |
| Junkyard Titans | 6826464717 | us | amber | shipping (also Google Play) |

Currently 11 apps. The count appears on the homepage proof strip ("11 apps,
all free to download" and "10 of 11 apps need no account") and on the
`/about/` page ("Eleven apps live on the App Store today, across nine
areas" and "All eleven apps are free to download. Ten of them need no
account"). Update those whenever the catalog changes. Only Family Lists
needs an account, so never write "no accounts" for the whole brand.

Homepage layout (Daylight): hero + proof strip, then a dark featured band
for Escalator Field Command (always first, SEO priority), then "For
everyday life" (HealthTrail Medical, Clock-In Everyday, RidgePacker,
SnapLedger, Family Lists, Junkyard Titans as a 2x3 grid of tiles), then "The Watchers" (Gold, Silver,
Copper, Lithium as a row of four). The tiles are driven by the `everyday`
and `watchers` arrays at the top of `index.astro`: adding an app means
adding an entry there (plus its screenshots in `public/images/home/`).
Old anchors still exist: `#apps`, `#industry`, `#health`, `#financial`,
`#faq`, `#contact`, and one id per app.

## Conventions (don't drift from these)

- **No em dashes anywhere on the site, ever** (Mike, 2026-10-05: "no more
  em dashes ever", "an ugly AI giveaway"). Use a comma, colon, period,
  parentheses, or " | " in titles. This is enforced: `scripts/check-no-em-dashes.mjs`
  runs on every build (wired in through `astro.config.mjs`) and fails the
  build, so nothing with an em dash can deploy. It also catches `&mdash;`
  and `\u2014`. The weekly App Store sync must rewrite App Store wording
  that contains one. Run by hand: `node scripts/check-no-em-dashes.mjs`.
- **No author name and no "one person" framing on the public site** (Mike,
  2026-10-05: "it does more harm than good", "keep my name off the site
  too"). Don't write "one person", "solo", "indie", "independent
  developer", "no growth team/investors", or his name, in page copy,
  titles, meta descriptions or JSON-LD. Use "Artificial Igknorance" as the
  maker everywhere. The only place his name survives is inside the App
  Store developer-page link addresses (`.../developer/mike-dangerfield/...`),
  which can't be changed.
- **Demo videos must be real screen recordings of the app.** The old
  "10-second demo" was an AI-made promo clip (Sora watermark, an actress at
  an escalator) and Mike pulled it on 2026-10-05. The homepage button now
  plays the real Field Guide recording
  (`public/videos/escalator-field-guide-demo.mp4`). If Mike supplies a real
  Escalator Field Command walkthrough, swap it in there.
- **App Store buttons use Apple's official badge SVG**, never styled
  gradient buttons.
- **Homepage app tiles** show the official App Store badge (`h-10`), the
  Google Play badge too when the app is on Google Play (set `play` on its
  entry in `index.astro`), plus a "Details" link. Screenshots on the homepage
  come from `public/images/home/` via `components/Shot.astro` (WebP first,
  JPG fallback, real width/height).
- **Header and footer** (`Header.astro`, `Footer.astro`) are shared by every
  page. The header has an "Apps" dropdown listing all eleven apps (hover or
  keyboard focus) and a hamburger `<details>` panel on mobile, no JS.
  Every page stays reachable from every page.
- **All FAQ accordions use the unified pattern**: `<details
  class="p-5 transition-all bg-white border border-line rounded-2xl group
  hover:shadow-md">` with `<summary class="flex items-center
  justify-between gap-4 cursor-pointer list-none font-semibold text-lg">`,
  the question span first, and a gray circle chevron at the right:
  `class="flex-shrink-0 w-8 h-8 p-1.5 transition-transform duration-300
  rounded-full bg-[#efeff2] text-muted group-open:rotate-180"`.
  Never blue chevrons.
- **JSON-LD MobileApplication entries** live in `Layout.astro`
  `@graph`, one per app, each with its own `screenshot` array.
- **Subscription pricing + free-trial copy lives in `src/data/pricing.ts`**:
  one source of truth. Each app page imports `PRICING` and `trialSentence()`
  and interpolates the values into its FAQ. To change a price or trial
  length, edit ONLY this file. Do not put price strings inline in any
  `*.astro` page. Build at the end to verify the rendered HTML.
- **VideoObject `uploadDate` must include time AND timezone.** Google
  Search Console flagged a date-only value (`"2026-04-29"`) as a
  non-critical structured-data issue. Always use full ISO 8601 with
  offset: `"2026-04-29T00:00:00+00:00"` (or `...Z` for UTC). Applies
  to every `VideoObject` added to any page: currently the Field Guide
  demo on `escalator-field-command.astro`, plus any future demo videos for HealthTrail,
  SnapLedger, the metals apps, etc.
- **Privacy claims must match what the apps really do** (checked 2026-10-12
  against the apps' relay servers). HealthTrail Medical and SnapLedger send a
  photo or file you choose to scan to a Cloudflare Worker, which passes it to
  OpenAI (the Worker stores nothing). The Clock-In Everyday coach sends context
  to Anthropic. HealthTrail also sends a hashed device ID, app ID and trial
  start date to a database to stop repeat free trials. So never write
  "100% on-device", "never leaves your phone" or "nothing leaves the device"
  for those apps. Say records are stored on the device, and name the scan.
  Family Lists needs an account (Sign in with Apple or an emailed code) and
  keeps accounts and shared lists on a Supabase server, with crash reports to
  Sentry. Junkyard Titans has no account but keeps a random game ID, a game-made
  name and progress on our Cloudflare server, plus an optional Leaders board
  with approximate location. Both have their own sections in `privacy.astro`
  (Sections 5 and 6): keep them in step with the apps.
  Before changing any privacy claim, read the app's relay code
  (`~/Dev/ArtificialIgknorance/<app>/ai-worker` or `cloudflare-worker`). Also,
  OpenAI's own words: API data is not used for training, and may be kept up to
  30 days for abuse checks. Recheck https://developers.openai.com/api/docs/guides/your-data
  now and then.
- **Android.** Three apps have a Google Play listing: Escalator Field Command
  (`com.vibecode.escalatorfieldcommand`), Family Lists
  (`com.artificialigknorance.familylists`) and Junkyard Titans
  (`com.artificialigknorance.junkyardtitans`, live 2026-11, checked 2026-11-14).
  Everywhere their App Store badge appears (app page, homepage, and for
  Escalator the Elevator Code Answers and About pages) the Google Play badge
  (`public/images/google-play-badge.png`) sits beside it, and their JSON-LD
  lists both platforms. Every other app is iOS-only, so their "iOS native"
  tags stay true. Don't claim a free trial on Android until the ledger agrees.
  If Mike confirms another app on Google Play, add its badge the same way.
- **Every screen size and text size must work** (Mike, 2026-10-05: a link
  spilled out of its card with big text on an iPhone). Rules: font sizes in
  `rem`, never `px`; grids use `minmax(0, 1fr)`; flex and grid children that
  hold text get `min-width: 0`; rows that can run out of room use
  `flex-wrap`; no fixed heights on anything holding text (the header uses
  `min-height`); long words and addresses wrap (`overflow-wrap`). The app page
  hero rows wrap the icon above the title when there is no room beside it.
  Before shipping layout work, check phone widths (320, 360, 390), a tablet
  (768) and a laptop with the text scaled to 1.5x and 2x. Build, serve `dist`,
  and run a check that looks for anything sticking out of its card or off the
  page. Don't test through the dev server, it falls over under rapid loads.
- **No star-rating widgets** while apps have 0 ratings (would hurt
  conversions).
- **SEO is Escalator-led.** Don't dilute the focus by adding parallel
  category landing pages unless explicitly approved. Escalator is the
  featured band at the top of the homepage app list.
  `elevator-code-answers.astro` is the one standing exception: Mike
  explicitly approved it (it came out of an ad-ops session) as a
  free/organic counterpart to a paid Google Ads test on the same
  keywords. Its FAQ content was supplied directly by Mike (real code
  citations like buggy switch, safety zone clearance, comb impact
  force). Don't invent or edit those answers without him.

## App Store screenshots (works, keep this recipe)

Best source (checked 2026-11-18): Apple's lookup service,
`https://itunes.apple.com/lookup?id=<id>&country=<cc>`. Its `screenshotUrls`
are the iPhone pictures in display order (`ipadScreenshotUrls` are separate),
and `artworkUrl512` is the icon. Swap the trailing size in each URL for
`/1290x0w.png` to get the full-size file (1290x2803). To find which pictures
changed, shrink the new and old ones to a tiny grey image and compare: an
unchanged picture differs by under 1, a changed one by 10 or more.

(The older page-scraping route also works: fetch
`apps.apple.com/<country>/app/<slug>/id<id>` and pull the `mzstatic.com`
`PurpleSource` URLs, but that mixes iPhone and iPad sets in no useful order.)

Most apps' App Store pictures are now captioned posters (headline above a
phone). The app pages show them as they are, one per figure, with a short
caption underneath. Family Lists and Junkyard Titans each have a collage
"cover" poster as picture 1 that the site leaves out (it repeats the page
header and leaves one picture alone in the last grid row). Keep each page's
count at a multiple of the grid's columns: 3 columns for most, 4 for
Escalator Field Command. Never put a store picture on the site that shows
debug text or a typo.

## Image pipeline

- Screenshots: stored as JPG + WebP variants in
  `public/images/screenshots/<app-slug>/`. Wrap `<img>` in `<picture>`
  with WebP source first, JPG fallback. Use `cwebp -q 80` to generate.
- App icons: `public/images/<app-slug>-icon.webp`. Source from App
  Store artwork or marketing assets, convert with `cwebp -q 85`.

## Build / deploy

- `npm run dev` (port 4321) or via `.claude/launch.json` for the
  preview MCP.
- `npm run build` → `dist/` (full SSR build with sitemap).
- Deploy: `git push origin main` → Netlify auto-builds.
- **Never push without explicit "ship it" from Mike**, EXCEPT the
  automated weekly App Store sync below, which has its own standing
  authorization to push straight to `main`.
- **Never leave unfinished work in this main folder.** The weekly sync
  runs `git add -A` and pushes to `main`, so anything uncommitted here
  would go live by accident. Do big or risky work in a separate git
  worktree (`git worktree add ../artificialigknorance-website-<name> -b
  <branch> main`) and merge only on "ship it".
- **Weekly App Store description sync (automated).** `scripts/appstore/check.mjs`
  compares each app's live App Store description against a saved
  snapshot (`scripts/appstore/descriptions.json`) and reports what
  changed. A scheduled task (`weekly-appstore-website-sync`, Mondays)
  runs it, updates the matching page, refreshes the snapshot, and,
  per Mike's standing authorization (2026-08-31-ish), **pushes
  straight to `main` for plain, literal, low-risk syncs** (a feature
  line changed, a trial length changed). It only holds back for review
  on a separate branch when a change looks ambiguous or structural
  (new pricing tier, renamed app, anything beyond feature/trial copy).
  Trial-length changes route through `src/data/pricing.ts`, never
  hardcoded into a page. If you see a commit titled "Sync website to
  App Store description changes" in `git log` that you don't recognize
  authoring, that's this job, not a mistake.

- **App Store pictures check (`scripts/appstore/check-images.mjs`).** Asks
  Apple for every app's current iPhone pictures and icon and compares them
  with `scripts/appstore/images-seen.json` (Apple gives a replaced picture a
  new web address, so a changed address means a changed picture). `--apply`
  swaps in any changed picture that sits in a slot the site already shows,
  rebuilds the matching homepage tile and icon, and refreshes the list. It
  holds back, with a note, anything that needs a human eye: a changed picture
  count, a picture the site leaves off on purpose (cover collages, the
  Clock-In paywall with a debug line, SnapLedger's typo poster), and the
  hand-edited Clock-In workout picture. `--accept <app>` marks an app as
  handled after a manual fix. The slot list at the top of the script is the
  map from App Store position to site file: keep it in step when a gallery
  changes. Look at every new picture before it goes on the site: hold it back
  if it shows debug text, a typo, an unfinished screen, or a personal name.
  Publishing needs Mike's "ship it". The one exception: on 2026-11-18 Mike
  said "publish automatically" for the one-time Friday 20 Nov run (scheduled
  task `website-picture-check-nov20`), limited to plain picture swaps. The
  main folder's `node_modules` gets deleted by the tidy-up rule, so run
  `npm ci` before any build there (the Monday description job now does this
  itself).

## Current Session State

Last updated: 2026-11-18: refreshed App Store pictures, the Family Lists
groceries hero phone and the pictures check script are live as `6bccd1d`.
A one-time check is scheduled for Friday 20 Nov.

**Current focus:** None. No branches or work copies are open. Waiting for
Friday's scheduled picture check.

**Last shipped:** the website is static, so "shipped" = pushed to `main` and
Netlify auto-deploys. The last site change is `6bccd1d` (pushed 2026-11-18):
left hero phone is now Family Lists groceries (was Clock-In), new App Store
pictures on the Escalator Field Command, HealthTrail Medical, RidgePacker,
Family Lists and Junkyard Titans pages, six homepage tiles and three icons
refreshed, plus `scripts/appstore/check-images.mjs`. Verified live the same
day: home and seven app pages 200, all 91 added or changed picture files 200,
no em dashes. Use `https://artificialigknorance.com` with `curl -L` when
checking live, because `www.` redirects. Before that: Junkyard Titans and
Family Lists pages (`7e82312`, 2026-11-16).

**Scheduled:** `website-picture-check-nov20` (one time, Fri 20 Nov, about 10 AM
local, needs the Claude app open). It runs the pictures check, skips pictures
with debug text, typos or personal names, publishes plain swaps itself and
checks the live site. It prepares only (no push) if a picture count changes or
a page needs hand edits. Monday `weekly-appstore-website-sync` runs `npm ci`
before its build as of 2026-11-18.

**Uncommitted work queued for next ship:** none.

**Waiting on Mike / open decisions:**
- **Store pictures to fix in the apps' own sessions** (notes sent to the
  Clock-In, SnapLedger and HealthTrail sessions on 2026-11-18, at Mike's
  request): the Clock-In paywall store picture shows a "DEBUG: Bypass
  paywall" line (and its workout picture says "Hi Mike"), SnapLedger's store
  poster has a typo ("We extracts the data"), and HealthTrail's poster says
  "100% Private and Secure" while the site's wording is more careful about
  photo scanning. All three are kept off or edited on the site until the
  fixed pictures are live; each session was asked to tell this one.
- **Read the new Family Lists section in `privacy.astro` (Section 6).** It is
  legal text I wrote from the app's real data flows (account sign-in, Supabase US
  servers, Gmail sign-in codes, Sentry, delete-account steps). Mike has not
  reviewed it line by line.
- **Lifetime plan for Copper, Silver and Lithium.** Add `lifetime: '$24.99'` in
  `src/data/pricing.ts` for each only when it can really be bought in the live
  app (Copper's live build 64 lacks the paywall option; Silver's and Lithium's
  Lifetime purchases were `MISSING_METADATA` at Apple on 2026-10-04). Their App
  Store text already says Lifetime plans are available, which is ahead of
  reality (the metals session owns that).
- **Brazil section wording.** The privacy contact (encarregado) is
  info@artificialigknorance.com with no personal name. If Mike wants a named
  contact or a lawyer's check, edit the "If you are in Brazil (LGPD)" part of
  `privacy.astro`.
- **App Store "App Privacy" answers** for HealthTrail and SnapLedger should list
  photos sent for scanning and (HealthTrail) the device code. Not checked,
  outside the website.
- **Family Lists photo storage** (`avatars`, `item-photos` buckets) is set public
  in its database setup, so anyone with the exact photo link can open it. Belongs
  to the Family Lists session; Mike has been told.

**Parked for later:**
- Real Escalator Field Command walkthrough video and a Portuguese privacy
  policy: Mike said skip both (2026-11-14). Ask again only if he raises them.
- **App Store affiliate enrollment**: not enrolled; small per-install
  revenue with no effort once Mike signs up. Parked, no urgency.

(The eleven old held-back `appstore-sync/*` branches were deleted on
2026-11-14 with Mike's OK, after checking nothing in them was missing from
`main`. The Monday job will make new ones if it is unsure about a change.
HealthTrail uses this site's `/privacy/` page as its only privacy policy, and
SnapLedger's App Store listing link switches when its 1.4.19 ships.)

**Known issues / TODO:**
- The "Smart App Banner default" is Escalator Field Command. If a different
  app becomes priority, change the default in `Layout.astro`.
- Inner pages were re-skinned (colors and cards), not re-laid-out.
- App Store developer-page links contain Mike's name in the web address
  (`.../developer/mike-dangerfield/...`). Visible text is clean; the link
  addresses cannot be changed.
- Only Escalator Field Command, Family Lists and Junkyard Titans have an Android
  version on the site. If any other app reaches Google Play, add its badge (see
  Conventions).
- The Clock-In Workout picture was edited in one line ("Hi Mike" became "Hi
  there!"). The rest of the coach note in the pictures still has the app's own
  em dashes.
- Local-only leftovers in `mockups/` (git-ignored). Safe to delete.

**Recent key decisions:**
1. **No author name and no "one person" framing** on the public site.
2. **No em dashes anywhere, ever**, enforced by a build check.
3. **Wherever there is an App Store link there should be a Google Play link**,
   but only for apps really on Google Play (Escalator Field Command, Family
   Lists, Junkyard Titans).
4. **Site-wide claims say "almost no accounts"** and name the exceptions
   (Family Lists needs an account; Junkyard Titans keeps game progress on a
   server). Privacy wording follows the real data flows (see Conventions).
5. **Left hero phone is Family Lists groceries** (Mike picked option A,
   2026-11-18), and store pictures with debug text, typos, a personal name or
   a collage cover stay off the site.

## Session-end protocol

Lives in `~/CLAUDE.md` (cross-project). When Mike says "run the
session-end protocol", update this file's `Current Session State`
section, replace stale items in the stable sections only if they've
genuinely changed, and generate a continuation prompt.
