// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useRef } from 'react'
import { href } from '../contract/routes.ts'
import { animalCellCallouts } from './figureAnnotations.ts'
import './explorer.css'
import { formatElapsed } from './findIt.ts'
import { useExplorer } from './useExplorer.ts'

export default function Explore(props: { figureId: string; studentId: string; target?: string }) {
  const stageRef = useRef<HTMLElement>(null)
  const figureAreaRef = useRef<HTMLDivElement>(null)
  const { figure, phase, cursor, currentRegion, challenge, challengeElapsed, question, submitQuestion, updateQuestion, finishSpeech, useQuestionInput, closeQuestion, loadError, lockError } = useExplorer({
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
      tabIndex={question ? -1 : 0}
      aria-label={figure ? `${figure.title} explorer` : 'Diagram explorer'}
      className="relative isolate h-dvh w-screen overflow-hidden bg-stage font-sans text-white"
    >
      {figure && (
        <div ref={figureAreaRef} inert={question !== null} className="pointer-events-none absolute inset-x-0 top-0 bottom-20">
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
              <g key={`region-${currentRegion.id}`} className="region-highlight-enter">
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
              </g>
            )}
            {(phase === 'exploring' || phase === 'keyboard' || phase === 'paused') && (
              <circle
                key={`cursor-${currentRegion?.id ?? 'background'}`}
                cx={cursor[0]}
                cy={cursor[1]}
                r="6"
                fill="var(--color-accent)"
                stroke="white"
                strokeWidth="2"
                className={currentRegion ? 'cursor-glow cursor-region-enter' : 'cursor-glow'}
              />
            )}
          </svg>
        </div>
      )}

      <header inert={phase === 'orienting' || question !== null} className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 text-sm">
        <a className="underline-offset-4 hover:underline" href={href.home()}>
          Back to home
        </a>
        {figure && <span className="text-white/80">{figure.title}</span>}
      </header>

      {challenge && challenge.status !== 'orienting' && (
        <div inert={question !== null} className="pointer-events-none absolute inset-x-0 top-12 z-40 text-center text-white" aria-live="off">
          <p className="font-mono text-sm uppercase tracking-widest text-white/70">
            {challenge.status === 'paused' ? 'Paused · find the' : challenge.status === 'found' ? 'Found' : 'Find the'} {challengeTarget?.label ?? challenge.targetRegionId}
          </p>
          <p
            role="timer"
            aria-live="off"
            aria-label={`Elapsed time ${formatElapsed(challengeElapsed)}`}
            className={`font-mono text-[clamp(3.25rem,11vw,6rem)] leading-none tabular-nums ${challenge.status === 'found' ? 'text-accent explorer-found-pop' : ''}`}
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

      {phase === 'orienting' && (
        <div aria-hidden="true" className="absolute inset-0 z-[100] cursor-none bg-black">
          <div className="absolute inset-x-6 top-16 text-center text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">Listen closely</p>
            <h1 className="mt-5 font-serif text-3xl md:text-5xl">
              Find the {challengeTarget?.label ?? challenge?.targetRegionId}
            </h1>
            <p className="mt-3 text-sm text-white/65">Listen for the location cue, then follow the countdown.</p>
          </div>
        </div>
      )}

      {(phase === 'keyboard' || phase === 'exploring') && (
        <p role="status" className="absolute inset-x-4 bottom-3 z-10 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded bg-black/75 px-4 py-2 text-center text-xs text-white">
          <span className="block">{phase === 'keyboard' ? 'Arrows move · Tab parts · F find-it · A ask · Space explain · W location · Q tone off · Esc pause · ? help' : 'Trackpad moves · F find-it · A ask · ? controls'}</span>
          <span className="block">Sound: left/right stereo · low bottom, high top · soft thunk at region edges</span>
        </p>
      )}

      {figure && (phase === 'idle' || phase === 'paused') && (
        <section className="absolute inset-0 z-20 grid place-items-center px-6 py-24 text-center" aria-labelledby="explore-title">
          <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/15 bg-stage/95 px-8 py-10 md:px-12 md:py-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/55">
              {phase === 'paused' ? 'Paused' : 'Student explorer'}
            </p>
            <h1 id="explore-title" className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              {figure.title}
            </h1>
            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-lg">
              {phase === 'paused' ? (
                <>Press <kbd className="rounded border border-white/30 px-2.5 py-1.5 font-mono text-base">Enter</kbd> to continue.</>
              ) : (
                <>Press <kbd className="rounded border border-white/30 px-2.5 py-1.5 font-mono text-base">Enter</kbd> to start exploring.</>
              )}
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70">Move on the trackpad. If it is unavailable, use arrow keys and Tab. Press ? for help.</p>
            {lockError && <p role="alert" className="mt-4 text-sm">{lockError}</p>}
          </div>
        </section>
      )}

      {question && (
        <>
          <div aria-hidden="true" className="absolute inset-0 z-40 bg-black/50" />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-title"
            className="absolute inset-x-0 bottom-0 z-50 mx-auto max-h-[82dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-paper px-6 pb-8 pt-5 text-ink shadow-2xl sm:bottom-6 sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">TouchSight · ask</p>
                <h2 id="question-title" className="mt-2 font-serif text-3xl">
                  {question.status === 'answer' ? 'Here’s what I found' : currentRegion ? `Ask about ${currentRegion.label}` : 'Ask about this diagram'}
                </h2>
              </div>
              <button
                type="button"
                autoFocus={question.status !== 'input'}
                onClick={closeQuestion}
                className="rounded border border-line px-3 py-2 text-sm hover:bg-black/5"
              >
                Close <span className="text-muted">· Esc pauses</span>
              </button>
            </div>

            {question.status === 'loading' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p role="status" aria-live="polite" className="text-base">Preparing speech recognition · {question.progress}%</p>
                <p className="mt-2 text-sm text-muted">First use downloads about 52 MB of model files and caches them in this browser. Audio stays on this device.</p>
                <button type="button" onClick={useQuestionInput} className="mt-4 rounded border border-line px-4 py-2 text-sm hover:bg-black/5">
                  Type instead
                </button>
              </div>
            )}
            {question.status === 'microphone' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p role="status" aria-live="polite" className="text-base">Waiting for microphone access…</p>
                <button type="button" onClick={useQuestionInput} className="mt-4 rounded border border-line px-4 py-2 text-sm hover:bg-black/5">
                  Type instead
                </button>
              </div>
            )}
            {question.status === 'recording' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p role="status" aria-live="polite" className="text-base">Listening. Speak your question, then finish when you’re done.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={finishSpeech} className="rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white">
                    Finish speaking
                  </button>
                  <button type="button" onClick={useQuestionInput} className="rounded border border-line px-4 py-2 text-sm hover:bg-black/5">
                    Type instead
                  </button>
                </div>
              </div>
            )}
            {question.status === 'transcribing' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p role="status" aria-live="polite" className="text-base">Transcribing on this device…</p>
                <button type="button" onClick={useQuestionInput} className="mt-4 rounded border border-line px-4 py-2 text-sm hover:bg-black/5">
                  Type instead
                </button>
              </div>
            )}
            {question.status === 'input' && (
              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitQuestion(question.value)
                }}
              >
                <label htmlFor="question-input" className="mb-2 block text-sm font-medium">Your question</label>
                <input
                  id="question-input"
                  autoFocus
                  value={question.value}
                  onChange={(event) => updateQuestion(event.currentTarget.value)}
                  placeholder="What does it do?"
                  className="w-full rounded-lg border border-line bg-white px-4 py-3 text-base outline-offset-2"
                />
                <p className="mt-2 text-sm text-muted">{question.error ?? 'Type your question below. Press Enter to ask.'}</p>
                <button type="submit" disabled={!question.value.trim()} className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-40">
                  Ask question
                </button>
              </form>
            )}
            {question.status === 'thinking' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p className="text-sm text-muted">Thinking…</p>
                <p className="mt-2">“{question.question}”</p>
              </div>
            )}
            {question.status === 'answer' && (
              <div className="mt-6 rounded-lg border border-line bg-white px-4 py-4">
                <p className="text-sm text-muted">“{question.question}”</p>
                <p className="mt-3 text-lg leading-relaxed">{question.answer}</p>
              </div>
            )}
            <p className="mt-5 text-xs text-muted">The diagram stays still while you ask. Close to return, or press Escape to pause.</p>
          </section>
        </>
      )}
    </main>
  )
}
