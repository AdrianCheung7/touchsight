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

export function hitTest(regions: Region[], p: Point): Region | null {
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

export function clamp(p: Point, w: number, h: number): { p: Point; hitWall: WallSide | null } {
  const hitWall = wallSide({ x: p[0], y: p[1] }, w, h)
  return {
    p: [Math.max(0, Math.min(w, p[0])), Math.max(0, Math.min(h, p[1]))],
    hitWall,
  }
}
