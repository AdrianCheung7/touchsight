type Callout = { label: [number, number, number, number]; leaders: string[] }

// ponytail: image-pixel annotations cover the Animal cell only; trace other figures when they need visual callouts.
export const animalCellCallouts: Record<string, Callout> = {
  'plasma-membrane': { label: [630, 48, 115, 43], leaders: ['M 570 93 L 631 58'] },
  cytoplasm: { label: [98, 624, 83, 21], leaders: ['M 178 629 L 257 541'] },
  nucleus: { label: [58, 235, 76, 28], leaders: ['M 137 247 L 219 273'] },
  nucleolus: { label: [20, 292, 90, 27], leaders: ['M 108 307 L 261 332'] },
  chromatin: { label: [0, 359, 94, 28], leaders: ['M 93 373 L 231 373'] },
  'rough-endoplasmic-reticulum': { label: [9, 158, 173, 44], leaders: ['M 183 171 L 235 217'] },
  'smooth-endoplasmic-reticulum': { label: [671, 450, 142, 45], leaders: ['M 480 371 L 673 471'] },
  ribosomes: { label: [119, 97, 103, 29], leaders: ['M 221 108 L 308 151 M 223 110 L 258 191'] },
  mitochondrion: { label: [524, 0, 110, 29], leaders: ['M 519 10 L 443 82'] },
  'golgi-apparatus': { label: [0, 414, 73, 49], leaders: ['M 73 447 L 173 448'] },
  'golgi-vesicle': { label: [0, 480, 116, 29], leaders: ['M 112 504 L 194 477'] },
  vacuole: { label: [376, 625, 60, 20], leaders: ['M 321 554 L 371 633'] },
  peroxisome: { label: [563, 590, 81, 25], leaders: ['M 495 510 L 562 609'] },
  lysosome: { label: [669, 394, 80, 28], leaders: ['M 600 402 L 669 402'] },
  centrosome: { label: [698, 228, 97, 28], leaders: ['M 510 262 L 697 241'] },
  microtubule: { label: [685, 151, 95, 28], leaders: ['M 570 194 L 684 166'] },
  microfilament: { label: [698, 290, 114, 28], leaders: ['M 637 305 L 699 305'] },
  'intermediate-filament': { label: [176, 29, 110, 45], leaders: ['M 344 90 L 292 41'] },
  'secretory-vesicle': { label: [565, 532, 145, 32], leaders: ['M 544 495 L 561 517 L 562 534'] },
}
