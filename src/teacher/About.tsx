// Part B. About (#/about): how it works, the three claims, credits and sources.
const PIPELINE = [
  ['Diagram', 'Any textbook picture, uploaded as a PNG or JPG.'],
  ['Teacher traces', 'Click around each part and write one grade-5 sentence.'],
  ['Figure data', 'Outlines, names and explanations, saved on this laptop.'],
  ['Sound & speech', 'Left–right is stereo, up–down is pitch, and each part says its name.'],
  ['Braille', 'The same outlines become a swell-paper page with braille labels.'],
]

const CLAIMS = [
  ['$0', 'Runs on the school laptop the student already has. No special hardware.'],
  ['Offline', 'Works with no internet connection, in any classroom.'],
  ['Private', 'Student progress is stored on this device and never leaves it.'],
]

const SOURCES: [string, string][] = [
  ['CNIB: 65% of blind and partially sighted youth graduate high school, against 81% of their sighted peers', 'https://www.cnib.ca/en/news/cnib-response-policy-accessible-education-students-disabilities'],
  ['APH: transcribed textbooks arrive in phases over months', 'https://www.aph.org/blog/frequently-asked-questions-transcribing-textbooks-for-the-american-printing-house-for-the-blind/'],
  ['Jayant et al., Tactile Graphics Assistant: about 10 minutes per figure even with assistance', 'https://dl.acm.org/doi/10.1145/1296843.1296858'],
  ['APH Monarch refreshable tactile display: about $15,000–19,000', 'https://www.aph.org/product/monarch/'],
  ['About half of science textbook page space is visual (Lee 2010)', 'https://files.eric.ed.gov/fulltext/EJ1269250.pdf'],
  ['ImageExplorer (CHI 2022): touch exploration of images', 'https://dl.acm.org/doi/10.1145/3491102.3501966'],
  ['Sonified maps are recognised similarly by blind and blindfolded people', 'https://link.springer.com/chapter/10.1007/978-3-642-02710-9_62'],
]

export default function About() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-12">
      <h1 tabIndex={-1} className="text-4xl tracking-tight">
        How TouchSight works
      </h1>
      <p className="mt-2 max-w-2xl text-muted">A blind student explores the layout of a diagram by sound, on a laptop trackpad, while their teacher prepares the diagrams and follows their progress.</p>

      <ol aria-label="From diagram to student" className="mt-10 grid gap-3 md:grid-cols-5">
        {PIPELINE.map(([title, text], i) => (
          <li key={title} className="relative flex flex-col gap-2 rounded-xl border border-line p-5">
            <span className="font-mono text-muted">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="text-xl">{title}</h2>
            <p className="text-muted">{text}</p>
            {i < PIPELINE.length - 1 && (
              <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 bg-paper text-accent md:block">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <ul aria-label="Promises" className="mt-12 grid gap-8 border-y border-line py-10 md:grid-cols-3">
        {CLAIMS.map(([big, text]) => (
          <li key={big}>
            <p className="font-serif text-5xl font-semibold tracking-tight">{big}</p>
            <p className="mt-2 text-muted">{text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
        <section aria-labelledby="sources-h">
          <h2 id="sources-h" className="text-2xl tracking-tight">
            Sources
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {SOURCES.map(([text, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="rounded-sm underline decoration-line underline-offset-4 hover:decoration-ink">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="credits-h">
          <h2 id="credits-h" className="text-2xl tracking-tight">
            Credits
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-muted">
            <li>
              Animal cell: OpenStax, <cite>Anatomy &amp; Physiology</cite>, Rice University.{' '}
              <a className="underline underline-offset-4" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
                CC BY 4.0
              </a>
              .
            </li>
            <li>Map of Canada: Wikimedia Commons, public domain.</li>
            <li>Built with React, Vite, Tailwind CSS, idb-keyval and qrcode (MIT licences), plus the browser's Web Audio, Pointer Lock and Speech APIs.</li>
            <li>Made at HelloHacks 2026, UBC.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
