# Adversarial first-read review 2 — Set Note Progression

Date: 2026-08-28 UTC  
Reviewed commit: `a22e45f96867dfd880f84c8bfd07280ce41c4332`  
Live URL: <https://set-note-progression.sociobot.in>  
Method: fresh Chromium contexts at 390×844 and 1440×900; clean-clone test run; live request, route, metadata, and link checks.

## Verdict

**FAIL.** Three findings remain, including one blocking honesty failure in the first-screen explanation of the core rule. The demo, declared claim tests, routing, and accessibility checks otherwise passed.

## Findings

### Blocking

#### F-2-1 — The landing says all “notes” choose the next load, but free-text set details do not

- Location and exact quotes: landing lead, **“For lifters who forget why a set changed and want the next load decided from their notes.”**; landing section heading, **“How set notes choose the next load”**.
- Evidence: the logger labels the text field **“Set detail (saved only; does not change the rule)”**. The live regression test `free text is clearly saved-only and never described as an absent note` confirms that entering `Grip slipped badly` as a set detail still produces **“Increase to 62.5 kg”**. Only reps and the limiting **Grip slipped** / **Form broke** rule chips affect the result.
- Why this fails: on a cold visit, “notes” naturally includes the free-text detail the app invites the lifter to enter. A visitor can reasonably expect a limiting written note to hold the load, then receives an increase instead. This is a misleading statement about the product’s central decision.
- Concrete fix: replace the lead with **“For lifters who want to save set details and use reps and rule chips to choose the next load.”** Replace the heading with **“How reps and rule chips choose the next load.”** Add an assertion to `@claim:progression-rule` that a saved-only detail is retained but never changes the result, and list the corrected landing locations in that claim.

### Minor

#### F-2-2 — The privacy page makes an unregistered license-data claim

- Location and exact quote: `/privacy`, **“Buying or checking a license contacts Sociobot with the license token.”**
- Why this fails: this tells a visitor where a paid entitlement is sent. The `local-only` claim test proves the demo save flow has no cross-origin request; it does not run the license verification flow and assert the destination or payload boundary. No `claims.json` entry covers this sentence.
- Concrete fix: add a claim such as **“License verification sends the pasted license token only to Sociobot”** and a Playwright request-log test that restores a fixture license, checks the request destination is `https://api.sociobot.in`, and checks no workout data is sent. If that cannot be tested safely, remove the sentence.

#### F-2-3 — The terms page makes unregistered merchant and refund claims

- Location and exact quote: `/terms`, **“Sociobot and Dodo handle payment, receipts, and refunds as merchant of record.”**
- Why this fails: the registered `checkout-redirect` test proves only that the Buy action gets a 303 redirect to a Dodo checkout session. It does not prove receipt handling, refund handling, or merchant-of-record status. A purchaser can rely on those statements, but they have no entry in `claims.json`.
- Concrete fix: either add a documented, executable billing-contract test/fixture covering the listed responsibilities, or reduce the text to the observable, tested statement: **“The $19 Buy action opens Sociobot’s hosted Dodo checkout.”**

## Cold first read

### 390×844, before scrolling

- What it does: logs sets and offers a next-load decision.
- For whom: lifters who forget why a set changed.
- First action: **Try it with sample data**; it says it will show a finished workout and next load.

The exact first-screen text was:

> “Log each set. Know what changes next.”
>
> “For lifters who forget why a set changed and want the next load decided from their notes.”
>
> “Try it with sample data” / “See a finished workout and its next load.”

The required content fit without scrolling: headline bottom 321 px, audience bottom 415 px, action block bottom 532 px, and all three facts bottom 711 px in an 844 px viewport. F-2-1 means the first-read explanation is not honest enough to accept.

### 1440×900, before scrolling

The same answers fit: headline bottom 552 px, audience bottom 633 px, action block bottom 717 px, and facts bottom 894 px. The plate-and-rep geometry is distinct and does not resemble a generic SaaS hero. There were no browser console errors in either fresh context.

## Copy audit

Counting rule: whitespace-separated words after collapsing repeated spaces. This includes visible headings, prose, controls, footer labels, accessible labels, and image alt text. No entry exceeds 22 words, no banned marketing word appears, and buttons name outcomes. F-2-1 is the sole landing-copy flag because it contradicts the product’s own rule boundary.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Set Note Progression | 3 | — |
| Log | 1 | — |
| Demo | 1 | — |
| Backup | 1 | — |
| Privacy | 1 | — |
| Online | 1 | — |
| A local workout log with one visible rule | 8 | — |
| Log each set. | 3 | — |
| Know what changes next. | 4 | — |
| For lifters who forget why a set changed and want the next load decided from their notes. | 17 | F-2-1 |
| Try it with sample data | 5 | —; result-naming verb |
| See a finished workout and its next load. | 8 | — |
| Start my workout log | 4 | —; result-naming verb |
| Private. | 1 | `local-only` |
| Your workout log stays in this browser. | 7 | `local-only` |
| Offline. | 1 | `offline-reload` |
| Reopen it after your first visit. | 6 | `offline-reload` |
| Free for three exercises. | 4 | `paid-unlimited` |
| Unlimited exercises cost $19 once. | 5 | `paid-unlimited` |
| Next session · increase | 4 | `progression-rule` specimen |
| 62.5 kg | 2 | `progression-rule` specimen |
| All 3 sets reached 12 reps. | 6 | `progression-rule` specimen |
| No limiting chip was selected. | 5 | `progression-rule` specimen |
| Progression rule | 2 | — |
| How set notes choose the next load | 7 | F-2-1 |
| A missed rep and a slipped grip should not lead to the same advice. | 14 | — |
| This log keeps both facts beside the set. | 8 | `set-note-retention` |
| Every set reaches the top | 5 | `progression-rule` |
| Increase the load | 3 | `progression-rule` |
| Sets stay inside the range | 5 | `progression-rule` |
| Add reps | 2 | `progression-rule` |
| A set falls short or has a limiting chip | 9 | `progression-rule` |
| Hold the load | 3 | `progression-rule` |
| One workout | 2 | — |
| How it works | 3 | — |
| Set the rep range | 4 | — |
| Add the exercise, working sets, load step, and rep range. | 10 | — |
| Note each set | 3 | — |
| Log reps and select a rule chip when grip or form limits a set. | 14 | `progression-rule` |
| Read the reason | 3 | — |
| See hold, add reps, or increase with the exact rule underneath. | 11 | `progression-rule` |
| Product limits | 2 | — |
| A log, not a coach | 5 | — |
| It does not create workouts, judge pain, or promise results. | 10 | scope boundary |
| Stop if a movement feels unsafe and seek qualified help. | 10 | safety instruction |
| Price | 1 | — |
| Keep three exercises free | 4 | `paid-unlimited` |
| CSV export and encrypted backups are free. | 7 | `free-backup-tools` |
| $19 once | 2 | `paid-unlimited` |
| Add unlimited exercise templates. | 4 | `paid-unlimited` |
| The license works across devices when you paste it again. | 10 | `license-restore` |
| Buy unlimited exercises | 3 | —; result-naming verb; `checkout-redirect` |
| Restore a license | 3 | —; result-naming verb; `license-restore` |
| Log set details and get the next-load rule. | 8 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| (opens in a new tab) | 5 | — |
| v1.0.2 · Original generated artwork | 5 | provenance |
| Set Note Progression home | 4 | — |
| Main navigation | 2 | — |
| Product facts | 2 | — |
| Example next-session suggestion | 3 | — |
| Footer | 1 | — |
| Abstract weight plates and rep dots converge on one next-step marker. | 11 | image alt; — |

Terminology is otherwise consistent: exercise, set, rep range, rule chip, set detail, next load, demo, backup, and license. F-2-1 uses the broad word “notes” for both rule chips and saved-only detail, creating the inconsistency.

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Set Note Progression | 3 | — |
| Log why each set changed and know what to do next. | 11 | — |
| Set Note Progression is an offline workout log for recreational lifters using double progression. | 14 | — |
| It keeps each rule chip and detail beside its set. | 10 | `set-note-retention` |
| Its visible rule suggests holding the load, adding reps, or increasing the load next session. | 15 | `progression-rule` |
| Live site | 2 | — |
| Try the isolated sample at https://set-note-progression.sociobot.in/demo. | 6 | — |
| Demo changes and licenses use separate browser storage. | 8 | `demo-isolation` |
| They are discarded when you start for real. | 8 | `demo-isolation` |
| What it includes | 3 | — |
| Exercise templates with working sets, rep ranges, load steps, and kilograms or pounds. | 13 | — |
| Rule chips and saved-only detail text that stay with each set. | 11 | `set-note-retention` |
| A next-load result with the rule that produced it. | 9 | `progression-rule` |
| Browser storage (IndexedDB) that works offline after the first visit. | 10 | `offline-reload` |
| CSV export with every saved set. | 6 | `csv-export` |
| Password-encrypted JSON backup and import in the browser. | 8 | `encrypted-backup` |
| Three free exercise templates. | 4 | `paid-unlimited` |
| A $19 one-time license adds unlimited templates. | 7 | `paid-unlimited` |
| The Grip slipped and Form broke chips hold the load. | 10 | `progression-rule` |
| Saved-only detail text stays with its original set but does not change the rule. | 14 | `set-note-retention` |
| The app does not create programs or provide medical advice. | 10 | scope boundary |
| Check every suggestion against how you feel and the equipment available. | 11 | safety instruction |
| Run locally | 2 | — |
| Requires Node.js 22 or newer. | 5 | — |
| Open http://localhost:5173. | 2 | — |
| The demo is at http://localhost:5173/demo. | 5 | — |
| Test and build | 3 | — |
| npm test runs unit and Playwright tests. | 7 | verified |
| The exact production build command is npm run build. | 9 | verified |
| The build writes static files to dist/, including dist/index.html. | 9 | verified |
| To inspect the production build: | 5 | — |
| Privacy and data | 3 | — |
| Workout data stays in this browser's storage on the current device. | 11 | `local-only` |
| No analytics, third-party scripts, or remote fonts run. | 8 | `local-only` |
| License purchase and verification use the Sociobot billing API. | 9 | F-2-2 analogue; register or narrow |
| Paste the license on another device to restore access. | 9 | `license-restore` |
| Read /privacy and /terms in the app. | 7 | — |
| The encrypted backup uses AES-GCM with a key derived from your password. | 12 | `encrypted-backup` |
| The password is never stored. | 5 | `encrypted-backup` |
| There is no password recovery. | 5 | product limitation |
| Deployment | 1 | — |
| Deploy the contents of dist/ as a static site. | 9 | — |
| The staticwebapp.config.json file rewrites only known app routes. | 8 | verified |
| It gives unknown paths a real 404 and sets security and cache headers. | 13 | verified |
| The factory handles DNS, hosting, and product registration. | 8 | — |
| License | 1 | — |
| MIT. | 1 | verified |
| See LICENSE ./LICENSE. | 3 | verified |

No README sentence exceeds 22 words. `IndexedDB` is parenthetically defined after the plain-language storage boundary, so it is not a first-read jargon failure. The license API sentence is covered by the same unregistered privacy boundary as F-2-2.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | The hero action normalizes `/?demo=1` to `/demo`. |
| Realistic sample | Pass | Three named lifts and two completed sessions seed the log. |
| Product already in use | Pass | On 390×844 the complete `Increase to 62.5 kg` card and reason end at 554 px. |
| Persistent sandbox banner | Pass | **“Demo — sample data, nothing is saved”**, Reset demo, and Start for real are visible. |
| Reset | Pass | Declared `@claim:demo-isolation` test reseeds the two-session sample after edits. |
| Real-data isolation | Pass | The same test confirms demo IndexedDB and `demo:` license keys are discarded and `/log` is empty after exit. |
| Offline demo | Pass | Declared offline-reload test reloads `/demo` offline after service-worker control. |
| Request privacy | Pass | A cold demo request log contained only `https://set-note-progression.sociobot.in`; the save-flow claim test also passed. |

## Claims gate

I cloned the repository into a new temporary directory, ran `npm ci` (0 vulnerabilities), then ran every command from `.factory/claims.json` exactly. All eleven commands passed: 11 Vitest tests and the selected Playwright claim test in both browser projects for each command.

| Claim id | Result | Observable check |
| --- | --- | --- |
| `offline-reload` | Pass | Controlled demo reload works offline after first visit. |
| `local-only` | Pass | Saving a demo workout creates no cross-origin request. |
| `progression-rule` | Pass | Adding **Grip slipped** changes the sample result to hold. |
| `csv-export` | Pass | CSV has a header and one row per saved set. |
| `encrypted-backup` | Pass | AES-GCM backup hides sample workout text and imports. |
| `set-note-retention` | Pass | Distinct chips and details remain on their original sets after reload. |
| `free-backup-tools` | Pass | No-license demo downloads populated CSV and encrypted backup. |
| `paid-unlimited` | Pass | Fourth exercise is blocked until mocked valid license verification. |
| `demo-isolation` | Pass | Demo data/license stay namespaced and are discarded on exit. |
| `license-restore` | Pass | A pasted fixture license stays active after reload in fresh storage. |
| `checkout-redirect` | Pass | The live buy endpoint returned 303 to `checkout.dodopayments.com/session/...`. |

F-2-2 and F-2-3 are unlisted live-page claims; their assertions are not included in this pass table.

## Earlier-finding verification

Every `review-1.md` finding was checked against both the live app and the present source/tests. No earlier id is reopened.

| Earlier id | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | Mobile demo result/reason ends at 554 px; mobile regression test passes. | Fixed |
| F-1-2 | Unknown live URL returns HTTP 404 with header, footer, legal links, metadata, favicon, and one h1. | Fixed |
| F-1-3 | All six routes update title, description, canonical, OG, and Twitter fields; live route test passes. | Fixed |
| F-1-4 | `set-note-retention` is registered and passes after reload. | Fixed |
| F-1-5 | Price says CSV/encrypted backups are free; `free-backup-tools` passes. | Fixed |
| F-1-6 | Old “control the answer” heading is absent. | Fixed |
| F-1-7 | “Free for three exercises” replaces “Free core.” | Fixed |
| F-1-8 | Decorative numbered section labels are absent. | Fixed |
| F-1-9 | README no longer uses “deterministic.” | Fixed |
| F-1-10 | README gives the browser-storage boundary before `(IndexedDB)`. | Fixed |
| F-1-11 | README says the build writes `dist/`. | Fixed |
| F-1-12 | Generated copy audit matches the rendered landing and README test. | Fixed |
| F-1-13 | Design token and CSS both use `#657276`. | Fixed |

`polish-1.md` and the prior handoff make no additional unresolved findings. Their claimed demo, routing, and claim-test repairs were independently reproduced above.

## Structure, accessibility, and delivery

- Live `/`, `/log`, `/demo`, `/backup`, `/privacy`, and `/terms` have route-specific titles, descriptions, canonical URLs, Open Graph/Twitter fields, favicon, one h1, and a main landmark. The 404 is a real HTTP 404 with the branded skeleton.
- Fresh live Playwright checks passed: 15/15 for first-screen geometry, demo behavior, metadata, back/focus behavior, all relevant recovery paths, touch targets, and axe serious/critical findings.
- Every discovered internal link returned 200; checkout returned its expected 303; the Param Factory external link returned 200; mailto links are explicit.
- The header/footer are consistent across application routes, include Privacy and Terms, and have a working skip link. Browser Back restores the route and moves focus to the h1.
- The service worker supports the declared offline flow. No network request other than same-origin product assets was seen in a cold demo session. License verification is the documented explicit Sociobot path, but its precise data-boundary wording remains F-2-2.
- The visual system follows the recorded load-constellation thesis: dark grid, plate geometry, chartreuse decisions, condensed display type, and original art. It is product-specific rather than a generic SaaS template.

## Missed leverage

No missing AI, import/export, or sync feature is found. The brief calls for a local, deterministic log with encrypted export; it already has CSV export, encrypted backup/import, and a non-AI rule that remains useful offline. Adding AI or sync would not be an implied core requirement and would weaken the privacy-first scope.

## What would make this perfect

Make the core landing language distinguish saved set details from decision-making rule chips, then register and test each remaining privacy and merchant statement or remove it. Re-run the clean-clone claim commands and live route suite after those changes. Only then would the site have no remaining finding.
