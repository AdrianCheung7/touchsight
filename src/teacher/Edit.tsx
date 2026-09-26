// Part B. Teacher editor (#/edit/:id): trace, label and explain the parts of a diagram. Autosaves.
import QRCode from 'qrcode'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { href } from '../contract/routes.ts'
import type { Figure, Point, Region } from '../contract/types.ts'
import { explainRegion } from '../data/ai.ts'
import { getFigure, saveFigure } from '../data/db.ts'
import { exportSvg } from './exportSvg.ts'
import { anchorFor, area, hull, inside } from './shapes.ts'
import { primaryBtn, secondaryBtn } from './ui.ts'

const UNDO_LIMIT = 20
const EMPTY_HINT = 'Trace each part the student should find. Click around its edge; press Enter to close.'
const DRAW_HINT = 'Click around the edge of the part. Press Enter or click the first point to close. Escape cancels.'

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length
const isTyping = (e: Event) => e.target instanceof HTMLElement && !!e.target.closest('input, textarea, select')

// Figure + undo history in one pure reducer, so every edit and its snapshot stay in step.
interface State {
  fig: Figure
  undo: Region[][]
}
type Action = { type: 'change'; fn: (rs: Region[]) => Region[]; snapshot: boolean } | { type: 'undo' }

function reducer(s: State, a: Action): State {
  if (a.type === 'undo') {
    const prev = s.undo[s.undo.length - 1]
    return prev ? { fig: { ...s.fig, regions: prev }, undo: s.undo.slice(0, -1) } : s
  }
  return {
    fig: { ...s.fig, regions: a.fn(s.fig.regions) },
    undo: a.snapshot ? [...s.undo.slice(-(UNDO_LIMIT - 1)), s.fig.regions] : s.undo,
  }
}

// Keep the Tab/braille anchor if it's still inside; otherwise find a new one.
const withPolygon = (r: Region, polygon: Point[]): Region => ({
  ...r,
  polygon,
  labelAnchor: inside(r.labelAnchor, polygon) ? r.labelAnchor : anchorFor(polygon),
})

export default function Edit({ figureId }: { figureId: string }) {
  const [loaded, setLoaded] = useState<Figure | null>()
  useEffect(() => {
    getFigure(figureId).then((f) => setLoaded(f ?? null))
  }, [figureId])

  if (loaded === undefined) return <main className="mx-auto max-w-[1100px] px-6 py-12" aria-busy="true" />
  if (loaded === null) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <h1 tabIndex={-1} className="text-4xl tracking-tight">
          Diagram not found
        </h1>
        <a href={href.home()} className="mt-6 inline-block underline underline-offset-4">
          Back to the dashboard
        </a>
      </main>
    )
  }
  return <Editor initial={loaded} />
}

function Editor({ initial }: { initial: Figure }) {
  const figureId = initial.id
  const [{ fig, undo }, dispatch] = useReducer(reducer, { fig: initial, undo: [] })
  const [sel, setSel] = useState<string[]>([])
  const [vertex, setVertex] = useState<number | null>(null)
  // An empty upload starts straight in Draw mode.
  const [drawing, setDrawing] = useState<Point[] | null>(initial.regions.length === 0 ? [] : null)
  const [writing, setWriting] = useState<string[]>([])
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [saved, setSaved] = useState(true)
  const [scale, setScale] = useState(1) // image px per screen px
  const [exporting, setExporting] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const figRef = useRef(initial)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const dirty = useRef(false)
  const drag = useRef<{ id: string; i: number; moved: boolean } | null>(null)
  const typingSnapshot = useRef(false)
  const labelRef = useRef<HTMLInputElement>(null)

  useEffect(() => h1Ref.current?.focus({ preventScroll: true }), [])

  // Autosave, debounced 500 ms; flushed before Preview and when leaving the editor.
  const flush = useCallback(async () => {
    if (!dirty.current) return
    dirty.current = false
    await saveFigure(figRef.current)
    setSaved(true)
  }, [])
  useEffect(() => {
    figRef.current = fig
    if (!dirty.current) return
    setSaved(false)
    const t = setTimeout(flush, 500)
    return () => clearTimeout(t)
  }, [fig, flush])
  useEffect(() => () => void flush(), [flush])

  // Handles stay the same on-screen size at any zoom.
  useEffect(() => {
    const svg = svgRef.current!
    const w = initial.width
    const ro = new ResizeObserver(() => setScale(w / (svg.getBoundingClientRect().width || w)))
    ro.observe(svg)
    return () => ro.disconnect()
  }, [initial.width])

  const change = (fn: (rs: Region[]) => Region[], snapshot = true) => {
    dirty.current = true
    dispatch({ type: 'change', fn, snapshot })
  }
  const updateRegion = (id: string, patch: Partial<Region>, snapshot = true) =>
    change((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)), snapshot)
  const editPolygon = (id: string, fn: (poly: Point[]) => Point[], snapshot = true) =>
    change((rs) => rs.map((r) => (r.id === id ? withPolygon(r, fn(r.polygon)) : r)), snapshot)
  const undoLast = () => {
    dirty.current = true
    setVertex(null)
    dispatch({ type: 'undo' })
  }

  const selected = sel.length === 1 ? fig.regions.find((r) => r.id === sel[0]) : undefined
  // Larger parts first, so smaller ones sit on top and take the click (as in the explorer, smallest wins).
  const ordered = [...fig.regions].sort((a, b) => area(b.polygon) - area(a.polygon))
  const handle = 6 * scale

  const clamp = (p: Point): Point => [Math.round(Math.min(fig.width, Math.max(0, p[0]))), Math.round(Math.min(fig.height, Math.max(0, p[1])))]
  const toImage = (e: { clientX: number; clientY: number }): Point => {
    const r = svgRef.current!.getBoundingClientRect()
    return clamp([((e.clientX - r.left) * fig.width) / r.width, ((e.clientY - r.top) * fig.height) / r.height])
  }

  function finishDrawing() {
    if (!drawing || drawing.length < 3) return
    const taken = new Set(fig.regions.map((r) => r.id))
    let n = fig.regions.length + 1
    while (taken.has(`part-${n}`)) n++
    const region: Region = { id: `part-${n}`, label: `Part ${n}`, polygon: drawing, labelAnchor: anchorFor(drawing), explanation: '', origin: 'teacher' }
    change((rs) => [...rs, region])
    setDrawing(null)
    setSel([region.id])
    setVertex(null)
    setTimeout(() => labelRef.current?.select())
  }

  function deleteSelected() {
    if (sel.length === 0) return
    if (vertex !== null && selected) {
      if (selected.polygon.length > 3) editPolygon(selected.id, (poly) => poly.filter((_, i) => i !== vertex))
      setVertex(null)
      return
    }
    change((rs) => rs.filter((r) => !sel.includes(r.id)))
    setSel([])
  }

  // ponytail: hull over-covers concave shapes — polygon-clipping lib if needed
  const merge = () => {
    const [keep, ...rest] = sel
    change((rs) => {
      const polygon = hull(rs.filter((r) => sel.includes(r.id)).flatMap((r) => r.polygon))
      return rs.filter((r) => !rest.includes(r.id)).map((r) => (r.id === keep ? { ...r, polygon, labelAnchor: anchorFor(polygon) } : r))
    })
    setSel([keep])
    setVertex(null)
  }

  const draft = async (region: Region) => {
    setWriting((w) => [...w, region.id])
    const text = await explainRegion(fig, region)
    setWriting((w) => w.filter((x) => x !== region.id))
    updateRegion(region.id, { explanation: text, origin: 'ai' })
  }

  const draftAllMissing = async () => {
    const missing = fig.regions.filter((r) => !r.explanation.trim())
    setProgress({ done: 0, total: missing.length })
    for (const [i, r] of missing.entries()) {
      await draft(r)
      setProgress({ done: i + 1, total: missing.length })
    }
    setTimeout(() => setProgress(null), 1500)
  }

  const preview = async () => {
    await flush()
    location.hash = href.explore(figureId)
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(fig, null, 2)], { type: 'application/json' }))
    Object.assign(document.createElement('a'), { href: url, download: `${figureId}.json` }).click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const pick = (id: string, additive: boolean) => {
    setVertex(null)
    setSel((s) => (additive ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]))
  }

  const onSvgPointerDown = (e: React.PointerEvent) => {
    if (drawing) {
      const p = toImage(e)
      const first = drawing[0]
      if (drawing.length >= 3 && Math.hypot(p[0] - first[0], p[1] - first[1]) < 10 * scale) finishDrawing()
      else setDrawing([...drawing, p])
    } else if (e.target === e.currentTarget || (e.target as Element).tagName === 'image') {
      setSel([])
      setVertex(null)
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = toImage(e)
    editPolygon(d.id, (poly) => poly.map((q, i) => (i === d.i ? p : q)), !d.moved)
    d.moved = true
  }

  const nudge = (e: React.KeyboardEvent, id: string, i: number) => {
    const step = e.shiftKey ? 10 : 1
    const delta = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, Point>)[e.key]
    if (!delta) return
    e.preventDefault()
    editPolygon(id, (poly) => poly.map((q, j) => (j === i ? clamp([q[0] + delta[0], q[1] + delta[1]]) : q)))
  }

  useEffect(() => {
    // Editor keys (ignored while typing in a field, or if pointer lock is somehow active).
    const onKey = (e: KeyboardEvent) => {
      if (document.pointerLockElement || isTyping(e)) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undoLast()
      } else if (e.key === 'Enter' && drawing) {
        e.preventDefault()
        finishDrawing()
      } else if (e.key === 'Escape') {
        if (drawing) setDrawing(null)
        else {
          setSel([])
          setVertex(null)
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !drawing && sel.length) {
        e.preventDefault()
        deleteSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const missingCount = fig.regions.filter((r) => !r.explanation.trim()).length

  return (
    <main className="mx-auto grid max-w-[1100px] gap-8 px-6 pb-24 pt-8 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h1 ref={h1Ref} tabIndex={-1} className="text-3xl tracking-tight">
            {fig.title}
          </h1>
          <span className="text-muted">{saved ? 'All changes saved' : 'Saving…'}</span>
        </div>
        <p className="mb-3 min-h-6 text-muted">
          {drawing ? (fig.regions.length === 0 ? EMPTY_HINT : DRAW_HINT) : 'Select a part to edit it. Drag its points; double-click an edge to add one. Shift-click to select several.'}
        </p>
        <div className="relative overflow-hidden rounded-xl border border-line bg-white" style={{ aspectRatio: `${fig.width} / ${fig.height}` }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${fig.width} ${fig.height}`}
            className={`absolute inset-0 h-full w-full touch-none select-none ${drawing ? 'cursor-crosshair' : ''}`}
            onPointerDown={onSvgPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          >
            <title>{`${fig.title}, ${fig.regions.length} traced parts`}</title>
            <image href={fig.image} width={fig.width} height={fig.height} />
            {ordered.map((r) => {
              const on = sel.includes(r.id)
              return (
                <polygon
                  key={r.id}
                  points={r.polygon.join(' ')}
                  className={on ? 'fill-accent/25 stroke-accent' : 'fill-accent/5 stroke-ink/60 hover:fill-accent/15'}
                  strokeWidth={on ? 2.5 : 1.25}
                  vectorEffect="non-scaling-stroke"
                  style={{ pointerEvents: drawing ? 'none' : undefined, cursor: 'pointer' }}
                  onPointerDown={(e) => {
                    if (drawing) return
                    e.stopPropagation()
                    pick(r.id, e.shiftKey || e.ctrlKey || e.metaKey)
                  }}
                >
                  <title>{r.label}</title>
                </polygon>
              )
            })}
            {selected &&
              !drawing &&
              selected.polygon.map((p, i) => {
                const q = selected.polygon[(i + 1) % selected.polygon.length]
                return (
                  <line
                    key={`e${i}`}
                    x1={p[0]}
                    y1={p[1]}
                    x2={q[0]}
                    y2={q[1]}
                    stroke="transparent"
                    strokeWidth={10 * scale}
                    style={{ cursor: 'copy' }}
                    onDoubleClick={(e) => {
                      const at = toImage(e)
                      editPolygon(selected.id, (poly) => [...poly.slice(0, i + 1), at, ...poly.slice(i + 1)])
                      setVertex(i + 1)
                    }}
                  />
                )
              })}
            {selected &&
              !drawing &&
              selected.polygon.map((p, i) => (
                <circle
                  key={`v${i}`}
                  cx={p[0]}
                  cy={p[1]}
                  r={handle}
                  tabIndex={0}
                  role="button"
                  aria-label={`${selected.label}, point ${i + 1} of ${selected.polygon.length}. Arrow keys move it, Delete removes it.`}
                  className={vertex === i ? 'fill-accent stroke-paper' : 'fill-paper stroke-accent'}
                  strokeWidth={2 * scale}
                  style={{ cursor: 'grab' }}
                  onFocus={() => setVertex(i)}
                  onKeyDown={(e) => nudge(e, selected.id, i)}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    setVertex(i)
                    drag.current = { id: selected.id, i, moved: false }
                    svgRef.current?.setPointerCapture(e.pointerId)
                  }}
                />
              ))}
            {drawing && drawing.length > 0 && (
              <g className="pointer-events-none">
                <polyline points={drawing.join(' ')} fill="none" className="stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                {drawing.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 ? handle * 1.4 : handle * 0.8} className={i === 0 ? 'fill-accent' : 'fill-ink'} />
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>

      <aside aria-label="Parts" className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryBtn} onClick={preview}>
            Preview as student
          </button>
          <button type="button" className={secondaryBtn} aria-pressed={!!drawing} onClick={() => setDrawing(drawing ? null : [])}>
            {drawing ? 'Cancel drawing' : 'Draw new'}
          </button>
          {drawing && (
            <button type="button" className={secondaryBtn} disabled={drawing.length < 3} onClick={finishDrawing}>
              Close shape
            </button>
          )}
        </div>

        <section aria-labelledby="parts-h">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="parts-h" className="text-xl">
              Parts <span className="font-sans text-base font-normal text-muted">({fig.regions.length})</span>
            </h2>
            <button
              type="button"
              className="rounded-sm text-muted underline-offset-4 hover:text-ink hover:underline disabled:no-underline disabled:opacity-50"
              disabled={undo.length === 0}
              onClick={undoLast}
            >
              Undo
            </button>
          </div>
          {fig.regions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-4 text-muted">{EMPTY_HINT}</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto rounded-xl border border-line">
              {fig.regions.map((r) => (
                <li key={r.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={sel.includes(r.id)}
                    onClick={(e) => pick(r.id, e.shiftKey || e.ctrlKey || e.metaKey)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left ${sel.includes(r.id) ? 'bg-accent/10' : 'hover:bg-line/40'}`}
                  >
                    <span className="truncate">{r.label}</span>
                    {writing.includes(r.id) ? (
                      <Spinner />
                    ) : r.origin === 'ai' ? (
                      <DraftBadge compact />
                    ) : (
                      !r.explanation.trim() && <span className="shrink-0 text-muted">No explanation</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={secondaryBtn} disabled={sel.length < 2} onClick={merge}>
              {sel.length >= 2 ? `Merge ${sel.length} parts` : 'Merge'}
            </button>
            <button type="button" className={secondaryBtn} disabled={sel.length === 0} onClick={deleteSelected}>
              {vertex !== null && selected ? 'Delete point' : 'Delete'}
            </button>
            <button type="button" className={secondaryBtn} disabled={!!progress || missingCount === 0} onClick={draftAllMissing}>
              {progress ? `Writing ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : 'Write all missing'}
            </button>
          </div>
        </section>

        {selected && (
          <section aria-label={`Edit ${selected.label}`} className="flex flex-col gap-4 rounded-xl border border-line p-4">
            <label className="flex flex-col gap-1">
              <span className="text-muted">Name</span>
              <input
                ref={labelRef}
                value={selected.label}
                onFocus={() => (typingSnapshot.current = true)}
                onChange={(e) => {
                  updateRegion(selected.id, { label: e.target.value }, typingSnapshot.current)
                  typingSnapshot.current = false
                }}
                className="rounded-md border border-line bg-paper px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="flex items-center justify-between gap-2 text-muted">
                Explanation
                {selected.origin === 'ai' && <DraftBadge />}
              </span>
              <textarea
                rows={4}
                value={selected.explanation}
                onFocus={() => (typingSnapshot.current = true)}
                onChange={(e) => {
                  updateRegion(selected.id, { explanation: e.target.value, origin: 'teacher' }, typingSnapshot.current)
                  typingSnapshot.current = false
                }}
                className="resize-y rounded-md border border-line bg-paper px-3 py-2"
                aria-describedby="word-count"
              />
              <span id="word-count" className={words(selected.explanation) > 30 ? 'text-accent' : 'text-muted'}>
                {words(selected.explanation)} / 30 words
              </span>
            </label>
            <button type="button" className={secondaryBtn} disabled={writing.includes(selected.id)} onClick={() => draft(selected)}>
              {writing.includes(selected.id) ? (
                <>
                  <Spinner />
                  <span className="ml-2">Writing…</span>
                </>
              ) : (
                'Draft explanation'
              )}
            </button>
          </section>
        )}

        <div className="flex flex-wrap gap-2 border-t border-line pt-6">
          <button type="button" className={secondaryBtn} onClick={() => setExporting(true)}>
            Export swell-paper SVG
          </button>
          <button type="button" className={secondaryBtn} onClick={download}>
            Download JSON
          </button>
        </div>
        {exporting && <ExportDialog fig={fig} onClose={() => setExporting(false)} />}
      </aside>
    </main>
  )
}

// Swell-paper preview + download, and a QR code that opens this diagram in the explorer.
function ExportDialog({ fig, onClose }: { fig: Figure; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [{ url, keys }] = useState(() => {
    const { svg, keys } = exportSvg(fig)
    return { url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, keys }
  })
  const [qr, setQr] = useState('')
  const link = `${location.origin}${location.pathname}${href.explore(fig.id)}`

  useEffect(() => {
    ref.current?.showModal()
    QRCode.toDataURL(link, { margin: 1, width: 176 }).then(setQr, () => setQr(''))
  }, [link])

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="export-h" className="m-auto w-[min(920px,calc(100vw-32px))] rounded-xl border border-line bg-paper p-0 text-ink backdrop:bg-ink/40">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <h2 id="export-h" className="text-2xl tracking-tight">
            Swell-paper SVG
          </h2>
          <p className="mt-1 text-muted">
            US Letter with a braille title.{' '}
            {keys.length ? `${keys.length} of ${fig.regions.length} labels are too long for their part, so they get braille key numbers, listed on page 2.` : 'Every part is labelled in braille.'}
          </p>
          <img src={url} alt={`Tactile version of ${fig.title}`} className="mt-4 max-h-[60vh] w-full rounded-md border border-line bg-white object-contain object-top" />
        </div>
        <div className="flex flex-col gap-3">
          <a className={primaryBtn} href={url} download={`${fig.id}-swell-paper.svg`}>
            Download SVG
          </a>
          {qr && <img src={qr} alt="" width={176} height={176} className="self-center rounded-md border border-line bg-white p-1" />}
          <p className="text-muted">Scan to open this diagram in the explorer.</p>
          <form method="dialog" className="mt-auto">
            <button className={`${secondaryBtn} w-full`}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

function DraftBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2 text-muted">
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12l-1.4-4.6L0 6l4.6-1.4z" fill="currentColor" />
      </svg>
      {compact ? 'Draft' : 'Draft — check it'}
    </span>
  )
}

function Spinner() {
  return <span aria-hidden="true" className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent" />
}
