// Owned by Part A from checkpoint C0 on (docs/CONTRACT.md §1).
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Figure, Point, Region, StudentPrefs } from '../contract/types.ts'
import { getFigure, getStudent } from '../data/db.ts'
import { announce as announceLive, dispose, panFor, setInside, setPosition, speak, thunk, tick } from './audio.ts'
import { clamp, hitTest } from './geometry.ts'

type Phase = 'loading' | 'idle' | 'exploring' | 'paused'

// ponytail: 1.0 is the default; tune on the demo laptop's trackpad.
const SENSITIVITY = 1.0

function announce(text: string, prefs: StudentPrefs) {
  if (prefs.screenReaderMode) announceLive(text, { screenReader: true })
  else speak(text, prefs.speechRate)
}

export function useExplorer({
  figureId,
  studentId,
  stageRef,
}: {
  figureId: string
  studentId: string
  stageRef: RefObject<HTMLElement | null>
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
      announce(`${loadedFigure.title}. ${loadedFigure.regions.length} parts. Press Enter to start exploring. Press question mark for help.`, prefs)
    }).catch((error: unknown) => {
      if (!active) return
      setLoadError(error instanceof Error ? error.message : 'This diagram could not be loaded.')
    })

    const reportLockFailure = () => {
      if (!lockPending.current) return
      lockPending.current = false
      const message = 'Pointer lock was blocked. Press Enter to try again.'
      setLockError(message)
      announce(message, prefsRef.current)
    }

    const onPointerLockChange = () => {
      const stage = stageRef.current
      if (document.pointerLockElement === stage && stage) {
        lockPending.current = false
        if (phaseRef.current !== 'exploring') {
          phaseRef.current = 'exploring'
          setPhase('exploring')
          announce('Exploring.', prefsRef.current)
        }
      } else if (phaseRef.current === 'exploring') {
        lockPending.current = false
        phaseRef.current = 'paused'
        setInside(false)
        setPhase('paused')
        announce('Paused. Press Enter to continue.', prefsRef.current)
      }
    }

    const onPointerLockError = () => reportLockFailure()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return
      const stage = stageRef.current
      const currentFigure = figureRef.current
      if (!stage || !currentFigure || !['idle', 'paused'].includes(phaseRef.current) || lockPending.current) return
      event.preventDefault()
      setLockError('')
      const requestLock = stage.requestPointerLock
      if (typeof requestLock !== 'function') {
        lockPending.current = true
        reportLockFailure()
        return
      }
      stage.focus()
      if (!started.current) {
        const centre: Point = [currentFigure.width / 2, currentFigure.height / 2]
        cursorRef.current = centre
        setCursor(centre)
        const region = hitTest(currentFigure.regions, centre)
        regionRef.current = region
        setCurrentRegion(region)
        setInside(Boolean(region))
        started.current = true
      }
      const [x, y] = cursorRef.current
      if (!prefsRef.current.quiet) setPosition(x, y, currentFigure.width, currentFigure.height)
      else setInside(Boolean(regionRef.current))
      lockPending.current = true
      try {
        const result = requestLock.call(stage)
        if (result && typeof result.then === 'function') void result.catch(reportLockFailure)
      } catch {
        reportLockFailure()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const stage = stageRef.current
      const currentFigure = figureRef.current
      if (!stage || !currentFigure || document.pointerLockElement !== stage || phaseRef.current !== 'exploring') return
      const scale = Math.min(stage.clientWidth / currentFigure.width, stage.clientHeight / currentFigure.height)
      if (!(scale > 0)) return
      const sensitivity = prefsRef.current.sensitivity
      const result = clamp([
        cursorRef.current[0] + (event.movementX * sensitivity) / scale,
        cursorRef.current[1] + (event.movementY * sensitivity) / scale,
      ], currentFigure.width, currentFigure.height)
      cursorRef.current = result.p
      setCursor(result.p)
      if (result.hitWall) thunk(result.hitWall)
      else if (!prefsRef.current.quiet) setPosition(result.p[0], result.p[1], currentFigure.width, currentFigure.height)

      const region = hitTest(currentFigure.regions, result.p)
      if (region?.id !== regionRef.current?.id) {
        regionRef.current = region
        setCurrentRegion(region)
        tick(panFor(result.p[0], currentFigure.width))
        setInside(Boolean(region))
        if (region) announce(region.label, prefsRef.current)
      }
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('pointerlockerror', onPointerLockError)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointermove', onPointerMove)
    return () => {
      active = false
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('pointerlockerror', onPointerLockError)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointermove', onPointerMove)
      if (stageElement && document.pointerLockElement === stageElement) document.exitPointerLock()
      dispose()
    }
  }, [figureId, studentId, stageRef])

  return { figure, phase, cursor, currentRegion, loadError, lockError }
}
