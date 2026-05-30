import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getListings } from '../lib/api'
import { categories } from '../data/listings'

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

function ListingCard({ listing }) {
  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const badge  = Object.entries(BADGE).find(([k]) => listing.condition?.startsWith(k.split(' ')[0]))?.[1]
            || { label: listing.condition?.split(' ')[0] || 'USED', color: '#fff', bg: '#475569' }
  const badgeFull = BADGE[listing.condition] || badge

  return (
    <Link to={`/listing/${listing.id}`} className="no-underline group">
      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 group-hover:scale-[1.03]"
        style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 14px ${colors.glow}`, background: colors.bg, height: 290 }}
      >
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <span style={{ fontSize: 9, fontWeight: 700, background: badgeFull.bg, color: badgeFull.color, padding: '2px 5px', borderRadius: 3 }}>
            {badgeFull.label}
          </span>
          <span style={{ fontSize: 11, color: colors.border, fontWeight: 700 }}>${parseFloat(listing.price).toLocaleString()}</span>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.card_name} className="object-contain w-full h-full" style={{ maxHeight: 175 }} loading="lazy"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          ) : null}
          <div className="w-full rounded-lg items-center justify-center text-center px-3"
            style={{ height: 175, background: `${colors.border}12`, border: `1px solid ${colors.border}25`, display: listing.image_url ? 'none' : 'flex', flexDirection: 'column' }}>
            <span style={{ color: colors.border, fontSize: 13, fontWeight: 700 }}>{listing.card_name}</span>
            <span style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{listing.set_name}</span>
          </div>
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

const SORTS = [
  { label: 'Newest',     sort: 'listed_at', order: 'desc' },
  { label: 'Price: Low',  sort: 'price',     order: 'asc'  },
  { label: 'Price: High', sort: 'price',     order: 'desc' },
  { label: 'Name',       sort: 'card_name', order: 'asc'  },
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings,  setListings]  = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [query,     setQuery]     = useState(searchParams.get('q') || '')
  const [sortIdx,   setSortIdx]   = useState(0)
  const [page,      setPage]      = useState(1)

  const category = searchParams.get('category') || ''
  const PAGE_SIZE = 40

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, pageSize: PAGE_SIZE, ...SORTS[sortIdx] }
      if (category) params.category = category
      if (query)    params.q = query
      const res = await getListings(params)
      setListings(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [category, query, sortIdx, page])

  useEffect(() => { fetchListings() }, [fetchListings])
  useEffect(() => { setPage(1) }, [category, query, sortIdx])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const catLabel = categories.find(c => c.id === category)?.label || 'All Categories'

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Browse Listings</h1>
          <p style={{ color: '#6b7280' }}>{total.toLocaleString()} listing{total !== 1 ? 's' : ''} · {catLabel}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search card name, set..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: '#ffffff0a', border: '1px solid #ffffff18', color: 'white' }}
            />
          </div>
          <div className="flex gap-2">
            {SORTS.map((s,i) => (
              <button key={i} onClick={() => setSortIdx(i)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={sortIdx === i ? { background: '#4f46e5', color: 'white' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={!category ? { background: '#4f46e5', color: 'white' } : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}
          >
            All
          </button>
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setSearchParams({ category: cat.id })}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={category === cat.id
                ? { background: cat.bg, color: cat.color }
                : { background: '#ffffff0a', color: '#9ca3af', border: '1px solid #ffffff12' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse" style={{ height: 290, background: '#ffffff08' }} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p style={{ color: '#f87171' }} className="mb-2">Failed to load listings</p>
            <p style={{ color: '#6b7280', fontSize: 13 }}>{error}</p>
            <button onClick={fetchListings} className="mt-4 text-indigo-400 text-sm hover:underline">Retry</button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: '#6b7280' }}>No listings match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#ffffff0a', color: 'white' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#6b7280', fontSize: 13 }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#ffffff0a', color: 'white' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
