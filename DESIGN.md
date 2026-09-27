---
name: TouchSight
description: A calm teacher workspace for preparing diagrams and following each student's find-it progress.
colors:
  paper: "#f8fafc"
  surface: "#ffffff"
  ink: "#21386c"
  muted: "#52618a"
  line: "#e2e8f0"
  field: "#cbd5e1"
  accent: "#0579fb"
  accent-strong: "#0466d6"
  accent-deep: "#0453ae"
  accent-soft: "#e8f2ff"
  focus: "#0579fb"
  rail: "#21386c"
  rail-active: "#2d4a85"
  rail-ink: "#f8fafc"
  rail-muted: "#afc0dd"
  rail-mark: "#5aa7ff"
  stage: "#152447"
typography:
  family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
  headline: { fontSize: "34px", fontWeight: 650, lineHeight: 1.14, letterSpacing: "-0.035em" }
  title: { fontSize: "20px", fontWeight: 650, lineHeight: 1.2, letterSpacing: "-0.025em" }
  body: { fontSize: "16px", fontWeight: 400, lineHeight: 1.5 }
  meta: { fontSize: "14px", fontWeight: 400 }
  rail-label: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: uppercase }
rounded:
  tag: "6px"
  control: "8px"
  dialog: "14px"
spacing: { sm: "8px", md: "16px", lg: "24px" }
---

# Design System: TouchSight

Source of truth for the look of the teacher screens. Tokens live in `src/index.css` (`@theme`) and are used as Tailwind classes (`bg-paper`, `text-ink`, `border-line`, `bg-rail`…). The explorer (Part A, `src/student/**`) uses `paper`, `ink`, `muted`, `line`, `accent` and `stage`, so those names never change. `docs/DESIGN.md` still covers sound and words.

## Overview

**Brand:** the TouchSight logo (an eye whose pupil gives way to braille dots and sound waves; "Touch" in white, "Sight" in blue) on three colours: navy `#21386C`, paper `#F8FAFC` and blue `#0579FB`. The navy rail gives the class a stable home and carries the logo; the pale paper keeps names and records easy to scan; the blue marks actions, the sequence of a student's attempts and keyboard focus. Apple's system font keeps controls familiar without bundling font files. The layout grammar comes from the "Marine Field Log" template: a rail, divided rows and a ringed trail.

The roster is an ordered index, not a feed. A teacher opens one student to see that student's summary, settings and attempts, then returns to the dashboard. There is no dashboard-wide activity feed.

- Navy rail against a pale, lightly divided working surface.
- Blue for actions, the attempt trail and keyboard focus.
- Names first; personal activity only on the student's own page.
- System typography, tabular figures, fixed-column records.

## Logo

- `public/logo.png` (608×111, transparent): the full logo, only on the navy rail (its "Touch" is white). 28 px in the phone top bar, 34 px on desktop, 44 px from 1536 px. "Teacher workspace" sits in the top bar, not under the logo.
- `public/logo-mark.png` (256×256, transparent): the eye alone. The favicon, and the 64 px mark in empty states on light surfaces.
- Both are crops of the supplied artwork; never redraw or recolour them.

## Colors

- **Blue** `accent` `#0579FB`: the logo's blue. Focus rings, the trail, selected parts in the editor, sparklines, icons and markers.
- **Blue, one step deeper** `accent-strong` `#0466D6`: primary button fills and blue text (white on `#0579FB` is only 4.1:1, under AA; this step is 5.4:1). Hover goes to `accent-deep`. `accent-soft` is the pale fill for selected rows, avatars and the fresh-row flash.
- **Navy** `ink` / `rail` `#21386C`: all text (10.9:1 on paper) and the rail. `muted` is a navy-tinted slate for supporting text (5.8:1).
- **Paper** `#F8FAFC` page, `surface` white controls and dialogs, `line` dividers, `field` input and secondary-button borders.
- **Rail:** `rail-active` current item, `rail-ink` / `rail-muted` text, `rail-mark` (a lighter blue that stays readable on navy) the current-item marker and rail focus.
- **Stage** `stage`: the explorer's deep navy background (the accent's "Found" timer on it stays above 3:1).
- **High contrast** (`data-contrast="high"` on `<html>`, remembered): every token switches to black on white with `#0000ee` actions and a black rail. The explorer inherits it.

**The One Accent Rule.** Blue is the only accent. Nothing relies on colour alone: the trail uses rings and a line, the current nav item a marker, fresh activity the words "Active just now".

## Typography

One family, the system UI stack: SF Pro on Apple devices, Segoe UI Variable on Windows. No web fonts (offline); `font-serif` maps to the same stack so the explorer's headings match.

- **Headline** 34 px / 650 / -0.035em: page titles (student names 30 px, editor title 28 px).
- **Title** 20 px / 650: section headings (Diagrams, Students, Activity, Find times by part).
- **Body** 16 px, 1.5 line height: names, explanations, instructions.
- **Meta** 14 px: status lines, counts, captions. Counts use tabular figures.
- **Rail label** 11 px bold uppercase, 0.12em tracking: "Teacher", "Workspace". Only in the rail.

## Layout

- **Built for 1920×1080** (the demo screen). From 1536 px the rail is 320 px with a 44 px logo, the page column widens to 1600 px, and the dashboard runs three columns: Diagrams (3 parts of the width), then the two classes side by side (5 parts). The demo laptop is 1920×1080 at 125% scaling, so Chrome's page is about 1536×730: the whole dashboard fits it without scrolling. Rows share the height left under the section headings (between 72 and 128 px, from the row count of the tallest column), so they fill the screen and a newly added student still fits.
- A 244 px sticky rail and a flexible column from 1024 px; below that the rail becomes a top bar (brand plus Dashboard and About) so the editor keeps its canvas beside the part fields on small laptops.
- A 64 px top bar titled "Teacher workspace" with today's date, and the High contrast toggle.
- Page content capped at 1160 px (1600 px from 1536 px) with gutters `clamp(20px, 4.5vw, 84px)` (the `page` utility).
- Dashboard: Diagrams and Students side by side from 1280 px, stacked below; no item counts. Every row (diagram, class heading, student) is one height (80 px, screen-fitted from 1536 px), and both section headings are the same height, so the dividers line up across the columns. Diagrams come first in the DOM, so the first Tab lands on "Explore Animal cell".
- Student page: profile heading, a three-column summary, explorer settings, the Activity trail, then find times by part.
- Spacing steps of 8, 16 and 24 px; more space above a heading than below it.

## Elevation & Depth

Flat at rest. Dividers and the paper/surface/rail tonal steps carry structure. Dialogs (Add a student, swell-paper export, the presenter panel) are the only lifted surfaces: 14 px radius, a soft tinted shadow and a dimmed, lightly blurred backdrop.

**The Quiet Surface Rule.** Roster, diagram and trail rows are unboxed rows with dividers, never cards.

## Shapes

Buttons, inputs, search and nav items 8 px; tags 6 px; dialogs 14 px; avatars and trail marks circular. Icons are one drawn set (16 px, 1.7 px round strokes, in `Shell.tsx`), never glyphs.

## Components

- **Buttons:** primary is `accent-strong` with white text (hover `accent-deep`), 42 px min height, 16 px padding, 15 px semibold; secondary is `surface` with a `field` border. Press scales to 0.98. Disabled is 50% opacity.
- **Rail:** the logo, the teacher and classes, Workspace nav (Dashboard, current on every screen but About, and About), and a footer: "Works fully offline and privately." Uploading starts only from the "Upload a diagram" row under the diagrams.
- **Diagram row:** thumbnail, title, grade · parts, then Explore (primary) and Edit (secondary). The last row uploads a diagram.
- **Student row:** avatar initials, name, "Active 5 minutes ago" / "No attempts yet", chevron (dropped from 1536 px so the status stays on one line); a Launch button sits beside it for the class assignment. Rows are grouped by class; each class opens with a heading row: its name and "Assigned: Canada · due Tue". A row active in the last five minutes flashes `accent-soft` once and its status turns `accent-strong`.
- **Search and Add student:** on the right of the Students heading, so the rule under it lines up with the one under Diagrams. Search filters names; Add student opens a dialog (name, class) and saves to this laptop.
- **Attempt trail:** a thin vertical line with a ring per attempt, newest first; each row shows the part, the diagram, when (relative within the hour, then "Today, 9:26 AM"), and seconds to find. About reuses it for the diagram-to-student pipeline.
- **Tags:** 6 px, `line` border, `surface` fill, `muted` text: explorer settings, "Draft" in the editor.
- **Sparklines:** 1.5 px `accent` line with a ringed latest point and the latest time labelled; a real series, one per part.

## Do's and Don'ts

- **Do** keep the ink rail and the pale surface as the main structural contrast.
- **Do** keep activity inside each student's page; the dashboard lists only students.
- **Do** keep focus visible, controls labelled and every screen keyboard-operable.
- **Don't** add a dashboard-wide activity feed, or turn rows into cards.
- **Don't** add another accent colour, a display font or a downloaded font, or put the full logo on a light surface.
- **Don't** label any data "sample", "mock", "seed" or similar on screen.
