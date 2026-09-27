import type { Region } from '../contract/types.ts'

export type Challenge = {
  targetRegionId: string
  status: 'orienting' | 'active' | 'paused' | 'found'
  startedAt: number | null
  elapsedMs: number
}

export function pickTarget(
  regions: Region[],
  figureId: string,
  requestedTarget?: string,
  currentRegionId: string | null = null,
  random = Math.random,
): Region | null {
  const requested = regions.find(({ id }) => id === requestedTarget)
  if (requested) return requested

  const defaultTarget = figureId === 'animal-cell' && regions.find(({ id }) => id === 'mitochondrion')
  if (defaultTarget && defaultTarget.id !== currentRegionId) return defaultTarget

  const candidates = regions.filter(({ id }) => id !== currentRegionId)
  const pool = candidates.length ? candidates : regions
  return pool[Math.floor(random() * pool.length)] ?? null
}

export function elapsedMs(challenge: Challenge, now: number) {
  return challenge.elapsedMs + (challenge.status === 'active' && challenge.startedAt !== null ? Math.max(0, now - challenge.startedAt) : 0)
}

export function pauseChallenge(challenge: Challenge, now: number, status: 'paused' | 'found' = 'paused'): Challenge {
  return { ...challenge, status, startedAt: null, elapsedMs: elapsedMs(challenge, now) }
}

export function resumeChallenge(challenge: Challenge, now: number): Challenge {
  return challenge.status === 'paused' ? { ...challenge, status: 'active', startedAt: now } : challenge
}

export function formatElapsed(ms: number) {
  const seconds = Math.floor(Math.max(0, ms) / 1_000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
