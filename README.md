# TouchSight

Blind students explore any textbook diagram by sound, on the laptop they already have. Moving on the trackpad pans a tone left and right and raises its pitch toward the top; each part changes the timbre and speaks its name. Teachers trace and explain diagrams, assign them to classes, see progress, and export swell-paper braille graphics. Runs fully offline, for $0.

## Run

```bash
npm install
npm run dev
```

Demo build: `npm run build && npm run preview`, then open http://localhost:4173.

## Docs

| File | What |
|---|---|
| `CLAUDE.md` | Rules for every build session |
| `docs/CONTRACT.md` | How the two parts fit together: ownership, types, routes, APIs, checkpoints |
| `docs/PLAN-A-student.md` | Part A: the student explorer and sound |
| `docs/PLAN-B-teacher.md` | Part B: the teacher workspace, data and app shell |
| `docs/SPEC.md` | Features and acceptance criteria |
| `docs/DESIGN.md` | Visual tokens, sound design, copy |
| `docs/DEMO.md` | Pitch, fallbacks, Devpost draft, video shot list, sources |

## Credits

- Animal cell diagram: OpenStax Anatomy & Physiology (CC BY 4.0).
- Map of Canada: Wikimedia Commons (public domain).
