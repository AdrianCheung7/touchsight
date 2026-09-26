export type WallSide = 'left' | 'right' | 'top' | 'bottom'
export type Point = { x: number; y: number }
export type Position = Point & { w: number; h: number }

export const panFor = (x: number, w: number) =>
  w > 0 ? Math.max(-1, Math.min(1, (2 * x) / w - 1)) : 0
export const freqFor = (y: number, h: number) =>
  h > 0 ? 220 * 4 ** (1 - Math.max(0, Math.min(1, y / h))) : 440

export function wallSide(p: Point, w: number, h: number): WallSide | null {
  if (w <= 0 || h <= 0) return null
  const dx = p.x < 0 ? -p.x : p.x > w ? p.x - w : 0
  const dy = p.y < 0 ? -p.y : p.y > h ? p.y - h : 0
  if (!dx && !dy) return null
  if (dx / w >= dy / h) return p.x < 0 ? 'left' : 'right'
  return p.y < 0 ? 'top' : 'bottom'
}

let audio: AudioContext | undefined
let master: GainNode | undefined
let positionVoice: OscillatorNode | undefined
let voiceGain: GainNode | undefined
let positionPanner: StereoPannerNode | undefined
let tremolo: OscillatorNode | undefined
let tremoloDepth: GainNode | undefined
let inside = false
let voiceActive = false
let speaking = false
let movementTimer: number | undefined
let chimeTimer: number | undefined
let announcementTimer: number | undefined
let liveRegion: HTMLDivElement | undefined
let speechSerial = 0

function ensureAudio() {
  if (typeof window === 'undefined' || !window.AudioContext) return undefined
  if (!audio) {
    audio = new AudioContext()
    master = audio.createGain()
    master.gain.value = 0.6
    master.connect(audio.destination)

    positionVoice = audio.createOscillator()
    voiceGain = audio.createGain()
    positionPanner = audio.createStereoPanner()
    voiceGain.gain.value = 0
    positionVoice.connect(voiceGain).connect(positionPanner).connect(master)
    positionVoice.start()

    tremolo = audio.createOscillator()
    tremolo.frequency.value = 6
    tremoloDepth = audio.createGain()
    tremoloDepth.gain.value = 0
    tremolo.connect(tremoloDepth).connect(voiceGain.gain)
    tremolo.start()
  }
  if (audio.state === 'suspended') void audio.resume().catch(() => undefined)
  return audio
}

function play(source: AudioScheduledSourceNode, envelope: GainNode, pan: StereoPannerNode, duration: number) {
  source.connect(envelope).connect(pan).connect(master!)
  source.onended = () => {
    source.disconnect()
    envelope.disconnect()
    pan.disconnect()
  }
  source.start()
  source.stop(audio!.currentTime + duration)
}

function updateVoiceEnvelope() {
  if (!audio || !voiceGain) return
  const now = audio.currentTime
  voiceGain.gain.cancelScheduledValues(now)
  voiceGain.gain.setValueAtTime(voiceGain.gain.value, now)
  if (!voiceActive) {
    voiceGain.gain.linearRampToValueAtTime(0, now + 0.015)
    return
  }
  voiceGain.gain.linearRampToValueAtTime(speaking ? 0.1 : 0.25, now + 0.015)
  voiceGain.gain.linearRampToValueAtTime(0, now + 0.15)
}

function tone(
  frequency: number,
  pan: number,
  duration: number,
  options: { type?: OscillatorType; gain?: number; decay?: boolean } = {},
) {
  const context = ensureAudio()
  if (!context || !master) return
  const oscillator = context.createOscillator()
  const envelope = context.createGain()
  const panner = context.createStereoPanner()
  const now = context.currentTime
  const volume = options.gain ?? 0.4
  oscillator.type = options.type ?? 'sine'
  oscillator.frequency.value = frequency
  panner.pan.value = Math.max(-1, Math.min(1, pan))
  envelope.gain.setValueAtTime(0.0001, now)
  envelope.gain.exponentialRampToValueAtTime(volume, now + 0.003)
  if (options.decay) envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  else {
    envelope.gain.setValueAtTime(volume, now + duration - 0.006)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  }
  play(oscillator, envelope, panner, duration)
}

export function setPosition(x: number, y: number, w: number, h: number) {
  const context = ensureAudio()
  if (!context || !positionVoice || !positionPanner) return
  voiceActive = true
  positionVoice.type = inside ? 'triangle' : 'sine'
  positionVoice.frequency.setTargetAtTime(freqFor(y, h), context.currentTime, 0.015)
  positionPanner.pan.setTargetAtTime(panFor(x, w), context.currentTime, 0.015)
  updateVoiceEnvelope()
  window.clearTimeout(movementTimer)
  movementTimer = window.setTimeout(() => {
    voiceActive = false
    updateVoiceEnvelope()
  }, 150)
}

export function setInside(value: boolean) {
  inside = value
  const context = ensureAudio()
  if (!context || !positionVoice || !tremoloDepth) return
  positionVoice.type = inside ? 'triangle' : 'sine'
  tremoloDepth.gain.setTargetAtTime(inside ? 0.075 : 0, context.currentTime, 0.015)
}

export function tick(pan: number) {
  const context = ensureAudio()
  if (!context || !master) return
  const length = Math.ceil(context.sampleRate * 0.004)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) samples[i] = Math.random() * 2 - 1

  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const envelope = context.createGain()
  const panner = context.createStereoPanner()
  const now = context.currentTime
  source.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  envelope.gain.setValueAtTime(0.0001, now)
  envelope.gain.exponentialRampToValueAtTime(0.5, now + 0.001)
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.004)
  panner.pan.value = Math.max(-1, Math.min(1, pan))
  source.connect(filter).connect(envelope)
  source.onended = () => {
    source.disconnect()
    filter.disconnect()
    envelope.disconnect()
    panner.disconnect()
  }
  envelope.connect(panner).connect(master)
  source.start()
  source.stop(now + 0.004)
}

let lastThunkAt = -Infinity
export function thunk(side: WallSide) {
  const now = performance.now()
  if (now - lastThunkAt < 300) return
  lastThunkAt = now
  tone(220, side === 'left' ? -1 : side === 'right' ? 1 : 0, 0.12, { type: 'triangle', gain: 0.7, decay: true })
}

export function chime() {
  tone(660, 0, 0.09, { type: 'triangle' })
  window.clearTimeout(chimeTimer)
  chimeTimer = window.setTimeout(() => tone(990, 0, 0.09, { type: 'triangle' }), 130)
}

export function sweep(from: Position, to: Position) {
  const context = ensureAudio()
  if (!context || !master) return
  const oscillator = context.createOscillator()
  const envelope = context.createGain()
  const panner = context.createStereoPanner()
  const now = context.currentTime
  oscillator.frequency.setValueAtTime(freqFor(from.y, from.h), now)
  oscillator.frequency.linearRampToValueAtTime(freqFor(to.y, to.h), now + 0.18)
  panner.pan.setValueAtTime(panFor(from.x, from.w), now)
  panner.pan.linearRampToValueAtTime(panFor(to.x, to.w), now + 0.18)
  envelope.gain.setValueAtTime(0.0001, now)
  envelope.gain.linearRampToValueAtTime(0.25, now + 0.01)
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
  play(oscillator, envelope, panner, 0.18)
}

export function testSound() {
  const context = ensureAudio()
  if (!context || !master) return
  const oscillator = context.createOscillator()
  const envelope = context.createGain()
  const panner = context.createStereoPanner()
  const now = context.currentTime
  oscillator.frequency.setValueAtTime(220, now)
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 1.2)
  panner.pan.setValueAtTime(-1, now)
  panner.pan.linearRampToValueAtTime(1, now + 1.2)
  envelope.gain.setValueAtTime(0.0001, now)
  envelope.gain.linearRampToValueAtTime(0.25, now + 0.02)
  envelope.gain.setValueAtTime(0.25, now + 1.18)
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
  play(oscillator, envelope, panner, 1.2)
}

export function speak(text: string, rate = 1.05) {
  const synth = typeof window === 'undefined' ? undefined : window.speechSynthesis
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return
  synth.cancel()
  const serial = ++speechSerial
  speaking = true
  updateVoiceEnvelope()
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = synth.getVoices()
  const voice =
    voices.find((candidate) => candidate.lang.toLowerCase() === 'en-ca') ??
    voices.find((candidate) => candidate.lang.toLowerCase() === 'en-us') ??
    voices.find((candidate) => candidate.lang.toLowerCase().startsWith('en'))
  utterance.voice = voice ?? null
  utterance.lang = voice?.lang ?? 'en-CA'
  utterance.rate = rate
  const restore = () => {
    if (serial !== speechSerial) return
    speaking = false
    updateVoiceEnvelope()
  }
  utterance.onend = restore
  utterance.onerror = restore
  synth.speak(utterance)
}

export function announce(text: string, options: { screenReader?: boolean } = {}) {
  if (!options.screenReader) return speak(text)
  if (typeof document === 'undefined') return
  if (!liveRegion?.isConnected) {
    liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.append(liveRegion)
  }
  window.clearTimeout(announcementTimer)
  liveRegion.textContent = ''
  announcementTimer = window.setTimeout(() => {
    if (liveRegion?.isConnected) liveRegion.textContent = text
  }, 0)
}

export function dispose() {
  if (typeof window !== 'undefined') {
    window.clearTimeout(movementTimer)
    window.clearTimeout(chimeTimer)
    window.clearTimeout(announcementTimer)
    window.speechSynthesis?.cancel()
  }
  speechSerial++
  liveRegion?.remove()
  liveRegion = undefined
  voiceActive = speaking = inside = false
  positionVoice?.stop()
  positionVoice?.disconnect()
  tremolo?.stop()
  tremolo?.disconnect()
  tremoloDepth?.disconnect()
  voiceGain?.disconnect()
  positionPanner?.disconnect()
  master?.disconnect()
  if (audio) void audio.close()
  audio = master = positionVoice = voiceGain = positionPanner = tremolo = tremoloDepth = undefined
}
