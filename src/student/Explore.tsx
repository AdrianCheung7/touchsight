// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useRef } from 'react'
import { href } from '../contract/routes.ts'
import { animalCellCallouts } from './figureAnnotations.ts'
import { formatElapsed } from './findIt.ts'
import { useExplorer } from './useExplorer.ts'

export default function Explore(props: { figureId: string; studentId: string; target?: string }) {
  const stageRef = useRef<HTMLElement>(null)
  const figureAreaRef = useRef<HTMLDivElement>(null)
  const { figure, phase, cursor, currentRegion, challenge, challengeElapsed, loadError, lockError } = useExplorer({
    figureId: props.figureId,
    studentId: props.studentId,
    target: props.target,
    stageRef,
    figureAreaRef,
  })
  const callout = figure?.id === 'animal-cell' && currentRegion
    ? animalCellCallouts[currentRegion.id]
    : undefined
  const challengeTarget = figure?.regions.find(({ id }) => id === challenge?.targetRegionId)

  return (
    <main
      ref={stageRef}
      tabIndex={0}
      aria-label={figure ? `${figure.title} explorer` : 'Diagram explorer'}
      className="relative isolate h-dvh w-screen overflow-hidden bg-stage font-sans text-white"
    >
      {figure && (
        <div ref={figureAreaRef} className="pointer-events-none absolute inset-x-0 top-0 bottom-20">
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
            {currentRegion && (phase === 'exploring' || phase === 'keyboard' || phase === 'paused') && (
              <>
                <polygon
                  points={currentRegion.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="var(--color-accent)"
                  fillOpacity="0.25"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                {callout?.extraAreas?.map((area, index) => (
                  <polygon
                    key={index}
                    points={area.map(([x, y]) => `${x},${y}`).join(' ')}
                    fill="var(--color-accent)"
                    fillOpacity="0.25"
                    stroke="#60a5fa"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
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
            {(phase === 'exploring' || phase === 'keyboard' || phase === 'paused') && (
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
        </div>
      )}

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 text-sm">
        <a className="underline-offset-4 hover:underline" href={href.home()}>
          Back to home
        </a>
        {figure && <span className="text-white/80">{figure.title}</span>}
      </header>

      {challenge && (
        <div className="pointer-events-none absolute inset-x-0 top-12 z-40 text-center text-white" aria-live="off">
          <p className="font-mono text-sm uppercase tracking-widest text-white/70">
            {challenge.status === 'paused' ? 'Paused · find the' : challenge.status === 'found' ? 'Found' : 'Find the'} {challengeTarget?.label ?? challenge.targetRegionId}
          </p>
          <p
            role="timer"
            aria-live="off"
            aria-label={`Elapsed time ${formatElapsed(challengeElapsed)}`}
            className={`font-mono text-[clamp(3.25rem,11vw,6rem)] leading-none tabular-nums ${challenge.status === 'found' ? 'text-accent find-it-found' : ''}`}
          >
            {formatElapsed(challengeElapsed)}
          </p>
        </div>
      )}

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

      {(phase === 'keyboard' || phase === 'exploring') && (
        <p role="status" className="absolute inset-x-4 bottom-3 z-10 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded bg-black/75 px-4 py-2 text-center text-xs text-white">
          <span className="block">{phase === 'keyboard' ? 'Arrows move · Tab parts · F find-it · Space explain · W location · Q tone off · Esc pause · ? help' : 'Trackpad moves · F find-it · ? controls'}</span>
          <span className="block">Sound: left/right stereo · low bottom, high top · soft thunk at region edges</span>
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
            <p className="mt-4 text-sm text-white/75">Move on the trackpad. If it is unavailable, use arrow keys and Tab. Press ? for help.</p>
            {lockError && <p role="alert" className="mt-4 text-sm">{lockError}</p>}
          </div>
        </section>
      )}
    </main>
  )
}
