// Part B. The app's database (docs/CONTRACT.md §5): the built-in classroom from seed.ts,
// with every write kept in IndexedDB (idb-keyval) and merged on top when read.
// Keys: `fig:<id>`, `prefs:<studentId>`, `sessions` and `students` (appended arrays).
import { clear, del, entries, get, set, update } from 'idb-keyval'
import {
  DEFAULT_PREFS,
  GUEST_ID,
  type Assignment,
  type ClassRoom,
  type Figure,
  type Point,
  type Region,
  type Session,
  type Student,
  type StudentPrefs,
} from '../contract/types.ts'
import * as seed from './seed.ts'

const clone = <T>(x: T): T => structuredClone(x)
const isPoint = (p: unknown): p is Point => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)

// Trust boundary: stored figures may be old or hand-edited. Drop anything that would break hit-testing.
function checkFigure(f: unknown): Figure | undefined {
  const x = f as Figure | undefined
  if (!x || typeof x.id !== 'string' || typeof x.image !== 'string' || !(x.width > 0) || !(x.height > 0) || !Array.isArray(x.regions)) {
    console.warn('TouchSight: ignored an unreadable figure', x?.id)
    return undefined
  }
  const regions = x.regions.filter((r: Region) => {
    const ok = !!r && typeof r.id === 'string' && typeof r.label === 'string' && Array.isArray(r.polygon) && r.polygon.length >= 3 && r.polygon.every(isPoint) && isPoint(r.labelAnchor)
    if (!ok) console.warn(`TouchSight: dropped an invalid region in "${x.id}"`, r)
    return ok
  })
  return {
    ...x,
    title: String(x.title ?? ''),
    subject: String(x.subject ?? ''),
    gradeBand: String(x.gradeBand ?? ''),
    regions: regions.map((r) => ({ ...r, explanation: String(r.explanation ?? ''), origin: r.origin === 'ai' ? 'ai' : 'teacher' })),
  }
}

async function savedFigures(): Promise<Figure[]> {
  const all = await entries<string, unknown>()
  return all.filter(([k]) => String(k).startsWith('fig:')).flatMap(([, v]) => checkFigure(v) ?? [])
}

const newestFirst = <T extends { at?: string; updatedAt?: string }>(a: T, b: T) =>
  (b.at ?? b.updatedAt ?? '').localeCompare(a.at ?? a.updatedAt ?? '')

export async function listFigures(): Promise<Figure[]> {
  const saved = await savedFigures()
  const ids = new Set(saved.map((f) => f.id))
  return [...saved, ...clone(seed.figures.filter((f) => !ids.has(f.id)))].sort(newestFirst)
}

export async function getFigure(id: string): Promise<Figure | undefined> {
  const saved = await get(`fig:${id}`)
  return saved !== undefined ? checkFigure(saved) : clone(seed.figures.find((f) => f.id === id))
}

export async function saveFigure(f: Figure): Promise<void> {
  await set(`fig:${f.id}`, { ...clone(f), updatedAt: new Date().toISOString() })
}

export async function deleteFigure(id: string): Promise<void> {
  if (seed.figures.some((f) => f.id === id)) throw new Error('Built-in figures cannot be deleted')
  await del(`fig:${id}`)
}

export async function listClasses(): Promise<ClassRoom[]> {
  return clone(seed.classes)
}

async function prefsFor(id: string, base: StudentPrefs): Promise<StudentPrefs> {
  const saved = await get<Partial<StudentPrefs>>(`prefs:${id}`)
  return { ...base, ...(saved && typeof saved === 'object' ? saved : {}) }
}

// Students the teacher added, after the built-in ones. Trust boundary: drop anything malformed.
async function allStudents(): Promise<Student[]> {
  const saved = await get<Student[]>('students')
  const added = (Array.isArray(saved) ? saved : []).filter(
    (s) => !!s && typeof s.id === 'string' && typeof s.name === 'string' && s.name.trim() !== '' && typeof s.classId === 'string',
  )
  return [...seed.students, ...added]
}

export async function listStudents(classId?: string): Promise<Student[]> {
  const list = (await allStudents()).filter((s) => !classId || s.classId === classId)
  return Promise.all(list.map(async (s) => ({ ...clone(s), prefs: await prefsFor(s.id, s.prefs ?? DEFAULT_PREFS) })))
}

export async function getStudent(id: string): Promise<Student | undefined> {
  if (id === GUEST_ID) return { id: GUEST_ID, name: 'Guest', classId: '', prefs: await prefsFor(GUEST_ID, DEFAULT_PREFS) }
  const s = (await allStudents()).find((x) => x.id === id)
  return s && { ...clone(s), prefs: await prefsFor(id, s.prefs ?? DEFAULT_PREFS) }
}

// Not in the contract: only the teacher dashboard adds students.
export async function addStudent(name: string, classId: string): Promise<Student> {
  const s: Student = { id: `student-${crypto.randomUUID()}`, name: name.trim().slice(0, 80), classId, prefs: { ...DEFAULT_PREFS } }
  await update<Student[]>('students', (old) => [...(Array.isArray(old) ? old : []), s])
  return clone(s)
}

export async function saveStudentPrefs(id: string, prefs: StudentPrefs): Promise<void> {
  await set(`prefs:${id}`, clone(prefs))
}

export async function listAssignments(classId?: string): Promise<Assignment[]> {
  return clone(seed.assignments.filter((a) => !classId || a.classId === classId))
}

export async function listSessions(f: { studentId?: string; figureId?: string } = {}): Promise<Session[]> {
  const saved = (await get<Session[]>('sessions')) ?? []
  return [...clone(seed.sessions), ...(Array.isArray(saved) ? saved : [])]
    .filter((s) => (!f.studentId || s.studentId === f.studentId) && (!f.figureId || s.figureId === f.figureId))
    .sort(newestFirst)
}

export async function recordSession(s: Omit<Session, 'id' | 'at'>): Promise<Session> {
  const session: Session = { ...s, seconds: Math.round(s.seconds), id: crypto.randomUUID(), at: new Date().toISOString() }
  await update<Session[]>('sessions', (old) => [...(Array.isArray(old) ? old : []), session])
  return clone(session)
}

export async function resetDemo(): Promise<void> {
  await clear()
}
