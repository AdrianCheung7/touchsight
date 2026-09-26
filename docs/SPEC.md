# TouchSight — Spec

Owner tags: **[A]** = Part A (Student Explorer & Sound), **[B]** = Part B (Teacher, Data & App Shell). Interfaces between them live in `CONTRACT.md`.

## Problem

Blind students get diagrams late, or as a spoken description instead of a layout. Hand-made tactile graphics are produced by specialist transcribers, and a textbook's graphics arrive over **months** (APH phased delivery; even a research-assisted workflow still needed about 10 min per figure). Refreshable tactile displays cost **about $15–19k** (APH Monarch). In Canada, **65%** of blind or partially sighted youth graduate high school, against **81%** of sighted peers (CNIB). Sources are in `DEMO.md`.

## Users

- **Student (primary):** a blind elementary or middle-school student with a school laptop. Uses a trackpad and keyboard, and may or may not run a screen reader. Never needs to see the screen.
- **Teacher (secondary, sighted):** a classroom teacher or TVI. Prepares figures, assigns them to a class, and sees each student's progress. The only one who edits.

One-line pitch: *"TouchSight lets a blind student feel the layout of tonight's diagram through sound, on the laptop they already have, for $0, offline."*

## Goals / non-goals

**Goals:**
- non-visual spatial exploration of a diagram on a laptop;
- a teacher workspace (library, classes, progress, editor);
- a swell-paper SVG proof of concept;
- fully offline on stage;
- **effortless to demo**.

**Non-goals** (say "future work" if asked): tablets, phones and touchscreens; Grade 2 braille; non-visual editing; accounts and login; cloud sync; PWA; true polygon union; printing.

## Features and acceptance criteria

### F1 Teacher dashboard (`#/`) [B]
- A header with the wordmark, nav, the high-contrast toggle, and the teacher's name.
- **Library:** figure cards (thumbnail, title, subject · grade, region count), each with **Explore** and **Edit** buttons, plus **Upload a diagram**. The animal cell comes first.
- **Classes:** each class shows its assignment and due date and its students. Each student row has the last activity and a **Launch** button that opens the assigned figure as that student.
- **Recent activity:** the last 8 find-it sessions ("Guest found Mitochondrion in 14 s · just now"). It is fresh every time the route returns home.
- **Student page** (`#/student/:id`): prefs, and find-time history per target shown as a sparkline.
- The first Tab lands on "Explore Animal cell".

### F2 Explorer (`#/explore/:id?student=&target=`) [A]: the core
- On load, it announces *"Animal cell. 12 parts. Press Enter to start exploring. Press question mark for help."* The student's prefs are applied.
- `Enter` calls `requestPointerLock()` and resumes the `AudioContext`. A virtual cursor starts at the centre and moves by `movementX/Y × sensitivity`, **clamped** to the image.
- **Audio cursor** (exact values in `DESIGN.md`):
  - while the cursor moves, a tone pans with x and rises in pitch toward the top;
  - it fades 150 ms after movement stops;
  - the timbre changes inside a region;
  - crossing a boundary ticks;
  - entering a region speaks its label;
  - hitting a bound thunks (at most once per 300 ms).
- **Keys:**
  - `Space`: explanation
  - `W`: where am I
  - `C`: centre
  - `Tab` / `Shift+Tab`: next / previous region in reading order
  - `F`: find-it
  - `A`: ask a question
  - `Q`: quiet mode
  - `S`: screen-reader mode
  - `+` / `-`: speech rate
  - `T`: test sound
  - `?`: help
  - `Esc`: pause
- **Hit-testing:** point-in-polygon in image coordinates. When regions overlap, **the smallest area wins**.
- **Find-it:** the target is `?target=` if given, else Mitochondrion on the cell, else random. A big on-screen timer runs; on success: chime, then *"Found in 14 seconds."*, then the session is recorded to the database. The time is shown only, with no comparisons.
- **Ask (`A`):** by voice where available, otherwise typed. It says "Thinking…", then the answer is spoken (via `askQuestion`).
- **Screen-reader mode:** announcements go to `aria-live` instead of `speechSynthesis`.
- Prefs changes persist per student.
- **Audience view:** a dimmed image, a cursor dot, the region highlight, and a large current label, so the room can follow a blindfolded judge.

### F3 Teacher editor (`#/edit/:id`) [B]
- The image with an SVG overlay. Select a region, drag vertices, double-click an edge to insert a vertex, delete, and **Draw new**.
- Side panel: label; explanation with **✨ Write with AI**; **Write all missing** (with progress); and an **AI draft — check it** badge until the teacher edits it.
- **Merge** (convex hull, `// ponytail: hull over-covers concave shapes — polygon-clipping lib if needed`).
- **Undo** ×20. Autosave to the database. **Preview as student**, **Download JSON**, **Export swell-paper SVG**.
- Keyboard: a focusable region list, and arrow-key vertex nudge. WCAG AA.

### F4 Upload (`#/upload`) [B]
- PNG/JPG up to 10 MB, validated. The teacher enters a title, subject and grade. A new figure with zero regions opens in the editor. Stored in IndexedDB.

### F5 Swell-paper SVG export [B]
- US Letter in mm, 15 mm margins, 0.8 mm outlines, no raster.
- **Grade 1 UEB braille drawn as circles**: dot Ø 1.5 mm, dot pitch 2.5 mm, cell pitch 6.0 mm, line pitch 10 mm.
- A key number plus a key page when a label doesn't fit. A braille title and a print caption.
- A QR code to the explorer link.

### F6 About (`#/about`) + presenter panel [B]
- About: the pipeline, "$0 · offline · private", credits and licenses, and sources.
- **Presenter panel** (`Ctrl+Shift+D`, never linked in the UI): Reset everything, Open hero, Open dashboard, Open editor on the cell.

### F7 AI: explanations and questions [B implements, A consumes]
- `src/data/ai.ts` per CONTRACT §5. It **never rejects**, so the UI can't break.
- Answers come from the curated answer table (`src/data/answers.ts`), and uploads fall back to the teacher's explanation.
- **Live Ollama (B9, optional, last):** `POST http://localhost:11434/api/chat` with model `qwen2.5vl:7b`, `stream:false`, temperature 0, `keep_alive:"30m"`, and a 25 s timeout. It sends a base64 crop of the region's bbox (+40 px). Explanations use `format` JSON schema `{explanation: string}`. The prompt asks for grade-5 wording, 1–2 sentences, at most 30 words. It needs `OLLAMA_ORIGINS`. On failure it falls back to the answer table.

### F8 Database [B]
- `src/data/db.ts` per CONTRACT §5. A **hardcoded seed** (`seed.ts` + `figures/*.json`) holds:
  - 1 teacher, 2 classes, 6 fictional students, and 2 assignments;
  - about 24 historical sessions with dates **relative to now**;
  - the animal cell and the Canada map, fully traced with explanations.
- Writes go to IndexedDB via `idb-keyval` and are merged over the seed. `resetDemo()` restores the pristine state.
- Validate stored figures at load, dropping bad regions with a warning.

## Data shapes

Defined in `CONTRACT.md` §3 (`Figure`, `Region`, `Student`, `ClassRoom`, `Assignment`, `Session`).

- Coordinates are image pixels.
- `explanation` is 1–2 sentences at a grade-5 reading level, at most 30 words, never "this image shows".

## Figures

| id | Image | License | Regions |
|---|---|---|---|
| `animal-cell` (**hero**) | OpenStax A&P "0312 Animal Cell and Components": https://upload.wikimedia.org/wikipedia/commons/0/0d/0312_Animal_Cell_and_Components.jpg | CC BY 4.0 (OpenStax, Rice University) | Every labelled structure; `mitochondrion` is required |
| `canada` | "Political map of Canada.png": https://upload.wikimedia.org/wikipedia/commons/1/14/Political_map_of_Canada.png | Public domain | 13 provinces and territories |

## Architecture

- A browser-only React app served by `vite preview` on the demo laptop. No backend; everything runs in airplane mode.
- Exploration is pure geometry plus Web Audio: deterministic and instant, so it cannot hang on stage.

## Accessibility (not negotiable, both parts)

- Every action is reachable by keyboard, with visible focus, semantic headings and no traps. `Esc` always pauses the explorer.
- `prefers-reduced-motion` is respected, and high contrast works on every screen. Text is at least 16 px.
- Tested once with Narrator or NVDA.

## Known limitations (acknowledge them if a judge raises them)

- Trackpad input is relative; position is carried by sound, not by finger placement.
- Grade 1 braille only, and the SVG is untested on real swell paper.
- Small regions are hard to hit by ear; `Tab` jumps to them.
