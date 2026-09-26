# TouchSight — Demo, pitch and submission

Judging: **Functionality 35%** · Pitch 25% · Technical Complexity 20% · UX & Design 20%.
Targets: **Overall**, **Best Use of Tech for a Real-World Problem**, **Audience's Choice**.
⚠️ Confirm the pitch length with the organisers. The script below is 3:00, with a 2:00 cut marked ✂️.

## Presentation rules

1. **The product speaks for itself.** Never say "hardcoded", "mock", "fake", "sample data", "pretend", "placeholder" or "for the demo" on stage, in the video or on Devpost. The dashboard is simply "the teacher's view"; the answers are simply "TouchSight's answers".
2. **Never cite the classroom's history as results.** The progress numbers on the dashboard are part of the interface, not evidence. The only number we claim is the one the judge produces live ("Found in N seconds").
3. **AI beat only if it's live.** If B9 (live Ollama) is green at the freeze, show **✨ Write with AI** and name the local model. If not, skip that click and don't name a model: the editor beat becomes "the teacher traces and writes the explanation". Nothing is revealed, and nothing is claimed that isn't running. Judges often ask to see the repo and check Devpost claims against it, so a claimed-but-absent feature is a disqualification risk.
4. **Never lie in Q&A.** The answers below are true and confident. Use them as written.
5. **The cousin:** never name them, and say nothing that could identify them (they're a minor). Nothing about them is invented.

## Why the pitch is built this way

- **Open on one child, not a statistic.** People respond more to one identifiable person than to large numbers (the identifiable-victim effect). The stats *follow* and scale that one story up.
- **Show, don't claim.** A judge wearing the blindfold turns "Functionality" into something the room *watches*. People value what they take part in, so a judge who found the mitochondrion becomes your advocate.
- **Close the loop in front of them.** Seconds after the judge finds it, their attempt appears on the teacher's dashboard. That proves the pieces are one working product.
- **Contrast in one breath.** "Months" and "$15,000" are said right next to "a few minutes" and "$0".
- **End on the peak.** People remember the high point and the ending, so we close on the "Found in N seconds" moment and one line. There's no "thank you, any questions" fade-out.

## The 3-minute pitch

**Before you start:** `Ctrl+Shift+D` → **Reset everything** → **Open dashboard**.

**0:00–0:25 · The child** (the dashboard is on screen)
> "My cousin is in elementary school, and my cousin is blind. **[FILL IN: one true, specific moment, 1–2 sentences. For example: 'When their class did the map of Canada, everyone else looked at it. My cousin got a sentence: "BC is on the left."']**
> A sentence isn't a map. You can't *explore* a sentence."

**0:25–0:50 · The stakes**
> "That's not just one kid. In Canada, 65% of blind and partially sighted youth finish high school, compared with 81% of their sighted classmates. Half of a science textbook is pictures. Today, the fix is hand-made tactile graphics, which take specialists **months** per textbook, or a refreshable tactile display that costs **fifteen thousand dollars**."
> ✂️ *2:00 cut: keep only the 65/81 line and "months or $15,000."*

**0:50–1:50 · The wow, live** (Library → Animal cell → **Explore**; hand the laptop to a judge wearing a sleep mask)
> "This is TouchSight. Can I borrow one of you? Put this on. Your trackpad is now the diagram."

- Guide their hand to the trackpad and press `Enter` for them. Say: "Left and right is left and right. Higher pitch is higher up. When the sound changes, you're *inside* something."
- Let them wander for about 10 s so they hear ticks and names. Then press `F`: *"Find the mitochondrion."*
- **Say nothing while they search.** The room watches the timer and the cursor dot. On the chime, point to the screen: *"Found in N seconds."*
- Let them press `A` and ask "what does it do?" and hear the answer. (✂️ *2:00 cut: skip the wander and the question.*)

**1:50–2:25 · The teacher side**

- Press `Esc`, then Back to the dashboard. Point at **Recent activity**: "And on the teacher's side, that attempt is already here. Guest, mitochondrion, N seconds, just now. Every student's progress, per diagram."
- Open **Edit** on the cell. Say: "A teacher uploads any diagram and traces the parts in a few minutes, with no specialist." Drag a vertex, rename a region. *Only if B9 is live:* click **✨ Write with AI** and let the explanation appear. Then **Preview as student**.
- Click **Export swell-paper SVG**. Say: "And if the school has a swell-paper printer, it's one click to a real tactile graphic, with braille labels."
- Say: "One more thing: I've had Wi-Fi off this whole time." Point to the airplane-mode icon. Say: "It runs on the laptop the student already has. It costs nothing, it works offline, and no student data leaves the device."

**2:25–3:00 · The close (the peak and the end)**
> "Point-in-polygon hit-testing works out where you are, Web Audio turns position into stereo pitch, and speech names what you're touching. *[If B9 is live: 'and a vision model running on this laptop writes kid-level explanations.']* It all runs locally, and the same data becomes braille. **[Show `#/about` for 3 s.]**
> A minute ago, one of you found a mitochondrion with your eyes closed, in N seconds. My cousin deserves to explore the same diagrams everyone else does. That's TouchSight."

Stop talking.

## Fallback ladder (decide in about 2 s; never debug on stage)

| Failure | Do this |
|---|---|
| Anything looks wrong before starting | `Ctrl+Shift+D` → **Reset everything** |
| No sound | Check the pre-set output device, and press `T` for the test sound. If still silent, play the **backup screen capture** and narrate over it. |
| Pointer lock refused | Click the stage once, then press `Enter`. If that fails, use `Tab` to jump between regions and narrate it as the screen-reader path. |
| Judge takes > 45 s | Say "let me nudge you", press `Tab` to the region next to the mitochondrion, then hand it back. |
| The volunteer isn't comfortable | Blindfold yourself and do it. |
| The editor misbehaves | Skip to Export, then About. The explorer and dashboard are the scored moments. |
| Voice question not heard | It falls back to typing automatically; type the question yourself. |

## Pre-stage checklist (on the demo laptop, 10 minutes before)

- [ ] `npm run build && npm run preview` is running; Chrome is open on `http://localhost:4173/#/`, in fullscreen (F11).
- [ ] **Airplane mode ON.** Reload the page to prove it works offline.
- [ ] `Ctrl+Shift+D` → **Reset everything**. The dashboard shows no session from the last hour.
- [ ] Audio output is the **laptop speakers or a small external speaker**, not headphones. Volume about 70%. Open the explorer and press `T`.
- [ ] Windows Focus Assist / Do Not Disturb is on.
- [ ] A sleep mask or blindfold is in your pocket.
- [ ] If B9 is live: Ollama is running with `OLLAMA_ORIGINS` set, and the model is warm (`ollama run qwen2.5vl:7b "hi"`).
- [ ] The backup screen capture is on the desktop.
- [ ] Charger is plugged in and the power plan is set to Best performance.

## Likely judge questions (true answers only)

- **"Why not a tablet?"** "Students already have laptops from school. A trackpad is relative, so we carry position with sound, which also helps students with limited motor precision. Touchscreens are next."
- **"Where do the explanations come from?"** "The teacher is always in control: they write or approve every explanation, at a grade-5 reading level." *If B9 is live, add:* "…and a vision model running locally drafts them from the image."
- **"Is this a real class?"** "That's the teacher view: classes, assignments and each student's progress on each diagram. The attempt you just made landed there live."
- **"Is this real braille?"** "It's Grade 1 UEB, with dots drawn at standard size. We haven't printed it on swell paper yet. Grade 2 (contracted) braille is next."
- **"What's different from Seeing AI?"** "Seeing AI tells you *what* is in a photo. TouchSight lets you feel *where* things are in a textbook diagram, with a teacher checking it."
- **"Did a blind person test it?"** "Not formally yet. My cousin is the reason we built it, and testing with blind students is our next step." (Only if true, and your family is comfortable with it.)

## Devpost write-up (draft; the teammate edits it)

**Tagline:** Blind students explore any diagram by sound, on the laptop they already have.

**Inspiration**
My cousin is blind and in elementary school. **[Same true moment as the pitch, one sentence.]** A sighted student can explore a diagram. A blind student usually gets a spoken summary, or waits months for a hand-made tactile graphic. In Canada, 65% of blind and partially sighted youth graduate high school, compared with 81% of their peers.

**What it does**
- A student explores a diagram using the trackpad. Stereo panning tells them left and right, pitch tells them up and down, and the timbre changes inside each part. Crossing an edge ticks, and each part's name is spoken as they enter it.
- `Space` explains the current part at a grade-5 level, and `A` answers a spoken question about it. `Tab` jumps between parts, and **Find-it** turns learning into a game.
- Teachers get a workspace:
  - a library of diagrams;
  - classes and assignments;
  - every student's find-times per diagram;
  - an editor to trace and explain any uploaded diagram in minutes.
- One click exports a swell-paper SVG with Grade 1 braille labels.
- Everything runs offline, costs $0, and no student data leaves the laptop.

**How we built it**
React + Vite + Tailwind, with no backend; data lives in the browser's IndexedDB. Web Audio (oscillator → gain → stereo panner) handles sonification, with Pointer Lock for trackpad input and `speechSynthesis` or an `aria-live` screen-reader mode for speech. Point-in-polygon hit-testing uses "smallest region wins" for nested parts. Braille dots are drawn as SVG circles at standard dot spacing. *[If B9 is live: Ollama (`qwen2.5vl:7b`) runs locally to draft explanations and answer questions from the image.]*

**Challenges**
- A trackpad has no absolute position, so we made position audible instead.
- Making an interface that is fully usable without a screen, and still polished for the sighted teacher.
- Building it as two independent halves (the student explorer, and the teacher workspace and data) behind one contract, so they merged cleanly.

**Accomplishments**
A blindfolded person can find a mitochondrion in seconds on a regular laptop, and their teacher sees it instantly.

**What's next**
Testing with blind students and teachers of the visually impaired, automatic region detection, Grade 2 braille, touchscreen support, more diagram types (graphs, circuits), and sharing figures between teachers. *[If B9 isn't live: vision-model explanations.]*

**Built with:** react, vite, tailwindcss, typescript, indexeddb, web-audio-api, pointer-lock-api, web-speech-api, svg *[+ ollama, qwen2.5-vl only if B9 is live]*

## 2-minute demo video: shot list (the teammate records after the freeze)

| Time | Shot | Audio |
|---|---|---|
| 0:00–0:12 | Black screen with white text: the one true sentence about the cousin (no name). | Silence, then a soft room tone. |
| 0:12–0:25 | Three stats appear one at a time: 65% vs 81%, "months", "$15,000". | Voice-over (VO) reads them. |
| 0:25–0:35 | The dashboard, then Animal cell → Explore. | VO: "This is TouchSight." |
| 0:35–1:05 | **Screen capture with system audio**: the cursor wanders, ticks and names, then `F` → "Find the mitochondrion" → chime → "Found in N seconds." Cut to hands on the trackpad of a blindfolded person (no face needed). | App audio only. **The money shot.** |
| 1:05–1:15 | Back to the dashboard: the new row appears at the top of Recent activity. | VO: "Their teacher sees it instantly." |
| 1:15–1:30 | The editor: trace a region, rename it (✨ only if B9 is live), Preview. | VO: a teacher prepares any diagram in minutes. |
| 1:30–1:40 | Export the SVG, zoom in on the braille dots. | VO: swell paper. |
| 1:40–1:50 | Airplane-mode icon, then the About pipeline. | VO: "$0, offline, private." |
| 1:50–2:00 | The "Found in N seconds" screen again, then the logo. | VO: the closing line. |

Record with Win+Alt+R (Game Bar), and make sure system audio is captured. Press **Reset everything** before each take.

## Sources (for the About page, Devpost and judge Q&A)

- CNIB, graduation rates (65% vs 81%): https://www.cnib.ca/en/news/cnib-response-policy-accessible-education-students-disabilities
- APH textbook transcription, phased delivery over months and per-page rates: https://www.aph.org/blog/frequently-asked-questions-transcribing-textbooks-for-the-american-printing-house-for-the-blind/
- Jayant et al., Tactile Graphics Assistant (about 10 min per figure even with assistance; months cut to weeks): https://dl.acm.org/doi/10.1145/1296843.1296858
- APH Monarch tactile display (about $15–19k): https://www.aph.org/product/monarch/
- About half of science textbook page space is visual (Lee 2010, via): https://files.eric.ed.gov/fulltext/EJ1269250.pdf
- ImageExplorer (CHI 2022), touch exploration of photos with high mental load: https://dl.acm.org/doi/10.1145/3491102.3501966
- Sonified maps recognised similarly by blind and blindfolded participants: https://link.springer.com/chapter/10.1007/978-3-642-02710-9_62
- HelloHacks 2026 rules and judging: https://hellohacks-2026.devpost.com/
- Figures: OpenStax A&P, "0312 Animal Cell and Components" (CC BY 4.0); "Political map of Canada.png" (public domain), Wikimedia Commons.
