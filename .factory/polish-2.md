# Perfection-loop polish 2

Date: 2026-08-28 UTC  
Reviewed release: `a22e45f96867dfd880f84c8bfd07280ce41c4332`  
Review reports read: `review-1.md`, `review-2.md`, and `polish-1.md`  
Repair commits: `ffda5cd42b073bb8bdee5f360b6d2c81c630af0a` and `1ffc560` (reset-state test stability)  
Live URL: <https://set-note-progression.sociobot.in>

Every finding below is resolved. The live URLs and screenshots were rechecked after deployment; the screenshots are in `polish-2-evidence/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the completed demo result above exercise controls on a 390 px phone. The hero action still normalizes `/?demo=1` to isolated `/demo`. | `390px demo first screen shows the complete next-load result and reason`; [`live-demo-390.png`](./polish-2-evidence/live-demo-390.png); live `/demo`. |
| F-1-2 | Kept the branded real 404 with header, footer, legal links, title, canonical, social metadata, and favicon. | Vitest `ships a branded 404 with full metadata, navigation, and legal links`; [`live-404-390.png`](./polish-2-evidence/live-404-390.png); live `/polish-2-definitely-missing` returns 404. |
| F-1-3 | Kept the shared route metadata map and route-level metadata assertions. | `every application route updates its full metadata set`; live `/`, `/log`, `/demo`, `/backup`, `/privacy`, `/terms`. |
| F-1-4 | Kept `set-note-retention` and its reload/history assertion for three distinct chip/detail pairs. | `@claim:set-note-retention`; clean-clone claim run; live `/demo`. |
| F-1-5 | Kept the concrete free-tools wording and no-license CSV/encrypted-backup test. | `@claim:free-backup-tools`; clean-clone claim run; live `/`. |
| F-1-6 | Kept the result-naming heading, then made it exact: “How reps and rule chips choose the next load.” | `cold desktop and 390px first screens show the audience, action, and three facts`; [`live-home-390.png`](./polish-2-evidence/live-home-390.png); live `/`. |
| F-1-7 | Kept “Free for three exercises.” and the exact $19 once wording. | `cold desktop and 390px first screens show the audience, action, and three facts`; live `/`. |
| F-1-8 | Kept plain section labels without decorative numeric prefixes. | Generated `copy-audit.md`; live `/`. |
| F-1-9 | Kept the plain README sentence about the rule that produced the result. | Generated `copy-audit.md`; clean-clone `npm run copy:audit`. |
| F-1-10 | Kept the browser-storage explanation before the IndexedDB detail. | Generated `copy-audit.md`; live `/privacy`. |
| F-1-11 | Kept the direct README build wording. | Clean-clone `npm run build` created `dist/index.html`. |
| F-1-12 | Kept the generated, checked-in landing and README copy audit. | `checked-in copy audit matches rendered landing copy and README`; clean-clone `npm run copy:audit`. |
| F-1-13 | Kept documented and shipped `--line: #657276`. | `src/styles.css` and `design.md` match; accessibility suite passes. |
| F-2-1 | Replaced the broad “notes” wording with “set details” and “reps and rule chips” in the lead, landing heading, home metadata, and catalog line. Expanded `progression-rule` to prove a saved-only detail is retained yet still increases, while a limiting chip holds. | `@claim:progression-rule reps and limiting rule chips change the next-load decision while saved-only details do not`; [`live-home-390.png`](./polish-2-evidence/live-home-390.png); live `/`. |
| F-2-2 | Added `license-verification-boundary`. Privacy and README now state the precise tested boundary: the pasted token goes only to Sociobot. The fixture test asserts the exact Sociobot endpoint, a single `license` query parameter, GET, and no body/workout data. | `@claim:license-verification-boundary sends only the pasted license token to Sociobot`; clean-clone claim run; live `/privacy`. |
| F-2-3 | Reduced the terms language to the observable purchase statement: “The Buy action opens Sociobot’s hosted Dodo checkout.” Removed merchant, receipt, and refund assertions. | `@claim:checkout-redirect the $19 buy action reaches Dodo Live checkout` and `legal pages keep the tested license boundary and checkout wording`; live `/terms`. |

## Verification

- Final fresh local clone at `/tmp/set-note-progression-final.vaWuCm`: `npm ci` (0 vulnerabilities), all 12 commands in `claims.json`, `npm test`, `npm run build`, `npm run copy:audit`, and `npm audit --audit-level=high` all passed. The full suite ran 11 Vitest checks plus 52 Playwright checks (with the existing intentional project skips).
- Local source verification: `git diff --check`, full test suite, build, copy audit, and the one-test-per-claim registry check passed.
- Live verification: cold homepage, demo, privacy, terms, and real 404 were opened after deployment. The serial live suite passed all 52 Playwright checks; the accessibility subset also passed. The 390 px screenshots and the live verifier record are stored alongside this document.

No finding is deferred.
