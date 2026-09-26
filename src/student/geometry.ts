import type { Point, Region } from '../contract/types.ts'
import { wallSide, type WallSide } from './audio.ts'

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

const thinRegionIds = new Set(['microtubule', 'microfilament', 'intermediate-filament'])
// ponytail: these image-pixel buffers are tuned for Animal cell; calibrate before using on other figures.
const thinRegionHitSlop = 12
const thinRegionExitSlop = 16

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
    if (!pointInPolygon(p, region.polygon)) continue
    const regionArea = area(region.polygon)
    if (regionArea < smallestArea) {
      hit = region
      smallestArea = regionArea
    }
  }

  if (figureId !== 'animal-cell') return hit

  if (previous && thinRegionIds.has(previous.id) && distanceToPolygon(p, previous.polygon) <= thinRegionExitSlop) return previous

  let nearestThin: Region | null = null
  let nearestDistance = thinRegionHitSlop
  for (const region of regions) {
    if (!thinRegionIds.has(region.id)) continue
    const distance = distanceToPolygon(p, region.polygon)
    if (distance < nearestDistance) {
      nearestThin = region
      nearestDistance = distance
    }
  }
  if (nearestThin) return nearestThin
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
