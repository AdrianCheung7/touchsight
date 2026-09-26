// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useRef } from 'react'
import { href } from '../contract/routes.ts'
import { animalCellCallouts } from './figureAnnotations.ts'
import { useExplorer } from './useExplorer.ts'

export default function Explore(props: { figureId: string; studentId: string; target?: string }) {
  const stageRef = useRef<HTMLElement>(null)
  const { figure, phase, cursor, currentRegion, loadError, lockError } = useExplorer({
    figureId: props.figureId,
    studentId: props.studentId,
    stageRef,
  })
  const callout = figure?.id === 'animal-cell' && currentRegion
    ? animalCellCallouts[currentRegion.id]
    : undefined

  return (
    <main
      ref={stageRef}
      tabIndex={0}
      aria-label={figure ? `${figure.title} explorer` : 'Diagram explorer'}
      className="relative isolate h-dvh w-screen overflow-hidden bg-stage font-sans text-white"
    >
      {figure && (
        <>
          <img
            src={figure.image}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain opacity-[0.35]"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${figure.width} ${figure.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {currentRegion && (phase === 'exploring' || phase === 'paused') && (
              <>
                <polygon
                  points={currentRegion.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="var(--color-accent)"
                  fillOpacity="0.25"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                {callout?.leaders.map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="#60a5fa"
                    strokeOpacity="0.85"
                    strokeWidth="4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {callout && (
                  <rect
                    x={callout.label[0]}
                    y={callout.label[1]}
                    width={callout.label[2]}
                    height={callout.label[3]}
                    rx="4"
                    fill="#60a5fa"
                    fillOpacity="0.12"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </>
            )}
            {(phase === 'exploring' || phase === 'paused') && (
              <circle
                cx={cursor[0]}
                cy={cursor[1]}
                r="6"
                fill="var(--color-accent)"
                stroke="white"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 24px var(--color-accent))' }}
              />
            )}
          </svg>
        </>
      )}

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 text-sm">
        <a className="underline-offset-4 hover:underline" href={href.home()}>
          Back to home
        </a>
        {figure && <span className="text-white/80">{figure.title}</span>}
      </header>

      {!figure && !loadError && (
        <p role="status" className="absolute inset-0 grid place-items-center text-white/80">
          Loading diagram…
        </p>
      )}

      {loadError && (
        <section className="absolute inset-0 z-20 grid place-items-center px-6 text-center">
          <div>
            <h1 className="font-serif text-4xl">Diagram unavailable</h1>
            <p className="mt-4 text-white/80">{loadError}</p>
            <a className="mt-6 inline-block underline" href={href.home()}>
              Back to home
            </a>
          </div>
        </section>
      )}

      {figure && (phase === 'idle' || phase === 'paused') && (
        <section className="absolute inset-0 z-20 grid place-items-center px-6 text-center" aria-labelledby="explore-title">
          <div>
            <h1 id="explore-title" className="font-serif text-5xl md:text-6xl">
              {figure.title}
            </h1>
            <p className="mt-8 text-lg">
              {phase === 'paused' ? (
                <>Paused. Press <kbd className="mx-1 rounded border border-white/30 px-2 py-1 font-mono text-base">Enter</kbd> to continue.</>
              ) : (
                <>Press <kbd className="mx-1 rounded border border-white/30 px-2 py-1 font-mono text-base">Enter</kbd> to start exploring.</>
              )}
            </p>
            <p className="mt-4 text-sm text-white/75">Move on the trackpad. Press ? for help.</p>
            {lockError && <p role="alert" className="mt-4 text-sm">{lockError}</p>}
          </div>
        </section>
      )}
    </main>
  )
}
