---
name: TouchSight
description: A calm teacher workspace for preparing diagrams and following each student's find-it progress.
colors:
  paper: "#f4f8f9"
  surface: "#ffffff"
  ink: "#102b38"
  muted: "#526b76"
  line: "#dfe8eb"
  field: "#cddce0"
  accent: "#08788a"
  accent-strong: "#075d6c"
  accent-soft: "#e6f5f6"
  focus: "#1f97a6"
  rail: "#0c2a36"
  rail-active: "#173d4b"
  rail-ink: "#f3f8f9"
  rail-muted: "#a5bbc1"
  rail-mark: "#76d7df"
  stage: "#081c24"
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

**Creative North Star: "The Marine Field Log."** The teacher workspace borrows the quiet order of a marine research dive log: an ink-blue rail gives the class a stable home, a pale working surface keeps names and records easy to scan, one restrained teal family marks actions and the sequence of a student's attempts, and focus is always a visible cyan. Apple's system font keeps controls familiar without bundling font files.

The roster is an ordered index, not a feed. A teacher opens one student to see that student's summary, settings and attempts, then returns to the dashboard. There is no dashboard-wide activity feed.

- Ink-blue rail against a pale, lightly divided working surface.
- Teal for actions and the attempt trail; cyan for keyboard focus.
- Names first; personal activity only on the student's own page.
- System typography, tabular figures, fixed-column records.

## Colors

- **Accent (Marine Teal)** `accent`: primary buttons, the trail, selected parts in the editor. Hover deepens to `accent-strong`; `accent-soft` is the pale fill for selected rows, avatars and the fresh-row flash.
- **Focus** `focus`: every keyboard focus ring on light surfaces (3 px, 3 px offset). It is a deeper cyan than the template's `#56bbc7` so the ring clears 3:1 against the page. On the rail, focus uses `rail-mark`.
- **Neutrals:** `ink` text, `muted` supporting text (5.3:1 on paper), `paper` page, `surface` controls and dialogs, `line` dividers, `field` input and secondary-button borders.
- **Rail:** `rail` background, `rail-active` current item, `rail-ink` / `rail-muted` text, `rail-mark` the brand dots and current-item marker.
- **Stage** `stage`: the explorer's dark background (the accent's "Found" timer on it stays above 3:1).
- **High contrast** (`data-contrast="high"` on `<html>`, remembered): every token switches to black on white with `#0000ee` actions and a black rail. The explorer inherits it.

**The One Focus Color Rule.** Focus is always the cyan ring; teal is for actions and progression. Nothing relies on colour alone: the trail uses rings and a line, the current nav item a marker, fresh activity the words "Active just now".

## Typography

One family, the system UI stack: SF Pro on Apple devices, Segoe UI Variable on Windows. No web fonts (offline); `font-serif` maps to the same stack so the explorer's headings match.

- **Headline** 34 px / 650 / -0.035em: page titles (student names 30 px, editor title 28 px).
- **Title** 20 px / 650: section headings (Diagrams, Students, Activity, Find times by part).
- **Body** 16 px, 1.5 line height: names, explanations, instructions.
- **Meta** 14 px: status lines, counts, captions. Counts use tabular figures.
- **Rail label** 11 px bold uppercase, 0.12em tracking: "Teacher", "Workspace". Only in the rail.

## Layout

- A 244 px sticky rail and a flexible column from 1024 px; below that the rail becomes a top bar (brand plus Dashboard, Upload, About) so the editor keeps its canvas beside the part fields on small laptops.
- A 64 px top bar with today's date and the High contrast toggle.
- Page content capped at 1160 px with gutters `clamp(20px, 4.5vw, 84px)` (the `page` utility).
- Dashboard: Diagrams and Students side by side from 1280 px, stacked below. Diagrams come first in the DOM, so the first Tab lands on "Explore Animal cell".
- Student page: profile heading, a three-column summary, explorer settings, the Activity trail, then find times by part.
- Spacing steps of 8, 16 and 24 px; more space above a heading than below it.

## Elevation & Depth

Flat at rest. Dividers and the paper/surface/rail tonal steps carry structure. Dialogs (Add a student, swell-paper export, the presenter panel) are the only lifted surfaces: 14 px radius, a soft tinted shadow and a dimmed, lightly blurred backdrop.

**The Quiet Surface Rule.** Roster, diagram and trail rows are unboxed rows with dividers, never cards.

## Shapes

Buttons, inputs, search and nav items 8 px; tags 6 px; dialogs 14 px; avatars and trail marks circular. Icons are one drawn set (16 px, 1.7 px round strokes, in `Shell.tsx`), never glyphs.

## Components

- **Buttons:** primary is `accent` with white text, 42 px min height, 16 px padding, 15 px semibold; secondary is `surface` with a `field` border. Press scales to 0.98. Disabled is 50% opacity.
- **Rail:** brand mark (four braille-like dots in a tilted frame) and wordmark, the teacher and classes, Workspace nav (Dashboard is current on the dashboard, student and editor pages), and a footer: "Works offline. Everything stays on this laptop."
- **Diagram row:** thumbnail, title, subject · grade · parts, then Explore (primary) and Edit (secondary). The last row uploads a diagram.
- **Student row:** avatar initials, name, "Active 5 minutes ago" / "No attempts yet", chevron; a Launch button sits beside it for the class assignment. Visitors (Guest) come first, then each class with its assignment tag ("Canada · due Tue"). A row active in the last five minutes flashes `accent-soft` once and its status turns `accent-strong`.
- **Search and Add student:** search filters names and updates the count; Add student opens a dialog (name, class) and saves to this laptop.
- **Attempt trail:** a thin vertical line with a ring per attempt, newest first; each row shows the part, the diagram, when (relative within the hour, then "Today, 9:26 AM"), and seconds to find. About reuses it for the diagram-to-student pipeline.
- **Tags:** 6 px, `line` border, `surface` fill, `muted` text: assignment, explorer settings, "Draft" in the editor.
- **Sparklines:** 1.5 px `accent` line with a ringed latest point and the latest time labelled; a real series, one per part.

## Do's and Don'ts

- **Do** keep the ink rail and the pale surface as the main structural contrast.
- **Do** keep activity inside each student's page, and Guest reachable from the dashboard.
- **Do** keep focus visible, controls labelled and every screen keyboard-operable.
- **Don't** add a dashboard-wide activity feed, or turn rows into cards.
- **Don't** add another accent colour, a display font or a downloaded font.
- **Don't** label any data "sample", "mock", "seed" or similar on screen.
