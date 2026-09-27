import { afterEach, describe, expect, it, vi } from 'vitest'
import { listenOnce } from './speechRecognition.ts'

afterEach(() => vi.unstubAllGlobals())

describe('on-device speech recognition', () => {
  it('returns no transcript when recognition is unavailable', async () => {
    vi.stubGlobal('window', {})
    expect(await listenOnce()).toBeNull()
  })

  it('listens once in Canadian English and trims the local transcript', async () => {
    class LocalRecognition extends FakeRecognition {
      static latest: LocalRecognition
      constructor() {
        super()
        LocalRecognition.latest = this
      }
    }
    vi.stubGlobal('window', { SpeechRecognition: LocalRecognition })

    const result = listenOnce()
    const recognition = LocalRecognition.latest
    expect(recognition).toMatchObject({ lang: 'en-CA', continuous: false, interimResults: false, maxAlternatives: 1, processLocally: true })
    expect(recognition.starts).toBe(1)
    recognition.onresult?.({ results: [[{ transcript: '  What does it do?  ' }]] })
    await expect(result).resolves.toBe('What does it do?')
  })

  it('never falls back to server-based recognition', async () => {
    class RemoteOnlyRecognition {
      starts = 0
      start() { this.starts++ }
    }
    vi.stubGlobal('window', { webkitSpeechRecognition: RemoteOnlyRecognition })
    expect(await listenOnce()).toBeNull()
  })

  it('falls back to typing when local recognition reports an error', async () => {
    class ErrorRecognition extends FakeRecognition {
      static latest: ErrorRecognition
      constructor() {
        super()
        ErrorRecognition.latest = this
      }
    }
    vi.stubGlobal('window', { SpeechRecognition: ErrorRecognition })
    const result = listenOnce()
    ErrorRecognition.latest.onerror?.()
    await expect(result).resolves.toBeNull()
  })

  it('returns to typed input when starting or listening fails, or is cancelled', async () => {
    class FailingRecognition extends FakeRecognition {
      start() { throw new Error('not allowed') }
    }
    vi.stubGlobal('window', { SpeechRecognition: FailingRecognition })
    await expect(listenOnce()).resolves.toBeNull()

    class CancelableRecognition extends FakeRecognition {
      static latest: CancelableRecognition
      constructor() {
        super()
        CancelableRecognition.latest = this
      }
    }
    vi.stubGlobal('window', { SpeechRecognition: CancelableRecognition })
    const controller = new AbortController()
    const result = listenOnce(controller.signal)
    controller.abort()
    expect(CancelableRecognition.latest.aborts).toBe(1)
    await expect(result).resolves.toBeNull()
  })
})

class FakeRecognition {
  lang = ''
  continuous = true
  interimResults = true
  maxAlternatives = 0
  processLocally = false
  starts = 0
  aborts = 0
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null = null
  onerror: (() => void) | null = null
  onend: (() => void) | null = null

  start() { this.starts++ }
  abort() { this.aborts++ }
}
