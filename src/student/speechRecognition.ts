type SpeechResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> }

interface Recognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  processLocally?: boolean
  onresult: ((event: SpeechResult) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  abort(): void
}

type RecognitionConstructor = new () => Recognition

export function listenOnce(signal?: AbortSignal): Promise<string | null> {
  const browser = window as Window & {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
  if (!Constructor || signal?.aborted) return Promise.resolve(null)

  let recognition: Recognition
  try {
    recognition = new Constructor()
    if (!('processLocally' in recognition)) return Promise.resolve(null)
    recognition.lang = 'en-CA'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.processLocally = true
  } catch {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    let finished = false
    const finish = (transcript: string | null) => {
      if (finished) return
      finished = true
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      signal?.removeEventListener('abort', cancel)
      resolve(transcript)
    }
    const cancel = () => {
      try { recognition.abort() } catch { /* Already stopped. */ }
      finish(null)
    }

    recognition.onresult = (event) => finish(event.results[0]?.[0]?.transcript.trim() || null)
    recognition.onerror = () => finish(null)
    recognition.onend = () => finish(null)
    signal?.addEventListener('abort', cancel, { once: true })
    try {
      recognition.start()
    } catch {
      finish(null)
    }
  })
}
