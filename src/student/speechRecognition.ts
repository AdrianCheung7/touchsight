type Transcriber = (audio: string | URL, options?: { language?: string; task?: string }) => Promise<{ text: string }>

const MODEL = 'onnx-community/whisper-tiny.en-ONNX'
const REVISION = 'ad1c49c3690a25e146cf5dc46aec0d04a1999e36'

let transcriber: Transcriber | undefined
let loading: Promise<void> | undefined
let reportProgress: ((progress: number) => void) | undefined

export function loadLocalTranscriber(onProgress: (progress: number) => void): Promise<void> {
  reportProgress = onProgress
  if (transcriber) return Promise.resolve()
  if (loading) return loading

  loading = import('@huggingface/transformers').then(async ({ pipeline }) => {
    transcriber = await pipeline('automatic-speech-recognition', MODEL, {
      revision: REVISION,
      dtype: 'q4f16',
      device: 'webgpu',
      progress_callback: (progress) => {
        if (progress.status === 'progress_total') reportProgress?.(Math.round(progress.progress))
      },
    }) as unknown as Transcriber
    reportProgress?.(100)
  }).catch((error: unknown) => {
    loading = undefined
    throw error
  }).finally(() => {
    reportProgress = undefined
  })
  return loading
}

export async function startSpeechRecording(signal: AbortSignal): Promise<{ finish: () => Promise<Blob> }> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    throw new Error('Microphone recording is unavailable')
  }
  if (signal.aborted) throw new DOMException('Recording was cancelled', 'AbortError')

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  let tracksStopped = false
  const stopTracks = () => {
    if (tracksStopped) return
    tracksStopped = true
    stream.getTracks().forEach((track) => track.stop())
  }
  if (signal.aborted) {
    stopTracks()
    throw new DOMException('Recording was cancelled', 'AbortError')
  }

  let recorder: MediaRecorder
  try {
    recorder = new MediaRecorder(stream)
  } catch (error) {
    stopTracks()
    throw error
  }

  let chunks: BlobPart[] = []
  let finished: Promise<Blob> | undefined
  let resolveFinished: ((audio: Blob) => void) | undefined
  let rejectFinished: ((error: Error) => void) | undefined
  const cleanup = () => {
    signal.removeEventListener('abort', cancel)
    stopTracks()
  }
  const cancel = () => {
    chunks = []
    try {
      if (recorder.state !== 'inactive') recorder.stop()
    } catch { /* Already stopped. */ }
    cleanup()
    rejectFinished?.(new DOMException('Recording was cancelled', 'AbortError'))
  }

  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data)
  }
  recorder.onstop = () => {
    cleanup()
    if (signal.aborted) {
      chunks = []
      rejectFinished?.(new DOMException('Recording was cancelled', 'AbortError'))
      return
    }
    const audio = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
    chunks = []
    if (!audio.size) rejectFinished?.(new Error('No audio was recorded'))
    else resolveFinished?.(audio)
  }
  recorder.onerror = () => {
    cleanup()
    rejectFinished?.(new Error('Microphone recording failed'))
  }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    recorder.start()
  } catch (error) {
    cleanup()
    throw error
  }

  return {
    finish: () => {
      if (finished) return finished
      if (signal.aborted) return Promise.reject(new DOMException('Recording was cancelled', 'AbortError'))
      if (recorder.state === 'inactive') return Promise.reject(new Error('No active microphone recording'))
      finished = new Promise((resolve, reject) => {
        resolveFinished = resolve
        rejectFinished = reject
        try {
          recorder.stop()
        } catch (error) {
          cleanup()
          reject(error instanceof Error ? error : new Error('Microphone recording failed'))
        }
      })
      return finished
    },
  }
}

export async function transcribeSpeech(blob: Blob): Promise<string> {
  if (!blob.size) throw new Error('No audio was recorded')
  if (!transcriber) throw new Error('Speech recognition is not ready')

  const audioUrl = URL.createObjectURL(blob)
  try {
    const result = await transcriber(audioUrl, { language: 'english', task: 'transcribe' })
    const text = (result.text ?? '').trim()
    if (!text) throw new Error('No speech was recognized')
    return text
  } finally {
    URL.revokeObjectURL(audioUrl)
  }
}
