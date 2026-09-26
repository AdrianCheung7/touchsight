# TouchSight — Integration contract (Part A ⇄ Part B)

The project is built as two independent parts by two people/sessions working in parallel:

- **Part A — Student Explorer & Sound** (`docs/PLAN-A-student.md`)
- **Part B — Teacher, Data & App Shell** (`docs/PLAN-B-teacher.md`)

This file is the **only** thing both parts depend on. If you follow it, the two halves merge with zero conflicts and work together the first time.

## 1. File ownership (zero overlap)

Every path in the repo has exactly one owner. **Never create, edit or delete a file you don't own.** If you need something from the other part, ask for it; don't do it yourself.

| Path | Owner | Notes |
|---|---|---|
| `src/student/**` | **A** | Explorer screen, audio, geometry, their tests |
| `src/contract/**` | **Frozen** | Created by B in step B0; afterwards changed only by a joint `contract:` commit that both people approve (aim for zero) |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | **B** | Router, global hotkeys, design tokens |
| `src/data/**` | **B** | Database, seed, AI module, their tests |
| `src/teacher/**` | **B** | Dashboard, editor, upload, export, about, demo panel |
| `public/**` | **B** | Figure images |
| `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | **B** | Part A adds no dependencies (Web Audio, Pointer Lock and speech are browser APIs). If A truly needs one, B adds it. |
| `docs/PLAN-A-student.md` | **A** | Tick your own boxes |
| `docs/PLAN-B-teacher.md` | **B** | Tick your own boxes |
| `CLAUDE.md`, `README.md`, `docs/SPEC.md`, `docs/DESIGN.md`, `docs/DEMO.md`, `docs/CONTRACT.md` | **Frozen** | Read-only during the build. Rehearsal edits to `DEMO.md` happen after the freeze. |

**The one hand-over:** step B0 (now on `main`) created a placeholder `src/student/Explore.tsx` so the router compiles. That file now belongs to A, and B never touches `src/student/` again.

## 2. Git workflow

- Branches: `a/student` and `b/teacher`, both from `main`.
- Merge into `main` only at the checkpoints (§6), with `git merge --no-ff`. Because the paths don't overlap, merges can't conflict. **A conflict means someone broke ownership:** stop and fix the ownership, not the conflict.
- After each checkpoint, both people run `git pull origin main` and merge `main` into their branch.
- Commit messages start with `A:`, `B:` or `contract:`.

## 3. Shared types — `src/contract/types.ts` (created in B0, then frozen)

```ts
export type Point = [number, number] // image pixels, origin top-left

export interface Region {
  id: string            // kebab-case, unique within the figure
  label: string         // as printed, e.g. "Mitochondrion"
  polygon: Point[]      // ≥ 3 points
  labelAnchor: Point    // where Tab jumps to and where braille goes
  explanation: string   // 1–2 sentences, grade-5 reading level, ≤ 30 words
  origin: 'teacher' | 'ai'
}

export interface Figure {
  id: string
  title: string          // "Animal cell"
  subject: string        // "Science" | "Social Studies" | …
  gradeBand: string      // "Grade 7"
  image: string          // URL under /figures/ or a data: URL (uploads)
  width: number
  height: number         // natural image size in px
  source?: { credit: string; license: string; url: string }
  regions: Region[]
  updatedAt: string      // ISO
}

export interface StudentPrefs {
  sensitivity: number        // default 1.0
  speechRate: number         // default 1.05
  screenReaderMode: boolean  // default false
  quiet: boolean             // default false
}

export interface Student { id: string; name: string; classId: string; prefs: StudentPrefs }
export interface ClassRoom { id: string; name: string; teacher: string }
export interface Assignment { id: string; classId: string; figureId: string; due: string } // ISO date

export interface Session {
  id: string
  studentId: string      // 'guest' for the explorer opened without a student
  figureId: string
  targetRegionId: string // the region the student was asked to find
  seconds: number        // whole seconds
  at: string             // ISO timestamp
}

export const GUEST_ID = 'guest'
export const DEFAULT_PREFS: StudentPrefs = { sensitivity: 1, speechRate: 1.05, screenReaderMode: false, quiet: false }
```

## 4. Routes — `src/contract/routes.ts` (created in B0, then frozen)

```ts
export type Route =
  | { page: 'home' }
  | { page: 'explore'; figureId: string; studentId: string; target?: string }
  | { page: 'edit'; figureId: string }
  | { page: 'upload' }
  | { page: 'student'; studentId: string }
  | { page: 'about' }

export const href = {
  home: () => '#/',
  explore: (figureId: string, studentId = 'guest', target?: string) =>
    `#/explore/${figureId}?student=${studentId}${target ? `&target=${target}` : ''}`,
  edit: (figureId: string) => `#/edit/${figureId}`,
  upload: () => '#/upload',
  student: (studentId: string) => `#/student/${studentId}`,
  about: () => '#/about',
}

export function parseRoute(hash: string): Route { /* B0 implements; unit-tested in B0 */ }
```

- The router lives in `src/App.tsx` (B). It renders `<Explore figureId studentId target />` for the explore route.
- **Part A's only export to the app:** `src/student/Explore.tsx` → `export default function Explore(props: { figureId: string; studentId: string; target?: string })`. It is full-screen, owns its whole page, and offers a way back to `href.home()`.
- **`?target=<regionId>`:** on the first `F` press, the find-it challenge asks for this region. B's dashboard and demo panel use it to launch the hero beat.

## 5. Data and AI APIs (B implements, A consumes)

### `src/data/db.ts`: the app's database

A hardcoded seed, with writes persisted in IndexedDB (`idb-keyval`). All functions are async.

| Function | Called by | Behaviour |
|---|---|---|
| `listFigures(): Promise<Figure[]>` | B | seed + saved, newest first |
| `getFigure(id): Promise<Figure \| undefined>` | **A**, B | saved copy wins over the seed |
| `saveFigure(f: Figure): Promise<void>` | B | sets `updatedAt` |
| `deleteFigure(id): Promise<void>` | B | seed figures can't be deleted; rejects |
| `listClasses(): Promise<ClassRoom[]>` | B | |
| `listStudents(classId?): Promise<Student[]>` | B | |
| `getStudent(id): Promise<Student \| undefined>` | **A**, B | `'guest'` returns a guest with `DEFAULT_PREFS` and the name "Guest" |
| `saveStudentPrefs(id, prefs: StudentPrefs): Promise<void>` | **A** | For the guest, stored under `'guest'` |
| `listAssignments(classId?): Promise<Assignment[]>` | B | |
| `listSessions(f?: { studentId?: string; figureId?: string }): Promise<Session[]>` | B | newest first |
| `recordSession(s: Omit<Session, 'id' \| 'at'>): Promise<Session>` | **A** | called when a find-it succeeds |
| `resetDemo(): Promise<void>` | B | clears IndexedDB, back to the pristine seed |

### `src/data/ai.ts`: explanations and questions

| Function | Called by | Behaviour |
|---|---|---|
| `askQuestion(figure: Figure, region: Region \| null, question: string): Promise<string>` | **A** (`A` key) | Resolves in 0.8–10 s. **Never rejects**: on any failure it resolves to the region's explanation, or "I'm not sure. Try asking your teacher." |
| `explainRegion(figure: Figure, region: Region): Promise<string>` | B (editor) | Same guarantees |

## 6. Timeline and checkpoints

| Checkpoint | When | B delivers to `main` | A delivers to `main` | Joint check (both, 5 min) |
|---|---|---|---|---|
| **C0 — Contract** ✅ done |  already on `main` | B0: contract files, router, tokens, **working stubs** of `db.ts` and `ai.ts` (one "Test square" figure), placeholder `Explore.tsx`, images in `public/figures/` | nothing (A is writing `audio.ts` and `geometry.ts`, which need no contract) | `npm run build` and `npm test` pass on `main` |
| **C1 — Real data** | start + ~1:30 | B1 + B2: the real DB with the hand-traced **animal cell** and **Canada**, the seeded classroom, the AI answer table | A1–A3: explorer shell with pointer lock and the audio cursor | Open `#/explore/animal-cell?student=guest`, find the nucleus by ear |
| **C2 — Full loop** | start + ~4:00 | B3–B5: dashboard, editor, upload | A4–A6: keys, find-it with `recordSession`, the `A` question | Dashboard → Explore → find the mitochondrion → back to the dashboard → the new session tops Recent activity. Editor → rename a region → Preview → the new name is spoken. |
| **C3 — Freeze candidate** | 07:15 | B6–B8: export, about, demo panel, accessibility and polish | A7–A8: accessibility and polish | Full `DEMO.md` run-through on the demo laptop in airplane mode |
| **Freeze** | 08:00 | B9 (live Ollama) only if C3 is green | — | Tag `v1-hellohacks` |

Stubs rule: every function in §5 exists from C0 and returns contract-shaped data. So A is never blocked on B, and when B swaps a stub for the real implementation, A changes nothing.

## 7. Behaviour contract (so the two halves feel like one app)

- **Design tokens:** only use the tokens defined in `src/index.css` (see `DESIGN.md`), as Tailwind classes such as `bg-paper text-ink border-line`. No new colours.
- **High contrast:** B sets `data-contrast="high"` on `<html>` (a header toggle, remembered). A's screens must look right under it, and the tokens switch automatically.
- **Global keys:** B owns `Ctrl+Shift+D` (demo panel) only. Every other key inside the explorer belongs to A. B's global handler must ignore events while `document.pointerLockElement` is set.
- **Leaving the explorer:** A cancels speech, stops audio and releases pointer lock on unmount.
- **Visible text never says** "mock", "fake", "sample", "seed", "test data", "placeholder" or "hardcoded". Real products don't narrate where their data comes from, and neither does this one. (The stub "Test square" figure disappears at C1.)
