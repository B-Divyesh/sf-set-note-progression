# Set Note Progression — build handoff

## Shipped

- A Vite and TypeScript offline PWA with a 31.5 KB production JavaScript bundle (10.6 KB gzip) and 18.0 KB CSS bundle (4.6 KB gzip).
- Exercise templates for sets, rep ranges, load steps, and kilograms or pounds.
- A one-hand set logger with per-set chips, free-text notes, large controls, validation, and visible save feedback.
- A deterministic double-progression rule with three results: hold, add reps, or increase. Every result shows its reason.
- Local workout history in IndexedDB, including a useful empty state and confirmed deletion.
- CSV export plus AES-GCM encrypted JSON backup and import. Password keys use PBKDF2 with 210,000 SHA-256 iterations.
- An isolated `/demo` database with three exercises, two workouts, reset, direct entry, and a persistent demo banner.
- Offline app-shell and route reloads through a versioned service worker. The app reports offline state and available updates.
- A $19 one-time license path through the Sociobot checkout and verify endpoints. The free log supports three exercises; a verified license removes that limit.
- `/privacy`, `/terms`, runtime 404, static 404, manifest, install icons, robots, sitemap, metadata, CSP, and security headers.
- Original generated “load constellation” art, responsive WebP derivatives, a 1200×630 social image, and documented provenance.

## Verify

```sh
npm install
npm test
npm run build
```

Results on 2026-08-28:

- `npm test`: 6 unit tests and 16 browser checks passed across desktop and 390 px mobile projects.
- Claim commands in `.factory/claims.json`: verified, including exact `npm test -- --grep …` forwarding.
- `npm run build`: passed. `dist/index.html` exists at the deploy root.
- Production bundle: JS 31.5 KB / 10.6 KB gzip; CSS 18.0 KB / 4.6 KB gzip; mobile hero 19.5 KB WebP.
- Lighthouse 12.8.2, mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.5 s, CLS 0, total blocking time 0 ms.
- Lighthouse 12.8.2, desktop: all four categories 100. LCP 0.4 s, CLS 0, total blocking time 0 ms.
- Playwright axe scan: no serious or critical findings on `/`, `/demo`, `/backup`, `/privacy`, or `/terms`.
- Factory `verify-url.sh`: passed with no console errors, one `h1`, `lang=en`, a main landmark, alt text, and labeled buttons. Report: `.factory/evidence/verify.json`.
- Offline: `/demo` reloaded with its sample data after `context.setOffline(true)`.
- Visual evidence: `.factory/evidence/home-390.png` and `.factory/evidence/demo-390.png`.
- `npm audit`: 0 vulnerabilities.

## Deployment

- Build command: `npm run build`
- Static directory: `dist`
- Demo URL: `/demo`
- The factory must register the `set-note-progression` product at $19 before checkout goes live. The app uses the slug-based billing contract and contains no product ID or provider secret.

## Known gaps and next steps

- Browser storage can be cleared by the browser or user. The backup screen explains this and provides encrypted export.
- The license check needs the factory product registration above. Failed network checks keep the last cached verdict and never block the free log.
- No sync, generated workouts, wearables, social features, or medical guidance are included by design.
- Pilot success still needs measurement after 20 real sessions; this build has no analytics or tracking.
