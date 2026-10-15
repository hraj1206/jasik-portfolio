export default function Marquee() {
  const words = ['Strategy', 'Marketing', 'Finance', 'Leadership', 'Communication', 'Curiosity', 'Teamwork', 'Growth']
  const row = [...words, ...words].map((w, i) => <span key={i}>{w}</span>)

  return (
    <div className="marq" aria-hidden="true">
      <div>{row}{row}</div>
    </div>
  )
}
