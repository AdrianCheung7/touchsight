// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1). Replace this placeholder in step A3.
import { href } from '../contract/routes.ts'

export default function Explore(props: { figureId: string; studentId: string; target?: string }) {
  return (
    <main className="min-h-screen bg-stage p-8 text-white">
      <h1 className="text-3xl">Explore</h1>
      <p className="mt-2 font-mono text-sm">
        figure={props.figureId} student={props.studentId} target={props.target ?? '—'}
      </p>
      <a className="mt-6 inline-block underline" href={href.home()}>
        Back
      </a>
    </main>
  )
}
