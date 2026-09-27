// Part B. Dashboard (#/): the diagram library, then every class's students and Guest. Activity lives on each
// student's own page, never in a shared feed. Reloads every time the route returns here.
import { Fragment, useEffect, useRef, useState } from 'react'
import { href } from '../contract/routes.ts'
import { GUEST_ID, type Assignment, type ClassRoom, type Figure, type Session, type Student } from '../contract/types.ts'
import { addStudent, listAssignments, listClasses, listFigures, listSessions, listStudents } from '../data/db.ts'
import { Avatar, Icon } from './Shell.tsx'
import { ago, dialogBox, field, iconBtn, primaryBtn, secondaryBtn, tag, textBtn, weekday } from './ui.ts'

const HERO = 'animal-cell'
const FRESH = 5 * 60_000

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
  const [version, setVersion] = useState(0) // bumped after adding a student, to reload

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
  }, [version])

  return (
    <main className="page pb-20 pt-10">
      <h1 tabIndex={-1} className="text-[34px] leading-[1.14] tracking-[-0.035em]">
        Dashboard
      </h1>
      <p className="mt-2 text-muted">Prepare a diagram, then open a student to follow their find-it progress.</p>
      {data && (
        <div className="mt-10 grid gap-x-14 gap-y-14 xl:grid-cols-2">
          <Library figures={data.figures} />
          <Roster data={data} onAdded={() => setVersion((v) => v + 1)} />
        </div>
      )}
    </main>
  )
}

function SectionHead({ id, title, note, count }: { id: string; title: string; note: string; count: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <div>
        <h2 id={id} className="text-xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      <span className="text-sm text-muted tabular-nums">{count}</span>
    </div>
  )
}

function Library({ figures }: { figures: Figure[] }) {
  return (
    <section aria-labelledby="h-diagrams">
      <SectionHead id="h-diagrams" title="Diagrams" note="Explore one as a student would, or edit its parts." count={`${figures.length} diagrams`} />
      <ul className="border-t border-line">
        {figures.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-4">
            <img src={f.image} alt="" className="h-12 w-16 shrink-0 rounded-md border border-line bg-white object-contain p-0.5" />
            <div className="min-w-44 flex-1">
              <h3 className="truncate text-base tracking-[-0.01em]">{f.title}</h3>
              <p className="text-sm text-muted">
                {[f.subject, f.gradeBand, f.regions.length === 1 ? '1 part' : `${f.regions.length} parts`]
                  .filter(Boolean)
                  .map((t, i) => (
                    <Fragment key={t}>
                      {i > 0 && ' · '}
                      <span className="whitespace-nowrap">{t}</span>
                    </Fragment>
                  ))}
              </p>
            </div>
            <div className="flex gap-2">
              <a className={primaryBtn} href={href.explore(f.id)} aria-label={`Explore ${f.title}`}>
                Explore
              </a>
              <a className={secondaryBtn} href={href.edit(f.id)} aria-label={`Edit ${f.title}`}>
                Edit
              </a>
            </div>
          </li>
        ))}
        <li>
          <a href={href.upload()} className="group flex items-center gap-4 border-b border-line py-4 hover:bg-surface/85">
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-dashed border-accent/45 text-accent">
              <Icon name="upload" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold tracking-[-0.01em]">Upload a diagram</span>
              <span className="block text-sm text-muted">PNG or JPG, up to 10 MB. You trace its parts next.</span>
            </span>
            <Icon name="chevron" className="mr-2 text-muted group-hover:text-accent-strong" />
          </a>
        </li>
      </ul>
    </section>
  )
}

function Roster({ data, onAdded }: { data: Data; onAdded: () => void }) {
  const { classes, students, assignments, figures, sessions, now } = data
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [said, setSaid] = useState('')

  const query = q.trim().toLocaleLowerCase()
  const matches = (name: string) => !query || name.toLocaleLowerCase().includes(query)
  const shown = students.filter((s) => matches(s.name)).sort((a, b) => a.name.localeCompare(b.name))
  const guest = matches('Guest')
  const lastOf = (id: string) => sessions.find((x) => x.studentId === id) // sessions come newest first

  return (
    <section aria-labelledby="h-students">
      <SectionHead
        id="h-students"
        title="Students"
        note="Open a student to see their attempts and settings."
        count={query ? `${shown.length} of ${students.length} students` : `${students.length} students`}
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <label className="flex min-h-10.5 min-w-52 flex-1 items-center gap-2.5 rounded-lg border border-field bg-surface px-3 has-[input:focus-visible]:border-accent has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus">
          <Icon name="search" className="text-muted" />
          <span className="sr-only">Find a student</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a student"
            className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
          />
          {q && (
            <button type="button" className={`${iconBtn} -mr-1.5 size-7`} onClick={() => setQ('')} aria-label="Clear search">
              <Icon name="close" />
            </button>
          )}
        </label>
        <button type="button" className={secondaryBtn} onClick={() => setAdding(true)}>
          <Icon name="plus" />
          Add student
        </button>
      </div>

      {/* Visitors first: a diagram opened with Explore lands here, so the newest try is in view on return. */}
      {guest && (
        <Group id="h-visitors" title="Visitors" aside={<span className="text-sm text-muted">Anyone exploring without a profile</span>}>
          <Row student={{ id: GUEST_ID, name: 'Guest' }} last={lastOf(GUEST_ID)} now={now} />
        </Group>
      )}

      {classes.map((c) => {
        const list = shown.filter((s) => s.classId === c.id)
        if (list.length === 0) return null
        const a = assignments.find((x) => x.classId === c.id)
        const fig = a && figures.find((f) => f.id === a.figureId)
        return (
          <Group key={c.id} id={`h-class-${c.id}`} title={c.name} aside={a && fig && <span className={tag}>{fig.title} · due {weekday(a.due)}</span>}>
            {list.map((s) => (
              <Row key={s.id} student={s} last={lastOf(s.id)} now={now}>
                {a && fig && (
                  <a className={`${secondaryBtn} min-h-9 px-3 text-sm`} href={href.explore(a.figureId, s.id)} aria-label={`Launch ${fig.title} as ${s.name}`}>
                    Launch
                  </a>
                )}
              </Row>
            ))}
          </Group>
        )
      })}

      {shown.length === 0 && !guest && (
        <div className="px-5 py-12 text-center">
          <h3 className="text-lg">No students found</h3>
          <p className="mt-2 text-muted">Try a different name, or clear the search.</p>
          <button type="button" className={`${textBtn} mt-3`} onClick={() => setQ('')}>
            Clear search
          </button>
        </div>
      )}

      <p role="status" className="sr-only">
        {query ? `${shown.length + Number(guest)} found` : said}
      </p>
      {adding && (
        <AddStudent
          classes={classes}
          onClose={() => setAdding(false)}
          onAdded={(s, cls) => {
            setQ('')
            setSaid(`${s.name} was added to ${cls}.`)
            onAdded()
          }}
        />
      )}
    </section>
  )
}

function Group({ id, title, aside, children }: { id: string; title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
        <h3 id={id} className="text-base tracking-[-0.01em]">
          {title}
        </h3>
        {aside}
      </div>
      <ul className="border-t border-line">{children}</ul>
    </section>
  )
}

function Row({ student, last, now, children }: { student: Pick<Student, 'id' | 'name'>; last?: Session; now: number; children?: React.ReactNode }) {
  const fresh = !!last && now - Date.parse(last.at) < FRESH
  return (
    <li className={`flex items-center gap-3 border-b border-line pr-1 ${fresh ? 'fresh-row' : ''}`}>
      <a href={href.student(student.id)} className="group grid min-h-[4.5rem] flex-1 grid-cols-[2.625rem_minmax(0,1fr)_auto] items-center gap-4 rounded-md px-2 hover:bg-surface/85">
        <Avatar name={student.name} />
        <span className="min-w-0">
          <span className="block truncate font-semibold tracking-[-0.01em]">{student.name}</span>
          <span className={`block text-sm ${fresh ? 'font-semibold text-accent-strong' : 'text-muted'}`}>
            {last ? `Active ${ago(last.at, now)}` : 'No attempts yet'}
          </span>
        </span>
        <Icon name="chevron" className="text-muted group-hover:text-accent-strong" />
      </a>
      {children}
    </li>
  )
}

function AddStudent({ classes, onClose, onAdded }: { classes: ClassRoom[]; onClose: () => void; onAdded: (s: Student, className: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [classId, setClassId] = useState(classes[0]?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal()
    nameRef.current?.focus()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      const s = await addStudent(name, classId)
      onAdded(s, classes.find((c) => c.id === classId)?.name ?? 'the class')
      ref.current?.close()
    } catch {
      setBusy(false)
      setError("The student couldn't be saved on this computer. The browser's storage may be full.")
    }
  }

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="add-h" className={`${dialogBox} w-[min(440px,calc(100vw-32px))]`}>
      <form onSubmit={submit} className="flex flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="add-h" className="text-xl">
            Add a student
          </h2>
          <button type="button" className={`${iconBtn} -mr-2`} onClick={() => ref.current?.close()} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <p className="mt-2 text-muted">They join the class you choose and can start its diagram straight away.</p>
        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Student name</span>
          <input ref={nameRef} required maxLength={80} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Class</span>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className={field}>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-accent bg-accent-soft px-3 py-2">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className={secondaryBtn} onClick={() => ref.current?.close()}>
            Cancel
          </button>
          <button type="submit" className={primaryBtn} disabled={busy || !name.trim()}>
            Add student
          </button>
        </div>
      </form>
    </dialog>
  )
}
