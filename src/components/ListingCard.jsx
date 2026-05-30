import { Link } from 'react-router-dom'
import { categories } from '../data/listings'

export default function ListingCard({ listing }) {
  const cat = categories.find(c => c.id === listing.category)

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow no-underline group"
    >
      <div
        className="h-40 flex items-center justify-center text-6xl"
        style={{ background: cat ? `${cat.bg}22` : '#f3f4f6' }}
      >
        {listing.emoji}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cat?.bg || '#e5e7eb', color: cat?.color || '#111' }}
          >
            {cat?.label || listing.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mt-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{listing.condition}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${listing.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">by {listing.seller}</span>
        </div>
      </div>
    </Link>
  )
}
