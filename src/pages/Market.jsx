import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Activity, ArrowRight } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts'
import { trendingCards, generatePriceHistory, platformStats } from '../data/analytics'
import { listings } from '../data/listings'

function StatCard({ label, value, sub, color = 'indigo' }) {
  const colors = { indigo: 'text-indigo-600 bg-indigo-50', emerald: 'text-emerald-600 bg-emerald-50', amber: 'text-amber-600 bg-amber-50', rose: 'text-rose-600 bg-rose-50' }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>{value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function Market() {
  const [selectedCard, setSelectedCard] = useState(trendingCards[0])
  const priceHistory = generatePriceHistory(selectedCard.price, 60)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market</h1>
          <p className="text-gray-500 mt-1">Real-time prices, trends, and volume across all collectibles</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Volume" value={`$${(platformStats.totalVolume / 1000).toFixed(0)}K`} sub="All time" color="indigo" />
        <StatCard label="Active Listings" value={platformStats.totalListings.toLocaleString()} sub="Across 8 categories" color="emerald" />
        <StatCard label="Active Sellers" value={platformStats.activeSellers} sub="Verified" color="amber" />
        <StatCard label="Avg Sale Price" value={`$${platformStats.avgSalePrice}`} sub="Last 30 days" color="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* Weekly Volume Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Weekly Volume ($)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={platformStats.weeklyVolume}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Volume']} />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Volume by Category</h2>
          <div className="space-y-3">
            {platformStats.categoryBreakdown.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{cat.name}</span>
                  <span className="text-gray-900 font-bold">{cat.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${cat.value}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Cards + Price Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trending list */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" /> Trending Now
          </h2>
          <div className="space-y-2">
            {trendingCards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedCard.id === card.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-mono w-4">{i + 1}</span>
                    <span className="text-lg">{card.emoji}</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 leading-tight">{card.name}</div>
                      <div className="text-xs text-gray-400">{card.set}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">${card.price.toLocaleString()}</div>
                    <div className={`text-xs font-semibold flex items-center gap-0.5 justify-end ${card.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {card.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {card.change >= 0 ? '+' : ''}{card.change}%
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{selectedCard.emoji} {selectedCard.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold text-gray-900">${selectedCard.price.toLocaleString()}</span>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${selectedCard.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {selectedCard.change >= 0 ? '+' : ''}{selectedCard.change}% (60d)
                </span>
              </div>
            </div>
            <Link to={`/listing/${selectedCard.id}`} className="text-xs text-indigo-600 font-semibold no-underline hover:underline flex items-center gap-1">
              View listing <ArrowRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedCard.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={selectedCard.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} interval={14} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} domain={['auto', 'auto']} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Price']} />
              <Area type="monotone" dataKey="price" stroke={selectedCard.change >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={2} fill="url(#priceGrad)" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Volume bars */}
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={50}>
              <BarChart data={priceHistory} barSize={3}>
                <Bar dataKey="volume" fill="#6366f180" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 text-right">Volume</p>
          </div>
        </div>
      </div>
    </div>
  )
}
