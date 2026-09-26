// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useRef } from 'react'
import { href } from '../contract/routes.ts'
import { useExplorer } from './useExplorer.ts'

export default function Explore(props: { figureId: string; studentId: string; target?: string }) {
  const stageRef = useRef<HTMLElement>(null)
  const { figure, phase, cursor, currentRegion, loadError, lockError } = useExplorer({
    figureId: props.figureId,
    studentId: props.studentId,
    stageRef,
  })

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
                <path
                  d={`M ${currentRegion.labelAnchor[0]} ${currentRegion.labelAnchor[1]} L ${figure.width / 2} ${figure.height * 0.84}`}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  strokeDasharray="8 5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={currentRegion.labelAnchor[0]}
                  cy={currentRegion.labelAnchor[1]}
                  r="5"
                  fill="#60a5fa"
                  stroke="white"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
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

      {figure && currentRegion && (phase === 'exploring' || phase === 'paused') && (
        <p className="pointer-events-none absolute bottom-[12%] left-1/2 z-10 max-w-[80vw] -translate-x-1/2 text-center font-serif text-4xl md:text-6xl">
          <span className="inline-block border border-[#60a5fa] bg-stage px-3 py-1">
            {currentRegion.label}
          </span>
        </p>
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
