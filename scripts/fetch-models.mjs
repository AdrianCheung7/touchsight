// Downloads every model file TouchSight needs into public/models so the app runs offline.
// Usage: npm run models   (safe to re-run; files that already match their size are skipped)
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..", "public", "models");
const HF = (repo, file) => `https://huggingface.co/${repo}/resolve/main/${file}`;

const FLORENCE = "onnx-community/Florence-2-base-ft";
const florenceParts = ["vision_encoder", "embed_tokens", "encoder_model", "decoder_model_merged"];
const SLIMSAM = "Xenova/slimsam-77-uniform";

const files = [
  // Florence-2: config + tokenizer
  ...["config.json", "generation_config.json", "preprocessor_config.json", "tokenizer.json",
      "tokenizer_config.json", "special_tokens_map.json", "added_tokens.json", "vocab.json", "merges.txt"]
    .map((f) => [HF(FLORENCE, f), join(FLORENCE, f)]),
  // Florence-2 weights: q4f16 for WebGPU, q8 ("_quantized") for the WASM fallback
  ...florenceParts.flatMap((p) => ["q4f16", "quantized"].map((d) =>
    [HF(FLORENCE, `onnx/${p}_${d}.onnx`), join(FLORENCE, "onnx", `${p}_${d}.onnx`)])),
  // SlimSAM: config + fp16 (WebGPU) and quantized (WASM)
  ...["config.json", "preprocessor_config.json", "quantize_config.json"].map((f) => [HF(SLIMSAM, f), join(SLIMSAM, f)]),
  ...["vision_encoder", "prompt_encoder_mask_decoder"].flatMap((p) => ["fp16", "quantized"].map((d) =>
    [HF(SLIMSAM, `onnx/${p}_${d}.onnx`), join(SLIMSAM, "onnx", `${p}_${d}.onnx`)])),
  // Tesseract.js English data (OCR fallback)
  ["https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz", join("tesseract", "eng.traineddata.gz")],
];

let total = 0;
for (const [url, rel] of files) {
  const dest = join(ROOT, rel);
  mkdirSync(dirname(dest), { recursive: true });
  const head = await fetch(url, { method: "HEAD", redirect: "follow" });
  const size = Number(head.headers.get("content-length") || 0);
  if (existsSync(dest) && size && statSync(dest).size === size) {
    console.log(`skip  ${rel}`);
    total += size;
    continue;
  }
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  const got = statSync(dest).size;
  total += got;
  console.log(`done  ${rel}  ${(got / 1e6).toFixed(1)} MB`);
}
console.log(`\nAll models in public/models (${(total / 1e6).toFixed(0)} MB).`);
