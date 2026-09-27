import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => vi.unstubAllGlobals())

it('exits exploration pointer lock before opening the question dialog', async () => {
  const stage = {} as HTMLElement
  const exitPointerLock = vi.fn()
  vi.stubGlobal('document', { pointerLockElement: stage, exitPointerLock })
  const explorer = await import('./useExplorer.ts') as unknown as {
    releasePointerLock: (element: HTMLElement | null) => boolean
  }

  expect(explorer.releasePointerLock).toBeTypeOf('function')
  expect(explorer.releasePointerLock(stage)).toBe(true)

  expect(exitPointerLock).toHaveBeenCalledOnce()
})

it('does not exit pointer lock when another element owns it', async () => {
  const stage = {} as HTMLElement
  const exitPointerLock = vi.fn()
  vi.stubGlobal('document', { pointerLockElement: {} as HTMLElement, exitPointerLock })
  const explorer = await import('./useExplorer.ts') as unknown as {
    releasePointerLock: (element: HTMLElement | null) => boolean
  }

  expect(explorer.releasePointerLock).toBeTypeOf('function')
  expect(explorer.releasePointerLock(stage)).toBe(false)

  expect(exitPointerLock).not.toHaveBeenCalled()
})
