# TouchSight

Blind students explore textbook diagrams **by sound on a laptop trackpad**: stereo pan = x, pitch = y, a timbre change inside a part, and spoken names. Teachers get a workspace: a library, classes, progress, an editor, and swell-paper braille export.

Built for **HelloHacks 2026** (UBC). **Code freeze 08:00, Sun 27 Sep 2026**; the Devpost deadline is 11:00 PDT. Judging: Functionality 35%, Pitch 25%, Technical Complexity 20%, UX & Design 20%.

## Two parts, built in parallel. Know which one you are

| Part | Plan | Owns |
|---|---|---|
| **A: Student Explorer & Sound** | `docs/PLAN-A-student.md` | `src/student/**` |
| **B: Teacher, Data & App Shell** | `docs/PLAN-B-teacher.md` | everything else in `src/`, plus `public/`, and the package and config files |

- **Before doing anything, confirm which part this session is.** If the user hasn't said, ask.
- `docs/CONTRACT.md` is the single source of truth for ownership, shared types, routes, APIs and checkpoints. **Never edit a file your part doesn't own.** Never edit `src/contract/**` or the frozen docs.
- Work your plan top to bottom. Tick a box only after its **Verify** passes, and commit after every step with an `A:` or `B:` prefix on your own branch (`a/student` / `b/teacher`). Merge to `main` only at checkpoints.

Also read: `docs/SPEC.md` (what), `docs/DESIGN.md` (look, sound, words), `docs/DEMO.md` (the pitch; never break the demo path).

## Operating rules

- **Ponytail is ON.** Lazy senior dev: YAGNI, platform APIs first, no new dependency unless unavoidable, fewest files, no unrequested abstractions. Mark deliberate corner-cuts with `// ponytail: <ceiling> — <upgrade path>`. Not lazy about: accessibility, audio calibration on the real hardware, validation at trust boundaries (uploads, IndexedDB).
- **Optimize for the demo.** The app runs on a hardcoded database (`src/data/seed.ts` + `src/data/figures/*.json`) with IndexedDB writes on top. Everything must be one keystroke from a pristine state (`Ctrl+Shift+D` → Reset everything).
- **The product never narrates its own data.** No user-visible text, route, label or console message says "mock", "fake", "sample", "seed", "test data", "placeholder" or "hardcoded". (Code identifiers like `seed.ts` are fine.)
- **The demo path is sacred:** Dashboard → Animal cell → Explore → `F` (find the mitochondrion) → back to the dashboard, where the session is at the top. From checkpoint C2 on, it must work at every commit on `main`.
- **Never call a cloud API at runtime.** No Claude API and no hosted inference; Claude is a build tool only. The app works in airplane mode. The only optional runtime AI is local Ollama (step B9).
- **Dependencies:** `react`, `react-dom`, `tailwindcss` + `@tailwindcss/vite`, `idb-keyval`, `qrcode`, with `vitest` for tests. Step B0 removes `@huggingface/transformers`, `tesseract.js`, `lz-string` and `vite-plugin-pwa`. Only Part B edits `package.json`.
- **No router library** (a hash router in `App.tsx`), no state library, and no chart library (sparklines are inline SVG).
- **Tests:** Vitest, with co-located `*.test.ts` for pure logic only (geometry, audio mapping, routes, db merge, answers, braille). No UI tests.

## Commands

```bash
npm install
npm run dev                          # http://localhost:5173
npm test                             # vitest run
npm run build && npm run preview     # http://localhost:4173, the ONLY thing used on stage
```

## Skills and plugins

- Look: `minimalist-ui` (the only look skill). Polish: `emil-design-eng`, `animate`, `review-animations`. `apple-design` is optional, for pointer and motion feel.
- Discipline: `verification-before-completion`, `systematic-debugging`, and `/ponytail-review` at each part's polish step.
- Plugins in `.claude/settings.json`: playwright (demo-path smoke test), context7 (current docs, and Ollama for B9), typescript-lsp, code-simplifier.
- Not relevant to this build: `transformers-js`, `mobile-native`, `brainstorming`, `writing-plans`. The plans are already written. Never invoke paid image-generation skills.
