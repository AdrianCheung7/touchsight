// Part B. Presenter sheet, Ctrl+Shift+D from any screen. Never linked from the UI.
import { useEffect, useRef, useState } from 'react'
import { href } from '../contract/routes.ts'
import { resetDemo } from '../data/db.ts'
import { CONTRAST_KEY } from './Header.tsx'

const btn = 'rounded-md border border-line px-3 py-2 text-left hover:border-ink'

export default function DemoPanel() {
  const [open, setOpen] = useState(false)
  const first = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.pointerLockElement) return // every key inside the explorer belongs to Part A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) first.current?.focus()
  }, [open])

  if (!open) return null

  const go = (to: string) => {
    setOpen(false)
    location.hash = to
  }

  const reset = async () => {
    await resetDemo()
    try {
      localStorage.removeItem(CONTRAST_KEY)
    } catch {
      // storage blocked: nothing to clear
    }
    location.hash = href.home()
    location.reload()
  }

  return (
    <div role="dialog" aria-label="Presenter" className="fixed right-4 bottom-4 z-50 flex w-60 flex-col gap-2 rounded-xl border border-line bg-paper p-4 text-ink">
      <p className="font-serif text-lg">Presenter</p>
      <button ref={first} type="button" className={btn} onClick={reset}>
        Reset everything
      </button>
      <button type="button" className={btn} onClick={() => go(href.explore('animal-cell', 'guest', 'mitochondrion'))}>
        Open hero
      </button>
      <button type="button" className={btn} onClick={() => go(href.home())}>
        Open dashboard
      </button>
      <button type="button" className={btn} onClick={() => go(href.edit('animal-cell'))}>
        Open editor on the cell
      </button>
    </div>
  )
}
