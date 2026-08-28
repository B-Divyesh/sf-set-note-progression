# Set Note Progression — adversarial review 1 handoff

## Outcome

**FAIL** at commit `61e0a04ed2da882144a3965b91b8bbeb6865a1d7`.

The independent report is [`review-1.md`](./review-1.md). Product code was not modified.

The blocking issue is the 390×844 demo first screen: the complete **“Increase to 62.5 kg”** result and reason are below the fold, so the one-click demo does not immediately show the product's main value on a phone.

Twelve non-blocking findings cover 404 structure/metadata, stale per-route social metadata, two unlisted claims, landing copy, README jargon, the incomplete prior copy audit, and a design-token mismatch.

## How this was verified

- Opened the live landing and demo cold in fresh Chromium contexts at 390×844 and 1440×900.
- Cloned the reviewed commit to a new temporary directory and ran `npm ci`.
- Ran every exact command in `.factory/claims.json`; all nine passed.
- Ran clean `npm test`: 10 unit/deployment tests and 32 Playwright tests passed, with 2 intentional project skips.
- Ran `npm run build`; `dist/` was produced with 11.50 KB gzip JS.
- Ran `npm audit --audit-level=high`; 0 vulnerabilities.
- Ran the full Playwright suite against the live URL: 32 passed, 2 intentional skips.
- Ran `/opt/fleet/lib/verify-url.sh`; it reported a 200 response, correct title/lang/main/alt/button basics, and no errors.
- Used the existing Playwright axe integration against live routes; no serious or critical violations were found.
- Crawled all shipped links and checked deep links, browser Back, route focus, 404 status, request/console errors, demo save/reset/exit, and real/demo storage separation.
- Confirmed the live HTML, JS, and CSS hashes match the clean build.

## Next steps

Fix F-1-1 first, then address every remaining finding. Add the recommended viewport, metadata, note-retention, free-feature, and generated-copy-audit tests before requesting the next full review.
