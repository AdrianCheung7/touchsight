# On-device speech input design

## Goal

Make the `A` question flow accept spoken questions in the current Chrome browser while keeping microphone audio on the device. The existing browser speech APIs are absent there, so the native-API-only path cannot provide voice input.

## User flow

1. Pressing `A` opens the existing question sheet and lazily loads a small English ASR model. On first use, show download progress and explain that the model is downloaded once; keep text entry available while it loads. If the user chooses text entry, do not request microphone access.
2. When the model is ready, if voice input is still selected, request microphone access. If granted, capture one utterance and show an accessible **Finish speaking** control. Finishing stops the microphone, transcribes locally, and passes the transcript to the existing `askQuestion` flow.
3. Show and speak the answer using the current implementation. Keep the transcript visible so the user knows what was recognized.
4. `Escape` cancels the interaction, stops every microphone track, discards any pending result, closes the sheet, and pauses exploration. A model download already in progress may finish and cache, but cannot update the closed sheet. A user can choose typed input at any time.

## Architecture

- Use Transformers.js with the English Whisper Tiny ONNX model, loaded only when the user presses `A`. Pin the model revision and rely on the library's browser cache for later use. First use downloads roughly 52 MB of model weights; the app's initial bundle must not include the model runtime or weights.
- Capture through `getUserMedia` and `MediaRecorder`; decode and prepare the recorded audio in the browser, then run the ASR pipeline locally. Never send recorded audio or transcripts to the model host.
- Keep the existing region-aware `askQuestion` function and text fallback. The browser SpeechRecognition API is not used as a second engine; one local model path avoids inconsistent behavior across browsers.

## Failure and privacy behavior

- The question sheet explains the first-use model download and its size. Model/network errors, unsupported audio decoding, denied microphone access, empty speech, and transcription errors all leave a working typed-input path.
- Request microphone access only after the user starts the voice flow. Stop tracks on finish, cancel, error, and component unmount. Audio buffers exist only for the active utterance and are discarded after transcription.
- Model files are fetched from Hugging Face on first use and cached by Transformers.js. The app requires a network connection for that first download; subsequent recognition uses the cached model. If the model is not cached and the device is offline, use typed input.
- Do not add cloud speech recognition, persistent audio storage, continuous listening, or language selection.

## Verification

- Unit-test audio preprocessing, transcription success, cancellation/track cleanup, and model/microphone failures.
- In-browser, verify model loading and typing fallback, the finish-speaking control, Escape cleanup, and an English sample utterance through local inference.
- Leave a real microphone permission and spoken-question test for the user; do not grant microphone permission automatically.

## References

- [Transformers.js pipeline documentation](https://huggingface.co/docs/transformers.js/main/en/pipelines)
- [Whisper Tiny English ONNX model files](https://huggingface.co/onnx-community/whisper-tiny.en-ONNX/tree/main/onnx)
- [Web Speech API compatibility and local-processing notes](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
