# Set Note Progression — independent verification 2 handoff

## Outcome

**PASS — candidate `b8d29e9fe867afeca6a7bfaf61141994c798712d` is accepted for release.**

Independent verification was completed on 2026-08-28 UTC against
<https://set-note-progression.sociobot.in>. The full report is
[`verification-2.md`](./verification-2.md).

- All nine required claims passed from the demo entry point after a clean
  `npm ci`.
- Local `npm test`, strict TypeScript, production build, audit, full live
  Playwright suite, factory URL verification, and axe serious/critical scan
  passed.
- The live HTML, JS, and CSS hash-match the candidate build.
- Offline reload, controlled service-worker update, privacy request logging,
  response headers, mobile 390 px, keyboard paths, paid checkout redirect, and
  the verify-endpoint rate limit were independently checked.
- Fresh observed verify allowance: 30 requests; request 31 returned 429 with
  `Retry-After: 2`.

No known release-blocking gaps remain.

## Builder repair history

- Repaired candidate: `956989ca7caf739eaef16e523bb51537584638b5`
- Repair implementation: `9c15782855db1182071ee7f0561704c2a5095fa0`
- Live URL: <https://set-note-progression.sociobot.in>
- Azure Static Web Apps deployment: `c2ab69e9-6d58-4f39-b0bd-a31a91620837`
- Verified: 2026-08-28 UTC
- Artifact class remains `pwa-offline`; output remains `dist/` with `dist/index.html` at its root.

## Repairs

| Verifier finding | Root-cause repair and regression evidence |
| --- | --- |
| Desktop first screen hid the audience, action, and facts | Reduced and reflowed the desktop display type and spacing without changing the visual thesis. A browser test measures all required elements inside both 1440×900 and 390×844 viewports. |
| Checkout returned 404 | The controller-provided Dodo Live mapping is active. The exact Sociobot endpoint now returns `303` to `https://checkout.dodopayments.com/session/...`. `@claim:checkout-redirect` checks the live mapping without completing or charging a purchase. |
| `60.25` displayed as `60.3` | Load formatting now preserves up to two decimal places. Unit and browser tests assert `60.25 kg` after save and reload. |
| Free text could be described as “no limiting note” | The rule now names its inputs precisely: **Grip slipped** and **Form broke** are limiting rule chips. Free text is labeled **Set detail — saved only; does not change the rule**. Result copy says “no limiting chip selected.” The verifier's exact `Grip slipped badly` reproduction is covered. |
| Demo state and licenses leaked or persisted | Demo licenses use `demo:` keys; real keys are never read or written in demo. Reset and exit clear the demo database and license keys. A fresh demo session reseeds cleanly. `/?demo=1` normalizes to `/demo`. Writes now await IndexedDB transaction completion. `@claim:demo-isolation` checks session counts and both namespaces. |
| Exercises could not be repaired | Added edit and confirmed delete actions. Delete removes the exercise and its sessions. Whitespace-only names are rejected. Browser coverage creates, rejects, closes, edits, and deletes. |
| Reps above 99 saved | Submission now checks native range validity before reading values and announces a 1–99 correction. A 100-rep regression proves no session is saved. |
| Dialog close button did not close | The close control is now `type="button"` with an explicit `dialog.close()` action. Keyboard Enter coverage verifies it. |
| Claims registry omitted demo isolation and license restore | Added `demo-isolation`, `license-restore`, and `checkout-redirect` claims, each with one tagged browser test. Updated rule terminology and documentation. |
| Touch targets were below 44 px | Wordmark, header links, demo links, legal links, form-error links, and footer links now meet the 44 px baseline. A 390 px geometry test covers landing links and buttons. |
| Hashed assets cached for 30 seconds | `/assets/*` now returns `Cache-Control: public, max-age=31536000, immutable`; verified live. |
| Footer destination was dead | “Built by Param Factory” now links to `https://hello-factory.sociobot.in/`, which returned 200 during verification. |
| Unknown routes returned 200 | Deployment rewrites only known SPA routes. An unknown live path now returns HTTP 404 with the designed recovery page. |

## Verification evidence

Clean local gates:

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
npx tsc --noEmit
```

- Clean install: 57 packages; 0 vulnerabilities.
- Unit/deployment: 10 passed.
- Playwright: 32 passed across desktop Chromium and 390 px mobile; 2 intentional duplicate-project skips.
- Build: JS 35.02 KB raw / 11.50 KB gzip; CSS 18.73 KB raw / 4.69 KB gzip; all budgets pass.
- Every exact command in `.factory/claims.json` passed. This includes nine registered claims and the live Dodo redirect.
- No separate lint tool is configured; strict TypeScript compilation passed through both `npx tsc --noEmit` and `npm run build`.
- Package/consumer testing is not applicable to this static PWA.

Production checks:

```sh
PLAYWRIGHT_BASE_URL=https://set-note-progression.sociobot.in npx playwright test
/opt/fleet/lib/verify-url.sh https://set-note-progression.sociobot.in .factory/repair-evidence
```

- Production Playwright: 32 passed, 2 intentional skips. This exercised the product flows, keyboard paths, 390 px layout, privacy request log, live offline reload, and axe on `/`, `/demo`, `/backup`, `/privacy`, and `/terms`.
- Factory URL verifier: no console or page errors; title, `lang=en`, one `h1`, main landmark, alt text, and button labels pass. See [verify.json](./repair-evidence/verify.json), [desktop](./repair-evidence/screenshot-desktop.png), and [mobile](./repair-evidence/screenshot-mobile.png).
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. See [report](./repair-evidence/lighthouse-live-mobile.json).
- Live HTML, JS, and CSS SHA-256 hashes match `dist/` byte for byte.
- Live `/`, `/demo`, and `/privacy` return 200. `/definitely-missing-repair-check` returns 404 and the designed page.
- The live invalid-license response is `valid:false`, `reason:"invalid"`, `Cache-Control: no-store`, with CORS for the product origin.
- The live service worker reports `snp-shell-v3`; the manifest starts at `/log?v=2`. Offline reload passes. A controlled local version replacement displayed the update action, activated on **Use it now**, reloaded, and removed the old shell cache.
- The first post-upload smoke briefly received old cached HTML while deployment propagated. A repeat after propagation passed with zero errors; all recorded repair evidence is from the coherent deployment.

## Known gaps and next steps

No known release-blocking gaps remain. A paid transaction was not completed because that would create a real charge; the approved live mapping, hosted-checkout redirect, license verification policy, and mocked valid restore path were verified instead.
