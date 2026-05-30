import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Heart, TrendingUp, Zap, ChevronRight } from 'lucide-react'
import { categories, listings } from '../data/listings'
import { trendingCards } from '../data/analytics'

// Card border colors per category
const CARD_COLORS = {
  pokemon: { border: '#FFDE00', glow: '#FFDE0044', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  lego:    { border: '#E3000B', glow: '#E3000B44', bg: 'linear-gradient(135deg, #1a0a0a, #2e1a1a)' },
  baseball:{ border: '#4ade80', glow: '#4ade8044', bg: 'linear-gradient(135deg, #0a1a0a, #1a2e1a)' },
  basketball:{ border: '#f97316', glow: '#f9731644', bg: 'linear-gradient(135deg, #1a0e0a, #2e1a0e)' },
  mtg:     { border: '#c084fc', glow: '#c084fc44', bg: 'linear-gradient(135deg, #12091a, #1e0f2e)' },
  'hot-wheels': { border: '#ef4444', glow: '#ef444444', bg: 'linear-gradient(135deg, #1a0a0a, #2e0a0a)' },
  comics:  { border: '#60a5fa', glow: '#60a5fa44', bg: 'linear-gradient(135deg, #0a0e1a, #0a162e)' },
  'vintage-toys': { border: '#34d399', glow: '#34d39944', bg: 'linear-gradient(135deg, #0a1a14, #0a2e1e)' },
}

const CONDITION_BADGE = {
  'New - Sealed': { label: 'SEALED', color: '#4ade80' },
  'Like New - Complete': { label: 'LN', color: '#60a5fa' },
  'Graded - PSA 10': { label: 'PSA 10', color: '#FFDE00' },
  'Graded - PSA 9': { label: 'PSA 9', color: '#FFDE00' },
  'Graded - PSA 8': { label: 'PSA 8', color: '#f97316' },
  'Graded - CGC 3.0': { label: 'CGC 3.0', color: '#c084fc' },
  'Raw - VG': { label: 'RAW VG', color: '#94a3b8' },
  'Good - Used': { label: 'GOOD', color: '#94a3b8' },
  'Good - Complete': { label: 'GOOD', color: '#94a3b8' },
  'Heavy Play': { label: 'HP', color: '#f87171' },
}

function MarketplaceCard({ listing, style }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge = CONDITION_BADGE[listing.condition] || { label: 'USED', color: '#94a3b8' }

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="no-underline flex-shrink-0"
      style={{ width: 180, ...style }}
    >
      <div
        className="rounded-xl overflow-hidden flex flex-col"
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: `0 0 16px ${colors.glow}`,
          background: colors.bg,
          height: 260,
        }}
      >
        {/* Condition badge */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ color: '#0f0f0f', background: badge.color, fontSize: 10 }}
          >
            {badge.label}
          </span>
          <span className="text-lg">{listing.emoji}</span>
        </div>

        {/* Big emoji art area */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ fontSize: 72, lineHeight: 1 }}
        >
          {listing.emoji}
        </div>

        {/* Card info bottom */}
        <div className="px-2 pb-2">
          <div
            className="text-xs font-bold leading-tight mb-0.5 line-clamp-1"
            style={{ color: colors.border }}
          >
            {listing.title.split(' ').slice(0, 3).join(' ')}
          </div>
          <div className="text-xs text-gray-400 line-clamp-1" style={{ fontSize: 10 }}>
            {listing.title}
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-500 uppercase" style={{ fontSize: 9 }}>BUY</span>
            <span className="font-bold" style={{ color: colors.border, fontSize: 14 }}>
              ${listing.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function InfiniteCarousel({ items, speed = 35 }) {
  const trackRef = useRef(null)
  // Triple the items for seamless loop
  const tripled = [...items, ...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = 180 + 12 // card + gap
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
          <MarketplaceCard key={`${item.id}-${i}`} listing={item} />
        ))}
      </div>
    </div>
  )
}

const CAT_PAGES = [
  { id: 'pokemon',   label: 'Pokémon Cards',        emoji: '🃏', desc: 'Raw, graded, sealed — Base Set to modern',  color: '#FFDE00', bg: '#3B4CCA' },
  { id: 'lego',      label: 'LEGO Sets',             emoji: '🧱', desc: 'Retired sets, minifigs, bulk parts',        color: '#FFD700', bg: '#E3000B' },
  { id: 'baseball',  label: 'Baseball Cards',        emoji: '⚾', desc: 'Vintage, rookie cards, graded slabs',       color: '#ffffff', bg: '#1a4a1a' },
  { id: 'basketball',label: 'Basketball Cards',      emoji: '🏀', desc: 'Rookies, refractors, short prints',         color: '#ffffff', bg: '#c9501c' },
  { id: 'mtg',       label: 'Magic: The Gathering',  emoji: '🔮', desc: 'Reserved list, foils, vintage power',       color: '#ffffff', bg: '#4a1a6b' },
  { id: 'hot-wheels',label: 'Hot Wheels',            emoji: '🚗', desc: 'Redlines, supers, treasure hunts',          color: '#ffffff', bg: '#cc0000' },
  { id: 'comics',    label: 'Comic Books',           emoji: '💥', desc: 'Key issues, first appearances, CGC slabs',  color: '#ffffff', bg: '#1a3a6b' },
  { id: 'vintage-toys', label: 'Vintage Toys',       emoji: '🤖', desc: 'Star Wars, GI Joe, Transformers, Kenner',   color: '#ffffff', bg: '#2a5a2a' },
]

export default function Home() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  // Split listings into two rows for the carousels
  const row1 = listings.filter((_, i) => i % 2 === 0)
  const row2 = listings.filter((_, i) => i % 2 === 1)

  if (selected) {
    // Category landing — show filtered view with back button
    const cat = CAT_PAGES.find(c => c.id === selected)
    const catListings = listings.filter(l => l.category === selected)
    return (
      <div style={{ background: '#0f0f14', minHeight: '100vh', color: 'white' }}>
        {/* Back bar */}
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            ← All Categories
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-white font-semibold">{cat.label}</span>
        </div>

        {/* Category hero */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="rounded-2xl p-8 mb-10 flex items-center gap-6" style={{ background: `${cat.bg}33`, border: `1px solid ${cat.bg}66` }}>
            <span style={{ fontSize: 72 }}>{cat.emoji}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: cat.color }}>{cat.label}</h1>
              <p className="text-gray-400">{cat.desc}</p>
              <Link
                to={`/browse?category=${cat.id}`}
                className="inline-flex items-center gap-2 mt-4 font-semibold px-5 py-2 rounded-lg no-underline transition-opacity hover:opacity-80"
                style={{ background: cat.bg, color: cat.color }}
              >
                View all {cat.label} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Listings grid */}
          <h2 className="text-xl font-bold text-white mb-5">
            {catListings.length > 0 ? `${catListings.length} Listings` : 'Coming Soon'}
          </h2>
          {catListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {catListings.map(l => (
                <Link key={l.id} to={`/listing/${l.id}`} className="no-underline">
                  <div
                    className="rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform"
                    style={{
                      border: `2px solid ${CARD_COLORS[l.category]?.border || '#6366f1'}`,
                      boxShadow: `0 0 12px ${CARD_COLORS[l.category]?.glow || '#6366f122'}`,
                      background: CARD_COLORS[l.category]?.bg || '#1a1a2e',
                      height: 260,
                    }}
                  >
                    <div className="flex-1 flex items-center justify-center" style={{ fontSize: 72 }}>
                      {l.emoji}
                    </div>
                    <div className="px-3 pb-3">
                      <div className="text-xs font-bold leading-tight mb-0.5 line-clamp-2 text-white">{l.title}</div>
                      <div className="text-xs text-gray-500">{l.condition}</div>
                      <div className="text-lg font-bold mt-1" style={{ color: CARD_COLORS[l.category]?.border || '#FFDE00' }}>
                        ${l.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600">
              <div className="text-6xl mb-4">{cat.emoji}</div>
              <p>No listings yet — be the first to sell!</p>
              <Link to="/sell" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg no-underline font-semibold hover:bg-indigo-700 transition-colors">
                List an Item
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0f0f14', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6 border" style={{ background: '#ffffff0d', borderColor: '#ffffff22' }}>
          <span>⚖️</span>
          <span className="text-gray-300">Proceeds support Reckless Ben's legal defense</span>
          <Link to="/how-it-works" className="text-yellow-400 font-semibold no-underline hover:text-yellow-300">Learn more →</Link>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight">
          The collector<br />
          <span style={{ background: 'linear-gradient(90deg, #FFDE00, #f97316, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            marketplace
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Lowest fees of any real marketplace. Every cent of profit goes to Ben's defense fund.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/sell" className="font-bold px-6 py-3 rounded-xl no-underline transition-colors text-black" style={{ background: '#FFDE00' }}>
            Start Selling
          </Link>
          <Link to="/market" className="font-semibold px-6 py-3 rounded-xl no-underline border border-white/20 text-white hover:bg-white/10 transition-colors">
            📈 Live Market
          </Link>
        </div>
      </section>

      {/* Auto-scrolling carousels */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Featured Listings <Zap size={18} className="text-yellow-400" />
            </h2>
            <p className="text-gray-500 text-sm">Discover our hot listings</p>
          </div>
          <Link to="/browse" className="text-sm text-gray-400 hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <InfiniteCarousel items={row1} speed={30} />
      </section>

      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Trending Now 🔥
            </h2>
            <p className="text-gray-500 text-sm">Hot cards gaining momentum</p>
          </div>
          <Link to="/market" className="text-sm text-gray-400 hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <InfiniteCarousel items={row2} speed={22} />
      </section>

      {/* Category selector */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-white mb-2">Shop by Category</h2>
        <p className="text-gray-500 mb-8">Choose what you collect</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAT_PAGES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className="group relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all hover:scale-105 cursor-pointer border"
              style={{
                background: `${cat.bg}22`,
                borderColor: `${cat.bg}55`,
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `${cat.bg}33` }}
              />
              <span style={{ fontSize: 48, position: 'relative', zIndex: 1 }}>{cat.emoji}</span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="font-bold text-white text-sm">{cat.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
              </div>
              <div
                className="text-xs font-bold px-3 py-1 rounded-full mt-1"
                style={{ background: cat.bg, color: cat.color, position: 'relative', zIndex: 1 }}
              >
                Browse →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Cause section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center" style={{ background: 'linear-gradient(135deg, #1a1228, #120e20)', border: '1px solid #ffffff15' }}>
          <div>
            <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4" style={{ background: '#f9731622', color: '#f97316', border: '1px solid #f9731644' }}>
              OUR CAUSE ⚖️
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Collectors protecting collectors</h2>
            <p className="text-gray-400 text-sm mb-3">
              Bryan Mansell's $200,000 LEGO Star Wars collection vanished when a Bricks & Minifigs franchise changed hands. YouTuber Reckless Ben investigated — and was arrested in Utah for it on May 30, 2026.
            </p>
            <p className="text-gray-400 text-sm mb-5">
              <strong className="text-white">60% of every platform fee</strong> goes to Ben's legal defense until the case is resolved. 40% covers operations. Zero profit.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 font-semibold px-5 py-2 rounded-lg no-underline transition-colors text-black" style={{ background: '#FFDE00' }}>
              See fee structure <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Raised for Ben', value: '$12,400+', emoji: '⚖️', color: '#FFDE00' },
              { label: 'Active Listings', value: '12', emoji: '🃏', color: '#60a5fa' },
              { label: 'Categories', value: '8', emoji: '🧱', color: '#4ade80' },
              { label: 'Fee to Cause', value: '60%', emoji: '❤️', color: '#f87171' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}>
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Shield size={28} className="text-indigo-400" />, title: 'Buyer Protection', body: 'Every transaction covered. Item not as described? We make it right.', color: '#6366f1' },
            { icon: <Heart size={28} className="text-rose-400" />, title: 'Mission-Driven', body: '60% of platform fees go to Reckless Ben\'s defense. Every sale is a vote for collectors.', color: '#f87171' },
            { icon: <TrendingUp size={28} className="text-emerald-400" />, title: 'Lowest Real Fees', body: '4% + $0.50 — the cheapest of any marketplace with actual payment protection.', color: '#4ade80' },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-6 flex flex-col items-center text-center gap-3" style={{ background: '#ffffff06', border: '1px solid #ffffff10' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${item.color}22` }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080810', borderTop: '1px solid #ffffff10' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap justify-between gap-6 text-sm text-gray-500">
          <div>
            <div className="text-white font-bold text-lg mb-2">🎮 PlaysWell</div>
            <p className="max-w-xs">The collector marketplace built for the community, by the community.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Marketplace</div>
              <div className="flex flex-col gap-2">
                <Link to="/browse" className="hover:text-white no-underline transition-colors">Browse</Link>
                <Link to="/sell" className="hover:text-white no-underline transition-colors">Sell</Link>
                <Link to="/market" className="hover:text-white no-underline transition-colors">Live Market</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Tools</div>
              <div className="flex flex-col gap-2">
                <Link to="/analytics" className="hover:text-white no-underline transition-colors">Analytics</Link>
                <Link to="/grading" className="hover:text-white no-underline transition-colors">Grading ROI</Link>
                <Link to="/pack-ev" className="hover:text-white no-underline transition-colors">Pack EV</Link>
                <Link to="/portfolio" className="hover:text-white no-underline transition-colors">Portfolio</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Company</div>
              <div className="flex flex-col gap-2">
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors">How It Works</Link>
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors">Fee Structure</Link>
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
