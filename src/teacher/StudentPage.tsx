// Part B. Student page (#/student/:id): prefs and find-time history per target, as inline-SVG sparklines.
import { useEffect, useState } from 'react'
import { href } from '../contract/routes.ts'
import type { Assignment, ClassRoom, Figure, Session, Student } from '../contract/types.ts'
import { getStudent, listAssignments, listClasses, listFigures, listSessions } from '../data/db.ts'
import { ago, primaryBtn, regionLabel } from './ui.ts'

interface Data {
  student?: Student
  classes: ClassRoom[]
  figures: Figure[]
  sessions: Session[]
  assignments: Assignment[]
}

export default function StudentPage({ studentId }: { studentId: string }) {
  const [data, setData] = useState<Data>()

  useEffect(() => {
    let live = true
    Promise.all([getStudent(studentId), listClasses(), listFigures(), listSessions({ studentId }), listAssignments()]).then(
      ([student, classes, figures, sessions, assignments]) => live && setData({ student, classes, figures, sessions, assignments }),
    )
    return () => {
      live = false
    }
  }, [studentId])

  const s = data?.student
  if (data && !s) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <h1 tabIndex={-1} className="text-4xl tracking-tight">
          Student not found
        </h1>
        <a href={href.home()} className="mt-6 inline-block underline underline-offset-4">
          Back to the dashboard
        </a>
      </main>
    )
  }

  const cls = data?.classes.find((c) => c.id === s?.classId)
  const assignment = data?.assignments.find((a) => a.classId === s?.classId)
  // One row per figure + target, oldest attempt first.
  const rows = new Map<string, Session[]>()
  for (const x of [...(data?.sessions ?? [])].reverse()) {
    const k = `${x.figureId}/${x.targetRegionId}`
    rows.set(k, [...(rows.get(k) ?? []), x])
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-12">
      <a href={href.home()} className="rounded-sm text-muted underline-offset-4 hover:text-ink hover:underline">
        ← Dashboard
      </a>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 tabIndex={-1} className="text-4xl tracking-tight">
            {s?.name ?? ' '}
          </h1>
          <p className="mt-1 text-muted">{cls?.name}</p>
        </div>
        {s && assignment && (
          <a className={primaryBtn} href={href.explore(assignment.figureId, s.id)}>
            Launch {data?.figures.find((f) => f.id === assignment.figureId)?.title ?? 'assignment'}
          </a>
        )}
      </div>

      {s && (
        <ul aria-label="Preferences" className="mt-6 flex flex-wrap gap-2">
          <Pill>Sensitivity {s.prefs.sensitivity.toFixed(1)}×</Pill>
          <Pill>Speech rate {s.prefs.speechRate.toFixed(2)}×</Pill>
          <Pill>Screen reader {s.prefs.screenReaderMode ? 'on' : 'off'}</Pill>
          <Pill>Quiet mode {s.prefs.quiet ? 'on' : 'off'}</Pill>
        </ul>
      )}

      <h2 className="mt-12 mb-4 text-3xl tracking-tight">Find times</h2>
      {data && rows.size === 0 && <p className="text-muted">No find-it challenges yet.</p>}
      <ul className="divide-y divide-line border-y border-line">
        {[...rows.values()].map((list) => {
          const last = list[list.length - 1]
          const fig = data!.figures.find((f) => f.id === last.figureId)
          const secs = list.map((x) => x.seconds)
          return (
            <li key={`${last.figureId}/${last.targetRegionId}`} className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4">
              <div className="min-w-56 flex-1">
                <p className="text-lg">{regionLabel(data!.figures, last.figureId, last.targetRegionId)}</p>
                <p className="text-muted">
                  {fig?.title ?? last.figureId} · {list.length} {list.length === 1 ? 'try' : 'tries'} · last {ago(last.at)}
                </p>
              </div>
              <Sparkline values={secs} />
            </li>
          )
        })}
      </ul>
    </main>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <li className="rounded-full border border-line px-3 py-0.5 text-muted">{children}</li>
}

// 1.5 px ink line, accent dot on the latest value, latest seconds labelled. No chart library.
function Sparkline({ values }: { values: number[] }) {
  const W = 160
  const H = 40
  const P = 4
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i): [number, number] => [
    values.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (values.length - 1),
    max === min ? H / 2 : P + ((max - v) * (H - 2 * P)) / (max - min),
  ])
  const [lx, ly] = pts[pts.length - 1]
  return (
    <div className="flex items-center gap-3">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Find times, oldest to newest: ${values.join(', ')} seconds`}>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" className="stroke-ink" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="3.5" className="fill-accent" />
      </svg>
      <span aria-hidden="true" className="w-16">
        <span className="font-mono tabular-nums">{values[values.length - 1]}</span> s
      </span>
    </div>
  )
}
