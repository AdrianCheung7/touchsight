import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_PREFS } from '../contract/types.ts'
import * as db from './db.ts'

// In-memory stand-in for IndexedDB (Node has none).
vi.mock('idb-keyval', () => {
  const m = new Map<string, unknown>()
  return {
    get: async (k: string) => structuredClone(m.get(k)),
    set: async (k: string, v: unknown) => void m.set(k, structuredClone(v)),
    del: async (k: string) => void m.delete(k),
    clear: async () => m.clear(),
    entries: async () => [...m.entries()].map(([k, v]) => [k, structuredClone(v)]),
    update: async (k: string, fn: (v: unknown) => unknown) => void m.set(k, fn(m.get(k))),
  }
})

describe('db', () => {
  it('ships the two traced figures, the hero first', async () => {
    const figs = await db.listFigures()
    expect(figs.map((f) => f.id)).toEqual(['animal-cell', 'canada'])
    const cell = figs[0]
    expect(cell.regions.find((r) => r.id === 'mitochondrion')).toBeDefined()
    expect(figs[1].regions).toHaveLength(13)
    for (const f of figs) {
      for (const r of f.regions) {
        expect(r.polygon.length).toBeGreaterThanOrEqual(3)
        expect(r.explanation.split(/\s+/).length).toBeLessThanOrEqual(30)
        expect(r.labelAnchor[0]).toBeGreaterThanOrEqual(0)
        expect(r.labelAnchor[0]).toBeLessThanOrEqual(f.width)
      }
      expect(new Set(f.regions.map((r) => r.id)).size).toBe(f.regions.length)
    }
  })

  it('lets a saved figure override the built-in one', async () => {
    const cell = (await db.getFigure('animal-cell'))!
    await db.saveFigure({ ...cell, title: 'Renamed cell' })
    expect((await db.getFigure('animal-cell'))!.title).toBe('Renamed cell')
    const list = await db.listFigures()
    expect(list.filter((f) => f.id === 'animal-cell')).toHaveLength(1)
    expect(list[0].title).toBe('Renamed cell')
  })

  it('drops invalid stored regions with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const cell = (await db.getFigure('canada'))!
    const bad = { ...cell.regions[0], id: 'bad', polygon: [[0, 0], [1, 1]] }
    await db.saveFigure({ ...cell, regions: [...cell.regions, bad as never] })
    const got = (await db.getFigure('canada'))!
    expect(got.regions.some((r) => r.id === 'bad')).toBe(false)
    expect(got.regions).toHaveLength(13)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('puts a recorded session first', async () => {
    const s = await db.recordSession({ studentId: 'guest', figureId: 'animal-cell', targetRegionId: 'mitochondrion', seconds: 14.4 })
    expect(s.seconds).toBe(14)
    const all = await db.listSessions()
    expect(all[0].id).toBe(s.id)
    expect(all.length).toBeGreaterThan(20)
    expect((await db.listSessions({ studentId: 'guest' })).map((x) => x.id)).toEqual([s.id])
  })

  it('resetDemo restores the pristine classroom', async () => {
    await db.saveStudentPrefs('s1', { ...DEFAULT_PREFS, sensitivity: 2 })
    expect((await db.getStudent('s1'))!.prefs.sensitivity).toBe(2)
    await db.resetDemo()
    expect((await db.getFigure('animal-cell'))!.title).toBe('Animal cell')
    expect((await db.listSessions()).some((s) => s.studentId === 'guest')).toBe(false)
    expect((await db.getStudent('s1'))!.prefs.sensitivity).toBe(1)
  })

  it('returns a default guest', async () => {
    expect(await db.getStudent('guest')).toEqual({ id: 'guest', name: 'Guest', classId: '', prefs: DEFAULT_PREFS })
    await db.saveStudentPrefs('guest', { ...DEFAULT_PREFS, quiet: true })
    expect((await db.getStudent('guest'))!.prefs.quiet).toBe(true)
  })

  it('refuses to delete built-in figures but deletes uploads', async () => {
    await expect(db.deleteFigure('animal-cell')).rejects.toThrow()
    const cell = (await db.getFigure('animal-cell'))!
    await db.saveFigure({ ...cell, id: 'upload-1' })
    await db.deleteFigure('upload-1')
    expect(await db.getFigure('upload-1')).toBeUndefined()
  })

  it('adds a student to a class, and reset removes them', async () => {
    const s = await db.addStudent('  Ana M. ', 'g5')
    expect(s).toMatchObject({ name: 'Ana M.', classId: 'g5', prefs: DEFAULT_PREFS })
    expect((await db.listStudents('g5')).map((x) => x.name)).toContain('Ana M.')
    expect(await db.getStudent(s.id)).toEqual(s)
    await db.resetDemo()
    expect(await db.getStudent(s.id)).toBeUndefined()
  })

  it('keeps the seeded history realistic: nothing in the last hour, 3 students per class', async () => {
    const newest = (await db.listSessions())[0]
    expect(Date.now() - Date.parse(newest.at)).toBeGreaterThan(60 * 60_000)
    for (const c of await db.listClasses()) expect(await db.listStudents(c.id)).toHaveLength(3)
    expect((await db.listAssignments()).length).toBe(2)
  })
})
