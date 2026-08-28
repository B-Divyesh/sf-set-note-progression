# Independent product verification — FAIL

Verified on 2026-08-28 UTC.

- Candidate: `956989ca7caf739eaef16e523bb51537584638b5`
- Branch: `main`
- Live URL: <https://set-note-progression.sociobot.in>
- Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, Chromium 145
- Artifact class: offline PWA

## Decision

**FAIL — do not release this candidate.**

The live site is byte-for-byte consistent with the candidate for the HTML, JavaScript, CSS, service worker, manifest, icons, artwork, offline page, 404 page, robots file, and sitemap. This is not a stale-deployment result. The current deployment still has release-blocking product and billing defects.

## Release blockers and defects

### Blocker — desktop first screen fails the mandatory first-read gate

At a cold 1440×900 load, the headline starts at y=203 and is 839 px tall. The audience sentence begins at y=1066, the sample-data action begins at y=1162, and the three facts begin at y=1307. A visitor sees the label and a clipped headline, but cannot see who the product is for or what to click first without scrolling.

The same items are visible at 390×844, but the acceptance gate applies to the first screen and the desktop failure is decisive.

Evidence:

- [.factory/verification-evidence/first-read-desktop.png](./verification-evidence/first-read-desktop.png)
- [.factory/verification-evidence/first-read-mobile.png](./verification-evidence/first-read-mobile.png)

First-read answer from the cold desktop viewport:

- What it does: the visible headline says to log each set and know what changes next, although its last line is clipped.
- Who it is for: not visible; the lifter sentence is below the fold.
- What to click first: not visible; “Try it with sample data” is below the fold.

### Blocker — the advertised purchase flow is unavailable

`GET https://api.sociobot.in/api/v1/products/set-note-progression/checkout` returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The landing page advertises a $19 one-time purchase and links directly to this endpoint. A visitor cannot buy the product. This confirms the builder's previously noted registration dependency remains unresolved in the live environment.

### High — quarter-unit increases are displayed inaccurately

Reproduction: create a one-set exercise with a 0.25 kg increase, log 60 kg × 12 at the top of the range, and save.

- Stored next load: `60.25`
- Displayed next load: `INCREASE TO 60.3 KG`
- The incorrect value remains after reload.

The form explicitly allows 0.25 increments, so this is a core recommendation error, not unsupported input.

### High — a limiting free-text set note can produce an unsafe increase

Reproduction: create a one-set 8–12 exercise, log 60 kg × 12, type `Grip slipped badly` in **Set note**, and save without selecting a chip.

Observed result: `INCREASE TO 62.5 KG` with “no limiting note.” The app retained a plainly limiting per-set note but told the lifter none was logged. Only the predefined `Grip slipped` and `Form broke` chips affect the rule.

### High — demo mode is not isolated from real state and is not discarded

Two independent failures were reproduced:

- Restoring a mocked valid license while the demo banner was visible wrote `sb_license:set-note-progression` in the shared real `localStorage`. Opening real `/backup` then showed “Unlimited exercises are active.”
- A demo database started with 2 sessions, contained 3 after saving one, and still contained 3 after choosing **Start for real** and returning to `/demo`.

This contradicts the demo contract, the banner, and the README statement that demo changes never enter the real log. `/?demo=1` is also documented as a direct demo entry but renders the landing page with no demo banner or sample logger.

### High — exercise mistakes cannot be repaired

The UI has no way to edit or delete an exercise template. A whitespace-only name passes native validation, is trimmed to an empty name, and is saved as a blank option. Because templates count toward the three-exercise free limit and cannot be removed, an ordinary setup mistake can permanently consume a free slot unless the user clears all site data or manually repairs an exported file.

### Medium — invalid rep values bypass declared validation

The reps field declares `max="99"`, and the browser reports 100 as invalid. The custom submit handler does not call form validation and still saves 100 reps, then recommends an increase.

### Medium — the exercise dialog's close button does not close it

Clicking the visible × button labeled “Close exercise form” leaves the dialog open and moves focus to the required name field. Escape closes it. Pointer and keyboard users cannot rely on the labeled close control.

### Medium — published claims exceed the claims registry

All six listed claims have one tagged test definition, but public copy also claims that demo changes never enter the real log and that a license works across devices when pasted again. Neither outcome has a matching entry in `.factory/claims.json`; the demo-isolation claim is also false as described above.

### Medium — touch targets miss the required 44×44 px baseline

At 390 px, measured examples include the 158×38 wordmark, the 36×44 Log link, and footer links only 19 px tall. There is no horizontal overflow, but these controls do not meet the attached 44×44 target requirement.

### Medium — immutable assets are cached for only 30 seconds

The live HTML, hashed JavaScript, hashed CSS, service worker, manifest, and images all return `Cache-Control: public, must-revalidate, max-age=30`. Hashed assets should use long-lived immutable caching.

### Medium — external footer link is dead from the verification environment

`https://paramfactory.com/` could not resolve (`curl: (6) Could not resolve host`). All internal links returned 200 except the broken checkout endpoint. Unknown routes also return HTTP 200 while rendering the in-app not-found page, rather than returning a real 404 response.

## Claims gate

After `npm ci`, every exact command in `.factory/claims.json` passed. Each command ran 6 unit tests and the selected claim test on both configured browser projects.

| Claim | Exact command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 6 unit; 2 browser |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — 6 unit; 2 browser |
| `progression-rule` | `npm test -- --grep @claim:progression-rule` | PASS — 6 unit; 2 browser |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS — 6 unit; 2 browser |
| `encrypted-backup` | `npm test -- --grep @claim:encrypted-backup` | PASS — 6 unit; 2 browser |
| `paid-unlimited` | `npm test -- --grep @claim:paid-unlimited` | PASS — 6 unit; 2 browser, mocked valid license |

The first invocation from the dependency-free clone reported `vitest: not found`; `npm ci` completed successfully from the lockfile, after which every command above passed. This was an expected install prerequisite, not counted as a product failure.

## Clean-clone quality gates

- `npm ci`: PASS; 57 packages installed; 0 vulnerabilities.
- `npm test`: PASS; 6 unit tests and 16 Playwright checks.
- `npm run build`: PASS; includes `tsc --noEmit`; `dist/` produced.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- No separate lint script exists.
- Build output: JS 31.51 KB raw / 10.61 KB gzip; CSS 18.04 KB raw / 4.59 KB gzip; mobile hero 19.54 KB. All static bundle budgets pass.

## End-to-end and recovery evidence

Passing behavior:

- Seeded `/demo` opens without setup and shows realistic exercises and history.
- The declared increase, add-reps, and hold paths pass on desktop and mobile.
- Mismatched working loads show “Use one working load for this rule”; correcting the load saves successfully.
- A wrong encrypted-backup password shows a specific error; retrying with the right password imports successfully.
- CSV row count, encrypted backup round-trip, persistence across reload, free exercise limit, and mocked paid unlock pass.
- No console or page errors occurred in the normal live or local flows.

Failing boundary and recovery behavior is listed in the defects above: 0.25 display rounding, a 100-rep invalid value being accepted, whitespace-only exercise names, no exercise edit/delete recovery, and the nonfunctional dialog close control.

## Privacy, network, and headers

A fresh live demo context recorded the full initial load, workout save, service-worker check, offline switch, and reload. Every request was same-origin; no analytics, remote fonts, or third-party runtime requests appeared. The invalid-license path is the expected exception and contacted only `https://api.sociobot.in`.

The live document includes CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions Policy. The CSP allows only self-hosted scripts/styles/assets plus the Sociobot API connection and form target. No CSP or console errors appeared.

The verify endpoint returned correct CORS for the product origin and `Cache-Control: no-store`.

Rate-limit probe on the Sociobot verify endpoint:

- Observed allowance: 30 successful requests in one burst.
- Request 31 returned HTTP 429.
- `Retry-After: 3` and `X-RateLimit-After: 3` were present.

There is no sign-in flow, so the Entra tenant check is not applicable.

## Accessibility and responsive checks

- Factory `verify-url.sh`: PASS; title, `lang=en`, one h1, main landmark, alt text, labeled buttons, and no console errors. Evidence: [.factory/verification-evidence/verify-live/verify.json](./verification-evidence/verify-live/verify.json).
- Independent axe WCAG A/AA scan: no violations on `/`, `/demo`, `/backup`, `/privacy`, or `/terms` at 1440×900 and 390×844.
- Keyboard sequence starts with the skip link and reaches wordmark, navigation, and demo action in order; every sampled focus ring was a visible 3 px solid outline.
- Dialog Escape behavior and route focus work; the labeled close-button failure is recorded above.
- Reduced motion computes transitions to 0.01 ms and disables smooth scrolling.
- 390 px has no horizontal overflow. The undersized touch targets remain a baseline failure.

## PWA and performance

- Live service worker registered and controlled `/demo`.
- After saving a workout, an offline reload retained the demo banner, offline state, and saved add-reps suggestion.
- A controlled service-worker version change displayed “An update is ready,” activated after **Use it now**, reloaded, and removed the old versioned shell cache.
- Manifest name, standalone display, versioned start URL, colors, 192/512 icons, and 512 maskable icon are present with correct dimensions.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 100 ms, CLS 0. Evidence: [.factory/verification-evidence/lighthouse-live-mobile.json](./verification-evidence/lighthouse-live-mobile.json).
- The cache-header defect is documented above.

## Deployment identity

The live and local production bytes match for:

- `index.html`
- `assets/index-BWHfzWSm.js`
- `assets/index-DLDBDz8y.css`
- `sw.js`
- `manifest.webmanifest`
- responsive hero art, icons, social image, favicon, offline page, 404 page, robots, and sitemap

The deployed runtime is therefore the tested candidate, not an older build.

## Required next steps

1. Repair the desktop hero so audience, demo action, and three facts are in the initial viewport.
2. Register or enable the paid product and verify the live checkout redirects successfully.
3. Format quarter-unit loads exactly and add boundary coverage.
4. Make the recommendation copy and behavior honest for free-text notes, or clearly distinguish non-rule notes from limiting chips.
5. Fully isolate and discard demo state, including licenses; make `/?demo=1` enter the demo.
6. Add exercise edit/delete recovery and reject blank names and out-of-range reps.
7. Fix the dialog close button and all sub-44 px touch targets.
8. Add missing claim entries/tests, immutable asset caching, a real 404 response, and a working footer destination.
