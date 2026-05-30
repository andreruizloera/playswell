import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { listings, categories } from '../data/listings'
import ListingCard from '../components/ListingCard'

const CONDITIONS = ['All Conditions', 'New - Sealed', 'Like New - Complete', 'Graded - PSA 10', 'Graded - PSA 9', 'Graded - PSA 8', 'Graded - CGC 3.0', 'Good - Used', 'Good - Complete', 'Raw - VG', 'Heavy Play']
const SORTS = [
  { label: 'Newest First', fn: (a, b) => new Date(b.listed) - new Date(a.listed) },
  { label: 'Price: Low → High', fn: (a, b) => a.price - b.price },
  { label: 'Price: High → Low', fn: (a, b) => b.price - a.price },
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState(0)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCat(cat)
  }, [searchParams])

  const filtered = listings
    .filter(l => {
      if (selectedCat !== 'all' && l.category !== selectedCat) return false
      if (maxPrice && l.price > parseFloat(maxPrice)) return false
      if (query && !l.title.toLowerCase().includes(query.toLowerCase()) &&
          !l.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
    .sort(SORTS[sort].fn)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Listings</h1>
      <p className="text-gray-500 mb-8">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
      </p>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Max price */}
        <input
          type="number"
          placeholder="Max price ($)"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {SORTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setSelectedCat('all'); setSearchParams({}) }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCat === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCat(cat.id); setSearchParams({ category: cat.id }) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${selectedCat === cat.id ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            style={selectedCat === cat.id ? { background: cat.bg, color: cat.color } : {}}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No listings match your filters</p>
          <button onClick={() => { setQuery(''); setMaxPrice(''); setSelectedCat('all'); setSearchParams({}) }} className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
