import type { Point, Region } from '../contract/types.ts'
import { wallSide, type WallSide } from './audio.ts'
import { animalCellCallouts } from './figureAnnotations.ts'

export function pointInPolygon(p: Point, polygon: Point[]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x1, y1] = polygon[j]
    const [x2, y2] = polygon[i]
    const cross = (p[0] - x1) * (y2 - y1) - (p[1] - y1) * (x2 - x1)
    const tolerance = Number.EPSILON * Math.max(1, Math.abs(x2 - x1), Math.abs(y2 - y1)) * 8
    if (
      Math.abs(cross) <= tolerance &&
      p[0] >= Math.min(x1, x2) && p[0] <= Math.max(x1, x2) &&
      p[1] >= Math.min(y1, y2) && p[1] <= Math.max(y1, y2)
    ) return true

    if ((y1 > p[1]) !== (y2 > p[1]) && p[0] < ((x2 - x1) * (p[1] - y1)) / (y2 - y1) + x1) {
      inside = !inside
    }
  }
  return inside
}

export function area(polygon: Point[]) {
  let twiceArea = 0
  for (let i = 0; i < polygon.length; i++) {
    const [x1, y1] = polygon[i]
    const [x2, y2] = polygon[(i + 1) % polygon.length]
    twiceArea += x1 * y2 - x2 * y1
  }
  return Math.abs(twiceArea) / 2
}

export function centroid(polygon: Point[]): Point {
  let twiceArea = 0
  let x = 0
  let y = 0
  for (let i = 0; i < polygon.length; i++) {
    const [x1, y1] = polygon[i]
    const [x2, y2] = polygon[(i + 1) % polygon.length]
    const cross = x1 * y2 - x2 * y1
    twiceArea += cross
    x += (x1 + x2) * cross
    y += (y1 + y2) * cross
  }
  if (Math.abs(twiceArea) > Number.EPSILON) return [x / (3 * twiceArea), y / (3 * twiceArea)]
  return polygon.length
    ? polygon.reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]] as Point, [0, 0] as Point).map((value) => value / polygon.length) as Point
    : [0, 0]
}

// ponytail: these image-pixel buffers are tuned for Animal cell; calibrate before using on other figures.
const hitExitBuffer = 4

function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSquared)) : 0
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}

function distanceToPolygon(p: Point, polygon: Point[]) {
  if (pointInPolygon(p, polygon)) return 0
  let distance = Infinity
  for (let i = 0; i < polygon.length; i++) {
    distance = Math.min(distance, distanceToSegment(p, polygon[i], polygon[(i + 1) % polygon.length]))
  }
  return distance
}

export function hitTest(regions: Region[], p: Point, previous?: Region | null, figureId?: string): Region | null {
  let hit: Region | null = null
  let smallestArea = Infinity
  for (const region of regions) {
    const extraAreas = figureId === 'animal-cell' ? animalCellCallouts[region.id]?.extraAreas ?? [] : []
    for (const polygon of [region.polygon, ...extraAreas]) {
      if (!pointInPolygon(p, polygon)) continue
      const regionArea = area(polygon)
      if (regionArea < smallestArea) {
        hit = region
        smallestArea = regionArea
      }
    }
  }

  if (figureId !== 'animal-cell') return hit

  const distanceToRegion = (region: Region) => {
    const extraAreas = animalCellCallouts[region.id]?.extraAreas ?? []
    return Math.min(...[region.polygon, ...extraAreas].map((polygon) => distanceToPolygon(p, polygon)))
  }

  const previousSlop = previous ? animalCellCallouts[previous.id]?.hitSlop ?? 0 : 0
  if (previous && previousSlop && distanceToRegion(previous) <= previousSlop + hitExitBuffer) return previous

  let nearestBuffered: Region | null = null
  let nearestDistance = Infinity
  for (const region of regions) {
    const slop = animalCellCallouts[region.id]?.hitSlop
    if (!slop) continue
    const distance = distanceToRegion(region)
    if (distance <= slop && distance < nearestDistance) {
      nearestBuffered = region
      nearestDistance = distance
    }
  }
  if (nearestBuffered) return nearestBuffered
  return hit
}

export function whereAmI(p: Point, w: number, h: number) {
  const column = p[0] < w / 3 ? 'left' : p[0] < (2 * w) / 3 ? 'centre' : 'right'
  const row = p[1] < h / 3 ? 'Upper' : p[1] < (2 * h) / 3 ? 'Middle' : 'Lower'
  return row === 'Middle' && column === 'centre'
    ? 'Centre'
    : `${row} ${column}`
}

export function readingOrder(regions: Region[], h?: number) {
  const height = Math.max(6, h ?? 0, ...regions.map(({ labelAnchor: [, y] }) => y))
  const rowHeight = height / 6
  return [...regions].sort((a, b) => {
    const row = Math.floor(a.labelAnchor[1] / rowHeight) - Math.floor(b.labelAnchor[1] / rowHeight)
    return row || a.labelAnchor[0] - b.labelAnchor[0]
  })
}

export function adjacentRegion(regions: Region[], currentId: string | null, direction: -1 | 1, h?: number): Region | null {
  const ordered = readingOrder(regions, h)
  if (!ordered.length) return null
  const index = ordered.findIndex(({ id }) => id === currentId)
  if (index < 0) return ordered[direction > 0 ? 0 : ordered.length - 1]
  return ordered[(index + direction + ordered.length) % ordered.length]
}

export function clamp(p: Point, w: number, h: number, previous?: Point): { p: Point; hitWall: WallSide | null } {
  let hitWall = wallSide({ x: p[0], y: p[1] }, w, h)
  if (!hitWall && previous && w > 0 && h > 0) {
    const x: WallSide | null = p[0] <= 0 && p[0] < previous[0] ? 'left' : p[0] >= w && p[0] > previous[0] ? 'right' : null
    const y: WallSide | null = p[1] <= 0 && p[1] < previous[1] ? 'top' : p[1] >= h && p[1] > previous[1] ? 'bottom' : null
    hitWall = x && y
      ? Math.abs(p[0] - previous[0]) / w >= Math.abs(p[1] - previous[1]) / h ? x : y
      : x ?? y
  }
  return {
    p: [Math.max(0, Math.min(w, p[0])), Math.max(0, Math.min(h, p[1]))],
    hitWall,
  }
}
