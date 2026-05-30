import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { listings, categories } from '../data/listings'

const CARD_COLORS = {
  pokemon:        { border: '#FFDE00', glow: '#FFDE0044', bg: 'linear-gradient(160deg,#1a1a2e,#16213e)' },
  lego:           { border: '#ff4444', glow: '#ff444444', bg: 'linear-gradient(160deg,#1a0808,#2e1212)' },
  baseball:       { border: '#4ade80', glow: '#4ade8044', bg: 'linear-gradient(160deg,#0a180a,#122e12)' },
  basketball:     { border: '#f97316', glow: '#f9731644', bg: 'linear-gradient(160deg,#1a0e08,#2e180e)' },
  mtg:            { border: '#c084fc', glow: '#c084fc44', bg: 'linear-gradient(160deg,#12091a,#1e0f2e)' },
  'hot-wheels':   { border: '#ef4444', glow: '#ef444444', bg: 'linear-gradient(160deg,#1a0808,#2e0808)' },
  comics:         { border: '#60a5fa', glow: '#60a5fa44', bg: 'linear-gradient(160deg,#080e1a,#0e162e)' },
  'vintage-toys': { border: '#34d399', glow: '#34d39944', bg: 'linear-gradient(160deg,#081a12,#0e2e1a)' },
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

const CAT_META = {
  pokemon:        { accent: '#FFDE00', heroBg: 'linear-gradient(135deg,#1a1a3e,#0d0d2e)', tagline: 'Base Set to modern — raw, graded & sealed' },
  lego:           { accent: '#ff4444', heroBg: 'linear-gradient(135deg,#2e0808,#1a0404)', tagline: 'Retired sets, minifigs, bulk & sealed' },
  baseball:       { accent: '#4ade80', heroBg: 'linear-gradient(135deg,#0a1a0a,#060f06)', tagline: 'Vintage grails, rookie cards & graded slabs' },
  basketball:     { accent: '#f97316', heroBg: 'linear-gradient(135deg,#1a0e08,#0f0804)', tagline: 'Rookies, refractors & short prints' },
  mtg:            { accent: '#c084fc', heroBg: 'linear-gradient(135deg,#12091a,#0a060f)', tagline: 'Reserved list, foils & vintage power 9' },
  'hot-wheels':   { accent: '#ef4444', heroBg: 'linear-gradient(135deg,#1a0808,#0f0404)', tagline: 'Redlines, supers & treasure hunts' },
  comics:         { accent: '#60a5fa', heroBg: 'linear-gradient(135deg,#08101a,#04080f)', tagline: 'Key issues, first appearances & CGC slabs' },
  'vintage-toys': { accent: '#34d399', heroBg: 'linear-gradient(135deg,#081a12,#040f09)', tagline: 'Star Wars, GI Joe, Kenner & Transformers' },
}

function CarouselCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge = BADGE[listing.condition] || { label: 'USED', color: '#fff', bg: '#475569' }
  const hasImage = !!listing.image

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline flex-shrink-0" style={{ width: 176 }}>
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 18px ${colors.glow}`, background: colors.bg, height: 264 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 6px', borderRadius: 4 }}>{badge.label}</span>
          <span style={{ fontSize: 10, color: colors.border, fontWeight: 700 }}>${listing.price.toLocaleString()}</span>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {hasImage ? (
            <img src={listing.image} alt={listing.title} className="object-contain w-full h-full" style={{ maxHeight: 160 }} loading="lazy"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          ) : null}
          <div style={{ fontSize: 68, display: hasImage ? 'none' : 'flex' }} className="items-center justify-center">
            {listing.emoji}
          </div>
        </div>
        <div className="px-2 pb-2">
          <div className="font-semibold leading-tight line-clamp-2" style={{ color: '#e2e8f0', fontSize: 10 }}>{listing.title}</div>
          <div style={{ color: '#64748b', fontSize: 9 }} className="mt-0.5">by {listing.seller}</div>
        </div>
      </div>
    </Link>
  )
}

function InfiniteCarousel({ items, speed = 28 }) {
  const trackRef = useRef(null)
  const tripled = [...items, ...items, ...items]
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = 176 + 12
    const totalW = items.length * cardW
    let pos = 0, raf
    const step = () => { pos += speed / 60; if (pos >= totalW) pos -= totalW; track.style.transform = `translateX(-${pos}px)`; raf = requestAnimationFrame(step) }
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

const SORTS = [
  { label: 'Newest', fn: (a, b) => new Date(b.listed) - new Date(a.listed) },
  { label: 'Price ↑', fn: (a, b) => a.price - b.price },
  { label: 'Price ↓', fn: (a, b) => b.price - a.price },
]

export default function CategoryPage({ catId }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState(0)
  const cat = categories.find(c => c.id === catId)
  const meta = CAT_META[catId] || { accent: '#6366f1', heroBg: '#1a1a2e', tagline: '' }
  const catListings = listings.filter(l => l.category === catId)
  const allListings = listings // use all for carousel

  const filtered = catListings
    .filter(l => !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    .sort(SORTS[sort].fn)

  if (!cat) return <div className="text-white p-10">Category not found</div>

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-500 hover:text-white no-underline transition-colors">Home</Link>
        <ChevronRight size={12} className="text-gray-600" />
        <span style={{ color: meta.accent }} className="font-semibold">{cat.label}</span>
      </div>

      {/* Hero banner */}
      <section className="mb-0" style={{ background: meta.heroBg, borderBottom: `1px solid ${meta.accent}22` }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex items-center gap-6 flex-wrap">
          <span style={{ fontSize: 80 }}>{cat.emoji}</span>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: meta.accent }}>{cat.label}</h1>
            <p className="text-gray-400">{meta.tagline}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>{catListings.length} listings</span>
              <span>·</span>
              <span>Updated daily</span>
            </div>
          </div>
          <Link to="/sell" className="font-bold px-6 py-3 rounded-xl no-underline text-black transition-opacity hover:opacity-90 flex items-center gap-2" style={{ background: meta.accent }}>
            Sell {cat.label} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Carousel inside hero */}
        {catListings.length > 0 && (
          <div className="pb-8 pt-2">
            <InfiniteCarousel items={catListings.length >= 3 ? catListings : [...catListings, ...catListings, ...catListings]} speed={24} />
          </div>
        )}
      </section>

      {/* Listings grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${cat.label}...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: '#ffffff0d', border: `1px solid ${meta.accent}33`, color: 'white' }}
            />
          </div>
          <div className="flex gap-2">
            {SORTS.map((s, i) => (
              <button
                key={i}
                onClick={() => setSort(i)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={sort === i ? { background: meta.accent, color: '#000' } : { background: '#ffffff0d', color: '#9ca3af', border: '1px solid #ffffff15' }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div style={{ fontSize: 64 }} className="mb-4">{cat.emoji}</div>
            <p className="text-gray-500 mb-2">{query ? 'No listings match your search' : 'No listings yet'}</p>
            {!query && (
              <Link to="/sell" className="inline-flex items-center gap-2 mt-3 font-semibold px-5 py-2 rounded-lg no-underline text-black" style={{ background: meta.accent }}>
                Be the first to sell <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(l => {
              const colors = CARD_COLORS[l.category] || CARD_COLORS.pokemon
              const badge = BADGE[l.condition] || { label: 'USED', color: '#fff', bg: '#475569' }
              return (
                <Link key={l.id} to={`/listing/${l.id}`} className="no-underline group">
                  <div
                    className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-105"
                    style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 14px ${colors.glow}`, background: colors.bg, height: 280 }}
                  >
                    <div className="flex items-center justify-between px-2 pt-2 pb-1">
                      <span style={{ fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 6px', borderRadius: 4 }}>{badge.label}</span>
                      <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>${l.price.toLocaleString()}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
                      {l.image ? (
                        <img src={l.image} alt={l.title} className="object-contain w-full h-full" style={{ maxHeight: 170 }} loading="lazy"
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                      ) : null}
                      <div style={{ fontSize: 72, display: l.image ? 'none' : 'flex' }} className="items-center justify-center">{l.emoji}</div>
                    </div>
                    <div className="px-3 pb-3">
                      <div className="font-semibold leading-tight line-clamp-2 text-white" style={{ fontSize: 11 }}>{l.title}</div>
                      <div className="text-gray-500 mt-1" style={{ fontSize: 9 }}>by {l.seller}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Other categories */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-lg font-bold text-white mb-5">Explore other categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.filter(c => c.id !== catId).map(c => (
            <Link
              key={c.id}
              to={`/${c.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full no-underline text-sm font-medium transition-colors hover:opacity-80"
              style={{ background: `${c.bg}33`, border: `1px solid ${c.bg}55`, color: c.color === '#ffffff' ? '#e2e8f0' : c.color }}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
