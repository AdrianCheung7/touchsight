// Part B placeholder — replaced in its plan step (docs/PLAN-B-teacher.md).
import { href } from '../contract/routes.ts'

export default function Edit({ figureId }: { figureId: string }) {
  return (
    <main className="mx-auto max-w-[1100px] p-8">
      <h1 className="text-3xl">Edit {figureId}</h1>
      <a className="mt-6 inline-block text-accent underline" href={href.home()}>
        Home
      </a>
    </main>
  )
}
