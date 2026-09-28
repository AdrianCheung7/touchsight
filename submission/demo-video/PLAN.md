# TouchSight demo video: strategy and plan

Length: **1:40** (the brief allows 1:30–1:45). 1920×1080, 30 fps. No voice is baked in. The audio is the app's real sonification, recorded from Web Audio, plus a separate sound-effects (SFX) stem. The voiceover (VO) goes on top in post.

## 1. What the audience needs (the psychology)

Beginner-hackathon judges watch dozens of videos back to back, with the rubric in hand (Functionality 35%, Pitch 25%, Tech 20%, UX 20%). What they remember:

| Principle | How the video applies it |
|---|---|
| **Hook in about 3 s** (most launch films reach the UI within about 3 s) | Open on a beautiful cell diagram. It drains to black, and what's left is a single sentence. "This is what a blind student gets." |
| **Identifiable victim** | One student, one diagram, one task. There are no "millions of people" stats walls. The cousin story lives in the VO only; nothing identifying appears on screen. |
| **Novelty first** | Hearing a diagram is the new idea, so it arrives by 0:20 and gets the most screen time. The teacher tools come after. |
| **Show, don't claim** (Functionality 35%) | Every claim gets a live proof shot: the find-it timer, the attempt appearing on the teacher side, the SVG braille, Wi-Fi off. |
| **Peak-end rule** | The peak is the find-it chime, with "Found in N s" held after dead silence. The ending comes back to that same moment, with the logo and the chime, and closes there. There's no "thanks for watching". |
| **Make sound legible on mute** | Judges may watch muted or on laptop speakers, where stereo collapses. Show a HUD: a left↔right pan meter, a pitch meter, captions for speech ("🔊 Nucleus"), a flash on edge ticks, and a small "🎧 sound on" badge. |
| **Tech made visible** (20%) | One 4 s pipeline beat: *point-in-polygon hit test → pan + pitch + timbre → speech*, drawn over the live explorer. |
| **Blackout proof** | The screen goes dark while the sound keeps playing and the cursor keeps finding parts. The viewer feels that "you don't need the picture". This is the most memorable shot. |

Avoid: title cards over 3 s, touring every feature evenly, loading states, jittery cursor, background music over the product, and ending on a credits slide.

## 2. Beat sheet (the VO windows are marked for post)

| Time | Beat | Picture | Sound (app = real sonification, SFX = added) |
|---|---|---|---|
| 0:00–0:06 | **Hook** | Animal-cell diagram on navy. Text: "Half of a science textbook is pictures." Then the image drains to black, and the text becomes: *"The cell has a nucleus and a mitochondrion."* Then "That's what a blind student gets." | Low room tone. A sub-drop as it drains. |
| 0:06–0:16 | **Stakes** (VO window) | Three kinetic cards: **65% vs 81%** finish high school · Tactile graphics take **months** · A tactile display costs **$15,000** | One soft hit per card. |
| 0:16–0:21 | **Reveal** | "What if you could *hear* where things are?" Then the TouchSight logo, then a "🎧 Sound on" badge. | Riser, then **0.6 s of silence**. |
| 0:21–0:44 | **Explore** | Dashboard, then Explore Animal cell, then Enter. The cursor wanders with the HUD, and labels appear one at a time: "← stereo →", "pitch = height", "new part = new sound + its name". | **App only**: the position tone, thunks and region cues. Caption chips show what's spoken. |
| 0:44–0:52 | **Blackout** | The diagram fades to black. Only the cursor dot and captions remain. "No picture needed." | App only. |
| 0:52–1:10 | **Find-it (the peak)** | F, then countdown, then "Find the mitochondrion". The timer runs, the search path is purposeful, then there's a beat of silence, then the chime, then **"Found in N s"**, held and zoomed. | Countdown clicks, the app's search sounds, silence, the **chime**, and a soft SFX swell under it. |
| 1:10–1:16 | **Explain + ask** | Space shows the grade-5 explanation. A shows the question "What does it do?" and its answer. | App cues. |
| 1:16–1:23 | **Teacher loop** (VO window) | Dashboard: the student's row reads "Active just now". Their page shows the new attempt at the top of the trail. | Whoosh in. A UI tick when the row highlights. |
| 1:23–1:30 | **Any diagram** (VO window) | The editor: drag a vertex, rename a part, Preview. A quick cut to Canada being explored. | Soft ticks. The Canada region cues. |
| 1:30–1:35 | **Braille export** | Export the swell-paper SVG, then zoom in to the braille dots. | Paper-slide whoosh. |
| 1:35–1:40 | **Pitch close** | About pipeline, then "Offline · $0 · No student data leaves the laptop." | Hit. |
| 1:40–1:44 | **End on the peak** | "Found in N s" returns, then the TouchSight logo and the tagline "Every diagram, by sound." | **The chime**, and out. |

## 3. Production method

- **Capture**: `capture.js` runs the real production build in system Chrome using playwright-core. It uses a CDP screencast (JPEG frames with timestamps) at 1920×1080. It stubs pointer lock the same way `e2e.js` does, and moves the cursor along eased, human-looking paths.
- **App audio**: an init script tees every Web Audio connection to `destination` into a MediaStreamDestination, and a MediaRecorder records it. This captures the product's real sound, sample-accurate, and it's aligned to the frames by wall clock.
- **Speech**: headless Chrome can't record `speechSynthesis`, and the brief says *no voices*. So each spoken phrase becomes an on-screen caption chip. The HUD and cards are DOM overlays injected into the same page, so they're in the frames.
- **SFX**: `sfx.py` (numpy) synthesises the room tone, sub-drops, hits, risers, whooshes and the swell from a cue log that the capture writes. No samples are used, so there's no licensing risk.
- **Mix**: ffmpeg (from imageio-ffmpeg) assembles the variable-frame-rate frames into H.264 CRF 18. It mixes the app and SFX stems (with the app stem on top) and loudness-normalises to about −16 LUFS.
- **Deliverables**: `touchsight-demo-final.mp4`, and `stems/app.wav` and `stems/sfx.wav` so the VO editor can duck them.

## 4. Changes after the judge review (applied)

- Find-it now runs on the blacked-out diagram. The picture returns only at the chime, and the cursor is sitting on the mitochondrion when it does.
- Both stat cards carry sources (CNIB; APH / APH Monarch).
- A live "Under the hood" beat: the hit-test coordinates, pan/Hz and `speak()` update in real time over the moving cursor.
- The search path is human-shaped: wrong turns, pauses and a near miss. It is found in 9 s, not 3 s.
- The student is launched from the class roster, so the teacher's page shows **the same 9 s** attempt, marked "just now".
- Canada is cut, and the ending returns to the peak ("Found in 9 seconds", then the chime, then the logo).
- Not doable in automation, so left for post: a picture-in-picture of hands on a trackpad, real TTS audio, and an airplane-mode B-roll shot (see the README below).
