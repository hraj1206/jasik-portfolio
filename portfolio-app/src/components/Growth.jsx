import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Growth() {
  const wrap = useRef(null)
  const cvRef = useRef(null)

  useEffect(() => {
    if (!wrap.current || !cvRef.current) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cvRef.current, antialias: true, alpha: true })
    } catch (e) {
      return
    }

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    const group = new THREE.Group()
    scene.add(group)

    const COLS = 34, ROWS = 16, N = COLS * ROWS
    const geo = new THREE.BoxGeometry(0.76, 1, 0.76)
    geo.translate(0, 0.5, 0)

    const mat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.08 })
    const mesh = new THREE.InstancedMesh(geo, mat, N)
    group.add(mesh)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const dl = new THREE.DirectionalLight(0xffffff, 0.9)
    dl.position.set(-6, 12, 8)
    scene.add(dl)

    const c1 = new THREE.Color(0x22d1ee)
    const c2 = new THREE.Color(0x2540ff)
    const c3 = new THREE.Color(0xff5a4d)
    const tmp = new THREE.Color()

    for (let gx = 0; gx < COLS; gx++) {
      for (let gz = 0; gz < ROWS; gz++) {
        const t = gx / (COLS - 1)
        if (t < 0.6) tmp.copy(c1).lerp(c2, t / 0.6)
        else tmp.copy(c2).lerp(c3, (t - 0.6) / 0.4)
        mesh.setColorAt(gx * ROWS + gz, tmp)
      }
    }
    mesh.instanceColor.needsUpdate = true

    const dummy = new THREE.Object3D()
    let mgx = -50, mgz = -50, nx = 0, visible = true
    let rafId = 0, grow = reduce ? 1 : 0, gtarget = 1

    function update(time) {
      for (let gx = 0; gx < COLS; gx++) {
        for (let gz = 0; gz < ROWS; gz++) {
          const x = gx / (COLS - 1)
          const base = 0.12 + x * x * 5.4 * grow
          const wave = reduce
            ? 0
            : (Math.sin(gx * 0.5 + time * 1.1 + gz * 0.35) * 0.22 +
               Math.cos(gz * 0.7 - time * 0.9) * 0.14) * (0.4 + x)
          const dd = (gx - mgx) ** 2 + (gz - mgz) ** 2
          const bump = Math.exp(-dd / 9) * 2.4 * grow
          dummy.position.set((gx - COLS / 2) * 0.9, 0, (gz - ROWS / 2) * 0.9)
          dummy.scale.set(1, Math.max(0.08, base + wave + bump), 1)
          dummy.updateMatrix()
          mesh.setMatrixAt(gx * ROWS + gz, dummy.matrix)
        }
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    function render(time) {
      if (!wrap.current) return
      const r = wrap.current.getBoundingClientRect()
      const vh = innerHeight
      gtarget = reduce ? 1 : clamp((vh * 0.95 - r.top) / (vh * 0.75), 0, 1)
      grow += (gtarget - grow) * 0.08
      cam.position.set(nx * 5, 10.5, 17)
      cam.lookAt(0, 1.6, 0)
      group.rotation.y = -0.38 + nx * 0.12
      update(time * 0.001)
      renderer.render(scene, cam)
    }

    function size() {
      if (!wrap.current) return
      const r = wrap.current.getBoundingClientRect()
      renderer.setSize(r.width, r.height, false)
      cam.aspect = r.width / r.height
      cam.fov = r.width < 560 ? 52 : 36
      cam.updateProjectionMatrix()
      render(0)
    }

    function pm(e) {
      if (!wrap.current) return
      const r = wrap.current.getBoundingClientRect()
      const u = (e.clientX - r.left) / r.width
      const v = (e.clientY - r.top) / r.height
      nx = (u - 0.5) * 2
      mgx = u * COLS
      mgz = (1 - v) * ROWS * 1.1
      if (reduce) render(0)
    }

    function leave() {
      mgx = -50; mgz = -50; nx = 0
      if (reduce) render(0)
    }

    const wrapEl = wrap.current
    wrapEl.addEventListener('pointermove', pm)
    wrapEl.addEventListener('pointerleave', leave)

    const ro = new ResizeObserver(size)
    ro.observe(wrapEl)

    const io = new IntersectionObserver(en => { visible = en[0].isIntersecting })
    io.observe(wrapEl)

    function loop(t) {
      if (visible) render(t)
      rafId = requestAnimationFrame(loop)
    }

    size()
    if (!reduce) loop(0)
    else render(0)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
      wrapEl.removeEventListener('pointermove', pm)
      wrapEl.removeEventListener('pointerleave', leave)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
    }
  }, [])

  return (
    <section id="growth">
      <p className="kick">Growth</p>
      <h2>Small habits. <em>Compounding</em> results.</h2>
      <div className="growth" ref={wrap}>
        <canvas
          ref={cvRef}
          aria-label="Animated 3D bar field that rises from left to right, a picture of steady growth."
        />
        <p className="gcap">Every bar is a habit. Move your cursor to lift them.</p>
        <span className="glab gl1">Year one</span>
        <span className="glab gl2">The goal</span>
      </div>
    </section>
  )
}
