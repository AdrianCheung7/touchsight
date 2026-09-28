// Records the real TouchSight build: CDP screencast frames + the app's own Web Audio (teed into a MediaRecorder).
// Writes frames/*.jpg + frames.json (epoch timestamps), app.webm (+ t0), marks.json.
const { chromium } = require('playwright-core')
const fs = require('fs')
const path = require('path')
const OUT = __dirname
const B = 'http://localhost:4173/'
const cell = require('C:/Users/adijo/OneDrive/Desktop/touchsight/src/data/figures/animal-cell.json')
const S = 1.5 // deviceScaleFactor: 1280x720 CSS -> 1920x1080 frames

const marks = []
const mark = (name) => { marks.push({ name, t: Date.now() / 1000 }); console.log('mark', name) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const overlay = (polys) => {
  // ---------- speech -> captions, audio tap ----------
  let locked = null
  Object.defineProperty(Document.prototype, 'pointerLockElement', { get: () => locked, configurable: true })
  Element.prototype.requestPointerLock = function () { locked = this; queueMicrotask(() => document.dispatchEvent(new Event('pointerlockchange'))); return Promise.resolve() }
  Document.prototype.exitPointerLock = function () { locked = null; queueMicrotask(() => document.dispatchEvent(new Event('pointerlockchange'))) }
  Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined, configurable: true })
  Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true })
  window.__said = []
  window.__capOn = false
  speechSynthesis.speak = (u) => {
    window.__said.push({ text: u.text, t: Date.now() / 1000 })
    if (window.__capOn) window.__caption(u.text)
    const ms = Math.max(650, (u.text.length * 62) / (u.rate || 1))
    clearTimeout(window.__speakT)
    window.__speakT = setTimeout(() => u.onend?.(new Event('end')), ms)
  }
  speechSynthesis.cancel = () => clearTimeout(window.__speakT)

  const connect = AudioNode.prototype.connect
  AudioNode.prototype.connect = function (dest, ...rest) {
    if (dest instanceof AudioDestinationNode) {
      const ctx = this.context
      if (!ctx.__tap) {
        ctx.__tap = ctx.createMediaStreamDestination()
        const rec = new MediaRecorder(ctx.__tap.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 256000 })
        const chunks = []
        rec.ondataavailable = (e) => chunks.push(e.data)
        rec.onstart = () => { window.__recT0 = Date.now() / 1000 }
        rec.start(250)
        window.__stopRec = () => new Promise((res) => {
          rec.onstop = async () => {
            const buf = new Uint8Array(await new Blob(chunks).arrayBuffer())
            let s = ''
            for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000))
            res(btoa(s))
          }
          rec.stop()
        })
      }
      connect.call(this, ctx.__tap)
    }
    return connect.call(this, dest, ...rest)
  }

  // ---------- overlay layer (on <html>, outside <body>, so body zooms don't touch it) ----------
  const css = `
  #dv{position:fixed;inset:0;z-index:2147483000;pointer-events:none;font-family:-apple-system,"SF Pro Display","Segoe UI Variable Display","Segoe UI",system-ui,sans-serif;color:#fff}
  #dv *{box-sizing:border-box}
  .dv-fade{transition:opacity .45s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
  #dv-card{position:absolute;inset:0;background:#0A1430;opacity:0;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center}
  #dv-card .k{font-size:15px;letter-spacing:.32em;text-transform:uppercase;color:#7FB2FF;margin-bottom:22px;font-weight:600}
  #dv-card h1{font-size:64px;line-height:1.08;font-weight:700;letter-spacing:-.02em;margin:0;max-width:1050px}
  #dv-card h1 em{font-style:normal;color:#4C9BFF}
  #dv-card p{font-size:24px;color:#B8C6E3;margin:22px 0 0;max-width:900px;line-height:1.4}
  #dv-card .src{position:absolute;bottom:34px;font-size:13px;color:#6B7DA3;letter-spacing:.02em}
  .dv-in{animation:dvIn .7s cubic-bezier(.2,.7,.2,1) both}
  @keyframes dvIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
  #dv-cap{position:absolute;left:50%;bottom:92px;transform:translateX(-50%);max-width:960px;background:rgba(6,12,30,.86);border:1px solid rgba(127,178,255,.35);border-radius:16px;padding:12px 22px;font-size:25px;line-height:1.35;opacity:0;display:flex;gap:14px;align-items:flex-start;box-shadow:0 12px 40px rgba(0,0,0,.35)}
  #dv-cap .i{color:#4C9BFF;flex:none;font-size:22px;margin-top:2px}
  #dv-hud{position:absolute;left:22px;bottom:22px;width:268px;background:rgba(6,12,30,.84);border:1px solid rgba(127,178,255,.3);border-radius:16px;padding:14px 16px;opacity:0;font-size:12px;letter-spacing:.08em;color:#9FB3D9}
  #dv-hud .row{display:flex;align-items:center;justify-content:space-between;margin:4px 0}
  #dv-hud .lab{font-weight:600;text-transform:uppercase}
  #dv-hud .v{color:#fff;font-variant-numeric:tabular-nums;letter-spacing:0;font-size:14px}
  #dv-hud .bar{position:relative;height:6px;background:rgba(255,255,255,.12);border-radius:3px;margin:6px 0 10px}
  #dv-hud .bar b{position:absolute;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#4C9BFF;box-shadow:0 0 12px #4C9BFF}
  #dv-hud .in{font-size:17px;color:#fff;letter-spacing:0;font-weight:600;margin-top:2px;min-height:22px}
  #dv-hud .snd{display:flex;gap:8px;align-items:center;color:#fff;font-weight:700;margin-bottom:8px}
  #dv-hud .eq{display:inline-flex;gap:2px;align-items:flex-end;height:14px}
  #dv-hud .eq i{width:3px;background:#4C9BFF;border-radius:1px;animation:eq .9s ease-in-out infinite}
  @keyframes eq{0%,100%{height:3px}50%{height:14px}}
  #dv-tip{position:absolute;top:74px;left:50%;transform:translateX(-50%);opacity:0;background:#0579FB;color:#fff;border-radius:999px;padding:10px 24px;font-size:24px;font-weight:700;box-shadow:0 10px 30px rgba(5,121,251,.45);white-space:nowrap}
  #dv-pipe{position:absolute;top:70px;right:24px;width:330px;background:rgba(6,12,30,.9);border:1px solid rgba(127,178,255,.35);border-radius:16px;padding:16px 18px;opacity:0;font-size:13px;color:#9FB3D9}
  #dv-pipe .st{border-left:3px solid #4C9BFF;padding:6px 0 6px 12px;margin:8px 0}
  #dv-pipe .st b{display:block;color:#fff;font-size:15px}
  #dv-pipe code{font-family:ui-monospace,Consolas,monospace;color:#7FB2FF;font-size:14px}
  #dv-pipe .arrow{color:#4C9BFF;text-align:center;line-height:1}
  #dv-trail{position:absolute;inset:0;width:100%;height:100%;opacity:0}
  #dv-mouse{position:absolute;left:0;top:0;width:26px;height:26px;opacity:0;transition:opacity .3s}
  #dv-ring{position:absolute;border:3px solid #0579FB;border-radius:14px;opacity:0;box-shadow:0 0 0 6px rgba(5,121,251,.18);transition:all .5s cubic-bezier(.2,.7,.2,1)}
  #dv-badge{position:absolute;top:18px;right:22px;background:rgba(6,12,30,.84);border:1px solid rgba(127,178,255,.3);border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;opacity:0}
  `
  const build = () => {
    if (document.getElementById('dv')) return
    const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st)
    const root = document.createElement('div'); root.id = 'dv'
    root.innerHTML = `<canvas id="dv-trail"></canvas><div id="dv-ring"></div>
      <div id="dv-hud" class="dv-fade"><div class="snd"><span class="eq"><i></i><i style="animation-delay:.2s"></i><i style="animation-delay:.4s"></i><i style="animation-delay:.1s"></i></span> SOUND ON</div>
        <div class="row"><span class="lab">Stereo pan</span><span class="v" id="dv-pan">0.00</span></div><div class="bar"><b id="dv-panb" style="left:50%"></b></div>
        <div class="row"><span class="lab">Pitch</span><span class="v" id="dv-hz">440 Hz</span></div><div class="bar"><b id="dv-hzb" style="left:50%"></b></div>
        <div class="row"><span class="lab">Inside</span></div><div class="in" id="dv-in">—</div></div>
      <div id="dv-pipe" class="dv-fade"><div style="font-weight:700;color:#fff;font-size:15px;letter-spacing:.06em">UNDER THE HOOD · LIVE</div>
        <div class="st"><b>1 · Point-in-polygon hit test</b><code id="dv-p1">—</code></div><div class="arrow">↓</div>
        <div class="st"><b>2 · Web Audio: stereo + pitch + timbre</b><code id="dv-p2">—</code></div><div class="arrow">↓</div>
        <div class="st"><b>3 · Speech names the part</b><code id="dv-p3">—</code></div>
        <div style="margin-top:10px;color:#6B7DA3">Runs in the browser. No server. No network.</div></div>
      <div id="dv-tip" class="dv-fade"></div><div id="dv-badge" class="dv-fade">🎧 Sound on</div>
      <div id="dv-cap" class="dv-fade"><span class="i">🔊</span><span id="dv-capt"></span></div>
      <svg id="dv-mouse" viewBox="0 0 24 24"><path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <div id="dv-card"></div>`
    document.documentElement.appendChild(root)
    const $ = (id) => document.getElementById(id)
    const area = (p) => Math.abs(p.reduce((a, [x, y], i) => { const [u, v] = p[(i + 1) % p.length]; return a + x * v - u * y }, 0) / 2)
    const inside = (p, [x, y]) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c } return c }
    const sorted = polys.slice().sort((a, b) => area(a.polygon) - area(b.polygon))
    window.__hit = (pt) => sorted.find((r) => inside(r.polygon, pt))
    const tr = $('dv-trail'); const g = tr.getContext('2d'); const trail = []
    const fit = () => { tr.width = innerWidth * devicePixelRatio; tr.height = innerHeight * devicePixelRatio }
    fit(); addEventListener('resize', fit)
    window.__cursor = () => {
      const svg = [...document.querySelectorAll('main svg')].find((s) => s.viewBox?.baseVal?.width > 100)
      const dots = svg?.querySelectorAll('circle'); const dot = dots?.[dots.length - 1]
      if (!dot) return null
      const r = dot.getBoundingClientRect(); const vb = svg.viewBox.baseVal
      return { fx: +dot.getAttribute('cx'), fy: +dot.getAttribute('cy'), w: vb.width, h: vb.height, sx: r.left + r.width / 2, sy: r.top + r.height / 2, svg }
    }
    const tick = () => {
      const c = window.__cursor()
      if (c) {
        const pan = Math.max(-1, Math.min(1, (2 * c.fx) / c.w - 1)); const hz = 220 * 4 ** (1 - Math.max(0, Math.min(1, c.fy / c.h)))
        const reg = window.__hit([c.fx, c.fy])
        $('dv-pan').textContent = (pan >= 0 ? '+' : '') + pan.toFixed(2); $('dv-panb').style.left = ((pan + 1) * 50) + '%'
        $('dv-hz').textContent = Math.round(hz) + ' Hz'; $('dv-hzb').style.left = (Math.log(hz / 220) / Math.log(4) * 100) + '%'
        $('dv-in').textContent = reg ? reg.label : 'Background'
        $('dv-p1').textContent = `(${Math.round(c.fx)}, ${Math.round(c.fy)}) → ${reg ? reg.id : 'none'}`
        $('dv-p2').textContent = `pan ${pan.toFixed(2)} · ${Math.round(hz)} Hz`
        $('dv-p3').textContent = reg ? `speak("${reg.label}")` : '—'
        if (window.__trailOn) { trail.push([c.sx, c.sy, performance.now()]) }
      }
      g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight)
      const now = performance.now(); while (trail.length && now - trail[0][2] > 2600) trail.shift()
      g.lineCap = 'round'; g.lineJoin = 'round'
      for (let i = 1; i < trail.length; i++) { const a = 1 - (now - trail[i][2]) / 2600; g.strokeStyle = `rgba(76,155,255,${a * 0.9})`; g.lineWidth = 2 + 5 * a; g.beginPath(); g.moveTo(trail[i - 1][0], trail[i - 1][1]); g.lineTo(trail[i][0], trail[i][1]); g.stroke() }
      if (window.__trailOn && trail.length) { const [x, y] = trail[trail.length - 1]; g.fillStyle = '#fff'; g.shadowColor = '#4C9BFF'; g.shadowBlur = 24; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.shadowBlur = 0 }
      requestAnimationFrame(tick)
    }
    tick()
    addEventListener('mousemove', (e) => { const m = $('dv-mouse'); m.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)` }, true)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build()

  const $ = (id) => document.getElementById(id)
  const show = (id, on) => { const e = $(id); e.style.opacity = on ? 1 : 0 }
  window.__show = show
  window.__card = (html, bg) => { const c = $('dv-card'); if (bg) c.style.background = bg; if (html !== null) c.innerHTML = html; c.style.transition = 'opacity .5s'; c.style.opacity = 1 }
  window.__cardOff = (ms = 500) => { const c = $('dv-card'); c.style.transition = `opacity ${ms}ms`; c.style.opacity = 0 }
  let capT
  window.__caption = (text) => {
    const first = text.length > 150 ? text.split(/(?<=\.)\s/).slice(0, 2).join(' ') : text
    $('dv-capt').textContent = `“${first}”`; show('dv-cap', 1); clearTimeout(capT)
    capT = setTimeout(() => show('dv-cap', 0), Math.max(1400, first.length * 55))
  }
  window.__tip = (text) => { const t = $('dv-tip'); if (!text) return show('dv-tip', 0); t.textContent = text; show('dv-tip', 1) }
  window.__ring = (el, pad = 8) => { const r = $('dv-ring'); if (!el) { r.style.opacity = 0; return } const b = el.getBoundingClientRect(); Object.assign(r.style, { left: b.left - pad + 'px', top: b.top - pad + 'px', width: b.width + 2 * pad + 'px', height: b.height + 2 * pad + 'px', opacity: 1 }) }
  window.__figImg = (o) => document.querySelectorAll('main img, main svg image').forEach((e) => { e.style.transition = 'opacity .9s'; e.style.opacity = o })
  window.__zoom = (s, ox, oy, ms = 900) => { const b = document.body; b.style.transition = `transform ${ms}ms cubic-bezier(.3,.7,.2,1)`; b.style.transformOrigin = `${ox}px ${oy}px`; b.style.transform = s === 1 ? '' : `scale(${s})` }

  // Human-ish glide of the explorer's virtual cursor through figure points (closed loop on the drawn dot).
  window.__glide = (pts, ms, wob = 1) => new Promise((resolve) => {
    const c0 = window.__cursor(); if (!c0) return resolve()
    const P = [[c0.fx, c0.fy], ...pts]
    const cr = (p0, p1, p2, p3, t) => { const t2 = t * t, t3 = t2 * t; return [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) }
    const n = P.length - 1; const start = performance.now(); const seed = Math.random() * 100
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
    const step = () => {
      const u = Math.min(1, (performance.now() - start) / ms)
      const e = ease(u) * n; const i = Math.min(n - 1, Math.floor(e)); const t = e - i
      let [x, y] = cr(P[Math.max(0, i - 1)], P[i], P[i + 1], P[Math.min(n, i + 2)], t)
      const k = performance.now() / 1000 + seed; const damp = Math.sin(Math.PI * u)
      x += wob * damp * (3.2 * Math.sin(k * 5.3) + 1.6 * Math.sin(k * 11.7)); y += wob * damp * (2.6 * Math.sin(k * 4.1 + 1) + 1.4 * Math.sin(k * 13.1))
      const c = window.__cursor(); if (!c) return resolve()
      const svg = c.svg; const vb = svg.viewBox.baseVal; const stage = svg.getBoundingClientRect(); const scale = Math.min(stage.width / vb.width, stage.height / vb.height)
      const mx = Math.round((x - c.fx) * scale), my = Math.round((y - c.fy) * scale)
      if (mx || my) document.dispatchEvent(new PointerEvent('pointermove', { movementX: mx, movementY: my, bubbles: true }))
      if (u < 1) requestAnimationFrame(step); else setTimeout(resolve, 30)
    }
    step()
  })
}

;(async () => {
  fs.rmSync(path.join(OUT, 'frames'), { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'frames'))
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: S })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror', e.message))
  const polys = cell.regions.map(({ id, label, polygon }) => ({ id, label, polygon }))
  await page.addInitScript(overlay, polys)

  // Pristine data, then load dashboard behind the opening card.
  await page.goto(B + '#/')
  await page.evaluate(() => new Promise((r) => { localStorage.clear(); const q = indexedDB.deleteDatabase('keyval-store'); q.onsuccess = q.onerror = q.onblocked = () => r() }))
  await page.reload(); await sleep(800)
  const students = await page.locator('main a[href^="#/student/"]').evaluateAll((as) => as.map((a) => [a.getAttribute('href'), a.textContent]))
  console.log(students)

  // Screencast
  const cdp = await ctx.newCDPSession(page)
  const frames = []
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const f = `frames/${String(frames.length).padStart(5, '0')}.jpg`
    fs.writeFileSync(path.join(OUT, f), Buffer.from(data, 'base64'))
    frames.push({ f, t: metadata.timestamp })
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  const mouse = async (x, y, ms = 700) => { await page.evaluate(() => (document.getElementById('dv-mouse').style.opacity = 1)); await page.mouse.move(x, y, { steps: Math.round(ms / 16) }) }
  const E = (fn, ...a) => page.evaluate(fn, ...a)

  // Card helpers (HTML strings)
  const cardHook1 = `<img src="/figures/animal-cell.jpg" class="dv-in" id="hookimg" style="height:430px;border-radius:14px;margin-bottom:34px;transition:opacity 1.1s,filter 1.1s"><h1 class="dv-in" style="animation-delay:.25s;font-size:52px">Half of a science textbook is pictures.</h1>`
  const cardHook2 = `<h1 class="dv-in" style="font-weight:500;font-size:46px;color:#E6ECF8;max-width:980px">“The cell has a nucleus, a mitochondrion, and a membrane.”</h1><p class="dv-in" style="animation-delay:.5s;font-size:26px">For a blind student, that sentence <em style="color:#fff;font-style:normal;font-weight:700">is</em> the diagram.</p>`
  const cardStat1 = `<div class="k dv-in">In Canada</div>
    <div class="dv-in" style="display:flex;gap:70px;align-items:flex-end;animation-delay:.1s">
      <div><div style="font-size:120px;font-weight:800;letter-spacing:-.04em;color:#4C9BFF">65%</div><div style="font-size:20px;color:#B8C6E3">blind &amp; low-vision youth</div></div>
      <div style="font-size:30px;color:#6B7DA3;padding-bottom:50px">vs</div>
      <div><div style="font-size:120px;font-weight:800;letter-spacing:-.04em">81%</div><div style="font-size:20px;color:#B8C6E3">their sighted classmates</div></div></div>
    <p class="dv-in" style="animation-delay:.35s">finish high school.</p><div class="src">Source: CNIB</div>`
  const cardStat2 = `<div class="k dv-in">Today’s fix for diagrams</div>
    <div class="dv-in" style="display:flex;gap:80px;align-items:flex-end;animation-delay:.1s">
      <div><div style="font-size:112px;font-weight:800;letter-spacing:-.04em">Months</div><div style="font-size:20px;color:#B8C6E3">to hand-make tactile graphics</div></div>
      <div style="font-size:30px;color:#6B7DA3;padding-bottom:48px">or</div>
      <div><div style="font-size:112px;font-weight:800;letter-spacing:-.04em;color:#4C9BFF">$15,000</div><div style="font-size:20px;color:#B8C6E3">for a refreshable tactile display</div></div></div>
    <div class="src">Sources: American Printing House for the Blind (APH) · APH Monarch</div>`
  const cardReveal = `<h1 class="dv-in" style="font-size:60px">What if you could <em>hear</em><br>where things are?</h1>`
  const cardLogo = `<img src="/logo.png" class="dv-in" style="height:92px;margin-bottom:26px"><p class="dv-in" style="animation-delay:.3s;margin:0;font-size:26px;color:#E6ECF8">Any diagram, explored by sound, on the laptop a student already has.</p><div class="dv-in" style="animation-delay:.8s;margin-top:40px;border:1px solid rgba(127,178,255,.45);border-radius:999px;padding:10px 26px;font-size:20px;font-weight:600;color:#7FB2FF">🎧 Sound on</div>`

  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 })
  await sleep(300)
  // ===== HOOK =====
  await E((h) => window.__card(h, '#0A1430'), cardHook1); mark('hook1'); await sleep(2800)
  await E(() => { const i = document.getElementById('hookimg'); i.style.opacity = 0; i.style.filter = 'blur(8px)' }); mark('drain'); await sleep(1100)
  await E((h) => window.__card(h, '#05070D'), cardHook2); mark('hook2'); await sleep(3300)
  // ===== STAKES =====
  await E((h) => window.__card(h, '#0A1430'), cardStat1); mark('stat1'); await sleep(3800)
  await E((h) => window.__card(h), cardStat2); mark('stat2'); await sleep(3800)
  // ===== REVEAL =====
  await E((h) => window.__card(h, '#05070D'), cardReveal); mark('reveal'); await sleep(2200)
  await E((h) => window.__card(h, '#0A1430'), cardLogo); mark('logo'); await sleep(2600)
  // ===== DASHBOARD -> EXPLORE =====
  await E(() => window.__cardOff(450)); mark('dash'); await mouse(900, 420, 10); await sleep(400)
  await page.mouse.wheel(0, 0)
  await E(() => new Promise((r) => { const el = document.scrollingElement; const y0 = el.scrollTop, y1 = y0 + 330, t0 = performance.now(); const f = () => { const u = Math.min(1, (performance.now() - t0) / 700); el.scrollTop = y0 + (y1 - y0) * (1 - (1 - u) ** 3); u < 1 ? requestAnimationFrame(f) : r() }; f() }))
  const launch = page.locator('main a[href="#/explore/animal-cell?student=s6"]').first()
  const lb = await launch.boundingBox()
  await mouse(lb.x + lb.width / 2, lb.y + lb.height / 2, 800); await sleep(250); mark('click-explore')
  await launch.click()
  await page.locator('main').getByText('Press Enter to start exploring').waitFor({ timeout: 5000 }); await E(() => (document.getElementById('dv-mouse').style.opacity = 0))
  await sleep(900); mark('explore-idle')
  await page.keyboard.press('Enter'); await sleep(600)
  await E(() => { window.__capOn = true; window.__show('dv-hud', 1); window.__show('dv-badge', 1) }); mark('explore')
  // stereo
  await E(() => window.__tip('← Left and right = stereo →')); mark('tip-stereo')
  await E(() => window.__glide([[40, 330]], 1300, 0.4)); await sleep(250)
  await E(() => window.__glide([[406, 336], [785, 330]], 2600, 0.4)); await sleep(250)
  // pitch
  await E(() => window.__tip('↑ Higher up = higher pitch')); mark('tip-pitch')
  await E(() => window.__glide([[600, 400], [470, 615]], 1300, 0.4)); await sleep(250)
  await E(() => window.__glide([[465, 320], [460, 25]], 2600, 0.4)); await sleep(250)
  // parts
  await E(() => window.__tip('Every part has its own sound, and says its name')); mark('tip-parts')
  await E(() => window.__glide([[330, 560]], 1100)); await sleep(1100)
  await E(() => window.__glide([[260, 470], [205, 440]], 1300)); await sleep(1200)
  await E(() => window.__glide([[240, 360], [262, 300]], 1300)); await sleep(1300)
  await E(() => window.__tip('')); mark('tech')
  // tech beat (live values)
  await E(() => window.__show('dv-pipe', 1))
  await E(() => window.__glide([[340, 300], [460, 340]], 1600)); await sleep(900)
  await E(() => window.__glide([[520, 260], [505, 245]], 1400)); await sleep(1100)
  await E(() => window.__glide([[570, 380], [590, 402]], 1300)); await sleep(1200)
  await E(() => window.__show('dv-pipe', 0)); mark('tech-end'); await sleep(500)
  // ===== FIND-IT =====
  mark('findit'); await page.keyboard.press('f')
  await page.waitForFunction(() => window.__said.some((s) => /^1$/.test(s.text)), null, { timeout: 20000 }); mark('count1')
  await sleep(1100); await E(() => { window.__figImg(0.035); window.__trailOn = true; window.__show('dv-hud', 1) }); mark('search')
  const mito = cell.regions.find((r) => r.id === 'mitochondrion').polygon
  const mc = mito.reduce((a, [x, y]) => [a[0] + x / mito.length, a[1] + y / mito.length], [0, 0])
  console.log('mito centroid', mc)
  await sleep(500)
  await E(() => window.__glide([[300, 330], [220, 250]], 1400)); await sleep(650)
  await E(() => window.__glide([[210, 170], [290, 95]], 1300)); await sleep(800)
  await E(() => window.__glide([[340, 170], [470, 215], [545, 190]], 1700)); await sleep(700)
  await E(() => window.__glide([[530, 120], [468, 96]], 1100)); await sleep(450)
  await E((m) => window.__glide([[m[0] + 6, m[1] + 4]], 700, 0.3), mc)
  await page.waitForFunction(() => /Found/.test(document.querySelector('main')?.textContent || ''), null, { timeout: 8000 }).catch(() => console.log('NOT FOUND'))
  mark('found'); await E(() => { window.__trailOn = false; window.__figImg(1) })
  const foundText = await page.locator('main').innerText(); console.log('found text', foundText.slice(0, 200))
  await sleep(2600); mark('found-hold-end')
  // explain + ask
  await page.keyboard.press('Space'); mark('explain'); await sleep(4200)
  await E(() => { window.__capOn = false; window.__show('dv-cap', 0) }); await page.keyboard.press('a'); await sleep(800); mark('ask')
  const typeBtn = page.getByRole('button', { name: /Type instead/i }).first()
  if (await typeBtn.count()) { await typeBtn.click(); await sleep(400) }
  const box = page.locator('main textarea, main input:not([type=range])').first()
  console.log('ask box', await box.count())
  if (await box.count()) { await box.pressSequentially('What does it do?', { delay: 55 }); await sleep(300); await page.keyboard.press('Enter') }
  await sleep(4600); mark('ask-end'); await page.screenshot({ path: 'chk-ask.png' })
  await page.keyboard.press('Escape'); await sleep(300); await page.keyboard.press('Escape'); await sleep(300)
  await E(() => { window.__capOn = false; window.__show('dv-hud', 0); window.__show('dv-badge', 0); window.__show('dv-cap', 0) })
  // ===== TEACHER LOOP =====
  mark('teacher'); await E(() => { location.hash = '#/' }); await sleep(900)
  await E(() => { document.scrollingElement.scrollTop = 330 }); await sleep(200)
  const row = page.locator('main a[href^="#/student/"]', { hasText: 'just now' }).first()
  console.log('row count', await row.count())
  await sleep(300)
  const rb = await row.boundingBox()
  if (rb) { await mouse(rb.x + rb.width * 0.4, rb.y + rb.height / 2, 800); await E(() => window.__ring([...document.querySelectorAll('main a[href^="#/student/"]')].find((a) => /just now/.test(a.textContent)))); await sleep(1600); await E(() => window.__ring(null)); await row.click() }
  await sleep(900); mark('student-page')
  await E(() => window.__ring(document.querySelector('ol.trail > li'))); await sleep(2400); await E(() => window.__ring(null)); mark('student-end')
  // ===== EDITOR =====
  await E(() => { location.hash = '#/edit/animal-cell' }); await sleep(1000); mark('edit')
  await mouse(975, 305, 700); await page.getByRole('button', { name: /^Nucleus/ }).first().click().catch(async () => { await page.getByText('Nucleus', { exact: true }).first().click() })
  await sleep(700)
  const handles = await page.locator('main svg circle').evaluateAll((cs) => cs.map((c) => { const b = c.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, b.width] }).filter((h) => h[2] > 3))
  console.log('handles', handles.length)
  if (handles.length) {
    const h = handles.reduce((a, b) => (b[0] > a[0] ? b : a))
    await mouse(h[0], h[1], 600); await page.mouse.down(); await page.mouse.move(h[0] + 34, h[1] - 14, { steps: 30 }); await sleep(200); await page.mouse.move(h[0] + 18, h[1] - 6, { steps: 15 }); await page.mouse.up()
  }
  await sleep(900); mark('edit-end')
  await mouse(1030, 665, 700); await page.getByRole('button', { name: 'Export swell-paper SVG' }).click(); await sleep(900); mark('export')
  await E(() => (document.getElementById('dv-mouse').style.opacity = 0))
  await E(() => window.__zoom(2.4, 505, 240, 1400)); await sleep(3000); mark('export-end')
  await E(() => window.__zoom(1, 505, 240, 10)); await page.keyboard.press('Escape'); await sleep(300)
  // ===== ABOUT / OFFLINE =====
  await E(() => { location.hash = '#/about' }); await sleep(1200); mark('about'); await sleep(2800); mark('about-end')
  // ===== END CARD =====
  const secs = (foundText.match(/(\d+:\d+|\d+(?:\.\d)?\s*s)/) || [''])[0]
  const cardClose = `<div class="k dv-in">Offline · $0 · No student data leaves the laptop</div><h1 class="dv-in" style="animation-delay:.2s;font-size:58px">Every student deserves to <em>explore</em><br>the same diagrams.</h1>`
  await E((h) => window.__card(h, '#0A1430'), cardClose); mark('close'); await sleep(3200)
  await E((h) => window.__card(h, '#0A1430'), `<img src="/logo.png" class="dv-in" style="height:110px"><p class="dv-in" style="animation-delay:.3s;font-size:26px;color:#E6ECF8">Every diagram, by sound.</p>`); mark('end'); await sleep(3200)
  mark('stop')
  await cdp.send('Page.stopScreencast')
  const b64 = await E(() => window.__stopRec?.())
  const t0 = await E(() => window.__recT0)
  if (b64) fs.writeFileSync(path.join(OUT, 'app.webm'), Buffer.from(b64, 'base64'))
  const said = await E(() => window.__said)
  fs.writeFileSync(path.join(OUT, 'capture.json'), JSON.stringify({ frames, marks, audioT0: t0, said, foundText, secs }, null, 1))
  console.log('frames', frames.length, 'audioT0', t0, 'secs', secs)
  await browser.close()
})()
