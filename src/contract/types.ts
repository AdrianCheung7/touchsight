// FROZEN — docs/CONTRACT.md §3. Change only via a joint `contract:` commit approved by both parts.

export type Point = [number, number] // image pixels, origin top-left

export interface Region {
  id: string // kebab-case, unique within the figure
  label: string // as printed, e.g. "Mitochondrion"
  polygon: Point[] // ≥ 3 points
  labelAnchor: Point // where Tab jumps to and where braille goes
  explanation: string // 1–2 sentences, grade-5 reading level, ≤ 30 words
  origin: 'teacher' | 'ai'
}

export interface Figure {
  id: string
  title: string // "Animal cell"
  subject: string // "Science" | "Social Studies" | …
  gradeBand: string // "Grade 7"
  image: string // URL under /figures/ or a data: URL (uploads)
  width: number
  height: number // natural image size in px
  source?: { credit: string; license: string; url: string }
  regions: Region[]
  updatedAt: string // ISO
}

export interface StudentPrefs {
  sensitivity: number // default 1.0
  speechRate: number // default 1.05
  screenReaderMode: boolean // default false
  quiet: boolean // default false
}

export interface Student {
  id: string
  name: string
  classId: string
  prefs: StudentPrefs
}

export interface ClassRoom {
  id: string
  name: string
  teacher: string
}

export interface Assignment {
  id: string
  classId: string
  figureId: string
  due: string // ISO date
}

export interface Session {
  id: string
  studentId: string // 'guest' for the explorer opened without a student
  figureId: string
  targetRegionId: string // the region the student was asked to find
  seconds: number // whole seconds
  at: string // ISO timestamp
}

export const GUEST_ID = 'guest'
export const DEFAULT_PREFS: StudentPrefs = { sensitivity: 1, speechRate: 1.05, screenReaderMode: false, quiet: false }
