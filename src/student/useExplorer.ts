// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Figure, Point, Region, StudentPrefs } from '../contract/types.ts'
import { getFigure, getStudent, saveStudentPrefs } from '../data/db.ts'
import { announce as announceLive, dispose, regionThunk, setPosition, speak, sweep, testSound, thunk } from './audio.ts'
import { adjacentRegion, clamp, hitTest, whereAmI } from './geometry.ts'

type Phase = 'loading' | 'idle' | 'exploring' | 'keyboard' | 'paused'

// ponytail: 1.0 is the default; tune on the demo laptop's trackpad.
const SENSITIVITY = 1.0
const KEY_STEP = 18

function announce(text: string, prefs: StudentPrefs) {
  if (prefs.screenReaderMode) announceLive(text, { screenReader: true })
  else speak(text, prefs.speechRate)
}

export function useExplorer({
  figureId,
  studentId,
  stageRef,
  figureAreaRef,
}: {
  figureId: string
  studentId: string
  stageRef: RefObject<HTMLElement | null>
  figureAreaRef: RefObject<HTMLDivElement | null>
}) {
  const [figure, setFigure] = useState<Figure | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [cursor, setCursor] = useState<Point>([0, 0])
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null)
  const [loadError, setLoadError] = useState('')
  const [lockError, setLockError] = useState('')
  const figureRef = useRef<Figure | null>(null)
  const prefsRef = useRef<StudentPrefs>({ sensitivity: SENSITIVITY, speechRate: 1.05, screenReaderMode: false, quiet: false })
  const cursorRef = useRef<Point>([0, 0])
  const regionRef = useRef<Region | null>(null)
  const phaseRef = useRef<Phase>('loading')
  const lockPending = useRef(false)
  const started = useRef(false)

  useEffect(() => {
    let active = true
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
      phaseRef.current = 'idle'
      setFigure(loadedFigure)
      setCursor(centre)
      setCurrentRegion(null)
      setPhase('idle')
      announce(
        `${loadedFigure.title}. ${loadedFigure.regions.length} parts. Press Enter to start. Left and right pan the sound; low pitch is at the bottom and high pitch is at the top. A soft thunk marks region edges. Tab selects the next part; Shift+Tab selects the previous. Press question mark for help.`,
        prefs,
      )
    }).catch((error: unknown) => {
      if (!active) return
      setLoadError(error instanceof Error ? error.message : 'This diagram could not be loaded.')
    })

    const reportLockFailure = () => {
      if (!lockPending.current) return
      lockPending.current = false
      const message = 'Pointer control is unavailable. Keyboard mode: use arrow keys to move and Tab or Shift+Tab to choose a part. Press question mark for help.'
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
          phaseRef.current = 'exploring'
          setPhase('exploring')
          announce('Exploring. Press question mark for help.', prefsRef.current)
        }
      } else if (phaseRef.current === 'exploring') {
        lockPending.current = false
        phaseRef.current = 'paused'
        setPhase('paused')
        announce('Paused. Press Enter to continue.', prefsRef.current)
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
        if (region || previousRegion) regionThunk(result.p[0], currentFigure.width)
        if (region) announce(region.label, prefsRef.current)
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
    }

    const persistPrefs = (prefs: StudentPrefs) => {
      prefsRef.current = prefs
      void saveStudentPrefs(studentId, prefs).catch(() => announce('Could not save that preference.', prefs))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return
      const stage = stageRef.current
      const currentFigure = figureRef.current
      const currentPhase = phaseRef.current
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
      if (event.key === '?' && currentPhase !== 'idle' && currentPhase !== 'loading') {
        event.preventDefault()
        announce('Arrow keys move the cursor. Stereo position runs left to right; pitch runs low at the bottom to high at the top. A soft thunk marks region edges. Tab and Shift+Tab select parts. Space gives the explanation. W gives the location. C returns to the centre. Q toggles the position tone. T tests it. S toggles screen reader announcements. Plus or minus changes speech rate. Escape pauses.', prefsRef.current)
        return
      }
      if (!active) return

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

      if (event.key === 'Escape' && currentPhase === 'keyboard') {
        event.preventDefault()
        phaseRef.current = 'paused'
        setPhase('paused')
        announce('Paused. Press Enter to continue.', prefsRef.current)
      } else if (event.code === 'Space') {
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
      if (!stage || !figureArea || !currentFigure || document.pointerLockElement !== stage || phaseRef.current !== 'exploring') return
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
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('pointerlockerror', reportLockFailure)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointermove', onPointerMove)
      if (stageElement && document.pointerLockElement === stageElement) document.exitPointerLock()
      dispose()
    }
  }, [figureId, studentId, stageRef, figureAreaRef])

  return { figure, phase, cursor, currentRegion, loadError, lockError }
}
