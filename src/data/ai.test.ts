import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Figure, Region } from '../contract/types.ts'
import { askQuestion, classify, explainRegion } from './ai.ts'
import { answers } from './answers.ts'
import cellJson from './figures/animal-cell.json'
import canadaJson from './figures/canada.json'

const cell = cellJson as Figure
const canada = canadaJson as Figure
const region = (f: Figure, id: string) => f.regions.find((r) => r.id === id)!

// Resolve the 0.9–1.8 s "thinking" delay instantly.
async function run<T>(p: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync()
  return p
}

describe('ai', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('classifies questions by keyword', () => {
    expect(classify('What does it do?')).toBe('what')
    expect(classify('why is it there')).toBe('why')
    expect(classify('Where is it?')).toBe('where')
    expect(classify('how big is it')).toBe('size')
    expect(classify('capital?')).toBe('capital')
    expect(classify('what is the capital')).toBe('capital')
    expect(classify('tell me something cool')).toBe('fact')
  })

  it('answers "what does it do?" on the mitochondrion', async () => {
    expect(await run(askQuestion(cell, region(cell, 'mitochondrion'), 'what does it do?'))).toBe(answers.mitochondrion.what)
  })

  it('knows the capital of BC', async () => {
    expect(await run(askQuestion(canada, region(canada, 'british-columbia'), 'capital?'))).toMatch(/Victoria/)
  })

  it('has an answer for every traced part', () => {
    for (const f of [cell, canada]) for (const r of f.regions) expect(answers[r.label.toLowerCase()], r.label).toBeDefined()
    for (const r of canada.regions) expect(answers[r.label.toLowerCase()].capital, r.label).toBeTruthy()
  })

  it('never throws on unknown parts or a missing region', async () => {
    const odd: Region = { id: 'x', label: 'Flux capacitor', polygon: [[0, 0], [10, 0], [0, 10]], labelAnchor: [5, 5], explanation: '', origin: 'teacher' }
    expect(await run(askQuestion(cell, odd, 'what is it?'))).toMatch(/Flux capacitor/)
    expect(await run(askQuestion(cell, odd, 'where?'))).toBe('Flux capacitor is in the upper left of the picture.')
    expect(await run(explainRegion(cell, odd))).toMatch(/^That part is called Flux capacitor\./)
    expect(await run(explainRegion(cell, { ...odd, explanation: 'Makes time travel possible.' }))).toBe('Makes time travel possible.')
    expect(await run(askQuestion(cell, null, 'what is this?'))).toEqual(expect.any(String))
    expect(await run(askQuestion(cell, { label: 42 } as unknown as Region, 'what?'))).toEqual(expect.any(String))
  })

  it('takes 0.9–1.8 s to answer', async () => {
    let done = false
    const p = explainRegion(cell, region(cell, 'nucleus')).then(() => (done = true))
    await vi.advanceTimersByTimeAsync(850)
    expect(done).toBe(false)
    await vi.advanceTimersByTimeAsync(1000)
    expect(done).toBe(true)
    await p
  })
})
