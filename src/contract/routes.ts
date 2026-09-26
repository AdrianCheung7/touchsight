// FROZEN — docs/CONTRACT.md §4. Change only via a joint `contract:` commit approved by both parts.

export type Route =
  | { page: 'home' }
  | { page: 'explore'; figureId: string; studentId: string; target?: string }
  | { page: 'edit'; figureId: string }
  | { page: 'upload' }
  | { page: 'student'; studentId: string }
  | { page: 'about' }

export const href = {
  home: () => '#/',
  explore: (figureId: string, studentId = 'guest', target?: string) =>
    `#/explore/${figureId}?student=${studentId}${target ? `&target=${target}` : ''}`,
  edit: (figureId: string) => `#/edit/${figureId}`,
  upload: () => '#/upload',
  student: (studentId: string) => `#/student/${studentId}`,
  about: () => '#/about',
}

export function parseRoute(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const params = new URLSearchParams(query)
  const [page, id] = path.split('/').filter(Boolean).map(decodeURIComponent)

  if (page === 'explore' && id) {
    return { page, figureId: id, studentId: params.get('student') || 'guest', target: params.get('target') || undefined }
  }
  if (page === 'edit' && id) return { page, figureId: id }
  if (page === 'student' && id) return { page, studentId: id }
  if (page === 'upload' || page === 'about') return { page }
  return { page: 'home' }
}
