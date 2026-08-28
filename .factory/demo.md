# Demo sandbox

- URL: `https://set-note-progression.sociobot.in/demo` (local: `http://localhost:5173/demo`).
- Direct query entry: `/?demo=1` also selects the demo namespace.
- Sample data: three exercise templates and two completed workouts. Bench press reaches the top of its range. Chest-supported row includes a grip note that holds the load.
- Storage: IndexedDB database `demo:set-note-progression`. It never opens the real `set-note-progression` database.
- Reset: choose **Reset demo** in the persistent banner. This deletes and recreates only the demo database.
- Leave: choose **Start for real**. Demo edits are not copied.
- Offline check: visit `/demo` once, wait for the page to load, disconnect, and reload the same URL.
