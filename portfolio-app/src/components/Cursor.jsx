import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef(null)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

  useEffect(() => {
    if (reduce || !fine) return
    const el = ref.current
    el.hidden = false

    let x = 0, y = 0, tx = 0, ty = 0, raf = 0

    function mv(e) {
      tx = e.clientX; ty = e.clientY
      el.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,label,input,textarea,canvas')))
    }

    function tick() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2
      el.style.transform = `translate(${x}px,${y}px)`
      raf = requestAnimationFrame(tick)
    }

    addEventListener('pointermove', mv)
    tick()

    return () => {
      removeEventListener('pointermove', mv)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor" ref={ref} hidden />
}
