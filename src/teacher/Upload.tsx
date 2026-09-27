// Part B. Upload (#/upload): a PNG/JPG becomes a new, empty figure, then opens in the editor.
import { useState } from 'react'
import { href } from '../contract/routes.ts'
import type { Figure } from '../contract/types.ts'
import { saveFigure } from '../data/db.ts'
import { Icon } from './Shell.tsx'
import { backLink, field, primaryBtn, secondaryBtn } from './ui.ts'

const MAX_BYTES = 10 * 1024 * 1024
const TYPES = ['image/png', 'image/jpeg']

interface Picked {
  image: string // data: URL
  width: number
  height: number
  name: string
}

// Trust boundary: check the type and size, then make sure it really decodes as an image.
async function readImage(file: File): Promise<Picked> {
  if (!TYPES.includes(file.type)) throw new Error(`“${file.name}” isn't a PNG or JPG image. Save the diagram as PNG or JPG and try again.`)
  if (file.size > MAX_BYTES) throw new Error(`“${file.name}” is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please use an image under 10 MB.`)
  const image = await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error(`“${file.name}” couldn't be read. Try saving it again.`))
    r.readAsDataURL(file)
  })
  const img = new Image()
  img.src = image
  await img.decode().catch(() => {
    throw new Error(`“${file.name}” couldn't be opened as an image. Try saving it again as PNG or JPG.`)
  })
  return { image, width: img.naturalWidth, height: img.naturalHeight, name: file.name }
}

const titleFrom = (name: string) => {
  const t = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export default function Upload() {
  const [picked, setPicked] = useState<Picked>()
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Science')
  const [grade, setGrade] = useState('Grade 5')

  const take = async (file?: File) => {
    if (!file) return
    setError('')
    try {
      const p = await readImage(file)
      setPicked(p)
      setTitle(titleFrom(p.name))
    } catch (e) {
      setPicked(undefined)
      setError((e as Error).message)
    }
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!picked || !title.trim()) return
    setBusy(true)
    const fig: Figure = {
      id: `upload-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      gradeBand: grade.trim(),
      image: picked.image,
      width: picked.width,
      height: picked.height,
      regions: [],
      updatedAt: new Date().toISOString(),
    }
    try {
      await saveFigure(fig)
      location.hash = href.edit(fig.id)
    } catch {
      setBusy(false)
      setError("The diagram couldn't be saved on this computer. The browser's storage may be full.")
    }
  }

  return (
    <main className="page pb-20 pt-8">
      <div className="max-w-[720px]">
        <a href={href.home()} className={backLink}>
          <Icon name="back" />
          Dashboard
        </a>
        <h1 tabIndex={-1} className="mt-6 text-[34px] leading-[1.14] tracking-[-0.035em]">
          Upload a diagram
        </h1>
        <p className="mt-2 text-muted">A PNG or JPG up to 10 MB. You'll trace its parts next.</p>

        <label
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            take(e.dataTransfer.files[0])
          }}
          className={`mt-8 flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-focus ${over ? 'border-accent bg-accent-soft' : 'border-accent/45 bg-surface hover:border-accent'}`}
        >
          {picked ? (
            <img src={picked.image} alt="" className="max-h-64 max-w-full rounded-lg border border-line bg-white object-contain" />
          ) : (
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" className="text-accent">
              <path d="M16 22V6m0 0l-6 6m6-6l6 6M6 26h20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span className="font-semibold">{picked ? `${picked.name} · ${picked.width} × ${picked.height}` : "Drop a diagram here, or choose a file"}</span>
          <span className="text-sm text-muted">{picked ? "Choose a different file" : "PNG or JPG, up to 10 MB"}</span>
          <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="sr-only" onChange={(e) => take(e.target.files?.[0])} />
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-accent bg-accent-soft px-4 py-3">
            {error}
          </p>
        )}

        {picked && (
          <form onSubmit={create} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Title</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">Subject</span>
                <input list="subjects" value={subject} onChange={(e) => setSubject(e.target.value)} className={field} />
                <datalist id="subjects">
                  <option value="Science" />
                  <option value="Social Studies" />
                  <option value="Math" />
                  <option value="Geography" />
                </datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">Grade</span>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className={field}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g}>Grade {g}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className={primaryBtn} disabled={busy || !title.trim()}>
                {busy ? 'Saving…' : 'Create and start tracing'}
              </button>
              <a href={href.home()} className={secondaryBtn}>
                Cancel
              </a>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
