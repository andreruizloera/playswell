import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Search, ChevronLeft, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { categories, listings as staticListings } from '../data/listings'
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
  { label: 'Newest First',   sort: 'listed_at', order: 'desc' },
  { label: 'Price: Low',     sort: 'price',     order: 'asc'  },
  { label: 'Price: High',    sort: 'price',     order: 'desc' },
  { label: 'Name A–Z',       sort: 'card_name', order: 'asc'  },
]

const CONDITIONS = [
  'New - Sealed',
  'Like New - Complete',
  'Graded - PSA 10',
  'Graded - PSA 9',
  'Graded - PSA 8',
  'Graded - CGC 3.0',
  'Raw - VG',
  'Good - Complete',
  'Good - Used',
  'Heavy Play',
]

const PRICE_PRESETS = [
  { label: 'Any',      min: '',    max: '' },
  { label: 'Under $50',min: '',    max: '50' },
  { label: '$50–$200', min: '50',  max: '200' },
  { label: '$200–$500',min: '200', max: '500' },
  { label: '$500–$1K', min: '500', max: '1000' },
  { label: 'Over $1K', min: '1000',max: '' },
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
  const [minPrice,      setMinPrice]      = useState('')
  const [maxPrice,      setMaxPrice]      = useState('')
  const [condition,     setCondition]     = useState('')
  const [viewMode,      setViewMode]      = useState('grid') // grid | list
  const [filtersOpen,   setFiltersOpen]   = useState(false)
  const PAGE_SIZE = 40

  const activeFilterCount = [query, minPrice, maxPrice, condition].filter(Boolean).length

  function clearFilters() {
    setQuery(''); setMinPrice(''); setMaxPrice(''); setCondition(''); setPage(1)
  }

  const cat  = categories.find(c => c.id === catId)
  const meta = CAT_META[catId] || { accent: '#6366f1', tagline: '' }
  const colors = CARD_COLORS[catId] || CARD_COLORS.pokemon

  // Static fallback — filter + shape static data to match API response shape
  function getStaticFallback(catId, q = '', sortIdx = 0, page = 1, pageSize = 20, minP = '', maxP = '', cond = '') {
    const sort = SORTS[sortIdx]
    let items = staticListings.filter(l => l.category === catId)
    if (q) items = items.filter(l =>
      l.cardName?.toLowerCase().includes(q.toLowerCase()) ||
      l.set?.toLowerCase().includes(q.toLowerCase()) ||
      l.title?.toLowerCase().includes(q.toLowerCase())
    )
    if (minP) items = items.filter(l => l.price >= parseFloat(minP))
    if (maxP) items = items.filter(l => l.price <= parseFloat(maxP))
    if (cond) items = items.filter(l => l.condition === cond)
    if (sort.sort === 'price') items = [...items].sort((a,b) => sort.order === 'asc' ? a.price - b.price : b.price - a.price)
    else if (sort.sort === 'card_name') items = [...items].sort((a,b) => (a.cardName||'').localeCompare(b.cardName||''))
    else items = [...items].sort((a,b) => new Date(b.listed||0) - new Date(a.listed||0))
    const total = items.length
    const paged = items.slice((page-1)*pageSize, page*pageSize)
    // Normalize shape to match API
    return {
      data: paged.map(l => ({
        ...l,
        id: l.id,
        card_name: l.cardName || l.title,
        set_name:  l.set || '',
        card_number: l.number || null,
        image_url: l.image || null,
        condition: l.condition,
        seller_name: l.seller,
        listed_at: l.listed || '',
      })),
      total,
    }
  }

  // Fetch carousel (first load, unfiltered, most recent)
  useEffect(() => {
    getListings({ category: catId, pageSize: 20, sort: 'listed_at', order: 'desc' })
      .then(res => setCarouselItems(res.data))
      .catch(() => {
        // Fallback to static data
        const fb = getStaticFallback(catId, '', 0, 1, 20)
        setCarouselItems(fb.data)
      })
  }, [catId])

  // Fetch grid listings
  const fetchGrid = useCallback(async () => {
    setLoading(true)
    try {
      const params = { category: catId, pageSize: PAGE_SIZE, page, ...SORTS[sortIdx] }
      if (query)    params.q = query
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      const res = await getListings(params)
      // client-side condition filter (not in backend yet)
      const filtered = condition
        ? res.data.filter(l => l.condition === condition)
        : res.data
      setListings(filtered)
      setTotal(condition ? filtered.length : res.total)
    } catch (e) {
      const fb = getStaticFallback(catId, query, sortIdx, page, PAGE_SIZE, minPrice, maxPrice, condition)
      setListings(fb.data)
      setTotal(fb.total)
    } finally {
      setLoading(false)
    }
  }, [catId, query, sortIdx, page, minPrice, maxPrice, condition])

  useEffect(() => { fetchGrid() }, [fetchGrid])
  useEffect(() => { setPage(1) }, [catId, query, sortIdx, minPrice, maxPrice, condition])

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

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid #ffffff08' }}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Listings Available', value: total > 0 ? total.toLocaleString() : '—' },
              { label: 'Lowest Price', value: listings.length > 0 ? `$${Math.min(...listings.map(l => parseFloat(l.price))).toLocaleString()}` : '—' },
              { label: 'Highest Price', value: listings.length > 0 ? `$${Math.max(...listings.map(l => parseFloat(l.price))).toLocaleString()}` : '—' },
              { label: 'Platform Fee', value: '4% + $0.50' },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-5 py-4" style={{ background: '#ffffff05', border: '1px solid #ffffff08' }}>
                <div className="font-black text-xl" style={{ color: meta.accent }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP PICKS ────────────────────────────────────────────────────── */}
      {carouselItems.length > 0 && (
        <section style={{ borderBottom: '1px solid #ffffff08' }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-white text-lg">Top Picks</h2>
                <p style={{ color: '#4b5563', fontSize: 12 }}>Featured listings in this category</p>
              </div>
              <Link to="/browse" className="text-xs font-semibold no-underline flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#6b7280' }}>
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {carouselItems.slice(0, 6).map(l => {
                const c = CARD_COLORS[l.category] || CARD_COLORS.pokemon
                const badge = BADGE[l.condition] || { label: 'USED', color: '#fff', bg: '#475569' }
                return (
                  <Link key={l.id} to={`/listing/${l.id}`} className="no-underline group">
                    <div className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-105"
                      style={{ border: `2px solid ${c.border}`, boxShadow: `0 0 14px ${c.glow}`, background: c.bg, height: 220 }}>
                      <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
                        <span style={{ fontSize: 8, fontWeight: 700, background: badge.bg, color: badge.color, padding: '1px 4px', borderRadius: 3 }}>{badge.label}</span>
                        <span style={{ fontSize: 10, color: c.border, fontWeight: 700 }}>${parseFloat(l.price).toLocaleString()}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <CardImage listing={l} colors={c} height={148} />
                      </div>
                      <div className="px-2 pb-2 pt-0.5">
                        <div style={{ color: '#f1f5f9', fontSize: 9, fontWeight: 600 }} className="line-clamp-1">{l.card_name}</div>
                        <div style={{ color: '#64748b', fontSize: 8 }}>{l.set_name}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── GRID ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* ── TOP BAR: search + sort + view ── */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
            <input
              type="text"
              placeholder={`Search ${cat.label}...`}
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: '#ffffff0a', border: `1px solid ${meta.accent}30`, color: 'white' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortIdx}
            onChange={e => setSortIdx(Number(e.target.value))}
            className="py-2 pl-3 pr-8 rounded-lg text-xs font-semibold focus:outline-none appearance-none"
            style={{ background: '#ffffff0a', border: '1px solid #ffffff18', color: '#e2e8f0',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            }}
          >
            {SORTS.map((s, i) => <option key={i} value={i} style={{ background: '#1a1a2e' }}>{s.label}</option>)}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
            style={filtersOpen || activeFilterCount > 0
              ? { background: meta.accent, color: '#000' }
              : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full w-4 h-4 flex items-center justify-center text-xs font-black"
                style={{ background: filtersOpen ? '#00000033' : `${meta.accent}33`, color: filtersOpen ? '#000' : meta.accent, fontSize: 9 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #ffffff12' }}>
            {[{ mode: 'grid', Icon: LayoutGrid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="p-2 transition-colors"
                style={viewMode === mode ? { background: meta.accent + '33', color: meta.accent } : { background: '#ffffff0a', color: '#6b7280' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>

          <span style={{ color: '#6b7280', fontSize: 12 }}>{loading ? '...' : `${total.toLocaleString()} result${total !== 1 ? 's' : ''}`}</span>

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs transition-colors hover:text-white flex items-center gap-1" style={{ color: '#6b7280' }}>
              <X size={11} /> Clear all
            </button>
          )}
        </div>

        {/* ── EXPANDED FILTER PANEL ── */}
        {filtersOpen && (
          <div className="mb-6 rounded-xl p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ background: '#ffffff06', border: `1px solid ${meta.accent}22` }}>

            {/* Price range presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Price Range</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRICE_PRESETS.map(p => {
                  const active = minPrice === p.min && maxPrice === p.max
                  return (
                    <button key={p.label} onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); setPage(1) }}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                      style={active ? { background: meta.accent, color: '#000' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                      {p.label}
                    </button>
                  )
                })}
              </div>
              {/* Custom min/max */}
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min $" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1) }}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                  style={{ background: '#ffffff0a', border: '1px solid #ffffff15', color: 'white', width: 0 }} />
                <span style={{ color: '#4b5563', fontSize: 11 }}>–</span>
                <input type="number" placeholder="Max $" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1) }}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                  style={{ background: '#ffffff0a', border: '1px solid #ffffff15', color: 'white', width: 0 }} />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Condition</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setCondition(''); setPage(1) }}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                  style={!condition ? { background: meta.accent, color: '#000' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                  Any
                </button>
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => { setCondition(condition === c ? '' : c); setPage(1) }}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                    style={condition === c ? { background: meta.accent, color: '#000' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters summary */}
            {activeFilterCount > 0 && (
              <div className="flex flex-col justify-end">
                <div className="rounded-lg p-3" style={{ background: '#ffffff06', border: '1px solid #ffffff0c' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Active Filters</div>
                  {query && <div className="text-xs mb-1" style={{ color: '#e2e8f0' }}>Search: <span style={{ color: meta.accent }}>"{query}"</span></div>}
                  {(minPrice || maxPrice) && <div className="text-xs mb-1" style={{ color: '#e2e8f0' }}>Price: <span style={{ color: meta.accent }}>${minPrice||'0'} – {maxPrice ? `$${maxPrice}` : 'any'}</span></div>}
                  {condition && <div className="text-xs mb-1" style={{ color: '#e2e8f0' }}>Condition: <span style={{ color: meta.accent }}>{condition}</span></div>}
                  <button onClick={clearFilters} className="mt-2 text-xs font-semibold transition-colors hover:opacity-70" style={{ color: meta.accent }}>
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── GRID / LIST VIEW ── */}
        {loading ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'flex flex-col gap-3'}>
            {Array.from({ length: viewMode === 'grid' ? 10 : 6 }).map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse"
                style={{ height: viewMode === 'grid' ? 290 : 80, background: '#ffffff06' }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ color: '#6b7280' }} className="mb-3">No listings match your filters.</p>
            <button onClick={clearFilters} className="text-sm font-semibold transition-colors hover:opacity-80" style={{ color: meta.accent }}>
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(l => <GridCard key={l.id} listing={l} />)}
          </div>
        ) : (
          // List view
          <div className="flex flex-col gap-2">
            {listings.map(l => {
              const c = CARD_COLORS[l.category] || CARD_COLORS.pokemon
              const badge = BADGE[l.condition] || { label: 'USED', color: '#fff', bg: '#475569' }
              return (
                <Link key={l.id} to={`/listing/${l.id}`} className="no-underline group">
                  <div className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-150 group-hover:scale-[1.005]"
                    style={{ background: '#ffffff06', border: `1px solid ${c.border}33` }}>
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ width: 56, height: 56, background: c.bg }}>
                      {l.image_url ? (
                        <img src={l.image_url} alt={l.card_name} className="w-full h-full object-contain" style={{ objectFit: 'cover' }}
                          onError={e => { e.target.style.display='none' }} />
                      ) : (
                        <span style={{ color: c.border, fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, padding: 4 }}>{l.card_name}</span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm leading-tight truncate">{l.card_name}</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>{l.set_name}{l.card_number ? ` · ${l.card_number}` : ''}</div>
                    </div>
                    {/* Condition */}
                    <div className="hidden sm:block flex-shrink-0">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    {/* Seller */}
                    <div className="hidden md:block flex-shrink-0 text-xs" style={{ color: '#4b5563', width: 90 }}>
                      {l.seller_name}
                    </div>
                    {/* Date */}
                    <div className="hidden lg:block flex-shrink-0 text-xs" style={{ color: '#374151', width: 80 }}>
                      {l.listed_at?.split('T')[0] || ''}
                    </div>
                    {/* Price */}
                    <div className="flex-shrink-0 font-bold text-sm" style={{ color: c.border, minWidth: 64, textAlign: 'right' }}>
                      ${parseFloat(l.price).toLocaleString()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage(1)} disabled={page === 1}
              className="px-2 py-1.5 rounded-lg text-xs disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>«</button>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>
              <ChevronLeft size={15} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) pageNum = i + 1
              else if (page <= 4) pageNum = i + 1
              else if (page >= totalPages - 3) pageNum = totalPages - 6 + i
              else pageNum = page - 3 + i
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                  style={page === pageNum
                    ? { background: meta.accent, color: '#000' }
                    : { background: '#ffffff0a', color: '#9ca3af' }}>
                  {pageNum}
                </button>
              )
            })}

            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              className="p-2 rounded-lg disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>
              <ChevronRight size={15} />
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              className="px-2 py-1.5 rounded-lg text-xs disabled:opacity-30 transition-colors hover:bg-white/10"
              style={{ background: '#ffffff0a', color: 'white' }}>»</button>

            <span style={{ color: '#4b5563', fontSize: 11, marginLeft: 4 }}>
              {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, total)} of {total.toLocaleString()}
            </span>
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS (mini) ──────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #ffffff08', borderBottom: '1px solid #ffffff08' }}>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-8 h-1 rounded-full mb-4" style={{ background: meta.accent }} />
              <h2 className="text-2xl font-black text-white mb-3">Sell your {cat.label}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.7 }} className="text-sm mb-6">
                List your items for free. You set the price — we never negotiate it without your permission.
                Once sold, you receive your payout minus our <strong className="text-white">4% + $0.50 platform fee</strong>.
                60% of every fee goes directly to Reckless Ben's legal defense fund.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { step: '1', title: 'Submit your item', desc: 'Fill out the form — name, condition, your asking price.' },
                  { step: '2', title: 'We review and list it', desc: 'Usually live within 24 hours.' },
                  { step: '3', title: 'Buyer pays, you get paid', desc: `You receive the full price minus 4% + $0.50.` },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                      style={{ background: `${meta.accent}22`, color: meta.accent, border: `1px solid ${meta.accent}44` }}>
                      {s.step}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/submit"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl no-underline text-black text-sm transition-opacity hover:opacity-90"
                style={{ background: meta.accent }}>
                Submit an Item <ArrowRight size={15} />
              </Link>
            </div>

            {/* Fee breakdown card */}
            <div className="rounded-2xl p-6" style={{ background: '#ffffff06', border: '1px solid #ffffff10' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: '#6b7280' }}>Fee Example — $500 sale</div>
              {[
                { label: 'Your asking price', value: '$500.00', color: 'white' },
                { label: 'Platform fee (4% + $0.50)', value: '−$20.50', color: '#f87171' },
                { label: 'You receive', value: '$479.50', color: '#4ade80', bold: true, big: true },
              ].map(row => (
                <div key={row.label} className={`flex justify-between items-center ${row.bold ? 'pt-3 border-t mt-3' : 'mb-3'}`}
                  style={row.bold ? { borderColor: '#ffffff10' } : {}}>
                  <span style={{ color: row.bold ? 'white' : '#6b7280', fontSize: row.big ? 15 : 13, fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                  <span style={{ color: row.color, fontSize: row.big ? 22 : 14, fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
              <div className="mt-4 rounded-xl p-4" style={{ background: '#0d0d1a', border: '1px solid #ffffff08' }}>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: '#d97706' }}>
                  <span>Goes to Ben's legal defense (60%)</span><span>$12.30</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#4b5563' }}>
                  <span>Operations (40%)</span><span>$8.20</span>
                </div>
              </div>
              <Link to="/how-it-works" className="block text-center mt-4 text-xs no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>
                Full fee breakdown →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE OTHER CATEGORIES ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-lg font-bold text-white mb-6">Browse Other Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {categories.filter(c => c.id !== catId).map(c => (
            <Link key={c.id} to={`/${c.id}`} className="no-underline group">
              <div className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 group-hover:scale-[1.03] border"
                style={{ background: `${c.bg}18`, borderColor: `${c.bg}44` }}>
                <div className="w-5 h-0.5 rounded-full" style={{ background: CARD_COLORS[c.id]?.border || '#6366f1' }} />
                <div className="font-bold text-sm text-white leading-tight">{c.label}</div>
                <div className="text-xs flex items-center gap-1 transition-colors group-hover:text-white" style={{ color: '#4b5563' }}>
                  Browse <ChevronRight size={10} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CAUSE BANNER ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #ffffff08' }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="rounded-2xl px-8 py-7 flex flex-wrap items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg,#110d1e,#0d0a18)', border: '1px solid #ffffff10' }}>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#f97316' }}>Our Cause</div>
              <h3 className="text-lg font-black text-white mb-1">Every sale supports Reckless Ben</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>
                60% of every PlaysWell platform fee goes to YouTuber Reckless Ben's legal defense fund — arrested in Utah on May 30, 2026 for investigating the Bricks & Minifigs scandal.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link to="/how-it-works" className="font-semibold px-5 py-2.5 rounded-xl no-underline text-sm border transition-colors hover:bg-white/10"
                style={{ borderColor: '#ffffff20', color: 'white' }}>
                Learn More
              </Link>
              <Link to="/submit" className="font-bold px-5 py-2.5 rounded-xl no-underline text-black text-sm transition-opacity hover:opacity-90"
                style={{ background: '#FFDE00' }}>
                Sell Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
