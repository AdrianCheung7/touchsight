// Part B. Explanations and questions (docs/CONTRACT.md §5): answered from TouchSight's answer table.
// Contract: never rejects — the explorer and editor can always await these safely.
import type { Figure, Region } from '../contract/types.ts'
import { answers, type Answer } from './answers.ts'

type Intent = 'capital' | 'why' | 'where' | 'size' | 'what' | 'fact'

// First match wins: "why does it…" is a why, "where is the capital" is a capital.
const INTENTS: [Intent, RegExp][] = [
  ['capital', /\bcapital\b/],
  ['why', /\bwhy\b/],
  ['where', /\bwhere\b/],
  ['size', /\b(big|bigger|biggest|small|smaller|smallest|size|large|huge|tiny|long|wide)\b/],
  ['what', /\b(what|do|does)\b/],
]

export function classify(question: string): Intent {
  const q = question.toLowerCase()
  return INTENTS.find(([, re]) => re.test(q))?.[0] ?? 'fact'
}

// Thirds, as in DESIGN.md: "upper left", "centre", "lower right".
function position(figure: Figure, region: Region): string {
  const [x, y] = region.labelAnchor
  const v = ['upper', 'middle', 'lower'][Math.min(2, Math.floor((3 * y) / figure.height))]
  const h = ['left', 'centre', 'right'][Math.min(2, Math.floor((3 * x) / figure.width))]
  return v === 'middle' && h === 'centre' ? 'centre' : `${v} ${h}`
}

const lookup = (region: Region): Answer | undefined => answers[region.label.trim().toLowerCase()]

// Parts the table doesn't know (uploads): the teacher's own words, else the name and where it is.
function fallback(figure: Figure, region: Region, intent: Intent): string {
  if (intent === 'where') return `${region.label} is in the ${position(figure, region)} of the picture.`
  return region.explanation.trim() || `That part is called ${region.label}. It is in the ${position(figure, region)} of the picture.`
}

const wait = () => new Promise((r) => setTimeout(r, 900 + Math.random() * 900))
const UNSURE = "I'm not sure. Try asking your teacher."

export async function askQuestion(figure: Figure, region: Region | null, question: string): Promise<string> {
  try {
    await wait()
    if (!region) return `You're not on a part right now. Move until you hear a name, then ask again.`
    const intent = classify(question)
    const a = lookup(region)
    return (a && (a[intent] ?? a.fact)) || fallback(figure, region, intent)
  } catch {
    return region?.explanation || UNSURE
  }
}

export async function explainRegion(figure: Figure, region: Region): Promise<string> {
  try {
    await wait()
    return lookup(region)?.explain || fallback(figure, region, 'what')
  } catch {
    return region.explanation || UNSURE
  }
}
