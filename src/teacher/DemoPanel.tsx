// Part B. Presenter sheet, Ctrl+Shift+D from any screen. Never linked from the UI.
import { useEffect, useRef, useState } from 'react'
import { href } from '../contract/routes.ts'
import { resetDemo } from '../data/db.ts'
import { CONTRAST_KEY } from './Shell.tsx'

const btn = 'min-h-10 rounded-lg border border-field bg-surface px-3 text-left text-[15px] font-medium hover:bg-paper'

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
    <div role="dialog" aria-label="Presenter" className="fixed right-4 bottom-4 z-50 flex w-64 flex-col gap-2 rounded-[14px] border border-line bg-surface p-4 text-ink shadow-[0_20px_70px_rgb(33_56_108/0.22)]">
      <p className="mb-1 font-semibold tracking-[-0.01em]">Presenter</p>
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
