# 05 — Top-3 Ranking (independent judge)

Date: 2026-09-25. Inputs: `04-synergy-decision-matrix.md` (the analyst's matrix) and the source files `01`/`02`/`03` for facts about the parent projects. Novelty was checked with web searches run on this date; the sources are listed at the end.

**Constraints:**
- Theme unknown.
- A team of 1–3 people, 24–48 hours, vibe-coding with Claude Code.
- **$0 runtime APIs.** No card-required tiers. Local, in-browser or open data only.

**Verdict in one line:** I **diverge from the analyst**.
- **Understudy drops out of the top 3.** A 2026 market check shows Yoodli, Big Interview, VirtualInterview.ai, Confetto and LockedIn AI already sell roleplay with body-language feedback. Its local voice loop is also the most latency-fragile build in the set.
- **Receipts is promoted into the top 3.** Its idea power is the highest in the set, and the analyst's feasibility concern can be solved by scoping.

**Final top 3:**
1. **TouchSight**
2. **Say-It-Play-It**
3. **Receipts**

---

## 0. Patterns judges rewarded (reference list used below)

These patterns are taken from the cluster analyses in files 01–03.

| Code | Pattern | Evidence |
|---|---|---|
| P1 | **Judges can touch or play it live** | kinemo won 1st Overall because it was "instantly playable by judges". Hardware and tangibles won top spots. |
| P2 | **Accessibility and care with one named user** | All of the Gemma 3n top 3. Netra. Nearly every "Most Impactful" award (Dots, ROSS, Shepherd). |
| P3 | **"LLM once, deterministic forever"** | ChainCraft, OmniBridge, Launch Control. |
| P4 | **Grounding: deterministic math, LLM only for the narrative** | Orbital Assets, TARIFFED!, RiskWise. "Grounding beat raw generation." |
| P5 | **Self-verification against ground truth** | Mobius, Wrench Board, MedKit. |
| P6 | **On-device, offline and private** | The Gemma 3n winners; privacy was the top web3 theme. |
| P7 | **Real-time multimodal "wow" with visible compression of time** | Tailored Labs, Sixth Sense. |
| P8 | **A domain expert or real users** | The Opus 4.7 podium; 3VA's Eva. |

---

## 1. Stress tests of the 9 contenders

### C01 Understudy: a rehearsal arena with a persona that reacts to body language

**Novelty: weak.**
- Yoodli (2026) already offers AI roleplay, multi-persona panel interviews, and eye-contact and posture feedback. Big Interview, VirtualInterview.ai, Confetto and LockedIn AI cover the same ground.
- SpeakEasy, a parent project, is itself "interview practice that scores content plus delivery".
- **What is left to differentiate:**
  - The persona *reacts in-character* to body language mid-conversation. Competitors grade body language afterwards.
  - It is fully offline and private.
  - Clinical OSCE rubrics.

  A judge who knows Yoodli will read this as "Yoodli, but local".

**$0 stack:**
- STT: Web Speech API (free, no key; the audio goes to Google) or Transformers.js `whisper-base` (private, about 1–2 s per utterance on WebGPU).
- Persona: Ollama `qwen2.5:7b-instruct` / `qwen3:8b`, or WebLLM `Qwen2.5-3B-Instruct`.
- TTS: `speechSynthesis` or kokoro-js (82M).
- Vision: MediaPipe Face Landmarker and Pose Landmarker.

**Latency risk:** the turn loop is STT end-of-speech detection, then LLM first token, then TTS. That adds up to about 2–4 s on a laptop with a GPU and about 5–8 s on CPU only. That is conversationally awkward, and the "reacts to you looking away" beat depends on timing.

**Demo reliability: medium-low.**
- Four live subsystems run at once in a noisy venue: microphone, STT, LLM and camera.
- Fallback: a push-to-talk button, a pre-warmed model, and a recorded run.

**48h plan:** five chunks.
1. Scenario and rubric JSON (standard).
2. Voice loop (fiddly).
3. MediaPipe delivery metrics (standard).
4. Persona prompt fed with delivery state (easy).
5. Debrief timeline with rubric grading (medium).

That is a lot of integration surface for a 1–3 person team.

**Judge appeal:**
- Tracks: education, health (med-ed), career.
- Patterns: P5 (rubric grading), P6, P7.
- It misses P1: judges "play" it, but so could they on Yoodli's site.

### C09 TouchSight: explore any textbook figure by touch and sound

**Novelty: moderate, and differentiable.**
- **Research and adjacent products exist:**
  - ImageExplorer and ImageAssist (research prototypes).
  - Seeing AI's "explore photo by touch", which is object boxes in photos.
  - Tactile Images READER, which works only on pre-made tactile sheets it recognizes.
  - The vOICe (brightness to vibration).
- **Nothing mainstream does all of the following:**
  - takes an *arbitrary diagram*;
  - lets a teacher correct the regions in about 10 seconds;
  - adds edge ticks and region labels;
  - exports an embosser or swell-paper SVG;
  - runs fully in-browser and free.
- The gap is real: tactile graphics are still hand-produced by specialists.
- **Differentiation to pitch:** "Seeing AI tells you what is in a photo. TouchSight lets you *feel the layout* of the diagram on tonight's homework."

**$0 stack:**
- Transformers.js v3 with WebGPU:
  - Florence-2-base (about 230M parameters). Its `<OCR_WITH_REGION>` task finds the printed labels with their boxes (the most important structure in textbook figures), and its `<DENSE_REGION_CAPTION>` / `<OD>` tasks give regions.
  - SlimSAM for the teacher's click-to-segment correction.
- Tesseract.js as the OCR fallback.
- Optional Ollama `qwen2.5vl:7b` for richer labels and for "what is this?" answers.
- Web Audio `StereoPannerNode` for edge ticks, `speechSynthesis` for labels, and `navigator.vibrate` on Android only (iOS Safari has none, so audio is primary).

**Quality risk:**
- Florence-2 labels on dense diagrams are mediocre.
- The mitigation is the teacher correction step, which is part of the product story, not a hack. Plus 3–4 pre-tested figures.
- Segmentation runs *once per image* (offline preprocessing). The live interaction is pure DOM hit-testing, so there is no latency risk during exploration.

**Demo reliability: high.**
- The live part (finger, then sound) is deterministic.
- The risky part (AI segmentation) can happen before the demo or live on a pre-tested image.
- Fallback: a cached region JSON.

**48h plan:** six chunks.
1. Upload and preprocessing pipeline: Florence-2 plus OCR into a region JSON (medium; it is a known Transformers.js recipe).
2. Teacher editor: polygons, merge, rename (standard canvas work).
3. Touch explorer: hit-testing, edge distance mapped to tick rate, TTS (standard).
4. "Ask about this region" with the local VLM (easy, and optional).
5. SVG embosser export plus a QR code (easy).
6. PWA polish and accessibility audit (standard).

Every chunk is standard. None is research.

**Judge appeal:**
- Tracks: accessibility, social impact, education, health, "AI for good", "best use of on-device AI".
- Patterns: P2 (strongly), P1 (a blindfolded judge explores), P6, and P8 if a TVI or blind tester is recruited.

### C04 Say-It-Play-It: one sentence becomes a body-controlled game

**Novelty: strong.**
- Text-to-game generators exist (Summer Engine, Gameer, ai-game-generator), and webcam body games exist (AI-Arcade, kinemo, PoseMan).
- I found **no product or hackathon project that compiles a sentence into a pose-controlled game**.
- ChainCraft had no body input. kinemo had three hand-coded games.

**$0 stack:**
- MediaPipe Pose Landmarker lite (`@mediapipe/tasks-vision`), at about 30 fps in-browser on a laptop.
- Compiler:
  - Ollama `qwen2.5:7b-instruct` or `qwen3:8b` with a `format: <JSON schema>` structured output. Grammar-constrained decoding means the output is *always schema-valid*. Semantic "fun" is the only open risk.
  - WebLLM `Qwen2.5-3B` in JSON mode as the browser-only fallback.
  - Compile time is about 5–15 s on a GPU laptop and 30–60 s on CPU only. Show a "compiling…" animation.
- Engine: Phaser 3 or plain Canvas, with Zod validation.

**Demo reliability: high during play**, since there is zero inference while playing.
- Compile risk: a judge names a game outside the DSL.
- Mitigations:
  - The DSL maps unknown verbs to the nearest supported action.
  - 6 cached pre-compiled games.
  - Always play *something* within 20 s.

**48h plan:** five chunks.
1. Pose-action library (squat, jump, lean left/right, clap, arms up, punch) from landmark kinematics (standard; kinemo-proven).
2. DSL plus JSON Schema (design work, and the crux; about 6 hours).
3. Deterministic engine: spawners, collisions, score, timers, bindings (standard game dev).
4. LLM compiler with repair retry and a 10-second headless sim smoke test (medium).
5. Share-by-URL, remix, and a scoreboard (easy).

**Judge appeal:**
- Tracks: games and entertainment, education (PE), health and fitness (physio), creative AI, "best use of AI", and open or general tracks.
- Patterns: P1 (the strongest in the set), P3 (textbook), P7, and "0 AI calls during play" as a quantified engineering claim (the U-cluster "technical depth" pattern).

### C07 LeaseLint: a policy-as-code verdict on a lease

**Novelty: very weak.**
- At least seven live consumer products do exactly "AI checks your lease against state law": LeaseGuard (.us, "935+ state-specific laws"), LeaseGuard (.net), LeaseGuard AI, ReadYourLease, Justee, Renters Rights and LeaseLens.
- The deterministic YAML verdict is an engineering nicety that judges cannot see.

**$0 stack:** pdf.js, Tesseract.js, Ollama Qwen2.5-7B with a schema, and js-yaml. It is feasible and reliable.

**Demo:** reliable but visually flat (a PDF, then red highlights).

**Judge appeal:** legal-tech and civic tracks, P4. There is no P1 or P7.

### C06 ScamSense Family: a scam shield trained by the family

**Novelty: weak.**
- OnGuardAI already markets "self-learning AI" with trusted-contact alerts.
- SeniorShield, Scam Scanner, ai'd and ZoraSafe cover the rest.
- What is left to differentiate: it is on-device, and learning is per family and shared as weights rather than messages. That is a subtle story.

**$0 stack:** Tesseract.js, Ollama/WebLLM feature extraction, a JS online logistic regression seeded on the UCI SMS Spam Collection. Feasible.

**Demo:** reliable, but the "it learned" beat is staged and abstract.

**Judge appeal:** fintech, security and "AI for good"; P6.

### C02 ClearPass: private expungement eligibility with a portable proof

**Novelty: mixed.**
- Eligibility checkers exist (CleanSlateCheck.us, which covers all 50 states and logs no answers; Rasa Legal).
- Both parents (Expungo, Clean Slate Agent) already *won* with this domain, so a judge who follows hackathons may have seen it.
- The credential (prove "eligible" without revealing the record) *is* new, but a self-issued signature proves little. It needs a clinic-issuer framing.

**$0 stack:** Tesseract.js, a rules JSON, WebLLM, pdf-lib, WebCrypto/jose, and an optional viem call to Base Sepolia.

**Risks:** OCR of RAP sheets, plus five subsystems.

**Demo:** airplane mode plus a QR verify is a nice beat, but the story is heavy on text.

**Judge appeal:** privacy, web3 identity, civic and justice tracks; P6.

### C10 HandVoice: personal-gesture AAC with LLM sentence expansion

**Novelty: weak to moderate.**
- On GitHub, `personalized-gesture-vocab-builder` already does few-shot personal MediaPipe gestures (from 5–10 demos) with open-set matching and speech output. GestureSpeak, GestureSpeak-AI and FingerSpeak also exist.
- The new part is the LLM expanding a gesture *sequence* into a natural sentence in the user's style. That is an add-on (3VA's idea), not a new capability.

**$0 stack:** MediaPipe Hand Landmarker, a KNN, WebLLM Qwen2.5-1.5B and `speechSynthesis`. Very feasible.

**Demo:** a misclassification under stage light is possible; a confirm gesture helps.

**Judge appeal:** accessibility (P2), but the value stays hollow without a real AAC user, and the population is small.

### C05 Air Changes: gesture chords guided by a harmony graph

**Novelty: very weak.**
- At least six public browser projects do "MediaPipe hands plays chords": handsynth, handchord, hand-chord, DJ Hands, Gesture Synth and Simple Hand Tracking Chords.
- The only differentiator is ChromaChord's next-chord ranking, which judges will not notice in 3 minutes.

**$0 stack:** MediaPipe and Tone.js, with no LLM. It has the highest feasibility.

**Judge appeal:** music, art and fun. It is a toy (P1 only).

### C03 Receipts: a live numeric fact-check against open data

**Novelty: moderate to strong.**
- Live fact-checking exists: LiveFC (a WSDM'25 research system), Factiverse Live, and ClaimBuster (check-worthiness only).
- All of them *retrieve text evidence* and let a model judge it.
- Receipts is different: it **computes** the verdict from the dataset and shows the chart as proof. That is the Orbital Assets rule (P4), applied to misinformation.
- No Cap, a parent project, won 3rd Overall with LLM-asserted verdicts. This is the "grounded" upgrade of a proven winner.

**$0 stack:**
- STT: Web Speech API (free, no key). Offline fallback: Transformers.js `whisper-base` or whisper.cpp.
- Claim to query: Ollama `qwen2.5:7b-instruct` with a JSON schema.
  - The schema is `{dataset, metric, geography, period_a, period_b, comparator ("doubled", "rose", "highest"…), claimed_value}`.
  - The enum values are limited to what exists in the curated catalog, and constrained decoding makes out-of-catalog output impossible.
- Compute: DuckDB-WASM over pre-downloaded CSVs:
  - BLS LAUS unemployment by state;
  - FBI Crime Data Explorer state rates;
  - Census ACS income and population;
  - NOAA state temperature;
  - EIA gas prices.
- Verdict: deterministic tolerance bands (within ±10% = TRUE, and so on).
- Chart: Observable Plot or Vega-Lite.
- The LLM only phrases the verdict.

**Risk:** claims outside the catalog. Scoping turns this into an explicit "Out of scope, no receipt available" state, which is honest and itself a judge-visible anti-hallucination feature.

**Demo reliability: medium-high.**
- Web Speech in a loud room is the weak point.
- Fallbacks: a push-to-talk lapel mic, playing a pre-recorded 60-second debate clip through the pipeline, and typing a claim.
- Everything after the text stage is deterministic.

**48h plan:** five chunks.
1. Curate and normalize 5 datasets into DuckDB tables plus a catalog JSON (grunt work, about 6 hours, but standard).
2. Streaming transcript and claim detection (standard).
3. Claim to query schema with constrained decoding and a SQL template per comparator (medium; the crux).
4. Verdict engine plus chart "receipt" cards (standard).
5. Debate UI: two speakers, a live receipts feed and a scoreboard (standard).

**Judge appeal:**
- Tracks: civic tech, "AI safety / trustworthy AI", data and open data, journalism and media, education (media literacy), and election or democracy themes.
- Patterns: P4 (textbook), P5 (the verdict is checked against ground truth), P7 (live), and P1 (a judge says a claim out loud and gets a receipt).

---

## 2. Re-scoring (Fit / Power / Feasibility, weighted 30/30/40)

| ID | Analyst F/P/Fe → wtd | **Judge F/P/Fe → wtd** | Deltas > 1 point and why |
|---|---|---|---|
| C09 TouchSight | 8/7/7 → 7.3 | **8/7/7 → 7.3** | None. I agree. The live interaction is deterministic, and the AI runs once per image. |
| C04 Say-It-Play-It | 9/7/6 → 7.2 | **9/6/7 → 7.3** | Feasibility +1: Ollama structured outputs make the DSL schema-valid by construction, and play needs zero inference. Power −1: "useful after the event" (PE and physio) is plausible but secondary to fun. Both are within ±1. |
| C03 Receipts | 8/8/5 → 6.8 | **8/8/6 → 7.2** | Feasibility +1: the analyst scored open-world grounding. Scoped to 5 curated datasets with *enum-constrained* decoding, the hard part is a bounded text-to-SQL template problem, and "out of scope" is a feature. |
| C02 ClearPass | 7/7/7 → 7.0 | 7/7/6 → 6.6 | Feasibility −1: five subsystems (OCR, rules, LLM, pdf-lib, credential). |
| C06 ScamSense | 6/8/7 → 7.0 | 6/**6**/7 → 6.4 | **Power −2:** at least 5 shipping consumer apps, including a "self-learning" one (OnGuardAI). Scam harm is huge, but the marginal power of *this* build over existing apps is small. |
| C10 HandVoice | 8/6/7 → 7.0 | 7/5/7 → 6.4 | Fit −1, Power −1: an open-source few-shot personal-gesture AAC already exists; only the LLM expansion is new. |
| C01 Understudy | 8/8/7 → 7.6 | 7/**6**/6 → 6.3 | **Power −2:** Yoodli (2026) ships multi-persona roleplay with eye-contact and posture feedback, and 4+ other tools do the same. What is left is only "reacts live" plus "offline". Fit −1: a judge who has seen Yoodli discounts it. Feasibility −1: it has the most fragile live loop of the 9 (mic, STT, LLM and TTS, plus camera, with 2–8 s turns). |
| C05 Air Changes | 7/4/9 → 6.9 | 6/3/9 → 6.3 | Six or more near-identical public browser projects. |
| C07 LeaseLint | 6/7/8 → 7.1 | 5/**5**/8 → 6.2 | **Power −2:** at least 7 live consumer lease-checker products already exist. Fit −1: a flat PDF demo in a crowded category. |

**Tie-break** (the analyst's pre-set rule: Feasibility, then Power): TouchSight and Say-It-Play-It tie at 7.3 with equal Feasibility. **TouchSight wins on Power (7 vs 6).**

### Sensitivity of my scores

| Weighting | #1 | #2 | #3 | #4 |
|---|---|---|---|---|
| Default 30/30/40 | TouchSight 7.30 | Say-It-Play-It 7.30 | Receipts 7.20 | ClearPass 6.60 |
| Equal 33/33/33 | TouchSight 7.33 = Say-It-Play-It 7.33 = Receipts 7.33 | | | ClearPass 6.67 |
| Power-heavy 25/45/30 | Receipts 7.40 | TouchSight 7.25 | Say-It-Play-It 7.05 | ClearPass 6.65 |
| Feasibility-heavy 20/20/60 | TouchSight 7.20 = Say-It-Play-It 7.20 = Air Changes 7.20 | | Receipts 6.80 = LeaseLint 6.80 | |

The **same three ideas hold the top 3 under the default, equal and power-heavy weightings**.
- Under an extreme feasibility weighting, Air Changes and LeaseLint catch up. But their novelty collapse (six and seven existing products respectively) means they would lose on originality, which most hackathon judging rubrics score explicitly.
- **Understudy never re-enters the top 3 under any weighting.**

**Promotion check:** I also re-examined the other file-04 candidates.
- C18 Legacy Whisperer needs hardware and frontier reasoning.
- C14 StepCheck depends on unreliable local-VLM verification.
- C11 Where'd-It-Go needs slow open-vocabulary detection.
- C08 CrashTest is a niche devtool that competes with promptfoo and garak.

None beats Receipts, so no other promotion.

---

## 3. The top 3

### #1 — TouchSight (7.3)

**Why it wins:**
1. **It hits the most reliable winning pattern in all three research clusters.**
   - Accessibility with a named user won the whole Gemma 3n podium, Netra, Dots, ROSS and Shepherd.
   - File 01 notes that "nearly every Most Impactful / Social Impact award" went to accessibility or health builds.
   - This is the pattern that most often survives an unknown theme, because "impact" is on almost every rubric.
2. **It has the best demo-reliability profile among the high-power ideas.**
   - The AI step runs once, before interaction.
   - The live beat (finger, then sound) is deterministic DOM hit-testing.
   - It cannot "hang" on stage.
3. **All chunks are standard:** a Transformers.js recipe, a canvas editor, Web Audio, and SVG export. That makes it the safest 48h scope for a vibe-coding team.
4. **$0 is native, not a compromise.** Offline and private is *better* for schools, which have student-data rules. That fits the on-device sponsor prizes (P6).
5. **The novelty gap is real and easy to state.** Seeing AI describes photos. Tactile Images READER needs pre-made sheets. Nothing turns *tonight's arbitrary homework diagram* into an explorable plus embossable graphic in 60 seconds.

**Why it beats #2, Say-It-Play-It:**
- The two tie on score. TouchSight wins the pre-set tie-break on Power.
- Substantively, it solves a need that costs real money and weeks of time (hand-made tactile graphics). Say-It-Play-It is primarily delight.
- When a rubric weights "impact" or "social good", which is most general hackathons, TouchSight's ceiling is higher.
- Say-It-Play-It only wins head-to-head where "fun" or "creativity" is explicitly scored.

**Biggest weakness:** label and region quality on dense or unusual diagrams. The story also sounds hollow without a real blind user.

**Mitigations:**
- Make the teacher correction step a *feature* ("AI drafts, teacher approves in 10 seconds").
- Prepare 3–4 pre-tested figures (cell, US map, a line graph, a circuit).
- Use Florence-2's OCR-with-regions as the backbone, since printed labels are the most reliable anchors.
- Contact a Teacher of the Visually Impaired (TVI) or a campus disability-services office *before* the event for one quote or a video test. That covers P8.

**One-sentence pitch:** "TouchSight turns any textbook diagram into something a blind student can explore with a fingertip in 60 seconds, with no embosser, no sighted helper and no internet."

**3-minute demo storyline:**
- **0:00–0:25, the problem.** Hand-made tactile graphics take specialist time and weeks of turnaround, so blind students fall behind in diagram-heavy STEM. If you have one, show a real quote from a TVI or student.
- **0:25–1:00, the build.** A teacher photographs a cell diagram. Regions and labels appear. The teacher merges two regions and renames one in 10 seconds.
- **1:00–2:00, the wow.** Blindfold a judge and hand them the phone. They slide a finger:
  - edge ticks, panned left and right;
  - "Nucleus";
  - a double-tap on "what is this?" gives a one-sentence answer.
  - They find the mitochondria unassisted. Time it on screen.
- **2:00–2:30, the proof.** Airplane mode is on and everything still works. Show the swell-paper SVG export and a QR code for the audio version.
- **2:30–3:00, the architecture and ask.** One slide: Florence-2 and SlimSAM in the browser, then region JSON, then Web Audio. $0 per student, and privacy-safe for schools.

**Choose this one if:**
- the theme is accessibility, social impact, education, health or "AI for good";
- the event has an on-device or edge-AI sponsor;
- the theme is unknown and you want the highest floor.

### #2 — Say-It-Play-It (7.3)

**Why it wins:**
1. **It has the strongest P1 moment in the set.**
   - "Judge, name a game, then you play it 20 seconds later" is interactive, personal and unforgettable.
   - kinemo, the direct parent project, won 1st Overall precisely because judges could play.
2. **It is a textbook "LLM once, deterministic forever" design (P3).** Judges rewarded this pattern at three events (ChainCraft, OmniBridge, Launch Control). It gives a quantified engineering claim: "0 inference calls during play, 60 fps".
3. **It is the most novel of the nine.** No text-to-game tool targets pose control, and no pose-game tool accepts free text.
4. **$0 is structurally easy.** Constrained JSON decoding in Ollama makes compiler output valid by construction, and MediaPipe is free and proven.
5. **It is the most theme-flexible idea.** It can be framed for games, PE and education, physio and health, creative AI, or kids and family.

**Why it beats #3, Receipts:**
- It has higher feasibility confidence where it matters live: after compiling, *nothing* can fail.
- Receipts depends on venue-noise-sensitive STT for its core beat.
- It also has higher Fit (9 vs 8), because the judge *plays* rather than watches.
- Receipts has more idea power, but for a 48h team the playable-demo advantage is decisive at equal weighted score.

**Biggest weakness:** the compiled game is valid but boring, or the judge's idea is outside the DSL.

**Mitigations:**
- Design the DSL so that *every* valid combination is playable: sane defaults for speed, spawn rate and hitboxes.
- Map unknown verbs to the nearest of about 10 pose actions and say so on screen ("'Kick' mapped to 'Jump'").
- Run a 10-second headless sim before launching (ChainCraft's sim-player).
- Keep 6 cached showcase games.
- Pitch the physio and PE framing ("prescribe a game, not a worksheet") to lift the Power score.

**One-sentence pitch:** "Describe any movement game in one sentence and play it with your whole body 20 seconds later, compiled once by a local AI and run with zero AI calls."

**3-minute demo storyline:**
- **0:00–0:20, the hook.** "Motion games need a studio. Physios and PE teachers need custom ones every day."
- **0:20–0:50.** Type "dodge falling tacos by squatting, clap to shoot the pigeons". Show the compiled JSON flashing past, then the game appears.
- **0:50–1:30.** A teammate plays. The score climbs, and a counter shows "AI calls during play: 0".
- **1:30–2:20, the wow.** Ask a judge for any idea. It compiles live (the cached fallback is ready), and the judge plays.
- **2:20–2:40.** Remix: edit one word ("jump instead of squat") and recompile. Share by URL or QR.
- **2:40–3:00, the architecture.** Sentence, then a local LLM with a JSON Schema, then the DSL, then a deterministic engine with MediaPipe. $0 at runtime, and offline.

**Choose this one if:**
- the theme is games, entertainment, creativity, "fun", education (PE or kids) or health and fitness;
- the judges are a general or consumer panel;
- you want the highest crowd and people's-choice potential;
- you want the most forgiving live demo.

### #3 — Receipts (7.2)

**Why it wins:**
1. **It has the highest idea power in the set (8)**, tied only with the analyst's view of Understudy.
   - Misinformation is a universal, rubric-friendly problem.
   - "The verdict is *computed*, not *asserted*" is a crisp, defensible novelty against LiveFC, Factiverse and ClaimBuster, which all retrieve text and let a model judge.
2. **It stacks three rewarded patterns at once:**
   - grounding with deterministic math and LLM narrative (P4: Orbital Assets, TARIFFED!);
   - self-verification against ground truth (P5: Mobius, MedKit);
   - live real-time (P7).
3. **Its parent project is a proven podium finisher.** No Cap won 3rd Overall, and Receipts fixes No Cap's weakest link (LLM-asserted truth, plus paid search and scraping).
4. **Scoping turns the risk into a feature.** An "Out of scope: no receipt" state is honest, visible anti-hallucination behavior, which AI-safety and trust judges love.

**Why it beats #4, ClearPass:**
- Its demo is live and interactive: a judge speaks a claim and gets a chart. ClearPass is document upload and a QR code.
- It is more novel: ClearPass's domain has already won twice (Expungo, Clean Slate).
- Its interface is simpler: one text-to-SQL seam versus five subsystems.
- It carries no legal-liability framing burden.

**Biggest weakness:** the claim-to-query mapping and STT in a noisy room. If a claim misparses live, the "truth machine" looks wrong. That is worse than looking slow.

**Mitigations:**
- Use constrained decoding onto an **enum-closed catalog**.
- Show the parsed query ("BLS unemployment, Ohio, 2019 vs 2024, comparator = doubled") *before* the verdict, so a human-legible step is always visible and errors are self-evident.
- Add a confidence gate that routes to "needs review".
- Use a push-to-talk lapel mic.
- Prepare a pre-recorded 60-second mock-debate clip as the primary demo input, with the live judge claim as the encore.
- Curate the datasets on day 1 morning, before any UI work.

**One-sentence pitch:** "Receipts listens to a debate and, for every number someone claims, pulls the actual government data and shows the chart: a verdict computed, not guessed."

**3-minute demo storyline:**
- **0:00–0:20.** "Fact-checks arrive days late, and AI fact-checkers can hallucinate too."
- **0:20–1:20.** Play the mock-debate clip. Claims pop up in the live feed:
  - "Unemployment in Ohio doubled since 2019" gets a chart receipt: 4.2% to 4.4%, FALSE, with a red band.
  - "Crime is down since 2022" gets TRUE, with a chart.
- **1:20–1:50.** Expand one receipt: parsed query, then SQL, then the dataset source link. "The LLM wrote this sentence. It did not decide the verdict."
- **1:50–2:30, the wow.** A judge says a claim into the mic and gets a receipt in about 3 seconds. Then an out-of-catalog claim gets "No receipt: out of scope", which is shown as a feature.
- **2:30–3:00.** Scoreboard of the speakers' accuracy. Architecture: Web Speech or whisper, a local Qwen with an enum schema, DuckDB-WASM on open data, and a deterministic verdict. $0.

**Choose this one if:**
- the theme is civic tech, democracy or elections, journalism and media, open data, trustworthy or responsible AI, or education (media literacy);
- the judges include data or policy people;
- someone on the team enjoys data wrangling.

---

## 4. Why the others lost

| Rank | Idea | Why it lost |
|---|---|---|
| 4 | **ClearPass** (6.6) | The most solid of the rest. But the domain already won twice via its parents, a self-issued credential proves little without a clinic signer, and it is a 5-subsystem text-heavy demo. Its best use is a **privacy, web3 or identity-track fallback**. |
| 5= | **ScamSense Family** (6.4) | A crowded category: OnGuardAI already sells "self-learning" scam detection with family alerts, and SeniorShield, ai'd and ZoraSafe cover the rest. The "it learned" beat is abstract on stage. |
| 5= | **HandVoice** (6.4) | Open-source few-shot personal-gesture AAC already exists. The LLM sentence expansion is an add-on, and the story needs a real AAC user that most teams cannot recruit in 48h. |
| 7 | **Understudy** (6.3; analyst #1) | Yoodli and at least four others already ship roleplay with body-language feedback. The differentiator ("reacts live, offline") is thin, and its voice, LLM, TTS and camera loop is the most latency-fragile live demo in the set. |
| 8 | **Air Changes** (6.3) | Six or more public browser "hand-tracking chord synth" projects exist. It is maximally feasible but reads as a toy with no novelty. |
| 9 | **LeaseLint** (6.2) | At least seven live consumer "AI checks your lease against state law" products exist. It is a reliable but visually flat PDF demo in a saturated market. |

---

## 5. Final recommendation

**If the theme is unknown, build TouchSight.**
- Its floor is highest: a deterministic live interaction, all-standard build chunks, and $0 by nature.
- Its ceiling is highest on the criterion almost every rubric contains (impact), backed by the single most consistent winning pattern across the 15 events.
- Keep **Say-It-Play-It** as the swap if the announced theme or judging panel leans toward fun, games or creativity, or if the team cannot line up any accessibility validation (a TVI, a blind tester or a disability-services contact) before the event.

**Theme-to-idea mapping:**

| Announced theme or track | Build | Backup |
|---|---|---|
| Unknown / general / "open innovation" | **TouchSight** | Say-It-Play-It |
| Accessibility / inclusion | **TouchSight** | HandVoice |
| Social impact / AI for good | **TouchSight** | Receipts |
| Education / edtech | **TouchSight** (STEM diagrams) | Say-It-Play-It (PE) or Receipts (media literacy) |
| Health / wellness / fitness / rehab | **Say-It-Play-It** (physio home-exercise games) | TouchSight |
| Games / entertainment / creativity / "fun" | **Say-It-Play-It** | Air Changes (only if the team has no LLM appetite) |
| Civic tech / democracy / journalism / media | **Receipts** | ClearPass |
| Open data / data science / NASA- or gov-data challenges | **Receipts** | TouchSight (maps and graphs) |
| Trustworthy AI / AI safety / "responsible AI" | **Receipts** (computed, not asserted) | Say-It-Play-It (bounded-inference design) |
| On-device / edge AI sponsor (Gemma, WebGPU, MediaPipe) | **TouchSight** | Say-It-Play-It |
| Privacy / security / identity / web3 | **ClearPass** (credential on a testnet) | ScamSense Family |
| Fintech / consumer protection | **ScamSense Family** | Receipts (economic claims: BLS, EIA prices) |
| Legal / justice | **ClearPass** | LeaseLint (only with a strong single-state legal partner) |
| Career / future of work | Understudy (only if you can show that "reacts live, offline" beats Yoodli) | Receipts |

---

## Sources (novelty checks, 2026-09-25)

**Rehearsal and interview coaching (Understudy)**
- [Yoodli — AI Roleplay Platform](https://yoodli.ai/)
- [Yoodli — Interview preparation](https://yoodli.ai/use-cases/interview-preparation)
- [Yoodli Help Center — Practice with Yoodli](https://support.yoodli.ai/en/articles/9550465-practice-with-yoodli)
- [Yoodli Review 2026](https://resumehog.com/blog/posts/yoodli-review-2026-is-this-ai-interview-coach-worth-it.html)
- [Big Interview — Video AI](https://www.biginterview.com/platform/video-ai)
- [VirtualInterview.ai](https://virtualinterview.ai/mock-interview-ai)
- [Best AI Roleplay Platforms 2026](https://www.autointerviewai.com/blog/best-ai-roleplay-platforms-2026)
- [LockedIn AI](https://www.lockedinai.com/blog/what-is-a-role-play-interview)

**Touch exploration for blind users (TouchSight)**
- [ImageAssist (arXiv)](https://arxiv.org/pdf/2302.09124)
- [Tactile Images READER](https://tactileimages.org/en/blog-en/the-tactile-images-reader-app-turns-the-smartphone-into-a-vital-tool-for-the-independent-study-of-the-blind/)
- [The vOICe for Android](https://www.seeingwithsound.com/android.htm)
- [PictureSensation (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6453065/)
- [Touch-based accessible graphics review (arXiv)](https://arxiv.org/pdf/2102.01273)

**Text-to-game and webcam body games (Say-It-Play-It)**
- [Summer Engine — AI game generator from text](https://www.summerengine.com/ai-game-generator-from-text)
- [Gameer](https://www.gameer.io/text-to-game-ai)
- [AI-Arcade (GitHub)](https://github.com/AditA1104/AI-Arcade)
- [PoseMan (Devpost)](https://devpost.com/software/poseman)

**Lease checkers (LeaseLint)**
- [LeaseGuard.us](https://www.leaseguard.us/)
- [LeaseGuard.net](https://www.leaseguard.net/)
- [LeaseGuard AI](https://leaseguardai.com/)
- [ReadYourLease](https://www.readyourlease.ai/)
- [Justee](https://justee.ai/compliance-review/lease-agreement)
- [Renters Rights](https://rentersrights.app/features)
- [LeaseLens](https://www.leaselens.app/)
- [LeaseCheck](https://leasecheck.vercel.app/)

**Scam detection for seniors (ScamSense Family)**
- [OnGuardAI](https://www.getonguard.ai/)
- [SeniorShield.ai](https://apps.apple.com/us/app/seniorshield-ai-scam-blocker/id6738144273)
- [Scam Scanner](https://apps.apple.com/us/app/scam-scanner-ai-scam-detector/id6758177873)
- [ai'd](https://getaid.ai/)
- [ZoraSafe](https://www.zorasafe.com/for-seniors)

**Gesture AAC (HandVoice)**
- [personalized-gesture-vocab-builder](https://github.com/kanadb004/personalized-gesture-vocab-builder)
- [Gesture-Speak](https://github.com/meet4041/Gesture-Speak)
- [GestureSpeak-AI](https://github.com/harish15SIVA/GestureSpeak-AI)

**Hand-tracking chord synths (Air Changes)**
- [handsynth](https://github.com/saanviiyer/handsynth)
- [handchord](https://github.com/aayushbhatta230-ux/handchord)
- [hand-chord](https://github.com/0mandrock1/hand-chord)
- [DJ Hands](https://www.dj-hands.com/)
- [Gesture Synth](https://klotski.org/game/gesture-synth)
- [Simple Hand Tracking Chords](https://jasperbernaers.com/simple-hand-tracking-chords/)

**Live fact-checking (Receipts)**
- [LiveFC (arXiv)](https://arxiv.org/html/2408.07448v2)
- [Factiverse Live Fact-Checking](https://www.factiverse.ai/blog/introducing-factiverse-live-fact-checking)
- [RAND tools list](https://www.rand.org/research/projects/truth-decay/fighting-disinformation/search.html)

**Expungement eligibility (ClearPass)**
- [CleanSlateCheck.us](https://cleanslatecheck.us/)
- [Rasa Legal](https://rasa-legal.com/media/articles/oa_2304_001/)
