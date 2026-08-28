# Set Note Progression — independent verification handoff

## Outcome

**FAIL — candidate `956989ca7caf739eaef16e523bb51537584638b5` must not be released.**

Tested on 2026-08-28 UTC at <https://set-note-progression.sociobot.in>. The live HTML, application bundles, service worker, manifest, and public assets match the candidate, so the result is based on the current deployment.

The complete evidence and defect list is in [.factory/verification.md](./verification.md).

## Release blockers

- The cold 1440×900 first screen hides the audience sentence and “Try it with sample data” below the fold.
- The live $19 checkout endpoint returns HTTP 404: `{"error":"enabled factory product","status":404}`.
- A permitted 0.25 kg increase is displayed incorrectly: stored `60.25`, shown `60.3 kg`.
- A free-text `Grip slipped badly` set note can still produce an increase while the reason says no limiting note was logged.
- Demo license actions write shared real state, and demo edits remain after **Start for real**.
- Exercise templates cannot be edited or deleted, so mistakes can permanently consume the three free slots.

Additional defects include accepting 100 reps despite `max=99`, accepting whitespace-only exercise names, a close button that leaves its dialog open, sub-44 px touch targets, unlisted public claims, 30-second caching on hashed assets, a dead external footer link, and unknown routes returning HTTP 200.

## Verification performed

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

- All six exact claim commands passed after install.
- Full suite passed: 6 unit tests and 16 browser checks.
- TypeScript and production build passed; `dist/` was produced.
- Live offline reload and a controlled service-worker update passed.
- Live request logging found no cross-origin request during the demo workout flow.
- Axe found no WCAG A/AA violations on five routes at desktop and 390 px.
- Live Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, TBT 100 ms, CLS 0.
- Sociobot verify rate limiting allowed 30 requests in the observed burst; request 31 returned 429 with `Retry-After: 3`.

## Handoff state

Only verification documentation and evidence were added. Product code was not modified. Repair the blockers above, add regression and claim coverage, redeploy, and request a new independent verification.
