# 06 — Claude Skills and $0 Tech Stack (TouchSight / Say-It-Play-It / Receipts)

Date: 2026-09-25. Inputs: `05-top3-ranking.md` (the final top 3), `04-synergy-decision-matrix.md`, `skills-lock.json`, and the installed `.agents/skills/*/SKILL.md` and `.claude/skills/*` in this project.

Everything marked "verified" was checked on this date against the live GitHub repo, marketplace JSON, npm registry, Hugging Face file listing or ollama.com tag page. Sources are at the end.

**Ground rules this stack enforces**

- **Claude Code is the build tool, never a runtime dependency.** The shipped app makes zero calls to the Claude API or to any other paid or keyed API.
- **All inference runs locally.** It runs in the browser (Transformers.js, WebLLM, MediaPipe) or on the demo laptop (Ollama).
- **Every model is pre-downloaded and served from disk.** The demo works in airplane mode.
- **Skills are only used at build time.** They cost nothing beyond the team's existing Claude subscription.

---

## 1. TL;DR

| Layer | Choice |
|---|---|
| Workflow skills | **superpowers** (obra): brainstorming, writing-plans, executing-plans, subagent-driven-development, dispatching-parallel-agents, systematic-debugging, verification-before-completion, test-driven-development |
| Official Anthropic plugins | **frontend-design**, **skill-creator**, **claude-md-management**, **code-simplifier**, **typescript-lsp**, **playwright** (Microsoft MCP), **context7** (build-time docs only, anonymous tier) |
| Domain skill | **transformers-js** (the official Hugging Face skill, Transformers.js v4) |
| Already installed, keep | `pick-ui-library`, `prototype`, `emil-design-eng`, `animate`, `review-animations`, `mobile-native`, `apple-design`, plus **one** look skill: `minimalist-ui` *or* `design-taste-frontend` |
| Custom skills (write before the event) | `browser-ml-runtime`, `local-llm-structured-json`, `pose-action-engine` |
| Shared runtime core | Vite + React + TypeScript PWA; Transformers.js 4.x (WebGPU, then WASM); Ollama on the laptop, with WebLLM as the in-browser fallback; JSON Schema + Zod; Web Speech `speechSynthesis`, then kokoro-js; models served from `/public/models`; GitHub Pages hosting |
| Remove / never invoke | `higgsfield` (paid credits), `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit` (these depend on image generation, which routes to Higgsfield) |

---

## 2. Audit of skills already installed in this project

Install method: `npx skills` (vercel-labs/skills CLI). It writes `.agents/skills/` plus symlinks in `.claude/skills/`, and pins versions in `skills-lock.json`.

The `higgsfield` skill is a separate hand-copied folder in `.claude/skills/higgsfield`, with a CLI in `tools/higgsfield-cli`.

| Skill | Source | Verdict | Why |
|---|---|---|---|
| `pick-ui-library` | emilkowalski/skill | **KEEP (Hour 0–2)** | Picks the library per job (charts, toasts, state), so Claude stops bikeshedding. It only runs when invoked explicitly. |
| `prototype` | emilkowalski/skill | **KEEP (Hour 2–6)** | Builds several variants behind a picker. Ideal for the TouchSight explorer UI or the Receipts card layout. It only runs when invoked explicitly. |
| `emil-design-eng` | emilkowalski/skill | **KEEP (polish)** | UI polish principles that judges notice. |
| `animate` | emilkowalski/skill | **KEEP (polish)** | Motion for the "compiling…" screen, receipt cards and score pops. |
| `review-animations` / `improve-animations` | emilkowalski/skill | **KEEP (Hour 36+)** | A read-only audit pass before the demo freeze. |
| `mobile-native` | emilkowalski/skill | **KEEP, critical for TouchSight** | The judge explores on a phone. It covers the 100vh bug, tap highlight, pull-to-refresh hijack, long-press selection and PWA meta tags. |
| `apple-design` | emilkowalski/skill | KEEP (optional) | Gesture and sheet feel on touch; includes reduced-motion. |
| `find-animation-opportunities` | emilkowalski/skill | Optional | Only if time remains. |
| `minimalist-ui` | leonxlnx/taste-skill | **KEEP one look skill** | Clean editorial style that suits TouchSight and Receipts. |
| `design-taste-frontend` | leonxlnx/taste-skill | Alternative look skill | Anti-slop landing-page rules. Pick **either** this **or** `minimalist-ui`, because two style skills fight each other. |
| `high-end-visual-design` | leonxlnx/taste-skill | Optional | For the pitch landing page only. |
| `industrial-brutalist-ui` | leonxlnx/taste-skill | Optional (Receipts only) | Its "declassified data" look could suit a fact-check dashboard. |
| `full-output-enforcement` | leonxlnx/taste-skill | Skip | Pushes whole-file rewrites, which are slow and burn usage in a 48h sprint. |
| `ask-sonner` | emilkowalski/skill | Situational | Only if `pick-ui-library` picks Sonner for toasts. |
| `animation-vocabulary` | emilkowalski/skill | Skip | Naming help, not building help. |
| `animate-expo`, `write-swift` | emilkowalski/skill | **Skip** | The builds are web PWAs, not React Native or Swift. |
| `gpt-taste` | leonxlnx/taste-skill | Skip | GSAP scroll-landing-page aesthetics; irrelevant to app demos. |
| `stitch-design-taste` | leonxlnx/taste-skill | Skip | Targets Google Stitch DESIGN.md. |
| `redesign-existing-projects` | leonxlnx/taste-skill | Skip | There is no existing project to redesign. |
| `design-taste-frontend-v1` | leonxlnx/taste-skill | Skip | Duplicate of v2. |
| **`higgsfield`** | local `.claude/skills/higgsfield` + `tools/higgsfield-cli` | **EXCLUDE (paid)** | It calls the Higgsfield API with `HF_API_KEY_ID`/`HF_API_KEY_SECRET`, and its own SKILL.md says "every generation spends the user's credits". |
| **`imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit`** | leonxlnx/taste-skill | **EXCLUDE** | They require generating images first. Claude Code has no native image generation, so in this repo the `higgsfield` description explicitly makes them route to the paid API. |

**Action:** delete or disable the paid path before the event so nobody triggers it at 3 a.m.:

```powershell
Remove-Item -Recurse -Force .claude\skills\higgsfield, tools\higgsfield-cli
npx skills remove imagegen-frontend-web imagegen-frontend-mobile image-to-code brandkit gpt-taste stitch-design-taste redesign-existing-projects design-taste-frontend-v1 animate-expo write-swift full-output-enforcement
```

If the `remove` subcommand name differs in your CLI version, run `npx skills --help`, or delete the symlinks in `.claude/skills/` by hand.

Fewer skills also means fewer descriptions competing for auto-trigger.

---

## 3. Recommended skills, verified

Credibility key:
- **OFFICIAL** means Anthropic- or vendor-maintained.
- **MKT** means listed in Anthropic's `claude-plugins-official` marketplace (314 plugins in `marketplace.json`, verified today).
- Star counts are as of 2026-09-25.

### 3.1 Planning and workflow (Hour 0–4, and whenever you start a new chunk)

| Skill | Source | What it does | Credibility | Install |
|---|---|---|---|---|
| **superpowers** (bundle): `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `systematic-debugging`, `verification-before-completion`, `test-driven-development`, `using-git-worktrees`, `requesting-code-review` | https://github.com/obra/superpowers | Turns "vibe coding" into spec, then plan, then small verified tasks. It has a structured debugging loop, and it refuses to claim "done" without running the check. | About 292k stars; listed in MKT (source pinned to obra/superpowers) | `/plugin install superpowers@claude-plugins-official` |
| **claude-md-management** | anthropics/claude-plugins-official `plugins/claude-md-management` | Audits and updates CLAUDE.md with session learnings. Keeps the three people's Claude sessions consistent. | OFFICIAL, MKT | `/plugin install claude-md-management@claude-plugins-official` |
| **skill-creator** | anthropics/claude-plugins-official `plugins/skill-creator` (also `anthropics/skills/skills/skill-creator`) | Scaffolds and evaluates the custom skills in §4. | OFFICIAL | `/plugin install skill-creator@claude-plugins-official` |

How to use superpowers in a 48h window:
- Run `brainstorming` **once**, 20 minutes max, on theme reveal. It picks the idea using the file 05 mapping table.
- Then run `writing-plans` to produce `docs/plan.md` with the 5–6 chunks from file 05.
- Each teammate runs `executing-plans` on their own chunk.
- Skip the full TDD ceremony for UI. **Do** use `test-driven-development` for the three pure-logic cores: the DSL validator and engine rules, the Receipts verdict tolerance bands, and TouchSight hit-testing.

### 3.2 Build (Hour 2–36)

| Skill | Source | What it does | Credibility | Install |
|---|---|---|---|---|
| **transformers-js** | https://github.com/huggingface/skills `skills/transformers-js` | Transformers.js v4 usage: pipelines, WebGPU and WASM, dtype and quantization, `dispose()` hygiene, plus a `references/` folder | OFFICIAL (Hugging Face), about 11k stars, Apache-2.0 | `npx skills add huggingface/skills --skill transformers-js -a claude-code -y` (HF's marketplace only exposes `hf-cli` as a plugin, so use the skills CLI your repo already uses) |
| **frontend-design** | anthropics/claude-plugins-official `plugins/frontend-design` (same skill as `anthropics/skills/skills/frontend-design`) | Distinctive, non-generic UI | OFFICIAL, MKT | `/plugin install frontend-design@claude-plugins-official` |
| **typescript-lsp** | anthropics/claude-plugins-official `plugins/typescript-lsp` | Gives Claude real type errors and go-to-definition instead of guessing | OFFICIAL | `npm i -g typescript typescript-language-server`, then `/plugin install typescript-lsp@claude-plugins-official` |
| **context7** (MCP) | anthropics/claude-plugins-official `external_plugins/context7` (Upstash) | Pulls current docs into context: Transformers.js **4.x**, Phaser **4.x**, DuckDB-WASM, WebLLM. Claude's training data predates several of these majors. | MKT. **An API key is optional**: the anonymous tier is rate-limited and needs no card. | `/plugin install context7@claude-plugins-official` |
| Installed: `pick-ui-library`, `prototype`, `mobile-native`, `minimalist-ui` | emilkowalski/skill, leonxlnx/taste-skill | See §2 | Already pinned in `skills-lock.json` | Already installed |

**Caveat on context7:** it needs the internet *at build time*. If venue Wi-Fi dies, the team loses it but not the app. Pre-fetch key docs into `docs/vendor/` the week before (see §6).

### 3.3 Test and debug (continuous, heavy from Hour 30)

| Skill | Source | What it does | Credibility | Install |
|---|---|---|---|---|
| **playwright** (MCP) | anthropics/claude-plugins-official `external_plugins/playwright` (Microsoft) | Claude drives a real browser: clicks through the demo path, screenshots, reads the console. Use it for a scripted "demo smoke test". | MKT, Microsoft | `/plugin install playwright@claude-plugins-official` |
| **webapp-testing** (alternative) | https://github.com/anthropics/skills `skills/webapp-testing` | Python Playwright scripts, with a `with_server.py` server-lifecycle helper | OFFICIAL, about 178k-star repo | `/plugin marketplace add anthropics/skills`, then `/plugin install example-skills@anthropic-agent-skills`. This installs the whole example bundle; if you want only this skill, copy `skills/webapp-testing` into `.claude/skills/`. |
| **chrome-devtools-mcp** (optional) | https://github.com/ChromeDevTools/chrome-devtools-mcp (listed in MKT) | Performance traces and console with source maps. Useful for WebGPU stalls and fps drops in the pose game. | OFFICIAL (Chrome DevTools team), MKT | `/plugin install chrome-devtools-mcp@claude-plugins-official` |
| superpowers `systematic-debugging` + `verification-before-completion` | (bundle above) | Root-cause loop; "prove it works" before moving on | — | — |

Choose **one** of playwright or webapp-testing. Playwright MCP needs no Python, so it is the default on Windows.

### 3.4 Polish and pitch (Hour 36–46)

| Skill | Source | Use |
|---|---|---|
| `code-simplifier` | anthropics/claude-plugins-official (OFFICIAL) | A last cleanup pass on the recently changed files before the freeze. `/plugin install code-simplifier@claude-plugins-official` |
| `review-animations`, `emil-design-eng`, `animate` | installed | Motion and polish pass. |
| `pptx` (optional) | anthropics/skills `document-skills` (OFFICIAL) | Pitch deck, if the event requires slides. `/plugin install document-skills@anthropic-agent-skills` |

---

## 4. Custom project skills to write before the hackathon

Write these with `skill-creator` in the week before the event. Encode knowledge that will otherwise be re-derived, wrongly, at 2 a.m.

Put them in `.claude/skills/<name>/SKILL.md` and commit them. Each one should be backed by a **working mini-demo** in `spikes/`, so the skill documents code that is known to run.

### 4.1 `browser-ml-runtime` (shared by all 3 ideas)

```markdown
---
name: browser-ml-runtime
description: How this repo loads and runs in-browser ML (Transformers.js 4.x, WebLLM, MediaPipe) offline — local model paths, WebGPU→WASM fallback, dtype choice per backend, Web Worker wrapping, warm-up, progress UI, and disposal. Use whenever adding or debugging any model load, inference call, "model not found", slow first run, out-of-memory, or offline/airplane-mode behavior.
---
```

Outline:
1. **Golden rule.**
   - Set `env.allowRemoteModels = false` and `env.localModelPath = '/models/'` in production builds. Models live in `public/models/<repo-id>/`.
   - The dev build may use the HF Hub. The demo build never does.
2. **Backend detection.**
   - Check `navigator.gpu?.requestAdapter()`. If an adapter comes back, use `device:'webgpu'` with fp16 or q4f16. Otherwise use `device:'wasm'` with q8 or int8.
   - A table of which dtype files exist per model (see §5.4).
3. **Always run inference in a Web Worker.** Include a `worker.ts` template with a `postMessage` protocol (`load`, `progress`, `ready`, `run`, `result`, `error`).
4. **Warm-up.**
   - Run one dummy inference at app start and show a progress bar using the `progress_callback`.
   - Never do a first load on stage.
5. **Memory.**
   - Keep one pipeline per worker.
   - Call `dispose()` on swap.
   - Never load Florence-2 and WebLLM in the same tab at the same time on an 8 GB laptop.
6. **Cache.**
   - A service worker (vite-plugin-pwa / Workbox) precaches the app shell and uses `CacheFirst` for `/models/**`.
   - Include a checklist to verify in DevTools, under Application, then Cache Storage.
7. **Known pitfalls.**
   - Florence-2 needs the `Florence2ForConditionalGeneration` + `AutoProcessor` API, not `pipeline()`.
   - Include `post_process_generation` usage for `<OCR_WITH_REGION>`.
   - A Windows Chrome GPU blocklist can hide WebGPU; check `chrome://gpu`.
8. **Snippets.** Florence-2 OCR-with-regions, SlimSAM point prompt, whisper-base ASR, kokoro-js TTS. Each is copied from the working `spikes/`.

### 4.2 `local-llm-structured-json` (Say-It-Play-It and Receipts; optional for TouchSight "ask")

```markdown
---
name: local-llm-structured-json
description: How this repo gets guaranteed-valid JSON from a local LLM — Ollama /api/chat with `format: <JSON Schema>` (primary, on the demo laptop) and WebLLM `response_format: {type:'json_object', schema}` (in-browser fallback), Zod validation, one repair retry, enum-closed catalogs, and a cached-output fallback. Use when writing or debugging the game compiler, the claim→query parser, prompts, schemas, or any LLM call. The shipped app must never call a cloud LLM.
---
```

Outline:
1. **Single source of truth.** Define the Zod schema in TS, then `z.toJSONSchema()` (Zod 4). The same schema feeds Ollama `format`, WebLLM `response_format`, and runtime validation.
2. **Ollama call template.**
   - `POST http://localhost:11434/api/chat` with `stream:false`, `format`, `options:{temperature:0}`, and `think:false` for Qwen3/3.5.
   - CORS: set `OLLAMA_ORIGINS=*` (or the Pages origin) before `ollama serve`.
   - Keep-alive: send `keep_alive: '30m'` so the model stays in RAM during the demo.
3. **Enum-closing.** Generate schema enums from the data catalog (dataset IDs, metric names, pose actions, entity types). Out-of-catalog output then becomes impossible. Add an explicit `"out_of_scope"` enum value.
4. **Pipeline.** Validate with Zod. On failure, make one repair retry with the error message appended. Then fall back to the nearest cached example (keyed by embedding or keyword) and **say so on screen**.
5. **Provider ladder.** Try Ollama `qwen3:4b-instruct-2507`. If `/api/tags` fails, use WebLLM `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`. If WebGPU is missing, use a cached result.
6. **Timing budget.** Show a "compiling…" UI. Hard-timeout at 25 s, then use the cache.
7. **Prompt patterns.** A few-shot block of 3 examples, and a system prompt that forbids prose.
8. **Test.** A `scripts/llm-eval.ts` runs 20 fixture sentences and reports the schema-pass rate and the semantic-pass rate.

### 4.3 `pose-action-engine` (Say-It-Play-It; also reusable for any MediaPipe idea)

```markdown
---
name: pose-action-engine
description: This repo's MediaPipe Pose Landmarker (tasks-vision) game loop — camera setup, VIDEO running mode at 30 fps, landmark smoothing, the pose-action detector library (squat, jump, lean L/R, clap, arms-up, punch), calibration, debouncing, and binding actions to the deterministic game DSL. Use when touching camera input, pose detection, action thresholds, game-loop timing, or when a player's move "doesn't register".
---
```

Outline:
1. **Setup.**
   - `FilesetResolver.forVisionTasks('/mediapipe/wasm')`, served locally, not from the CDN.
   - `pose_landmarker_lite.task` (5.8 MB) from `/models/`.
   - `delegate:'GPU'`, with a CPU fallback.
2. **Loop.** Use `requestVideoFrameCallback` for detection and `requestAnimationFrame` for rendering, with decoupled timestamps. Never call `detectForVideo` twice with the same timestamp.
3. **Normalization.** Use hip-center origin and shoulder-width scale so the thresholds work at any distance from the camera.
4. **Action table.** For each action: landmark indices, the formula, the threshold, and the debounce (ms). Examples: squat is the hip-y drop > 0.25 × torso length; clap is wrist distance < 0.3 × shoulder width.
5. **Calibration.** A 3-second "stand still" step captures the baseline.
6. **Test harness.** Recorded landmark JSON fixtures in `fixtures/poses/*.json`, and unit tests per action. This lets the logic be tested with no camera.
7. **Venue pitfalls.** Backlight and windows behind the player; two people in frame (`numPoses:1`, largest bbox); a laptop too close (require full body visible, or offer an upper-body-only action set).

---

## 5. Runtime stacks ($0)

### 5.1 Shared core (build it once; pivot on theme reveal)

This is scaffolded and tested **before** the event as a template repo, `hack-core`.

| Concern | Choice | Version (npm, verified 2026-09-25) | Notes |
|---|---|---|---|
| Build / dev server | Vite + TypeScript | `vite` 8.3.1 | `vite build && vite preview` is the offline demo server |
| UI shell | React + Tailwind | — | Most installed skills (emil, taste, pick-ui-library) assume React |
| PWA / offline | `vite-plugin-pwa` (Workbox) | — | Precache the shell; `CacheFirst` for `/models/**` |
| In-browser ML | `@huggingface/transformers` | **4.3.0** (v4 has the new C++ WebGPU runtime) | WebGPU first, then WASM |
| In-browser LLM (fallback) | `@mlc-ai/web-llm` | 0.2.85 | JSON-schema mode via XGrammar |
| Laptop LLM (primary) | Ollama + the `ollama` JS client | client 0.6.3 | Structured outputs with `format: <schema>` |
| Vision (camera) | `@mediapipe/tasks-vision` | 1.0.1 | Pose, Hand and Face landmarkers |
| Schemas | `zod` | 4.6.5 | Zod → JSON Schema → LLM `format` and validation |
| TTS | `window.speechSynthesis` (prefer voices with `localService === true`), with `kokoro-js` 1.2.1 as a higher-quality, offline, model-based option | — | Windows, macOS and Android ship local voices |
| STT (Receipts; optional elsewhere) | Web Speech `SpeechRecognition`, with Transformers.js `whisper-base` offline | — | See the caveat in 5.4 |
| Storage | IndexedDB (via `idb-keyval`) + Cache Storage; URL-hash sharing for small JSON | — | No backend at all |
| Hosting | **GitHub Pages** (no card) | — | See the hosting table in §5.5 |
| Testing | Vitest (logic) + Playwright MCP (demo path) | — | — |

Why this core pivots cleanly:
- All three ideas are "one AI step, then a deterministic runtime" (patterns P3/P4).
- The only per-idea pieces are the model files and the domain engine.

### 5.2 Per-idea stacks

#### #1 TouchSight

| Part | Choice | Size (verified) | Runtime |
|---|---|---|---|
| Regions + labels | `onnx-community/Florence-2-base-ft`: tasks `<OCR_WITH_REGION>`, `<OD>`, `<DENSE_REGION_CAPTION>` | q4f16 set about **223 MB** (vision 62.4 + encoder 25.7 + decoder 56.2 + embed 78.8). The WASM int8 set is about 275 MB. | Transformers.js (WebGPU; the WASM path is slow, about tens of seconds per image, which is acceptable because it runs once) |
| Teacher click-to-segment | `Xenova/slimsam-77-uniform` | quantized **about 14 MB** (vision encoder 8.9 + decoder 4.9) | Transformers.js |
| OCR fallback | `tesseract.js` 7.0.0 + `eng.traineddata` | about 10–20 MB (the fast/best data variants) | WASM |
| "What is this?" (optional) | Ollama `qwen2.5vl:3b` (3.2 GB) or `qwen2.5vl:7b` (6.0 GB); newer: `qwen3.5:4b` (3.4 GB, image input) | — | Laptop only. The phone explorer works without it. |
| Explorer audio | Web Audio `StereoPannerNode` + `OscillatorNode` edge ticks; `speechSynthesis` labels; `navigator.vibrate` (Android only) | 0 MB | Browser |
| Export | Hand-built SVG (swell paper / embosser) + `qrcode` npm | — | Browser |
| Data | Sample figures from **OpenStax** (CC BY 4.0, attribute) and Wikimedia Commons (check each licence) | — | Pre-downloaded |
| Storage | Region JSON in IndexedDB; share via URL hash or QR | — | — |

Architecture: preprocess on the **laptop** (WebGPU), then push the region JSON to the **phone**, which does DOM/SVG hit-testing only.
- The phone never loads a model, so there is no mobile-GPU risk.
- To transfer, use a QR code containing the region JSON (compressed with `lz-string`), or open the same Pages URL with the JSON in the hash.

#### #2 Say-It-Play-It

| Part | Choice | Size (verified) | Runtime |
|---|---|---|---|
| Body input | MediaPipe `pose_landmarker_lite.task` (the `full` variant is 9.4 MB if accuracy is lacking) | **5.8 MB** | tasks-vision, GPU delegate with CPU fallback |
| Sentence → game DSL | Ollama **`qwen3:4b-instruct-2507`** (2.5 GB, non-thinking, fast on CPU). GPU laptops can upgrade to `qwen2.5:7b` (4.7 GB) or `qwen3:8b` (5.2 GB). | 2.5 GB | Ollama `format` = the DSL JSON Schema |
| In-browser fallback | WebLLM `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` (about 1.6 GB VRAM) or `Qwen3-4B-q4f16_1-MLC` (about 3.4 GB VRAM) | — | WebGPU only |
| Engine | Plain Canvas 2D with its own tiny entity loop (recommended: deterministic, trivially testable). Or Phaser: **npm `latest` is now Phaser 4.2.1**, so pin `phaser@3` if you rely on Phaser 3 tutorials. | — | Browser |
| Assets | **Kenney.nl** sprite and audio packs (CC0) | about 5–20 MB | Pre-downloaded |
| SFX / music | Web Audio; optionally `tone.js` | — | — |
| Share / remix | DSL JSON → `lz-string` → URL hash + QR | — | — |
| Storage | IndexedDB scoreboard and the 6 cached showcase games (JSON files in `public/games/`) | — | — |

#### #3 Receipts

| Part | Choice | Size (verified) | Runtime |
|---|---|---|---|
| STT (primary) | Web Speech `SpeechRecognition` (Chrome/Edge) | 0 MB | **Network-dependent**: audio goes to Google's server unless `processLocally:true` works (Chrome's on-device mode; it was flag-gated and regressed in 2025–26, so treat it as a bonus). |
| STT (offline) | Transformers.js `onnx-community/whisper-base`, run as chunked push-to-talk | int8 about **77 MB** (encoder 23 + merged decoder 54) | WebGPU or WASM |
| Claim → query | Ollama `qwen3:4b-instruct-2507` with an **enum-closed** schema `{dataset, metric, geography, period_a, period_b, comparator, claimed_value}` | 2.5 GB | Laptop |
| Compute | `@duckdb/duckdb-wasm` over pre-downloaded Parquet/CSV. Note that npm `latest` is `1.33.1-dev57.0`, a dev build, so pin it and test it. | **`duckdb-eh.wasm` = 35.9 MB** | Browser |
| Compute fallback | Precomputed JSON tables plus TS query functions per comparator | KBs | If DuckDB-WASM misbehaves, the SQL display becomes a "query plan" display |
| Verdict | Deterministic tolerance bands in TS, unit-tested | — | — |
| Chart receipt | `@observablehq/plot` 0.6.17 | — | — |
| Phrasing | The same Ollama model, **after** the verdict is fixed; or a template string | — | — |

Data sources: all are US federal works (public domain). Pre-download them as files, so no keyed API is used at runtime.

| Dataset | Source | Format |
|---|---|---|
| State unemployment | BLS LAUS | Flat files at download.bls.gov/pub/time.series/la/ (the BLS API v1 needs no key, but avoid it at runtime) |
| Crime rates | FBI Crime Data Explorer | CSV bulk downloads |
| Income and population | Census ACS 1-year | data.census.gov table download (the API key is free and needs no card, but do not use it at runtime) |
| State temperature | NOAA NCEI "Climate at a Glance" | CSV per state |
| Gas prices | EIA weekly retail gasoline | XLS/CSV history download (the EIA API needs a free key; avoid it) |

### 5.3 Shared vs specific, at a glance

| Component | TouchSight | Say-It-Play-It | Receipts |
|---|:-:|:-:|:-:|
| Vite/React/TS PWA + offline SW | ✓ | ✓ | ✓ |
| `browser-ml-runtime` (Transformers.js worker) | ✓ Florence/SlimSAM | (WebLLM fallback) | ✓ whisper |
| `local-llm-structured-json` (Ollama + Zod) | optional | ✓ | ✓ |
| MediaPipe tasks-vision | — | ✓ Pose | — |
| speechSynthesis / kokoro-js | ✓ | ✓ (announcer) | ✓ (read verdict) |
| URL-hash + QR sharing | ✓ | ✓ | ✓ |
| Domain engine | hit-test + audio | game DSL engine | verdict + DuckDB |

### 5.4 Model download sizes and dtype cheat-sheet

| Model | WebGPU dtype | WASM dtype | Approx. MB |
|---|---|---|---|
| Florence-2-base-ft | q4f16 / fp16 mix (per the model card) | int8 | 223 / 275 |
| SlimSAM-77-uniform | fp16 | quantized | 21 / 14 |
| whisper-base | fp16 (about 145) or q4 | quantized/int8 | about 77 (int8) |
| Kokoro-82M-v1.0-ONNX (kokoro-js) | fp32 on WebGPU (the kokoro-js recommendation) | q8 (`model_quantized` 92.4 MB, or q8f16 86 MB) | 86–326 |
| MediaPipe pose lite / full | — | — | 5.8 / 9.4 |
| MediaPipe hand landmarker | — | — | 7.8 |
| Ollama qwen3:4b-instruct-2507 | — | — | 2,500 |
| Ollama qwen2.5:7b / qwen3:8b | — | — | 4,700 / 5,200 |
| Ollama qwen2.5vl:3b / :7b | — | — | 3,200 / 6,000 |
| WebLLM Qwen2.5-1.5B q4f16 | VRAM 1,630 | n/a (WebGPU only) | about 1,000 download (approx.) |

Laptop tiers:
- **A (GPU / Apple Silicon, 16 GB or more):** all of the above; `qwen2.5:7b` for the compiler.
- **B (no discrete GPU, 8–16 GB):** `qwen3:4b-instruct-2507` on CPU (expect about 10–30 s compiles; show the animation). Florence runs on WASM, *precomputed before the demo*. No WebLLM.
- **C (weak or 8 GB):** a UI and engine dev machine only. It runs against the cached JSON fixtures, not live models.

### 5.5 Hosting ($0, no card)

| Host | Card? | Limits that matter | Verdict |
|---|---|---|---|
| **GitHub Pages** | No | 100 MB per file (git), about 1 GB per site | **Default.** Commit the models except the >100 MB ones (the Florence q4f16 files are each <100 MB, so they fit). |
| Cloudflare Pages | No card for Free (per public reports; confirm at signup) | **25 MiB max per file** (verified), so Florence, whisper and kokoro files will not upload | Use it for the app shell only, and load models from the HF Hub CDN online. |
| Vercel Hobby | No card | Non-commercial only | Fine for the app shell. |
| HF Hub (as model CDN) | No | Public repos, free | Online fallback for model files. The **demo still serves them locally.** |

Note: the deployed site calling the **laptop's** Ollama needs `OLLAMA_ORIGINS=https://<user>.github.io`. On stage, use `vite preview` on localhost, which is simpler and needs no internet.

---

## 6. Logistics playbook

### 6.1 Pre-hackathon checklist (the week before)

**Day -7 to -5: tooling (every laptop)**
- [ ] Node 22 LTS, Git, Chrome **and** Edge (a second WebGPU implementation to fall back to). Python 3.11 only if you choose `webapp-testing`.
- [ ] Claude Code updated. Run the install block in §8. Confirm `/plugin` lists the plugins and `/skills` (or the session skill list) shows the skills.
- [ ] Ollama for Windows/macOS. Run `ollama pull qwen3:4b-instruct-2507` everywhere. On GPU machines also pull `qwen2.5:7b` and `qwen2.5vl:3b`.
- [ ] `npm i -g typescript typescript-language-server`.
- [ ] `pip install -U huggingface_hub` (for `hf download`), **or** use the Node pre-fetch script from `browser-ml-runtime`.
- [ ] Check `chrome://gpu`: WebGPU should show "Hardware accelerated". Record the tier (A/B/C) for each laptop in `docs/machines.md`.

**Day -5 to -3: spikes (one per idea, 2–3 h each, in the `hack-core` template)**
- [ ] `spikes/florence`: OCR_WITH_REGION on 4 test figures (cell, US map, line graph, circuit). Save the region JSONs as fixtures.
- [ ] `spikes/pose`: squat, jump and clap detection at 30 fps. Record landmark fixtures.
- [ ] `spikes/ollama-json`: DSL schema and claim schema, 20 fixture sentences each. Measure the pass rate and latency on each laptop.
- [ ] `spikes/whisper` + `spikes/tts`: push-to-talk ASR and kokoro/speechSynthesis.
- [ ] `spikes/duckdb`: load 1 dataset and run one comparator query.

**Day -3 to -2: encode knowledge**
- [ ] Write the 3 custom skills (§4) with `skill-creator`, based on the working spikes.
- [ ] Write the CLAUDE.md (template in 6.2).
- [ ] Pre-download all model files into `public/models/`. Run `npm run build && npm run preview` **with Wi-Fi off** and confirm each spike works.
- [ ] Download datasets (BLS, FBI, ACS, NOAA, EIA) into `data/raw/`, plus OpenStax figures and Kenney packs.
- [ ] Mirror key docs to `docs/vendor/` (Transformers.js v4 README and examples, tasks-vision pose guide, Ollama structured-outputs doc, WebLLM JSON-mode doc, DuckDB-WASM quickstart) for when Wi-Fi fails.
- [ ] TouchSight: email a TVI or campus disability-services office for a quote or a test session (pattern P8).

**Day -1: pack**
- [ ] Copy the whole repo, including models, to a **USB drive** (about 3–10 GB with Ollama blobs from `~/.ollama/models`).
- [ ] Pack a lapel/USB mic (Receipts), a phone and USB cable (TouchSight), and a ring light (Say-It-Play-It, to fix backlighting).
- [ ] Charge a phone hotspot as a Wi-Fi backup for Claude Code itself.

### 6.2 CLAUDE.md template (repo root)

```markdown
# <Project> — hackathon build (48h)

## Non-negotiables
- $0 runtime: the app NEVER calls Claude/OpenAI/any keyed or paid API. LLM = local Ollama (localhost:11434) with WebLLM fallback. No `fetch` to external hosts at runtime.
- Offline demo: production build uses `env.allowRemoteModels=false`, models under /public/models. Must work in airplane mode.
- Never use the higgsfield / imagegen skills (paid). Assets = Kenney (CC0), OpenStax (CC BY 4.0), hand-made SVG.

## Stack
Vite + React + TS + Tailwind, vite-plugin-pwa. Transformers.js 4.x in a Web Worker. Zod 4 schemas → JSON Schema → Ollama `format`. Vitest for logic.

## Commands
- dev: `npm run dev` · demo: `npm run build && npm run preview` · test: `npm test` · llm eval: `npm run eval:llm`
- Ollama: `set OLLAMA_ORIGINS=*` then `ollama serve`; model `qwen3:4b-instruct-2507`

## Architecture
src/core (shared: ml worker, llm client, tts, share) · src/app (idea-specific) · src/engine (deterministic, pure, unit-tested) · fixtures/ (cached model outputs = demo fallback)

## Skills to use
- Planning: superpowers brainstorming → writing-plans → executing-plans
- ML code: browser-ml-runtime, transformers-js · LLM calls: local-llm-structured-json · camera: pose-action-engine
- UI: pick-ui-library, prototype, minimalist-ui, mobile-native (TouchSight) · polish: emil-design-eng, animate, review-animations
- Bugs: systematic-debugging; before saying done: verification-before-completion

## Rules
- Every model output has a cached fixture fallback and a visible "using cached result" state.
- Keep engine code pure (no DOM) so it is testable.
- Commit every working increment; tag `demo-safe-N` whenever the demo path passes.
- Ownership: <A> = model/ML, <B> = engine/logic, <C> = UI/pitch. Don't edit another owner's folder without saying so.
```

### 6.3 Hour-by-hour 48h plan (mapped to skills)

Team roles:
- **ML**: models and LLM.
- **ENG**: the deterministic engine and data.
- **UX**: UI, pitch and demo.

For a solo builder, run ML, then ENG, then UX sequentially and cut §6.3 optional items.

| Hours | Goal | Who | Skills |
|---|---|---|---|
| 0–1 | Theme reveal. Choose the idea with the 05 mapping table. Fork `hack-core`. | All | superpowers `brainstorming` (timebox 20 min) |
| 1–2 | Plan the 5–6 chunks into `docs/plan.md`; assign owners; update CLAUDE.md | All | `writing-plans`, `claude-md-management` |
| 2–8 | **The crux chunk first**: TouchSight preprocessing to region JSON / the SIPI DSL and schema / the Receipts datasets and catalog | ML + ENG | `executing-plans`, `browser-ml-runtime`, `local-llm-structured-json`, `transformers-js`, `test-driven-development` (DSL/verdict) |
| 2–8 | UI skeleton and 2–3 layout variants; choose one | UX | `pick-ui-library`, `prototype`, `frontend-design`, `minimalist-ui` |
| 8–14 | Deterministic runtime: hit-test and audio / game engine and pose actions / verdict engine and charts | ENG | `pose-action-engine`, `test-driven-development`, `typescript-lsp` |
| 8–14 | Wire the model output into the UI through the **fixtures first** | UX + ML | `subagent-driven-development` |
| 14–18 | **Milestone M1: the end-to-end demo path works from fixtures.** Tag `demo-safe-1`. | All | `verification-before-completion`, playwright MCP smoke run |
| 18–24 | Live model path: Ollama compile / live Florence / live STT, with repair and timeouts | ML | `systematic-debugging`, `local-llm-structured-json` |
| 18–24 | Sleep in shifts (at least 4 h each) | — | — |
| 24–30 | Differentiators: remix and QR share (SIPI); SVG embosser export (TS); out-of-scope state and scoreboard (Receipts) | ENG + UX | `executing-plans` |
| 30–34 | **Milestone M2: airplane-mode run on the demo laptop.** Fix what breaks. Tag `demo-safe-2`. | All | `verification-before-completion`, chrome-devtools-mcp (perf) |
| 34–40 | Polish: motion, sound, mobile feel, accessibility pass (screen reader for TouchSight) | UX | `emil-design-eng`, `animate`, `mobile-native`, `review-animations` |
| 34–40 | Record a backup demo video; write the architecture slide | ML | (`pptx` if slides are required) |
| 40–44 | **Feature freeze.** `code-simplifier` pass on changed files; README with the $0 cost table | ENG | `code-simplifier` |
| 44–47 | Rehearse the 3-minute script 5 times with the fallback drills (6.4) | All | — |
| 47–48 | Submit (Devpost video, repo, deployed Pages link) | UX | — |

For a 24h event, compress the plan:
- Hours 0–2: plan.
- Hours 2–10: crux plus skeleton.
- Hour 10: M1.
- Hours 10–16: live path.
- Hour 16: M2.
- Hours 16–21: polish.
- Hours 21–24: rehearse.
- Drop the stretch features.

### 6.4 Demo-day offline fallback plan

| Failure | Detection | Fallback (pre-built, one keypress) |
|---|---|---|
| Venue Wi-Fi down | — | Nothing changes. The demo runs from `vite preview` on localhost, with models in `/public/models` and Ollama local. Claude Code itself needs the internet, so use the phone hotspot for build time only. |
| WebGPU unavailable on the demo machine | `navigator.gpu` is null | Worker auto-switches to WASM. For TouchSight, show the **precomputed** region JSON ("processed earlier") and the live explorer still works. |
| Ollama slow or down | `/api/tags` fails, or a 25 s timeout | WebLLM (if WebGPU is available), then **cached outputs**: 6 SIPI showcase games and 20 Receipts parsed claims. The UI labels them honestly. |
| Judge's game idea is outside the DSL | Schema-valid but mapped verbs | An on-screen "'kick' mapped to 'jump'". If the 10 s headless sim fails, launch the nearest cached game. |
| Noisy room kills STT (Receipts) | Low confidence or garbage text | Push-to-talk lapel mic, then whisper-base, then the **pre-recorded 60 s debate clip** (primary input), then a typed claim box. |
| Camera or lighting issue (SIPI) | Pose confidence < 0.5 | Ring light; the "upper-body mode" action subset; a keyboard-controls debug mode. |
| Phone issue (TouchSight) | — | The laptop touchscreen or trackpad runs the same explorer; a second phone is preloaded with the region JSON. |
| Total failure | — | The backup demo video (recorded at hours 34–40) on the desktop, plus a USB copy. |

**Pre-demo ritual (T−30 min):**
1. Reboot.
2. Turn Wi-Fi off.
3. `ollama run <model> "hi"` to warm the model into RAM (`keep_alive 30m`).
4. Open the app and trigger the warm-up inference.
5. Set the volume and plug in the mic.
6. Close all other tabs (memory).

### 6.5 Cost table: proving $0 at runtime

| Item | Cost | Card required? | Runtime network? |
|---|---|---|---|
| Transformers.js, WebLLM, MediaPipe tasks-vision, DuckDB-WASM, Tesseract.js, kokoro-js, Zod, Observable Plot, React, Vite | $0 (Apache-2.0 / MIT / BSD) | No | No (served locally) |
| Model weights: Florence-2 (MIT), SlimSAM (Apache-2.0), Whisper (MIT), Kokoro-82M (Apache-2.0), MediaPipe (Apache-2.0), Qwen2.5/Qwen3 (Apache-2.0 for the sizes used), Qwen2.5-VL-3B/7B (Qwen licence / Apache-2.0; check the model card) | $0 | No | No (pre-downloaded) |
| Ollama | $0 (MIT) | No | No |
| Browser `speechSynthesis` | $0 | No | No with local voices; some Chrome "Google" voices are online, so filter on `localService` |
| Browser `SpeechRecognition` (Receipts only) | $0, no key | No | **Yes** (Google server) unless on-device works. whisper-base is the offline path. |
| Datasets (BLS, FBI, Census, NOAA, EIA) | $0, public domain | No | No (pre-downloaded) |
| Assets: Kenney (CC0), OpenStax (CC BY 4.0) | $0 | No | No |
| Hosting: GitHub Pages | $0 | No | Only for the online link |
| Claude Code + skills + plugins (build time only) | Existing subscription; skills are free | — | Build time only, never shipped |
| context7 MCP (build time only) | $0 anonymous tier | No | Build time only |
| **Total runtime API spend** | **$0** | — | The demo runs fully offline |

---

## 7. Skip list

| Skill / tool | Why skip |
|---|---|
| `higgsfield` (local) + `tools/higgsfield-cli` | Paid: it spends Higgsfield credits and needs API keys. |
| `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit` | Their workflow requires generating images, and in this repo that routes to the paid Higgsfield skill. |
| `gpt-taste`, `stitch-design-taste`, `redesign-existing-projects`, `design-taste-frontend-v1`, `full-output-enforcement` | Landing-page, Stitch or redesign specific, a duplicate, or pushes whole-file output. They add trigger noise. |
| `animate-expo`, `write-swift` | Not building native apps. |
| `claude-api` (built-in skill) | The runtime must not call Claude. Loading it invites the wrong architecture. |
| `mcp-builder` (anthropics/skills) | No MCP server is needed for any of the 3 ideas. |
| `web-artifacts-builder`, `algorithmic-art`, `canvas-design`, `theme-factory`, `slack-gif-creator` (anthropics/skills) | These target claude.ai artifacts, posters or GIFs, not a shippable web app. |
| `ralph-loop` (official) | Unattended repeat loops burn usage and drift. You need tight human checkpoints in 48h. |
| `feature-dev`, `code-review`, `pr-review-toolkit` (official) | Heavy multi-agent PR and review workflows that overlap superpowers. A hackathon team commits straight to main. |
| `security-guidance` (official) | An LLM review on every Stop slows iteration. Run `/security-review` once before submitting, if at all. |
| `huggingface-llm-trainer`, `huggingface-vision-trainer` | They use paid HF Jobs GPUs. |
| `hf-cloud-sagemaker-*` (HF skills) | AWS SageMaker is paid and needs a card. |
| `huggingface-gradio`, `huggingface-spaces`, `huggingface-zerogpu` | A server runtime on HF; ZeroGPU hosting needs PRO. It breaks the offline demo. |
| `browser-use` (in MKT) | Its cloud-browser path is paid, and Playwright MCP covers local testing. |
| Chrome built-in AI (Prompt API / Gemini Nano) | Free, but it depends on the browser version and flags and on a large model download. Too variable across 3 laptops; do not base the demo on it. |
| Cloudflare Workers AI, Groq, OpenRouter "free" tiers, Gemini API free tier | These are runtime cloud APIs. They violate "offline" and some need a card. Not allowed. |

---

## 8. Ready-to-copy install block

Run this in the **project root**, inside Claude Code for the `/plugin` lines and in PowerShell for the others.

```text
# ---- Claude Code (slash commands) ----
/plugin marketplace add anthropics/claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install skill-creator@claude-plugins-official
/plugin install claude-md-management@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin install typescript-lsp@claude-plugins-official
/plugin install playwright@claude-plugins-official
/plugin install context7@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
# optional:
/plugin install chrome-devtools-mcp@claude-plugins-official
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills     # only if a pitch deck (pptx) is required
```

The first line is harmless if the official marketplace is already registered, which it is by default in current Claude Code.

```powershell
# ---- PowerShell ----
# Domain skill (same CLI that produced skills-lock.json)
npx skills add huggingface/skills --skill transformers-js -a claude-code -y

# Remove paid / noisy skills
Remove-Item -Recurse -Force .claude\skills\higgsfield, tools\higgsfield-cli
npx skills remove imagegen-frontend-web imagegen-frontend-mobile image-to-code brandkit gpt-taste stitch-design-taste redesign-existing-projects design-taste-frontend-v1 animate-expo write-swift full-output-enforcement

# LSP + local LLM
npm i -g typescript typescript-language-server
ollama pull qwen3:4b-instruct-2507
ollama pull qwen2.5vl:3b          # TouchSight "ask" (optional)
ollama pull qwen2.5:7b            # GPU laptops only

# App core
npm create vite@latest hack-core -- --template react-ts
cd hack-core
npm i @huggingface/transformers @mlc-ai/web-llm @mediapipe/tasks-vision ollama zod kokoro-js @duckdb/duckdb-wasm @observablehq/plot tesseract.js idb-keyval lz-string qrcode
npm i -D vite-plugin-pwa vitest

# Pre-fetch model files for offline (needs: pip install -U huggingface_hub)
hf download onnx-community/Florence-2-base-ft --include "*.json" "onnx/*q4f16*" "onnx/*fp16*" "onnx/*int8*" --local-dir public/models/onnx-community/Florence-2-base-ft
hf download Xenova/slimsam-77-uniform --include "*.json" "onnx/*quantized*" "onnx/*fp16*" --local-dir public/models/Xenova/slimsam-77-uniform
hf download onnx-community/whisper-base --include "*.json" "*.txt" "onnx/*int8*" "onnx/*quantized*" --local-dir public/models/onnx-community/whisper-base
hf download onnx-community/Kokoro-82M-v1.0-ONNX --include "*.json" "onnx/model_quantized.onnx" "voices/*" --local-dir public/models/onnx-community/Kokoro-82M-v1.0-ONNX
curl.exe -L -o public/models/pose_landmarker_lite.task https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task
# Copy node_modules/@mediapipe/tasks-vision/wasm -> public/mediapipe/wasm (serve locally, not from the CDN)
```

The exact `--include` globs may need adjustment per repo: check the tokenizer, `preprocessor_config.json` and `generation_config.json` names in each repo's file list. Verify offline with the Wi-Fi off.

Restart Claude Code after installing plugins.

---

## 9. Credibility notes and caveats

- **Verified today:**
  - `anthropics/skills` folder list (19 skills, including frontend-design, webapp-testing, skill-creator, mcp-builder, web-artifacts-builder, and the docx/pdf/pptx/xlsx document skills).
  - The `claude-plugins-official` marketplace JSON (314 plugins, including superpowers, skill-creator, frontend-design, playwright, context7, chrome-devtools-mcp, typescript-lsp, code-simplifier and claude-md-management).
  - obra/superpowers skill names and install commands.
  - huggingface/skills `transformers-js` SKILL.md (v4.x, Apache-2.0). HF's own marketplace exposes only `hf-cli` as a plugin, hence the `npx skills` route.
  - vercel-labs/skills CLI syntax.
  - npm versions, HF ONNX file sizes, MediaPipe `.task` sizes, Ollama tag sizes, WebLLM VRAM figures, the DuckDB-WASM binary size, and the Cloudflare Pages 25 MiB file limit.
- **Not fully verified or approximate:**
  - WebLLM download sizes (only the VRAM figures are verified).
  - Tesseract traineddata size.
  - Whether Cloudflare's Free signup ever asks for a card (reports say no).
  - Chrome's on-device `SpeechRecognition` status in the current stable release. It was flag-gated after a 2025 regression, so treat it as a bonus only.
  - The exact `hf download` glob sets per repo.
  - Florence-2 on the Transformers.js **v4** runtime: the official `florence2-webgpu` example was built on v3. **Test it in the Day -5 spike**, and if it breaks, pin `@huggingface/transformers@3`.
- **Search results I did not trust:** some 2026 "best Ollama models" blog posts cited tags (for example "qwen3.8") that I could not confirm on ollama.com, so they are excluded. Recommended tags were checked on ollama.com tag pages.
- **Star counts:** anthropics/skills about 178k; obra/superpowers about 292k; claude-plugins-official about 37k; vercel-labs/skills about 32.5k; huggingface/skills about 11k. The emilkowalski/skill and leonxlnx/taste-skill repos are already pinned locally; their star counts were not re-checked.

## Sources

- Anthropic skills: https://github.com/anthropics/skills · https://github.com/anthropics/skills/tree/main/skills · https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md
- Anthropic plugin marketplace: https://github.com/anthropics/claude-plugins-official · https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json · context7 plugin: https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/context7
- Superpowers: https://github.com/obra/superpowers
- Hugging Face skills: https://github.com/huggingface/skills · https://github.com/huggingface/skills/tree/main/skills/transformers-js
- Skills CLI: https://github.com/vercel-labs/skills
- Transformers.js v4: https://huggingface.co/blog/transformersjs-v4 · https://github.com/huggingface/transformers.js/releases/tag/4.0.0
- Florence-2 WebGPU: https://huggingface.co/onnx-community/Florence-2-base-ft · https://github.com/huggingface/transformers.js-examples/tree/main/florence2-webgpu
- SlimSAM: https://huggingface.co/Xenova/slimsam-77-uniform · Kokoro: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX · Whisper: https://huggingface.co/onnx-community/whisper-base
- MediaPipe models: https://storage.googleapis.com/mediapipe-models/ (pose_landmarker_lite/full, hand_landmarker)
- WebLLM prebuilt configs: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
- Ollama tags: https://ollama.com/library/qwen3/tags · https://ollama.com/library/qwen2.5 · https://ollama.com/library/qwen2.5vl · https://ollama.com/library/qwen3.5/tags · https://ollama.com/library/gemma4/tags
- On-device Web Speech: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally · https://groups.google.com/a/chromium.org/g/chrome-ai-dev-preview-discuss/c/Rlyc2uAsFCY/m/i7QOnrClAgAJ
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
