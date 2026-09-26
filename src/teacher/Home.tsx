// Part B. Dashboard (#/): library, classes, recent activity. Reloads every time the route returns here.
import { useEffect, useState } from 'react'
import { href } from '../contract/routes.ts'
import type { Assignment, ClassRoom, Figure, Session, Student } from '../contract/types.ts'
import { listAssignments, listClasses, listFigures, listSessions, listStudents } from '../data/db.ts'
import { ago, primaryBtn, regionLabel, secondaryBtn, studentName, weekday } from './ui.ts'

const HERO = 'animal-cell'

interface Data {
  figures: Figure[]
  classes: ClassRoom[]
  students: Student[]
  assignments: Assignment[]
  sessions: Session[]
  now: number
}

export default function Home() {
  const [data, setData] = useState<Data>()

  useEffect(() => {
    let live = true
    Promise.all([listFigures(), listClasses(), listStudents(), listAssignments(), listSessions()]).then(
      ([figures, classes, students, assignments, sessions]) => {
        // The hero diagram always leads the library.
        figures.sort((a, b) => Number(b.id === HERO) - Number(a.id === HERO))
        if (live) setData({ figures, classes, students, assignments, sessions, now: Date.now() })
      },
    )
    return () => {
      live = false
    }
  }, [])

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-24">
      <h1 tabIndex={-1} className="sr-only">
        Teacher dashboard
      </h1>
      {data && (
        <>
          <Library figures={data.figures} />
          <Classes {...data} />
          <Recent {...data} />
        </>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `h-${title.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className="pt-12">
      <h2 id={id} className="mb-6 text-3xl tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Library({ figures }: { figures: Figure[] }) {
  return (
    <Section title="Library">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((f) => (
          <li key={f.id} className="flex flex-col overflow-hidden rounded-xl border border-line">
            <div className="flex h-44 items-center justify-center border-b border-line bg-white p-3">
              <img src={f.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-5">
              <h3 className="text-xl">{f.title}</h3>
              <p className="text-muted">
                {[f.subject, f.gradeBand, f.regions.length === 1 ? '1 part' : `${f.regions.length} parts`].filter(Boolean).join(' · ')}
              </p>
              <div className="mt-auto flex gap-3 pt-4">
                <a className={primaryBtn} href={href.explore(f.id)} aria-label={`Explore ${f.title}`}>
                  Explore
                </a>
                <a className={secondaryBtn} href={href.edit(f.id)} aria-label={`Edit ${f.title}`}>
                  Edit
                </a>
              </div>
            </div>
          </li>
        ))}
        <li className="flex">
          <a
            href={href.upload()}
            className="flex min-h-56 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line p-6 text-muted hover:border-ink hover:text-ink"
          >
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 5v18M5 14h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Upload a diagram
          </a>
        </li>
      </ul>
    </Section>
  )
}

function Classes({ classes, students, assignments, figures, sessions, now }: Data) {
  return (
    <Section title="Classes">
      <div className="grid gap-6 md:grid-cols-2">
        {classes.map((c) => {
          const a = assignments.find((x) => x.classId === c.id)
          const fig = a && figures.find((f) => f.id === a.figureId)
          return (
            <section key={c.id} aria-label={c.name} className="rounded-xl border border-line p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-xl">{c.name}</h3>
                {a && fig && (
                  <span className="rounded-full border border-line px-3 text-muted">
                    {fig.title} · due {weekday(a.due)}
                  </span>
                )}
              </div>
              <ul className="mt-4 divide-y divide-line">
                {students
                  .filter((s) => s.classId === c.id)
                  .map((s) => {
                    const last = sessions.find((x) => x.studentId === s.id)
                    return (
                      <li key={s.id} className="flex items-center gap-4 py-3">
                        <div className="flex-1">
                          <a href={href.student(s.id)} className="rounded-sm underline decoration-line underline-offset-4 hover:decoration-ink">
                            {s.name}
                          </a>
                          <p className="text-muted">{last ? `Active ${ago(last.at, now)}` : 'No activity yet'}</p>
                        </div>
                        {a && (
                          <a className={secondaryBtn} href={href.explore(a.figureId, s.id)} aria-label={`Launch ${fig?.title ?? 'assignment'} as ${s.name}`}>
                            Launch
                          </a>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </section>
          )
        })}
      </div>
    </Section>
  )
}

function Recent({ sessions, students, figures, now }: Data) {
  const recent = sessions.slice(0, 8)
  return (
    <Section title="Recent activity">
      {recent.length === 0 ? (
        <p className="text-muted">Finished find-it challenges will show up here.</p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {recent.map((s, i) => (
            <li
              key={s.id}
              className={`flex flex-wrap items-baseline gap-x-2 px-2 py-3 ${i === 0 && now - Date.parse(s.at) < 5 * 60_000 ? 'fresh-row' : ''}`}
            >
              <span>
                {studentName(students, s.studentId)} found {regionLabel(figures, s.figureId, s.targetRegionId)} in{' '}
                <span className="font-mono tabular-nums">{s.seconds} s</span>
              </span>
              <span className="text-muted">· {ago(s.at, now)}</span>
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
