# 04 — Synergy Analysis and Decision Matrix

Analysis date: 2026-09-25. The inputs are the three research files: `01-university-hackathons.md` (U\*), `02-online-ai-hackathons.md` (A\*, A3x\*) and `03-industry-web3-2026-hackathons.md` (W\*). There are 120 winning projects from 15 events.

**The user's constraints:**
- An unknown or general theme.
- A team of 1–3 people, 24–48 hours, vibe-coding with Claude Code.
- **$0 runtime AI.** A free tier that requires a card counts as paid. A no-card free tier, such as Gemini free or Cloudflare free, can only be an optional upgrade.

**Method caveat:** every score in this document is analyst judgment grounded in the cluster analyses of the three research files. The scores are not measurements. The full 1–10 range was used on purpose.

---

## 1. Synergy definition and scoring rubric

### Operational definition

> **Synergy** is a combination of 2–3 judge-validated primitives, each supplying a capability the others lack. Together they give **one user**, with **one problem** and **one flow**, an outcome that **none of the parents could deliver alone, even with a feature bolted on**. The parts join through a **single clean interface** (a shared data object, event or schema), not through ad-hoc glue.

The emergent-capability test is the heart of the definition. Write the sentence *"Only the combination lets <user> <do X>, because <A's primitive> provides <P1>, which <B's primitive> needs in order to <P2>."* If you can only write *"A, plus B's feature"*, it is **not** synergy.

### Five tests (0–10 total)

| Test | Points | What earns full points |
|---|---|---|
| **C: Complementarity** | 0–2 | Each parent fills a different slot in the pipeline: input/sensing, reasoning/judgment, or action/output/trust. Two parents in the same slot score 0. |
| **E: Emergence (1+1>2)** | 0–3 | The combination unlocks a new *user outcome*, not just a better one: 3 = an outcome that is impossible without the fusion; 2 = a qualitatively new capability; 1 = a meaningful improvement; 0 = "A with a feature from B". |
| **S: Single coherent story** | 0–2 | One named user, one problem and one flow that can be demoed in 3 minutes. A bundle of features scores 0. |
| **I: Integration cost** | 0–2 | The primitives join through one clean interface (a JSON schema, an event stream or a shared data object): 2 = trivial; 1 = one custom adapter or DSL; 0 = forced glue or several brittle bridges. |
| **V: Validated demand** | 0–1 | The parents come from **≥2 different events or clusters**, so demand is validated more than once. The fact that every parent won is the entry ticket, not a point. |

**Gate rules**
- **E = 0 caps the score at 5**, which means automatic discard. If there is no emergence, there is no synergy.
- **A synergy score below 6 means discard** (Section 3 marks these, and Section 4 lists them).
- Feasibility is **not** part of the synergy score. It is judged separately in Section 5, so that a synergistic but impossible idea is still visible and then eliminated for a stated reason.

---

## 2. Primitive catalog

**Status codes:**
- **$0**: already free, open or testnet.
- **SUB**: has paid dependencies, but a free local or in-browser substitute exists (see the substitution table below).
- **HW**: needs special hardware.
- **HARD**: no adequate $0 substitute, either because frontier-model quality is essential or because it needs paid data or infrastructure.

### Cluster U (university)
| ID | Project | Core reusable primitive | Status |
|---|---|---|---|
| U1-1 | FaceTimeOS | Call or messaging app used as the UI for a desktop agent | SUB (Mac-only) |
| U1-2 | Ted.AI | Affect estimate fused from voice, touch/IMU and heart rate | HW |
| U1-3 | Project No Cap | Streaming claim extraction plus grounded verification | SUB (web grounding is the weak spot) |
| U1-4 | HCP | Declarative hardware-capability schema plus discovery bus | HW (can be simulated) |
| U1-5 | Bob | Egocentric video to an MLLM plus open-vocabulary highlighting | HW / SUB |
| U1-6 | Expungo | Legal-document extraction plus jurisdiction RAG plus form fill | SUB |
| U1-7 | Haven | Webcam rPPG vitals to an agentic triage layer | SUB (flaky under venue lighting) |
| U1-8 | Elda AI | Stateful conversation memory to longitudinal summaries | SUB |
| U2-1 | Shepherd | Phone LiDAR gap-steering to a haptic or motor cue | HW |
| U2-2 | Robosurge | Language-commanded multi-arm manipulation | HW |
| U2-3 | ChromaChord | Chroma-vector harmonic graph with next-chord ranking (deterministic) | $0 |
| U2-4 | diffuji | Capture, then img2img, then physical print | HW / SUB (heavy) |
| U2-5 | Mira | Video walkthrough to a queryable spatial memory ("where is X?") | SUB (GPU-heavy) |
| U2-6 | Freak in the Sheets | Compiler backend for an unconventional runtime | $0 |
| U2-7 | Sentinel | Hardware-in-the-loop harness for coding agents | HW + HARD |
| U2-8 | 4sight | Wearable HRV to a risk score to agent intervention | HW |
| U3-1 | DUM-E | Homography plus MLLM planner plus IK | HW |
| U3-2 | SpeakEasy | Multimodal scoring of recorded video (content plus delivery) | SUB |
| U3-3 | Maatchaa | Multimodal embedding match for a two-sided marketplace | SUB |
| U3-4 | Puppeteer | LLM-controlled runtime probes and mutation | SUB |
| U3-5 | ChessMate | XY gantry plus magnet actuation | HW |
| U3-6 | ROSS | Image to segmentation to stroke-path planning (to touch) | SUB (the gantry is HW) |
| U3-7 | Tango | Wake-word voice transform of the clipboard | SUB |
| U3-8 | Optimate | Explainable ranked queue plus learning from accept/reject | SUB |
| U4-1 | kinemo | Webcam pose to kinematic action classification | **$0** |
| U4-2 | Dispatch | Live transcript to triage priority queue (already on Ollama) | **$0** |
| U4-3 | OverSEA | Two-source anomaly diff (A minus B) plus hotspot clustering | $0 (GFW data is free) |
| U4-4 | Sandbox EDU | Goal to sequenced curriculum plus embedded sandbox | SUB |
| U4-5 | CarbonChain | On-chain proof-of-impact certificates | $0 (testnet) |
| U4-6 | Superhuman | Parallel agents doing natural-language search over video | HARD |
| U4-7 | SARTech | Behavior-model Monte Carlo map to search path | core $0; drone HW |
| U4-8 | Blitz | Fiducial 6-DoF prop as a motion controller | **$0** |
| U5-1 | codebreaker | Vertical agent harness plus benchmark | HARD (frontier evals) |
| U5-2 | RIIS | Robot video to Gaussian splat in VR | HW |
| U5-3 | Autopsy | Agent-trajectory recorder to failure KG to injected lessons | SUB (Gemma already optional) |
| U5-4 | Drip | Compute waste heat to physical desalination | HW |
| U5-5 | Dots | Floor plan to structured context to QR-linked Q&A agent | SUB |
| U5-6 | Accent | Screenshot to UI-element detection to intent grounding | SUB (desktop; heavy) |
| U5-7 | SPECTRA | Upsampling phone LiDAR plus RGB to dense depth | HW |
| U5-8 | Bridge | Any media to text to tactile (braille) actuation | HW |

### Cluster A (online AI and devtool)
| ID | Project | Core reusable primitive | Status |
|---|---|---|---|
| A1-1 | Tailored Labs | Natural language to edit operations on a media timeline | SUB (ffmpeg.wasm, Whisper) |
| A1-2 | Weight Coach | Camera/voice inventory to planner plus hands-free voice agent | SUB |
| A1-3 | KeyHaven | Secrets vault plus anomaly alerts | $0 |
| A1-4 | Klinva | Multi-role vertical CRM scaffold | $0 |
| A1-5 | Ecobolt | Sensor telemetry, threshold alerts and actuation | HW |
| A1-6 | CallVance | Outbound AI phone agent | HARD (telephony costs money) |
| A1-7 | ModelMash | Multi-model fan-out plus LLM-as-judge | SUB (Ollama models) |
| A1-8 | Legion | Streak and accountability engine plus persona coach | SUB |
| A2-1 | RiskWise | Intent-routed quantitative, web and report agents | SUB (web grounding is weak) |
| A2-2 | Apollo | Coordinator, researcher and critic research loop | SUB (self-hosted SearXNG) |
| A2-3 | Bits2Brain | Multimodal content to a knowledge graph | SUB |
| A2-4 | WorkWizee | Chat-ops to multi-tool actions | SUB |
| A2-5 | ModelProof | Dual-LLM consistency plus audit guardrail | SUB |
| A2-6 | TARIFFED! | SQL function-calling over a regulatory dataset | SUB |
| A2-7 | Konveyor | RAG in chat plus knowledge-gap detection | SUB |
| A2-8 | Agentic SW Factory | Multi-agent development pipeline over MCP | SUB (quality is HARD) |
| A3-1 | Globot | Crisis crew plus adversarial verifier | SUB |
| A3-2 | Aegis (Gemini) | Multimodal triage swarm plus human-approval gate | SUB |
| A3-3 | Netra | Streaming camera to LLM plus persistent spatial memory | SUB (local VLM latency) |
| A3-4 | Proofy.AI | Authenticity/scam check callable from any screen | SUB (detection quality) |
| A3-5 | Agent-weaver | Git-versioned shared agent memory over MCP | SUB |
| A3-6 | OrphaFold | Agent pipeline over free biomedical APIs | SUB |
| A3-7 | AgentGuard | Intent classifier with a cache in front | SUB |
| A3-8 | Orbital Assets | **Deterministic compute core plus LLM narrative layer** | $0 / SUB |
| A4-1 | Gemma Vision | Offline on-device multimodal plus non-touch control | **$0** |
| A4-2 | Vite Vere | Image to simplified spoken steps, offline | **$0** |
| A4-3 | 3VA | Per-user personalization of AAC expansion | $0 (fine-tuning needs a Mac/GPU; few-shot works) |
| A4-4 | Sixth Sense | Cheap detector gating an expensive VLM (cascade) | **$0** |
| A4-5 | Dream Assistant | Per-user speech adaptation | $0 (needs a GPU notebook) |
| A4-6 | LENTERA | One offline LLM box serving a LAN | $0 (HW box) |
| A4-7 | Gemma LeRobot | Learned cost model plus LLM exploration planner | HW |
| A4-8 | Jetson Gemma | Edge voice assistant | HW |
| A5-1 | SpaceGenes+ | Non-additive (synergy) detector across conditions | $0 |
| A5-2 | Resonant Exoplanets | ML signal detection plus transparent visualization | $0 |
| A5-3 | SkySense | Earth-observation fusion to a personal activity-risk score | $0 |
| A5-4 | Astro Sweepers | Per-object risk score plus compliance report | $0 |
| A5-5 | PureFlow | 3D configurator plus threat-scenario validation | $0 |
| A5-6 | Photonics Odyssey | Coverage/equity modeling | $0 (concept) |
| A5-7 | Gaia+LEO | MILP placement optimizer | $0 (HiGHS) |
| A5-8 | QUEÑARIS | Satellite site suitability plus monitoring | $0 |
| A3x-1..8 | ADK winners | SDR agents, energy agent, essay grading/study plans, GreenOps, lesson generation, NL-to-validated diagrams, trade-hypothesis evaluation, visual agent builder | SUB (all Gemini/Vertex; generic agents) |

### Cluster W (industry, web3 and 2026)
| ID | Project | Core reusable primitive | Status |
|---|---|---|---|
| W1-1 | Hashlocked | HTLC atomic swap between EVM and BTC | $0 (testnet) |
| W1-2 | OnlyDanks | Encrypted message drop discoverable by a shared secret | $0 (testnet) |
| W1-3 | PolyBet | TEE best-execution router plus LLM market matching | SUB |
| W1-4 | livestakes | Parimutuel side-pool on a judged competition | $0 (testnet) |
| W1-5 | Pace Club | ZK single-attribute proof plus proof of activity | SUB |
| W1-6 | POAPrivacy | Passkey-derived stealth-address receiving | $0 (testnet) |
| W1-7 | PrivyCycle | Client-encrypted vault plus revocable sharing plus private AI | SUB |
| W1-8 | PrivacyLinks | Per-site unlinkable identities | $0 |
| W2-1 | Umbra Gateway | Anonymous pay-per-request access (x402 + Tor) | $0 (testnet) |
| W2-2 | Stake Clash | Yield-only-at-risk game economy | $0 (testnet) |
| W2-3 | ChainCraft | **Natural language compiled once into a deterministic state machine** | SUB |
| W2-4 | Tabula | ZK typed-table kernel | $0 but research-grade (HARD in 48h) |
| W2-5 | ParlayVoo | Self-funding agent over x402 | $0 (testnet) / SUB |
| W2-6 | EventGraph | LLM entity resolution across APIs | SUB |
| W2-7 | Necto | Natural language to infra spec to cheapest provider | SUB (the compute itself is PAID) |
| W2-8 | Clean Slate Agent | **AI eligibility issued as a yes/no selective-disclosure credential** | SUB |
| W3-1 | Unruggable | Hardware signer | HW |
| W3-2 | Capitola | Best-price router | $0 |
| W3-3 | Yumi Finance | Portable on-chain credit profile | $0 (testnet) |
| W3-4 | Seer | Trace replay plus source mapping | $0 |
| W3-5 | Autonom | Corporate-action-aware oracle | HARD (paid feeds) |
| W3-6 | MCPay | x402 paywall proxy for MCP tools | $0 (testnet) |
| W3-7 | attn.markets | Revenue-based financing through a shared multisig | $0 (devnet) |
| W3-8 | Samui Wallet | Developer-mode wallet toolbox | $0 |
| W4-1 | MedKit | **Voice role-play persona graded against an authoritative rubric** | SUB |
| W4-2 | Wrench Board | Drawing to graph plus "measure this next" diagnostic loop | SUB (vision quality) |
| W4-3 | Maieutic | Intent-diff review (artifact vs. the author's prior spec) | SUB |
| W4-4 | Virtual Puppet Theater | Hand-tracked puppets plus screenshot self-check loop | SUB |
| W4-5 | MaestrIA | Compact expertise file plus eval against a human baseline | SUB |
| W4-6 | ARIA | Signal monitor agents to structured work orders | SUB |
| W4-7 | OmniBridge | LLM infers a format once and emits a zero-cost local parser | SUB |
| W4-8 | Mobius | Document to executable model, verified against its figures | HARD |
| W5-1 | LORE | Decision memory enforced on future changes | SUB |
| W5-2 | Gitdefender | **LLM feature extraction feeding an online-learning classifier** | SUB |
| W5-3 | Aegis (GitLab) | SHAP attributions to an LLM explanation | SUB |
| W5-4 | GraphDev | Semantic code graph plus blast radius | SUB |
| W5-5 | DocSync | Detect-write-review triad with a confidence gate | SUB |
| W5-6 | Time-Traveler | Ephemeral shadow environments | SUB (local Docker) |
| W5-7 | RedAgent | Tool-call interception with adversarial responses | SUB |
| W5-8 | Launch Control | **Policy-as-code gate: LLM gathers evidence, deterministic score decides** | SUB |

### $0 substitution table (used in Sections 5–7)
| Paid dependency in the parents | $0 substitute |
|---|---|
| Claude / GPT / Gemini (text reasoning) | **Ollama** (Qwen2.5-7B-Instruct, Llama-3.1-8B, Gemma 3 4B/12B) on a laptop; or **WebLLM** in the browser (Qwen2.5-1.5B/3B, Llama-3.2-3B, Phi-3.5-mini) via WebGPU. Structured output through Ollama `format: <json-schema>` or WebLLM JSON mode. |
| Vision LLMs | Ollama `qwen2.5vl:7b` / `llava`; Transformers.js Florence-2, SmolVLM, Moondream2 |
| Whisper API / ElevenLabs STT | whisper.cpp, or Transformers.js Whisper (tiny/base) in the browser; Chrome Web Speech API (free, no key, but audio goes to Google, so it cannot be the "private" path) |
| ElevenLabs / Fish Audio TTS | `speechSynthesis` (Web Speech), Piper, Kokoro-82M (kokoro-js) |
| Embeddings / Pinecone / Chroma cloud | Transformers.js `all-MiniLM-L6-v2`; an in-memory index, Orama, or sqlite-vec |
| OCR (Gemini/Claude vision on documents) | Tesseract.js; pdf.js for text PDFs |
| Detection / segmentation | MediaPipe Tasks (pose, hands, gesture, object); YOLO ONNX in onnxruntime-web; SlimSAM in Transformers.js |
| Supabase / Firebase / hosting | IndexedDB or SQLite locally; GitHub Pages or a local static server (a no-card host is optional) |
| Web search grounding (Bing, Exa, Perplexity) | **No equal-quality $0 option.** Self-hosted SearXNG, or curated offline datasets. Candidates that need live web grounding score lower on feasibility. |
| Mainnet gas / real funds | Testnets (Base Sepolia, Solana devnet, Flow testnet) with faucets, or plain WebCrypto signatures and no chain |

---

## 3. All candidates (30) with synergy scores

Format of each entry: parents; the fused idea; **Emergent capability**; score (C/E/S/I/V).

**C01 — Understudy (a rehearsal arena for high-stakes conversations).** Parents: W4-1 MedKit + U3-2 SpeakEasy + U4-1 kinemo.
- **Idea:** A voice role-play persona (patient, interviewer, angry customer) runs locally. Transcript content is graded against a loaded rubric, while in-browser MediaPipe tracks delivery: eye contact proxy, fidgeting and posture. The debrief shows *what* you said and *how* you said it on one timeline.
- **Emergent capability:** *Only the fusion gives rehearsal in which the counterpart reacts to your body language (it notices you looking away) and grading covers rubric content and delivery together, privately and offline.*
- **Score: 8** (2/2/2/1/1).

**C02 — ClearPass (private eligibility with a portable proof).** Parents: U1-6 Expungo + W2-8 Clean Slate + A4-2 Vite Vere (the offline pattern).
- **Idea:** A RAP sheet is OCR'd and parsed **on-device**. Deterministic state rules decide eligibility, and a local LLM explains the result in plain language. The app then issues a signed yes/no credential (a W3C-VC-style JWT, optionally anchored on a testnet) that an employer or legal-aid clinic verifies without ever seeing the record.
- **Emergent capability:** *Someone can prove "eligible" to a third party while the sensitive record never leaves their own phone. Expungo sent data to cloud LLMs, and Clean Slate sent it to Claude.*
- **Score: 9** (2/3/2/1/1).

**C03 — Receipts (live numeric fact-check against open data).** Parents: U1-3 No Cap + A3-8 Orbital Assets + U4-3 OverSEA.
- **Idea:** Live speech is transcribed. Quantitative claims ("crime doubled since 2019") are extracted into a structured query and run *deterministically* against curated open datasets (FBI UCR, BLS, NOAA). The result is shown as a chart "receipt"; the LLM writes only the verdict wording.
- **Emergent capability:** *A fact-check whose verdict is computed from the actual data rather than asserted by an LLM, with the chart as proof, live during a debate.*
- **Score: 8** (2/2/2/1/1).

**C04 — Say-It-Play-It (a body-controlled game compiler).** Parents: W2-3 ChainCraft + U4-1 kinemo + W4-7 OmniBridge.
- **Idea:** You describe a motion game in one sentence ("dodge falling tacos by squatting, clap to shoot"). A local LLM compiles it *once* into a small JSON game DSL of entities, spawners, win rules and gesture-to-action bindings. A deterministic engine runs it at 60 fps, controlled by MediaPipe pose, with zero inference during play.
- **Emergent capability:** *Anyone (a PE teacher, a physiotherapist, a kid) can create a new playable full-body game from a sentence in about 20 seconds. kinemo had three hand-coded games, and ChainCraft had no body input.*
- **Score: 8** (2/2/2/1/1).

**C05 — Air Changes (gesture jazz with a harmony brain).** Parents: U2-3 ChromaChord + U4-1 kinemo + W4-4 Puppet Theater.
- **Idea:** A MediaPipe hand position selects among the top-k next chords that ChromaChord's deterministic harmonic graph ranks; the other hand shapes voicing and dynamics; Tone.js plays it.
- **Emergent capability:** *A non-musician improvises a harmonically coherent progression with their hands in real time.*
- **Score: 7** (2/1/2/1/1).

**C06 — ScamSense Family (a family-trained scam shield).** Parents: W5-2 Gitdefender + A3-4 Proofy + W5-8 Launch Control.
- **Idea:** A suspicious text, email or screenshot is OCR'd, and a local LLM extracts about 25 scam features (urgency, payment rails, impersonation, link mismatch). An online classifier, seeded on public spam datasets, scores the message. A policy-style YAML gate gives SAFE/CHECK/BLOCK with reasons. Every "this was a scam" or "this was fine" tap from the family updates the model.
- **Emergent capability:** *A scam detector that adapts to the specific scams hitting one family (their bank, their grandkid's name) without sending anything off-device.*
- **Score: 7** (2/2/1/1/1).

**C07 — LeaseLint (a policy-as-code verdict on legal documents).** Parents: W5-8 Launch Control + A3-8 Orbital Assets + U1-6 Expungo.
- **Idea:** A lease PDF goes through pdf.js. A local LLM extracts the clauses into a strict JSON schema. A YAML policy that encodes one state's tenant law then scores the lease deterministically (GO/REVIEW/BLOCK), with hard blockers for illegal clauses. The LLM drafts the negotiation letter.
- **Emergent capability:** *A reproducible, explainable legality verdict on a contract in which the LLM cannot hallucinate the verdict, only the prose.*
- **Score: 7** (2/1/2/1/1).

**C08 — CrashTest (a crash-test lab for AI agents).** Parents: W5-7 RedAgent + U5-3 Autopsy + A2-5 ModelProof.
- **Idea:** An agent's tools are wrapped. Adversarial tool responses are injected, every trajectory is recorded, and failures are classified into a lesson KG. Lessons are injected and the agent is re-run, reporting the fix rate before and after.
- **Emergent capability:** *A closed fuzz → diagnose → learn → re-test loop that measurably hardens a local agent. RedAgent only found failures, and Autopsy only learned from failures that happened naturally.*
- **Score: 8** (2/2/2/1/1).

**C09 — TouchSight (explore any image by touch).** Parents: U5-5 Dots + U3-6 ROSS + A4-1 Gemma Vision.
- **Idea:** A diagram, map or photo is segmented in the browser (SlimSAM plus a local VLM for labels) into labeled regions and edges. On a phone, a blind user drags a finger. Edges play spatialized audio ticks (and vibration on Android), regions speak their labels, and a double-tap asks a question grounded in the region. An embosser/swell-paper SVG export is also produced.
- **Emergent capability:** *A blind student independently explores an arbitrary textbook figure spatially, with no braille hardware and no sighted helper.*
- **Score: 8** (2/2/2/1/1).

**C10 — HandVoice (gesture-driven personal AAC).** Parents: W4-4 Puppet Theater + A4-3 3VA + U4-1 kinemo.
- **Idea:** A user with limited speech trains 8–12 personal hand gestures (a few-shot KNN on MediaPipe landmarks), each mapped to a pictogram concept. A local LLM expands a gesture sequence into a natural sentence in the user's style (a few-shot "voice profile") and speaks it.
- **Emergent capability:** *Expressive, personalized speech from custom gestures with no touchscreen and no internet.*
- **Score: 7** (2/2/1/1/1).

**C11 — Where'd-It-Go (object memory from a walkthrough).** Parents: U2-5 Mira + A3-3 Netra + A4-4 Sixth Sense.
- **Idea:** A phone walkthrough video is processed by a cheap detector cascade (YOLO first, a VLM only on keyframes) into a timestamped object log per room. "Where are my glasses?" returns the frame and room.
- **Emergent capability:** *Consumer-grade "find my stuff" from one video on a laptop, with no 3D reconstruction.*
- **Score: 7** (2/1/2/1/1).

**C12 — VoiceDrift (longitudinal voice-note drift monitor).** Parents: U1-8 Elda + U3-2 SpeakEasy.
- **Idea:** A 60-second daily voice note is transcribed locally. Lexical and acoustic features (pause rate, word-finding, sentiment) are tracked against a personal baseline, with drift alerts to a caregiver.
- **Emergent capability:** *Early behavior-change signals without wearables.*
- **Score: 6** (1/1/2/1/1).

**C13 — CodeQuest (comprehension-gated codebase onboarding).** Parents: W5-4 GraphDev + W4-3 Maieutic + U4-4 Sandbox EDU.
- **Idea:** A repo becomes a semantic graph. Graph nodes "unlock" only when the newcomer explains them in their own words and the explanation passes an intent-diff check.
- **Emergent capability:** *A measurable comprehension map of a codebase for each new hire.*
- **Score: 7** (2/1/2/1/1).

**C14 — StepCheck (offline closed-loop task coaching).** Parents: A4-2 Vite Vere + A3-3 Netra + W4-2 Wrench Board.
- **Idea:** A photo becomes simplified steps. After each step the camera verifies completion before the next is given ("the sock is still on the floor").
- **Emergent capability:** *Verified task completion for users with cognitive disabilities, offline.*
- **Score: 7** (2/1/2/1/1).

**C15 — Proof of Sweat (a no-loss fitness commitment pool).** Parents: U4-1 kinemo + W2-2 Stake Clash + A1-8 Legion.
- **Idea:** Testnet deposits; webcam pose-verified reps; streaks; missed days forfeit yield to the finishers.
- **Emergent capability:** *Trust-minimized commitment contracts.* Note that OnlyGains (an ETHDenver Top-10 winner) is almost exactly this already.
- **Score: 6** (1/1/2/1/1).

**C16 — Dispatch Learner (a triage queue that learns from overrides).** Parents: U4-2 Dispatch + U3-8 Optimate + A3-2 Aegis.
- **Idea:** A local-LLM call triage queue in which dispatcher reorderings retrain the ranking, with a human gate on low confidence.
- **Score: 6** (1/1/2/1/1).

**C17 — LastKnown (a lost-hiker probability planner).** Parents: U4-7 SARTech + A5-3 SkySense + U4-3 OverSEA.
- **Idea:** A Monte Carlo lost-person model over free DEM plus weather risk produces a shareable search-probability map before the trip.
- **Score: 6** (2/1/1/1/1).

**C18 — Legacy Whisperer (plug-and-understand hardware).** Parents: W4-7 OmniBridge + U1-4 HCP + W4-2 Wrench Board.
- **Idea:** Web Serial captures an unknown device stream. A local LLM infers the framing and emits a parser plus an HCP capability schema, so an agent can query and control the device.
- **Emergent capability:** *Plug in a 1980s scale and talk to it.*
- **Score: 8** (2/2/2/1/1).

**C19 — Steady (stress-aware focus guardian).** Parents: U1-7 Haven + U2-8 4sight + A1-8 Legion.
- **Idea:** Webcam rPPG plus posture give a stress score that triggers break or streak nudges.
- **Score: 6** (1/1/2/1/1).

**C20 — VillageMesh (paid community LLM mesh).** Parents: A4-6 LENTERA + W3-6 MCPay + A1-7 ModelMash.
- **Idea:** Offline LLM boxes on a LAN route queries to the best local model and settle per call with testnet x402.
- **Score: 6** (2/1/1/1/1).

**C21 — Replicate (claim reproduction on open data).** Parents: W4-8 Mobius + A5-1 SpaceGenes+ + A3-6 OrphaFold.
- **Idea:** A paper's claim is automatically re-tested against its open dataset (GeneLab and similar).
- **Score: 7** (2/2/2/0/1).

**C22 — Pathfinder Lite (phone-only obstacle steering).** Parents: U2-1 Shepherd + U5-7 SPECTRA + A3-3 Netra.
- **Idea:** Monocular Depth-Anything in the browser drives gap-seeking steering to directional audio or haptics.
- **Score: 7** (2/1/2/1/1).

**C23 — Swipe Matcher (explainable, swipe-trained opportunity finder).** Parents: U3-3 Maatchaa + U3-8 Optimate + W5-2 Gitdefender.
- **Idea:** A student is matched to grants and scholarships through embeddings; swipes retrain the ranking, with RAG justifications.
- **Score: 6** (1/1/2/1/1).

**C24 — Crowd Judge (calibrated competition forecasting).** Parents: W1-4 livestakes + W2-6 EventGraph + U3-8 Optimate.
- **Score: 5** (1/0/2/1/1). **DISCARD**

**C25 — Agent Memory Stack.** Parents: U5-3 Autopsy + W5-1 LORE + A3-5 Agent-weaver.
- **Score: 4** (0/0/2/1/1). **DISCARD**

**C26 — Screen-Agent Stack.** Parents: U5-6 Accent + U1-1 FaceTimeOS + U3-7 Tango.
- **Score: 4** (0/0/2/1/1). **DISCARD**

**C27 — Release-Gate Stack.** Parents: W5-8 + W5-6 + W5-3.
- **Score: 4** (1/0/2/1/0). **DISCARD**

**C28 — Local PrivyCycle.** Parents: W1-7 PrivyCycle + A4-1 (on-device model).
- **Score: 5** (1/0/2/1/1). **DISCARD**

**C29 — Adversarial Debate Fact-Checker.** Parents: U1-3 No Cap + A3-1 Globot + A2-5 ModelProof.
- **Score: 5** (1/0/2/1/1). **DISCARD**

**C30 — Pantry-to-Simple-Steps.** Parents: A1-2 Weight Coach + A4-2 Vite Vere.
- **Score: 5** (1/0/2/1/1). **DISCARD**

---

## 4. Eliminated candidates and reasons

### 4a. Failed the synergy gate (score < 6)
| ID | Reason (one line) |
|---|---|
| C24 Crowd Judge | E=0: a betting pool with a ranking bolted on. Neither parent's capability changes, and it needs real stakes to matter. |
| C25 Agent Memory Stack | All three parents supply the *same* primitive (agent memory). That is overlap, not complementarity. |
| C26 Screen-Agent Stack | Same primitive three times (a voice/screen agent). It is also a "yet another assistant". |
| C27 Release-Gate Stack | A single event, a single slot (a CI gate). Additive features only. |
| C28 Local PrivyCycle | Swapping cloud inference for local inference is a substitution, not emergence. |
| C29 Adversarial Fact-Checker | The emergent claim is what No Cap already claims. Adding more LLMs arguing is a chatbot wrapper. |
| C30 Pantry-to-Simple-Steps | "Weight Coach with a simpler-language mode": a feature, not a new outcome. |

### 4b. Survived synergy but eliminated on feasibility or $0 grounds
| ID | Reason |
|---|---|
| C18 Legacy Whisperer | The live demo needs a real legacy serial device plus USB-serial adapters, which is hardware. Inferring an unknown protocol well depends on frontier-model reasoning: OmniBridge used Opus 4.7, and a 7B local model is unreliable at CRC and framing inference. |
| C21 Replicate | **Cannot be made $0 at acceptable quality.** Mobius needed Opus 4.7 and about 25 minutes per paper; local models cannot reliably read papers and map them to analyses. The integration score was already 0. |
| C22 Pathfinder Lite | The demo depends on walking a blindfolded person through a venue: a physical safety risk and flaky conditions. iOS Safari has no Vibration API, and monocular depth latency on a phone is marginal. |

These are **not eliminated but kept out of the matrix** because feasibility is ≤4 or idea power is too low: C19 Steady (rPPG is unreliable under venue lighting and with a moving subject), C20 VillageMesh (a multi-device LAN plus wallets is heavy demo choreography), C13 CodeQuest (five subsystems), C16 Dispatch Learner, C17 LastKnown, C23 Swipe Matcher (low power and novelty).

---

## 5. Feasibility ranking (surviving candidates)

Feasibility 1–10 = can it be built by vibe coding in ≤48h, with $0 APIs, no special hardware and a reliable live demo?

| Rank | ID | Feas. | Riskiest component | $0 substitute for every paid parent dependency? |
|---|---|---|---|---|
| 1 | C05 Air Changes | 9 | Audio plus pose latency in the browser (keep it under about 80 ms) | Yes. No LLM at all: MediaPipe Hands, Tone.js, a port of the deterministic chord graph. The paid parts (Perplexity, Claude, Suno, ElevenLabs) are dropped. |
| 2 | C07 LeaseLint | 8 | Local-LLM clause extraction accuracy on messy PDFs | Yes: pdf.js/Tesseract.js, Ollama Qwen2.5-7B with a JSON schema, YAML policy. |
| 3 | C01 Understudy | 7 | Latency and realism of the persona turn loop with a local LLM | Yes: WebLLM or Ollama for the persona; Web Speech or Whisper-web for STT; speechSynthesis/Kokoro for TTS; MediaPipe Face/Pose. |
| 3 | C02 ClearPass | 7 | OCR of real RAP-sheet layouts (use 2–3 realistic synthetic sheets) | Yes: Tesseract.js, deterministic rules JSON for 1–2 states, Ollama/WebLLM explainer, WebCrypto ECDSA credential; an optional Base Sepolia anchor. |
| 3 | C06 ScamSense | 7 | Showing that the model *learns* live in 3 minutes | Yes: Tesseract.js, local LLM feature extraction, online logistic regression in JS seeded on the public UCI SMS Spam Collection. |
| 3 | C09 TouchSight | 7 | Segmentation and label quality on arbitrary diagrams | Yes: SlimSAM or edge detection in Transformers.js, Florence-2 or Ollama qwen2.5vl labels, Web Audio (iOS-safe), Vibration API on Android. |
| 3 | C10 HandVoice | 7 | Gesture-classifier robustness under stage lighting | Yes: MediaPipe landmarks with a KNN, WebLLM expansion, speechSynthesis. |
| 3 | C23 Swipe Matcher | 7 | Sourcing a real scholarship dataset | Yes: MiniLM embeddings, online reranker. |
| 9 | C04 Say-It-Play-It | 6 | Local LLM emitting a valid, fun game DSL | Yes: Ollama/WebLLM in JSON-schema mode, a small DSL with defaults, and cached example compilations as a fallback. |
| 9 | C08 CrashTest | 6 | Local tool-calling agents are noisy, so fix-rate numbers can swing | Yes: Ollama Qwen2.5 tool calling, SQLite trajectory store. |
| 9 | C12 VoiceDrift | 6 | Credibility of synthetic longitudinal data; medical-claim risk | Yes: whisper.cpp, Meyda audio features. |
| 9 | C15 Proof of Sweat | 6 | Testnet wallet and faucet friction on stage | Yes: MediaPipe, a Base Sepolia contract. |
| 9 | C16 Dispatch Learner | 6 | Needs realistic simulated calls | Yes (Dispatch already ran on Ollama). |
| 14 | C03 Receipts | 5 | Mapping free-form claims to a correct dataset query | Partly. The deterministic core and the local LLM are $0, but open-world grounding (which No Cap did with Bright Data and Claude) has no $0 equivalent, so it must be scoped to 3–5 curated datasets. |
| 14 | C13 CodeQuest | 5 | Integration breadth (tree-sitter WASM, embeddings, 3D graph, grading) | Yes. |
| 14 | C17 LastKnown | 5 | Monte Carlo on DEM tiles within 48h | Yes (SRTM/OpenTopography, Open-Meteo with no key). |
| 17 | C11 Where'd-It-Go | 4 | Open-vocabulary detection speed in the browser; the GPU-heavy parent (Mira) | Partly: YOLO-World/OWLv2 run locally and slowly, so the video must be pre-processed. |
| 17 | C14 StepCheck | 4 | A local VLM judging "step done" reliably | Partly: SmolVLM/Moondream verification is unreliable, which is the core of the idea. |
| 17 | C19 Steady | 4 | rPPG signal quality | Yes, but flaky. |
| 20 | C20 VillageMesh | 3 | Several devices, LAN and wallets | Yes (testnet), but heavy. |

---

## 6. Decision matrix and sensitivity analysis

**Weights:** default Fit 30% / Power 30% / Feasibility 40%. The default was kept: an unfinished or crashing demo scores zero with judges, and the whole premise (vibe coding, 48h, $0 local models) makes execution risk the dominant uncertainty.

**Tie-break rule** (set in advance): higher Feasibility, then higher Power.

| Rank | ID / Name | Fit (30%) | Power (30%) | Feasibility (40%) | **Weighted** |
|---|---|---|---|---|---|
| 1 | C01 Understudy | **8**: MedKit won 1st at Opus 4.7 and SpeakEasy was an HTN finalist; a judge can be the interviewee live; fits edu/health/career tracks | **8**: interviews, med-ed, sales and de-escalation are huge markets; delivery plus content grading is rare; reusable after the event | **7**: standard web stack plus MediaPipe; the local-LLM turn latency is the risk | **7.6** |
| 2 | C09 TouchSight | **8**: accessibility is the single most reliable impact winner (Dots, ROSS, Gemma Vision, Netra); judges can close their eyes and try it | **7**: tactile graphics are expensive and slow to produce; needs a real blind tester to prove value | **7**: all in-browser; segmentation quality on diagrams is the risk | **7.3** |
| 3 | C04 Say-It-Play-It | **9**: kinemo won 1st Overall because judges could *play*; a live "judge names a game, then plays it" moment; the "LLM once, deterministic forever" pattern won twice | **7**: novel creator tool for PE, physio and kids; a moderate-size market | **6**: DSL design plus local-LLM validity are real risks; mitigated with templates | **7.2** |
| 4 | C07 LeaseLint | **6**: the policy-as-code and anti-hallucination patterns won, but a PDF-review demo is visually flat | **7**: tenant rights affect a very large population; the explainable verdict is novel for consumers | **8**: a text pipeline plus YAML; very reliable | **7.1** |
| 5 | C06 ScamSense Family | **6**: consumer-safety wins (Proofy HM, Gitdefender GP); the live "learning" beat must be staged | **8**: scams are a massive, growing harm; private per-family adaptation is new | **7**: public seed dataset plus local features; a dependable demo | **7.0** |
| 6 | C02 ClearPass | **7**: this *exact* domain won twice (Expungo, Clean Slate) and privacy was the top web3 theme; a document-upload demo is less of a wow | **7**: 1 in 3 US adults has a record; the on-device angle is new, but both parents are close precedents | **7**: rules are handcrafted for 1–2 states; OCR is the risk | **7.0** |
| 7 | C10 HandVoice | **8**: an AAC project (3VA) took 3rd in Gemma 3n; strong personal-story fit | **6**: a small population and competition from commercial AAC; value is unproven without a real user | **7**: few-shot gestures plus a small LLM | **7.0** |
| 8 | C05 Air Changes | **7**: ChromaChord placed 3rd grand prize; a playful crowd demo | **4**: a toy; gesture instruments already exist; limited use after the event | **9**: no LLM, no network, very reliable | **6.9** |
| 9 | C03 Receipts | **8**: No Cap was 3rd Overall; a live debate with chart receipts is a wow moment | **8**: misinformation is a huge problem; computed verdicts are novel | **5**: claim-to-query mapping outside curated data breaks | **6.8** |
| 10= | C11 Where'd-It-Go | **8**: Mira won Most Impactful; the dementia story | **7**: a real need; overlaps with "find my" products | **4**: slow open-vocabulary detection; video must be pre-processed | **6.1** |
| 10= | C14 StepCheck | **8**: Vite Vere took 2nd in Gemma 3n | **7**: dignity-focused, a clear user group | **4**: local VLM verification is unreliable, and that is the core of the idea | **6.1** |
| 12= | C08 CrashTest | **6**: the agent-security category won (RedAgent, codebreaker), but it is a niche devtool | **6**: competes with promptfoo and garak; developer-only audience | **6**: noisy local agents | **6.0** |
| 12= | C12 VoiceDrift | **6**: health track fit, but the demo needs faked history | **6**: clinical claims cannot be validated in 48h | **6**: synthetic data | **6.0** |
| 14 | C15 Proof of Sweat | **6**: web3 track fit, but OnlyGains already won with nearly this | **4**: low novelty | **6**: testnet friction | **5.4** |

### Sensitivity check

**Equal weights (33/33/33, simple average):**

| ID | Score |
|---|---|
| C01 | **7.67** |
| C09 | 7.33 |
| C04 | 7.33 |
| C07, C06, C02, C10, C03 | 7.00 each |
| C05 | 6.67 |
| C11, C14 | 6.33 |
| C08, C12 | 6.00 |
| C15 | 5.33 |

**#1 is unchanged.** C09 and C04 swap into a tie for 2nd. C03 (Receipts) rises into the 7.0 group, and C05 drops out of the top 8.

**Power-heavy (25/45/30):**

| ID | Score |
|---|---|
| C01 | **7.70** |
| C09 | 7.25 |
| C04 | 7.20 |
| C06 | 7.20 |
| C03 | 7.10 |
| C07 | 7.05 |
| C02 | 7.00 |
| C10 | 6.80 |
| C11, C14 | 6.35 |
| C05 | 6.25 |
| C08, C12 | 6.00 |
| C15 | 5.10 |

**#1 is unchanged.** C06 and C03 move up, and C05 falls out of the top 8, with C03 replacing it.

**Conclusion:** C01 Understudy is #1 under all three weightings. The top 3 (C01, C09, C04) is stable except for the order of #2 and #3. Seven of the top 8 are stable. The eighth slot switches between **C05** (when feasibility is weighted heavily) and **C03** (when power is weighted heavily). A team that can scope claims to curated datasets should consider C03 a high-upside alternative.

---

## 7. Top 8 in detail

**#1 — C01 Understudy (7.6). Parents: MedKit + SpeakEasy + kinemo.**
- **Users:** Job seekers, medical and nursing students practicing history-taking, and customer-support or police trainees practicing de-escalation. Anyone who needs *reps* before a high-stakes conversation.
- **Core flow:**
  1. Pick a scenario card: persona plus rubric JSON (e.g., "Behavioral interview – STAR rubric" or "Chest-pain patient – OSCE history checklist").
  2. Hold a spoken conversation. The persona is a local LLM whose system prompt includes a live "delivery state" from MediaPipe: gaze-away %, fidget energy, posture. It reacts in character, e.g. "You seem distracted. Should I repeat that?"
  3. Get a debrief timeline. Rubric items are checked off with transcript quotes, and delivery events are marked on the same timeline, with a replay.
- **Demo beat:** A judge plays the interviewee. Halfway through, they look at their phone and the interviewer calls it out. The debrief then shows "STAR: Result missing" and "gaze-away 34% during Q2".
- **$0 stack:**
  - Vite + React + TypeScript.
  - MediaPipe Tasks (Face Landmarker, Pose).
  - WebLLM with Llama-3.2-3B or Qwen2.5-3B, or Ollama Qwen2.5-7B served locally.
  - STT through the Web Speech API, with Transformers.js Whisper-base as the offline and private mode. TTS through speechSynthesis or kokoro-js.
  - IndexedDB for sessions. Rubrics as JSON files, with the grading step deterministic (checklist matching by the LLM with a JSON schema).
- **Biggest risk:** Turn latency and persona quality from a small local model. Mitigate with streaming tokens, short persona replies, pre-warming the model, and Ollama 7B on the laptop as the demo default.

**#2 — C09 TouchSight (7.3). Parents: Dots + ROSS + Gemma Vision.**
- **Users:** Blind and low-vision students and their teachers of the visually impaired, who today wait weeks for hand-made tactile graphics.
- **Core flow:**
  1. The teacher or student snaps or uploads a textbook figure (map, cell diagram, graph).
  2. In-browser segmentation plus a local VLM or OCR produce labeled regions and edges, which the teacher can correct in 10 seconds.
  3. On the phone the student explores by finger: edges give stereo-panned ticks, regions speak labels, and a double-tap asks "what is this?", answered from the region context.
  4. The export is a swell-paper/embosser SVG plus a QR code linking to the audio version (the Dots pattern).
- **Demo beat:** A blindfolded judge finds "the nucleus" and "the mitochondria" on a cell diagram they have never seen, in under 60 seconds.
- **$0 stack:**
  - Transformers.js (SlimSAM or Florence-2 region captioning) with WebGPU.
  - Tesseract.js for printed labels in the figure.
  - Web Audio API panning, the Vibration API where available, speechSynthesis.
  - Optional Ollama qwen2.5vl for richer labels.
- **Biggest risk:** Segmentation of dense diagrams. Mitigate with a teacher correction step (click to merge or split and rename) and 3–4 pre-tested demo images. Recruit a blind tester before or during the event for the story.

**#3 — C04 Say-It-Play-It (7.2). Parents: ChainCraft + kinemo + OmniBridge.**
- **Users:** PE teachers, physiotherapists who design home-exercise games, kids and party hosts.
- **Core flow:**
  1. Type or say a game idea.
  2. A local LLM compiles it *once*, under a JSON schema, into a tiny DSL: entities, spawn rules, collisions, score and win conditions, and bindings such as `squat→dodge` or `clap→shoot` to a fixed library of about 12 pose actions from the kinemo approach.
  3. A deterministic Canvas/Phaser engine runs it at 60 fps with MediaPipe Pose.
  4. Games are shareable as a URL-encoded JSON, and can be remixed by editing the sentence.
- **Demo beat:** Ask a judge for a game idea, compile it in about 15 seconds, and have the judge play it immediately. Show "0 AI calls during play".
- **$0 stack:**
  - Phaser 3 or plain Canvas.
  - MediaPipe Pose Landmarker.
  - Ollama Qwen2.5-7B with `format` JSON schema, or WebLLM.
  - A Zod validator plus an auto-repair retry, and 5 cached example games as a fallback.
- **Biggest risk:** The LLM produces valid but unfun or broken rule combinations. Mitigate with a deliberately small DSL with safe defaults, a validator, and a "simulate 10 seconds" smoke check (the ChainCraft sim-player idea) before launching.

**#4 — C07 LeaseLint (7.1). Parents: Launch Control + Orbital Assets + Expungo.**
- **Users:** Renters, especially first-time, student and non-native-English renters, plus tenant unions and legal-aid clinics.
- **Core flow:**
  1. Drop in a lease PDF.
  2. A local LLM extracts about 20 clause types into a strict schema, with page and line citations.
  3. A YAML policy file for one state (e.g., California Civil Code deposit caps, entry notice, late-fee limits) scores it deterministically. Hard blockers flag illegal clauses; the verdict is GO, REVIEW or BLOCK.
  4. The LLM drafts a polite negotiation or rights letter citing the statute.
- **Demo beat:** Upload a real-looking lease. Three highlighted clauses turn red ("deposit = 3× rent: exceeds the state cap, BLOCK"). Changing one YAML line re-scores live, which shows that the verdict comes from the rules, not the LLM.
- **$0 stack:** pdf.js plus Tesseract.js, Ollama Qwen2.5-7B (JSON schema), js-yaml policy engine, React UI with clause highlighting.
- **Biggest risk:** Legal accuracy and liability. Scope to one state and about 10 well-sourced rules, add "not legal advice" framing, and cite a source for every rule.

**#5 — C06 ScamSense Family (7.0). Parents: Gitdefender + Proofy + Launch Control.**
- **Users:** Older adults and the family members who act as their "IT department".
- **Core flow:**
  1. Share or paste a suspicious SMS, email or screenshot (a PWA share target).
  2. OCR runs, then a local LLM extracts about 25 named features: urgency, gift-card or crypto payment, sender/brand mismatch, link-domain mismatch, and "family-member emergency".
  3. An online logistic model, seeded on the public UCI SMS Spam dataset and with explained feature weights, combines with a policy gate to give SAFE, CHECK WITH FAMILY or BLOCK, with plain-language reasons.
  4. Family feedback updates the model, and an exported and imported weights file lets the whole family share what it learned without sharing messages.
- **Demo beat:** A new "Grandma, it's Josh, I'm in jail" scam scores CHECK. The family taps "scam" once, and a variant sent seconds later scores BLOCK, with the changed feature weight shown.
- **$0 stack:** Tesseract.js, WebLLM or Ollama, a hand-written online logistic regression in TypeScript, IndexedDB, and a PWA with share target.
- **Biggest risk:** The learning effect has to be visible in a single demo. Pre-seed so that one or two feedback taps visibly flip a borderline case, and show the feature attribution.

**#6 — C02 ClearPass (7.0). Parents: Expungo + Clean Slate Agent + Vite Vere (offline pattern).**
- **Users:** People with old convictions who are eligible for record clearance or Clean Slate relief, plus the employers and legal-aid clinics that need a yes/no, not the record.
- **Core flow:**
  1. Photograph or upload a RAP sheet, processed **entirely on-device**.
  2. Tesseract plus a local-LLM structured extraction (offense codes, dates, dispositions) goes to a deterministic rules engine for 1–2 states (waiting periods, excluded offenses). The LLM explains the verdict and next steps, and pre-fills the petition form (pdf-lib).
  3. The user issues a signed "eligible: yes" credential (ECDSA via WebCrypto, as a QR). The verifier page checks only the signature and the claim; optionally, a hash is anchored on Base Sepolia.
- **Demo beat:** Airplane mode on, the RAP sheet is analyzed, then the judge scans a QR on their own phone and sees only "Eligible under CA PC 1203.4: verified", with nothing else revealed.
- **$0 stack:** Tesseract.js, WebLLM, a rules JSON, pdf-lib, WebCrypto (the jose library), an optional viem call to a testnet.
- **Biggest risk:** It is the least novel of the top 8, because both parents already did most of it. The differentiator (on-device plus portable proof) must be front and center. A self-issued credential only proves the software's verdict, so frame it as clinic-issued: the clinic's key signs after human review.

**#7 — C10 HandVoice (7.0). Parents: Puppet Theater + 3VA + kinemo.**
- **Users:** People with speech impairments who have some hand mobility (for example after a stroke, or with cerebral palsy or ALS in early stages), and their speech-language pathologists.
- **Core flow:**
  1. The SLP and user record 5 samples each of 8–12 personal gestures, and each is mapped to a concept such as WANT, WATER, TIRED, MOM or NOT.
  2. A KNN on normalized MediaPipe hand landmarks recognizes sequences.
  3. A local LLM, few-shot on the user's own "voice profile" examples (the 3VA idea without fine-tuning), expands a sequence such as WANT + WATER + NOT + COLD into "Could I have some water that's not cold, please?". Three alternatives are shown and one is picked with a confirm gesture.
  4. TTS speaks the chosen sentence.
- **Demo beat:** Record a new gesture live in 20 seconds, then compose and speak a full sentence with four gestures.
- **$0 stack:** MediaPipe Hand Landmarker, a KNN in TypeScript, WebLLM (Qwen2.5-1.5B is enough), speechSynthesis or kokoro-js; everything runs offline.
- **Biggest risk:** Gesture misclassification under stage lighting, and a story that sounds hollow without a real user. Add a confirm step and confidence display, and interview an SLP or AAC user before the event.

**#8 — C05 Air Changes (6.9). Parents: ChromaChord + kinemo + Puppet Theater.** *Under power-heavy weights, #8 is C03 Receipts instead.*
- **Users:** Non-musicians, music-theory students and music-therapy sessions.
- **Core flow:**
  1. Pick a key and style.
  2. The right hand's height selects among the top-4 next chords ranked by a port of ChromaChord's deterministic tonal-interval/dissonance graph. The left hand's openness controls voicing density and dynamics.
  3. Tone.js synthesizes the chords, and a visual shows the harmonic graph lighting up the path you took, which is the interpretability hook.
- **Demo beat:** A judge who "can't play anything" performs a ii–V–I turnaround in 30 seconds, and the screen names what they played.
- **$0 stack:** MediaPipe Hands, Tone.js, a precomputed chord graph (TypeScript), Canvas/SVG visualization; no AI API and no network.
- **Biggest risk:** It reads as a toy (low idea power). Strengthen it with a music-education or therapy framing, and keep audio latency low by pre-scheduling notes on the Tone.js transport.
