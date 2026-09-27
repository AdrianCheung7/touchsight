# On-device speech input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make A accept an English spoken question through a locally cached Whisper model while retaining typed input and the current local answer flow.

**Architecture:** Replace the browser SpeechRecognition-only path with a lazy Transformers.js Whisper Tiny English pipeline and one-utterance MediaRecorder capture. Keep orchestration in `useExplorer`, rendering/status in `Explore`, and use the existing question-answer function. Load the runtime only after A, keep model weights out of the initial bundle, and return to text input for unsupported or failed voice paths.

**Tech Stack:** React, TypeScript, Transformers.js, browser `getUserMedia` / `MediaRecorder` / Web Audio APIs, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-26-local-speech-input-design.md`

## Global Constraints

- Keep captured audio and inference on-device; do not upload audio or transcripts.
- Ask for microphone permission only after voice is selected and the model is ready; text input never requests it.
- Capture one utterance, release every microphone track on finish, error, cancel, and unmount, and discard audio after inference.
- Keep the model runtime and weights out of the initial app bundle; load on A and cache model files in the browser.
- Keep text entry available throughout model loading and after any voice/model failure.
- Escape closes the question sheet, cancels in-flight work, stops recording, discards the result, and pauses exploration.

## Review Focus

- First model use while offline or download failure leaves text input usable (Task 1 and Task 2).
- Switching to text while loading never requests microphone access (Task 2).
- Microphone denial or unsupported recording/audio decode returns to text input (Task 1 and Task 2).
- Escape or unmount during permission, recording, or inference stops tracks and cannot update a closed sheet (Task 1 and Task 2).
- Silence, empty recording, or inference failure offers text input rather than a blank result (Task 1 and Task 2).

---

### Task 1: Local model and one-utterance capture

**Files:**
- Modify: `package.json` and lockfile to add `@huggingface/transformers`.
- Modify: `src/student/speechRecognition.ts`.
- Modify: `src/student/speechRecognition.test.ts`.

**Interfaces:**
- Produces `loadLocalTranscriber(onProgress: (progress: number) => void): Promise<void>`, `startSpeechRecording(signal: AbortSignal): Promise<{ finish: () => Promise<Blob> }>`, and `transcribeSpeech(blob: Blob): Promise<string>` for Task 2.
- Keep the model loader lazy and singleton; pin the model revision in its pipeline options. Prepare recorded audio in-browser at the model's expected sample rate. Reject empty audio/transcripts with a clear error.

- [ ] **Step 1: Write focused failing tests** for model load/progress and reuse, first-use load failure, recording finish/abort cleanup, empty recording, and transcript success/failure. Mock browser media APIs and the ASR module boundary; assert microphone tracks stop on every exit path.
- [ ] **Step 2: Run** `npm test -- src/student/speechRecognition.test.ts`; confirm the new cases fail for missing behavior.
- [ ] **Step 3: Implement** the lazy Transformers.js pipeline and recording lifecycle in `speechRecognition.ts`, using only browser APIs and the declared dependency.
- [ ] **Step 4: Run** `npm test -- src/student/speechRecognition.test.ts`; confirm all focused cases pass.
- [ ] **Step 5: Commit** as `feat: add local speech recognition`.

### Task 2: Question flow and accessible controls

**Files:**
- Modify: `src/student/useExplorer.ts`.
- Modify: `src/student/Explore.tsx`.
- Modify: `src/student/speechRecognition.test.ts` only if an orchestration case belongs with the speech boundary; otherwise cover state behavior in the browser.

**Interfaces:**
- Consume Task 1's `loadLocalTranscriber`, `startSpeechRecording`, and `transcribeSpeech`.
- Extend `QuestionState` to represent model loading/progress, active recording, transcription, typed input, thinking, and answer without changing `askQuestion`.

- [ ] **Step 1: Add an orchestration regression check** for choosing text during model loading and for cancelling a pending speech result; assert no mic request in the first case and no answer update after cancellation.
- [ ] **Step 2: Run** `npm test -- src/student/speechRecognition.test.ts`; confirm the regression check fails against the current flow.
- [ ] **Step 3: Implement** the A flow: start lazy model load, preserve an always-available text path, request mic only after voice remains selected and the model is ready, expose an accessible **Finish speaking** button, show the recognized transcript, then call the existing local answer path. Escape and unmount must invalidate the run and release resources.
- [ ] **Step 4: Update** `Explore.tsx` with clear first-download progress/size text, recording/transcribing feedback, visible transcript, and typed fallback for model, mic, decode, empty-input, or inference failures.
- [ ] **Step 5: Run** `npm test`, `npm run build`, and `npm run lint`; fix failures.
- [ ] **Step 6: Browser-check** first-load typing fallback, finish-speaking control, Escape cleanup, and one English spoken question using local inference. Leave a real microphone permission/spoken test for the user; do not grant mic permission automatically.
- [ ] **Step 7: Commit and push** as `feat: enable local spoken questions`.

## Self-review

- **Spec coverage:** lazy local model/cache, progress and first-use size, typing at all stages, permission timing, finish control, local transcription, transcript display, existing answer flow, Escape cleanup, error paths, and browser/manual checks are assigned above.
- **Step scan:** each step is one test, implementation, verification, browser-check, or commit action; the Task 2 orchestration assertion owns text-switch and cancellation behavior.
- **Type consistency:** Task 1 produces the three exact function signatures consumed by Task 2; `QuestionState` carries presentation state only.
- **Review focus:** all five listed input/failure classes have tests or browser checks in their owning tasks.
- **Proportion:** two tasks follow the two natural boundaries: browser speech capability and question-sheet orchestration.
