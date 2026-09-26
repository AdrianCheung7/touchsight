import { describe, expect, it } from 'vitest'
import type { Point, Region } from '../contract/types.ts'
import { area, clamp, hitTest, pointInPolygon, readingOrder, whereAmI } from './geometry.ts'

const region = (id: string, polygon: Point[], labelAnchor: Point = [0, 0]): Region => ({
  id,
  label: id,
  polygon,
  labelAnchor,
  explanation: '',
  origin: 'teacher',
})

describe('pointInPolygon', () => {
  const concave: Point[] = [[0, 0], [4, 0], [4, 1], [1, 1], [1, 4], [0, 4]]

  it('finds points inside a concave polygon and excludes the missing corner', () => {
    expect(pointInPolygon([0.5, 3], concave)).toBe(true)
    expect(pointInPolygon([3, 3], concave)).toBe(false)
  })

  it('counts a point on the polygon edge as inside', () => {
    expect(pointInPolygon([1, 2], concave)).toBe(true)
  })
})

describe('area', () => {
  it('returns the same positive area for either polygon winding', () => {
    expect(area([[0, 0], [4, 0], [4, 3], [0, 3]])).toBe(12)
    expect(area([[0, 3], [4, 3], [4, 0], [0, 0]])).toBe(12)
  })
})

describe('hitTest', () => {
  const nucleus = region('nucleus', [[0, 0], [100, 0], [100, 100], [0, 100]])
  const nucleolus = region('nucleolus', [[40, 40], [60, 40], [60, 60], [40, 60]])

  it('returns the smallest region when polygons are nested', () => {
    expect(hitTest([nucleus, nucleolus], [50, 50])).toBe(nucleolus)
  })

  it('returns null on the background', () => {
    expect(hitTest([nucleus, nucleolus], [150, 150])).toBeNull()
  })
})

describe('whereAmI', () => {
  it.each([
    [[1, 1], 'Upper left'],
    [[5, 1], 'Upper centre'],
    [[8, 1], 'Upper right'],
    [[1, 5], 'Middle left'],
    [[5, 5], 'Centre'],
    [[8, 5], 'Middle right'],
    [[1, 8], 'Lower left'],
    [[5, 8], 'Lower centre'],
    [[8, 8], 'Lower right'],
  ] as const)('describes the third containing %o', (point, expected) => {
    expect(whereAmI([point[0], point[1]], 9, 9)).toBe(expected)
  })
})

describe('readingOrder', () => {
  it('sorts by six-height rows, then by horizontal position', () => {
    const regions = [
      region('right-in-row', [], [220, 170]),
      region('first-row', [], [120, 40]),
      region('left-in-row', [], [80, 150]),
      region('last-row', [], [50, 480]),
    ]

    expect(readingOrder(regions, 600).map(({ id }) => id)).toEqual([
      'first-row',
      'left-in-row',
      'right-in-row',
      'last-row',
    ])
  })
})

describe('clamp', () => {
  it('returns the clamped point and the wall hit', () => {
    expect(clamp([-5, 405], 400, 400)).toEqual({ p: [0, 400], hitWall: 'left' })
  })

  it('leaves an in-bounds point alone', () => {
    expect(clamp([100, 200], 400, 400)).toEqual({ p: [100, 200], hitWall: null })
  })
})
