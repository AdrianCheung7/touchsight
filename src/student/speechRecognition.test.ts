import { afterEach, describe, expect, it, vi } from 'vitest'

const asr = vi.hoisted(() => ({ pipeline: vi.fn(), transcriber: vi.fn() }))
vi.mock('@huggingface/transformers', () => ({ pipeline: asr.pipeline }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  asr.pipeline.mockReset()
  asr.transcriber.mockReset()
})

async function freshSpeechModule() {
  vi.resetModules()
  return import('./speechRecognition.ts')
}

describe('local speech recognition', () => {
  it('loads the pinned English model once and reports aggregate progress', async () => {
    asr.pipeline.mockImplementation(async (_task, _model, options) => {
      options.progress_callback({ status: 'progress_total', name: 'model', progress: 42, loaded: 42, total: 100, files: {} })
      return asr.transcriber
    })
    const { loadLocalTranscriber } = await freshSpeechModule()
    const progress = vi.fn()

    await loadLocalTranscriber(progress)
    await loadLocalTranscriber(vi.fn())

    expect(asr.pipeline).toHaveBeenCalledTimes(1)
    expect(asr.pipeline).toHaveBeenCalledWith(
      'automatic-speech-recognition',
      'onnx-community/whisper-tiny.en-ONNX',
      expect.objectContaining({
        revision: 'ad1c49c3690a25e146cf5dc46aec0d04a1999e36',
        dtype: 'q4f16',
        device: 'webgpu',
      }),
    )
    expect(progress).toHaveBeenCalledWith(42)
  })

  it('allows another model load after the first load fails', async () => {
    asr.pipeline.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(asr.transcriber)
    const { loadLocalTranscriber } = await freshSpeechModule()

    await expect(loadLocalTranscriber(vi.fn())).rejects.toThrow('offline')
    await expect(loadLocalTranscriber(vi.fn())).resolves.toBeUndefined()
    expect(asr.pipeline).toHaveBeenCalledTimes(2)
  })

  it('returns one recording and stops its microphone track on finish', async () => {
    const track = { stop: vi.fn() }
    const stream = { getTracks: () => [track] }
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    const payload = new Blob(['spoken audio'], { type: 'audio/webm' })
    class FakeMediaRecorder {
      static latest: FakeMediaRecorder
      state = 'inactive'
      mimeType = 'audio/webm'
      ondataavailable: ((event: { data: Blob }) => void) | null = null
      onstop: (() => void) | null = null
      onerror: (() => void) | null = null
      constructor(_stream: unknown) { FakeMediaRecorder.latest = this }
      start() { this.state = 'recording' }
      stop() {
        this.state = 'inactive'
        this.ondataavailable?.({ data: payload })
        this.onstop?.()
      }
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    const { startSpeechRecording } = await freshSpeechModule()

    const recording = await startSpeechRecording(new AbortController().signal)
    const audio = await recording.finish()

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(await audio.text()).toBe('spoken audio')
    expect(track.stop).toHaveBeenCalled()
  })

  it('rejects an empty recording and stops its microphone track', async () => {
    const track = { stop: vi.fn() }
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [track] })
    class FakeMediaRecorder {
      state = 'inactive'
      mimeType = 'audio/webm'
      ondataavailable: ((event: { data: Blob }) => void) | null = null
      onstop: (() => void) | null = null
      onerror: (() => void) | null = null
      constructor(_stream: unknown) {}
      start() { this.state = 'recording' }
      stop() { this.state = 'inactive'; this.onstop?.() }
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    const { startSpeechRecording } = await freshSpeechModule()
    const recording = await startSpeechRecording(new AbortController().signal)

    await expect(recording.finish()).rejects.toThrow('No audio was recorded')
    expect(track.stop).toHaveBeenCalledOnce()
  })

  it('stops microphone tracks and discards audio when aborted', async () => {
    const track = { stop: vi.fn() }
    const stream = { getTracks: () => [track] }
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    class FakeMediaRecorder {
      state = 'inactive'
      mimeType = 'audio/webm'
      ondataavailable: ((event: { data: Blob }) => void) | null = null
      onstop: (() => void) | null = null
      onerror: (() => void) | null = null
      constructor(_stream: unknown) {}
      start() { this.state = 'recording' }
      stop() { this.state = 'inactive'; this.onstop?.() }
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    const { startSpeechRecording } = await freshSpeechModule()
    const controller = new AbortController()
    const recording = await startSpeechRecording(controller.signal)

    controller.abort()

    expect(track.stop).toHaveBeenCalled()
    await expect(recording.finish()).rejects.toThrow()
  })

  it('stops a stream granted after the question was cancelled during the permission prompt', async () => {
    let resolveStream: (stream: MediaStream) => void = () => {}
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((resolve) => { resolveStream = resolve }))
    class FakeMediaRecorder {
      constructor(_stream: unknown) {}
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    const { startSpeechRecording } = await freshSpeechModule()
    const controller = new AbortController()
    const pending = startSpeechRecording(controller.signal)
    controller.abort()
    const track = { stop: vi.fn() }
    resolveStream({ getTracks: () => [track] } as unknown as MediaStream)

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    expect(track.stop).toHaveBeenCalledOnce()
  })

  it('returns to a handled recording error when microphone access is denied', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'))
    class FakeMediaRecorder {
      state = 'inactive'
      constructor(_stream: unknown) {}
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    const { startSpeechRecording } = await freshSpeechModule()

    await expect(startSpeechRecording(new AbortController().signal)).rejects.toThrow('denied')
  })

  it('trims a local transcript and releases its temporary audio URL', async () => {
    asr.pipeline.mockResolvedValue(asr.transcriber)
    asr.transcriber.mockResolvedValue({ text: '  What does a mitochondrion do?  ' })
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:local-audio')
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const { loadLocalTranscriber, transcribeSpeech } = await freshSpeechModule()
    await loadLocalTranscriber(vi.fn())

    await expect(transcribeSpeech(new Blob(['local audio']))).resolves.toBe('What does a mitochondrion do?')

    expect(createUrl).toHaveBeenCalledOnce()
    expect(asr.transcriber).toHaveBeenCalledWith('blob:local-audio', { language: 'english', task: 'transcribe' })
    expect(revokeUrl).toHaveBeenCalledWith('blob:local-audio')
  })

  it('rejects empty recordings and empty transcripts', async () => {
    asr.pipeline.mockResolvedValue(asr.transcriber)
    asr.transcriber.mockResolvedValue({ text: '  ' })
    const { loadLocalTranscriber, transcribeSpeech } = await freshSpeechModule()
    await loadLocalTranscriber(vi.fn())

    await expect(transcribeSpeech(new Blob())).rejects.toThrow('No audio was recorded')
    await expect(transcribeSpeech(new Blob(['noise']))).rejects.toThrow('No speech was recognized')
  })

  it('releases the temporary audio URL when inference fails', async () => {
    asr.pipeline.mockResolvedValue(asr.transcriber)
    asr.transcriber.mockRejectedValue(new Error('decoder failed'))
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:local-audio')
    const { loadLocalTranscriber, transcribeSpeech } = await freshSpeechModule()
    await loadLocalTranscriber(vi.fn())

    await expect(transcribeSpeech(new Blob(['local audio']))).rejects.toThrow('decoder failed')
    expect(revokeUrl).toHaveBeenCalledWith('blob:local-audio')
  })
})
