import { describe, expect, it } from 'vitest'
import { href, parseRoute } from './routes.ts'

describe('parseRoute', () => {
  it('parses every route', () => {
    expect(parseRoute('#/')).toEqual({ page: 'home' })
    expect(parseRoute('')).toEqual({ page: 'home' })
    expect(parseRoute('#/explore/animal-cell?student=s1&target=mitochondrion')).toEqual({
      page: 'explore',
      figureId: 'animal-cell',
      studentId: 's1',
      target: 'mitochondrion',
    })
    expect(parseRoute('#/edit/canada')).toEqual({ page: 'edit', figureId: 'canada' })
    expect(parseRoute('#/upload')).toEqual({ page: 'upload' })
    expect(parseRoute('#/student/s2')).toEqual({ page: 'student', studentId: 's2' })
    expect(parseRoute('#/about')).toEqual({ page: 'about' })
  })

  it('defaults the explorer to the guest with no target', () => {
    expect(parseRoute('#/explore/canada')).toEqual({ page: 'explore', figureId: 'canada', studentId: 'guest', target: undefined })
  })

  it('falls back to home for unknown or incomplete hashes', () => {
    expect(parseRoute('#/nope')).toEqual({ page: 'home' })
    expect(parseRoute('#/edit')).toEqual({ page: 'home' })
  })

  it('round-trips href builders', () => {
    expect(parseRoute(href.explore('animal-cell', 'guest', 'mitochondrion'))).toMatchObject({ figureId: 'animal-cell', target: 'mitochondrion' })
    expect(parseRoute(href.student('s1'))).toEqual({ page: 'student', studentId: 's1' })
    expect(parseRoute(href.edit('canada'))).toEqual({ page: 'edit', figureId: 'canada' })
  })
})
