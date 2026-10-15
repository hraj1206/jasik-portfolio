import { useEffect, useRef } from 'react'

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }

const STEPS = [
  {
    label: 'NOW',
    title: 'BBA at Lovely Professional University',
    desc: 'Building a base in management, marketing, finance and communication in Jalandhar, Punjab.',
    className: 'now',
  },
  {
    label: 'NEXT',
    title: 'Societies, certifications and live projects',
    desc: 'Adding hands-on experience alongside the classroom through campus activities and short courses.',
    className: '',
  },
  {
    label: 'GOAL',
    title: 'An internship, then a career in business',
    desc: 'Contributing to a real team in marketing or management, and growing into a role with responsibility.',
    className: '',
  },
]

export default function Path() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current

    function f() {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--jp', clamp((innerHeight * 0.7 - r.top) / r.height, 0, 1))
    }

    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])

  return (
    <section id="path">
      <p className="kick">Path</p>
      <h2>Where I am, and <em>where I am headed</em>.</h2>
      <div className="path" ref={ref}>
        {STEPS.map((s, i) => (
          <div className={`glass stop ${s.className}`.trim()} key={i}>
            <small>{s.label}</small>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
