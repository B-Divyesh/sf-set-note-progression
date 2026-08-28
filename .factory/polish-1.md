# Perfection-loop polish 1

Date: 2026-08-28 UTC  
Reviewed release: `61e0a04ed2da882144a3965b91b8bbeb6865a1d7`  
Review report: `65bd9344a2c54112603f4aa0b6c0a76a71ec2edc`  
Repair commit deployed for verification: `dade11c`  
Live URL: <https://set-note-progression.sociobot.in>

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files existed. Every finding in `review-1.md` is mapped below.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Moved the complete saved next-load result above exercise management. Added a compact phone layout. The landing action now uses `/?demo=1`, normalizes to `/demo`, and opens the isolated sample in one click. | Playwright: `390px demo first screen shows the complete next-load result and reason`. Live result bottom: 554.39 px in an 844 px viewport. Screenshot: [`polish-1-evidence/live-demo-390.png`](./polish-1-evidence/live-demo-390.png). Data: [`live-findings.json`](./polish-1-evidence/live-findings.json). |
| F-1-2 | Rebuilt `public/404.html` with the product header, navigation, footer, Privacy and Terms links, favicon, canonical, description, Open Graph, Twitter metadata, skip link, and load-constellation styling. | Vitest: `ships a branded 404 with full metadata, navigation, and legal links`. Live `/polish-1-definitely-missing` returned HTTP 404 with one h1 and the full skeleton. Screenshot: [`polish-1-evidence/live-404-390.png`](./polish-1-evidence/live-404-390.png). |
| F-1-3 | Added one route metadata map that updates title, description, canonical, Open Graph title/description/URL, and Twitter title/description on every route. | Playwright: `every application route updates its full metadata set`. The same assertions passed against all six live routes; values are recorded in [`live-findings.json`](./polish-1-evidence/live-findings.json). |
| F-1-4 | Registered `set-note-retention`. Its test saves three distinct chip/detail pairs, reloads, opens history, and checks each pair against its original set. README wording now matches this behavior. | Playwright: `@claim:set-note-retention keeps each chip and detail with its original set after reload`; passed in both browser projects from the clean clone and live. |
| F-1-5 | Replaced the vague promise with “CSV export and encrypted backups are free.” Registered `free-backup-tools`; its no-license test downloads and inspects both files. | Playwright: `@claim:free-backup-tools exports CSV and encrypted backup without a license`; passed in both browser projects from the clean clone and live. |
| F-1-6 | Rewrote the heading to “How set notes choose the next load.” | Generated copy audit and live landing check (`oldLandingCopyMatches: 0`) in [`live-findings.json`](./polish-1-evidence/live-findings.json). |
| F-1-7 | Replaced “Free core” with “Free for three exercises.” | `cold desktop and 390px first screens show the audience, action, and three facts`; live landing screenshot from the verifier. |
| F-1-8 | Replaced decorative numbered labels with “Progression rule”, “One workout”, “Product limits”, and “Price”. | Generated [`copy-audit.md`](./copy-audit.md); old-copy live query returned zero matches. |
| F-1-9 | Replaced “deterministic” with “A next-load result with the rule that produced it.” | README audit in [`copy-audit.md`](./copy-audit.md), 9 words and no flag. |
| F-1-10 | Defined IndexedDB as browser storage, then used the plain storage boundary in the privacy section. | README audit in [`copy-audit.md`](./copy-audit.md), 10 and 11 words with no flags. |
| F-1-11 | Replaced “lands” with “The build writes static files to `dist/`, including `dist/index.html`.” | README audit in [`copy-audit.md`](./copy-audit.md), 9 words and no flag; clean `npm run build` produced `dist/index.html`. |
| F-1-12 | Replaced the manual audit with a browser-generated landing and README audit. It includes controls, accessible labels, image alternatives, provenance, prices, headings, and a terminology table. CI fails on drift, banned words, or a sentence over 22 words. | `npm run copy:audit`; Playwright: `checked-in copy audit matches rendered landing copy and README`; [`copy-audit.md`](./copy-audit.md). |
| F-1-13 | Updated the design source of truth to the shipped `--line: #657276` and recorded its 3.6:1 surface contrast. | `.factory/design.md` matches `src/styles.css`; Lighthouse accessibility 100 and axe found no serious or critical issue. |

## Final verification

- Clean clone of `dade11c`: all 11 commands in `.factory/claims.json` passed individually.
- Clean clone full suite: 11 unit/deployment tests and 44 Playwright tests passed; 4 deliberate cross-project skips.
- Clean clone build and audit: `dist/index.html` produced; `npm audit --audit-level=high` found 0 vulnerabilities.
- Live full Playwright suite: 44 passed, 4 deliberate cross-project skips.
- Live factory verifier: HTTP 200, zero application console errors, one h1, `lang="en"`, main landmark, no missing alt text, and no unlabeled buttons.
- Live Lighthouse mobile: performance 94, accessibility 100, best practices 100, SEO 100; LCP 1.07 s, CLS 0, TBT 0 ms.

All 13 findings are resolved. No severity is deferred.
