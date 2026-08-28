# Demo sandbox

- URL: `https://set-note-progression.sociobot.in/demo` (local: `http://localhost:5173/demo`).
- Direct query entry: `/?demo=1` also selects the demo namespace.
- Sample data: three exercise templates and two completed workouts. Bench press reaches the top of its range. Chest-supported row includes a grip note that holds the load.
- Storage: IndexedDB database `demo:set-note-progression` and `demo:`-prefixed license keys. The demo never opens the real `set-note-progression` database or real license keys.
- Reset: choose **Reset demo** in the persistent banner. This recreates the demo database and clears its license keys.
- Leave: choose **Start for real**. Demo edits and license keys are discarded, then the real log opens.
- Offline check: visit `/demo` once, wait for the page to load, disconnect, and reload the same URL.
