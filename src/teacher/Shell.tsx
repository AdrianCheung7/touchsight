// Part B. The teacher workspace frame (DESIGN.md): the ink-blue rail with the brand, classes and navigation,
// and a top bar with the date and the high-contrast toggle. Plus the small drawn marks every screen shares.
import { useState } from 'react'
import { href, type Route } from '../contract/routes.ts'
import { TEACHER, classes } from '../data/seed.ts'
import { initials } from './ui.ts'

export const CONTRAST_KEY = 'touchsight:contrast'

const TODAY = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' })

export default function Shell({ page, children }: { page: Route['page']; children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15.25rem_minmax(0,1fr)]">
      <Rail page={page} />
      <div className="min-w-0">
        <Topbar />
        {children}
      </div>
    </div>
  )
}

function Rail({ page }: { page: Route['page'] }) {
  const item = (to: string, label: string, current: boolean) => (
    <li>
      <a
        href={to}
        aria-current={current ? 'page' : undefined}
        className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-medium focus-visible:outline-rail-mark lg:min-h-11 ${current ? 'bg-rail-active text-white' : 'text-rail-ink/85 hover:bg-rail-active/70 hover:text-white'}`}
      >
        <span aria-hidden="true" className={`size-[7px] shrink-0 rounded-[2px] ${current ? 'bg-rail-mark' : 'bg-transparent'}`} />
        {label}
      </a>
    </li>
  )
  const railLabel = 'mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-rail-muted'

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-rail px-5 py-4 text-rail-ink lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:flex-nowrap lg:items-stretch lg:justify-start lg:overflow-y-auto lg:px-[18px] lg:pb-5 lg:pt-7">
      <a href={href.home()} className="flex items-center gap-3 rounded-lg px-1.5 py-0.5 focus-visible:outline-rail-mark">
        <Mark className="text-rail-mark" />
        <span className="flex flex-col">
          <span className="text-base font-semibold tracking-[-0.025em] text-white">TouchSight</span>
          <span className="hidden text-[13px] text-rail-muted lg:block">Teacher workspace</span>
        </span>
      </a>

      <div className="hidden lg:mt-11 lg:mb-9 lg:block">
        <p className={railLabel}>Teacher</p>
        <p className="px-3 font-semibold text-white">{TEACHER}</p>
        <ul className="mt-1.5 px-3 text-[13px] leading-6 text-rail-muted">
          {classes.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </div>

      <nav aria-label="Main">
        <p className={`${railLabel} hidden lg:block`}>Workspace</p>
        <ul className="flex gap-1 lg:flex-col lg:gap-1.5">
          {item(href.home(), 'Dashboard', page !== 'about')}
          {item(href.about(), 'About', page === 'about')}
        </ul>
      </nav>

      <p className="mt-auto hidden items-center gap-2.5 px-3 pt-4 text-[13px] leading-snug text-rail-muted lg:flex">
        <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-rail-mark" />
        Works offline. Everything stays on this laptop.
      </p>
    </header>
  )
}

function Topbar() {
  const [high, setHigh] = useState(() => document.documentElement.dataset.contrast === 'high')

  const toggle = () => {
    const next = !high
    setHigh(next)
    if (next) document.documentElement.dataset.contrast = 'high'
    else delete document.documentElement.dataset.contrast
    try {
      localStorage.setItem(CONTRAST_KEY, next ? 'high' : 'normal')
    } catch {
      // storage blocked: the toggle still works for this visit
    }
  }

  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/85 px-[clamp(1.25rem,4.5vw,5.25rem)]">
      <p className="flex items-center gap-2.5 text-sm font-medium text-muted">
        <span aria-hidden="true" className="size-[9px] rotate-45 rounded-[3px] border-2 border-accent/70" />
        {TODAY.format(new Date())}
      </p>
      <button
        type="button"
        aria-pressed={high}
        onClick={toggle}
        className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium ${high ? 'border-ink bg-ink text-paper' : 'border-field bg-surface text-ink hover:bg-paper'}`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
        </svg>
        High contrast
      </button>
    </div>
  )
}

// The brand mark: a braille-like cell of four dots in a tilted frame.
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34" className={`shrink-0 ${className}`}>
      <g transform="rotate(-7 17 17)" fill="currentColor">
        <rect x="2.5" y="2.5" width="29" height="29" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <circle cx="12.75" cy="12.75" r="3.5" />
        <circle cx="21.25" cy="12.75" r="3.5" />
        <circle cx="12.75" cy="21.25" r="3.5" />
        <circle cx="21.25" cy="21.25" r="3.5" opacity="0.45" />
      </g>
    </svg>
  )
}

const ICONS = {
  chevron: 'M6 3.5 10.5 8 6 12.5',
  back: 'M10 3.5 5.5 8 10 12.5',
  plus: 'M8 3v10M3 8h10',
  close: 'M4 4l8 8m0-8-8 8',
  search: 'M7.2 12.4a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4zm3.7-1.5L14 14',
  upload: 'M8 10.5V2.5m0 0-3 3m3-3 3 3M2.5 13.5h11',
}

// One drawn icon set: 16 px, 1.7 px round strokes.
export function Icon({ name, className = '' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d={ICONS[name]} />
    </svg>
  )
}

export function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft font-semibold text-accent-strong tabular-nums ${large ? 'size-14 text-lg' : 'size-10.5 text-[13px]'}`}
    >
      {initials(name)}
    </span>
  )
}
