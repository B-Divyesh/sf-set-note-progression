# Independent product verification 2 — PASS

Verified 2026-08-28 UTC from clean checkout commit `b8d29e9fe867afeca6a7bfaf61141994c798712d`.

- Live URL: <https://set-note-progression.sociobot.in>
- Product type: offline PWA
- Tooling: Node 22.23.2, npm 10.9.8, Playwright 1.58.2 / Chromium

## Release decision

**PASS — release candidate accepted.** No release-blocking defect was reproduced.

The deployment is the tested candidate, not a stale version. SHA-256 matched for
`index.html` (`e9cf…e4f2b8`), `assets/index-CKOVe4Vg.js`
(`6b7d…d98f9`), and `assets/index-DhWAYrFt.css` (`93b1…c770`).

## First-read gate

A cold 390×844 live load answers all three questions in plain words without
scrolling (the lowest required item ended at y=710.7):

- **What:** “Log each set. Know what changes next.”
- **For whom:** lifters who forget why a set changed and want the next load
  decided from their notes.
- **First action:** **Try it with sample data**, with the adjacent result:
  “See a finished workout and its next load.”

The same screen exposes the three required facts: private browser storage,
offline reopening after the first visit, and three free exercises / $19 once.
The desktop and mobile visual check showed the action and facts in the initial
viewport. The sample action opens the isolated `/demo` workspace.

## Mandatory claim gate

`.factory/claims.json` exists with nine claims. After `npm ci`, I ran every
listed command exactly from the demo-backed local test entry point. Every run
passed; the final Playwright result recorded `status: passed` and no failed
tests.

| Claim | Exact test | Result |
| --- | --- | --- |
| offline reload | `npm test -- --grep @claim:offline-reload` | PASS |
| local-only data | `npm test -- --grep @claim:local-only` | PASS |
| progression rule | `npm test -- --grep @claim:progression-rule` | PASS |
| CSV export | `npm test -- --grep @claim:csv-export` | PASS |
| encrypted backup | `npm test -- --grep @claim:encrypted-backup` | PASS |
| $19 unlimited license | `npm test -- --grep @claim:paid-unlimited` | PASS |
| demo isolation | `npm test -- --grep @claim:demo-isolation` | PASS |
| license restore | `npm test -- --grep @claim:license-restore` | PASS |
| hosted checkout redirect | `npm test -- --grep @claim:checkout-redirect` | PASS |

The live checkout probe independently returned `303 See Other` to a
`https://checkout.dodopayments.com/session/...` URL.

## Local and live QA

- `npm ci`: PASS — 57 packages installed; audit reported 0 vulnerabilities.
- `npm test`: PASS — unit tests and the complete desktop/mobile Playwright
  suite.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Full live suite: `PLAYWRIGHT_BASE_URL=https://set-note-progression.sociobot.in npx playwright test` — PASS.
- Factory URL verifier: PASS. It found title, `lang=en`, one h1, `main`, image
  alt text, labelled buttons, and no console errors. Evidence is in
  `/tmp/snp-verify-url/verify.json` for this verification session.
- Axe integration in the suite found no serious or critical issues on `/`,
  `/demo`, `/backup`, `/privacy`, and `/terms`.

The live and local suites exercise the seeded demo, deterministic hold/add
reps/increase suggestions, 0.25 load precision, whitespace and range
validation/recovery, edit/delete exercise recovery, CSV and encrypted backup
round-trip, free-template limit, mocked license restore, demo discard, keyboard
dialog use, 390 px target geometry, and visible focus paths.

## Privacy, delivery, PWA, and performance

- A cold live request log contained only
  `https://set-note-progression.sociobot.in`; the full live `local-only` claim
  also passed while saving a demo workout. There are no analytics, remote fonts,
  or third-party runtime requests. License verification is the documented
  explicit exception and only uses `https://api.sociobot.in`.
- The document responds with CSP (self-only scripts/styles and narrowly allowed
  Sociobot connection), HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and a restrictive permissions policy. Hashed JS/CSS are
  `max-age=31536000, immutable`; unknown routes return real HTTP 404.
- Verify-endpoint allowance was freshly probed with invalid tokens: 30 requests
  succeeded, request 31 returned **429** with `Retry-After: 2` and
  `X-RateLimit-After: 2`. There is no sign-in flow, so Entra tenant validation
  is not applicable.
- The live offline-reload claim passed after service-worker control. A controlled
  local static-server update showed “An update is ready. Use it now”; the update
  action was invoked and the new versioned shell installed. Manifest metadata,
  standalone display, versioned start URL, 192/512/maskable icons, and matching
  palette colours are present.
- Production build: JS 35.02 KB raw / 11.50 KB gzip; CSS 18.73 KB raw / 4.69
  KB gzip; responsive hero image 65.9 KB. These are within the static PWA
  budgets.

## Defects by severity

No blocker, high, medium, or low defects were reproduced in this candidate.

An initial live-browser navigation timed out during a transient host response
failure. Two subsequent fresh cold contexts loaded in 0.12 s and 1.54 s, and
the complete live Playwright suite passed. It is not reproducible and is not
recorded as a product defect.
