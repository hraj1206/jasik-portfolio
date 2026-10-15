import { useEffect, useRef } from 'react'

const ABOUT = 'I am a BBA fresher at Lovely Professional University who treats every class, group project and presentation as practice for the real thing. I am curious about how brands win customers, how money moves through a business and how good teams turn ideas into results. I learn by doing, I ask better questions every week, and I am building the habits that make a professional: preparation, clarity and follow-through.'

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

function Reveal({ text }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const sp = el.querySelectorAll('span')

    function f() {
      const r = el.getBoundingClientRect(), vh = innerHeight
      const p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.2), 0, 1)
      const k = p * sp.length * 1.1
      sp.forEach((s, i) => s.classList.toggle('on', i < k))
    }

    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])

  return (
    <p className="reveal" ref={ref}>
      {text.split(' ').map((w, i) => <span key={i}>{w} </span>)}
    </p>
  )
}

const FACTS = [
  ['Programme', 'BBA'],
  ['University', 'Lovely Professional University'],
  ['Location', 'Jalandhar, Punjab'],
  ['Interested in', 'Marketing, management, media'],
]

export default function About() {
  return (
    <section id="about">
      <div className="about">
        <div>
          <p className="kick">About</p>
          <h2>Fresh eyes. <em>Serious</em> intent.</h2>
        </div>
        <div>
          <Reveal text={ABOUT} />
          <div className="facts">
            {FACTS.map(([label, value], i) => (
              <div className="glass fact" key={i}>
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
