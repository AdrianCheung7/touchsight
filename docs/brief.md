# TouchSight brief

**Pitch:** TouchSight turns any textbook diagram into something a blind student can explore with a fingertip in 60 seconds, with no embosser, no sighted helper and no internet.

**Why this idea:** It is #1 of 3 in `docs/research-top3-ranking.md`, picked from 120 winners of 15 hackathons held in 2025–26. Accessibility with a named user was the most consistent winning pattern. The parent projects are Dots (LA Hacks 2026), ROSS (Hack the North 2025) and Gemma Vision (Gemma 3n, 1st place).

## Two users, two screens

1. **Teacher (laptop, AI runs here, about 1 minute per diagram)**
   - Upload or photograph a diagram.
   - Florence-2 reads the printed labels with their positions and proposes regions.
   - The teacher fixes regions in about 10 seconds: click-to-segment with SlimSAM, merge, rename, and add a short description.
   - Output: a region JSON (shapes, labels, descriptions, neighbours), shared as a link or QR code.
2. **Student (phone, no AI)**
   - **Screen-reader mode:** regions are labelled elements, so VoiceOver/TalkBack announce them under the finger. There is also a text list of the regions.
   - **Self-voicing mode:** edge ticks panned left and right, spoken labels, double-tap for details, and vibration on Android.
   - **Export:** swell-paper or embosser SVG.

## Build chunks (in order)
1. Spike: Florence-2 `<OCR_WITH_REGION>` on Transformers.js v4 with WebGPU and WASM, using the local model files. **Decide v3 or v4 here.**
2. Region JSON schema, plus a hand-made fixture for one sample diagram.
3. Student explorer on the fixture: both accessibility modes, hit-testing and audio. Test on real phones.
4. Teacher editor: polygons, merge, rename, SlimSAM click-to-correct.
5. Handoff: IndexedDB, then lz-string, then URL hash or QR code. Plus the SVG export.
6. PWA offline caching, an accessibility audit, and the demo rehearsal.

## Demo (3 minutes)
- **0:00** The problem: hand-made tactile graphics take specialists weeks.
- **0:25** A teacher photographs a cell diagram and fixes two regions.
- **1:00** A blindfolded judge finds the mitochondria unassisted, timed on screen.
- **2:00** Airplane mode is on and everything still works. Show the SVG export and QR code.
- **2:30** Architecture: models run in the browser, costing $0 per student.

## Before the event
- Get one quote or a video test from a teacher of the visually impaired, or from campus disability services.
- Test VoiceOver and TalkBack behaviour on real devices.
- Pre-test 3–4 diagrams and cache their region JSON as a fallback.
