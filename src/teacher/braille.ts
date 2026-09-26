// Part B. Uncontracted (Grade 1) UEB braille, drawn as SVG circles in millimetres.
export type Cell = number[] // raised dots, 1–6

const LETTERS = 'a:1 b:12 c:14 d:145 e:15 f:124 g:1245 h:125 i:24 j:245 k:13 l:123 m:134 n:1345 o:135 p:1234 q:12345 r:1235 s:234 t:2345 u:136 v:1236 w:2456 x:1346 y:13456 z:1356'
const DOTS: Record<string, Cell> = Object.fromEntries(LETTERS.split(' ').map((p) => [p[0], [...p.slice(2)].map(Number)]))
Object.assign(DOTS, { '.': [2, 5, 6], ',': [2], '-': [3, 6], "'": [3], '’': [3] })
const CAPITAL: Cell = [6]
const NUMBER: Cell = [3, 4, 5, 6]
const GRADE1: Cell = [5, 6] // after digits, a letter a–j would read as a digit
const DIGITS = 'jabcdefghi' // 0–9 use the dots of a–j

export function cellsFor(text: string): Cell[] {
  const out: Cell[] = []
  for (const word of text.split(/(\s+)/)) {
    if (/^\s+$/.test(word)) {
      out.push([])
      continue
    }
    const letters = word.replace(/[^A-Za-z]/g, '')
    const allCaps = letters.length > 1 && letters === letters.toUpperCase()
    if (allCaps) out.push(CAPITAL, CAPITAL)
    let numeric = false
    for (const ch of word) {
      if (/\d/.test(ch)) {
        if (!numeric) out.push(NUMBER)
        numeric = true
        out.push(DOTS[DIGITS[Number(ch)]])
        continue
      }
      const lower = ch.toLowerCase()
      if (numeric && lower >= 'a' && lower <= 'j') out.push(GRADE1)
      numeric = false
      if (!DOTS[lower]) continue // ponytail: other symbols are skipped — add UEB punctuation as figures need it
      if (!allCaps && ch !== lower) out.push(CAPITAL)
      out.push(DOTS[lower])
    }
  }
  return out
}

// For tests and screen text: ⠠⠉⠑⠇⠇
export const toUnicode = (cells: Cell[]) => cells.map((c) => String.fromCharCode(0x2800 + c.reduce((s, d) => s + (1 << (d - 1)), 0))).join('')

export const DOT_DIAMETER = 1.5 // mm
export const DOT_PITCH = 2.5
export const CELL_PITCH = 6
export const LINE_PITCH = 10
export const CELL_HEIGHT = 2 * DOT_PITCH + DOT_DIAMETER

// (x, y) = top-left of the first cell, in mm.
export function drawCells(x: number, y: number, cells: Cell[]): string {
  const r = DOT_DIAMETER / 2
  return cells
    .flatMap((cell, i) =>
      cell.map((d) => {
        const cx = x + r + i * CELL_PITCH + (d > 3 ? DOT_PITCH : 0)
        const cy = y + r + ((d - 1) % 3) * DOT_PITCH
        return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r}"/>`
      }),
    )
    .join('')
}

export const brailleWidth = (cells: Cell[]) => (cells.length ? (cells.length - 1) * CELL_PITCH + DOT_PITCH + DOT_DIAMETER : 0)
