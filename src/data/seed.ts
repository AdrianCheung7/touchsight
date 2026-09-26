// Part B. The built-in classroom. Every date is relative to load time, so it never looks stale.
import type { Assignment, ClassRoom, Figure, Session, Student } from '../contract/types.ts'
import cell from './figures/animal-cell.json'
import canada from './figures/canada.json'

const NOW = Date.now()
const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const ago = (ms: number) => new Date(NOW - ms).toISOString()

export const TEACHER = 'Ms. Rivera'

export const figures: Figure[] = [
  { ...(cell as Figure), updatedAt: ago(2 * DAY) },
  { ...(canada as Figure), updatedAt: ago(5 * DAY) },
]

export const classes: ClassRoom[] = [
  { id: 'g5', name: 'Grade 5 · Room 12', teacher: TEACHER },
  { id: 'g7', name: 'Grade 7 · Science', teacher: TEACHER },
]

export const students: Student[] = [
  { id: 's1', name: 'Maya K.', classId: 'g5', prefs: { sensitivity: 1, speechRate: 1.05, screenReaderMode: false, quiet: false } },
  { id: 's2', name: 'Owen T.', classId: 'g5', prefs: { sensitivity: 1.3, speechRate: 1, screenReaderMode: true, quiet: false } },
  { id: 's3', name: 'Priya S.', classId: 'g5', prefs: { sensitivity: 0.8, speechRate: 1.2, screenReaderMode: false, quiet: false } },
  { id: 's4', name: 'Liam N.', classId: 'g7', prefs: { sensitivity: 1.1, speechRate: 1.05, screenReaderMode: false, quiet: true } },
  { id: 's5', name: 'Zoe A.', classId: 'g7', prefs: { sensitivity: 1, speechRate: 0.9, screenReaderMode: true, quiet: false } },
  { id: 's6', name: 'Kai R.', classId: 'g7', prefs: { sensitivity: 1.2, speechRate: 1.1, screenReaderMode: false, quiet: false } },
]

export const assignments: Assignment[] = [
  { id: 'a1', classId: 'g5', figureId: 'canada', due: ago(-3 * DAY) },
  { id: 'a2', classId: 'g7', figureId: 'animal-cell', due: ago(-5 * DAY) },
]

// [studentId, figureId, target, seconds, how long ago]. Times fall with practice; nothing in the last hour.
const history: [string, string, string, number, number][] = [
  ['s4', 'animal-cell', 'mitochondrion', 52, 13 * DAY + 2 * HOUR],
  ['s4', 'animal-cell', 'nucleus', 24, 12 * DAY + 5 * HOUR],
  ['s4', 'animal-cell', 'mitochondrion', 31, 8 * DAY + 3 * HOUR],
  ['s4', 'animal-cell', 'nucleus', 11, 6 * DAY + 1 * HOUR],
  ['s4', 'animal-cell', 'mitochondrion', 19, 3 * DAY + 4 * HOUR],
  ['s5', 'animal-cell', 'mitochondrion', 64, 11 * DAY + 6 * HOUR],
  ['s5', 'animal-cell', 'golgi-apparatus', 45, 9 * DAY + 2 * HOUR],
  ['s5', 'animal-cell', 'mitochondrion', 38, 5 * DAY + 7 * HOUR],
  ['s5', 'animal-cell', 'golgi-apparatus', 29, 2 * DAY + 3 * HOUR],
  ['s5', 'animal-cell', 'mitochondrion', 27, 1 * DAY + 3 * HOUR],
  ['s6', 'animal-cell', 'lysosome', 71, 10 * DAY + 1 * HOUR],
  ['s6', 'animal-cell', 'mitochondrion', 47, 7 * DAY + 5 * HOUR],
  ['s6', 'animal-cell', 'lysosome', 40, 4 * DAY + 2 * HOUR],
  ['s6', 'animal-cell', 'mitochondrion', 30, 20 * HOUR],
  ['s1', 'canada', 'british-columbia', 18, 13 * DAY + 4 * HOUR],
  ['s1', 'canada', 'prince-edward-island', 58, 9 * DAY + 3 * HOUR],
  ['s1', 'canada', 'british-columbia', 9, 6 * DAY + 2 * HOUR],
  ['s1', 'canada', 'prince-edward-island', 33, 2 * DAY + 5 * HOUR],
  ['s2', 'canada', 'nunavut', 22, 12 * DAY + 1 * HOUR],
  ['s2', 'canada', 'ontario', 30, 8 * DAY + 6 * HOUR],
  ['s2', 'canada', 'nunavut', 12, 5 * DAY + 3 * HOUR],
  ['s2', 'canada', 'ontario', 17, 1 * DAY + 2 * HOUR],
  ['s3', 'canada', 'quebec', 26, 11 * DAY + 2 * HOUR],
  ['s3', 'canada', 'nova-scotia', 49, 7 * DAY + 4 * HOUR],
  ['s3', 'canada', 'quebec', 15, 4 * DAY + 1 * HOUR],
  ['s3', 'canada', 'nova-scotia', 28, 5 * HOUR],
]

export const sessions: Session[] = history.map(([studentId, figureId, targetRegionId, seconds, ms], i) => ({
  id: `h${i + 1}`,
  studentId,
  figureId,
  targetRegionId,
  seconds,
  at: ago(ms),
}))
