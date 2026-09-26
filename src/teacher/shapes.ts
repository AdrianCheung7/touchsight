// Part B. Polygon helpers for the editor (image pixels).
import type { Point } from '../contract/types.ts'

export function area(poly: Point[]): number {
  let a = 0
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length]
    a += x1 * y2 - x2 * y1
  })
  return Math.abs(a / 2)
}

export function inside([x, y]: Point, poly: Point[]): boolean {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

// Monotone-chain convex hull, counter-clockwise.
export function hull(points: Point[]): Point[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (p.length < 3) return p
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (pts: Point[]) => {
    const h: Point[] = []
    for (const q of pts) {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop()
      h.push(q)
    }
    return h.slice(0, -1)
  }
  return [...half(p), ...half([...p].reverse())]
}

// A point inside the polygon for Tab and braille: the centroid, or for concave shapes
// the middle of the widest inside span on the centroid's row.
export function anchorFor(poly: Point[]): Point {
  const n = poly.length
  const cx = poly.reduce((s, p) => s + p[0], 0) / n
  const cy = poly.reduce((s, p) => s + p[1], 0) / n + 0.5
  if (inside([cx, cy], poly)) return [Math.round(cx), Math.round(cy)]
  const xs: number[] = []
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % n]
    if (y1 > cy !== y2 > cy) xs.push(x1 + ((cy - y1) * (x2 - x1)) / (y2 - y1))
  })
  xs.sort((a, b) => a - b)
  let best: Point = poly[0]
  let width = -1
  for (let i = 0; i + 1 < xs.length; i += 2) {
    if (xs[i + 1] - xs[i] > width) {
      width = xs[i + 1] - xs[i]
      best = [Math.round((xs[i] + xs[i + 1]) / 2), Math.round(cy)]
    }
  }
  return best
}
