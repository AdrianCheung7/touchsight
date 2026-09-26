# Part B — Teacher, Data & App Shell

**You own:** `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/data/**`, `src/teacher/**`, `public/**`, the package and config files, and this file (see `CONTRACT.md` §1). You create `src/contract/**` once in B0; after that it is frozen.
**You never touch:** `src/student/**`. The only exception is creating its placeholder in B0.
**You deliver to Part A:** the contract, working stubs from C0, and the real `db.ts` / `ai.ts` with the hero data by C1.

Specs: `SPEC.md` F1, F3–F8. Look: `DESIGN.md`. Rules: `CLAUDE.md` (Ponytail on).

Work on branch `b/teacher`. Tick a box only after its **Verify** passes, and commit after every step (`B: step N …`).

## Target files

```
src/contract/types.ts, routes.ts, routes.test.ts   B0, then frozen
src/data/db.ts            the database API (CONTRACT §5)
src/data/seed.ts          the hardcoded database: classes, students, assignments, sessions (relative dates)
src/data/figures/animal-cell.json, canada.json      hand-traced regions + explanations
src/data/answers.ts       explanation + Q&A table per label
src/data/ai.ts            explainRegion / askQuestion (answer table now; Ollama in B9)
src/data/db.test.ts
src/teacher/Home.tsx      dashboard: library, classes, recent activity
src/teacher/StudentPage.tsx
src/teacher/Edit.tsx      editor
src/teacher/Upload.tsx
src/teacher/braille.ts (+ braille.test.ts), exportSvg.ts
src/teacher/About.tsx
src/teacher/DemoPanel.tsx
src/teacher/Header.tsx    wordmark, nav, high-contrast toggle
public/figures/animal-cell.jpg, canada.png
```

## Start here (the shared base is already on `main`)

Step B0 (the contract, router, design tokens, stub data layer and figure images) is **done and pushed**. You don't need anything from the other part to begin:

```bash
git checkout main && git pull
git checkout -b b/teacher
npm install
npm run dev        # http://localhost:5173
npm test
```

Begin at **B1**. When B1 replaces `db.ts`, **delete the `test-square` figure** (CONTRACT §7), and keep every exported function signature identical.

## B0 · Contract commit ✅ DONE (on `main`, checkpoint C0)

- [x] Clean up the starter:
  - delete `src/App.css`, `src/assets/*` and `scripts/fetch-models.mjs`;
  - in `package.json`, remove the `models` script and uninstall `@huggingface/transformers tesseract.js lz-string vite-plugin-pwa`;
  - set the `test` script to `vitest run`;
  - update the comment in `vite.config.ts`.
- [x] `src/index.css`: the Tailwind v4 `@theme` tokens from `DESIGN.md`, with `[data-contrast="high"]` overrides, a base body style, and the focus-ring rule. Remove the starter variables.
- [x] `src/contract/types.ts` and `routes.ts`, **exactly** as in CONTRACT §3–4. Implement `parseRoute`, plus `routes.test.ts` covering all six routes and an unknown hash (→ home).
- [x] `src/App.tsx`: a `hashchange` router that renders B's pages and `<Explore …/>`.
- [x] Placeholder pages:
  - B's pages: a heading only.
  - `src/student/Explore.tsx`: a heading plus the props shown. **Ownership passes to A at merge.**
- [x] **Working stubs:**
  - `db.ts` implements every CONTRACT §5 function in memory, with one figure `test-square` (400×400, one square region).
  - `ai.ts` resolves after 800 ms with the region's explanation.
- [x] Download the images into `public/figures/`:
  - `animal-cell.jpg` ← https://upload.wikimedia.org/wikipedia/commons/0/0d/0312_Animal_Cell_and_Components.jpg
  - `canada.png` ← https://upload.wikimedia.org/wikipedia/commons/1/14/Political_map_of_Canada.png
- **Verified:** `npm test` (routes), `npm run build` and `npx oxlint src` pass. Every route renders. The stub data layer works end to end (figure, guest, session recording, `askQuestion`, `deleteFigure` rejection).

## B1 · The database (~50 min) ✅

- [x] `figures/animal-cell.json`: open `animal-cell.jpg` and trace **every labelled structure** (8–14 points each, tracing the structure, **not** its label text), plus `labelAnchor` and a grade-5 explanation of 30 words or fewer.
  - `mitochondrion` is required (it's the hero target).
  - The cytoplasm or cell membrane is the large outer region; smallest-area-wins makes the organelles hit first.
  - Metadata: `subject: "Science"`, `gradeBand: "Grade 7"`, and the `source` with credit and license.
- [x] `figures/canada.json`: 13 provinces and territories. Explanations give the capital plus one kid-friendly fact. PEI gets a slightly generous polygon. Metadata: `subject: "Social Studies"`, `gradeBand: "Grade 5"`, `source` = public domain.
- [x] `seed.ts`, the hardcoded database. **Everything is relative to `Date.now()` at load time**, so it never looks stale.
  - `teacher: "Ms. Rivera"`.
  - Classes: "Grade 5 · Room 12" and "Grade 7 · Science".
  - 6 students, 3 per class, fictional first name plus last initial. Give 2 of them `screenReaderMode: true` and vary the sensitivity. Never use a name or detail from the pitch story.
  - Assignments: Canada → Grade 5, due in 3 days; the animal cell → Grade 7, due in 5 days.
  - About 24 sessions over the last 14 days:
    - several targets per student;
    - times that realistically fall with practice (for example, a student's mitochondrion times go 52 → 31 → 19 s);
    - no session in the last hour, so the judge's live session is clearly the newest.
- [x] `db.ts`, the real implementation:
  - The seed is the base. Writes go to `idb-keyval`: keys `fig:<id>`, `prefs:<studentId>`, and `sessions` (an appended array).
  - Reads merge the two: a saved figure wins, prefs override, sessions = seed + saved, sorted newest first.
  - `resetDemo()` clears the IndexedDB store.
  - Validate figures read from storage at this trust boundary: drop invalid regions with a `console.warn`.
- [x] `db.test.ts`, using `idb-keyval`'s `createStore` with an in-memory fallback, or by mocking the module:
  - a saved figure overrides the seed;
  - `recordSession` then `listSessions` puts it first;
  - `resetDemo` restores the seed;
  - `getStudent('guest')` returns the default prefs.
- **Verify:** tests pass. `#/explore/animal-cell?student=guest` loads the real cell in A's placeholder or shell.

## B2 · Answers + AI module (~30 min) ✅

- [x] `answers.ts`: for every cell and Canada label (lowercased), an `explain` sentence plus 3–5 Q&A pairs keyed by intent: `what`, `why`, `where`, `size`, `fact` (Canada adds `capital`).
  - Write them the way a patient Grade 5 teacher would speak: concrete, 1–2 sentences.
- [x] `ai.ts`:
  - `explainRegion` returns `answers[label].explain`.
  - `askQuestion` classifies the question by keywords ("what/do/does" → what, "why", "where", "big/small/size" → size, "capital", otherwise fact) and returns the matching answer.
  - For unknown labels (uploads), build a sentence from the region's own explanation. If that is empty too, answer "That part is called <label>."
  - Resolve after a random 0.9–1.8 s delay. **Never reject** (CONTRACT §5).
  - ~~Keep the **single switch** `const AI_BACKEND = 'local' as 'local' | 'ollama'`~~ — omitted: B9 (live Ollama) is skipped by decision, so the answer table is the only backend.
- **Verify:** unit test: "what does it do?" on the mitochondrion gives the `what` answer; "capital?" on BC gives Victoria; an unknown label never throws. **Merge to `main`: this is C1.** Tell Part A.

## B3 · Dashboard, header, student page (~60 min) ✅

- [x] `Header.tsx`: the "TouchSight" wordmark (serif), nav (Home · About), the high-contrast toggle (`data-contrast` on `<html>`, remembered in localStorage), and "Ms. Rivera" at the right.
- [x] `Home.tsx` (`#/`), per `DESIGN.md`:
  - **Library:** figure cards with thumbnail, title, subject · grade, and region count. Buttons: **Explore** (as guest), **Edit**. Plus **Upload a diagram**.
  - **Classes:** each class with its assignment ("Canada · due Thu"), and its students (name, the last activity as relative time, and a **Launch** button that opens the assigned figure as that student).
  - **Recent activity:** the last 8 sessions, e.g. "Guest found Mitochondrion in 14 s · just now". Relative times use `Intl.RelativeTimeFormat`, and the list reloads whenever the route returns to home.
- [x] `StudentPage.tsx` (`#/student/:id`): prefs (read-only), plus a find-time history per target as a small inline-SVG sparkline with the latest value labelled. There is no chart library.
- **Verify:**
  - keyboard only, the first Tab reaches "Explore Animal cell";
  - Launch opens A's explorer with the right `studentId`;
  - a session recorded in the explorer appears at the top after returning home.

## B4 · Teacher editor (~75 min)

- [ ] `Edit.tsx` (`#/edit/:id`), per SPEC F3:
  - image plus SVG overlay (`viewBox` = natural size);
  - select a region, drag a vertex, double-click an edge to insert a vertex, `Delete`;
  - **Draw new** (click points; `Enter` or clicking the first point closes);
  - side panel: label, explanation, and a **✨ Write with AI** button; **Write all missing** (progress "3 of 9"), with the "AI draft — check it" badge until edited;
  - **Merge** (convex hull, with a `ponytail:` comment);
  - undo (`Ctrl+Z`, 20 snapshots);
  - autosave through `saveFigure` (debounced 500 ms);
  - **Preview as student** → `href.explore(id)`; **Download JSON**; **Export swell-paper SVG** (B6).
- [ ] Keyboard: a focusable region list, and arrow keys nudge the selected vertex (1 px, or 10 px with Shift).
- [ ] **B4b:** refine the animal-cell and Canada polygons in the editor wherever they're visibly off. Then paste the downloaded JSON back over `src/data/figures/*.json` so the fixes live in the seed, and call `resetDemo()`.
- **Verify:**
  - drag, then undo, restores the vertex;
  - merge draws a hull;
  - renaming a region, then Preview, speaks the new name;
  - edits survive a reload.
  - Run `/ponytail-review`.

## B5 · Upload (~25 min)

- [ ] `Upload.tsx` (`#/upload`): drag-and-drop or a file picker. Accept PNG/JPG up to 10 MB; anything else gets a clear message.
- [ ] Read the file as a data URL, get the natural size, ask for a title, subject and grade.
- [ ] `saveFigure` a new `upload-<timestamp>` figure with zero regions, then open the editor. The empty state reads: *"Trace each part the student should find. Click around its edge; press Enter to close."*
- **Verify:** upload `canada.png` as a new figure, trace two provinces, use **Write all missing**, Preview, and hear them. It survives a reload; a PDF is rejected. **Merge to `main`: this is C2.**

## B6 · Braille + swell-paper export (~40 min)

- [ ] `braille.ts` + test:
  - UEB Grade 1: letters a–z, the capital indicator (dot 6), and the number sign (dots 3456) with digits a–j.
  - `cellsFor(text)` returns an array of dot sets.
  - `drawCells(x, y, cells)` returns SVG circles: dot Ø 1.5 mm, dot pitch 2.5 mm, cell pitch 6.0 mm.
- [ ] `exportSvg.ts`, per SPEC F5: US Letter in mm, 15 mm margins, 0.8 mm outlines with no fill and no raster image. The braille title sits on top, and there's a print caption. When a label doesn't fit its region, use a key number, and add a key page listing each number and its label.
- [ ] Show a QR code for the explorer link (`qrcode`, data URL) in the export dialog.
- **Verify:** "Cell" encodes as ⠠⠉⠑⠇⠇ and "12" as ⠼⠁⠃. The SVG opens in the browser with correctly sized dots, and small regions use key numbers.

## B7 · About + demo panel (~30 min)

- [ ] `About.tsx` (`#/about`), a single screen:
  - the pipeline as five boxes: diagram → teacher traces → figure data → sound & speech → braille;
  - three claims: $0 · offline · private;
  - credits, licenses, and the Sources list from `DEMO.md`.
- [ ] `DemoPanel.tsx`, opened with `Ctrl+Shift+D` from anywhere. B's handler ignores the key while pointer lock is active. It's a small unlabelled-looking "Presenter" sheet with:
  - **Reset everything** (`resetDemo()` then reload);
  - **Open hero** (`href.explore('animal-cell', 'guest', 'mitochondrion')`);
  - **Open dashboard**;
  - **Open editor on the cell**.
  
  It's never linked from the UI. It's for the presenter only.
- **Verify:** in airplane mode, reset gives a pristine dashboard, and Open hero lands on the explorer's start overlay.

## B8 · Accessibility + polish on B's screens (~40 min)

- [ ] Keyboard-only pass on Home, Student, Edit, Upload and About: visible focus, no traps, a logical order, semantic headings, labelled buttons.
- [ ] Narrator: the dashboard reads sensibly.
- [ ] Reduced motion and high contrast both look right.
- [ ] Lighthouse accessibility ≥ 95 on Home and Edit.
- [ ] Polish with `minimalist-ui`, `emil-design-eng` and `animate`: card spacing, empty and loading states, and the "AI draft" badge. Only the motion listed in `DESIGN.md`.
- [ ] `/ponytail-review` on B's files.
- **Verify:** `npm test` and `npm run build` pass. **Merge to `main`: this is C3 (07:15)**, then the joint rehearsal.

## B9 · Live Ollama (only after C3 is green; hard stop 07:45)

- [ ] `ollama pull qwen2.5vl:7b` (start the download early, during B1, in the background). Run `ollama serve` with `OLLAMA_ORIGINS=http://localhost:4173,http://localhost:5173`.
- [ ] Add an `'ollama'` branch in `ai.ts`, per SPEC F7:
  - crop the region's bbox (+40 px) to base64 via canvas;
  - `POST /api/chat` with the `format` schema, temperature 0, `keep_alive` 30m, and a 25 s timeout;
  - on any failure, **fall back to the answer table**.
  
  Warm the model on app load. No UI file changes.
- **Verify:** **Write with AI** on an uploaded figure returns an image-grounded sentence; with Ollama stopped, the fallback works silently. If it's not solid by 07:45, set `AI_BACKEND = 'local'` and follow the AI rule in `DEMO.md`.
