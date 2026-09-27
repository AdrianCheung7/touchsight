import { afterEach, describe, expect, it, vi } from 'vitest'
import { announce, chime, countdownClick, dispose, freqFor, panFor, playSpatialCue, regionThunk, startCue, wallSide } from './audio.ts'

class Param {
  value = 0
  ramps: number[] = []
  setValueAtTime(value: number) { this.value = value }
  setTargetAtTime(value: number) { this.value = value }
  linearRampToValueAtTime(value: number) { this.value = value }
  exponentialRampToValueAtTime(value: number) { this.ramps.push(value) }
  cancelScheduledValues() {}
}

class AudioNodeMock {
  gain = new Param()
  frequency = new Param()
  pan = new Param()
  stopTime = 0
  onended: (() => void) | null = null
  connect<T>(node: T) { return node }
  start() {}
  stop(time: number) { this.stopTime = time }
  disconnect() {}
}

class AudioContextMock {
  static latest: AudioContextMock
  state = 'running'
  currentTime = 0
  destination = new AudioNodeMock()
  gains: AudioNodeMock[] = []
  oscillators: AudioNodeMock[] = []
  panners: AudioNodeMock[] = []
  constructor() { AudioContextMock.latest = this }
  createGain() { const node = new AudioNodeMock(); this.gains.push(node); return node }
  createOscillator() { const node = new AudioNodeMock(); this.oscillators.push(node); return node }
  createStereoPanner() { const node = new AudioNodeMock(); this.panners.push(node); return node }
  close() { return Promise.resolve() }
}

afterEach(() => {
  dispose()
  vi.unstubAllGlobals()
})

describe('panFor', () => {
  it('maps the left edge, centre, and right edge to stereo pan', () => {
    expect(panFor(0, 400)).toBe(-1)
    expect(panFor(200, 400)).toBe(0)
    expect(panFor(400, 400)).toBe(1)
  })
})

describe('freqFor', () => {
  it('maps the top, middle, and bottom to the sound design frequencies', () => {
    expect(freqFor(0, 400)).toBe(880)
    expect(freqFor(200, 400)).toBe(440)
    expect(freqFor(400, 400)).toBe(220)
  })
})

describe('wallSide', () => {
  it.each([
    [{ x: -20, y: 200 }, 'left'],
    [{ x: 420, y: 200 }, 'right'],
    [{ x: 200, y: -20 }, 'top'],
    [{ x: 200, y: 420 }, 'bottom'],
    [{ x: -20, y: -5 }, 'left'],
    [{ x: 405, y: -20 }, 'top'],
  ] as const)('finds the wall hit at %o', (point, expected) => {
    expect(wallSide(point, 400, 400)).toBe(expected)
  })

  it('returns null while the point is inside the diagram', () => {
    expect(wallSide({ x: 200, y: 200 }, 400, 400)).toBeNull()
  })
})

describe('regionThunk', () => {
  it('uses a strong, sustained cue at a region edge', () => {
    vi.stubGlobal('AudioContext', AudioContextMock)
    vi.stubGlobal('window', {
      AudioContext: AudioContextMock,
      clearTimeout,
      setTimeout,
      speechSynthesis: { cancel() {} },
    })

    regionThunk(200, 400)

    expect(AudioContextMock.latest.gains[2].gain.ramps[0]).toBe(0.32)
    expect(AudioContextMock.latest.oscillators[1].stopTime).toBe(0.12)
  })
})

describe('chime', () => {
  it('plays a clear, centered two-note success cue', () => {
    vi.stubGlobal('AudioContext', AudioContextMock)
    vi.stubGlobal('window', {
      AudioContext: AudioContextMock,
      clearTimeout,
      setTimeout,
      speechSynthesis: { cancel() {} },
    })

    chime()

    expect(AudioContextMock.latest.oscillators.slice(1).map(({ frequency }) => frequency.value)).toEqual([523.25, 783.99])
    expect(AudioContextMock.latest.oscillators.slice(1).map(({ stopTime }) => stopTime)).toEqual([0.16, 0.2])
  })
})

describe('orientation cues', () => {
  it('plays a three-second tone at the target position', () => {
    vi.stubGlobal('AudioContext', AudioContextMock)
    vi.stubGlobal('window', {
      AudioContext: AudioContextMock,
      clearTimeout,
      setTimeout,
      speechSynthesis: { cancel() {} },
    })

    playSpatialCue(0, 0, 400, 400)

    expect(AudioContextMock.latest.oscillators[1].frequency.value).toBe(880)
    expect(AudioContextMock.latest.oscillators[1].stopTime).toBe(3)
    expect(AudioContextMock.latest.panners[1].pan.value).toBe(-1)
  })

  it('waits for the spoken target announcement to finish', async () => {
    class UtteranceMock {
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
      voice: SpeechSynthesisVoice | null = null
      lang = ''
      rate = 1
      text: string
      constructor(text: string) { this.text = text }
    }
    const speech: { finish: () => void } = { finish: () => undefined }
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceMock)
    vi.stubGlobal('AudioContext', AudioContextMock)
    vi.stubGlobal('window', {
      AudioContext: AudioContextMock,
      clearTimeout,
      setTimeout,
      speechSynthesis: {
        cancel() {},
        getVoices: () => [],
        speak: (utterance: UtteranceMock) => { speech.finish = utterance.onend ?? (() => undefined) },
      },
    })

    let finished = false
    const announcement = announce('Find the mitochondrion.').then(() => { finished = true })
    await Promise.resolve()
    expect(finished).toBe(false)
    speech.finish()
    await announcement
    expect(finished).toBe(true)
  })

  it('uses a quiet short click and a distinct start cue', () => {
    vi.stubGlobal('AudioContext', AudioContextMock)
    vi.stubGlobal('window', {
      AudioContext: AudioContextMock,
      clearTimeout,
      setTimeout,
      speechSynthesis: { cancel() {} },
    })

    countdownClick()
    startCue()

    expect(AudioContextMock.latest.oscillators.slice(1).map(({ stopTime }) => stopTime)).toEqual([0.06, 0.24])
    expect(AudioContextMock.latest.gains.slice(2).map(({ gain }) => gain.ramps[0])).toEqual([0.14, 0.22])
  })
})
