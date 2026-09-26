# TouchSight — Design (look, sound, words)

Shared by both parts. Part A owns the explorer and sound; Part B owns the tokens (`src/index.css`) and every other screen. Use only these tokens, so the two halves look like one product.

Style source: the `minimalist-ui` skill (warm monochrome, editorial type, flat, no gradients). Judges score UX & Design at 20%: the app should look calm and serious, like a tool a school would trust.

## Visual tokens (Tailwind v4 `@theme` in `src/index.css`)

| Token | Default | High contrast |
|---|---|---|
| `--color-paper` (background) | `#F7F5F0` | `#FFFFFF` |
| `--color-ink` (text) | `#1C1B19` | `#000000` |
| `--color-muted` | `#6B665E` | `#1C1B19` |
| `--color-line` (borders) | `#E4E0D8` | `#000000` |
| `--color-accent` (focus, selection, cursor dot) | `#C2410C` (burnt orange) | `#0000EE` |

- The explorer stage is always dark (`#111110`), with the image at 35% opacity and the cursor dot in accent with a soft 24 px glow. The active region is filled with accent at 25% plus a 2 px outline. It's a stage for the audience, not for the student.
- **Type:** headings `ui-serif, Georgia, serif`; UI `system-ui, sans-serif`; the timer `ui-monospace` with tabular numbers at 96 px. No web fonts (offline).
- **Layout:** max width 1100 px, 8 px spacing grid, 1 px borders, 12 px radius on cards, no shadows except the cursor glow.
- **Focus:** a 3 px accent outline with 2 px offset on everything focusable. Never remove it.
- The high-contrast toggle sits in B's header, sets `data-contrast="high"` on `<html>`, and is remembered in localStorage. Tokens switch automatically under that attribute.

## Motion

- Only three animations, all under 200 ms, `ease-out`, and all disabled under `prefers-reduced-motion`:
  - the region highlight fades in;
  - the "Found!" timer scales (1 → 1.08 → 1) and turns accent;
  - the cursor glow pulses once when a region is entered.
- Nothing else moves. Each part's polish step (A8 / B8) uses `emil-design-eng` / `animate` to tune these, not to add more.

## Sound design (`src/student/audio.ts`, Part A)

One `AudioContext`, created or resumed on the `Enter` gesture. The graph: `OscillatorNode → GainNode (volume env) → StereoPannerNode → master GainNode (0.6) → destination`. The position voice persists. Ticks, thunks and chimes are short one-shot nodes.

| Sound | Spec |
|---|---|
| **Position tone** | Sine. `pan = 2·x/w − 1`. `freq = 220 · 4^(1 − y/h)` (top = 880 Hz, bottom = 220 Hz). Update with `setTargetAtTime(v, t, 0.015)` so it doesn't zipper. Gain 0.25 while moving, fading to 0 over 150 ms of stillness. |
| **Inside a region** | The same tone switches to `triangle`, and a tremolo (LFO 6 Hz, depth 0.3) goes on the volume gain. Background = plain sine. |
| **Boundary tick** | A 4 ms white-noise burst through a 3 kHz bandpass, gain 0.5, panned to the cursor x. |
| **Wall thunk** | A 70 Hz sine for 120 ms with an exponential decay, gain 0.7, panned to the side that was hit. Throttled to one per 300 ms. |
| **Found chime** | Two triangle notes, 660 → 990 Hz, 90 ms each, 40 ms apart, gain 0.4, centred. |
| **Centre sweep (`C`)** | 180 ms tone glides from the old position to the centre (pan and pitch together). |
| **Speech** | `speechSynthesis.cancel()` then `speak(u)`. Rate 1.05, pick the first English (`en-CA` → `en-US` → any `en`) voice. Speech is layered over the tone; duck the position gain to 0.1 while speaking. |

**Pure functions to unit-check:** `panFor(x, w)`, `freqFor(y, h)`, and the clamp/thunk side detection.

**Sensitivity:** the default is 1.0 (movementX px → image px, scaled by `imageWidth / stageWidth`). Tune it on the real demo trackpad in step A3. The target: one comfortable full swipe crosses about 60% of the diagram. Put the constant at the top of `src/student/useExplorer.ts` with a `ponytail:` comment.

## Words (announcement copy)

- Short, calm, and never cute. Say names as printed in the figure.
- Start: *"Animal cell. 12 parts. Press Enter to start exploring. Press question mark for help."*
- Where am I: *"<vertical> <horizontal>. In <label>."*, using thirds for position: upper/middle/lower and left/centre/right, with "Centre" for the middle cell. Background → *"Background."*
- Find-it: *"Find the <label>."* → *"Found in <n> seconds."* (Round to whole seconds.)
- Pause: *"Paused. Press Enter to continue."*
- Help (`?`): a single paragraph listing the keys in the order Space, W, C, Tab, F, A, Q, Escape.
- Ask: *"Ask your question."* then *"Thinking…"* then the answer.
- AI-written text carries an **AI draft — check it** badge (muted pill, sparkle icon) until the teacher edits it. While AI is "thinking": the button shows a spinner and the text reads "Writing…"; in the explorer, a soft accent pulse plus spoken "Thinking…". Never claim the AI is always right.

## Screen map

1. **Home / dashboard** [B]:
   - The header: the wordmark "TouchSight" (serif), Home · About, the high-contrast toggle, and "Ms. Rivera".
   - Three stacked sections with generous spacing:
     - **Library:** a grid of figure cards with thumbnail, title, subject · grade and "12 parts"; Explore / Edit buttons; and an "Upload a diagram" card.
     - **Classes:** two columns, one per class, showing the assignment pill ("Canada · due Thu") and student rows (name, last activity, Launch).
     - **Recent activity:** a quiet list with a mono time value and relative time. The newest row gets a one-time accent fade (reduced-motion: none).
2. **Student page** [B]: the name and class, the prefs as small pills, and one row per target with an inline-SVG sparkline (1.5 px ink line, accent dot on the latest value, the latest seconds labelled).
3. **Explore** [A]: a full-bleed dark stage. A slim top bar has back, the title, Quiet, Screen reader and Help. The find-it timer sits top-centre, only during a challenge. The current label shows large in the lower third. The ask sheet slides up from the bottom.
4. **Edit** [B]: the image with its overlay on the left (≈70%). On the right, a panel with the region list, the selected region's fields, and Merge / Delete / Undo / Preview / Download JSON / Export SVG.
5. **Upload** [B]: one centred drop zone, then the title / subject / grade fields.
6. **About** [B]: the pipeline (diagram → teacher traces → figure data → sound & speech / braille) as boxes in a row, then the three claims (/usr/bin/bash · offline · private), then sources.
7. **Presenter panel** [B]: a small sheet, bottom-right, titled "Presenter", with four buttons. It uses the same tokens and is never linked in the UI.
