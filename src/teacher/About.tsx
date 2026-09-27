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
    <main className="page pb-20 pt-10">
      <h1 tabIndex={-1} className="text-[34px] leading-[1.14] tracking-[-0.035em]">
        How TouchSight works
      </h1>
      <p className="mt-2 max-w-2xl text-muted">A blind student explores the layout of a diagram by sound, on a laptop trackpad, while their teacher prepares the diagrams and follows their progress.</p>

      <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section aria-labelledby="pipeline-h">
          <h2 id="pipeline-h" className="text-xl">
            From diagram to student
          </h2>
          <ol className="trail mt-4 border-t border-line">
            {PIPELINE.map(([title, text]) => (
              <li key={title} className="grid min-h-20 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-x-4 border-b border-line">
                <span className="trail-mark" aria-hidden="true" />
                <div className="py-3">
                  <h3 className="text-base tracking-[-0.01em]">{title}</h3>
                  <p className="mt-0.5 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="promises-h">
          <h2 id="promises-h" className="text-xl">
            What it promises
          </h2>
          <ul className="mt-4 border-t border-line">
            {CLAIMS.map(([big, text]) => (
              <li key={big} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-line py-5">
                <p className="text-[28px] font-semibold leading-none tracking-[-0.035em]">{big}</p>
                <p className="text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-14 grid gap-x-14 gap-y-12 border-t border-line pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section aria-labelledby="sources-h">
          <h2 id="sources-h" className="text-xl">
            Sources
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {SOURCES.map(([text, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="rounded-sm text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent-strong">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="credits-h">
          <h2 id="credits-h" className="text-xl">
            Credits
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-muted">
            <li>
              Animal cell: OpenStax, <cite>Anatomy &amp; Physiology</cite>, Rice University.{' '}
              <a className="rounded-sm text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent-strong" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
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
