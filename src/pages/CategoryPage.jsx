import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Search, ChevronLeft } from 'lucide-react'
import { categories } from '../data/listings'
import { getListings } from '../lib/api'

const CARD_COLORS = {
  pokemon:        { border: '#FFDE00', glow: '#FFDE0033', bg: 'linear-gradient(160deg,#1a1a2e,#16213e)', imgBg: '#1a1a2e' },
  lego:           { border: '#ff4444', glow: '#ff444433', bg: 'linear-gradient(160deg,#1a0808,#2e1212)', imgBg: '#1a0808' },
  baseball:       { border: '#4ade80', glow: '#4ade8033', bg: 'linear-gradient(160deg,#0a180a,#122e12)', imgBg: '#0a180a' },
  basketball:     { border: '#f97316', glow: '#f9731633', bg: 'linear-gradient(160deg,#1a0e08,#2e180e)', imgBg: '#1a0e08' },
  mtg:            { border: '#c084fc', glow: '#c084fc33', bg: 'linear-gradient(160deg,#12091a,#1e0f2e)', imgBg: '#12091a' },
  'hot-wheels':   { border: '#ef4444', glow: '#ef444433', bg: 'linear-gradient(160deg,#1a0808,#2e0808)', imgBg: '#1a0808' },
  comics:         { border: '#60a5fa', glow: '#60a5fa33', bg: 'linear-gradient(160deg,#080e1a,#0e162e)', imgBg: '#080e1a' },
  'vintage-toys': { border: '#34d399', glow: '#34d39933', bg: 'linear-gradient(160deg,#081a12,#0e2e1a)', imgBg: '#081a12' },
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
  pokemon:        { accent: '#FFDE00', tagline: 'Base Set to modern era — raw, graded & sealed' },
  lego:           { accent: '#ff4444', tagline: '26,939 sets in our catalog — Star Wars, Technic, Icons & more' },
  baseball:       { accent: '#4ade80', tagline: 'Vintage grails, rookie cards & graded slabs' },
  basketball:     { accent: '#f97316', tagline: 'Rookies, refractors & short prints' },
  mtg:            { accent: '#c084fc', tagline: 'Reserved list, foils & vintage power 9' },
  'hot-wheels':   { accent: '#ef4444', tagline: 'Redlines, supers & treasure hunts' },
  comics:         { accent: '#60a5fa', tagline: 'Key issues, first appearances & CGC slabs' },
  'vintage-toys': { accent: '#34d399', tagline: 'Star Wars, GI Joe, Kenner & Transformers' },
}

// ── Card components ──────────────────────────────────────────────────────────

function isLegoLike(catId) {
  return catId === 'lego' || catId === 'hot-wheels' || catId === 'vintage-toys' || catId === 'comics'
}

function CardImage({ listing, colors, height = 155 }) {
  const [err, setErr] = useState(false)
  const lego = isLegoLike(listing.category)

  if (!listing.image_url || err) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-3"
        style={{ background: `${colors.border}10`, height }}>
        <span style={{ color: colors.border, fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{listing.card_name}</span>
        <span style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{listing.set_name}</span>
      </div>
    )
  }

  return (
    <img
      src={listing.image_url}
      alt={listing.card_name}
      className="w-full h-full"
      style={{
        objectFit: lego ? 'cover' : 'contain',
        objectPosition: 'center',
        height,
      }}
      loading="lazy"
      onError={() => setErr(true)}
    />
  )
}

function CarouselCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = BADGE[listing.condition] || { label: 'USED', color: '#fff', bg: '#475569' }

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline flex-shrink-0 group" style={{ width: 176 }}>
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-105"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 16px ${colors.glow}`, background: colors.bg, height: 264 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 5px', borderRadius: 3 }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>${parseFloat(listing.price).toLocaleString()}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <CardImage listing={listing} colors={colors} height={175} />
        </div>
        <div className="px-2 pb-2 pt-1">
          <div style={{ color: '#f1f5f9', fontSize: 10, fontWeight: 600 }} className="line-clamp-1">{listing.card_name}</div>
          <div style={{ color: '#64748b', fontSize: 9, marginTop: 1 }}>{listing.set_name}</div>
        </div>
      </div>
    </Link>
  )
}

function GridCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = BADGE[listing.condition] || { label: 'USED', color: '#fff', bg: '#475569' }

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline group">
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-[1.03]"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 14px ${colors.glow}`, background: colors.bg, height: 290 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color, padding: '2px 5px', borderRadius: 3 }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>${parseFloat(listing.price).toLocaleString()}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <CardImage listing={listing} colors={colors} height={200} />
        </div>
        <div className="px-3 pb-3 pt-1">
          <div style={{ color: '#f1f5f9', fontSize: 11, fontWeight: 700 }} className="line-clamp-1">{listing.card_name}</div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 1 }}>{listing.set_name}{listing.card_number ? ` · ${listing.card_number}` : ''}</div>
          <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{listing.condition}</div>
        </div>
      </div>
    </Link>
  )
}

// ── Infinite carousel ────────────────────────────────────────────────────────

function InfiniteCarousel({ items, speed = 24 }) {
  const trackRef = useRef(null)
  const tripled  = [...items, ...items, ...items]

  useEffect(() => {
    if (!items.length) return
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

  if (!items.length) return null

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex gap-3" style={{ willChange: 'transform', width: 'max-content' }}>
        {tripled.map((item, i) => <CarouselCard key={`${item.id}-${i}`} listing={item} />)}
      </div>
    </div>
  )
}

// ── Sorts ────────────────────────────────────────────────────────────────────

const SORTS = [
  { label: 'Newest',      sort: 'listed_at', order: 'desc' },
  { label: 'Price: Low',  sort: 'price',     order: 'asc'  },
  { label: 'Price: High', sort: 'price',     order: 'desc' },
  { label: 'Name',        sort: 'card_name', order: 'asc'  },
]

// ── Main component ───────────────────────────────────────────────────────────

export default function CategoryPage({ catId }) {
  const [carouselItems, setCarouselItems] = useState([])
  const [listings,      setListings]      = useState([])
  const [total,         setTotal]         = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [query,         setQuery]         = useState('')
  const [sortIdx,       setSortIdx]       = useState(0)
  const [page,          setPage]          = useState(1)
  const PAGE_SIZE = 20

  const cat  = categories.find(c => c.id === catId)
  const meta = CAT_META[catId] || { accent: '#6366f1', tagline: '' }
  const colors = CARD_COLORS[catId] || CARD_COLORS.pokemon

  // Fetch carousel (first load, unfiltered, most recent)
  useEffect(() => {
    getListings({ category: catId, pageSize: 20, sort: 'listed_at', order: 'desc' })
      .then(res => setCarouselItems(res.data))
      .catch(() => {})
  }, [catId])

  // Fetch grid listings
  const fetchGrid = useCallback(async () => {
    setLoading(true)
    try {
      const params = { category: catId, pageSize: PAGE_SIZE, page, ...SORTS[sortIdx] }
      if (query) params.q = query
      const res = await getListings(params)
      setListings(res.data)
      setTotal(res.total)
    } catch (e) {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [catId, query, sortIdx, page])

  useEffect(() => { fetchGrid() }, [fetchGrid])
  useEffect(() => { setPage(1) }, [catId, query, sortIdx])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (!cat) return <div style={{ color: 'white', padding: 40 }}>Category not found</div>

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(180deg, ${colors.bg.split(',')[0].replace('linear-gradient(160deg','')} 0%, #0a0a0f 100%)`, borderBottom: `1px solid ${meta.accent}22` }}>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2" style={{ fontSize: 12 }}>
          <Link to="/" className="no-underline transition-colors hover:text-white" style={{ color: '#4b5563' }}>Home</Link>
          <ChevronRight size={12} style={{ color: '#374151' }} />
          <span style={{ color: meta.accent }} className="font-semibold">{cat.label}</span>
        </div>

        {/* Title */}
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="w-8 h-1 rounded-full mb-4" style={{ background: meta.accent }} />
            <h1 className="font-black mb-2" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: meta.accent, lineHeight: 1 }}>
              {cat.label}
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{meta.tagline}</p>
            <div className="flex items-center gap-4 mt-3" style={{ fontSize: 12, color: '#4b5563' }}>
              <span>{total.toLocaleString()} listing{total !== 1 ? 's' : ''}</span>
              <span>&middot;</span>
              <span>Updated daily</span>
            </div>
          </div>
          <Link
            to="/sell"
            className="font-bold px-5 py-2.5 rounded-xl no-underline text-black text-sm flex items-center gap-2 transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: meta.accent }}
          >
            Sell {cat.label} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel */}
        {carouselItems.length > 0 && (
          <div className="pb-8">
            <InfiniteCarousel
              items={carouselItems.length >= 4 ? carouselItems : [...carouselItems, ...carouselItems]}
              speed={catId === 'lego' ? 20 : 24}
            />
          </div>
        )}

        {carouselItems.length === 0 && (
          <div className="pb-8 px-4">
            <div className="h-64 rounded-xl flex items-center justify-center" style={{ background: '#ffffff05', border: '1px dashed #ffffff10' }}>
              <p style={{ color: '#374151' }}>Be the first to list in this category</p>
            </div>
          </div>
        )}
      </section>

      {/* ── GRID ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* Filter bar */}
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
              <button key={i} onClick={() => setSortIdx(i)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={sortIdx === i ? { background: meta.accent, color: '#000' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                {s.label}
              </button>
            ))}
          </div>
          <span style={{ color: '#6b7280', fontSize: 12 }}>{total.toLocaleString()} result{total !== 1 ? 's' : ''}</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse" style={{ height: 290, background: '#ffffff06' }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ color: '#6b7280' }} className="mb-3">
              {query ? 'No listings match your search.' : 'No listings yet in this category.'}
            </p>
            {!query && (
              <Link to="/sell" className="inline-flex items-center gap-2 font-semibold px-5 py-2 rounded-lg no-underline text-black text-sm" style={{ background: meta.accent }}>
                Be the first to sell <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(l => <GridCard key={l.id} listing={l} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#6b7280', fontSize: 13 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* ── OTHER CATEGORIES ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Other Categories</h2>
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
