import { useState } from 'react'

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x={4} y={11} width={16} height={10} rx={2} />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

function validate(f) {
  const errors = {}
  if (f.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = 'Please enter a valid email address.'
  if (f.msg.trim().length < 4) errors.msg = 'Message is too short — add a bit more detail.'
  return errors
}

export default function Contact() {
  const [phase, setPhase] = useState('open')  // 'open' | 'sending' | 'sent'
  const [f, setF] = useState({ name: '', org: '', email: '', msg: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function upd(k) {
    return e => {
      const val = e.target.value
      setF(o => ({ ...o, [k]: val }))
      // Clear per-field error as user types
      if (errors[k]) setErrors(o => ({ ...o, [k]: undefined }))
    }
  }

  function blur(k) {
    return () => {
      setTouched(o => ({ ...o, [k]: true }))
      // Validate just this field on blur
      const errs = validate({ ...f })
      setErrors(o => ({ ...o, [k]: errs[k] }))
    }
  }

  async function submit(e) {
    e.preventDefault()
    // Mark all fields touched so errors show
    setTouched({ name: true, email: true, msg: true })
    const errs = validate(f)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setPhase('sending')
    // Simulate async send (swap with real endpoint if needed)
    await new Promise(r => setTimeout(r, 1000))
    setPhase('sent')
    setF({ name: '', org: '', email: '', msg: '' })
    setErrors({})
    setTouched({})
  }

  if (phase === 'sent') {
    return (
      <section id="hello">
        <div className="glass hello" style={{ alignItems: 'center' }}>
          <div>
            <p className="kick">Say hello</p>
            <h2>Introductions, <em>welcome</em>.</h2>
            <p>Jasik keeps her contact details private. Leave a note here and she will be in touch.</p>
            <span className="lock"><LockIcon />Contact details are never shown on this page</span>
          </div>
          <div className="note ok" role="status" style={{ fontSize: '1rem', padding: '24px' }}>
            ✓ Message received — Jasik will be in touch soon. Thank you!
            <br />
            <button
              className="btn"
              style={{ marginTop: 18 }}
              onClick={() => setPhase('open')}
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="hello">
      <div className="glass hello">
        {/* Left column */}
        <div>
          <p className="kick">Say hello</p>
          <h2>Introductions, <em>welcome</em>.</h2>
          <p>
            Jasik keeps her contact details private. Leave a note here and she will be in touch.
          </p>
          <span className="lock">
            <LockIcon />
            Contact details are never shown on this page
          </span>
        </div>

        {/* Right column — form */}
        <form onSubmit={submit} noValidate>
          <div className="two">
            <label htmlFor="f-name">
              Your name
              <input
                id="f-name"
                value={f.name}
                onChange={upd('name')}
                onBlur={blur('name')}
                autoComplete="name"
                required
                aria-invalid={touched.name && errors.name ? 'true' : undefined}
                style={touched.name && errors.name ? { borderColor: 'var(--coral)' } : undefined}
              />
              {touched.name && errors.name && (
                <span role="alert" style={{ color: 'var(--coral)', fontSize: '0.78rem', fontWeight: 500 }}>
                  {errors.name}
                </span>
              )}
            </label>

            <label htmlFor="f-org">
              Organisation <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
              <input
                id="f-org"
                value={f.org}
                onChange={upd('org')}
                autoComplete="organization"
              />
            </label>
          </div>

          <label htmlFor="f-email">
            Your email, so she can reply
            <input
              id="f-email"
              type="email"
              value={f.email}
              onChange={upd('email')}
              onBlur={blur('email')}
              autoComplete="email"
              required
              aria-invalid={touched.email && errors.email ? 'true' : undefined}
              style={touched.email && errors.email ? { borderColor: 'var(--coral)' } : undefined}
            />
            {touched.email && errors.email && (
              <span role="alert" style={{ color: 'var(--coral)', fontSize: '0.78rem', fontWeight: 500 }}>
                {errors.email}
              </span>
            )}
          </label>

          <label htmlFor="f-msg">
            Message
            <textarea
              id="f-msg"
              value={f.msg}
              onChange={upd('msg')}
              onBlur={blur('msg')}
              required
              aria-invalid={touched.msg && errors.msg ? 'true' : undefined}
              style={touched.msg && errors.msg ? { borderColor: 'var(--coral)' } : undefined}
            />
            {touched.msg && errors.msg && (
              <span role="alert" style={{ color: 'var(--coral)', fontSize: '0.78rem', fontWeight: 500 }}>
                {errors.msg}
              </span>
            )}
          </label>

          <div>
            <button
              className="btn solid"
              type="submit"
              disabled={phase === 'sending'}
            >
              {phase === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
