// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Figure, Point, Region, StudentPrefs } from '../contract/types.ts'
import { getFigure, getStudent, recordSession, saveStudentPrefs } from '../data/db.ts'
import { askQuestion } from '../data/ai.ts'
import { announce as announceLive, chime, countdownClick, dispose, playSpatialCue, regionThunk, setPosition, startCue, sweep, testSound, thunk } from './audio.ts'
import { elapsedMs as challengeElapsedMs, pauseChallenge, pickTarget, resumeChallenge, type Challenge } from './findIt.ts'
import { adjacentRegion, centroid, clamp, hitTest, pointerToFigurePoint, whereAmI } from './geometry.ts'
import { listenOnce } from './speechRecognition.ts'

type Phase = 'loading' | 'idle' | 'orienting' | 'exploring' | 'keyboard' | 'asking' | 'paused'

export type QuestionState =
  | { status: 'listening' }
  | { status: 'input'; value: string }
  | { status: 'thinking'; question: string }
  | { status: 'answer'; question: string; answer: string }

// ponytail: 1.0 is the default; tune on the demo laptop's trackpad.
const SENSITIVITY = 1.0
const KEY_STEP = 18

function announce(text: string, prefs: StudentPrefs) {
  return announceLive(text, { screenReader: prefs.screenReaderMode, rate: prefs.speechRate })
}

export function useExplorer({
  figureId,
  studentId,
  target,
  stageRef,
  figureAreaRef,
}: {
  figureId: string
  studentId: string
  target?: string
  stageRef: RefObject<HTMLElement | null>
  figureAreaRef: RefObject<HTMLDivElement | null>
}) {
  const [figure, setFigure] = useState<Figure | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [cursor, setCursor] = useState<Point>([0, 0])
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengeElapsed, setChallengeElapsed] = useState(0)
  const [question, setQuestion] = useState<QuestionState | null>(null)
  const [loadError, setLoadError] = useState('')
  const [lockError, setLockError] = useState('')
  const figureRef = useRef<Figure | null>(null)
  const prefsRef = useRef<StudentPrefs>({ sensitivity: SENSITIVITY, speechRate: 1.05, screenReaderMode: false, quiet: false })
  const cursorRef = useRef<Point>([0, 0])
  const regionRef = useRef<Region | null>(null)
  const phaseRef = useRef<Phase>('loading')
  const lockPending = useRef(false)
  const started = useRef(false)
  const challengeRef = useRef<Challenge | null>(null)
  const submitQuestionRef = useRef<(value: string) => void>(() => {})
  const updateQuestionRef = useRef<(value: string) => void>(() => {})
  const closeQuestionRef = useRef<() => void>(() => {})

  useEffect(() => {
    let active = true
    let challengeInterval: number | undefined
    let challengeRun = 0
    let questionRun = 0
    let questionController: AbortController | undefined
    let questionReturnPhase: Phase = 'keyboard'
    let questionFigure: Figure | null = null
    let questionRegion: Region | null = null
    const stageElement = stageRef.current
    figureRef.current = null
    phaseRef.current = 'loading'

    Promise.all([getFigure(figureId), getStudent(studentId)]).then(([loadedFigure, student]) => {
      if (!active) return
      if (!loadedFigure || !student) throw new Error('This diagram or student profile could not be found.')
      const prefs = {
        ...student.prefs,
        sensitivity: Number.isFinite(student.prefs.sensitivity) && student.prefs.sensitivity >= 0
          ? student.prefs.sensitivity
          : SENSITIVITY,
      }
      const centre: Point = [loadedFigure.width / 2, loadedFigure.height / 2]
      prefsRef.current = prefs
      figureRef.current = loadedFigure
      cursorRef.current = centre
      regionRef.current = null
      started.current = false
      challengeRef.current = null
      setChallenge(null)
      setChallengeElapsed(0)
      setQuestion(null)
      phaseRef.current = 'idle'
      setFigure(loadedFigure)
      setCursor(centre)
      setCurrentRegion(null)
      setPhase('idle')
      announce(
        `${loadedFigure.title}. ${loadedFigure.regions.length} parts. Press Enter to start. Left and right pan the sound; low pitch is at the bottom and high pitch is at the top. A soft thunk marks region edges. Press F to start a find-it challenge, or A to ask a question. Tab selects the next part; Shift+Tab selects the previous. Press question mark for help.`,
        prefs,
      )
    }).catch((error: unknown) => {
      if (!active) return
      setLoadError(error instanceof Error ? error.message : 'This diagram could not be loaded.')
    })

    const stopChallengeClock = () => {
      if (challengeInterval !== undefined) window.clearInterval(challengeInterval)
      challengeInterval = undefined
    }

    const startChallengeClock = () => {
      stopChallengeClock()
      challengeInterval = window.setInterval(() => {
        const current = challengeRef.current
        if (current?.status === 'active') setChallengeElapsed(challengeElapsedMs(current, performance.now()))
      }, 1_000)
    }

    const pauseFindIt = (status: 'paused' | 'found' = 'paused') => {
      const current = challengeRef.current
      if (!current || current.status !== 'active') return null
      stopChallengeClock()
      const next = pauseChallenge(current, performance.now(), status)
      challengeRef.current = next
      setChallenge(next)
      setChallengeElapsed(next.elapsedMs)
      return next
    }

    const resumeFindIt = () => {
      const current = challengeRef.current
      if (current?.status !== 'paused') return
      const next = resumeChallenge(current, performance.now())
      challengeRef.current = next
      setChallenge(next)
      startChallengeClock()
    }

    const pauseExploration = () => {
      const pausedChallenge = pauseFindIt()
      phaseRef.current = 'paused'
      setPhase('paused')
      stageElement?.focus()
      announce(pausedChallenge ? 'Challenge paused. Press Enter to continue.' : 'Paused. Press Enter to continue.', prefsRef.current)
    }

    const closeQuestion = (pause = false) => {
      if (phaseRef.current !== 'asking') return
      questionRun++
      questionController?.abort()
      questionController = undefined
      if (document.pointerLockElement === stageElement) document.exitPointerLock()
      setQuestion(null)
      const nextPhase = pause ? 'paused' : questionReturnPhase
      phaseRef.current = nextPhase
      setPhase(nextPhase)
      if (nextPhase === 'keyboard') resumeFindIt()
      stageElement?.focus()
      announce(pause
        ? 'Question closed. Paused. Press Enter to continue.'
        : nextPhase === 'paused'
        ? 'Question closed. Press Enter to continue exploring.'
        : 'Question closed.', prefsRef.current)
    }

    const answerQuestion = async (value: string, run: number, currentFigure: Figure, region: Region | null) => {
      const questionText = value.trim()
      if (!questionText) return
      setQuestion({ status: 'thinking', question: questionText })
      if (document.pointerLockElement === stageElement) document.exitPointerLock()
      await announce('Thinking…', prefsRef.current)
      if (!active || run !== questionRun) return
      const answer = await askQuestion(currentFigure, region, questionText)
      if (!active || run !== questionRun) return
      setQuestion({ status: 'answer', question: questionText, answer })
      await announce(answer, prefsRef.current)
    }

    const startQuestion = (currentFigure: Figure) => {
      const run = ++questionRun
      questionFigure = currentFigure
      questionRegion = regionRef.current
      questionReturnPhase = document.pointerLockElement === stageElement ? 'paused' : 'keyboard'
      pauseFindIt()
      phaseRef.current = 'asking'
      setPhase('asking')
      setQuestion({ status: 'listening' })
      void (async () => {
        await announce('Ask your question.', prefsRef.current)
        if (!active || run !== questionRun) return
        const controller = new AbortController()
        questionController = controller
        const transcript = await listenOnce(controller.signal)
        if (questionController === controller) questionController = undefined
        if (!active || run !== questionRun) return
        if (!transcript) {
          setQuestion({ status: 'input', value: '' })
          if (document.pointerLockElement === stageElement) document.exitPointerLock()
          return
        }
        void answerQuestion(transcript, run, currentFigure, questionRegion)
      })()
    }

    submitQuestionRef.current = (value) => {
      if (!questionFigure || phaseRef.current !== 'asking') return
      void answerQuestion(value, questionRun, questionFigure, questionRegion)
    }
    updateQuestionRef.current = (value) => {
      setQuestion((current) => current?.status === 'input' ? { ...current, value } : current)
    }
    closeQuestionRef.current = closeQuestion

    const completeFindIt = (region: Region | null, currentFigure: Figure) => {
      if (!region || challengeRef.current?.status !== 'active' || challengeRef.current.targetRegionId !== region.id) return
      const found = pauseFindIt('found')
      if (!found) return
      chime()
      announce(`Found in ${Math.round(found.elapsedMs / 1_000)} seconds.`, prefsRef.current)
      void recordSession({
        studentId,
        figureId: currentFigure.id,
        targetRegionId: region.id,
        seconds: found.elapsedMs / 1_000,
      }).catch(() => announce('Could not save the find-it time.', prefsRef.current))
    }

    const startFindIt = async (currentFigure: Figure) => {
      const targetRegion = pickTarget(currentFigure.regions, currentFigure.id, target, regionRef.current?.id ?? null)
      if (!targetRegion) {
        announce('This diagram has no parts to find.', prefsRef.current)
        return
      }
      const run = ++challengeRun
      stopChallengeClock()
      const next: Challenge = {
        targetRegionId: targetRegion.id,
        status: 'orienting',
        startedAt: null,
        elapsedMs: 0,
      }
      challengeRef.current = next
      setChallenge(next)
      setChallengeElapsed(0)
      phaseRef.current = 'orienting'
      setPhase('orienting')

      await announce(`Find the ${targetRegion.label}.`, prefsRef.current)
      if (!active || run !== challengeRun) return
      const [x, y] = centroid(targetRegion.polygon)
      playSpatialCue(x, y, currentFigure.width, currentFigure.height)
      await new Promise((resolve) => window.setTimeout(resolve, 3_000))
      if (!active || run !== challengeRun) return

      for (let count = 5; count > 0; count--) {
        const tickAt = performance.now()
        countdownClick()
        void announce(String(count), prefsRef.current)
        await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 1_000 - (performance.now() - tickAt))))
        if (!active || run !== challengeRun) return
      }

      startCue()
      const startedAt = performance.now()
      const startedChallenge: Challenge = { ...next, status: 'active', startedAt }
      challengeRef.current = startedChallenge
      setChallenge(startedChallenge)
      const nextPhase = document.pointerLockElement === stageRef.current ? 'exploring' : 'keyboard'
      phaseRef.current = nextPhase
      setPhase(nextPhase)
      startChallengeClock()
      if (regionRef.current?.id === targetRegion.id) completeFindIt(regionRef.current, currentFigure)
    }

    const reportLockFailure = () => {
      if (!lockPending.current) return
      lockPending.current = false
      const message = 'Pointer control is unavailable. Keyboard mode: use arrow keys to move, Tab or Shift+Tab to choose a part, F for find-it, and A to ask a question. Press question mark for help.'
      resumeFindIt()
      phaseRef.current = 'keyboard'
      setPhase('keyboard')
      setLockError('')
      announce(message, prefsRef.current)
    }

    const onPointerLockChange = () => {
      const stage = stageRef.current
      if (document.pointerLockElement === stage && stage) {
        lockPending.current = false
        if (phaseRef.current !== 'exploring') {
          resumeFindIt()
          phaseRef.current = 'exploring'
          setPhase('exploring')
          announce('Exploring. Press question mark for help.', prefsRef.current)
        }
      } else if (phaseRef.current === 'exploring') {
        lockPending.current = false
        pauseExploration()
      }
    }

    const updateAt = (next: Point, currentFigure: Figure) => {
      const previous = cursorRef.current
      const previousRegion = regionRef.current
      const result = clamp(next, currentFigure.width, currentFigure.height, previous)
      cursorRef.current = result.p
      setCursor(result.p)

      const region = hitTest(currentFigure.regions, result.p, regionRef.current, currentFigure.id)
      if (region?.id !== regionRef.current?.id) {
        regionRef.current = region
        setCurrentRegion(region)
        if ((region || previousRegion) && !result.hitWall) regionThunk(result.p[0], currentFigure.width)
        if (region) announce(region.label, prefsRef.current)
        completeFindIt(region, currentFigure)
      }

      if (result.hitWall) thunk(result.hitWall)
      else if (!prefsRef.current.quiet) setPosition(result.p[0], result.p[1], currentFigure.width, currentFigure.height)
    }

    const selectRegion = (region: Region, currentFigure: Figure) => {
      cursorRef.current = region.labelAnchor
      regionRef.current = region
      setCursor(region.labelAnchor)
      setCurrentRegion(region)
      if (!prefsRef.current.quiet) setPosition(region.labelAnchor[0], region.labelAnchor[1], currentFigure.width, currentFigure.height)
      announce(region.label, prefsRef.current)
      completeFindIt(region, currentFigure)
    }

    const persistPrefs = (prefs: StudentPrefs) => {
      prefsRef.current = prefs
      void saveStudentPrefs(studentId, prefs).catch(() => announce('Could not save that preference.', prefs))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const currentPhase = phaseRef.current
      if (event.key === 'Escape' && currentPhase !== 'idle' && currentPhase !== 'loading') {
        event.preventDefault()
        if (currentPhase === 'asking') closeQuestion(true)
        else if (currentPhase === 'orienting') {
          challengeRun++
          stopChallengeClock()
          challengeRef.current = null
          setChallenge(null)
          phaseRef.current = 'paused'
          setPhase('paused')
          if (document.pointerLockElement === stageElement) document.exitPointerLock()
          stageElement?.focus()
          announce('Find-it cancelled. Paused. Press Enter to continue.', prefsRef.current)
        } else if (currentPhase === 'exploring') {
          pauseExploration()
          if (document.pointerLockElement === stageElement) document.exitPointerLock()
        } else if (currentPhase === 'keyboard') pauseExploration()
        else stageElement?.focus()
        return
      }
      if (phaseRef.current === 'orienting') {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (phaseRef.current === 'asking') return
      const currentFigure = figureRef.current
      if (event.key === '?' && currentFigure && currentPhase !== 'loading') {
        event.preventDefault()
        announce('Arrow keys move the cursor. Stereo position runs left to right; pitch runs low at the bottom to high at the top. A soft thunk marks region edges. F starts a find-it challenge. A asks a question. Tab and Shift+Tab select parts. Space gives the explanation. W gives the location. C returns to the centre. Q toggles the position tone. T tests it. S toggles screen reader announcements. Plus or minus changes speech rate. Escape pauses.', prefsRef.current)
        return
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return
      const stage = stageRef.current
      const active = currentPhase === 'exploring' || currentPhase === 'keyboard' || currentPhase === 'paused'
      const key = event.key.toLowerCase()

      if (event.key === 'Enter' && !event.repeat && stage && currentFigure && ['idle', 'paused'].includes(currentPhase) && !lockPending.current) {
        event.preventDefault()
        setLockError('')
        stage.focus()
        if (!started.current) {
          const centre: Point = [currentFigure.width / 2, currentFigure.height / 2]
          cursorRef.current = centre
          setCursor(centre)
          const region = hitTest(currentFigure.regions, centre, regionRef.current, currentFigure.id)
          regionRef.current = region
          setCurrentRegion(region)
          started.current = true
        }
        const [x, y] = cursorRef.current
        if (!prefsRef.current.quiet) setPosition(x, y, currentFigure.width, currentFigure.height)
        lockPending.current = true
        const requestLock = stage.requestPointerLock
        if (typeof requestLock !== 'function') {
          reportLockFailure()
          return
        }
        try {
          const result = requestLock.call(stage)
          if (result && typeof result.then === 'function') void result.catch(reportLockFailure)
        } catch {
          reportLockFailure()
        }
        return
      }

      if (!currentFigure) return
      if (!active) return

      if ((currentPhase === 'exploring' || currentPhase === 'keyboard') && key === 'a') {
        event.preventDefault()
        startQuestion(currentFigure)
        return
      }

      if ((currentPhase === 'exploring' || currentPhase === 'keyboard') && key === 'f') {
        event.preventDefault()
        startFindIt(currentFigure)
        return
      }

      if ((currentPhase === 'exploring' || currentPhase === 'keyboard') && event.key === 'Tab') {
        event.preventDefault()
        const region = adjacentRegion(currentFigure.regions, regionRef.current?.id ?? null, event.shiftKey ? -1 : 1, currentFigure.height)
        if (region) selectRegion(region, currentFigure)
        return
      }

      const movement: Record<string, Point> = {
        arrowleft: [-KEY_STEP, 0],
        arrowright: [KEY_STEP, 0],
        arrowup: [0, -KEY_STEP],
        arrowdown: [0, KEY_STEP],
      }
      if ((currentPhase === 'keyboard' || currentPhase === 'exploring') && movement[key]) {
        event.preventDefault()
        const [dx, dy] = movement[key]
        updateAt([cursorRef.current[0] + dx, cursorRef.current[1] + dy], currentFigure)
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        if (regionRef.current?.explanation) announce(regionRef.current.explanation, prefsRef.current)
      } else if (key === 'w') {
        const place = whereAmI(cursorRef.current, currentFigure.width, currentFigure.height)
        announce(regionRef.current ? `${place}. In ${regionRef.current.label}.` : `${place}. Background.`, prefsRef.current)
      } else if (key === 'c') {
        const from = cursorRef.current
        const to: Point = [currentFigure.width / 2, currentFigure.height / 2]
        if (!prefsRef.current.quiet) sweep(
          { x: from[0], y: from[1], w: currentFigure.width, h: currentFigure.height },
          { x: to[0], y: to[1], w: currentFigure.width, h: currentFigure.height },
        )
        updateAt(to, currentFigure)
      } else if (key === 'q') {
        const prefs = { ...prefsRef.current, quiet: !prefsRef.current.quiet }
        persistPrefs(prefs)
        announce(`Position tone ${prefs.quiet ? 'off' : 'on'}.`, prefs)
      } else if (key === 's') {
        if (!prefsRef.current.screenReaderMode) window.speechSynthesis?.cancel()
        const prefs = { ...prefsRef.current, screenReaderMode: !prefsRef.current.screenReaderMode }
        persistPrefs(prefs)
        announce(`Screen reader announcements ${prefs.screenReaderMode ? 'on' : 'off'}.`, prefs)
      } else if (event.key === '+' || event.key === '=') {
        const prefs = { ...prefsRef.current, speechRate: Math.min(1.8, prefsRef.current.speechRate + 0.1) }
        persistPrefs(prefs)
        announce(`Speech rate ${prefs.speechRate.toFixed(1)}.`, prefs)
      } else if (event.key === '-' || event.key === '_') {
        const prefs = { ...prefsRef.current, speechRate: Math.max(0.6, prefsRef.current.speechRate - 0.1) }
        persistPrefs(prefs)
        announce(`Speech rate ${prefs.speechRate.toFixed(1)}.`, prefs)
      } else if (key === 't') {
        testSound()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const stage = stageRef.current
      const figureArea = figureAreaRef.current
      const currentFigure = figureRef.current
      if (!figureArea || !currentFigure) return
      if (phaseRef.current === 'keyboard') {
        const bounds = figureArea.getBoundingClientRect()
        const point = pointerToFigurePoint([event.clientX, event.clientY], bounds, currentFigure)
        if (point) updateAt(point, currentFigure)
        return
      }
      if (!stage || document.pointerLockElement !== stage || phaseRef.current !== 'exploring') return
      if (!event.movementX && !event.movementY) return
      const scale = Math.min(figureArea.clientWidth / currentFigure.width, figureArea.clientHeight / currentFigure.height)
      if (!(scale > 0)) return
      const previous = cursorRef.current
      const sensitivity = prefsRef.current.sensitivity
      updateAt([
        previous[0] + (event.movementX * sensitivity) / scale,
        previous[1] + (event.movementY * sensitivity) / scale,
      ], currentFigure)
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('pointerlockerror', reportLockFailure)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointermove', onPointerMove)
    return () => {
      active = false
      challengeRun++
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('pointerlockerror', reportLockFailure)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointermove', onPointerMove)
      questionRun++
      questionController?.abort()
      submitQuestionRef.current = () => {}
      updateQuestionRef.current = () => {}
      closeQuestionRef.current = () => {}
      if (stageElement && document.pointerLockElement === stageElement) document.exitPointerLock()
      stopChallengeClock()
      dispose()
    }
  }, [figureId, studentId, target, stageRef, figureAreaRef])

  return {
    figure, phase, cursor, currentRegion, challenge, challengeElapsed, question, loadError, lockError,
    submitQuestion: (value: string) => submitQuestionRef.current(value),
    updateQuestion: (value: string) => updateQuestionRef.current(value),
    closeQuestion: () => closeQuestionRef.current(),
  }
}
