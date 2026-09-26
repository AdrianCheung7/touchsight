import { describe, expect, it } from 'vitest'
import type { Region } from '../contract/types.ts'
import { elapsedMs, formatElapsed, pauseChallenge, pickTarget, resumeChallenge } from './findIt.ts'

const region = (id: string): Region => ({
  id,
  label: id,
  polygon: [],
  labelAnchor: [0, 0],
  explanation: '',
  origin: 'teacher',
})

describe('pickTarget', () => {
  const regions = [region('current'), region('mitochondrion'), region('nucleus')]

  it('uses a valid requested target first', () => {
    expect(pickTarget(regions, 'animal-cell', 'nucleus', 'current')).toBe(regions[2])
  })

  it('defaults to the mitochondrion on the animal cell', () => {
    expect(pickTarget(regions, 'animal-cell', undefined, 'current')).toBe(regions[1])
  })

  it('chooses another region for other figures', () => {
    expect(pickTarget(regions, 'canada', undefined, 'current', () => 0)).toBe(regions[1])
  })

  it('falls back to a valid region when the requested target is missing', () => {
    expect(pickTarget(regions, 'animal-cell', 'missing', 'current')).toBe(regions[1])
  })

  it('returns null when the figure has no regions', () => {
    expect(pickTarget([], 'animal-cell', undefined, null)).toBeNull()
  })
})

describe('challenge timing', () => {
  it.each([[0, '0:00'], [9_500, '0:09'], [60_000, '1:00'], [3_659_000, '60:59']] as const)(
    'formats %i milliseconds as %s',
    (ms, expected) => expect(formatElapsed(ms)).toBe(expected),
  )

  it('pauses and resumes without counting paused time', () => {
    const running = { targetRegionId: 'nucleus', status: 'active' as const, startedAt: 100, elapsedMs: 0 }
    const paused = pauseChallenge(running, 1_600)
    expect(elapsedMs(paused, 90_000)).toBe(1_500)

    const resumed = resumeChallenge(paused, 10_000)
    expect(elapsedMs(resumed, 10_750)).toBe(2_250)
  })

  it('keeps completed elapsed time fixed', () => {
    const found = pauseChallenge(
      { targetRegionId: 'nucleus', status: 'active' as const, startedAt: 500, elapsedMs: 0 },
      1_900,
      'found',
    )
    expect(found.status).toBe('found')
    expect(elapsedMs(found, 90_000)).toBe(1_400)
  })
})
