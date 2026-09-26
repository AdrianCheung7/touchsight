import { describe, expect, it } from 'vitest'
import { freqFor, panFor, wallSide } from './audio.ts'

describe('panFor', () => {
  it('maps the left edge, centre, and right edge to stereo pan', () => {
    expect(panFor(0, 400)).toBe(-1)
    expect(panFor(200, 400)).toBe(0)
    expect(panFor(400, 400)).toBe(1)
  })
})

describe('freqFor', () => {
  it('maps the top, middle, and bottom to the sound design frequencies', () => {
    expect(freqFor(0, 400)).toBe(880)
    expect(freqFor(200, 400)).toBe(440)
    expect(freqFor(400, 400)).toBe(220)
  })
})

describe('wallSide', () => {
  it.each([
    [{ x: -20, y: 200 }, 'left'],
    [{ x: 420, y: 200 }, 'right'],
    [{ x: 200, y: -20 }, 'top'],
    [{ x: 200, y: 420 }, 'bottom'],
    [{ x: -20, y: -5 }, 'left'],
    [{ x: 405, y: -20 }, 'top'],
  ] as const)('finds the wall hit at %o', (point, expected) => {
    expect(wallSide(point, 400, 400)).toBe(expected)
  })

  it('returns null while the point is inside the diagram', () => {
    expect(wallSide({ x: 200, y: 200 }, 400, 400)).toBeNull()
  })
})
