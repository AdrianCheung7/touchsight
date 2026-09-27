# Keyboard-mode pointer hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore label selection and spoken announcements when the pointer moves over a diagram in keyboard fallback mode.

**Architecture:** Preserve pointer-lock relative movement for exploring mode. In keyboard mode, translate pointer coordinates through the same centered `object-contain` diagram fit, ignore letterbox space, then call the shared existing `updateAt` path for hit testing, highlighting, edge audio, and announcements.

**Tech Stack:** TypeScript, existing geometry helpers, Vitest, browser control.

**Spec:** User-approved behavior: normal pointer hover selects and announces regions while in keyboard mode; pointer movement in the image letterbox is ignored.

## Global Constraints

- Reuse the existing geometry hit test, region update, announcement, and thunk path.
- Keep pointer-lock movement behavior unchanged.
- Ignore pointer coordinates outside the image's contained bounds.
- Do not select or announce regions while the explorer is in another phase.

## Review Focus

- Wide and tall figure letterbox margins must not shift hit testing (Task 1).
- Pointer movement over a region in keyboard mode must update the same selected region and announcement as keyboard selection (Task 2).
- Pointer-lock delta movement must remain unchanged (Task 2).

---

### Task 1: Diagram coordinate mapping

**Files:**
- Modify: `src/student/geometry.ts`.
- Modify: `src/student/geometry.test.ts`.

**Interfaces:**
- Produce `pointerToFigurePoint(client: Point, bounds: { left: number; top: number; width: number; height: number }, figure: Pick<Figure, 'width' | 'height'>): Point | null`; return image-pixel coordinates for contained content, or null for letterbox/outside bounds.

- [ ] **Step 1: Write failing tests** for centered landscape and portrait aspect-fit coordinates, letterbox rejection, and outside-element rejection.
- [ ] **Step 2: Run** `npm test -- src/student/geometry.test.ts`; confirm the mapping tests fail.
- [ ] **Step 3: Implement** the smallest centered-fit transform consistent with the SVG's `xMidYMid meet` behavior.
- [ ] **Step 4: Run** `npm test -- src/student/geometry.test.ts`; confirm the mapping tests pass.
- [ ] **Step 5: Commit** as `fix: map pointer to contained diagram`.

### Task 2: Wire keyboard-mode hover

**Files:**
- Modify: `src/student/useExplorer.ts`.

**Interfaces:**
- Consume Task 1's `pointerToFigurePoint` helper and the existing `updateAt` function.

- [ ] **Step 1: Reproduce and record** that pointer movement over a label in keyboard mode currently leaves the prior keyboard-selected region in place.
- [ ] **Step 2: Update** `onPointerMove` to retain the pointer-lock delta path and, only in keyboard mode, map absolute pointer position to figure coordinates; ignore null/out-of-image results and pass valid points through `updateAt`.
- [ ] **Step 3: Run** `npm test -- src/student/geometry.test.ts`, `npm run build`, and `npm run lint`.
- [ ] **Step 4: Browser-check** keyboard fallback hover across a region and letterbox margins; verify the existing highlight and label announcement change together, and pointer-lock movement still works where available.
- [ ] **Step 5: Commit and push** as `fix: announce regions on pointer hover`.

## Self-review

- The plan covers the approved hover design and the reproduced regression without altering selection outside keyboard mode.
- Each task defines the helper interface before its consumer; coordinate edge cases are tested before event wiring.
- Browser verification covers integrated announcement/highlight behavior and unchanged pointer-lock control.
