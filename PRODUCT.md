# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: sighted classroom teachers and teachers of the visually impaired (TVIs).** They prepare textbook diagrams for a blind student (upload, trace each part, write a grade-5 explanation), assign them to a class, and check each student's progress. The only role that edits.
- **Also: hackathon judges and an audience watching the teacher screens on a projector** during a 3-minute pitch. The teacher side must read instantly at a distance and close the loop live: a judge's attempt appears on the teacher side seconds after it happens.
- **Students (blind, elementary to middle school)** use the separate explorer (Part A's code). They never need the teacher screens.

## Product Purpose

TouchSight lets a blind student feel the layout of a diagram through sound on the laptop they already have, for $0, offline. The teacher side turns any diagram into an explorable one in minutes, with no specialist, and shows each student's find-it progress. Success: a teacher prepares a diagram quickly and trusts what the student will hear; a judge watching understands the loop from diagram, to student, and back to the teacher.

## Positioning

A teacher-owned diagram pipeline: diagram → teacher traces parts → figure data → sound and speech in the explorer → swell-paper braille export, all local. Unlike image-description tools, it conveys where things are, not just what is there, and the teacher approves every explanation.

## Operating Context

- Runs as a static React app from `npm run build && npm run preview` on the demo laptop (Windows 11, Chrome, often fullscreen), in airplane mode.
- Teacher screens: dashboard (library, classes with students), student page, diagram editor, upload, swell-paper SVG export, About, and a hidden presenter panel (Ctrl+Shift+D).
- Data: a built-in classroom (Ms. Rivera; Grade 5 · Room 12 and Grade 7 · Science; six students; two assignments; past find-it attempts) with browser storage layered on top; "Reset everything" restores it.
- Per-student activity (find-it attempts) is viewed by opening that student's page. There is no dashboard-wide activity feed. A **Guest** row (Visitors, first in the student list) makes a visitor's live attempt one click from the dashboard.
- The dashboard can search students and add a student to a class; added students are saved on the laptop and cleared by "Reset everything".

## Capabilities and Constraints

- Contract with Part A (`docs/CONTRACT.md`): routes, data shapes and the database API are frozen; Part B owns `src/index.css` tokens and all teacher screens; Part A owns `src/student/**` (the explorer), which consumes the shared tokens.
- Fully offline: no network fonts, CDNs or cloud APIs at runtime. No new runtime dependencies without need.
- No live AI (the Ollama step was skipped): explanation drafts come from a curated answer table and must never be labelled as AI.
- Visible text never says "mock", "fake", "sample", "seed", "test data", "placeholder" or "hardcoded".
- The first Tab on the dashboard lands on "Explore Animal cell". The demo path (dashboard → explore → find the mitochondrion → back → the attempt is visible) must keep working at every commit.

## Brand Commitments

- Name: **TouchSight**. Teacher persona: **Ms. Rivera**.
- **Typeface: Apple's system font** (the stack Apple uses on its own sites: SF Pro Display/Text via `-apple-system`), falling back to Segoe UI Variable on Windows. SF Pro is not bundled (licence).
- Tone: calm, serious, trustworthy, like a tool a school would adopt; never cute.

## Evidence on Hand

- Two traced diagrams: `public/figures/animal-cell.jpg` (OpenStax, CC BY 4.0) and `public/figures/canada.png` (public domain), with parts in `src/data/figures/*.json`.
- Sources for the problem statement are listed in `docs/DEMO.md` (CNIB graduation rates, APH timelines, Monarch price). The classroom history is interface content, never presented as results or evidence.
- No testimonials, customers, pilots or user-testing results exist; do not invent any.

## Product Principles

1. The teacher is in control: every explanation is the teacher's or visibly a draft until they edit it.
2. Show the loop: a student's attempt should be one click from the dashboard, seconds after it happens.
3. Minutes, not months: preparing a diagram should feel quick and obvious.
4. Works anywhere, costs nothing: offline, on the laptop the school already owns.

## Accessibility & Inclusion

WCAG AA on every teacher screen (Lighthouse accessibility ≥ 95; currently 100), fully keyboard-operable with a visible 3 px focus ring, body text 16 px (supporting text no smaller than 13 px), `prefers-reduced-motion` respected, and a remembered high-contrast mode (`data-contrast="high"` on `<html>`) that the explorer also inherits.
