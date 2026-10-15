import { useEffect, useRef } from 'react'

export default function Background() {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv = cvRef.current
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const gl = cv.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
    const fs = [
      'precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/r; float asp=r.x/r.y; vec2 p=uv*vec2(asp,1.)*1.7; vec2 mm=m*vec2(asp,1.)*1.7;',
      ' float d=distance(p,mm); p+=(p-mm)*0.14*exp(-d*2.2);',
      ' float a=fbm(p+vec2(t*.05,t*.03)); float b=fbm(p*1.3-vec2(t*.04,-t*.05)+a*1.6); float c=fbm(p*.8+5.-t*.03+b);',
      ' vec3 ice=vec3(.93,.95,1.),cob=vec3(.15,.25,1.),aq=vec3(.13,.82,.93),co=vec3(1.,.35,.30);',
      ' vec3 col=ice;',
      ' col=mix(col,aq,smoothstep(.35,.8,b)*.6);',
      ' col=mix(col,cob,smoothstep(.5,.95,a)*.5);',
      ' col=mix(col,co,smoothstep(.55,.9,c)*.45);',
      ' col=mix(ice,col,.72);',
      ' col+=vec3(1.,.92,.88)*exp(-d*3.)*.14;',
      ' col+=(h(gl_FragCoord.xy+fract(t))-.5)*.035;',
      ' gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n')

    function sh(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }

    const v = sh(gl.VERTEX_SHADER, vs)
    const f = sh(gl.FRAGMENT_SHADER, fs)
    if (!v || !f) return

    const pr = gl.createProgram()
    gl.attachShader(pr, v)
    gl.attachShader(pr, f)
    gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return

    gl.useProgram(pr)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uR = gl.getUniformLocation(pr, 'r')
    const uT = gl.getUniformLocation(pr, 't')
    const uM = gl.getUniformLocation(pr, 'm')

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5

    function size() {
      const d = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(2, Math.floor(innerWidth * d * 0.6))
      const hh = Math.max(2, Math.floor(innerHeight * d * 0.6))
      cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh)
    }

    function draw(t) {
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06
      gl.uniform2f(uR, cv.width, cv.height)
      gl.uniform1f(uT, t * 0.001)
      gl.uniform2f(uM, mx, my)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    function onResize() { size(); if (reduce) draw(0) }
    function onMove(e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight }

    addEventListener('resize', onResize)
    addEventListener('pointermove', onMove, { passive: true })
    size()

    let rafId
    if (reduce) {
      draw(0)
    } else {
      const loop = (t) => { draw(t); rafId = requestAnimationFrame(loop) }
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      removeEventListener('resize', onResize)
      removeEventListener('pointermove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas id="bg" ref={cvRef} aria-hidden="true" />
}
