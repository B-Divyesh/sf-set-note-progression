# Set Note Progression — polish 1 handoff

## Outcome

**PASS.** All findings F-1-1 through F-1-13 from `.factory/review-1.md` are resolved and verified on <https://set-note-progression.sociobot.in>. No earlier review or polish report exists, and nothing is deferred.

The repair preserves the `pwa-offline` artifact and the load-constellation visual system. The one-click `/?demo=1` action opens an isolated sample, keeps its persistent banner and reset/exit actions, and shows the complete 62.5 kg result above the fold at 390×844.

## What changed

- Put the saved next-load result before exercise management and added a compact phone presentation.
- Added complete route-specific metadata and a branded, navigable HTTP 404 page.
- Added the missing set-note retention and free-backup claims with outcome-level tests.
- Rewrote every flagged landing and README phrase in plain words.
- Made the landing/README copy audit reproducible and enforced it in Playwright.
- Matched `.factory/design.md` to the shipped border token.
- Added dialog focus return and verified the landing page at 200% text size.
- Updated the catalog line to “Log each set note and see what load changes next.”

The finding-by-finding record is [`polish-1.md`](./polish-1.md).

## Exact verification evidence

- Clean clone at `dade11c`: `npm ci` completed with 0 vulnerabilities.
- Every one of the 11 exact commands in `.factory/claims.json` passed from that clean clone.
- Clean clone `npm test`: 11 unit/deployment tests passed; 44 Playwright tests passed; 4 intentional cross-project skips.
- Clean clone `npm run build`: passed and produced `dist/index.html`.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Build budgets: JavaScript 36.53 KB raw / 11.85 KB gzip; CSS 19.33 KB raw / 4.84 KB gzip; mobile hero WebP 19.54 KB.
- Local Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.51 s, CLS 0, TBT 0 ms.
- Production deploy: `/opt/fleet/lib/deploy-static.sh set-note-progression dist` succeeded on Azure Static Web Apps.
- Live factory verifier: HTTP 200, no application console errors, correct title/lang/main, one h1, no missing alt text, and no unlabeled buttons.
- Live Playwright suite: 44 passed, 4 intentional cross-project skips. This includes axe, offline reload, request privacy, demo isolation, routing, focus, metadata, claims, and mobile geometry.
- Live Lighthouse mobile: 94 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.07 s, CLS 0, TBT 0 ms.
- Live unknown route: HTTP 404 with the full header/footer, legal links, route metadata, favicon, and one h1.
- Live mobile demo result bottom: 554.39 px in an 844 px viewport.

Evidence is in [`.factory/polish-1-evidence`](./polish-1-evidence), including live screenshots, route/404 metadata, verifier output, and Lighthouse JSON.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run copy:audit
```

To run a single registered claim, use its exact `test` command from `.factory/claims.json`. To inspect the production build, run `npm run preview`.

## Known gaps and next steps

None found within the brief or cumulative review. No follow-up repair is required.
