import { useEffect, useRef } from 'react'

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }

export default function Hero() {
  const st = useRef(null)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

  useEffect(() => {
    if (reduce || !fine) return
    const el = st.current
    let raf = 0

    function on(e) {
      const r = el.getBoundingClientRect()
      const x = clamp((e.clientX - r.left) / r.width - 0.5, -0.6, 0.6)
      const y = clamp((e.clientY - r.top) / r.height - 0.5, -0.6, 0.6)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${-y * 8}deg`)
        el.style.setProperty('--ry', `${x * 10}deg`)
        el.style.setProperty('--px', x)
        el.style.setProperty('--py', y)
      })
    }

    addEventListener('pointermove', on)
    return () => { removeEventListener('pointermove', on); cancelAnimationFrame(raf) }
  }, [])

  return (
    <header className="stage" id="top" ref={st}>
      <h1 className="names" aria-label="Jasik Preet Kaur">
        <span className="l1">Jasik</span>
        <span className="l2">Preet</span>
        <span className="l3">Kaur</span>
      </h1>

      <div className="pwrap">
        <div className="disc" />
        <div className="ring" />
        <img
          className="portrait"
          src="/photo.webp"
          alt="Jasik Preet Kaur in a black blazer and glasses"
          width={900}
          height={1200}
        />
        <div className="chip c1"><b>BBA </b>Business Administration</div>
        <div className="chip c2">Lovely Professional University</div>
        <div className="chip c3"><b>Jalandhar </b>Punjab</div>
      </div>

      <div className="meta">
        <p className="kick">Portfolio 2026</p>
        <p className="lede">
          A BBA fresher curious about <strong>brands, money and people</strong>, and learning by building.
        </p>
        <div className="btns">
          <a className="btn solid" href="#skills">Explore my skills</a>
          <a className="btn" href="#hello">Introduce yourself</a>
        </div>
      </div>
    </header>
  )
}
