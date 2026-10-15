import { useState } from 'react'

/**
 * Recipient email for Jasik Preet Kaur.
 * You or Jasik can update this address anytime:
 */
export const JASIK_EMAIL = 'hraj48147@gmail.com'

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x={4} y={11} width={16} height={10} rx={2} />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 16, height: 16, marginRight: 6 }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 16, height: 16, marginRight: 6 }}>
    <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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
  const [phase, setPhase] = useState('open') // 'open' | 'sending' | 'sent'
  const [f, setF] = useState({ name: '', org: '', email: '', msg: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [mailtoUrl, setMailtoUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function upd(k) {
    return e => {
      const val = e.target.value
      setF(o => ({ ...o, [k]: val }))
      if (errors[k]) setErrors(o => ({ ...o, [k]: undefined }))
    }
  }

  function blur(k) {
    return () => {
      setTouched(o => ({ ...o, [k]: true }))
      const errs = validate({ ...f })
      setErrors(o => ({ ...o, [k]: errs[k] }))
    }
  }

  function buildMailto(data) {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${data.name}${data.org ? ' (' + data.org + ')' : ''}`)
    const body = encodeURIComponent(
      `Hi Jasik,\n\n${data.msg}\n\n---\nSender Details:\nName: ${data.name}\nEmail: ${data.email}${data.org ? '\nOrganisation: ' + data.org : ''}`
    )
    return `mailto:${JASIK_EMAIL}?subject=${subject}&body=${body}`
  }

  async function submit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, msg: true })
    const errs = validate(f)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setPhase('sending')
    const url = buildMailto(f)
    setMailtoUrl(url)

    // Trigger user's mail client (opens Gmail / Outlook / Apple Mail)
    window.location.href = url

    await new Promise(r => setTimeout(r, 600))
    setPhase('sent')
    setF({ name: '', org: '', email: '', msg: '' })
    setErrors({})
    setTouched({})
  }

  function copyEmail() {
    navigator.clipboard.writeText(JASIK_EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (phase === 'sent') {
    return (
      <section id="hello">
        <div className="glass hello" style={{ alignItems: 'center' }}>
          <div>
            <p className="kick">Say hello</p>
            <h2>Message <em>prepared</em>.</h2>
            <p>Your email app has been opened with the message ready to send directly to Jasik.</p>
            <span className="lock"><LockIcon />Direct delivery to Jasik's inbox</span>
          </div>
          <div className="note ok" role="status" style={{ fontSize: '0.95rem', padding: '24px' }}>
            <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#1fa97a' }}>
              ✓ Email app opened with your pre-filled message!
            </p>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', opacity: 0.9 }}>
              Hit <strong>Send</strong> in your mail app to deliver it directly to Jasik. If it didn't open automatically, use either option below:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {mailtoUrl && (
                <a
                  href={mailtoUrl}
                  className="btn solid"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  <MailIcon /> Open Mail App Again
                </a>
              )}
              <button
                type="button"
                className="btn"
                onClick={copyEmail}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <CopyIcon /> {copied ? 'Copied Jasik\'s Email!' : 'Copy Jasik\'s Email'}
              </button>
            </div>
            <button
              className="btn"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              onClick={() => setPhase('open')}
            >
              ← Send another message
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
            Leave a note here and it will open directly in your mail app addressed to Jasik.
          </p>
          <span className="lock">
            <LockIcon />
            Direct email delivery to Jasik's inbox
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
              {phase === 'sending' ? 'Opening email…' : 'Send message via Email'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
