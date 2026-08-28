# Adversarial first-read review 1 — Set Note Progression

Date: 2026-08-28 UTC  
Reviewed commit: `61e0a04ed2da882144a3965b91b8bbeb6865a1d7`  
Live URL: <https://set-note-progression.sociobot.in>  
Viewport checks: 390×844 and 1440×900, fresh Chromium contexts

## Verdict

**FAIL**

One blocking demo finding and twelve non-blocking findings remain. The product is functional, the declared claim tests pass, and the visual identity is distinct. It does not meet the zero-finding release standard.

## Findings

### Blocking

#### F-1-1 — The mobile demo hides the result that proves the product's value

- Location: live `/demo`, first 390×844 viewport after selecting **Try it with sample data**.
- Exact copy/location: the result card begins with **“From Aug 27”** and **“Increase to”** at the bottom edge, but **“62.5 kg”** and its reason are below the fold.
- Why this fails: the product promises to tell the lifter what changes next. The first demo screen spends most of its height on the banner, header, large **“Log today’s sets”** heading, Add exercise control, and exercise selector. A phone visitor must scroll before seeing the next load. This is a weak demo under the required one-click demo standard.
- Concrete fix: place a compact, complete **“Increase to 62.5 kg”** result and its reason above the exercise-management controls on mobile, or reduce the banner/header/heading height enough to fit the complete result. Add a 390×844 test that asserts the result title and reason both end above the viewport bottom immediately after the demo opens.

### Non-blocking

#### F-1-2 — The real 404 page drops the standard site skeleton and metadata

- Location: any unknown live URL, for example `/review-1-definitely-missing`; HTTP status is correctly 404.
- Exact location: `public/404.html` has no site header, footer, Privacy link, Terms link, meta description, canonical link, Open Graph fields, Twitter fields, or favicon.
- Why this matters: visitors who follow a stale link lose the navigation and legal links present on every app route. The unbranded browser tab also breaks the required route metadata set.
- Concrete fix: render the 404 with the same wordmark, navigation, footer, Privacy/Terms links, favicon, description, canonical, and social metadata as the app while preserving the HTTP 404 response.

#### F-1-3 — Route metadata describes the landing page on every non-home route

- Location: live `/log`, `/demo`, `/backup`, `/privacy`, and `/terms`.
- Exact values: each route updates `<title>` and canonical correctly, but keeps `og:title` as **“Set Note Progression — Know what to lift next”** and `og:url` as `https://set-note-progression.sociobot.in/`. The meta, Open Graph, and Twitter descriptions also remain the landing description.
- Why this matters: shared Privacy, Terms, Backup, Log, or Demo links preview as the home page and declare the wrong URL.
- Concrete fix: update description, `og:title`, `og:description`, `og:url`, `twitter:title`, and `twitter:description` with the same route metadata map used for `<title>` and canonical. Add route-level metadata assertions.

#### F-1-4 — The core saved-note claim is not registered or tested

- Location: README.
- Exact quotes: **“It keeps a note beside every set.”**, **“Per-set rule chips plus saved-only detail text.”**, and **“Saved-only detail text stays beside the set but does not change the rule.”**
- Why this matters: retaining why each set changed is the brief's core job. `claims.json` tests how a limiting chip changes the rule, but no registered claim verifies that a chip and free-text detail remain attached to the correct set after reload.
- Concrete fix: add a `set-note-retention` claim and one tagged test that saves distinct chips/details on several sets, reloads, opens workout history, and verifies each detail remains on its original set. Reference all three README locations from that entry.

#### F-1-5 — The free-tool promise is an unlisted claim

- Location: landing pricing section.
- Exact quote: **“Every account-free logging and backup tool stays included.”**
- Why this matters: this is a continuing pricing and feature-access promise. `paid-unlimited` proves that a license removes the three-exercise limit, but it does not prove that every logging and backup tool remains available without a license.
- Concrete fix: replace it with the concrete sentence **“CSV export and encrypted backups are free.”** and add a tagged claim test that performs both actions with no license, or remove the promise.

#### F-1-6 — A landing heading does not name its result

- Location: landing section 01.
- Exact quote: **“Your rule chips control the answer”**.
- Why this matters: “the answer” has no meaning when the heading is read out of context, and “rule chips” is product terminology before the section explains it.
- Concrete rewrite: **“How set notes choose the next load”**.

#### F-1-7 — “Free core” is a vague marketing label

- Location: first-screen facts.
- Exact quote: **“Free core.”**
- Why this matters: “core” does not identify what is free and can survive unchanged on an unrelated product.
- Concrete rewrite: **“Free for three exercises.”** Keep the next sentence as **“Unlimited exercises cost $19 once.”**

#### F-1-8 — Numbered section labels add decorative copy

- Location: landing section eyebrows.
- Exact quotes: **“01 / The rule”**, **“02 / One session”**, **“03 / Clear limits”**, and **“04 / One-time license”**.
- Why this matters: the number and slash are decorative, while two labels repeat nearby headings. They add scan noise without helping a visitor act.
- Concrete fix: remove the numeric prefixes. If labels are retained, use distinct plain labels: **“Progression rule”**, **“One workout”**, **“Product limits”**, and **“Price”**.

#### F-1-9 — “Deterministic” is unexplained README jargon

- Location: README, What it includes.
- Exact quote: **“A deterministic next-load result with its reason.”**
- Why this matters: the reader needs to know that the same visible rule produces the result, not learn an implementation adjective.
- Concrete rewrite: **“A next-load result with the rule that produced it.”**

#### F-1-10 — “IndexedDB” appears without a plain-language definition

- Location: README, What it includes and Privacy and data.
- Exact quotes: **“Local IndexedDB storage that works offline after the first visit.”** and **“Workout data stays in IndexedDB on the current device.”**
- Why this matters: IndexedDB is useful implementation detail for a developer, but it does not tell a non-developer what the storage boundary is.
- Concrete rewrites: **“Browser storage (IndexedDB) that works offline after the first visit.”** and **“Workout data stays in this browser's storage on the current device.”**

#### F-1-11 — The README uses a metaphor where a direct build statement is clearer

- Location: README, Test and build.
- Exact quote: **“Static output lands in `dist/`, with `dist/index.html` at its root.”**
- Why this matters: “lands” describes no operation.
- Concrete rewrite: **“The build writes static files to `dist/`, including `dist/index.html`.”**

#### F-1-12 — The checked-in copy audit is incomplete and has wrong counts

- Location: `.factory/copy-audit.md`.
- Exact issue: it reports 13 words for **“A missed rep and a slipped grip should not lead to the same advice.”** and **“Log reps and select a rule chip when grip or form limits a set.”** Both contain 14 whitespace-separated words. It also omits the image alt, price/control labels, footer provenance, and the README audit required by the plain-words checklist.
- Why this matters: the file claims to be proof of simplicity but cannot be reproduced from all shipped copy.
- Concrete fix: generate the audit from the rendered landing copy and README with one documented counting rule, include accessible text and result-naming controls, and fail CI when the generated audit differs.

#### F-1-13 — The recorded palette does not match the shipped palette

- Location: `.factory/design.md` and `src/styles.css`.
- Exact values: design records `--line: #536064`; the shipped CSS uses `--line: #657276`.
- Why this matters: the design document is named as the visual source of truth, so its contrast and palette record is inaccurate.
- Concrete fix: record `#657276` in the design document with the contrast rationale, or restore the documented value after rechecking contrast.

## Cold first read

### 390×844, before scrolling

- What it does: logs each workout set and uses set notes to say what load should change next.
- For whom: lifters who forget why they changed a set and want a repeatable next-load decision.
- First action: select **“Try it with sample data”** to see a finished workout and its next load.

The exact text that answers the three questions is:

> “Log each set. Know what changes next.”
>
> “For lifters who forget why a set changed and want the next load decided from their notes.”
>
> “Try it with sample data” / “See a finished workout and its next load.”

The audience, action, and three product facts all fit inside the mobile viewport.

### 1440×900, before scrolling

The same three answers are visible without scrolling. The asymmetric image-and-rule composition makes the product recognisable and does not resemble a generic centered SaaS hero.

## Copy audit

Counting rule: visible or accessible copy is counted by whitespace-separated tokens. Display text split by sentence punctuation is listed as separate sentences. Repeated navigation and footer strings are listed once. Controls and headings are included because they are also subject to the plain-words rules. No item exceeds 22 words and no banned marketing word appears.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Online | 1 | — |
| A local workout log with one visible rule | 8 | — |
| Log each set. | 3 | — |
| Know what changes next. | 4 | — |
| For lifters who forget why a set changed and want the next load decided from their notes. | 17 | — |
| Try it with sample data | 5 | —; result-naming action |
| See a finished workout and its next load. | 8 | — |
| Start my workout log | 4 | —; result-naming action |
| Private. | 1 | — |
| Your workout log stays in this browser. | 7 | Listed claim: `local-only` |
| Offline. | 1 | — |
| Reopen it after your first visit. | 6 | Listed claim: `offline-reload` |
| Free core. | 2 | F-1-7 |
| Log three exercises. | 3 | Listed claim: `paid-unlimited` |
| Unlimited exercises cost $19 once. | 5 | Listed claim: `paid-unlimited` |
| Abstract weight plates and rep dots converge on one next-step marker. | 11 | Alt text; — |
| Next session · increase | 4 | — |
| 62.5 kg | 2 | — |
| All 3 sets reached 12 reps. | 6 | Listed claim: `progression-rule` |
| No limiting chip was selected. | 5 | Listed claim: `progression-rule` |
| 01 / The rule | 4 | F-1-8 |
| Your rule chips control the answer | 6 | F-1-6 |
| A missed rep and a slipped grip should not lead to the same advice. | 14 | — |
| This log keeps both facts beside the set. | 8 | Covered only partly; see F-1-4 |
| Every set reaches the top | 5 | Listed claim: `progression-rule` |
| Increase the load | 3 | — |
| Sets stay inside the range | 5 | Listed claim: `progression-rule` |
| Add reps | 2 | — |
| A set falls short or has a limiting chip | 9 | Listed claim: `progression-rule` |
| Hold the load | 3 | — |
| 02 / One session | 4 | F-1-8 |
| How it works | 3 | — |
| Set the rep range | 4 | — |
| Add the exercise, working sets, load step, and rep range. | 10 | — |
| Note each set | 3 | — |
| Log reps and select a rule chip when grip or form limits a set. | 14 | Listed claim: `progression-rule` |
| Read the reason | 3 | — |
| See hold, add reps, or increase with the exact rule underneath. | 11 | Listed claim: `progression-rule` |
| 03 / Clear limits | 4 | F-1-8 |
| A log, not a coach | 5 | — |
| It does not create workouts, judge pain, or promise results. | 10 | Plain scope boundary |
| Stop if a movement feels unsafe and seek qualified help. | 10 | Safety instruction |
| 04 / One-time license | 4 | F-1-8 |
| Keep three exercises free | 4 | Listed claim: `paid-unlimited` |
| Every account-free logging and backup tool stays included. | 8 | F-1-5; unlisted claim |
| $19 once | 2 | Listed claim: `paid-unlimited` |
| Add unlimited exercise templates. | 4 | Listed claim: `paid-unlimited` |
| The license works across devices when you paste it again. | 10 | Listed claim: `license-restore` |
| Buy unlimited exercises | 3 | Result-naming action; `checkout-redirect` |
| Restore a license | 3 | Result-naming action; `license-restore` |
| Log set details and get the next-load rule. | 8 | — |
| Original generated artwork | 3 | Provenance label; — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Set Note Progression | 3 | Title; — |
| Log why each set changed and know what to do next. | 11 | — |
| Set Note Progression is an offline workout log for recreational lifters using double progression. | 14 | Audience and category are clear; the next sentence explains the rule |
| It keeps a note beside every set. | 7 | F-1-4; unlisted claim |
| Its visible rule suggests holding the load, adding reps, or increasing the load next session. | 15 | Listed claim: `progression-rule` |
| Live site | 2 | Heading; — |
| Try the isolated sample at https://set-note-progression.sociobot.in/demo. | 6 | — |
| Demo changes and licenses use separate browser storage. | 8 | Listed claim: `demo-isolation` |
| They are discarded when you start for real. | 8 | Listed claim: `demo-isolation` |
| What it includes | 3 | Heading; — |
| Exercise templates with working sets, rep ranges, load steps, and kilograms or pounds. | 13 | — |
| Per-set rule chips plus saved-only detail text. | 7 | F-1-4 |
| A deterministic next-load result with its reason. | 7 | F-1-9 |
| Local IndexedDB storage that works offline after the first visit. | 10 | F-1-10; `offline-reload` covers the claim |
| CSV export with every saved set. | 6 | Listed claim: `csv-export` |
| Password-encrypted JSON backup and import in the browser. | 8 | Listed claim: `encrypted-backup` |
| Three free exercise templates. | 4 | Listed claim: `paid-unlimited` |
| A $19 one-time license adds unlimited templates. | 7 | Listed claim: `paid-unlimited` |
| The Grip slipped and Form broke chips hold the load. | 10 | Listed claim: `progression-rule` |
| Saved-only detail text stays beside the set but does not change the rule. | 13 | F-1-4 |
| The app does not create programs or provide medical advice. | 10 | Plain scope boundary |
| Check every suggestion against how you feel and the equipment available. | 11 | Safety instruction |
| Run locally | 2 | Heading; — |
| Requires Node.js 22 or newer. | 5 | — |
| Open http://localhost:5173. | 2 | — |
| The demo is at http://localhost:5173/demo. | 5 | — |
| Test and build | 3 | Heading; — |
| `npm test` runs unit and Playwright tests. | 7 | Verified |
| The exact production build command is `npm run build`. | 9 | Verified |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | F-1-11 |
| To inspect the production build: `npm run preview`. | 8 | — |
| Privacy and data | 3 | Heading; — |
| Workout data stays in IndexedDB on the current device. | 9 | F-1-10; listed claim: `local-only` |
| No analytics, third-party scripts, or remote fonts run. | 8 | Listed claim: `local-only` |
| License purchase and verification use the Sociobot billing API. | 9 | Listed claims: `checkout-redirect`, `license-restore` |
| Paste the license on another device to restore access. | 9 | Listed claim: `license-restore` |
| Read `/privacy` and `/terms` in the app. | 7 | — |
| The encrypted backup uses AES-GCM with a key derived from your password. | 12 | Listed claim: `encrypted-backup`; technical detail is appropriate in the privacy section |
| The password is never stored. | 5 | Listed claim: `encrypted-backup` |
| There is no password recovery. | 5 | Necessary limitation of `encrypted-backup` |
| Deployment | 1 | Heading; — |
| Deploy the contents of `dist/` as a static site. | 9 | — |
| `staticwebapp.config.json` rewrites only known app routes, gives unknown paths a real 404, and sets security and cache headers. | 18 | Verified by deployment tests and live response checks |
| The factory handles DNS, hosting, and product registration. | 8 | — |
| License | 1 | Heading; — |
| MIT. | 1 | Verified by `LICENSE` |
| See `LICENSE`. | 2 | — |

Terminology is mostly consistent: exercise, set, rep range, set detail, rule chip, next load, demo, backup, and license retain the same meanings. F-1-6 and F-1-10 are the terminology exceptions.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | Landing action opens `/demo` directly |
| Realistic seed | Pass | Barbell bench press, chest-supported row, goblet squat; two completed sessions |
| Product already in use | Partial / blocking | Exercise and range are visible, but the complete next-load result is below the mobile fold; F-1-1 |
| Persistent banner | Pass | “Demo — sample data, nothing is saved”, Reset demo, Start for real |
| Reset | Pass | Session count changed 2 → 3 after saving, then returned to 2 after Reset demo |
| Real-data isolation | Pass | Start for real opened `/log` with “No exercises yet”; demo and license namespace tests passed |
| Storage separation | Pass | Code uses `demo:set-note-progression` and `demo:` license keys; claim test inspects both namespaces |
| Request privacy | Pass | `@claim:local-only` recorded zero cross-origin requests through the save flow |
| Offline demo | Pass | `@claim:offline-reload` reloaded the seeded demo offline |

## Claims audit

The repository was cloned to a new temporary directory at commit `61e0a04`, followed by `npm ci`. Every command was run exactly as written in `.factory/claims.json`.

| Claim id | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | Pass | Two browser projects reloaded `/demo` offline and retained the 62.5 kg sample result |
| `local-only` | Pass | Two browser projects saved the demo workout with no cross-origin requests |
| `progression-rule` | Pass | Selecting Grip slipped changed the result to Hold at 62.5 kg |
| `csv-export` | Pass | CSV contained its header plus six saved-set rows |
| `encrypted-backup` | Pass | AES-GCM wrapper hid workout text, imported successfully, and did not store the password |
| `paid-unlimited` | Pass | Free fourth exercise was blocked; mocked valid license allowed it |
| `demo-isolation` | Pass | Demo session/license state was discarded and real state stayed empty |
| `license-restore` | Pass | Mocked valid license remained active after reload in fresh storage |
| `checkout-redirect` | Pass | Exact Sociobot URL returned 303 to `checkout.dodopayments.com/session/...`; one duplicate mobile project was intentionally skipped |

Unlisted claims remain in F-1-4 and F-1-5. Therefore this review cannot report “no untested claim.”

## Earlier finding verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The earlier `.factory/handoff.md` listed thirteen repaired findings. Each was checked again rather than accepted from its status label.

| Earlier repair | Live and code confirmation | Status |
| --- | --- | --- |
| Desktop first screen hid audience/action/facts | All fit at 1440×900; mobile also fits at 390×844 | Fixed |
| Checkout returned 404 | Exact endpoint returns 303 to hosted Dodo checkout | Fixed |
| `60.25` displayed as `60.3` | `formatLoad` preserves two decimals; regression test passed | Fixed |
| Free text was described as no limiting note | UI labels detail as saved-only and result says “no limiting chip selected” | Fixed |
| Demo state/licenses leaked or persisted | Namespaces, exit, reset, and reseed passed live and in claim test | Fixed |
| Exercises could not be repaired | Edit, delete, whitespace rejection, and close paths passed | Fixed |
| Reps above 99 saved | Native/range validation regression passed | Fixed |
| Dialog close button did not close | Keyboard close regression passed | Fixed |
| Claims omitted demo isolation/license restore | Registry now includes both plus checkout redirect, each with a tagged test | Fixed |
| Touch targets below 44 px | 390 px geometry regression passed | Fixed |
| Hashed assets cached for 30 seconds | Live asset returns `max-age=31536000, immutable` | Fixed |
| Footer destination dead | `https://hello-factory.sociobot.in/` returned 200 | Fixed |
| Unknown routes returned 200 | Unknown live path returns HTTP 404 | Fixed; 404 presentation still has F-1-2 |

None of the earlier findings regressed under its original acceptance criterion.

## Structure, accessibility, and identity

### Passed

- `/`, `/log`, `/demo`, `/backup`, `/privacy`, and `/terms` return 200 and have route-specific titles, exactly one `<h1>`, `lang="en"`, a `<main>`, a canonical URL, and a favicon.
- Titles follow the product/action pattern and stay under 60 characters.
- Deep links reload correctly. SPA navigation and browser Back move focus to the destination `<h1>`.
- The complete link crawl returned 200 for internal and factory links, mail links were explicit, and checkout returned the expected 303.
- The header has four navigation links; SPA routes share the header and footer with Privacy and Terms.
- `robots.txt`, `sitemap.xml`, manifest, OG image, apple-touch icon, security headers, and reduced-motion CSS are present.
- Fresh route contexts produced no console errors, page errors, failed requests, or HTTP error subresources.
- Factory URL verification passed title/lang/main/alt/button checks.
- Playwright axe integration found no serious or critical findings on `/`, `/demo`, `/backup`, `/privacy`, and `/terms` in both browser projects.
- Keyboard exercise creation and 44 px landing target tests passed.
- The load-constellation art, chartreuse/cyan/coral palette, plate geometry, asymmetric hero, and rule board form a distinct product-specific identity rather than a generic SaaS template.
- Production JS is 35.02 KB raw / 11.50 KB gzip. Live HTML, JS, and CSS SHA-256 hashes match the clean build.

### Failed

- Mobile demo above-the-fold result: F-1-1.
- 404 skeleton and metadata: F-1-2.
- Per-route social metadata: F-1-3.
- Recorded palette accuracy: F-1-13.

## Missed leverage

No finding. The brief calls for a deterministic double-progression log, and the product includes the obvious local-first leverage: CSV export plus encrypted backup/import. Cloud sync would conflict with the current local-only promise unless it were an explicit opt-in architecture. An AI feature would obscure a small visible arithmetic rule and is not justified here.

## Verification summary

- Clean `npm ci`: 57 packages, 0 vulnerabilities.
- Clean `npm test`: 10 unit/deployment tests and 32 Playwright tests passed; 2 intentional project skips.
- Clean `npm run build`: passed; `dist/index.html` produced.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- All nine exact claim commands: passed.
- Full live Playwright suite: 32 passed, 2 intentional skips.
- Factory `verify-url.sh`: passed with no reported errors.
- Axe requirement: satisfied through the repository's Playwright axe integration on the live routes; the standalone CLI could not use the container's mismatched ChromeDriver, so it was not used as evidence.

## What would make this perfect

Resolve F-1-1 through F-1-13, then rerun this entire review from a fresh browser context and clean clone. Per the owner's standard, perfection means the complete mobile demo result is visible immediately, all claims are registered and tested, every route including 404 has correct shared structure and metadata, every copy flag is gone, and the design/copy records exactly match the shipped product. There is nothing optional in that list.
