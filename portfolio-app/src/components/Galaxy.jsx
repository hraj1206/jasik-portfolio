import { useState, useEffect, useRef } from 'react'

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

const SKILLS = [
  { n: 'Business communication', d: 'Writing clearly, speaking with confidence and keeping the message short enough to remember.', c: 0 },
  { n: 'Marketing basics', d: 'Understanding what customers want, how brands position themselves and why one message lands while another does not.', c: 1 },
  { n: 'Financial literacy', d: 'Reading simple statements, budgeting, and thinking about cost, price and return before making a call.', c: 2 },
  { n: 'Leadership', d: 'Taking ownership, setting the pace for a group and making sure everyone knows what good looks like.', c: 0 },
  { n: 'Teamwork', d: 'Listening first, sharing the work fairly and finishing what the group started.', c: 1 },
  { n: 'Presentations', d: 'Turning a pile of notes into a story with a clear start, a point and a close.', c: 2 },
  { n: 'Excel and Office', d: 'Word, Excel and PowerPoint for tidy reports, simple analysis and slides people can follow.', c: 0 },
  { n: 'Research', d: 'Finding reliable sources, asking sharper questions and turning notes into insight.', c: 1 },
  { n: 'Problem solving', d: 'Breaking a messy situation into parts, testing options and choosing a next step.', c: 2 },
  { n: 'Time management', d: 'Planning the week, protecting focus time and meeting deadlines without last-minute panic.', c: 0 },
]

const COLORS = ['#2540ff', '#ff5a4d', '#12b5d1']

export default function Galaxy() {
  const cvRef = useRef(null)
  const selRef = useRef(0)
  const [sel, setSel] = useState(0)

  function choose(i) { selRef.current = i; setSel(i) }

  useEffect(() => {
    const cv = cvRef.current
    const ctx = cv.getContext('2d')
    let W = 0, H = 0, dpr = 1, ay = 0.6, ax = -0.25, vy = reduce ? 0 : 0.0035
    let drag = false, lx = 0, ly = 0, moved = 0, hover = -1, visible = true
    let boxes = [], raf = 0

    const pts = SKILLS.map((_, i) => {
      const k = i + 0.5
      const phi = Math.acos(1 - 2 * k / SKILLS.length)
      const th = Math.PI * (1 + Math.sqrt(5)) * k
      return { x: Math.cos(th) * Math.sin(phi), y: Math.cos(phi), z: Math.sin(th) * Math.sin(phi) }
    })

    function size() {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function rot(x, y, z) {
      const cY = Math.cos(ay), sY = Math.sin(ay), cX = Math.cos(ax), sX = Math.sin(ax)
      const x1 = x * cY + z * sY, z1 = -x * sY + z * cY
      const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX
      return { x: x1, y: y1, z: z2 }
    }

    function P(q, R) {
      const s = 1 / (1 - q.z * 0.22)
      return { sx: W / 2 + q.x * R * s, sy: H / 2 + q.y * R * s, z: q.z, s }
    }

    function pill(x, y, w, hh, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + hh, r)
      ctx.arcTo(x + w, y + hh, x, y + hh, r)
      ctx.arcTo(x, y + hh, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
    }

    function ringPath(fn) {
      ctx.beginPath()
      for (let i = 0; i <= 72; i++) {
        const a = i / 72 * Math.PI * 2
        const args = fn(a)
        const q = P(rot(args[0], args[1], args[2]), Math.min(W, H) * 0.36)
        if (i) ctx.lineTo(q.sx, q.sy); else ctx.moveTo(q.sx, q.sy)
      }
      ctx.stroke()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const R = Math.min(W, H) * 0.36
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(10,15,44,0.13)';
      [-0.55, 0, 0.55].forEach(yy => {
        const rr = Math.sqrt(1 - yy * yy)
        ringPath(a => [Math.cos(a) * rr, yy, Math.sin(a) * rr])
      });
      [0, 1, 2].forEach(k => {
        const o = k * Math.PI / 3
        ringPath(a => [Math.cos(a) * Math.cos(o), Math.sin(a), Math.cos(a) * Math.sin(o)])
      })

      const items = pts.map((p, i) => { const q = rot(p.x, p.y, p.z); const pr = P(q, R); pr.i = i; pr.q = q; return pr })

      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i].q, b = items[j].q
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
          if (d < 1.15) {
            ctx.strokeStyle = `rgba(37,64,255,${0.22 * (1 - d / 1.15) * (0.4 + 0.3 * (a.z + b.z + 2))})`
            ctx.beginPath(); ctx.moveTo(items[i].sx, items[i].sy); ctx.lineTo(items[j].sx, items[j].sy); ctx.stroke()
          }
        }
      }

      items.sort((a, b) => a.z - b.z)
      boxes = []
      items.forEach(it => {
        const sk = SKILLS[it.i], depth = (it.z + 1) / 2, fs = 11.5 + depth * 3.5
        ctx.font = `700 ${fs}px Manrope, system-ui, sans-serif`
        const tw = ctx.measureText(sk.n).width, w = tw + 30, hh = fs + 16
        const x = it.sx - w / 2, y = it.sy - hh / 2
        const on = it.i === selRef.current, hv = it.i === hover
        ctx.globalAlpha = 0.42 + 0.58 * depth
        ctx.shadowColor = 'rgba(10,15,44,0.18)'; ctx.shadowBlur = on || hv ? 18 : 8; ctx.shadowOffsetY = 4
        pill(x, y, w, hh, hh / 2); ctx.fillStyle = on ? '#0a0f2c' : '#ffffff'; ctx.fill()
        ctx.shadowColor = 'transparent'; ctx.lineWidth = hv || on ? 2 : 1
        ctx.strokeStyle = on ? '#0a0f2c' : (hv ? COLORS[sk.c] : 'rgba(10,15,44,0.14)'); ctx.stroke()
        ctx.beginPath(); ctx.arc(x + 12, it.sy, 3.5, 0, Math.PI * 2); ctx.fillStyle = COLORS[sk.c]; ctx.fill()
        ctx.fillStyle = on ? '#ffffff' : '#0a0f2c'; ctx.textBaseline = 'middle'; ctx.fillText(sk.n, x + 21, it.sy + 0.5)
        ctx.globalAlpha = 1
        boxes.push({ i: it.i, x, y, w, h: hh })
      })
    }

    function loop() {
      if (visible) {
        if (!drag) { ay += vy; vy += ((reduce ? 0 : 0.0035) - vy) * 0.03 }
        draw()
      }
      raf = requestAnimationFrame(loop)
    }

    function hit(e) {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
      for (let k = boxes.length - 1; k >= 0; k--) {
        const b = boxes[k]
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.i
      }
      return -1
    }

    function down(e) { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; try { cv.setPointerCapture(e.pointerId) } catch (_) {} }
    function move(e) {
      if (drag) {
        const dx = e.clientX - lx, dy = e.clientY - ly
        lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy)
        ay += dx * 0.008; vy = dx * 0.0008; ax = clamp(ax + dy * 0.006, -1.1, 1.1)
      } else { hover = hit(e); cv.style.cursor = hover >= 0 ? 'pointer' : 'grab' }
      if (reduce) draw()
    }
    function up(e) { if (drag && moved < 6) { const i = hit(e); if (i >= 0) choose(i) } drag = false; if (reduce) draw() }

    cv.addEventListener('pointerdown', down)
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerup', up)
    cv.addEventListener('pointercancel', () => { drag = false })
    cv.addEventListener('pointerleave', () => { hover = -1 })

    const ro = new ResizeObserver(() => { size(); draw() }); ro.observe(cv)
    const io = new IntersectionObserver(en => { visible = en[0].isIntersecting }); io.observe(cv)

    size(); draw(); cv.__redraw = draw; loop()

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])

  useEffect(() => {
    const cv = cvRef.current
    if (cv && cv.__redraw && reduce) cv.__redraw()
  }, [sel])

  const cur = SKILLS[sel]

  return (
    <section id="skills">
      <p className="kick">Skills</p>
      <h2>A galaxy of <em>strengths</em>.</h2>
      <div className="gal">
        <div className="glass gcan">
          <canvas
            ref={cvRef}
            aria-label="Interactive 3D skill galaxy. Drag to rotate, click a skill to read about it."
          />
          <span className="hint">Drag to spin · tap a skill</span>
        </div>
        <div className="glass detail">
          <div>
            <span className="tag">Selected skill</span>
            <h3>{cur.n}</h3>
            <p>{cur.d}</p>
          </div>
          <div className="pills" role="group" aria-label="Choose a skill">
            {SKILLS.map((k, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={i === sel ? 'true' : 'false'}
                onClick={() => choose(i)}
              >
                {k.n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
