# TouchSight

Explore any textbook diagram by touch and sound. Runs fully in the browser, offline, with no paid APIs.

Status: repo initialised with tooling, models and Claude skills. No product code yet; `src/` is still the Vite starter.

## Setup
```bash
npm install
npm run models   # downloads ~540 MB of model files into public/models (gitignored)
npm run dev
```

## What's here
| Path | Contents |
|---|---|
| `CLAUDE.md` | Rules, stack, accessibility decisions, risks |
| `docs/brief.md` | The idea, the two user flows, the build order and the demo script |
| `docs/research-*.md` | The ranking and tech-stack research this project came from |
| `.claude/skills/` | 18 vendored Claude skills (pinned in `skills-lock.json`) |
| `.claude/settings.json` | Claude Code plugins to enable: playwright, context7, typescript-lsp, code-simplifier, claude-md-management |
| `scripts/fetch-models.mjs` | Downloads Florence-2-base-ft, SlimSAM and Tesseract English data |

## Models (all free, open licences)
- Florence-2-base-ft (MIT). The q4f16 files are for WebGPU and the q8 files are the WASM fallback.
- SlimSAM-77-uniform (Apache-2.0).
- Tesseract `eng` traineddata (Apache-2.0).
