# Visual thesis — load constellations

## Direction and rationale

Set Note Progression uses **generative geometry** built from the objects lifters already read: stacked plates, a bar, repeated rep marks, and a bright next-step indicator. The core motif is a field of nested octagons and ordered dots. It makes the deterministic rule visible without dressing the product like a spreadsheet or a generic fitness dashboard.

The interface is intentionally single-mode. A near-black blue room lowers glare in a gym. Warm paper text and electric chartreuse mark the next action. Coral is reserved for a hold decision or destructive action. Geometry is structural: cut corners mark actionable surfaces; circular rep dots show thresholds; fine grid lines make each workout feel measured.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#F7F1E3` | Primary text |
| `--muted` | `#B8B5AA` | Secondary text |
| `--night` | `#10171A` | Page background |
| `--deep` | `#172125` | Raised surface |
| `--plate` | `#223035` | Fields and inactive geometry |
| `--line` | `#657276` | Borders and control outlines; 3.6:1 against the deep surface |
| `--signal` | `#D9FF57` | Primary actions and increase state |
| `--signal-ink` | `#11170A` | Text on signal |
| `--sky` | `#74D7F2` | Add-reps state and focus |
| `--coral` | `#FF826E` | Hold, warning, destructive |
| `--good` | `#A8E6A3` | Saved and complete |

Contrast is checked against `--night` and `--deep`; body copy is never set in `--line`.

## Type

- Display: **Arial Narrow**, with `Impact` fallback. Condensed uppercase headings feel like labels stamped on plates and keep the phone layout compact.
- Body: **system-ui**, with platform sans-serif fallbacks. It stays legible while entering sets with one hand.
- Numeric fields use tabular figures. No web fonts are downloaded, so the app remains private and usable offline immediately.

## Spacing and shape

- 8 px base rhythm; main intervals are 8, 16, 24, 32, 48, 72, and 96 px.
- Content max-width is 1180 px. Reading text stays under 68 characters.
- Controls are at least 48 px high, with 12 px gaps on the logging screen.
- Action surfaces use 10 px chamfered corners via `clip-path`; quiet content groups use open layouts and hairlines instead of default cards.

## Interaction grammar

- A saved set fills one rep dot row from left to right.
- The next-session decision enters from the completed sets below, visually tying the result to its evidence.
- Buttons depress by 1 px. Fields gain a cyan double outline. Toasts report every save, import, export, or recoverable error.
- Route changes place focus on the page heading and announce its title.

## Motion policy

One signature motion, **plate lock**, scales completed rep dots from 0.8 to 1 over 180 ms and slides the suggestion marker 8 px into place over 240 ms. No element loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed; state changes use instant color and opacity only.

## Asset plan and provenance

- `public/art/load-constellation.webp`: original model-generated hero scene. Abstract top-down barbell plates become a precise constellation of set and rep marks. It explains the product's rule without showing an athlete or making a training claim.
- `public/og/set-note-progression.png`: composed locally from that scene and product typography at 1200×630.
- PWA and favicon assets are hand-authored geometric marks derived from a plate, a note corner, and three rep dots.

### Prompt sheet

Subject: an abstract top-down barbell made from nested octagons, three grouped plate stacks, and ordered rep dots moving toward one bright next marker. World: a dark architectural gym floor drawn as a precision grid. Materials: matte powder-coated steel, chalk dust, embossed rubber, translucent drafting film. Light: hard raking studio light with quiet shadows. Lens: orthographic top-down editorial still life. Palette words: midnight blue-black, warm bone, electric chartreuse, cyan, restrained coral. Composition: wide landscape, object mass on the right and open dark space on the left. Negative list: people, bodies, hands, text, letters, numbers, logos, brands, gradients, glossy fitness advertising, photoreal gym equipment clutter, medical imagery, watermark.

Generation command: `/opt/fleet/lib/gen-image.sh "<prompt sheet>" assets/src/load-constellation.png 1536x1024 high` using the factory image deployment on 2026-08-28. The selected output is original AI-generated imagery for this product. It is disclosed in the footer. The final WebP is locally resized and optimized; the PNG source and prompt sidecar remain in `assets/src/`.

## Page rhythm

The landing screen is an asymmetric 5/7 split: direct copy on the left, geometry and a real suggestion specimen on the right. Section dividers behave like bar collars—short chartreuse segments followed by long gray rules. The product screen gives the active set the largest area; history and explanation are secondary. On 390 px screens, art becomes a shallow band and set fields stack without hiding any controls.
