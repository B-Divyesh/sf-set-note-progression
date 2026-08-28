# Set Note Progression

Log why each set changed and know what to do next.

Set Note Progression is an offline workout log for recreational lifters using double progression. It keeps a note beside every set. Its visible rule suggests holding the load, adding reps, or increasing the load next session.

Live site: <https://set-note-progression.sociobot.in>

Try the isolated sample at <https://set-note-progression.sociobot.in/demo>. Demo changes and licenses use separate browser storage. They are discarded when you start for real.

## What it includes

- Exercise templates with working sets, rep ranges, load steps, and kilograms or pounds.
- Per-set rule chips plus saved-only detail text.
- A deterministic next-load result with its reason.
- Local IndexedDB storage that works offline after the first visit.
- CSV export with every saved set.
- Password-encrypted JSON backup and import in the browser.
- Three free exercise templates. A $19 one-time license adds unlimited templates.

The **Grip slipped** and **Form broke** chips hold the load. Saved-only detail text stays beside the set but does not change the rule.

The app does not create programs or provide medical advice. Check every suggestion against how you feel and the equipment available.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open <http://localhost:5173>. The demo is at <http://localhost:5173/demo>.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit and Playwright tests. The exact production build command is `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

To inspect the production build:

```sh
npm run preview
```

## Privacy and data

Workout data stays in IndexedDB on the current device. No analytics, third-party scripts, or remote fonts run. License purchase and verification use the Sociobot billing API. Paste the license on another device to restore access. Read `/privacy` and `/terms` in the app.

The encrypted backup uses AES-GCM with a key derived from your password. The password is never stored. There is no password recovery.

## Deployment

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` rewrites only known app routes, gives unknown paths a real 404, and sets security and cache headers. The factory handles DNS, hosting, and product registration.

## License

MIT. See [LICENSE](./LICENSE).
