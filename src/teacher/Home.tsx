// Part B placeholder — step B3 replaces this with the dashboard.
import { useEffect, useState } from 'react'
import { href } from '../contract/routes.ts'
import type { Figure } from '../contract/types.ts'
import { listFigures } from '../data/db.ts'

export default function Home() {
  const [figures, setFigures] = useState<Figure[]>([])
  useEffect(() => {
    listFigures().then(setFigures)
  }, [])

  return (
    <main className="mx-auto max-w-[1100px] p-8">
      <h1 className="text-4xl">TouchSight</h1>
      <ul className="mt-6 space-y-3">
        {figures.map((f) => (
          <li key={f.id} className="flex gap-4 rounded-xl border border-line p-4">
            <span className="flex-1">{f.title}</span>
            <a className="text-accent underline" href={href.explore(f.id)}>
              Explore
            </a>
            <a className="text-accent underline" href={href.edit(f.id)}>
              Edit
            </a>
          </li>
        ))}
      </ul>
      <nav className="mt-6 flex gap-4 text-muted">
        <a href={href.upload()}>Upload</a>
        <a href={href.student('s1')}>Student</a>
        <a href={href.about()}>About</a>
      </nav>
    </main>
  )
}
