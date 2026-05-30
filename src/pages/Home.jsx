import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Shield, Heart, TrendingUp, Zap } from 'lucide-react'
import { listings } from '../data/listings'

const CARD_COLORS = {
  pokemon:       { border: '#FFDE00', glow: '#FFDE0044', bg: 'linear-gradient(160deg,#1a1a2e,#16213e)' },
  lego:          { border: '#ff4444', glow: '#ff444444', bg: 'linear-gradient(160deg,#1a0808,#2e1212)' },
  baseball:      { border: '#4ade80', glow: '#4ade8044', bg: 'linear-gradient(160deg,#0a180a,#122e12)' },
  basketball:    { border: '#f97316', glow: '#f9731644', bg: 'linear-gradient(160deg,#1a0e08,#2e180e)' },
  mtg:           { border: '#c084fc', glow: '#c084fc44', bg: 'linear-gradient(160deg,#12091a,#1e0f2e)' },
  'hot-wheels':  { border: '#ef4444', glow: '#ef444444', bg: 'linear-gradient(160deg,#1a0808,#2e0808)' },
  comics:        { border: '#60a5fa', glow: '#60a5fa44', bg: 'linear-gradient(160deg,#080e1a,#0e162e)' },
  'vintage-toys':{ border: '#34d399', glow: '#34d39944', bg: 'linear-gradient(160deg,#081a12,#0e2e1a)' },
}

const BADGE = {
  'New - Sealed':        { label: 'SEALED',  color: '#000', bg: '#4ade80' },
  'Like New - Complete': { label: 'LN',      color: '#000', bg: '#60a5fa' },
  'Graded - PSA 10':     { label: 'PSA 10',  color: '#000', bg: '#FFDE00' },
  'Graded - PSA 9':      { label: 'PSA 9',   color: '#000', bg: '#FFDE00' },
  'Graded - PSA 8':      { label: 'PSA 8',   color: '#000', bg: '#f97316' },
  'Graded - CGC 3.0':    { label: 'CGC 3.0', color: '#fff', bg: '#7c3aed' },
  'Raw - VG':            { label: 'RAW VG',  color: '#fff', bg: '#475569' },
  'Good - Used':         { label: 'GOOD',    color: '#fff', bg: '#475569' },
  'Good - Complete':     { label: 'GOOD',    color: '#fff', bg: '#475569' },
  'Heavy Play':          { label: 'HP',      color: '#fff', bg: '#dc2626' },
}

function CarouselCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge = BADGE[listing.condition] || { label: 'USED', color: '#fff', bg: '#475569' }
  const hasImage = !!listing.image

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="no-underline flex-shrink-0"
      style={{ width: 176 }}
    >
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105"
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: `0 0 18px ${colors.glow}`,
          background: colors.bg,
          height: 264,
        }}
      >
        {/* Top badge row */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 6px', borderRadius: 4 }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 10, color: colors.border, fontWeight: 700 }}>
            ${listing.price.toLocaleString()}
          </span>
        </div>

        {/* Image or emoji */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {hasImage ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="object-contain w-full h-full"
              style={{ maxHeight: 160 }}
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
          ) : null}
          <div
            className="items-center justify-center"
            style={{ fontSize: 72, display: hasImage ? 'none' : 'flex' }}
          >
            {listing.emoji}
          </div>
        </div>

        {/* Title */}
        <div className="px-2 pb-2">
          <div className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: '#e2e8f0', fontSize: 10 }}>
            {listing.title}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#64748b', fontSize: 9 }}>by {listing.seller}</div>
        </div>
      </div>
    </Link>
  )
}

function InfiniteCarousel({ items, speed = 30 }) {
  const trackRef = useRef(null)
  const tripled = [...items, ...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = 176 + 12
    const totalW = items.length * cardW
    let pos = 0
    let raf
    const step = () => {
      pos += speed / 60
      if (pos >= totalW) pos -= totalW
      track.style.transform = `translateX(-${pos}px)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [items, speed])

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex gap-3" style={{ willChange: 'transform', width: 'max-content' }}>
        {tripled.map((item, i) => (
          <CarouselCard key={`${item.id}-${i}`} listing={item} />
        ))}
      </div>
    </div>
  )
}

const CAT_ROUTES = [
  { id: 'pokemon',      path: '/pokemon',      label: 'Pokémon Cards',       emoji: '🃏', desc: 'Raw, graded, sealed',          accent: '#FFDE00', bg: '#3B4CCA' },
  { id: 'lego',         path: '/lego',         label: 'LEGO Sets',           emoji: '🧱', desc: 'Retired sets & minifigs',       accent: '#FFD700', bg: '#CC0000' },
  { id: 'baseball',     path: '/baseball',     label: 'Baseball Cards',      emoji: '⚾', desc: 'Vintage, rookies, graded',      accent: '#4ade80', bg: '#14532d' },
  { id: 'basketball',   path: '/basketball',   label: 'Basketball Cards',    emoji: '🏀', desc: 'Refractors & rookies',          accent: '#fdba74', bg: '#9a3412' },
  { id: 'mtg',          path: '/mtg',          label: 'Magic: The Gathering', emoji: '🔮', desc: 'Reserved list & vintage power', accent: '#c084fc', bg: '#4c1d95' },
  { id: 'hot-wheels',   path: '/hot-wheels',   label: 'Hot Wheels',          emoji: '🚗', desc: 'Redlines & treasure hunts',     accent: '#fca5a5', bg: '#991b1b' },
  { id: 'comics',       path: '/comics',       label: 'Comic Books',         emoji: '💥', desc: 'Key issues & first appearances', accent: '#93c5fd', bg: '#1e3a5f' },
  { id: 'vintage-toys', path: '/vintage-toys', label: 'Vintage Toys',        emoji: '🤖', desc: 'Star Wars, Kenner, Transformers', accent: '#6ee7b7', bg: '#14532d' },
]

export default function Home() {
  const row1 = listings.filter((_, i) => i % 2 === 0)
  const row2 = listings.filter((_, i) => i % 2 === 1)

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6 border" style={{ background: '#ffffff08', borderColor: '#ffffff18' }}>
          <span>⚖️</span>
          <span className="text-gray-400">All profit goes to Reckless Ben's legal defense</span>
          <Link to="/how-it-works" className="text-yellow-400 font-semibold no-underline hover:text-yellow-300">Learn more →</Link>
        </div>
        <h1 className="font-black leading-none tracking-tight mb-4" style={{ fontSize: 'clamp(2.5rem,8vw,5.5rem)' }}>
          The collector{' '}
          <span style={{ background: 'linear-gradient(90deg,#FFDE00,#f97316,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            marketplace
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Lowest fees of any real marketplace. 4% + $0.50. Every cent of profit goes to Ben.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/sell" className="font-bold px-7 py-3 rounded-xl no-underline text-black transition-opacity hover:opacity-90" style={{ background: '#FFDE00' }}>
            Start Selling
          </Link>
          <Link to="/market" className="font-semibold px-7 py-3 rounded-xl no-underline border border-white/20 text-white hover:bg-white/10 transition-colors">
            📈 Live Market
          </Link>
        </div>
      </section>

      {/* ── CAROUSEL ROW 1 ── */}
      <section className="mb-6">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Featured Listings <Zap size={16} className="text-yellow-400" />
          </h2>
          <Link to="/browse" className="text-sm text-gray-500 hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <InfiniteCarousel items={row1} speed={28} />
      </section>

      {/* ── CAROUSEL ROW 2 ── */}
      <section className="mb-14">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Trending Now 🔥
          </h2>
          <Link to="/market" className="text-sm text-gray-500 hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <InfiniteCarousel items={row2} speed={20} />
      </section>

      {/* ── CATEGORY SELECTOR ── */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-white mb-1">Shop by Category</h2>
        <p className="text-gray-500 mb-8 text-sm">Choose what you collect — each has its own space</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAT_ROUTES.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              className="group relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center no-underline transition-all duration-200 hover:scale-105 border"
              style={{ background: `${cat.bg}18`, borderColor: `${cat.bg}44` }}
            >
              {/* hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: `${cat.bg}28` }} />
              <span style={{ fontSize: 44, position: 'relative', zIndex: 1 }}>{cat.emoji}</span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="font-bold text-white text-sm">{cat.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
              </div>
              <div
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: cat.bg, color: cat.accent, position: 'relative', zIndex: 1 }}
              >
                Browse →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CAUSE ── */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center" style={{ background: 'linear-gradient(135deg,#110d1e,#0d0a18)', border: '1px solid #ffffff12' }}>
          <div>
            <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4" style={{ background: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}>
              OUR CAUSE ⚖️
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Collectors protecting collectors</h2>
            <p className="text-gray-400 text-sm mb-3">
              Bryan Mansell's $200,000 LEGO Star Wars collection vanished when a Bricks & Minifigs franchise changed hands. YouTuber Reckless Ben investigated — and was arrested in Utah on May 30, 2026.
            </p>
            <p className="text-gray-400 text-sm mb-5">
              <strong className="text-white">60% of every platform fee</strong> goes to Ben's legal defense. 40% covers operations. Zero profit taken by us.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 font-semibold px-5 py-2 rounded-lg no-underline text-black" style={{ background: '#FFDE00' }}>
              See fee structure <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Raised for Ben', value: '$12,400+', emoji: '⚖️', accent: '#FFDE00' },
              { label: 'Active Listings', value: '20',       emoji: '🃏', accent: '#60a5fa' },
              { label: 'Categories',     value: '8',         emoji: '🧱', accent: '#4ade80' },
              { label: 'Fee to Cause',   value: '60%',       emoji: '❤️', accent: '#f87171' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xl font-bold" style={{ color: s.accent }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: <Shield size={26} className="text-indigo-400" />, title: 'Buyer Protection', body: 'Item not as described? We make it right — every transaction covered.', accent: '#6366f1' },
            { icon: <Heart size={26} className="text-rose-400" />, title: 'Mission-Driven',   body: '60% of fees go to Reckless Ben\'s defense. Every sale stands up for collectors.', accent: '#f87171' },
            { icon: <TrendingUp size={26} className="text-emerald-400" />, title: 'Lowest Real Fees', body: '4% + $0.50 — the cheapest marketplace with actual buyer protection.', accent: '#4ade80' },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-6 flex flex-col items-center text-center gap-3" style={{ background: '#ffffff06', border: '1px solid #ffffff0e' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}22` }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#06060a', borderTop: '1px solid #ffffff0a' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap justify-between gap-6 text-sm text-gray-500">
          <div>
            <div className="text-white font-bold text-lg mb-2">🎮 PlaysWell</div>
            <p className="max-w-xs text-xs">The collector marketplace built for the community, by the community.</p>
          </div>
          <div className="flex gap-10 text-xs">
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider">Categories</div>
              <div className="flex flex-col gap-2">
                {CAT_ROUTES.slice(0, 4).map(c => (
                  <Link key={c.id} to={c.path} className="hover:text-white no-underline transition-colors">{c.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider">Tools</div>
              <div className="flex flex-col gap-2">
                <Link to="/market"    className="hover:text-white no-underline transition-colors">Live Market</Link>
                <Link to="/analytics" className="hover:text-white no-underline transition-colors">Analytics</Link>
                <Link to="/grading"   className="hover:text-white no-underline transition-colors">Grading ROI</Link>
                <Link to="/pack-ev"   className="hover:text-white no-underline transition-colors">Pack EV</Link>
                <Link to="/portfolio" className="hover:text-white no-underline transition-colors">Portfolio</Link>
              </div>
            </div>
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider">Company</div>
              <div className="flex flex-col gap-2">
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors">How It Works</Link>
                <Link to="/sell"         className="hover:text-white no-underline transition-colors">Sell</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-700 border-t" style={{ borderColor: '#ffffff08' }}>
          © 2026 PlaysWell. All proceeds beyond operating costs support Reckless Ben's legal defense fund.
        </div>
      </footer>
    </div>
  )
}
