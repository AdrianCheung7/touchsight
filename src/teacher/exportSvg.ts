// Part B. Swell-paper SVG (SPEC F5): US Letter in mm, 15 mm margins, 0.8 mm outlines, no fill, no raster.
// Braille title on top, a print caption below; labels that don't fit their part become key numbers,
// listed on a key page stacked under the diagram page.
import type { Figure, Point } from '../contract/types.ts'
import { CELL_HEIGHT, CELL_PITCH, LINE_PITCH, brailleWidth, cellsFor, drawCells, type Cell } from './braille.ts'
import { area, inside } from './shapes.ts'

const PAGE_W = 215.9
const PAGE_H = 279.4
const M = 15
const CONTENT_W = PAGE_W - 2 * M
const PAD = 1 // mm of blank paper around each braille label, so outlines don't run into the dots

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const f = (n: number) => n.toFixed(2)

// Words joined into lines while `fits` holds, breaking between words.
function wrap(text: string, fits: (line: string) => boolean): string[] {
  const lines: string[] = []
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const joined = `${lines[lines.length - 1]} ${w}`
    if (lines.length && fits(joined)) lines[lines.length - 1] = joined
    else lines.push(w)
  }
  return lines
}
const brailleFits = (width: number) => (line: string) => brailleWidth(cellsFor(line)) <= width

const label = (x: number, y: number, cells: Cell[]) =>
  `<rect x="${f(x - PAD)}" y="${f(y - PAD)}" width="${f(brailleWidth(cells) + 2 * PAD)}" height="${f(CELL_HEIGHT + 2 * PAD)}" fill="#fff"/>` + drawCells(x, y, cells)

export function exportSvg(fig: Figure): { svg: string; keys: { n: number; label: string }[] } {
  const out: string[] = []

  // Page 1: braille title, diagram, print caption.
  const title = wrap(fig.title, brailleFits(CONTENT_W)).map(cellsFor)
  title.forEach((cells, i) => out.push(drawCells(M, M + i * LINE_PITCH, cells)))
  const top = M + title.length * LINE_PITCH + 4
  const bottom = PAGE_H - M - 12
  // Fit the traced parts, not the whole picture (its printed labels aren't drawn anyway).
  const all = fig.regions.flatMap((r) => r.polygon)
  const [bx, by] = all.length ? [Math.min(...all.map((p) => p[0])), Math.min(...all.map((p) => p[1]))] : [0, 0]
  const bw = all.length ? Math.max(...all.map((p) => p[0])) - bx : fig.width
  const bh = all.length ? Math.max(...all.map((p) => p[1])) - by : fig.height
  const s = Math.min(CONTENT_W / bw, (bottom - top) / bh)
  const x0 = M + (CONTENT_W - bw * s) / 2
  const y0 = top
  const mm = ([x, y]: Point): Point => [x0 + (x - bx) * s, y0 + (y - by) * s]
  const px = (x: number, y: number): Point => [bx + (x - x0) / s, by + (y - y0) / s]

  const bySize = [...fig.regions].sort((a, b) => area(a.polygon) - area(b.polygon))
  const hit = (p: Point) => bySize.find((r) => inside(p, r.polygon))?.id

  for (const r of [...bySize].reverse()) {
    out.push(`<polygon points="${r.polygon.map((p) => mm(p).map(f).join(',')).join(' ')}" fill="none" stroke="#000" stroke-width="0.8" stroke-linejoin="round"/>`)
  }

  const keys: { n: number; label: string }[] = []
  const labels: string[] = []
  // Does a w×h mm label centred at (cx, cy) sit wholly on this part (not on a smaller one inside it)?
  const fitsAt = (id: string, cx: number, cy: number, w: number, h: number) => {
    for (let dx = -w / 2; dx <= w / 2 + 0.01; dx += Math.min(3, w / 2)) {
      for (const dy of [-h / 2, 0, h / 2]) if (hit(px(cx + dx, cy + dy)) !== id) return false
    }
    return true
  }

  for (const r of fig.regions) {
    const [ax, ay] = mm(r.labelAnchor)
    const cells = cellsFor(r.label)
    const w = brailleWidth(cells) + 2 * PAD
    const h = CELL_HEIGHT + 2 * PAD
    // The spot nearest the anchor where the whole label fits, else a key number at the anchor.
    let spot: Point | undefined
    const pts = r.polygon.map(mm)
    const [minX, maxX] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))]
    const [minY, maxY] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))]
    for (let x = minX + w / 2; x <= maxX - w / 2; x += 1.5) {
      for (let y = minY + h / 2; y <= maxY - h / 2; y += 1.5) {
        if ((!spot || Math.hypot(x - ax, y - ay) < Math.hypot(spot[0] - ax, spot[1] - ay)) && fitsAt(r.id, x, y, w, h)) spot = [x, y]
      }
    }
    // ponytail: key numbers aren't collision-checked against each other — move an anchor in the editor if two touch
    const text = spot ? cells : cellsFor(String(keys.length + 1))
    if (!spot) keys.push({ n: keys.length + 1, label: r.label })
    const [cx, cy] = spot ?? [ax, ay]
    const tw = brailleWidth(text)
    const x = Math.min(Math.max(cx - tw / 2, M), PAGE_W - M - tw)
    const y = Math.min(Math.max(cy - CELL_HEIGHT / 2, top), bottom - CELL_HEIGHT)
    labels.push(label(x, y, text))
  }
  out.push(...labels)

  const caption = `${fig.title}${fig.subject ? ` · ${fig.subject}` : ''}${fig.gradeBand ? ` · ${fig.gradeBand}` : ''}${keys.length ? ' · Key on page 2' : ''}`
  out.push(`<text x="${M}" y="${f(PAGE_H - M)}" font-size="4.2" font-family="Helvetica, Arial, sans-serif">${esc(caption)}</text>`)

  // Key page: "#1 Ribosomes" in braille, one per line, then a print list for a sighted helper.
  // ponytail: a single key page (~20 entries) — paginate if a figure ever needs more.
  const pages = keys.length ? 2 : 1
  if (keys.length) {
    let y = PAGE_H + M
    out.push(drawCells(M, y, cellsFor('Key')))
    y += LINE_PITCH * 1.5
    for (const k of keys) {
      const num = cellsFor(String(k.n))
      const indent = brailleWidth(num) + CELL_PITCH
      out.push(drawCells(M, y, num))
      for (const line of wrap(k.label, brailleFits(CONTENT_W - indent))) {
        out.push(drawCells(M + indent, y, cellsFor(line)))
        y += LINE_PITCH
      }
    }
    const print = wrap(`Key: ${keys.map((k) => `${k.n} ${k.label}`).join(' · ')}`, (line) => line.length <= 95)
    print.forEach((t, i) => out.push(`<text x="${M}" y="${f(2 * PAGE_H - M - (print.length - 1 - i) * 5)}" font-size="3.6" font-family="Helvetica, Arial, sans-serif">${esc(t)}</text>`))
  }

  const H = pages * PAGE_H
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_W}mm" height="${f(H)}mm" viewBox="0 0 ${PAGE_W} ${f(H)}">
<title>${esc(fig.title)}, swell paper</title>
<rect width="${PAGE_W}" height="${f(H)}" fill="#fff"/>
${out.join('\n')}
</svg>`
  return { svg, keys }
}
