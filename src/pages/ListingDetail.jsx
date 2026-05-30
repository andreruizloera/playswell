import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, Tag, Calendar } from 'lucide-react'
import { getListing } from '../lib/api'

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

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    getListing(parseInt(id))
      .then(res => setListing(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }} className="flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  )

  if (error || !listing) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }} className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Listing not found</h2>
      <Link to="/browse" className="text-indigo-400 no-underline hover:underline">Back to Browse</Link>
    </div>
  )

  const colors = CARD_COLORS[listing.category] || CARD_COLORS.pokemon
  const fee = (listing.price * 0.04 + 0.50).toFixed(2)

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm mb-8 no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Card image */}
          <div className="rounded-2xl flex items-center justify-center overflow-hidden aspect-square"
            style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 40px ${colors.glow}`, background: colors.bg }}>
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.card_name} className="object-contain w-full h-full p-8" style={{ maxHeight: 500 }} />
            ) : (
              <div className="text-center p-8">
                <div style={{ color: colors.border, fontSize: 22, fontWeight: 700 }}>{listing.card_name}</div>
                <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>{listing.set_name}</div>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${colors.border}22`, color: colors.border, border: `1px solid ${colors.border}44` }}>
                {listing.category?.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{listing.card_name}</h1>
            <p style={{ color: '#6b7280' }} className="text-sm mb-4">
              {listing.set_name}{listing.card_number ? ` · ${listing.card_number}` : ''}
            </p>

            {listing.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {listing.tags.filter(Boolean).map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: '#ffffff0a', color: '#94a3b8', border: '1px solid #ffffff10' }}>
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {listing.description && (
              <p style={{ color: '#9ca3af' }} className="text-sm mb-5">{listing.description}</p>
            )}

            <div className="flex items-center gap-4 mb-6 text-sm" style={{ color: '#6b7280' }}>
              <span className="flex items-center gap-1"><Shield size={13} className="text-indigo-400" /> {listing.condition}</span>
              <span className="flex items-center gap-1"><Calendar size={13} /> Listed {listing.listed_at?.split('T')[0]}</span>
            </div>

            {/* Price box */}
            <div className="rounded-xl p-5 border mb-5" style={{ background: '#ffffff06', borderColor: `${colors.border}30` }}>
              <div className="flex items-end justify-between mb-1">
                <span className="text-3xl font-bold text-white">${parseFloat(listing.price).toLocaleString()}</span>
                <span style={{ color: '#6b7280' }} className="text-sm">Sold by <strong className="text-white">{listing.seller_name}</strong></span>
              </div>
              <p style={{ color: '#4b5563', fontSize: 12 }}>+ shipping calculated at checkout</p>
            </div>

            <button className="w-full font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 mb-3 text-black" style={{ background: '#FFDE00' }}>
              Buy Now
            </button>
            <button className="w-full font-bold py-3.5 rounded-xl transition-colors border text-white hover:bg-white/10" style={{ borderColor: '#ffffff20' }}>
              Make an Offer
            </button>

            <div className="mt-5 flex items-start gap-2 text-xs rounded-lg p-3" style={{ background: '#1a0f00', border: '1px solid #f9731620', color: '#d97706' }}>
              <span>60% of the ${fee} platform fee from this sale goes to Reckless Ben's legal defense.{' '}
                <Link to="/how-it-works" className="text-amber-400 font-semibold no-underline hover:underline">How it works</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
