import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{ boxShadow: scrolled ? '0 4px 24px rgba(10,15,44,0.10)' : 'none' }}>
      <a className="brand" href="#top">JPK<i>.</i></a>
      <div className="links">
        <a href="#about" className="opt">About</a>
        <a href="#skills">Skills</a>
        <a href="#growth" className="opt">Growth</a>
        <a href="#path">Path</a>
        <a href="#hello" className="go">Say hello</a>
      </div>
    </nav>
  )
}
