import './three-setup.js'   // must be first — patches console.warn before Three.js loads
import { useEffect } from 'react'
import Background from './components/Background'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Galaxy from './components/Galaxy'
import Growth from './components/Growth'
import Path from './components/Path'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // Scroll-progress bar
  useEffect(() => {
    function f() {
      const max = document.documentElement.scrollHeight - innerHeight
      document.documentElement.style.setProperty(
        '--sp',
        (max > 0 ? (scrollY / max) * 100 : 0) + '%'
      )
    }
    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])

  return (
    <>
      <Background />
      <div className="bar" />
      <Cursor />
      <div className="wrap">
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Galaxy />
        <Growth />
        <Path />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
