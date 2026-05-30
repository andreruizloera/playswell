import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { listings, categories } from '../data/listings'

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

const CAT_META = {
  pokemon:        { accent: '#FFDE00', heroBg: '#0d0d1e', tagline: 'Base Set to modern — raw, graded & sealed' },
  lego:           { accent: '#ff4444', heroBg: '#1a0606', tagline: 'Retired sets, minifigs, bulk & sealed' },
  baseball:       { accent: '#4ade80', heroBg: '#060f06', tagline: 'Vintage grails, rookie cards & graded slabs' },
  basketball:     { accent: '#f97316', heroBg: '#0f0804', tagline: 'Rookies, refractors & short prints' },
  mtg:            { accent: '#c084fc', heroBg: '#0a060f', tagline: 'Reserved list, foils & vintage power' },
  'hot-wheels':   { accent: '#ef4444', heroBg: '#0f0404', tagline: 'Redlines, supers & treasure hunts' },
  comics:         { accent: '#60a5fa', heroBg: '#04080f', tagline: 'Key issues, first appearances & CGC slabs' },
  'vintage-toys': { accent: '#34d399', heroBg: '#040f08', tagline: 'Star Wars, GI Joe, Kenner & Transformers' },
}

function ListingCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = BADGE[listing.condition]      || { label: 'USED', color: '#fff', bg: '#475569' }

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline group">
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-[1.03]"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 14px ${colors.glow}`, background: colors.bg, height: 290 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 5px', borderRadius: 3, letterSpacing: '0.05em' }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>${listing.price.toLocaleString()}</span>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.cardName}
              className="object-contain w-full h-full"
              style={{ maxHeight: 175 }}
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
          ) : null}
          <div
            className="w-full rounded-lg items-center justify-center text-center px-3"
            style={{ height: 175, background: `${colors.border}12`, border: `1px solid ${colors.border}25`, display: listing.image ? 'none' : 'flex', flexDirection: 'column' }}
          >
            <span style={{ color: colors.border, fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{listing.cardName}</span>
            <span style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{listing.set}</span>
          </div>
        </div>

        <div className="px-3 pb-3 pt-1">
          <div style={{ color: '#f1f5f9', fontSize: 11, fontWeight: 700 }} className="line-clamp-1">{listing.cardName}</div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 1 }}>{listing.set} &middot; {listing.number}</div>
          <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{listing.condition}</div>
        </div>
      </div>
    </Link>
  )
}

function CarouselCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = BADGE[listing.condition]      || { label: 'USED', color: '#fff', bg: '#475569' }

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline flex-shrink-0" style={{ width: 160 }}>
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 14px ${colors.glow}`, background: colors.bg, height: 240 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 5px', borderRadius: 3 }}>{badge.label}</span>
          <span style={{ fontSize: 10, color: colors.border, fontWeight: 700 }}>${listing.price.toLocaleString()}</span>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {listing.image ? (
            <img src={listing.image} alt={listing.cardName} className="object-contain w-full h-full" style={{ maxHeight: 140 }} loading="lazy"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          ) : null}
          <div className="w-full rounded items-center justify-center text-center px-2"
            style={{ height: 140, background: `${colors.border}12`, border: `1px solid ${colors.border}25`, display: listing.image ? 'none' : 'flex', flexDirection: 'column' }}>
            <span style={{ color: colors.border, fontSize: 11, fontWeight: 700 }}>{listing.cardName}</span>
          </div>
        </div>
        <div className="px-2 pb-2">
          <div style={{ color: '#f1f5f9', fontSize: 9, fontWeight: 600 }} className="line-clamp-1">{listing.cardName}</div>
          <div style={{ color: '#64748b', fontSize: 8, marginTop: 1 }}>{listing.set}</div>
        </div>
      </div>
    </Link>
  )
}

function InfiniteCarousel({ items, speed = 24 }) {
  const trackRef = useRef(null)
  const tripled  = [...items, ...items, ...items]
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW  = 160 + 12
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
  { label: 'Newest',   fn: (a, b) => new Date(b.listed) - new Date(a.listed) },
  { label: 'Price: Low',  fn: (a, b) => a.price - b.price },
  { label: 'Price: High', fn: (a, b) => b.price - a.price },
]

export default function CategoryPage({ catId }) {
  const [query, setQuery] = useState('')
  const [sort, setSort]   = useState(0)

  const cat  = categories.find(c => c.id === catId)
  const meta = CAT_META[catId] || { accent: '#6366f1', heroBg: '#0a0a0f', tagline: '' }
  const catListings = listings.filter(l => l.category === catId)

  const filtered = catListings
    .filter(l => !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.cardName.toLowerCase().includes(query.toLowerCase()) || l.set.toLowerCase().includes(query.toLowerCase()))
    .sort(SORTS[sort].fn)

  if (!cat) return <div className="text-white p-10">Category not found</div>

  const carouselItems = catListings.length >= 3 ? catListings : [...catListings, ...catListings, ...catListings]

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2" style={{ fontSize: 13 }}>
        <Link to="/" className="no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>Home</Link>
        <ChevronRight size={12} style={{ color: '#4b5563' }} />
        <span style={{ color: meta.accent }} className="font-semibold">{cat.label}</span>
      </div>

      {/* Hero */}
      <section style={{ background: meta.heroBg, borderBottom: `1px solid ${meta.accent}22` }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="w-10 h-1 rounded-full mb-4" style={{ background: meta.accent }} />
            <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: meta.accent }}>{cat.label}</h1>
            <p style={{ color: '#6b7280' }} className="text-sm">{meta.tagline}</p>
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#4b5563' }}>
              <span>{catListings.length} listing{catListings.length !== 1 ? 's' : ''}</span>
              <span>&middot;</span>
              <span>Updated daily</span>
            </div>
          </div>
          <Link to="/sell" className="font-bold px-5 py-2.5 rounded-xl no-underline text-black text-sm flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: meta.accent }}>
            Sell {cat.label} <ArrowRight size={15} />
          </Link>
        </div>

        {catListings.length > 0 && (
          <div className="pb-8">
            <InfiniteCarousel items={carouselItems} speed={22} />
          </div>
        )}
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
            <input
              type="text"
              placeholder={`Search ${cat.label}...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: '#ffffff0a', border: `1px solid ${meta.accent}30`, color: 'white' }}
            />
          </div>
          <div className="flex gap-2">
            {SORTS.map((s, i) => (
              <button key={i} onClick={() => setSort(i)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={sort === i ? { background: meta.accent, color: '#000' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                {s.label}
              </button>
            ))}
          </div>
          <span style={{ color: '#6b7280', fontSize: 13 }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ color: '#6b7280', marginBottom: 8 }}>{query ? 'No listings match your search.' : 'No listings yet in this category.'}</p>
            {!query && (
              <Link to="/sell" className="inline-flex items-center gap-2 mt-2 font-semibold px-5 py-2 rounded-lg no-underline text-black text-sm" style={{ background: meta.accent }}>
                Be the first to sell <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* Other categories */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider" style={{ color: '#6b7280' }}>Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.id !== catId).map(c => (
            <Link key={c.id} to={`/${c.id}`}
              className="px-3 py-1.5 rounded-full no-underline text-xs font-medium transition-colors hover:opacity-80"
              style={{ background: `${c.bg}25`, border: `1px solid ${c.bg}45`, color: '#d1d5db' }}>
              {c.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
