import { describe, expect, it } from 'vitest'
import type { Figure } from '../contract/types.ts'
import cellJson from '../data/figures/animal-cell.json'
import canadaJson from '../data/figures/canada.json'
import { cellsFor, drawCells, toUnicode } from './braille.ts'
import { exportSvg } from './exportSvg.ts'

describe('braille', () => {
  it('encodes Grade 1 UEB', () => {
    expect(toUnicode(cellsFor('Cell'))).toBe('⠠⠉⠑⠇⠇')
    expect(toUnicode(cellsFor('12'))).toBe('⠼⠁⠃')
    expect(toUnicode(cellsFor('abc xyz'))).toBe('⠁⠃⠉⠀⠭⠽⠵')
    expect(toUnicode(cellsFor('PEI'))).toBe('⠠⠠⠏⠑⠊') // capitalised word
    expect(toUnicode(cellsFor('10b'))).toBe('⠼⠁⠚⠰⠃') // grade-1 indicator after digits
  })

  it('draws dots at standard size and spacing (mm)', () => {
    const svg = drawCells(10, 20, cellsFor('l')) // dots 1, 2, 3
    expect(svg).toBe('<circle cx="10.75" cy="20.75" r="0.75"/><circle cx="10.75" cy="23.25" r="0.75"/><circle cx="10.75" cy="25.75" r="0.75"/>')
    const two = drawCells(0, 0, cellsFor('ad')) // a = 1; d = 1 4 5 in the next cell
    expect(two).toContain('cx="0.75"')
    expect(two).toContain('cx="6.75"') // cell pitch 6.0
    expect(two).toContain('cx="9.25"') // dot pitch 2.5
  })
})

describe('swell-paper export', () => {
  const { svg, keys } = exportSvg(cellJson as Figure)

  it('is US Letter in mm with no raster and unfilled 0.8 mm outlines', () => {
    expect(svg).toMatch(/^<svg [^>]*width="215.9mm"/)
    expect(svg).not.toMatch(/<image|data:image/)
    const outlines = svg.match(/<polygon [^>]+>/g)!
    expect(outlines).toHaveLength(19)
    for (const p of outlines) expect(p).toContain('fill="none" stroke="#000" stroke-width="0.8"')
  })

  it('keeps braille labels at least 4 mm apart (closer, two labels read as one word by finger)', () => {
    for (const fig of [cellJson, canadaJson] as Figure[]) {
      const boxes = [...exportSvg(fig).svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="#fff"\/>/g)].map((m) => m.slice(1).map(Number))
      expect(boxes.length).toBe(fig.regions.length)
      for (const [i, a] of boxes.entries()) {
        for (const b of boxes.slice(i + 1)) {
          const overlap = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]) > -3.99 && Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]) > -3.99
          expect(overlap, `${fig.id}: ${a} vs ${b}`).toBe(false)
        }
      }
    }
  })

  it('uses key numbers for parts too small for their label, listed on a key page', () => {
    expect(keys.map((k) => k.label)).toContain('Ribosomes')
    expect(svg).toContain('height="558.80mm"') // two pages
    expect(svg).toContain('Key: 1 Plasma membrane')
    // On the map, big Nunavut takes its name in braille; tiny PEI gets a number.
    const canada = exportSvg(canadaJson as Figure).keys.map((k) => k.label)
    expect(canada).not.toContain('Nunavut')
    expect(canada).toContain('Prince Edward Island')
  })
})
