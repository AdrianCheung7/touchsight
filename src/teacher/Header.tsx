// Part B. Wordmark, nav, high-contrast toggle, teacher name. Rendered by App on every teacher screen.
import { useState } from 'react'
import { href, type Route } from '../contract/routes.ts'
import { TEACHER } from '../data/seed.ts'

export const CONTRAST_KEY = 'touchsight:contrast'

export default function Header({ page }: { page: Route['page'] }) {
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

  const link = (to: string, label: string, active: boolean) => (
    <a
      href={to}
      aria-current={active ? 'page' : undefined}
      className={`rounded-md px-2 py-1 ${active ? 'text-ink underline decoration-accent decoration-2 underline-offset-8' : 'text-muted hover:text-ink'}`}
    >
      {label}
    </a>
  )

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4">
        <a href={href.home()} className="flex items-center gap-2 rounded-md font-serif text-2xl font-semibold tracking-tight">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="11" cy="11" r="4" className="fill-accent" />
          </svg>
          TouchSight
        </a>
        <nav aria-label="Main" className="flex gap-2">
          {link(href.home(), 'Home', page === 'home')}
          {link(href.about(), 'About', page === 'about')}
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <button
            type="button"
            aria-pressed={high}
            onClick={toggle}
            className="flex items-center gap-2 rounded-md border border-line px-3 py-1 hover:border-ink"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
            </svg>
            High contrast
          </button>
          <span className="text-muted">{TEACHER}</span>
        </div>
      </div>
    </header>
  )
}
