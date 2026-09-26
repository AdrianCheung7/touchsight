// Part B. Small shared helpers for the teacher screens.
import { GUEST_ID, type Figure, type Student } from '../contract/types.ts'
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

// "just now", "5 minutes ago", "yesterday", "3 days ago"
export function ago(iso: string, now = Date.now()): string {
  const s = (Date.parse(iso) - now) / 1000
  const a = Math.abs(s)
  if (a < 60) return 'just now'
  if (a < 3600) return rtf.format(Math.round(s / 60), 'minute')
  if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour')
  return rtf.format(Math.round(s / 86400), 'day')
}

// "Thu"
export const weekday = (iso: string) => new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(iso))

export const primaryBtn = 'inline-flex items-center justify-center rounded-md bg-ink px-4 py-2 text-paper hover:opacity-85 active:scale-[0.98] disabled:opacity-50'
export const secondaryBtn = 'inline-flex items-center justify-center rounded-md border border-line px-4 py-2 hover:border-ink active:scale-[0.98] disabled:opacity-50'

export const studentName = (students: Student[], id: string) =>
  id === GUEST_ID ? 'Guest' : (students.find((s) => s.id === id)?.name ?? 'A student')

export const regionLabel = (figures: Figure[], figureId: string, regionId: string) =>
  figures.find((f) => f.id === figureId)?.regions.find((r) => r.id === regionId)?.label ?? regionId
