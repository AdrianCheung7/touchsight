# Cuts capture.json/frames + app.webm into the final film via an edit list; synthesises the SFX stem; mixes.
import json, bisect, subprocess, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
FF = open('ffpath.txt').read().strip()
OUT = r'C:\Users\adijo\OneDrive\Desktop\skills-project\demo-video'
os.makedirs(OUT + '/stems', exist_ok=True)
SR, FPS = 48000, 30

d = json.load(open('capture.json'))
# True render time of each frame from the in-page clock strip (screencast metadata timestamps drift).
from PIL import Image
P = 0x3ffff * 0.01 + 0.01
for f in d['frames']:
    im = Image.open(f['f']).convert('L'); h = im.height
    c = sum((im.getpixel((i * 8 + 4, h - 3)) > 128) << i for i in range(18))
    t = c * 0.01; k = round((f['t'] - t) / P); f['t'] = t + k * P
d['frames'].sort(key=lambda f: f['t'])
ts = [f['t'] for f in d['frames']]
M = {m['name']: m['t'] for m in d['marks']}

# (label, start mark, offset, end mark, offset)
EDL = [
    ('hook', 'hook1', 0.0, 'hook2', 2.9),
    ('stat1', 'stat1', 0.0, 'stat1', 3.6),
    ('stat2', 'stat2', 0.0, 'stat2', 3.6),
    ('reveal', 'reveal', 0.0, 'logo', 2.5),
    ('dashboard', 'dash', 0.0, 'explore-idle', 0.7),
    ('explore', 'explore', -0.15, 'tech', 0.0),
    ('tech', 'tech', 0.0, 'tech-end', -1.5),
    ('findit-title', 'findit', 0.0, 'findit', 2.3),
    ('findit-search', 'count1', -1.15, 'found', 0.0),
    ('found', 'found', 0.0, 'found', 2.6),
    ('explain', 'explain', 0.0, 'explain', 3.5),
    ('ask', 'ask', 0.9, 'ask-end', -0.3),
    ('teacher', 'student-page', -2.9, 'student-page', -0.9),
    ('student', 'student-page', -0.2, 'student-end', -0.2),
    ('editor', 'edit', 0.0, 'edit-end', 0.0),
    ('export', 'export', 0.0, 'export-end', 0.0),
    ('about', 'about', 0.0, 'about-end', 0.0),
    ('close', 'close', 0.0, 'end', 0.0),
    ('found-replay', 'found', -0.35, 'found', 1.5),
    ('end', 'end', 0.0, 'stop', 0.0),
]
segs = []
t_out = 0.0
for lab, a, ao, b, bo in EDL:
    s, e = M[a] + ao, M[b] + bo
    segs.append(dict(label=lab, s=s, e=e, o=t_out))
    t_out += e - s
TOTAL = t_out
print(f'total {TOTAL:.2f}s')
at = {g['label']: g['o'] for g in segs}

# ---------- video: constant 30 fps, hold last frame <= t ----------
lines, prev, run = [], None, 0
for g in segs:
    n = round((g['e'] - g['s']) * FPS)
    for k in range(n):
        t = g['s'] + k / FPS
        i = max(0, bisect.bisect_right(ts, t) - 1)
        f = d['frames'][i]['f']
        if f == prev: run += 1
        else:
            if prev: lines.append((prev, run))
            prev, run = f, 1
lines.append((prev, run))
with open('concat.txt', 'w') as fh:
    for f, r in lines: fh.write(f"file '{f}'\nduration {r / FPS:.6f}\n")
    fh.write(f"file '{lines[-1][0]}'\n")
NFR = sum(r for _, r in lines)
TOTAL = NFR / FPS

# ---------- app stem ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', 'app.webm', '-ar', str(SR), '-ac', '2', 'app_raw.wav'], check=True)
with wave.open('app_raw.wav') as w: raw = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
T0 = d['audioT0']
N = int(TOTAL * SR) + SR
app = np.zeros((N, 2), np.float32)
fade = int(0.008 * SR)
for g in segs:
    a, b = int((g['s'] - T0) * SR), int((g['e'] - T0) * SR)
    chunk = np.zeros((b - a, 2), np.float32)
    lo, hi = max(a, 0), min(b, len(raw))
    if hi > lo: chunk[lo - a:hi - a] = raw[lo:hi]
    if len(chunk) > 2 * fade:
        r = np.linspace(0, 1, fade)[:, None]; chunk[:fade] *= r; chunk[-fade:] *= r[::-1]
    o = int(g['o'] * SR); app[o:o + len(chunk)] += chunk[:N - o]

# ---------- SFX stem (all synthesised) ----------
rng = np.random.default_rng(7)
sfx = np.zeros((N, 2), np.float32)
tt = lambda dur: np.arange(int(dur * SR)) / SR
def put(sig, t, gain=1.0, pan=0.0):
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414], 1)
    o = int(t * SR); n = min(len(sig), N - o)
    if n > 0: sfx[o:o + n] += sig[:n] * gain
def lp(x, a):  # one-pole low-pass
    y = np.empty_like(x); acc = 0.0
    from scipy.signal import lfilter
    return lfilter([a], [1, a - 1], x).astype(np.float32)
def boom(dur=1.6, f0=70, f1=38):
    t = tt(dur); f = f1 + (f0 - f1) * np.exp(-t * 5); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 2.6) + lp(rng.standard_normal(len(t)), 0.02) * np.exp(-t * 18) * 0.6).astype(np.float32)
def hit():
    t = tt(1.2); b = boom(1.2, 90, 45) * 0.8
    click = lp(rng.standard_normal(len(t)), 0.35) * np.exp(-t * 60) * 0.5
    return (b + click).astype(np.float32)
def whoosh(dur=0.7, rev=False):
    t = tt(dur); n = rng.standard_normal(len(t)); env = np.sin(np.pi * (t / dur) ** (0.6 if not rev else 1.6)) ** 2
    cut = 0.03 + 0.25 * env
    from scipy.signal import lfilter
    y = np.zeros_like(n); acc = 0.0
    for i in range(0, len(n), 256):  # time-varying low-pass, block-wise
        a = float(cut[i]); y[i:i + 256], _ = lfilter([a], [1, a - 1], n[i:i + 256], zi=[acc * (1 - a)]); acc = y[min(i + 255, len(y) - 1)]
    y = (y * env).astype(np.float32); y /= np.abs(y).max() + 1e-9
    L = y * np.linspace(1.2, 0.5, len(y)); R = y * np.linspace(0.5, 1.2, len(y))
    return np.stack([L, R], 1).astype(np.float32)
def riser(dur):
    t = tt(dur); f = 180 * (6 ** (t / dur)); ph = 2 * np.pi * np.cumsum(f) / SR
    tone = (np.sin(ph) + 0.4 * np.sin(2.01 * ph)) * (t / dur) ** 2.2 * 0.35
    noise = lp(rng.standard_normal(len(t)), 0.08) * (t / dur) ** 3 * 0.6
    return (tone + noise).astype(np.float32)
def pad(dur, freqs, att=1.0, rel=1.5):
    t = tt(dur); env = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel)
    s = sum(np.sin(2 * np.pi * f * t + i) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for i, f in enumerate(freqs)) / len(freqs)
    return (s * env * (1 + 0.15 * np.sin(2 * np.pi * 0.3 * t))).astype(np.float32)
def uiclick():
    t = tt(0.05); return (np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 180) * 0.6 + lp(rng.standard_normal(len(t)), 0.5) * np.exp(-t * 300) * 0.4).astype(np.float32)
def chime():  # same notes as the app's chime(): C5 + G5, decaying sines
    t = tt(1.4); return (0.5 * np.sin(2 * np.pi * 523.25 * t) * np.exp(-t * 3.2) + 0.45 * np.sin(2 * np.pi * 783.99 * t) * np.exp(-t * 2.6)).astype(np.float32)
def roomtone(dur):
    return lp(rng.standard_normal(int(dur * SR)), 0.01).astype(np.float32) * 0.9

def seg_t(label, mark, off=0.0):  # output time of a raw mark inside a segment
    g = next(x for x in segs if x['label'] == label); return g['o'] + (M[mark] + off - g['s'])

# Hook + stakes + reveal: room tone bed, drain drop, stat hits, riser -> silence -> logo bloom
put(roomtone(at['dashboard']), 0, 0.10)
put(pad(at['stat1'] + 1.2, [110, 164.8], att=2.0, rel=1.2), 0, 0.05)
put(boom(2.4, 60, 28), seg_t('hook', 'drain', 0.1), 0.55)
put(hit(), at['stat1'] + 0.05, 0.42)
put(hit(), at['stat2'] + 0.05, 0.42)
rdur = seg_t('reveal', 'logo') - at['reveal'] - 0.35
put(riser(rdur), at['reveal'], 0.35)
put(boom(2.2, 80, 40), seg_t('reveal', 'logo'), 0.45)
put(pad(2.8, [261.6, 392, 523.3, 659.3], att=0.05, rel=2.4), seg_t('reveal', 'logo'), 0.12)
# Into the product
put(whoosh(0.6), at['dashboard'] - 0.3, 0.22)
put(uiclick(), seg_t('dashboard', 'click-explore', 0.25), 0.35)
# Find-it: swell under the chime
put(pad(3.2, [130.8, 196, 261.6], att=0.4, rel=2.2), at['found'] - 0.05, 0.10)
put(boom(1.6, 70, 35), at['found'], 0.25)
# Teacher side and montage
for lab in ['teacher', 'editor', 'export', 'about', 'close']:
    put(whoosh(0.55), at[lab] - 0.28, 0.2)
put(roomtone(TOTAL - at['teacher']), at['teacher'], 0.06)
put(uiclick(), at['student'] - 0.03, 0.3)  # row click
put(uiclick(), at['export'] - 0.05, 0.3)
put(hit(), at['close'] + 0.05, 0.3)
# Ending: the peak returns, then the logo lands on the chime
put(pad(TOTAL - at['found-replay'] + 0.5, [130.8, 196, 261.6, 329.6], att=0.3, rel=2.5), at['found-replay'], 0.08)
put(chime(), at['end'] + 0.05, 0.5)
put(boom(2.8, 60, 30), at['end'] + 0.05, 0.5)

app, sfx = app[:int(TOTAL * SR)], sfx[:int(TOTAL * SR)]
def wr(name, x):
    x = np.clip(x, -1, 1)
    with wave.open(name, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
# App on top: bring active sonification to ~-20 dBFS RMS, soft-limit peaks; SFX sits ~8 dB under.
act = np.abs(app).max(1) > 1e-4
rms = np.sqrt((app[act] ** 2).mean()) + 1e-9
app_n = np.tanh(app * (10 ** (-20 / 20) / rms)) * 0.95
sfx = sfx * 0.55
wr(OUT + '/stems/app.wav', app_n)
wr(OUT + '/stems/sfx.wav', sfx)
mix = app_n + sfx
wr('mix_pre.wav', mix / max(1, np.abs(mix).max() / 0.95))

subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-i', 'mix_pre.wav',
                '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR),
                '-vf', f'fps={FPS},crop=1280:712:0:0,scale=1920:1080:flags=lanczos,unsharp=5:5:0.6,setsar=1,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high',
                '-c:a', 'aac', '-b:a', '256k', '-t', f'{TOTAL:.3f}', '-movflags', '+faststart', OUT + '/touchsight-demo-final.mp4'], check=True)

# VO cue sheet
with open(OUT + '/VO-CUES.md', 'w', encoding='utf8') as fh:
    fh.write('# Voiceover cue sheet\n\nOutput timecodes for each beat of `touchsight-demo-final.mp4`. Stems in `stems/` let you duck under the VO.\n\n| Start | Beat | Length |\n|---|---|---|\n')
    for g in segs: fh.write(f"| {int(g['o']//60)}:{g['o']%60:05.2f} | {g['label']} | {g['e']-g['s']:.1f}s |\n")
    fh.write(f"\nTotal: {TOTAL:.2f}s. Found time shown in the film: {d.get('secs')}.\n")
print('done', TOTAL)
