# Part A — Student Explorer & Sound

**You own:** `src/student/**` and this file. Nothing else (see `CONTRACT.md` §1).
**You consume:** `src/contract/*` (types, routes), plus `getFigure`, `getStudent`, `saveStudentPrefs` and `recordSession` from `src/data/db.ts`, and `askQuestion` from `src/data/ai.ts`. Part B provides all of these; they are working stubs from C0.
**You deliver:** `src/student/Explore.tsx` (default export, props per CONTRACT §4). This is the screen a blindfolded judge uses, so it is the most important screen in the project.

Specs: `SPEC.md` F2 and the explorer side of F7. Look and sound: `DESIGN.md`. Rules: `CLAUDE.md` (Ponytail on).

Work on branch `a/student`. Tick a box only after its **Verify** passes, and commit after every step (`A: step N …`).

## Target files

```
src/student/Explore.tsx        the screen: start overlay, stage, top bar, find-it timer, ask panel, help
src/student/useExplorer.ts     state machine + key handling (idle → exploring → paused; finding; asking)
src/student/audio.ts           Web Audio voice, tick, thunk, chime, sweep, test sound; speak()/announce()
src/student/audio.test.ts      panFor, freqFor, wall-side detection
src/student/geometry.ts        pointInPolygon, area, hitTest (smallest wins), whereAmI, readingOrder, clamp
src/student/geometry.test.ts
```

Keep to these six files. Split only if a file passes about 300 lines.

## Start here (the shared base is already on `main`)

Step B0 (the contract, router, design tokens, stub data layer and figure images) is **done and pushed**. You don't need anything from the other part to begin:

```bash
git checkout main && git pull
git checkout -b a/student
npm install
npm run dev        # http://localhost:5173
npm test
```

What's already there for you:
- `src/student/Explore.tsx`: a placeholder with the final props. **It's yours now**; replace it in A3.
- `src/contract/`: the types and `href` / `parseRoute` (read-only).
- `src/data/db.ts` / `ai.ts`: working in-memory stubs with the final signatures. Until checkpoint C1 there is one figure, **`test-square`** (400×400): a frame, a big circle containing a small circle (to test nesting), and a triangle. Develop at `http://localhost:5173/#/explore/test-square?student=guest`. From C1, use `#/explore/animal-cell?student=guest`. Your code doesn't change.
- `src/index.css`: the design tokens as Tailwind classes (`bg-stage`, `text-accent`, `font-mono`…).

## A1 · Audio engine (~35 min)

- [x] `audio.ts`, exactly per the `DESIGN.md` sound table: one lazily created `AudioContext`, and a persistent position voice (osc → gain → panner → master 0.6).
  - `setPosition(x, y, w, h)` and `setInside(bool)` (triangle + 6 Hz tremolo) drive the voice. It fades out after 150 ms without movement.
  - One-shots: `tick(pan)`, `thunk(side)` (throttled to 300 ms), `chime()`, `sweep(from, to)`, `testSound()` (a left→right, low→high glide over 1.2 s).
  - `speak(text, rate)` cancels any current speech, picks an English voice (`en-CA` → `en-US` → `en*`), and ducks the voice to 0.1 while speaking.
  - `announce(text, { screenReader })` routes to `speak()`, or writes into an `aria-live="polite"` node when `screenReader` is true.
  - `dispose()`.
- [x] Export the pure `panFor(x, w)`, `freqFor(y, h)` and `wallSide(p, w, h)` and test them in `audio.test.ts`.
- **Verify:** `npm test` passes (0 → −1, w → +1, top → 880, bottom → 220, corners give the right wall side). A throwaway call from the dev console plays `testSound()` with no clicks at the start or end.

## A2 · Geometry (~25 min)

- [ ] `geometry.ts`:
  - `pointInPolygon` (ray casting) and `area` (shoelace);
  - `hitTest(regions, p)`: of all regions containing `p`, return the **smallest area**, or `null`;
  - `whereAmI(p, w, h)`: returns "Upper left" / "Centre" / …, using thirds;
  - `readingOrder(regions)`: sorts by `labelAnchor` in rows (y bucketed by h/6), then by x;
  - `clamp(p, w, h)`: returns `{ p, hitWall }`.
- **Verify:** tests cover a nested case (a point in both the nucleolus and the nucleus returns the nucleolus), a point on background, a concave polygon, all nine `whereAmI` cells, and the reading order of four points. `npm test` passes.


## A3 · Explorer shell + audio cursor (~70 min). The wow; it must be excellent

- [ ] `Explore.tsx` + `useExplorer.ts`:
  - Load the figure and student with `getFigure` / `getStudent`. Apply the student's `prefs`.
  - **Start overlay:** big title, "Press Enter to start exploring", a key-hint line. On mount, announce *"<Title>. <n> parts. Press Enter to start exploring. Press question mark for help."*
  - `Enter`: `requestPointerLock()` on the stage, resume audio, start the cursor at the centre, then announce *"Exploring."*
  - `pointermove`: accumulate `movementX/Y × sensitivity × (imageWidth / stageWidth)`, then `clamp`.
    - On `hitWall`: `thunk(side)`.
    - Otherwise: `setPosition`.
    - When `hitTest` changes: `tick`, then `setInside`, and announce the label (or stay silent on background).
  - `pointerlockchange` to unlocked, which also covers the browser's forced `Esc`: pause, fade the voice out, announce *"Paused. Press Enter to continue."*
  - **Audience view:** dark stage (`#111110`), image at 35%, the accent cursor dot with a glow, the current region filled at 25% accent plus an outline, and the current label in large type in the lower third.
- [ ] Tune `SENSITIVITY` (with a `ponytail:` comment), the gains and the fade **on the real demo laptop's trackpad and speakers**.
- **Verify (by hand, eyes closed, on the real cell after C1):**
  - from the centre, you can find the nucleus by sound alone;
  - the thunk comes from the correct side;
  - there are no audio clicks;
  - after `Esc` the page is fully usable;
  - it works in Chrome **and** Edge.

## Checkpoint C1: merge `main` (the real animal cell and Canada arrive, and `test-square` disappears; switch your dev URL to `#/explore/animal-cell?student=guest`. No code changes.)

## A4 · Keys, modes, prefs (~40 min)

- [ ] While exploring:
  - `Space`: the explanation;
  - `W`: "<where>. In <label>." or "<where>. Background.";
  - `C`: `sweep` to the centre;
  - `Tab` / `Shift+Tab`: move the cursor to the next or previous region's `labelAnchor` in `readingOrder`, and announce it (this also works while paused, as the screen-reader path);
  - `Q`: quiet (voice off; ticks and names stay);
  - `?`: help paragraph (Space, W, C, Tab, F, A, Q, Escape);
  - `T`: `testSound()` (pre-stage check);
  - `S`: toggle screen-reader mode;
  - `+` / `-`: speech rate.
- [ ] Persist the quiet, screen-reader-mode, speech-rate and sensitivity changes with `saveStudentPrefs(studentId, prefs)`.
- [ ] The top bar (visible, all real buttons) shows: back to home, the title, Quiet, Screen reader, Help. Every button is keyboard operable with visible focus.
- **Verify:**
  - every key works while exploring;
  - `Tab` reaches all regions, including small ones (a ribosome, or PEI on Canada);
  - with Narrator on and screen-reader mode on, each announcement is read **once**;
  - after a reload, the prefs persist for that student.

## A5 · Find-it + session recording (~30 min)

- [ ] `F` picks the target:
  - on the first press, `props.target` if given;
  - otherwise, on `animal-cell`, `mitochondrion`;
  - otherwise a random region ≠ the current one.
- [ ] Announce *"Find the <label>."* and show the big mono timer (top-centre, 96 px, tabular numbers).
- [ ] On entering the target: `chime()`, then *"Found in <n> seconds."*; the timer turns accent and scales once. Call `recordSession({ studentId, figureId, targetRegionId, seconds })`. `F` again starts a new round.
- [ ] `Esc` during a challenge: pause it; the timer keeps its value; `Enter` resumes.
- **Verify:** a blindfolded teammate finds the mitochondrion. The time shows. After going back to home, Part B's dashboard lists the session (once C2 is merged). **From now on, this path must never break.**

## A6 · Ask a question: the `A` key (~30 min)

- [ ] Flow:
  1. `A` ducks the voice, keeps pointer lock, and announces *"Ask your question."*
  2. If `SpeechRecognition` / `webkitSpeechRecognition` exists, listen once (en-CA). On error, or when it's unavailable (offline), open a large bottom-sheet text field with focus; `Enter` submits.
  3. Announce *"Thinking…"* with a soft accent pulse on the stage.
  4. `await askQuestion(figure, currentRegion, question)`, then speak the answer and show it in the sheet.
  5. `Esc` closes the sheet and returns to exploring.
- [ ] Guard against the Pointer Lock and text-field focus fighting: exit the lock while the sheet is open, and re-lock on close with `Enter`.
- **Verify:** inside the mitochondrion, "what does it do?" speaks a sensible answer within a few seconds. With Wi-Fi off, the typed fallback appears automatically.

## Checkpoint C2: merge `main`, then the joint full-loop check (CONTRACT §6)

## A7 · Accessibility pass on the explorer (~20 min)

- [ ] Keyboard only, the whole screen: no traps, `Esc` always pauses, and focus returns to a sensible place after the sheet or help closes.
- [ ] `prefers-reduced-motion`: no scaling or pulses (the highlight still switches instantly).
- [ ] High contrast (`data-contrast="high"` on `<html>`): the top bar and sheet stay readable. The stage stays dark by design.
- **Verify:** all three pass; Lighthouse accessibility ≥ 95 on the explorer route.

## A8 · Polish (~30 min)

- [ ] Use `emil-design-eng` / `animate` on the three allowed animations only (see `DESIGN.md`): the highlight fade, the found-timer pop, the enter pulse. Refine the start overlay's typography and spacing (`minimalist-ui`).
- [ ] `/ponytail-review` on `src/student/`; remove dead code.
- **Verify:** `npm test` and `npm run build` pass. A three-run rehearsal of the hero beat gives no glitches.

## Checkpoint C3 (07:15): merge `main` and run the joint rehearsal. Freeze at 08:00.

If you're ahead of schedule: help rehearse, and record the 60-second **backup screen capture** of the find-it beat (Win+Alt+R, with system audio). Don't take on Part B files.
