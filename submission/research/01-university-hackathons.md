# Cluster U — Flagship University Hackathons (2025–2026)

Researched 2026-09-25. Winner and prize data were scraped directly from each event's Devpost gallery (winner ribbons) and from each project's Devpost page ("Winner" labels, "Built With" tags, and the write-up). Descriptions summarize what the teams wrote about their own projects. The "Why it likely won" lines are analyst inference, not quotes from judges.

**Paid-service legend:** PAID = usage-billed or subscription API/hardware. FREE-TIER = has a meaningful free tier or hackathon credits, but costs money at scale. FREE/OPEN-SOURCE = self-hostable, open weights, or free public data.

**Substitution:** HackMIT 2025 (Sept 13–14, 2025, MIT) was replaced with **LA Hacks 2026**. HackMIT runs its own judging platform, not a public Devpost gallery. Its `archive.hackmit.org/2025` page is a JavaScript-only app, the obvious Devpost subdomains return 404, and the only public mention of the winners is an Instagram post with no project details. None of this could be verified, so no HackMIT projects are listed.

| # | Hackathon | Edition used | Dates | Size (Devpost) |
|---|---|---|---|---|
| U1 | Cal Hacks | 12.0 | Oct 24–26, 2025 | 2,162 participants / 699 submissions |
| U2 | TreeHacks | 2026 | Feb 14–15, 2026 | 1,096 participants / 378 submissions |
| U3 | Hack the North | 2025 | Sep 12–14, 2025 | 872 registered on Devpost / 261 submissions |
| U4 | PennApps | XXVI | Sep 20–21, 2025 | 85 submissions (participant count not published on Devpost) |
| U5 | LA Hacks (substitute for HackMIT) | 2026 | Apr 24–26, 2026 | 974 participants / 307 submissions |

---

## U1 — Cal Hacks 12.0

- **Official name / dates / venue:** Cal Hacks 12.0, October 24–26, 2025, Palace of Fine Arts, San Francisco. Co-hosted with Claude (Anthropic), Fetch.ai, AppLovin and Amazon Annapurna Labs.
- **Size:** 2,162 participants and 699 submissions on Devpost. About 110 projects received at least one prize.
- **Prize / track structure** (about $58k+ total):
  - **Overall places:** 1st (MacBook Air / Framework laptop), 2nd (Meta Ray-Bans), 3rd (Switch Lite).
  - **Categories:** Best Hardware, Most Creative, Greatest Social Impact, Best Beginner.
  - **Large sponsor tracks:** Claude (tungsten cube + $5k API credits), AppLovin ($10k Query Planner, $3k Ad Intelligence), Fetch.ai (several $1k–$2.5k prizes), Y Combinator ("Build an Iconic YC Company"), Regeneron clinical-trials challenge ($5k grand prize), LiveKit, Vapi, Sui, Ripple, Snap Spectacles, BitRobot and Letta. More than 30 sponsors in total.
- **Gallery:** https://cal-hacks-12-0.devpost.com/project-gallery

### U1-1 — FaceTimeOS: AI Mac Agent
- **Prize(s):** Cal Hacks 1st Overall
- **Source:** https://devpost.com/software/facetime-macos-ai-agent (code: https://github.com/ThePickleGawd/calhacks-25)
- **Pitch:** FaceTime or iMessage your Mac, and an AI agent talks to you, sees your screen and operates the computer for you.
- **Problem:** When you are away from your computer, remote-desktop tools are clunky, and you cannot just *ask* your computer for a file or to re-run a script.
- **How it works:**
  - An incoming FaceTime call's audio is routed through virtual audio devices into speech-to-text.
  - Claude orchestrates the request and decides which desktop actions to run through a Flask backend.
  - A Fetch.ai agent watches the "computer-use trajectory" (file access, app usage, logs), and a Groq-hosted model summarizes it into spoken updates.
  - Replies are synthesized with Fish Audio TTS back into the call, and a confirmation screenshot is sent by iMessage.
- **Tech stack:** Electron, React, Tailwind, Python/Flask, Claude, Fetch.ai uAgents, Groq, Fish Audio, Hugging Face.
- **External APIs:**
  - Anthropic Claude API — PAID
  - Groq — FREE-TIER
  - Fish Audio TTS — PAID/FREE-TIER
  - Fetch.ai Agentverse — FREE-TIER
  - Apple FaceTime/iMessage — FREE (requires a Mac)
- **Why it likely won:** A magical, very demoable interaction: you literally FaceTime your laptop. It hijacks a closed consumer channel for agent control and stacks several sponsor technologies (Claude and Fetch.ai were co-hosts).
- **Core primitive:** A *voice or phone-call interface to a desktop computer-use agent*, i.e. using an existing messaging or calling app as the agent's UI.

### U1-2 — Ted.AI
- **Prize(s):** Cal Hacks 2nd Overall; LiveKit: Most Creative Project
- **Source:** https://devpost.com/software/ted-ai-x8537t
- **Pitch:** A teddy bear with emotion sensing and biofeedback that supports children's mental wellness.
- **Problem:** Children with anxiety or ADHD, or who are lonely, lack a patient, always-available way to regulate their emotions, and parents and clinicians lack visibility.
- **How it works:**
  - An ESP32 inside the bear reads a pulse sensor, capacitive touch (hugs) and an MPU6050 IMU (motion), streaming over MQTT.
  - Speech goes through Whisper, a RoBERTa emotion classifier and LangChain-orchestrated GPT dialogue that guides breathing and focus exercises.
  - A React/D3 dashboard shows emotion timelines and sentiment trends for parents and clinicians.
- **Tech stack:** ESP32/Arduino, TensorFlow Lite Micro, MQTT, Flask, MongoDB, InfluxDB, React, D3, Docker, AWS, Firebase.
- **External APIs:**
  - OpenAI (GPT, Whisper) — PAID
  - Gemini — FREE-TIER
  - Fetch.ai — FREE-TIER
  - AWS — PAID
  - Firebase — FREE-TIER
  - RoBERTa — FREE/OPEN-SOURCE
- **Why it likely won:** Emotional, social-impact story plus a tangible hardware and sensor-fusion prototype, and a polished dashboard.
- **Core primitive:** *Multimodal affect detection* that fuses voice sentiment, touch/IMU and heart rate into one emotional-state estimate, packaged in a physical companion.

### U1-3 — Project No Cap
- **Prize(s):** Cal Hacks 3rd Overall
- **Source:** https://devpost.com/software/project-no-cap (code: https://github.com/aditya-nandyal1/nocaprepo)
- **Pitch:** Real-time AI fact-checking for web articles, live calls and debates.
- **Problem:** Misinformation and bias in online reading and spoken conversation drive polarization.
- **How it works:**
  - Three modes: (1) declarative claims on any web page are cross-referenced against similar publications and flagged for bias or falsehood; (2) live speech in calls or meetings is transcribed and claims are checked by a pipeline of AI search agents; (3) an AI-moderated debate space.
  - Delivered as a web app plus a phone app.
- **Tech stack:** Creao (app builder), Claude, Gemini, Groq, Chroma (vector DB), Bright Data (web scraping), Vapi (voice), Fish Audio, Fetch.ai, Lava, JanitorAI.
- **External APIs:**
  - Claude — PAID
  - Gemini — FREE-TIER
  - Groq — FREE-TIER
  - Bright Data — PAID
  - Vapi — PAID
  - Fish Audio — PAID
  - Chroma — FREE/OPEN-SOURCE
  - Creao — FREE-TIER
- **Why it likely won:** Timely social problem, three concrete surfaces (web, call, debate), and heavy sponsor integration.
- **Core primitive:** *Streaming claim extraction and web-grounded verification*, i.e. a fact-check layer over any text or audio stream.

### U1-4 — Hardware Context Protocol (MCP for Hardware)
- **Prize(s):** Cal Hacks Best Hardware Hack; Crater: Play-Do Prize
- **Source:** https://devpost.com/software/hardware-context-protocol (code: https://github.com/danielzyy/calhacks2025)
- **Pitch:** An MCP-style protocol that lets an LLM discover and control networked hardware. Demoed as a voice-activated chef robot.
- **Problem:** No standard way exists to give LLMs structured, real-time context from, and control over, many different physical devices.
- **How it works:**
  - An SDK takes a minimal JSON definition of a hardware node's actions and sensors and bootstraps a custom TCP pub/sub networking layer on that node.
  - The LLM runs a discovery phase in which nodes subscribe and push context. For example, a camera node exposes detected object locations.
  - The LLM then issues actions to actuators such as an SO-ARM101 robot arm, which uses custom inverse kinematics and path planning.
- **Tech stack:** Python, Flask, TCP sockets, JSON schemas, computer vision, inverse kinematics, SO-ARM101 arm, ASI:One LLM.
- **External APIs:** ASI:One (Fetch.ai LLM) — FREE-TIER. Everything else is custom/open.
- **Why it likely won:** A reusable, protocol-level idea ("MCP for atoms") with a physical robot demo. Technically deep: networking stack, IK, multi-node orchestration.
- **Core primitive:** A *declarative hardware-capability schema plus discovery bus*, so any LLM agent can find and actuate sensors and robots.

### U1-5 — Bob
- **Prize(s):** Cal Hacks Most Creative Hack
- **Source:** https://devpost.com/software/bob-vj43mq (code: https://github.com/raghavrajsah/tethyr/)
- **Pitch:** Agentic AR glasses for physical work that see what you see and guide you step by step (circuits, car repair, furniture).
- **Problem:** Shortage of skilled trades workers (70k electricians, 642k mechanics); novices need expert guidance while their hands are busy.
- **How it works:**
  - Snap Spectacles stream audio and video over WebSockets to a Python server that holds a Gemini Live session.
  - When voice activity detection sees the user stop talking, Gemini Live returns text plus tool calls.
  - Tools include YOLOE-11 text-prompted object detection (to highlight parts with bounding boxes in AR), Gmail/SMTP, Slack, and Google Search/Maps.
  - Results are pushed back to the glasses overlay.
- **Tech stack:** Snap Spectacles (Lens Studio/TypeScript), Python asyncio WebSocket server, Gemini Live, YOLOE, Slack SDK.
- **External APIs:**
  - Gemini Live API — FREE-TIER/PAID
  - Slack API — FREE
  - Gmail SMTP — FREE
  - Google Maps/Search — PAID
  - YOLOE — FREE/OPEN-SOURCE
  - Snap Spectacles — hardware, dev-kit program
- **Why it likely won:** A general-purpose "expert over your shoulder" with live object highlighting is highly visual, and it targets a real labor gap.
- **Core primitive:** *Real-time egocentric video to a multimodal LLM with open-vocabulary object highlighting in AR*.

### U1-6 — Expungo
- **Prize(s):** Cal Hacks Greatest Social Impact; Promise: Public Impact Prize
- **Source:** https://devpost.com/software/clearpathai
- **Pitch:** Upload your RAP sheet, learn whether you qualify for criminal-record expungement, and get your forms filled out automatically.
- **Problem:** Expungement is confusing, varies by state and is hard to navigate without a lawyer, so eligible people never clear their records.
- **How it works:**
  - Gemini parses uploaded court/RAP-sheet PDFs into structured data: case numbers, conviction codes, courts.
  - A LangChain + ChromaDB RAG system over expungement statutes from all 50 states lets GPT-4 reason about eligibility and next steps.
  - The app auto-fills the forms, and a LiveKit voice agent walks the user through their case.
  - All data is processed in memory only.
- **Tech stack:** Next.js 15, TypeScript, Tailwind, FastAPI, HTTPX, Pydantic, LangChain, ChromaDB, LiveKit Agents (WebRTC, Silero VAD).
- **External APIs:**
  - Gemini — FREE-TIER
  - OpenAI GPT-4 — PAID
  - LiveKit Cloud — FREE-TIER
  - ChromaDB — FREE/OPEN-SOURCE
- **Why it likely won:** Clear, underserved civic-justice use case with an end-to-end flow (document to eligibility to filled forms) and privacy by design.
- **Core primitive:** *Legal-document extraction plus jurisdiction-aware RAG eligibility reasoning plus auto form-fill*.

### U1-7 — Haven
- **Prize(s):** Fetch AI: Best Use of Fetch AI; Y Combinator: Build an Iconic YC Company (1st Place); LiveKit: Best Start-up Idea
- **Source:** https://devpost.com/software/haven-536r1q (code: https://github.com/scrappydevs/haven)
- **Pitch:** A multi-agent hospital command center that alerts nurses, unifies EHR data and answers patients' questions.
- **Problem:** Understaffed wards mean patients wait an hour for answers, and nurses spend up to 50% of their shift on documentation and system-hopping.
- **How it works:**
  - A LiveKit + OpenAI Realtime voice agent takes patient questions, asks follow-ups, pulls EHR data and produces nurse-ready summaries.
  - Fetch.ai agents monitor vitals and flag concerning patterns. Camera-based facial photoplethysmography estimates heart rate and stress without contact.
  - A Claude tool-calling agent drives a live 3D floor map with alert-colored rooms and answers natural-language queries about patients.
- **Tech stack:** LiveKit, OpenAI Realtime/Whisper, Fetch.ai uAgents, Claude, Grok, OpenCV (rPPG), WebSockets.
- **External APIs:**
  - OpenAI — PAID
  - Claude — PAID
  - xAI Grok — PAID
  - LiveKit — FREE-TIER
  - Fetch.ai — FREE-TIER
  - OpenCV — FREE/OPEN-SOURCE
- **Why it likely won:** Won three separate sponsor prizes: a startup-grade problem framing plus a multi-agent architecture that uses each sponsor's technology meaningfully.
- **Core primitive:** *Contactless vital-sign estimation from a webcam (rPPG)*, feeding an agentic alert and triage layer.

### U1-8 — Elda AI
- **Prize(s):** Claude: Best Use of Claude
- **Source:** https://devpost.com/software/elda-ai (code: https://github.com/Gaurav890/Elda.git)
- **Pitch:** A voice-first eldercare assistant that learns routines, prevents medication mistakes and flags cognitive decline to caregivers.
- **Problem:** Dementia patients lose independence, forget medications and meals, and caregivers lack continuous insight.
- **How it works:**
  - A React Native voice app talks with the elder.
  - Claude does intent and sentiment analysis, Letta stores long-term behavioral memory, and Chroma detects semantic drift in patterns over time.
  - APScheduler sends reminders, Twilio places voice calls and Firebase sends push notifications.
  - A Next.js caregiver dashboard shows mood, adherence and daily/monthly AI health summaries.
- **Tech stack:** FastAPI, PostgreSQL, APScheduler, React Native/Expo, Next.js, Tailwind, Railway, Vercel.
- **External APIs:**
  - Claude — PAID
  - Letta Cloud — FREE-TIER
  - Chroma — FREE/OPEN-SOURCE
  - Twilio — PAID
  - Firebase — FREE-TIER
  - Railway/Vercel — FREE-TIER
- **Why it likely won:** Strong personal story, full working mobile app plus caregiver dashboard, and a sensible use of Claude for longitudinal summarization.
- **Core primitive:** *Stateful agent memory over daily conversations that produces longitudinal health and behavior summaries*.

**Other notable Cal Hacks 12.0 winners (not detailed above):**
- Duck Duck Goose — AppLovin $10k Query Planner; a DuckDB-based query engine.
- ADLOVIN — AppLovin Ad Intelligence.
- Trialscope AI — Regeneron Grand Prize.
- Krates and Brydge — YC 1st Place.
- MIRAI — BitRobot Best Robotics, 1st.
- Orion — Warp + Vapi; a wildfire operations dashboard.

---

## U2 — TreeHacks 2026 (Stanford)

- **Official name / dates / venue:** TreeHacks 2026, February 14–15, 2026, Stanford University.
- **Size:** 1,096 participants and 378 submissions on Devpost.
- **Prize / track structure** (organizers list more than $1M in combined prizes and credits):
  - **Grand prizes:** 1st $12,000; 2nd $8,000; 3rd iPhone 17 Pro Max per member.
  - **Categories:** Most Creative, Most Impactful, Most Technically Complex, Best Hardware, Best Beginner.
  - **Sponsor tracks:**
    - OpenAI AI Track
    - Anthropic Human Flourishing plus Claude Agent SDK
    - OpenEvidence Healthcare
    - Human Capital Fellowship ($50k equity-free per member, up to $200k)
    - Cloudflare (up to $250k credits)
    - Modal Inference and Sandbox
    - Y Combinator
    - NVIDIA Edge AI
    - Google Cloud AI
    - Zoom Education
    - Greylock multi-turn agent
    - Fetch.ai, Browserbase, Perplexity, Suno and others
- **Gallery:** https://treehacks-2026.devpost.com/project-gallery

### U2-1 — Shepherd
- **Prize(s):** TreeHacks Grand Prize (1st); OpenEvidence Healthcare Track Grand Prize; OpenEvidence Best Use of Clinical Information
- **Source:** https://devpost.com/software/raising-cane (code: https://github.com/tonywangs/shepherd)
- **Pitch:** A motorized smart cane that physically steers blind users around obstacles and navigates by GPS, at about 1/20 the cost of existing smart canes.
- **Problem:** White canes detect obstacles but do not say where to go. Existing smart canes are prohibitively expensive.
- **How it works:**
  - An iPhone mounted on the cane runs ARKit LiDAR depth at 60 fps. Depth is split into left/center/right zones, and a gap-seeking steering engine computes a -1 to +1 command with EMA smoothing.
  - The command goes over a 12-byte BLE packet at 10 Hz to an ESP32-S3, which drives a DC motor and wheel at the cane tip through a leaky integrator. This nudges the cane laterally, with under 50 ms end-to-end latency.
  - Also included: GPS turn-by-turn voice navigation with wheelchair/step-free routing (OpenRouteService), crosswalk data (Overpass), Vision-framework person detection, terrain (grass) avoidance and haptic proximity pulses.
- **Tech stack:** Swift 6/SwiftUI, ARKit, CoreML/DeepLabV3, Vision, CoreBluetooth, CoreHaptics, ESP32-S3 (FreeRTOS, NimBLE), C++, Vapi voice.
- **External APIs:**
  - Google Geocoding — PAID/FREE-TIER
  - OpenRouteService — FREE-TIER
  - Overpass/OpenStreetMap — FREE/OPEN-SOURCE
  - Vapi — PAID
  - GCP — PAID
- **Why it likely won:** Life-changing accessibility impact, a physical device that works in a live demo, strong engineering detail (latency budget, control loop) and a huge cost advantage.
- **Core primitive:** *Phone-LiDAR obstacle-gap steering converted into a haptic or motor direction cue over BLE*.

### U2-2 — Robosurge
- **Prize(s):** TreeHacks Grand Prize (2nd)
- **Source:** https://devpost.com/software/we-use-nix (code: https://github.com/quantum9Innovation/treehacks2026)
- **Pitch:** "Cursor for surgery": one remote surgeon commands several robotic arms through VR and natural language.
- **Problem:** Projected shortage of about 20,000 surgical specialists; operating rooms cost about $2,200/hour per surgeon; today's surgical robots scale motion but do not automate tasks.
- **How it works:**
  - The surgeon's Meta Quest 3 head pose drives a camera arm over WebSocket with a live MJPEG stream.
  - Natural-language commands go to an LLM-fusion layer (GPT-5.2 plus Gemini Robotics-ER 1.5) that plans moves.
  - SAM plus YOLOv11, on an ASUS Ascent GX10 edge box, segment targets. An Intel RealSense depth camera plus ArUco tags give an affine camera-to-robot calibration across four arms.
  - Custom inverse kinematics adds safety guarantees, and a TanStack/FastAPI dashboard with WebRTC shows diagnostics.
- **Tech stack:** Python, FastAPI, TanStack, WebRTC, Meta Quest 3, Intel RealSense, SAM, YOLOv11, ASUS GX10, Nix (reproducible builds), Lean.
- **External APIs:**
  - OpenAI GPT-5.2 — PAID
  - Gemini Robotics-ER — PAID/preview
  - SAM and YOLO — FREE/OPEN-SOURCE
- **Why it likely won:** Very high ambition and technical depth (multi-arm calibration, VR teleoperation, VLM planning) in a high-stakes domain.
- **Core primitive:** *Language-commanded multi-arm manipulation with VLM target segmentation and depth-camera-to-robot calibration*.

### U2-3 — ChromaChord
- **Prize(s):** TreeHacks Grand Prize (3rd); Suno: Best Musical Hack
- **Source:** https://devpost.com/software/chromachord (code: https://github.com/J4Joshua/JASS-APP)
- **Pitch:** A real-time jazz harmony assistant that listens to you play and suggests next chords using 24-dimensional chroma vectors, plus AI track generation.
- **Problem:** Learning jazz improvisation is hard, and LLM-based music tools are uninterpretable.
- **How it works:**
  - Live MIDI from guitar or keyboard is converted to chroma (pitch-class) vectors.
  - A physics- and graph-based harmonic model built from the tonal-interval-space literature ranks roughly 4,000 chords by dissonance and encodes the transitions between them.
  - Deterministic tools do chord detection, key inference and next-chord suggestion locally for low latency.
  - Slower AI features run separately: Perplexity Sonar finds songs with similar progressions, and generative AI adds harmony and melody.
- **Tech stack:** Python, Next.js, Vercel, Claude, Perplexity; the Suno track suggests Suno for generation.
- **External APIs:**
  - Perplexity Sonar — PAID
  - Claude — PAID
  - Suno — PAID/FREE-TIER
  - Vercel — FREE-TIER
- **Why it likely won:** Rigorous, interpretable math (reviewed the literature) combined with a fun live musical demo; a creative departure from "LLM wrapper" projects.
- **Core primitive:** *Real-time MIDI to chroma-vector harmonic analysis with graph-based next-chord suggestion*.

### U2-4 — diffuji
- **Prize(s):** Most Creative; Neo: Most Likely to Become a Product
- **Source:** https://devpost.com/software/diffuji (site: https://diffuji.com/, code: http://github.com/alexkranias/dispo)
- **Pitch:** A diffusion-powered instant camera that prints "half-real, half-dreamed" photos on thermal sticker paper.
- **Problem:** Playful and creative: physical-media nostalgia meets generative AI. It also has a thrift-store price-lookup mode.
- **How it works:**
  - A Raspberry Pi Zero 2 W with an Arducam, rotary encoder, shutter button and OLED sits in a Fusion 360-designed, 3D-printed shell powered by 18650 cells.
  - Photos go to the team's Railway-hosted API, which applies image-to-image diffusion "filters" (e.g., 19th-century, turn into a duck).
  - The result is Bayer-dithered and printed on an inkless thermal printer.
  - A second mode uses Perplexity to look up and print a reference-backed resale price for a photographed object.
- **Tech stack:** Python, Raspberry Pi, Arducam, thermal printer, Railway; cloud image-to-image diffusion APIs (the specific provider is not named in the tags).
- **External APIs:**
  - Image diffusion API — PAID
  - Perplexity — PAID
  - Railway — FREE-TIER
- **Why it likely won:** Delightful and tangible. Judges could take and hold a print, and it is plausibly a consumer product.
- **Core primitive:** *Capture, then a generative image-to-image transform, then a physical print*: an edge device calling a cloud diffusion API.

### U2-5 — Mira
- **Prize(s):** Most Impactful; OpenAI Artificial Intelligence Track
- **Source:** https://devpost.com/software/mira-w65b0a (code: https://github.com/nathanjzhao/treehacks2026)
- **Pitch:** A dementia-care assistant on Ray-Ban Meta glasses that reconstructs your home in 3D, finds lost objects on voice request and alerts caregivers.
- **Problem:** Alzheimer's patients repeatedly lose items and forget medications. They resist outside care, which overloads family caregivers.
- **How it works:**
  - A short video walkthrough is reconstructed into a 3D scene with MapAnything, HLoc, SuperPoint/LightGlue and Depth-Anything-v2.
  - Grounding DINO / Grounded-SAM-2 and YOLOv8 localize objects, so "where are my pills?" flies a Viser 3D viewer to the pill bottle.
  - Medication questions are answered from the health record with evidence-graded citations via Perplexity Sonar.
  - Fall or "help" events trigger caregiver email and Twilio alerts with activity context. A Supabase realtime dashboard updates without polling.
- **Tech stack:** Meta Ray-Ban Gen 3, Kotlin, RTMP/MediaMTX/WebRTC, FastAPI, Modal (GPU), ONNX Runtime, Next.js/React, Supabase/Postgres, Tailscale, Whisper, ElevenLabs TTS, GPT-5-mini, Gemini.
- **External APIs:**
  - OpenAI — PAID
  - Gemini — FREE-TIER
  - ElevenLabs — PAID
  - Perplexity Sonar — PAID
  - Modal — FREE-TIER credits
  - Supabase — FREE-TIER
  - Twilio — PAID
  - Google Cloud — PAID
  - Open models (SAM2, DINO, LightGlue, Depth-Anything) — FREE/OPEN-SOURCE
- **Why it likely won:** Emotional, high-impact use case combined with serious 3D-perception depth, running on real consumer glasses.
- **Core primitive:** *Video walkthrough to a queryable 3D spatial memory with open-vocabulary object localization* ("where is X?").

### U2-6 — Freak in the Sheets
- **Prize(s):** Most Technically Complex; Human Capital Fellowship Prize ($50k equity-free per member)
- **Source:** https://devpost.com/software/freak-in-the-sheets-7jl542 (code: https://github.com/kognise/freak-in-the-sheets/)
- **Pitch:** An LLVM backend that compiles C/C++ (any LLVM language) into a Google Sheets spreadsheet that executes it.
- **Problem:** A pure technical stunt and exploration of computing limits; no real-world pain point.
- **How it works:**
  - The team invented an instruction set, a 2D memory architecture and an encoding for spreadsheet cells.
  - A bytecode interpreter runs inside Google Sheets by abusing iterative calculation to step the VM each tick, plus a backend-validation quirk that keeps it running without user input.
  - They wrote a two-pass assembler and a from-scratch LLVM backend targeting the ISA.
  - For performance, they packed 16,666 32-bit integers per cell using Unicode glyphs (15 bits per glyph).
- **Tech stack:** C/C++, LLVM, JavaScript, Google Sheets.
- **External APIs:** Google Sheets — FREE. LLVM — FREE/OPEN-SOURCE.
- **Why it likely won:** Extreme, verifiable technical difficulty (a compiler backend in 36 hours) and a memorable, funny demo.
- **Core primitive:** *A compiler backend targeting an unconventional runtime*: turning any computational substrate into an execution target.

### U2-7 — Sentinel
- **Prize(s):** Best Hardware Hack
- **Source:** https://devpost.com/software/sentinel-c8ki50 (code: https://github.com/apple-314/treehacks26)
- **Pitch:** A full-stack AI agent system for bare-metal embedded programming. It wrote a 16,000-line Raspberry Pi OS in 24 hours.
- **Problem:** Embedded programming defeats AI agents: datasheet-specific registers, no debugger or prints, and hardware that cannot be sandboxed or power-cycled by software.
- **How it works:**
  - A user submits a repo URL and a task.
  - Built on the Claude Agent SDK: an orchestrator agent reads the codebase, a research agent pulls ARM/BCM2835 datasheets, and parallel worker agents write code and build with arm-none-eabi-gcc.
  - Binaries are queued to a custom Pi server that flashes real Raspberry Pis over UART.
  - An integrated FPGA logic analyzer captures nanosecond-timestamped GPIO traces as structured feedback. The orchestrator merges the work and opens a GitHub PR.
- **Tech stack:** Claude Agent SDK / Claude Opus, Python, FastAPI, Next.js/React/Tailwind, C, ARM assembly, Raspberry Pi Zero W, FPGA logic analyzer, gh CLI.
- **External APIs:**
  - Anthropic Claude — PAID
  - GitHub — FREE
- **Why it likely won:** Closes the hardware-in-the-loop feedback gap for agents, with a jaw-dropping proof point (an entire OS).
- **Core primitive:** *Hardware-in-the-loop test harness for coding agents* (flash, trace, feed back).

### U2-8 — 4sight
- **Prize(s):** Cloudflare: Best Use of Cloudflare Developer Platform (1st place tier up to $250k credits; placement not shown on Devpost)
- **Source:** https://devpost.com/software/4sight-neoslb (code: https://github.com/kl527/4sight)
- **Pitch:** Wearable biometrics plus smart-glasses context predict when you are prone to bad decisions, then trigger interventions on their own.
- **Problem:** Stress, poor sleep and fatigue degrade decision-making, but health trackers only report and never act.
- **How it works:**
  - Custom Bangle.js 2 firmware records 60-second windows of raw PPG and motion (HR, HRV, exertion, sleep indicators). Meta Ray-Ban glasses add visual context through a Gemma-3-4B VLM.
  - Five domain risk scores (stress, sleep, health, cognitive exhaustion, exertion) are combined into a decision-risk score.
  - Above a threshold, it intervenes: Screen Time limits, iMessage nudges via the Poke agent using MCP, and even Amazon orders of stress-relief items.
  - Runs on Cloudflare Workers, D1, Durable Objects and Containers, with Modal for inference.
- **Tech stack:** Bangle.js 2, React Native/Expo, Cloudflare Workers/D1/Durable Objects/Containers, FastAPI, Modal, Gemma 3 4B, GPT-4o-mini, Poke, GitHub Actions.
- **External APIs:**
  - Cloudflare — FREE-TIER
  - Modal — FREE-TIER credits
  - OpenAI GPT-4o-mini — PAID
  - Poke (Interaction Co.) — FREE-TIER
  - Gemma — FREE/OPEN-SOURCE
  - Amazon ordering — PAID purchases
- **Why it likely won:** Deep use of the sponsor's full platform (Workers, D1, Durable Objects, Containers), plus a novel "closed-loop wellbeing" concept with real hardware.
- **Core primitive:** *Wearable PPG/HRV streaming to a real-time physiological risk score that triggers agent actions*.

**Other notable TreeHacks 2026 winners:**
- Mobius — YC and Modal Sandbox; an autonomous company-building agent.
- Project Lend, Tribune and Bloom — Anthropic Human Flourishing.
- ShadowGuard — OpenEvidence; a network-layer PHI-redacting firewall.
- Mirage, ShotSpot and jiggle wiggle — Modal Inference.
- HeartStart — Best Beginner; emergency detection plus CPR robot.
- Keryx and OnTab — Human Capital.

---

## U3 — Hack the North 2025 (University of Waterloo)

- **Official name / dates / venue:** Hack the North 2025, September 12–14, 2025, University of Waterloo (E5/E6/E7), Waterloo, Ontario.
- **Size:** 872 people registered on Devpost and 261 submissions. The in-person hacker count is higher; it is Canada's largest hackathon.
- **Prize / track structure:**
  - No ranked 1st/2nd/3rd. The top honor is **"Hack the North 2025: Finalists"** (12 teams).
  - Big sponsor prizes: Y Combinator Unicorn Prize ($2k + guaranteed YC interview, 3 winners), Rox AI Agent ($10k 1st / $2k 2nd), Cohere API (cash plus up to $4k credits), Federato RiskOps ($2k), Martian LLM Routing, RBC InvestEase, Genesys.
  - Also: Warp, Graphite, Groq, Cerebras, Databricks, Windsurf, VAPI, Snap Spectacles, Solana, Ripple, ETHGlobal, QNX, CSE (network security) and MLH prizes. 28 prize categories in total.
- **Gallery:** https://hackthenorth2025.devpost.com/project-gallery
- **Selection note:** The 12 finalists are unranked. Seven finalists are listed below, plus the only multi-prize YC Unicorn winner. The other finalists are Stu3dio (film-making by talking to 3D workers), Coach Bob! (AR gym warm-ups), Sauron (police cold-case tool), S-KBD67 (Nerf-gun FPS controller) and Lattice (holographic communication).

### U3-1 — DUM-E
- **Prize(s):** Hack the North 2025 Finalist
- **Source:** https://devpost.com/software/dum-e-kgx6at (code: https://github.com/pekachoo/htn-DUM-E)
- **Pitch:** An Iron Man-style robotic arm that takes spoken or typed commands, looks at the table and does things (sorting parts, holding tools).
- **Problem:** Hobby and robotic arms run pre-programmed routines, and vision-language-action models (VLAs) are still immature and context-limited.
- **How it works:**
  - A webcam frame is warped to a bird's-eye view via homography, and OpenCV plus a segmentation model draw bounding boxes.
  - The annotated image goes to a multimodal LLM on Groq for fast inference, and the LLM decides the actions.
  - Commands go to a Flask server on a Raspberry Pi, which sends them to an Arduino. 5-DOF inverse kinematics maps Cartesian targets to servo angles.
- **Tech stack:** Raspberry Pi, Arduino Uno, servos, CAD/3D printing, Python, OpenCV, Flask, C++.
- **External APIs:** Groq (multimodal LLM) — FREE-TIER. OpenCV — FREE/OPEN-SOURCE.
- **Why it likely won:** A physical, general-purpose robot demo built from cheap parts, with a clever "LLM plus homography plus IK" alternative to VLAs.
- **Core primitive:** *Top-down camera homography plus a fast multimodal LLM planner plus IK*: a cheap language-to-pick-and-place pipeline.

### U3-2 — SpeakEasy
- **Prize(s):** Hack the North 2025 Finalist
- **Source:** https://devpost.com/software/speakeasy-vdkc9n (code: https://github.com/Dante-Capobianco/speakeasy-HTN-25)
- **Pitch:** A behavioral-interview practice tool with video that scores what you say and how you say it.
- **Problem:** Video-interview AI tools (HireVue and others) serve recruiters. Applicants have no fair way to practice against AI scoring.
- **How it works:**
  - The user picks behavioral topics and subtopics, the number of questions and timing.
  - An LLM (via the Martian router's chat completions) generates questions.
  - Recorded video answers get verbal analysis of the transcript content and non-verbal analysis of delivery and body language from several models, with actionable feedback and scores.
- **Tech stack:** Node.js/Express, JavaScript, Python, PostgreSQL.
- **External APIs:** Martian LLM router — FREE-TIER/PAID. Speech and vision models — mix of hosted and open.
- **Why it likely won:** A relatable, high-demand student use case with a polished end-to-end flow.
- **Core primitive:** *Recorded-video multimodal scoring*: transcript content plus non-verbal delivery analysis, turned into rubric feedback.

### U3-3 — Maatchaa
- **Prize(s):** Hack the North 2025 Finalist
- **Source:** https://devpost.com/software/maatchaa (code: https://github.com/StockerMC/Maatchaa, site: http://maatchaa.co)
- **Pitch:** Automatically matches Shopify products to trending YouTube Shorts creators, with Tinder-style swiping for sponsorship deals.
- **Problem:** Brand–creator sponsorship matching is manual and slow for small businesses and short-form creators.
- **How it works:**
  - YouTube Shorts are converted to text and thumbnails.
  - Cohere multimodal embeddings of video and products are stored in Pinecone, and a vector search returns the best product matches.
  - Businesses swipe through creators. On confirmation, Gemini picks products, Nano Banana generates product-set visuals, and the YouTube API auto-updates the video description with sponsor links.
- **Tech stack:** Python (BlackSheep), Next.js, Supabase, Pinecone, Cohere, Gemini, Nano Banana, Shopify API, YouTube Data API.
- **External APIs:**
  - Cohere — FREE-TIER
  - Pinecone — FREE-TIER
  - Gemini / Nano Banana — FREE-TIER/PAID
  - Shopify API — FREE
  - YouTube Data API — FREE (quota)
  - Supabase — FREE-TIER
- **Why it likely won:** A clear marketplace business model, a live working integration with real platforms and a fun UX.
- **Core primitive:** *Multimodal (video plus product) embedding matching for two-sided marketplace recommendations*.

### U3-4 — Puppeteer
- **Prize(s):** Hack the North 2025 Finalist; Warp: Best Developer Tool
- **Source:** https://devpost.com/software/puppeteer-7429qv (code: https://github.com/BrianLi23/puppeteer)
- **Pitch:** An AI that attaches probes to your running program's variables and changes data on the fly, e.g. faking a backend so frontend work never blocks.
- **Problem:** Frontend engineers are blocked when the backend or data is not ready, and testing with realistic traffic is hard.
- **How it works:**
  - A terminal UI takes user intent, and an LLM decides which runtime variables to probe.
  - Once probes are attached, an "AI runtime" watches changes. It notifies the user in natural language or injects simulated data and traffic.
  - Requests go through the Martian LLM router to pick cheap versus smart models, including image generation.
- **Tech stack:** Python, React, SQLite, Cohere, Gemini, Martian.
- **External APIs:**
  - Martian — FREE-TIER/PAID
  - Cohere — FREE-TIER
  - Gemini — FREE-TIER
- **Why it likely won:** A novel developer-tool angle (LLM inside the live runtime rather than in the editor) that fits the Warp dev-tool prize.
- **Core primitive:** *LLM-controlled runtime instrumentation*: attach probes to and mutate live program state.

### U3-5 — ChessMate
- **Prize(s):** Hack the North 2025 Finalist
- **Source:** https://devpost.com/software/chessmate-nwygvq (code: https://github.com/o-bm/ChessMate)
- **Pitch:** A physical chessboard whose pieces move themselves, synced with a web app, with voice control and AI coaching.
- **Problem:** Playing real-board chess with distant family, plus accessibility for players with mobility or vision limits.
- **How it works:**
  - A Raspberry Pi 5 uses a webcam CV model to detect piece moves, runs a chess engine, and plans collision-free paths.
  - An Arduino drives a two-axis NEMA 17 gantry (DRV8825 drivers) with an electromagnet that drags magnetized pieces.
  - The web app adds voice commands and AI-agent coaching via Groq.
- **Tech stack:** Raspberry Pi 5, Arduino, stepper motors, electromagnet, Python, Next.js/React, AI agents.
- **External APIs:** Groq — FREE-TIER. Chess engine (e.g., Stockfish) — FREE/OPEN-SOURCE.
- **Why it likely won:** An eye-catching mechatronic demo (pieces moving by themselves) with an accessibility and family story.
- **Core primitive:** *XY gantry plus electromagnet actuation of objects under a surface*, driven by CV state detection.

### U3-6 — ROSS (Remote Operated Semantic Sketching)
- **Prize(s):** Hack the North 2025 Finalist
- **Source:** https://devpost.com/software/ross-42pnvi (code: https://github.com/FowlFarmer/HTN2025)
- **Pitch:** Makes visual art accessible to blind people by "drawing" a painting onto their palms with hot and cold brushes, plus narration.
- **Problem:** Galleries are overwhelmingly 2D visual art that blind visitors cannot experience.
- **How it works:**
  - A voice-triggered webcam photo of the artwork is segmented with Meta SAM into meaningful objects.
  - Each mask becomes simplified strokes, then a stroke graph with a planned traversal order, then smooth curves, each tagged warm or cool by color.
  - A two-axis stepper gantry draws on the user's palm with an alcohol brush (cold) and a heated-resistor brush (warm), while an LLM (Cohere/Gemini) narrates each component.
- **Tech stack:** Arduino, NEMA steppers, servos, 3D-printed parts, Python, SAM (Hugging Face), Cohere, Gemini.
- **External APIs:**
  - Cohere — FREE-TIER
  - Gemini — FREE-TIER
  - SAM — FREE/OPEN-SOURCE
- **Why it likely won:** A highly original multisensory accessibility concept, memorable in a live demo.
- **Core primitive:** *Image to semantic segmentation to stroke-path planning*, i.e. vector drawing paths for a plotter or robot.

### U3-7 — Tango
- **Prize(s):** Hack the North 2025 Finalist; Graphite: Engineering Dream Team
- **Source:** https://devpost.com/software/tango-q37d4z (code: https://github.com/demanr/tango)
- **Pitch:** "Siri if it actually worked on your Mac": a voice agent that acts on your clipboard.
- **Problem:** Constant copy-paste round-trips to ChatGPT break focus.
- **How it works:**
  - A macOS-native Python app monitors the clipboard (text and screenshots) and runs low-power voice activity detection (WebRTC VAD) plus wake-word detection.
  - Spoken requests (make this a CSV, synonym, caption this meme, answer this code question) are routed to fast LLM providers.
  - The result is written back to the clipboard and a notification is shown.
- **Tech stack:** Python, macOS clipboard and notification APIs, WebRTC VAD, wake-word model.
- **External APIs:**
  - Groq — FREE-TIER
  - OpenAI — PAID
  - Gemini — FREE-TIER
  - WebRTC VAD — FREE/OPEN-SOURCE
- **Why it likely won:** Instantly understood, fast and useful everyday demo with strong polish.
- **Core primitive:** *Wake-word voice commands applied to the OS clipboard*: a zero-UI LLM transform on the current selection.

### U3-8 — Optimate
- **Prize(s):** Federato: Best RiskOps Solution for Underwriters ($2k); Y Combinator: Unicorn Prize
- **Source:** https://devpost.com/software/optimate (code: https://github.com/jruttan1/Optimate, demo: https://optimate-two.vercel.app/auth)
- **Pitch:** An AI underwriting dashboard that surfaces the insurance submissions best aligned with a carrier's risk appetite and learns from underwriter feedback.
- **Problem:** Underwriters sift through huge submission queues and juggle total insured value (TIV), loss ratios, building age and state rules under time pressure.
- **How it works:**
  - Policy and submission data from the Federato API is scored against appetite guidelines.
  - The top 10 matches are shown with RAG-generated justifications that cite the rules.
  - Underwriters approve or decline and rate satisfaction, which feeds a reinforcement-learning loop that reweights the ranking.
  - D3 heatmaps show risk and appetite by U.S. state.
- **Tech stack:** Next.js, Tailwind, shadcn/ui, Recharts, D3, Python, AWS DynamoDB, Auth0, Cohere (RAG), Vercel.
- **External APIs:**
  - Federato API — sponsor-provided
  - Cohere — FREE-TIER
  - AWS DynamoDB — FREE-TIER
  - Auth0 — FREE-TIER
  - Vercel — FREE-TIER
- **Why it likely won:** A precise fit to the sponsor's challenge statement with explainability and a feedback-learning loop; a credible B2B startup, hence the YC prize.
- **Core primitive:** *Explainable ranked queue with human-feedback reinforcement*: rank items, justify with RAG, learn from accept/reject.

---

## U4 — PennApps XXVI (University of Pennsylvania)

- **Official name / dates / venue:** PennApps XXVI, September 20–21, 2025, Penn School of Engineering, Philadelphia.
- **Size:** 85 Devpost submissions; the participant count is not published on Devpost. This edition was much smaller than the other four.
- **Prize / track structure** (all non-cash, 23 prizes):
  - **Overall places:** 1st iPad, 2nd AirPods Pro 3, 3rd Fitbit.
  - **Categories:** Sustainability (Bloomberg), Finance (Capital One), Transit, Privacy/Security, EdTech, Entertainment.
  - **Technical:** Best use of Cerebras (2 winners), Gemini, MongoDB, Auth0, CV, Blockchain, AI, Statistics.
  - **Special awards:** Best Beginner, Design, AR/VR, Most Creative, Most Useless, Most Technically Complex.
- **Gallery:** https://pennapps-xxvi.devpost.com/project-gallery

### U4-1 — kinemo
- **Prize(s):** 1st Place Overall
- **Source:** https://devpost.com/software/kinemo (code: https://github.com/arvinmefsha/kinemo)
- **Pitch:** A party-game console where your body is the controller; it only needs a webcam.
- **Problem:** Motion gaming normally needs dedicated hardware (Kinect, VR). This makes it free with any webcam.
- **How it works:**
  - OpenCV captures the webcam, and MediaPipe pose and hand tracking extract landmarks for two players.
  - NumPy computes position, velocity and acceleration to classify punches, kicks, weaves, slices and raised hands.
  - Pygame runs three games (Boxing with timing and stun rules, Flying Fruits slicing, Reaction Time) and a gesture-driven menu.
- **Tech stack:** Python, OpenCV, MediaPipe, NumPy, Pygame.
- **External APIs:** None. All FREE/OPEN-SOURCE.
- **Why it likely won:** Instantly playable by judges, a fun crowd demo, polished game design with no external dependencies.
- **Core primitive:** *Webcam pose/hand landmarks to kinematic action classification* (punch, kick, dodge) as a game-controller layer.

### U4-2 — Dispatch
- **Prize(s):** 2nd Place Overall
- **Source:** https://devpost.com/software/dispatch-evf2sq (code: https://github.com/us-abdullah/dispatch10, demo: https://v0-dispatch-delta.vercel.app/landing.html)
- **Pitch:** An AI copilot for 911 operators: live transcription, urgency triage, protocol scripts and routing.
- **Problem:** Dispatchers must listen, type and recall protocols under stress, and slow triage delays response.
- **How it works:**
  - Calls are transcribed live, and a local LLM (Ollama) classifies the incident and urgency, generates structured incident briefs and suggests protocol-based follow-up questions.
  - Priority scoring is grounded in open 911 datasets from Seattle and NYC.
  - Multilingual translation and caller stress detection feed a call queue that pushes high-risk calls to the top.
- **Tech stack:** Next.js, React, Tailwind, Ollama (local LLM), v0/Vercel.
- **External APIs:**
  - Ollama — FREE/OPEN-SOURCE
  - Open 911 datasets — FREE
  - Vercel — FREE-TIER
- **Why it likely won:** A life-or-death public-safety use case, a personal motivation and a clean dashboard. Local inference addresses privacy.
- **Core primitive:** *Live call transcript to incident classification, priority queue and suggested next questions* (real-time triage copilot).

### U4-3 — OverSEA
- **Prize(s):** 3rd Place Overall
- **Source:** https://devpost.com/software/oversear (code: https://github.com/spicybigmac/pennapps)
- **Pitch:** An AI layer for maritime enforcement that detects untracked ("dark") fishing vessels from satellite radar.
- **Problem:** Overfishing, and 72–76% of industrial fishing vessels are not publicly tracked. Coast guards cannot patrol huge exclusive economic zones.
- **How it works:**
  - Global Fishing Watch Sentinel-1 radar (SAR) vessel detections are cross-referenced with AIS broadcasts to reveal vessels that are not broadcasting.
  - Points are stored in MongoDB and plotted on a 3D Mapbox globe. SciPy density clustering with multi-factor risk (port proximity, fishing season) predicts illegal-fishing hotspots.
  - A Gemini agent, with Exa researching local maritime law, gives recommendations and impact reports.
  - Auth0 enforces clearance levels.
- **Tech stack:** Next.js, Tailwind, Recharts, Mapbox, Python, SciPy, MongoDB, Auth0, Gemini, Exa.
- **External APIs:**
  - Global Fishing Watch API — FREE
  - Mapbox — FREE-TIER
  - MongoDB Atlas — FREE-TIER
  - Auth0 — FREE-TIER
  - Gemini — FREE-TIER
  - Exa — FREE-TIER/PAID
- **Why it likely won:** Real satellite data, a striking globe visualization and a clear environmental and enforcement story.
- **Core primitive:** *Fusing two geospatial data sources to find anomalies* (SAR detections minus AIS = dark vessels), plus hotspot clustering.

### U4-4 — Sandbox EDU
- **Prize(s):** Best use of Cerebras
- **Source:** https://devpost.com/software/sandboxed (code: https://github.com/camelCasedAditya/PennApps)
- **Pitch:** AI-generated, personalized, project-based programming courses with a built-in cloud IDE.
- **Problem:** Beginners all build the same cookie-cutter tutorial projects that look worthless on a resume.
- **How it works:**
  - The user describes a project idea. AI (fast Cerebras inference) splits it into chapters and lessons of random types: video (YouTube API), articles (Tavily search), quizzes, text questions and interactive code exercises.
  - Content is grounded with RAG over Pinecone.
  - Learners code in a Dockerized code-server environment inside the app.
- **Tech stack:** Django, Python, Docker, code-server, Pinecone, Cerebras, Tavily, YouTube API, HTML/CSS/JS.
- **External APIs:**
  - Cerebras inference — FREE-TIER/PAID
  - Pinecone — FREE-TIER
  - Tavily — FREE-TIER
  - YouTube Data API — FREE
  - code-server — FREE/OPEN-SOURCE
- **Why it likely won:** Shows how ultra-fast inference enables on-the-fly course generation; the integrated IDE is a polished touch.
- **Core primitive:** *Goal-to-curriculum generator*: decompose a project into a sequenced lesson plan with mixed content types and an embedded sandbox.

### U4-5 — CarbonChain
- **Prize(s):** Category – Sustainability (Bloomberg)
- **Source:** https://devpost.com/software/carbonchain-m2hxz4
- **Pitch:** A blockchain marketplace that makes voluntary carbon credits traceable, with proof-of-impact NFTs.
- **Problem:** Carbon-offset markets suffer from double counting, greenwashing, opacity and fragmented registries.
- **How it works:**
  - Buyers browse registry-backed carbon projects and fund them directly.
  - Each purchase mints an immutable "Proof-of-Impact" NFT recording project, tonnage and date, with a public transaction history.
  - A simplified flow lets people who do not use crypto participate.
- **Tech stack:** React, Python, HTML/CSS/JS, smart contracts (chain not specified on Devpost).
- **External APIs:** Blockchain network — gas fees (PAID, small). Registry data — FREE/public.
- **Why it likely won:** Directly addresses the sponsor's sustainability theme with a clear trust mechanism.
- **Core primitive:** *On-chain proof-of-purchase certificates for real-world impact assets*.

### U4-6 — Superhuman
- **Prize(s):** Category – Privacy / Security
- **Source:** https://devpost.com/software/superhuman (code: https://github.com/Harpith2/superhuman)
- **Pitch:** A swarm of 20+ parallel AI agents that searches CCTV footage for suspects so cold-case investigations go about 10x faster.
- **Problem:** Investigators review terabytes of surveillance footage clip by clip.
- **How it works:**
  - The OpenAI Agents SDK fans out 20+ agents across camera feeds.
  - LaMa / Fast Fourier Convolution inpainting restores occluded frames.
  - OpenCV face re-identification plus LLaVA and GPT-Vision match frames to natural-language suspect descriptions, fused into one timeline with a map view.
  - Runway Gen-4 extrapolates a likely trajectory video, and ElevenLabs voices news-style alerts that can be posted to X.
- **Tech stack:** Next.js, Zod, Python, OpenAI Agents SDK, OpenCV, LaMa, LLaVA/Llama, Cerebras, Google Maps, ngrok.
- **External APIs:**
  - OpenAI — PAID
  - Runway Gen-4 — PAID
  - ElevenLabs — PAID
  - Cerebras — FREE-TIER
  - Google Maps — PAID/FREE-TIER
  - X API — PAID
  - LaMa and LLaVA — FREE/OPEN-SOURCE
- **Why it likely won:** Technically dense parallel-agent pipeline with a dramatic demo. It raises obvious ethics questions, but it won the security category.
- **Core primitive:** *Parallel agent fan-out over many video streams with semantic (natural-language) visual search*.

### U4-7 — SARTech
- **Prize(s):** Most Technically Complex Hack
- **Source:** https://devpost.com/software/sartech
- **Pitch:** An autonomous search-and-rescue drone whose search path models how lost people actually move.
- **Problem:** Drone search patterns assume a stationary victim ("lawnmower" sweeps), but lost people move, for example following rivers.
- **How it works:**
  - A Monte Carlo simulation of many simulated lost people moves them over the real terrain using lost-person behavior statistics (Koester's research) to build a probability map that guides the drone's path.
  - A Raspberry Pi companion computer runs an optimized YOLO person detector.
  - Gemini compares each detected person with the missing person's description and photo to confirm a match.
- **Tech stack:** Drone plus Raspberry Pi and camera, Python, YOLO, FastAPI/Flask, React, Google Earth/Maps, Gemini.
- **External APIs:**
  - Gemini — FREE-TIER
  - Google Maps/Earth — FREE-TIER/PAID
  - YOLO — FREE/OPEN-SOURCE
- **Why it likely won:** Combines statistics-driven path planning, on-drone ML and VLM verification in real hardware.
- **Core primitive:** *Behavior-model Monte Carlo probability map to search path*, plus onboard detection and VLM re-identification.

### U4-8 — Blitz
- **Prize(s):** Category – Entertainment
- **Source:** https://devpost.com/software/cv-fps (code: https://github.com/Daniel-1-2-3/BlitzCV)
- **Pitch:** A first-person-shooter game controlled with a cardboard pistol and a printed ArUco marker; no VR headset needed.
- **Problem:** VR and motion controllers are too expensive for many kids.
- **How it works:**
  - OpenCV's ArUco detector plus solvePnP estimate the 6-DoF pose of the cardboard gun from a webcam.
  - The marker's x position is normalized into a stable aim arc.
  - An up-then-down parabolic recoil motion fires. A MediaPipe Hands fist gesture reloads.
  - Pygame/OpenGL renders a 3D weapon using quaternion SLERP and a two-segment IK reload animation.
- **Tech stack:** Python, OpenCV (ArUco, solvePnP), MediaPipe, Pygame, OpenGL, pygltflib, Matplotlib.
- **External APIs:** None. All FREE/OPEN-SOURCE.
- **Why it likely won:** Cheap, clever hardware substitute with a fun, hands-on demo.
- **Core primitive:** *Fiducial-marker 6-DoF tracking of a physical prop as a zero-cost motion controller*.

---

## U5 — LA Hacks 2026 (UCLA) — substitute for HackMIT 2025

- **Official name / dates / venue:** LA Hacks 2026, April 24–26, 2026, Pauley Pavilion, UCLA, Los Angeles.
- **Size:** 974 participants and 307 submissions.
- **Prize / track structure** (about $24.5k+):
  - **Overall places:** 1st Frontier GoWILD pass, 2nd Apple Watch SE 3, 3rd Polaroid.
  - **Themed tracks:** Sustain the Spark (sustainability), Catalyst for Care (health), Light the Way (education), Flicker to Flow (productivity).
  - **Special awards:** Organizers' Choice, Best Social Impact, Best UI/UX, Best Hardware.
  - **Company challenges:**
    - Fetch.ai Agentverse ($1,250) and OmegaClaw
    - Cognition/Devin ($1,000)
    - ROBLOX Civility ($700)
    - Figma Make, Zetic (on-device AI), Cloudinary, ASUS (Ascent GX10), Arista, World
    - MLH prizes
- **Gallery:** https://la-hacks-2026.devpost.com/project-gallery

### U5-1 — codebreaker
- **Prize(s):** 1st Overall; Cognition Company Challenge
- **Source:** https://devpost.com/software/codebreaker-la (code: https://github.com/KevinWu098/codebreaker)
- **Pitch:** AI-native cybersecurity: a new CVE benchmark, a security-specialized agent harness and autonomous patching with Devin.
- **Problem:** Software supply-chain attacks are surging, and existing AI security benchmarks (e.g., CyberGym) cover only C/C++ memory bugs.
- **How it works:**
  - **ECVE-Bench:** Devin curated real GitHub Security Advisories across npm, pip, Maven and Go, stratified over the MITRE CWE Top 25. Each has four hint levels (L0 discovery to L3 targeted).
  - The team ran 280M+ tokens of evals. GPT-5 averaged about 24%.
  - A security harness (tailored prompts, CVE lookup, repo navigation, exploit-reasoning tools) raised Kimi K2.6 from 35% to 47%, close to Claude Sonnet's 48%.
  - Devin then reproduces each found vulnerability, validates it against the vulnerable commit and writes a fix.
- **Tech stack:** TypeScript, React, Cloudflare Workers, Modal (eval compute), GitHub Advisory DB, Devin.
- **External APIs:**
  - Devin (Cognition) — PAID
  - Modal — FREE-TIER credits
  - Cloudflare — FREE-TIER
  - Frontier LLM APIs (OpenAI, Anthropic, Kimi) — PAID
  - GitHub Advisory DB — FREE
- **Why it likely won:** Research-grade contribution (a new benchmark plus measured harness gains) with a complete find-validate-fix loop; strong sponsor fit.
- **Core primitive:** *Domain-specialized agent harness plus benchmark*: measure, then boost, an LLM on a vertical task and close the loop with an autonomous fixer.

### U5-2 — RIIS (Rapid Incident Intelligence System)
- **Prize(s):** 2nd Overall; Fetch.ai: Best Use of ASI:One
- **Source:** https://devpost.com/software/riis (code: https://github.com/srinisriram/RIIS)
- **Pitch:** A rover enters collapsed buildings ahead of rescuers, detects survivors, triages them with AI agents and builds a VR walkthrough of the scene.
- **Problem:** Collapse survivors die waiting for access; responders cannot safely enter or see inside.
- **How it works:**
  - A PiCar-X rover on a Raspberry Pi 5 streams frames over WebSocket, and YOLOv8-pose runs live to draw survivor skeletons.
  - On detection, four Fetch.ai uAgents registered on Agentverse coordinate: Scout (detect), Triage (SBAR report via ASI-1 Mini), Comms (ElevenLabs multilingual voice played through the rover) and Mapping (MASt3R poses plus InstantSplat 3D Gaussian splat).
  - The splat is viewable in Unity on a Meta Quest 2 for incident commanders.
- **Tech stack:** Raspberry Pi 5, PiCar-X, Python, FastAPI, SSE, PyTorch, YOLOv8-pose, MASt3R, InstantSplat, Unity, Meta Quest 2, vanilla JS UI.
- **External APIs:**
  - Fetch.ai Agentverse / ASI-1 Mini — FREE-TIER
  - ElevenLabs — PAID
  - YOLO, MASt3R, InstantSplat — FREE/OPEN-SOURCE
- **Why it likely won:** Full robot-to-AI-to-VR pipeline in 36 hours, a life-saving use case and a meaningful multi-agent design.
- **Core primitive:** *Mobile-robot video to 3D Gaussian-splat reconstruction viewable in VR* (plus pose-based person detection).

### U5-3 — Autopsy
- **Prize(s):** 3rd Overall; Cognition Company Challenge
- **Source:** https://devpost.com/software/autopsy-zq5d84 (code: https://github.com/balebbae/Autopsy, site: https://autopsy.surf)
- **Pitch:** A "black-box flight recorder" for AI coding agents: it records every action, diagnoses failures and injects lessons into the next run.
- **Problem:** Coding agents (opencode, Devin) repeat the same mistakes, such as a skipped migration or type drift, because every run starts from scratch.
- **How it works:**
  - A one-line installer hooks opencode sessions and streams every event (tool calls, edits, chats, permission rejections) through a batched pipeline into Postgres.
  - Rejected runs are classified by deterministic rules (e.g., schema changed but no migration), optionally enriched by a Gemma LLM that reads diffs.
  - Results populate a failure knowledge graph in Postgres plus pgvector (graph_nodes and graph_edges tables).
  - Relevant past failures are retrieved and injected into the agent's next attempt as guardrails.
- **Tech stack:** Python, FastAPI, SQLAlchemy, Postgres/pgvector, Next.js, React, Tailwind, Docker, Cloudflare, opencode, Devin, Codex, Claude, Gemma.
- **External APIs:**
  - Devin — PAID
  - Claude/Codex — PAID
  - Gemma — FREE/OPEN-SOURCE
  - Cloudflare — FREE-TIER
  - GoDaddy domain — PAID
- **Why it likely won:** A sharp, relatable developer pain point, a clever aviation analogy and a real installable tool.
- **Core primitive:** *Agent-trajectory recording, failure classification, and retrieval of past lessons into future prompts* (persistent learning memory for agents).

### U5-4 — Drip
- **Prize(s):** Track: Sustain The Spark (Sustainability)
- **Source:** https://devpost.com/software/drip-6ao9m2 (code: https://github.com/Lewin-B/lahacks2026, demo: https://lahacks2026-mu.vercel.app/)
- **Pitch:** Uses AI compute waste heat to desalinate water, so every prompt makes water instead of wasting it.
- **Problem:** Datacenter evaporative cooling consumes freshwater amid droughts.
- **How it works:**
  - A liquid-cooled Raspberry Pi 5 simulates a datacenter node, hosting containerized agents that call Gemma via Ollama on an ASUS Ascent GX10 over Tailscale.
  - The Pi's waste heat is piped in a closed loop to the hot side of a custom membrane-distillation chamber; the cold side is a Peltier cooler.
  - Seawater collected from Santa Monica beach evaporates through a hydrophobic membrane and condenses as fresh water.
  - A map of U.S. datacenters projects the potential nationwide water yield.
- **Tech stack:** Raspberry Pi 5, ASUS Ascent GX10, Ollama/Gemma, Go, Python, Next.js/React, Tailscale, ngrok, Cloudinary, custom chemistry hardware.
- **External APIs:**
  - Gemma/Ollama — FREE/OPEN-SOURCE
  - Tailscale — FREE-TIER
  - Cloudinary — FREE-TIER
  - Vercel — FREE-TIER
- **Why it likely won:** A surprising physical-plus-AI mashup with real water produced on stage and a timely "AI water footprint" narrative.
- **Core primitive:** *Compute waste-heat recovery into a physical process*: coupling a workload's thermal output to a real-world device.

### U5-5 — Dots
- **Prize(s):** Track: Catalyst For Care; Fetch.ai Agentverse – Search & Discovery of Agents
- **Source:** https://devpost.com/software/dots-y5r21j (code: https://github.com/aryanmudgal-tech/dots)
- **Pitch:** Turns any floor plan into an ADA-style tactile map with a QR code for voice or text Q&A about the layout.
- **Problem:** Blind and low-vision visitors get no usable orientation from visual floor plans and signage.
- **How it works:**
  - A floor-plan upload goes to Gemini, which generates a high-contrast tactile-style map image (patterns and symbols, printable or embossable), a compact "map context" and an ADA-style compliance summary.
  - Each map gets a unique map_id and QR link. Scanning it opens text Q&A via Fetch.ai ASI:One, grounded on that map's context, or voice Q&A via ElevenLabs Conversational AI.
  - The ElevenLabs sessions use server-minted short-lived tokens.
- **Tech stack:** Python, FastAPI, SQLite, Swift, Gemini (google-genai), ASI:One, ElevenLabs.
- **External APIs:**
  - Gemini — FREE-TIER
  - Fetch.ai ASI:One — FREE-TIER
  - ElevenLabs Conversational AI — PAID
- **Why it likely won:** A concrete accessibility deliverable (a printable map) plus a scalable per-venue QR model for businesses and architects.
- **Core primitive:** *Image (floor plan) to structured context, served as a per-object QR-linked voice/text Q&A agent*.

### U5-6 — Accent
- **Prize(s):** Track: Light The Way (Education); Figma Make Challenge
- **Source:** https://devpost.com/software/accent-cdw2qi (code: https://github.com/RyloRiz/accent)
- **Pitch:** A macOS accessibility agent: ask in any language what you want to do, and it highlights the exact UI element to click and tells you.
- **Problem:** Elderly and non-English users get lost in app UIs, e.g. "how do I unmute?"
- **How it works:**
  - A hotkey triggers ElevenLabs speech-to-text (multilingual) and a screenshot at the moment speech ends.
  - An RF-DETR UI-element detector (UI-DETR-1, optimized with ONNX/TensorRT) turns the screenshot into a labeled set of clickable elements.
  - Gemini 3.1 resolves the user's intent against those elements. A local Node server drives an overlay that highlights the target and speaks directions, with a Figma Make animated mascot.
- **Tech stack:** Swift/AppKit menu-bar app, Python, PyTorch, RF-DETR (Hugging Face / Roboflow), ONNX, TensorRT, PyCUDA, Gemini, ElevenLabs, LangChain, Gradio, Ollama, Figma Make.
- **External APIs:**
  - Gemini — FREE-TIER/PAID
  - ElevenLabs STT — PAID
  - Roboflow Cloud — FREE-TIER
  - Google Cloud — PAID
  - RF-DETR — FREE/OPEN-SOURCE
- **Why it likely won:** Turns the generic "screen agent" idea into a teaching and assistive tool (guide, don't click) with a well-engineered perception layer.
- **Core primitive:** *Screenshot to UI-element detector to LLM intent-to-element grounding*: a structured action space for any GUI.

### U5-7 — SPECTRA
- **Prize(s):** Track: Flicker To Flow; Zetic Company Challenge (on-device AI)
- **Source:** https://devpost.com/software/spectra-qbj2gf (site: https://spectra-website-jade.vercel.app/)
- **Pitch:** Turns the iPhone's roughly $25 sparse LiDAR into dense, industrial-grade metric depth maps on-device in real time.
- **Problem:** Industrial LiDAR costs $8k–$75k. The iPhone's LiDAR is cheap but sparse (192x256) and smears at full resolution.
- **How it works:**
  - SPECTRANet is an RGB-guided depth upsampler. An ImageNet-pretrained MobileNetV2 RGB encoder and a light depth-plus-confidence encoder feed a multi-scale fusion decoder that predicts a sharpening residual over a bicubic upsample, producing 768x1024 metric depth.
  - It was trained on ARKitScenes (Faro laser-scan ground truth) on an ASUS Ascent GX10.
  - It was exported fp16 to CoreML and runs in a SwiftUI/ARKit app (live, enhanced and A/B modes), with a remote GX10 fallback.
- **Tech stack:** PyTorch, MobileNetV2, CoreML, Swift/SwiftUI/ARKit, FastAPI, ASUS Ascent GX10.
- **External APIs:** None required at runtime (on-device). ARKitScenes dataset — FREE/OPEN-SOURCE. ASUS GX10 — hardware.
- **Why it likely won:** A real trained model with measurable quality in 36 hours, a strong cost-disruption story and it runs on-device (fits Zetic).
- **Core primitive:** *Real-time dense metric depth from consumer phone LiDAR plus RGB, on-device*.

### U5-8 — Bridge
- **Prize(s):** Best Hardware Hack
- **Source:** https://devpost.com/software/bridge-4euwyt (code: https://github.com/lozlrc/Bridge/)
- **Pitch:** A low-cost refreshable braille display that turns live classroom audio or photos of notes into braille in real time.
- **Problem:** About 160M deafblind people depend on scarce human interpreters, and braille displays cost $3k–$15k.
- **How it works:**
  - Audio is transcribed by Whisper, and images such as handwritten notes are read by Claude.
  - Claude summarizes and extracts the text, which is converted to braille cell patterns.
  - An ESP32 drives stepper motors that rotate a CAD-designed cam cylinder, raising and lowering 3D-printed pins to form each character.
- **Tech stack:** ESP32, stepper motors, CAD/3D printing, Python, FastAPI/Uvicorn, HTML/JS, Whisper, Claude API.
- **External APIs:**
  - Anthropic Claude — PAID
  - Whisper — FREE/OPEN-SOURCE if local, PAID via OpenAI API
- **Why it likely won:** A working mechanical braille display at a fraction of the market price, serving a severely underserved group.
- **Core primitive:** *Any-media (audio or image) to text to tactile actuation*: a cheap refreshable braille or tactile output device.

---

## Cluster-level analysis (U1–U5)

- **Hardware plus AI dominates the top spots.** The grand prizes went to a smart cane (TreeHacks 1st), a surgical robot (TreeHacks 2nd), an emotion-sensing teddy bear (Cal Hacks 2nd), a webcam motion console (PennApps 1st) and a rescue rover (LA Hacks 2nd). Among HTN's 12 finalists, at least 7 are physical builds. Judges reward something they can touch or watch move, paired with an AI "brain."
- **Accessibility and care are the most reliable impact themes.** Blind navigation (Shepherd), art for the blind (ROSS), tactile maps (Dots), braille (Bridge), UI guidance for elderly users (Accent), dementia care (Mira, Elda) and pediatric mental health (Ted.AI) together account for roughly a quarter of the 40 projects. Nearly every "Most Impactful" or "Social Impact" award went to an accessibility or healthcare build with a personal origin story.
- **The "agent" is now the default architecture, but winners ground it in a new *channel* or *feedback loop*:**
  - FaceTime as an agent UI (FaceTimeOS)
  - FPGA hardware traces as agent feedback (Sentinel)
  - agent failure memory (Autopsy)
  - hardware discovery protocol (HCP)
  - security harness plus benchmark (codebreaker)

  Plain chat wrappers rarely placed. Novel sensing or feedback wrapped around an LLM did.
- **Extreme technical depth still wins outright.** Freak in the Sheets (an LLVM backend targeting Google Sheets), codebreaker (a new benchmark with measured harness gains) and SPECTRA (a trained depth model deployed to CoreML) show that judges reward verifiable, quantified engineering: latency numbers, benchmark scores, lines of code.
- **Recurring perception stack:**
  - MediaPipe pose/hands, YOLO (v8/v11/E) and SAM/Grounded-SAM for vision
  - iPhone LiDAR/ARKit for depth
  - Whisper plus ElevenLabs or Fish Audio for voice in and out
  - Gemini Live or OpenAI Realtime for streaming multimodal input
  - Cheap edge hardware: Raspberry Pi, ESP32, Arduino, ASUS GX10 edge box, Meta Ray-Ban and Snap Spectacles glasses, Quest headsets
- **Sponsor-stacking is a deliberate strategy.** Many winners collected two or three prizes (Haven: 3; Shepherd: 3; Mira, ChromaChord, diffuji, Optimate: 2 each) by integrating several sponsor technologies meaningfully. The main tracks were Fetch.ai agents, LiveKit/Vapi voice, Claude, Modal, Cloudflare and Cohere. Fetch.ai uAgents and Agentverse appear at 4 of the 5 events.
- **Most winners depend on usage-billed APIs, but the cheapest winners are fully open source.** kinemo (PennApps 1st), Blitz, Freak in the Sheets and SPECTRA needed no paid API. Typical paid dependencies are frontier LLMs (Claude, OpenAI, Gemini), voice (ElevenLabs, Vapi) and search/scrape (Perplexity, Bright Data, Exa). Free tiers and hackathon credits hide these costs during the event.
- **Reusable primitives that recur across projects:**
  - camera to pose or landmarks to action classification (kinemo, Blitz, RIIS)
  - screenshot to UI-element grounding (Accent, FaceTimeOS)
  - video to 3D reconstruction or queryable spatial memory (Mira, RIIS)
  - phone LiDAR depth to a navigation cue (Shepherd, SPECTRA)
  - LLM planner to IK-controlled arm (DUM-E, HCP, Robosurge)
  - document to RAG eligibility or compliance reasoning (Expungo, Dots, Optimate)

## Data gaps and caveats

- **HackMIT 2025** could not be verified (no public winner gallery), so LA Hacks 2026 was used instead.
- **Hack the North** does not rank its 12 finalists, so there is no 1st/2nd/3rd. U3-1 to U3-7 are finalists in gallery order, not a ranking.
- **PennApps XXVI** is small (85 submissions), and its participant count is not published on Devpost.
- **Placement within sponsor tracks** (e.g., whether 4sight took Cloudflare 1st or 2nd) is not always shown on Devpost.
- **Unconfirmed service details:**
  - diffuji: the diffusion provider is not named.
  - CarbonChain: the blockchain is not named.
  - SpeakEasy: the exact vision and speech models are not named.
  - ChessMate: the chess engine is not named (Stockfish is inferred).
  - Tango: which LLM provider it calls is not confirmed; the listed providers come from its Devpost tags.
- **Devpost participant counts** are registered Devpost users, not necessarily attendees.
