import { Link } from 'react-router-dom'

export default function CauseBanner() {
  return (
    <div style={{ background: '#1a0f00', borderBottom: '1px solid #f9731630' }}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-amber-300/80">
          <strong className="text-amber-300">Standing with collectors.</strong>{' '}
          All proceeds beyond operating costs go to support YouTuber Reckless Ben's legal defense in the Bricks &amp; Minifigs case.
        </p>
        <Link to="/how-it-works" className="text-xs font-semibold text-amber-400 hover:text-amber-300 no-underline whitespace-nowrap transition-colors">
          Learn more →
        </Link>
      </div>
    </div>
  )
}
