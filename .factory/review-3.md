# Adversarial first-read review 3 — Set Note Progression

Date: 2026-08-29 UTC
Reviewed repository commit: `451ed2ea96a511d720f4a95779210e3751c5d3a5`
Live URL: <https://set-note-progression.sociobot.in>
Method: new Chromium browser contexts at 390×844 and 1440×900; a clean local clone; direct route, link, request, metadata, storage, and claim checks.

## Verdict

**PASS.** No blocking or minor finding was reproduced. The cold landing explains the job, audience, and first action; the sample is isolated and useful immediately; all registered claims were run and passed; and the prior review findings remain fixed in both the deployed app and source.

## Cold first read

### 390×844, before scrolling

- **What it does:** log each workout set and receive the next-load decision.
- **For whom:** lifters who need to keep set details while using reps and rule chips for the decision.
- **First action:** choose **Try it with sample data** to see a finished workout and its next load.

The exact first-screen wording was **“Log each set. Know what changes next.”**, **“For lifters who want to save set details and use reps and rule chips to choose the next load.”**, and **“Try it with sample data” / “See a finished workout and its next load.”** The headline ended at 321 px, the audience sentence at 415 px, the sample action at 532 px, and all three plain facts at 711 px in the 844 px viewport. There were no console errors or cross-origin runtime requests.

### 1440×900, before scrolling

The same three answers are visible without scrolling. The action ends at 717 px and the three facts end at 894 px. The load-constellation art, plate geometry, dark grid, condensed type, and chartreuse decision colour match the documented visual thesis and are distinct from a generic SaaS layout.

## Copy audit

Counting rule: whitespace-separated words after collapsed spaces. The full rendered and README audit was regenerated in the clean clone with `npm run copy:audit`; it matched the checked-in [copy audit](./copy-audit.md). No content-bearing item exceeds 22 words, no banned marketing term appeared, headings name their sections, and actions name their outcomes.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Set Note Progression | 3 | Pass |
| Log / Demo / Backup / Privacy | 4 | Pass; route labels |
| Online | 1 | Pass |
| A local workout log with one visible rule | 8 | Pass |
| Log each set. | 3 | Pass |
| Know what changes next. | 4 | Pass |
| For lifters who want to save set details and use reps and rule chips to choose the next load. | 19 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| See a finished workout and its next load. | 8 | Pass |
| Start my workout log | 4 | Pass; result-naming action |
| Private. Your workout log stays in this browser. | 8 | Pass; `local-only` |
| Offline. Reopen it after your first visit. | 7 | Pass; `offline-reload` |
| Free for three exercises. Unlimited exercises cost $19 once. | 9 | Pass; `paid-unlimited` |
| Next session · increase / 62.5 kg | 6 | Pass; progression specimen |
| All 3 sets reached 12 reps. No limiting chip was selected. | 11 | Pass; `progression-rule` |
| Progression rule | 2 | Pass |
| How reps and rule chips choose the next load | 9 | Pass |
| A missed rep and a slipped grip should not lead to the same advice. | 14 | Pass |
| This log keeps both facts beside the set. | 8 | Pass; `set-note-retention` |
| Every set reaches the top / Increase the load | 8 | Pass; `progression-rule` |
| Sets stay inside the range / Add reps | 7 | Pass; `progression-rule` |
| A set falls short or has a limiting chip / Hold the load | 12 | Pass; `progression-rule` |
| One workout / How it works | 5 | Pass |
| Set the rep range | 4 | Pass |
| Add the exercise, working sets, load step, and rep range. | 10 | Pass |
| Note each set | 3 | Pass |
| Log reps and select a rule chip when grip or form limits a set. | 14 | Pass; `progression-rule` |
| Read the reason | 3 | Pass |
| See hold, add reps, or increase with the exact rule underneath. | 11 | Pass; `progression-rule` |
| Product limits / A log, not a coach | 7 | Pass |
| It does not create workouts, judge pain, or promise results. | 10 | Pass; scope boundary |
| Stop if a movement feels unsafe and seek qualified help. | 10 | Pass; safety instruction |
| Price / Keep three exercises free | 5 | Pass |
| CSV export and encrypted backups are free. | 7 | Pass; `free-backup-tools` |
| $19 once / Add unlimited exercise templates. | 7 | Pass; `paid-unlimited` |
| The license works across devices when you paste it again. | 10 | Pass; `license-restore` |
| Buy unlimited exercises / Restore a license | 6 | Pass; result-naming actions |
| Log set details and get the next-load rule. | 8 | Pass |
| Privacy / Terms / Built by Param Factory | 6 | Pass |
| opens in a new tab | 5 | Pass; external-link disclosure |
| v1.0.2 · Original generated artwork | 5 | Pass; provenance |
| Abstract weight plates and rep dots converge on one next-step marker. | 11 | Pass; image alternative |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Set Note Progression | 3 | Pass |
| Log why each set changed and know what to do next. | 11 | Pass |
| Set Note Progression is an offline workout log for recreational lifters using double progression. | 14 | Pass |
| It keeps each rule chip and detail beside its set. | 10 | Pass; `set-note-retention` |
| Its visible rule suggests holding the load, adding reps, or increasing the load next session. | 15 | Pass; `progression-rule` |
| Live site | 2 | Pass |
| Try the isolated sample at the `/demo` URL. | 8 | Pass |
| Demo changes and licenses use separate browser storage. | 8 | Pass; `demo-isolation` |
| They are discarded when you start for real. | 8 | Pass; `demo-isolation` |
| What it includes | 3 | Pass |
| Exercise templates with working sets, rep ranges, load steps, and kilograms or pounds. | 13 | Pass |
| Rule chips and saved-only detail text that stay with each set. | 11 | Pass; `set-note-retention` |
| A next-load result with the rule that produced it. | 9 | Pass; `progression-rule` |
| Browser storage (IndexedDB) that works offline after the first visit. | 10 | Pass; `offline-reload` |
| CSV export with every saved set. | 6 | Pass; `csv-export` |
| Password-encrypted JSON backup and import in the browser. | 8 | Pass; `encrypted-backup` |
| Three free exercise templates. A $19 one-time license adds unlimited templates. | 11 | Pass; `paid-unlimited` |
| The Grip slipped and Form broke chips hold the load. | 10 | Pass; `progression-rule` |
| Saved-only detail text stays with its original set but does not change the rule. | 14 | Pass; `set-note-retention` |
| The app does not create programs or provide medical advice. | 10 | Pass; scope boundary |
| Check every suggestion against how you feel and the equipment available. | 11 | Pass; safety instruction |
| Run locally / Requires Node.js 22 or newer. | 7 | Pass |
| Open the local URL. The demo is at the local `/demo` URL. | 10 | Pass |
| Test and build | 3 | Pass |
| npm test runs unit and Playwright tests. | 7 | Pass |
| The exact production build command is npm run build. | 9 | Pass |
| The build writes static files to dist/, including dist/index.html. | 9 | Pass |
| To inspect the production build: | 5 | Pass |
| Privacy and data | 3 | Pass |
| Workout data stays in this browser's storage on the current device. | 11 | Pass; `local-only` |
| No analytics, third-party scripts, or remote fonts run. | 8 | Pass; `local-only` |
| License verification sends the pasted license token only to Sociobot. | 10 | Pass; `license-verification-boundary` |
| Paste the license on another device to restore access. | 9 | Pass; `license-restore` |
| Read /privacy and /terms in the app. | 7 | Pass |
| The encrypted backup uses AES-GCM with a key derived from your password. | 12 | Pass; `encrypted-backup` |
| The password is never stored. | 5 | Pass; `encrypted-backup` |
| There is no password recovery. | 5 | Pass; limitation |
| Deployment | 1 | Pass |
| Deploy the contents of dist/ as a static site. | 9 | Pass |
| The staticwebapp.config.json file rewrites only known app routes. | 8 | Pass |
| It gives unknown paths a real 404 and sets security and cache headers. | 13 | Pass |
| The factory handles DNS, hosting, and product registration. | 8 | Pass |
| License / MIT / See LICENSE. | 5 | Pass |

Terminology is consistent: **exercise**, **set**, **rep range**, **set detail**, **rule chip**, **next load**, **demo**, **backup**, and **license**. The complete audit also includes accessible labels and image text; no flag was generated.

## Demo and sandbox

The hero action takes one click to `/demo`. The first screen already contains realistic Barbell bench press sample data, a completed Aug 27 workout, **“Increase to 62.5 kg”**, and the reason. At 390 px the complete result and reason are visible before the exercise controls.

The persistent banner says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and **Start for real**. Reset returned the seeded one-workout view and confirmation message. The demo used `demo:set-note-progression`; Start for real navigated to `/log`, removed the banner, and showed the empty real log. The real database was separately named `set-note-progression`. The demo-isolation claim test also saved sample data and a fixture license, then confirmed neither entered real storage and that revisiting demo reseeded the sample.

A fresh live demo request log contained only the product origin. After service-worker control, the declared offline claim reloads the demo while offline.

## Claims gate

From a fresh clone at `/tmp/set-note-progression-review3.7HIv9W`, `npm ci` completed with zero vulnerabilities. Every exact command in `.factory/claims.json` passed. Each run included 11 Vitest tests and its selected Playwright check on desktop and mobile (the checkout test intentionally skips one browser project because it is a direct HTTP probe).

| Claim id | Result | Observable outcome |
| --- | --- | --- |
| `offline-reload` | Pass | Controlled demo reload works offline after its first visit. |
| `local-only` | Pass | Demo save produced no cross-origin request. |
| `progression-rule` | Pass | Saved-only detail does not alter an increase; a limiting chip holds. |
| `csv-export` | Pass | Export has its header and one row per saved set. |
| `encrypted-backup` | Pass | AES-GCM file hides sample text and imports with its password. |
| `set-note-retention` | Pass | Three distinct chips/details remain on their original sets after reload. |
| `free-backup-tools` | Pass | Unlicensed demo exports both populated CSV and encrypted backup. |
| `paid-unlimited` | Pass | Verified fixture license permits the fourth exercise. |
| `demo-isolation` | Pass | Demo edits/license stay separate and are discarded on exit. |
| `license-restore` | Pass | Fixture license survives reload in a fresh browser store. |
| `license-verification-boundary` | Pass | Only the pasted token reaches Sociobot; no workout data is sent. |
| `checkout-redirect` | Pass | The live buy endpoint returned 303 to Dodo checkout. |

The landing and README claims map to these entries. No unlisted claim-like visitor promise was found.

## Earlier-finding confirmation

Every finding in the earlier reviews was checked again on the live deployment and in the current source/tests.

| Earlier id | Confirmation | Status |
| --- | --- | --- |
| F-1-1 | Mobile demo displays the full next-load result and reason before exercise controls. | Fixed |
| F-1-2 | Unknown live route returns HTTP 404 with header, footer, legal links, metadata, favicon, and one h1. | Fixed |
| F-1-3 | Home, log, demo, backup, privacy, and terms all have route-specific title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-4 | Registered `set-note-retention` assertion passes after reload. | Fixed |
| F-1-5 | Landing says CSV/encrypted backups are free; the no-license claim passes. | Fixed |
| F-1-6 | Result-naming progression heading is present; the old vague heading is absent. | Fixed |
| F-1-7 | The first-screen price fact is “Free for three exercises.” | Fixed |
| F-1-8 | Section labels are plain and contain no decorative numeric prefixes. | Fixed |
| F-1-9 | README no longer uses “deterministic.” | Fixed |
| F-1-10 | README gives the browser-storage boundary before the IndexedDB detail. | Fixed |
| F-1-11 | README says the build writes static files to `dist/`. | Fixed |
| F-1-12 | Generated audit matches rendered landing and README. | Fixed |
| F-1-13 | Design token and CSS both use `#657276`. | Fixed |
| F-2-1 | Landing precisely separates saved set details from reps and rule chips. | Fixed |
| F-2-2 | Privacy/README license boundary is registered and request-log tested. | Fixed |
| F-2-3 | Terms limits checkout language to the observable hosted Dodo action. | Fixed |

No earlier finding is reopened. The two polish reports and prior handoff introduce no additional unresolved finding.

## Structure, routing, and delivery

All inspected application routes have one h1, `lang="en"`, a `main` landmark, consistent header/footer, Privacy/Terms links, favicon, metadata, and correct canonical/OG URLs. The titles follow the product-and-purpose pattern. The branded unknown-route page returned real HTTP 404.

Navigation to Backup moved focus to its h1. Browser Back returned to the home route and moved focus to the home h1. All crawled same-origin links returned 200 except the deliberate unknown-route skip link, which preserved the enclosing 404 status; mailto links were explicit; the live checkout returned its expected 303; and the external Param Factory link returned 200.

`npm run build` passed and produced `dist/`; its initial JavaScript was 11.81 KB gzip and CSS 4.84 KB gzip. The request log, self-hosted assets, and declared local-only test confirm no analytics, remote font, or third-party runtime request. No missing AI, import/export, or sync leverage is found: CSV plus encrypted backup/import provide the implied data portability, and an AI step would weaken the documented offline deterministic rule.

## What would make this perfect

Maintain this level of verification on each release: rerun the cold mobile/desktop first-read check, all registered claim commands, and the live checkout redirect after any billing or routing change. There is no concrete product change to request in this round.
