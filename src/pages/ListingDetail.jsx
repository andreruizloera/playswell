import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, Tag, Calendar } from 'lucide-react'
import { listings, categories } from '../data/listings'

export default function ListingDetail() {
  const { id } = useParams()
  const listing = listings.find(l => l.id === Number(id))

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
        <Link to="/browse" className="text-indigo-600 no-underline font-semibold hover:underline">← Back to Browse</Link>
      </div>
    )
  }

  const cat = categories.find(c => c.id === listing.category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 no-underline mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div
          className="rounded-2xl flex items-center justify-center text-9xl aspect-square"
          style={{ background: cat ? `${cat.bg}22` : '#f3f4f6' }}
        >
          {listing.emoji}
        </div>

        {/* Details */}
        <div>
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
            style={{ background: cat?.bg || '#e5e7eb', color: cat?.color || '#111' }}
          >
            {cat?.label}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {listing.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-600 mb-6">{listing.description}</p>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Shield size={14} className="text-indigo-500" /> {listing.condition}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Listed {listing.listed}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
            <div className="flex items-end justify-between mb-1">
              <span className="text-3xl font-bold text-gray-900">${listing.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">Sold by <strong>{listing.seller}</strong></span>
            </div>
            <p className="text-xs text-gray-400">+ shipping calculated at checkout</p>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mb-3">
            Buy Now
          </button>
          <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
            Make an Offer
          </button>

          <div className="mt-5 flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <span>⚖️</span>
            <span>60% of the platform fee from this sale goes directly to Reckless Ben's legal defense fund. <Link to="/how-it-works" className="text-amber-700 font-semibold no-underline hover:underline">How it works →</Link></span>
          </div>
        </div>
      </div>
    </div>
  )
}
