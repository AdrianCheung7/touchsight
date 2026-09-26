// Part B. STUB from checkpoint C0: in-memory, one test figure. Step B1 replaces the internals
// (seed + idb-keyval) behind these exact signatures (docs/CONTRACT.md §5) — callers never change.
import {
  DEFAULT_PREFS,
  GUEST_ID,
  type Assignment,
  type ClassRoom,
  type Figure,
  type Point,
  type Session,
  type Student,
  type StudentPrefs,
} from '../contract/types.ts'

// Points approximating a circle, for the test figure.
const circle = (cx: number, cy: number, r: number, n = 16): Point[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI
    return [Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))]
  })

const TEST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
<rect width="400" height="400" fill="#fff"/>
<rect x="20" y="20" width="360" height="360" fill="#eef" stroke="#333" stroke-width="3"/>
<circle cx="150" cy="160" r="90" fill="#fdd" stroke="#333" stroke-width="3"/>
<circle cx="150" cy="160" r="30" fill="#f99" stroke="#333" stroke-width="3"/>
<polygon points="260,300 340,300 300,230" fill="#dfd" stroke="#333" stroke-width="3"/>
</svg>`

const testFigure: Figure = {
  id: 'test-square',
  title: 'Test square',
  subject: 'Science',
  gradeBand: 'Grade 7',
  image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(TEST_SVG)}`,
  width: 400,
  height: 400,
  regions: [
    {
      id: 'frame',
      label: 'Frame',
      polygon: [[20, 20], [380, 20], [380, 380], [20, 380]],
      labelAnchor: [360, 40],
      explanation: 'The frame is the big square that holds everything else.',
      origin: 'teacher',
    },
    {
      id: 'big-circle',
      label: 'Big circle',
      polygon: circle(150, 160, 90),
      labelAnchor: [150, 100],
      explanation: 'The big circle sits in the upper left and has a small circle inside it.',
      origin: 'teacher',
    },
    {
      id: 'small-circle',
      label: 'Small circle',
      polygon: circle(150, 160, 30),
      labelAnchor: [150, 160],
      explanation: 'The small circle is inside the big circle.',
      origin: 'teacher',
    },
    {
      id: 'triangle',
      label: 'Triangle',
      polygon: [[260, 300], [340, 300], [300, 230]],
      labelAnchor: [300, 280],
      explanation: 'The triangle is in the lower right corner.',
      origin: 'teacher',
    },
  ],
  updatedAt: new Date().toISOString(),
}

const figures: Figure[] = [testFigure]
const classes: ClassRoom[] = [{ id: 'c1', name: 'Grade 7 · Science', teacher: 'Ms. Rivera' }]
const students: Student[] = [{ id: 's1', name: 'Student 1', classId: 'c1', prefs: { ...DEFAULT_PREFS } }]
const assignments: Assignment[] = [{ id: 'a1', classId: 'c1', figureId: 'test-square', due: new Date().toISOString() }]
const sessions: Session[] = []
const guestPrefs: { value: StudentPrefs } = { value: { ...DEFAULT_PREFS } }

const clone = <T>(x: T): T => structuredClone(x)

export async function listFigures(): Promise<Figure[]> {
  return clone(figures)
}

export async function getFigure(id: string): Promise<Figure | undefined> {
  return clone(figures.find((f) => f.id === id))
}

export async function saveFigure(f: Figure): Promise<void> {
  const saved = { ...clone(f), updatedAt: new Date().toISOString() }
  const i = figures.findIndex((x) => x.id === f.id)
  if (i >= 0) figures[i] = saved
  else figures.unshift(saved)
}

export async function deleteFigure(id: string): Promise<void> {
  if (id === testFigure.id) throw new Error('Built-in figures cannot be deleted')
  const i = figures.findIndex((f) => f.id === id)
  if (i >= 0) figures.splice(i, 1)
}

export async function listClasses(): Promise<ClassRoom[]> {
  return clone(classes)
}

export async function listStudents(classId?: string): Promise<Student[]> {
  return clone(students.filter((s) => !classId || s.classId === classId))
}

export async function getStudent(id: string): Promise<Student | undefined> {
  if (id === GUEST_ID) return { id: GUEST_ID, name: 'Guest', classId: '', prefs: clone(guestPrefs.value) }
  return clone(students.find((s) => s.id === id))
}

export async function saveStudentPrefs(id: string, prefs: StudentPrefs): Promise<void> {
  if (id === GUEST_ID) guestPrefs.value = clone(prefs)
  const s = students.find((x) => x.id === id)
  if (s) s.prefs = clone(prefs)
}

export async function listAssignments(classId?: string): Promise<Assignment[]> {
  return clone(assignments.filter((a) => !classId || a.classId === classId))
}

export async function listSessions(f: { studentId?: string; figureId?: string } = {}): Promise<Session[]> {
  return clone(
    sessions
      .filter((s) => (!f.studentId || s.studentId === f.studentId) && (!f.figureId || s.figureId === f.figureId))
      .sort((a, b) => b.at.localeCompare(a.at)),
  )
}

export async function recordSession(s: Omit<Session, 'id' | 'at'>): Promise<Session> {
  const session: Session = { ...s, id: crypto.randomUUID(), at: new Date().toISOString() }
  sessions.push(session)
  return clone(session)
}

export async function resetDemo(): Promise<void> {
  sessions.length = 0
  guestPrefs.value = { ...DEFAULT_PREFS }
}
