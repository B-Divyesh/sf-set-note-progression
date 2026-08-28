# Set Note Progression — review 2 handoff

## Outcome

**FAIL.** This was a read-only adversarial review. No product code or assets were changed.

The committed review is [`review-2.md`](./review-2.md). It records one blocking first-read honesty problem and two minor unregistered live-page claims:

- F-2-1: the landing says “notes” choose the next load although free-text set detail is saved only and does not affect the rule.
- F-2-2: the privacy page has an untested/unregistered statement about sending license tokens to Sociobot.
- F-2-3: the terms page has untested/unregistered merchant, receipt, and refund statements.

## Verification completed

- Fresh Chromium live checks at 390×844 and 1440×900: all required first-screen items fit; no console errors.
- Live demo check: one-click sample, persistent isolation banner, complete 62.5 kg result and reason above the 390 px fold, reset/exit flow, and same-origin cold request log.
- Clean clone: `npm ci` completed with 0 vulnerabilities; every one of the 11 commands in `.factory/claims.json` passed.
- Clean clone quality gate: `npm test`, `npm run build`, and `npm run copy:audit` completed successfully; build produced `dist/`.
- Live Playwright route/accessibility suite: 15 passed, including axe, 404, metadata, focus/back behavior, 44 px targets, offline, demo isolation, and checkout redirect.
- Live link crawl: all internal links returned 200, checkout returned the expected 303, and the external factory link returned 200.
- All findings F-1-1 through F-1-13 from review 1 remain fixed; details are in the review.

## Next steps

Implement the three concrete fixes in `review-2.md`, especially the distinction between saved set details and rule chips. Then rerun the clean-clone claim commands and the live review checklist. No deployment action was performed by this review.
