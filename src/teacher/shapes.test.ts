import { expect, it } from 'vitest'
import type { Point } from '../contract/types.ts'
import { anchorFor, area, hull, inside } from './shapes.ts'

const square: Point[] = [[0, 0], [10, 0], [10, 10], [0, 10]]

it('computes area and point-in-polygon', () => {
  expect(area(square)).toBe(100)
  expect(inside([5, 5], square)).toBe(true)
  expect(inside([15, 5], square)).toBe(false)
})

it('merges two shapes into their convex hull', () => {
  const other: Point[] = [[20, 0], [30, 0], [30, 10], [20, 10], [25, 5]]
  const h = hull([...square, ...other, [5, 5]])
  expect(h).toHaveLength(4)
  expect(area(h)).toBe(300)
})

it('anchors concave shapes inside themselves', () => {
  // A "C": its centroid falls in the gap.
  const c: Point[] = [[0, 0], [30, 0], [30, 10], [10, 10], [10, 20], [30, 20], [30, 30], [0, 30]]
  expect(inside(anchorFor(c), c)).toBe(true)
  expect(anchorFor(square)).toEqual([5, 6])
})
