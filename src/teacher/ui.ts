// Part B. Small shared helpers for the teacher screens.
import { GUEST_ID, type Figure, type Student } from '../contract/types.ts'
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const HOUR = 3_600_000

// "just now", "5 minutes ago", "yesterday", "3 days ago"
export function ago(iso: string, now = Date.now()): string {
  const s = (Date.parse(iso) - now) / 1000
  const a = Math.abs(s)
  if (a < 60) return 'just now'
  if (a < 3600) return rtf.format(Math.round(s / 60), 'minute')
  if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour')
  return rtf.format(Math.round(s / 86400), 'day')
}

// "Just now", "12 minutes ago", then "Today, 9:26 AM", "Yesterday, 1:18 PM", "Sep 22, 11:06 AM"
export function stamp(iso: string, now = Date.now()): string {
  const t = Date.parse(iso)
  if (now - t < HOUR) {
    const s = ago(iso, now)
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  const d = new Date(t)
  const days = Math.round((new Date(now).setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / (24 * HOUR))
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(d)
  return `${day}, ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(d)}`
}

// "Thu"
export const weekday = (iso: string) => new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(iso))

// "Maya K." → "MK"
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

const btn =
  'inline-flex min-h-10.5 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[15px] font-semibold transition-[background-color,scale] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
export const primaryBtn = `${btn} bg-accent text-white hover:bg-accent-strong`
export const secondaryBtn = `${btn} border border-field bg-surface text-ink hover:bg-paper`
export const textBtn = 'rounded-md px-2 py-1 font-semibold text-accent-strong hover:bg-accent-soft'
export const iconBtn = 'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-ink'
export const field = 'min-h-10.5 rounded-lg border border-field bg-surface px-3 py-2 text-ink'
export const tag = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-line bg-surface px-2 py-0.5 text-sm text-muted'
export const backLink = 'inline-flex items-center gap-2 rounded-md py-1 pr-2 text-sm font-medium text-muted hover:text-accent-strong'
export const dialogBox = 'm-auto rounded-[14px] border border-line bg-surface p-0 text-ink shadow-[0_20px_70px_rgb(12_42_54/0.22)]'

export const studentName = (students: Student[], id: string) =>
  id === GUEST_ID ? 'Guest' : (students.find((s) => s.id === id)?.name ?? 'A student')

export const regionLabel = (figures: Figure[], figureId: string, regionId: string) =>
  figures.find((f) => f.id === figureId)?.regions.find((r) => r.id === regionId)?.label ?? regionId
