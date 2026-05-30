import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Shield, Heart, TrendingUp, Zap } from 'lucide-react'
import { listings } from '../data/listings'

const CARD_COLORS = {
  pokemon:        { border: '#FFDE00', glow: '#FFDE0033', bg: 'linear-gradient(160deg,#1a1a2e,#16213e)' },
  lego:           { border: '#ff4444', glow: '#ff444433', bg: 'linear-gradient(160deg,#1a0808,#2e1212)' },
  baseball:       { border: '#4ade80', glow: '#4ade8033', bg: 'linear-gradient(160deg,#0a180a,#122e12)' },
  basketball:     { border: '#f97316', glow: '#f9731633', bg: 'linear-gradient(160deg,#1a0e08,#2e180e)' },
  mtg:            { border: '#c084fc', glow: '#c084fc33', bg: 'linear-gradient(160deg,#12091a,#1e0f2e)' },
  'hot-wheels':   { border: '#ef4444', glow: '#ef444433', bg: 'linear-gradient(160deg,#1a0808,#2e0808)' },
  comics:         { border: '#60a5fa', glow: '#60a5fa33', bg: 'linear-gradient(160deg,#080e1a,#0e162e)' },
  'vintage-toys': { border: '#34d399', glow: '#34d39933', bg: 'linear-gradient(160deg,#081a12,#0e2e1a)' },
}

const BADGE = {
  'New - Sealed':        { label: 'SEALED',  color: '#000', bg: '#4ade80' },
  'Like New - Complete': { label: 'LN',      color: '#000', bg: '#60a5fa' },
  'Graded - PSA 10':     { label: 'PSA 10',  color: '#000', bg: '#FFDE00' },
  'Graded - PSA 9':      { label: 'PSA 9',   color: '#000', bg: '#FFDE00' },
  'Graded - PSA 8':      { label: 'PSA 8',   color: '#000', bg: '#f97316' },
  'Graded - CGC 3.0':    { label: 'CGC 3.0', color: '#fff', bg: '#7c3aed' },
  'Raw - VG':            { label: 'RAW',     color: '#fff', bg: '#475569' },
  'Good - Used':         { label: 'GOOD',    color: '#fff', bg: '#475569' },
  'Good - Complete':     { label: 'GOOD',    color: '#fff', bg: '#475569' },
  'Heavy Play':          { label: 'HP',      color: '#fff', bg: '#dc2626' },
}

const CAT_ROUTES = [
  { id: 'pokemon',      path: '/pokemon',      label: 'Pokemon Cards',        sub: 'Raw, graded, sealed',           accent: '#FFDE00', bg: '#3B4CCA' },
  { id: 'lego',         path: '/lego',         label: 'LEGO Sets',            sub: 'Retired sets & minifigs',        accent: '#ff4444', bg: '#CC0000' },
  { id: 'baseball',     path: '/baseball',     label: 'Baseball Cards',       sub: 'Vintage, rookies, graded',       accent: '#4ade80', bg: '#14532d' },
  { id: 'basketball',   path: '/basketball',   label: 'Basketball Cards',     sub: 'Refractors & rookies',           accent: '#fdba74', bg: '#9a3412' },
  { id: 'mtg',          path: '/mtg',          label: 'Magic: The Gathering', sub: 'Reserved list & vintage power',  accent: '#c084fc', bg: '#4c1d95' },
  { id: 'hot-wheels',   path: '/hot-wheels',   label: 'Hot Wheels',           sub: 'Redlines & treasure hunts',      accent: '#fca5a5', bg: '#991b1b' },
  { id: 'comics',       path: '/comics',       label: 'Comic Books',          sub: 'Key issues & first appearances', accent: '#93c5fd', bg: '#1e3a5f' },
  { id: 'vintage-toys', path: '/vintage-toys', label: 'Vintage Toys',         sub: 'Star Wars, Kenner, Transformers',accent: '#6ee7b7', bg: '#14532d' },
]

function CarouselCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = BADGE[listing.condition]      || { label: 'USED', color: '#fff', bg: '#475569' }

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline flex-shrink-0" style={{ width: 176 }}>
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105 cursor-pointer"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 16px ${colors.glow}`, background: colors.bg, height: 264 }}
      >
        {/* Badge + price */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 5px', borderRadius: 3, letterSpacing: '0.05em' }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>
            ${listing.price.toLocaleString()}
          </span>
        </div>

        {/* Card image */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.cardName}
              className="object-contain w-full h-full"
              style={{ maxHeight: 158 }}
              loading="lazy"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          {/* Fallback: colored rectangle with name */}
          <div
            className="w-full rounded-lg items-center justify-center text-center px-2"
            style={{ height: 158, background: `${colors.border}15`, border: `1px solid ${colors.border}30`, display: listing.image ? 'none' : 'flex', flexDirection: 'column' }}
          >
            <span style={{ color: colors.border, fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{listing.cardName}</span>
            <span style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{listing.set}</span>
          </div>
        </div>

        {/* Card name + set */}
        <div className="px-2 pb-2 pt-1">
          <div style={{ color: '#f1f5f9', fontSize: 10, fontWeight: 600, lineHeight: 1.3 }} className="line-clamp-1">
            {listing.cardName}
          </div>
          <div style={{ color: '#64748b', fontSize: 9, marginTop: 1 }} className="line-clamp-1">
            {listing.set} &middot; {listing.number}
          </div>
        </div>
      </div>
    </Link>
  )
}

function InfiniteCarousel({ items, speed = 30 }) {
  const trackRef = useRef(null)
  const tripled  = [...items, ...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW  = 176 + 12
    const totalW = items.length * cardW
    let pos = 0, raf
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
        {tripled.map((item, i) => <CarouselCard key={`${item.id}-${i}`} listing={item} />)}
      </div>
    </div>
  )
}

export default function Home() {
  const row1 = listings.filter((_, i) => i % 2 === 0)
  const row2 = listings.filter((_, i) => i % 2 === 1)

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-6 border" style={{ background: '#ffffff08', borderColor: '#ffffff15', color: '#9ca3af' }}>
          All profit goes to Reckless Ben's legal defense &mdash;
          <Link to="/how-it-works" className="text-amber-400 font-semibold no-underline hover:text-amber-300 transition-colors">Learn more</Link>
        </div>
        <h1 className="font-black leading-none tracking-tight mb-4" style={{ fontSize: 'clamp(2.5rem,8vw,5.5rem)' }}>
          The collector{' '}
          <span style={{ background: 'linear-gradient(90deg,#FFDE00,#f97316,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            marketplace
          </span>
        </h1>
        <p style={{ color: '#6b7280' }} className="text-lg mb-8 max-w-xl mx-auto">
          Lowest fees of any real marketplace — 4% + $0.50. Every cent of profit funds Ben's defense.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/sell"   className="font-bold px-7 py-3 rounded-xl no-underline text-black transition-opacity hover:opacity-90" style={{ background: '#FFDE00' }}>Start Selling</Link>
          <Link to="/submit" className="font-semibold px-7 py-3 rounded-xl no-underline border transition-colors text-white hover:bg-white/10" style={{ borderColor: '#ffffff20' }}>Submit an Item</Link>
          <Link to="/market" className="font-semibold px-7 py-3 rounded-xl no-underline border transition-colors text-white hover:bg-white/10" style={{ borderColor: '#ffffff20' }}>Live Market</Link>
        </div>
      </section>

      {/* Carousel 1 */}
      <section className="mb-6">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">Featured Listings <Zap size={14} className="text-yellow-400" /></h2>
            <p style={{ color: '#6b7280', fontSize: 12 }}>Discover our hot listings</p>
          </div>
          <Link to="/browse" style={{ color: '#6b7280', fontSize: 13 }} className="hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={13} />
          </Link>
        </div>
        <InfiniteCarousel items={row1} speed={28} />
      </section>

      {/* Carousel 2 */}
      <section className="mb-14">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Trending Now</h2>
            <p style={{ color: '#6b7280', fontSize: 12 }}>Hot cards gaining momentum</p>
          </div>
          <Link to="/market" style={{ color: '#6b7280', fontSize: 13 }} className="hover:text-white no-underline flex items-center gap-1 transition-colors">
            View All <ChevronRight size={13} />
          </Link>
        </div>
        <InfiniteCarousel items={row2} speed={20} />
      </section>

      {/* Category selector */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-1">Shop by Category</h2>
        <p style={{ color: '#6b7280', fontSize: 13 }} className="mb-7">Choose what you collect</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAT_ROUTES.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              className="group relative rounded-xl p-5 flex flex-col gap-3 no-underline transition-all duration-200 hover:scale-[1.03] border"
              style={{ background: `${cat.bg}18`, borderColor: `${cat.bg}44` }}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: `${cat.bg}22` }} />
              {/* Color accent bar */}
              <div className="w-8 h-1 rounded-full" style={{ background: cat.accent }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="font-bold text-white text-sm">{cat.label}</div>
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{cat.sub}</div>
              </div>
              <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ color: cat.accent, fontSize: 11, fontWeight: 600 }}>Browse</span>
                <ArrowRight size={12} style={{ color: cat.accent }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cause */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center" style={{ background: 'linear-gradient(135deg,#110d1e,#0d0a18)', border: '1px solid #ffffff10' }}>
          <div>
            <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4" style={{ background: '#f9731618', color: '#f97316', border: '1px solid #f9731635' }}>
              OUR CAUSE
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Collectors protecting collectors</h2>
            <p style={{ color: '#6b7280' }} className="text-sm mb-3">
              Bryan Mansell's $200,000 LEGO Star Wars collection vanished when a Bricks &amp; Minifigs franchise changed hands. YouTuber Reckless Ben investigated — and was arrested in Utah on May 30, 2026.
            </p>
            <p style={{ color: '#6b7280' }} className="text-sm mb-5">
              <strong className="text-white">60% of every platform fee</strong> goes to Ben's legal defense. 40% covers operations. Zero profit taken.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 font-semibold px-5 py-2 rounded-lg no-underline text-black transition-opacity hover:opacity-90" style={{ background: '#FFDE00' }}>
              See fee structure <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Raised for Ben', value: '$12,400+', accent: '#FFDE00' },
              { label: 'Active Listings', value: '20',       accent: '#60a5fa' },
              { label: 'Categories',     value: '8',         accent: '#4ade80' },
              { label: 'Fee to Cause',   value: '60%',       accent: '#f87171' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#ffffff07', border: '1px solid #ffffff0e' }}>
                <div className="text-xl font-bold" style={{ color: s.accent }}>{s.value}</div>
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Shield,    title: 'Buyer Protection', body: 'Item not as described? We make it right — every transaction covered.',                  accent: '#6366f1' },
            { Icon: Heart,     title: 'Mission-Driven',   body: '60% of fees go to Reckless Ben\'s defense. Every sale stands up for collectors.',        accent: '#f87171' },
            { Icon: TrendingUp,title: 'Lowest Real Fees', body: '4% + $0.50 — cheaper than eBay (13%), Mercari (10%), and TCGPlayer (10.75%).',            accent: '#4ade80' },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-6 flex flex-col items-center text-center gap-3" style={{ background: '#ffffff05', border: '1px solid #ffffff0c' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}20` }}>
                <item.Icon size={22} style={{ color: item.accent }} />
              </div>
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#06060a', borderTop: '1px solid #ffffff08' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap justify-between gap-6 text-sm" style={{ color: '#6b7280' }}>
          <div>
            <div className="text-white font-bold text-base mb-2">PlaysWell</div>
            <p className="max-w-xs text-xs">The collector marketplace built for the community, by the community.</p>
          </div>
          <div className="flex gap-10 text-xs">
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-xs">Categories</div>
              <div className="flex flex-col gap-2">
                {CAT_ROUTES.slice(0,4).map(c => <Link key={c.id} to={c.path} className="hover:text-white no-underline transition-colors" style={{ color: '#6b7280' }}>{c.label}</Link>)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-xs">Tools</div>
              <div className="flex flex-col gap-2">
                {[{to:'/market','label':'Live Market'},{to:'/analytics','label':'Analytics'},{to:'/grading','label':'Grading ROI'},{to:'/pack-ev','label':'Pack EV'},{to:'/portfolio','label':'Portfolio'}].map(l => (
                  <Link key={l.to} to={l.to} className="hover:text-white no-underline transition-colors" style={{ color: '#6b7280' }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-xs">Company</div>
              <div className="flex flex-col gap-2">
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors" style={{ color: '#6b7280' }}>How It Works</Link>
                <Link to="/submit"       className="hover:text-white no-underline transition-colors" style={{ color: '#6b7280' }}>Submit Item</Link>
                <Link to="/sell"         className="hover:text-white no-underline transition-colors" style={{ color: '#6b7280' }}>Sell</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs border-t" style={{ color: '#374151', borderColor: '#ffffff08' }}>
          &copy; 2026 PlaysWell. All proceeds beyond operating costs support Reckless Ben's legal defense fund.
        </div>
      </footer>
    </div>
  )
}
