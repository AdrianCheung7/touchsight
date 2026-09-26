// Part B. STUB from checkpoint C0. Step B2 adds the answer table; B9 adds Ollama.
// Contract (docs/CONTRACT.md §5): never rejects.
import type { Figure, Region } from '../contract/types.ts'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function askQuestion(_figure: Figure, region: Region | null, _question: string): Promise<string> {
  await wait(800)
  return region?.explanation || "I'm not sure. Try asking your teacher."
}

export async function explainRegion(_figure: Figure, region: Region): Promise<string> {
  await wait(800)
  return region.explanation || `That part is called ${region.label}.`
}
