// Part B. Student page (#/student/:id): the student's summary and settings, every find-it attempt as a trail,
// and find times per part as inline-SVG sparklines. Guest works too.
import { useEffect, useState } from 'react'
import { href } from '../contract/routes.ts'
import { GUEST_ID, type Assignment, type ClassRoom, type Figure, type Session, type Student } from '../contract/types.ts'
import { getStudent, listAssignments, listClasses, listFigures, listSessions } from '../data/db.ts'
import { Avatar, Icon, Mark } from './Shell.tsx'
import { ago, backLink, primaryBtn, regionLabel, stamp, tag } from './ui.ts'

const FRESH = 5 * 60_000

interface Data {
  student?: Student
  classes: ClassRoom[]
  figures: Figure[]
  sessions: Session[]
  assignments: Assignment[]
  now: number
}

export default function StudentPage({ studentId }: { studentId: string }) {
  const [data, setData] = useState<Data>()

  useEffect(() => {
    let live = true
    Promise.all([getStudent(studentId), listClasses(), listFigures(), listSessions({ studentId }), listAssignments()]).then(
      ([student, classes, figures, sessions, assignments]) => live && setData({ student, classes, figures, sessions, assignments, now: Date.now() }),
    )
    return () => {
      live = false
    }
  }, [studentId])

  const back = (
    <a href={href.home()} className={backLink}>
      <Icon name="back" />
      Dashboard
    </a>
  )

  const s = data?.student
  if (data && !s) {
    return (
      <main className="page pb-20 pt-8">
        {back}
        <h1 tabIndex={-1} className="mt-7 text-3xl">
          Student not found
        </h1>
        <p className="mt-2 text-muted">They may have been removed when the classroom was reset.</p>
      </main>
    )
  }

  const sessions = data?.sessions ?? []
  const figures = data?.figures ?? []
  const now = data?.now ?? 0
  const cls = data?.classes.find((c) => c.id === s?.classId)
  const assignment = data?.assignments.find((a) => a.classId === s?.classId)
  const assigned = assignment && figures.find((f) => f.id === assignment.figureId)
  const figTitle = (id: string) => figures.find((f) => f.id === id)?.title ?? id
  // One row per figure + target, oldest attempt first.
  const byPart = new Map<string, Session[]>()
  for (const x of [...sessions].reverse()) {
    const k = `${x.figureId}/${x.targetRegionId}`
    byPart.set(k, [...(byPart.get(k) ?? []), x])
  }
  const best = sessions.length ? Math.min(...sessions.map((x) => x.seconds)) : undefined
  const firstName = s?.name.split(' ')[0] ?? ''

  return (
    <main className="page pb-20 pt-8">
      {back}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-5 border-b border-line pb-7">
        {s && <Avatar name={s.name} large />}
        <div className="min-w-48 flex-1">
          <h1 tabIndex={-1} className="text-[30px] leading-[1.14] tracking-[-0.035em]">
            {s?.name ?? ' '}
          </h1>
          <p className="mt-1.5 text-muted">{s?.id === GUEST_ID ? 'Anyone exploring without a profile' : cls?.name}</p>
        </div>
        {s && assignment && assigned && (
          <a className={primaryBtn} href={href.explore(assignment.figureId, s.id)}>
            Launch {assigned.title}
          </a>
        )}
      </div>

      {data && (
        <>
          <dl className="grid grid-cols-3 border-b border-line py-6">
            {[
              ['Find-it attempts', String(sessions.length)],
              ['Diagrams', String(new Set(sessions.map((x) => x.figureId)).size)],
              ['Best find time', best === undefined ? 'None yet' : `${best} s`],
            ].map(([label, value], i) => (
              <div key={label} className={`flex flex-col-reverse justify-end gap-1.5 border-line ${i ? 'border-l pl-5' : ''} ${i < 2 ? 'pr-5' : ''}`}>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="text-2xl font-semibold tracking-[-0.035em] tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          {s && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line py-4">
              <h2 className="text-sm font-semibold tracking-normal text-muted">Explorer settings</h2>
              <ul className="flex flex-wrap gap-2">
                <li className={tag}>Sensitivity {s.prefs.sensitivity.toFixed(1)}×</li>
                <li className={tag}>Speech rate {s.prefs.speechRate.toFixed(2)}×</li>
                <li className={tag}>Screen reader {s.prefs.screenReaderMode ? 'on' : 'off'}</li>
                <li className={tag}>Quiet mode {s.prefs.quiet ? 'on' : 'off'}</li>
              </ul>
            </div>
          )}

          <section aria-labelledby="h-activity" className="pt-9">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="h-activity" className="text-xl">
                  Activity
                </h2>
                <p className="mt-1 text-sm text-muted">Every find-it challenge, newest first.</p>
              </div>
              <span className="text-sm text-muted tabular-nums">{sessions.length === 1 ? '1 attempt' : `${sessions.length} attempts`}</span>
            </div>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center border-t border-line px-5 pt-14 pb-16 text-center">
                <Mark className="mb-4 text-accent" />
                <h3 className="text-lg">No find-it attempts yet</h3>
                <p className="mt-2 max-w-sm text-muted">When {firstName} finishes a find-it challenge, it appears here.</p>
              </div>
            ) : (
              <ol className="trail border-t border-line">
                {sessions.map((x) => (
                  <li key={x.id} className={`grid min-h-20 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-line ${now - Date.parse(x.at) < FRESH ? 'fresh-row' : ''}`}>
                    <span className="trail-mark" aria-hidden="true" />
                    <div className="min-w-0 py-3">
                      <p className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="font-semibold tracking-[-0.01em]">{regionLabel(figures, x.figureId, x.targetRegionId)}</span>
                        <span className="text-sm text-muted">{figTitle(x.figureId)}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted tabular-nums">{stamp(x.at, now)}</p>
                    </div>
                    <p className="pr-2 text-right">
                      <span className="font-semibold tabular-nums">{x.seconds} s</span>
                      <span className="block text-sm text-muted">to find</span>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {byPart.size > 0 && (
            <section aria-labelledby="h-times" className="pt-12">
              <h2 id="h-times" className="text-xl">
                Find times by part
              </h2>
              <p className="mt-1 mb-3 text-sm text-muted">Oldest to newest. Lower is faster.</p>
              <ul className="border-t border-line">
                {[...byPart.values()].map((list) => {
                  const last = list[list.length - 1]
                  return (
                    <li key={`${last.figureId}/${last.targetRegionId}`} className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line py-4">
                      <div className="min-w-56 flex-1">
                        <p className="font-semibold tracking-[-0.01em]">{regionLabel(figures, last.figureId, last.targetRegionId)}</p>
                        <p className="text-sm text-muted">
                          {figTitle(last.figureId)} · {list.length} {list.length === 1 ? 'try' : 'tries'} · last {ago(last.at, now)}
                        </p>
                      </div>
                      <Sparkline values={list.map((x) => x.seconds)} />
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  )
}

// 1.5 px accent line, a ringed dot on the latest value, latest seconds labelled. No chart library.
function Sparkline({ values }: { values: number[] }) {
  const W = 160
  const H = 40
  const P = 5
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
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" className="stroke-accent" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="3.5" className="fill-accent-soft stroke-accent-strong" strokeWidth="2" />
      </svg>
      <span aria-hidden="true" className="w-14 text-right font-semibold tabular-nums">
        {values[values.length - 1]} s
      </span>
    </div>
  )
}
