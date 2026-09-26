# TouchSight — hackathon build

A blind student explores any textbook diagram by touch and sound. A teacher prepares the diagram once on a laptop (AI runs here); the student explores it on a phone (no AI runs here). Full brief: `docs/brief.md`. Research behind the idea: `docs/research-*.md`.

## Non-negotiables
- **$0 runtime.** The shipped app never calls Claude, OpenAI, or any keyed/paid API. All inference runs in the browser (Transformers.js) or not at all.
- **Offline demo.** Every model is served from `public/models/` with remote loading disabled. The demo must work in airplane mode.
- **Screen readers are first-class.** VoiceOver/TalkBack capture touch gestures, so the explorer has two modes (see "Accessibility"). Every control outside the explorer must be fully labelled and operable without sight.
- **AI runs once per diagram, before exploration.** The student-side explorer is deterministic hit-testing plus audio.

## Stack
- Vite 8 + React 19 + TypeScript + Tailwind 4. Vitest for logic tests.
- `@huggingface/transformers` 4.x in a Web Worker: Florence-2-base-ft (`<OCR_WITH_REGION>`, `<OD>`, `<DENSE_REGION_CAPTION>`) and SlimSAM for click-to-correct. WebGPU → `q4f16`/`fp16`; no WebGPU → WASM with `q8` (`_quantized` files).
- `tesseract.js` as OCR fallback (English data in `public/models/tesseract/`).
- Web Audio (`StereoPannerNode` edge ticks), `speechSynthesis` (prefer `localService` voices), `navigator.vibrate` on Android only.
- `idb-keyval` for stored diagrams; `lz-string` + `qrcode` to hand a diagram from teacher to student.
- `vite-plugin-pwa` is installed but not configured yet.

## Commands
- `npm run models` — download/verify model files into `public/models/` (~540 MB, gitignored)
- `npm run dev` — dev server
- `npm run build && npm run preview` — the offline demo server
- `npm test` — Vitest

## Accessibility (decided before building)
- **Screen-reader mode (default):** each region is a real element with an accessible name, positioned over the diagram, so VoiceOver/TalkBack's own touch exploration announces it. Also provide a plain-text list of regions and their neighbours.
- **Self-voicing mode:** the user turns the screen reader off for this view; the app handles touch itself (edge ticks, spoken labels, double-tap for details).
- Test both on a real iPhone (VoiceOver) and Android phone (TalkBack) early. It is unverified whether a mobile web page can get direct touch while VoiceOver is on — assume it cannot.

## Known risks
- Florence-2 on Transformers.js **v4** is untested (the official WebGPU example used v3). Spike it first; if it fails, pin `@huggingface/transformers@3`.
- Florence-2 uses `Florence2ForConditionalGeneration` + `AutoProcessor`, not `pipeline()`.
- Never load Florence-2 on the phone; the phone only receives region JSON.

## Skills in `.claude/skills/`
- Plan: `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`
- Build: `transformers-js`, `frontend-design`, `pick-ui-library`, `prototype`, `mobile-native`, `minimalist-ui`
- Test/debug: `test-driven-development` (hit-testing and region logic only), `systematic-debugging`, `verification-before-completion`
- Polish: `emil-design-eng`, `animate`, `review-animations`, `apple-design`
- Meta: `skill-creator` (for the planned `browser-ml-runtime` project skill)
- Plugins (enabled in `.claude/settings.json`): playwright, context7, typescript-lsp, code-simplifier, claude-md-management

## Rules
- Build the demo path from fixtures first (a saved region JSON), then wire live models.
- Keep 3–4 pre-tested diagrams (cell, US map, line graph, circuit) in `public/samples/`, from OpenStax (CC BY 4.0, attribute) or other clearly licensed sources.
- Do not add any network call at runtime without asking.
