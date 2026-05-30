import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Search, ArrowRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine
} from 'recharts'
import { listings } from '../data/listings'
import { generatePriceHistory } from '../data/analytics'

function computeRSI(data, period = 14) {
  const rsi = []
  for (let i = 0; i < data.length; i++) {
    if (i < period) { rsi.push({ ...data[i], rsi: null }); continue }
    let gains = 0, losses = 0
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].price - data[j - 1].price
      if (diff > 0) gains += diff
      else losses += Math.abs(diff)
    }
    const rs = gains / (losses || 0.001)
    rsi.push({ ...data[i], rsi: parseFloat((100 - 100 / (1 + rs)).toFixed(1)) })
  }
  return rsi
}

function computeMA(data, period = 20) {
  return data.map((d, i) => {
    if (i < period - 1) return { ...d, ma: null }
    const avg = data.slice(i - period + 1, i + 1).reduce((s, x) => s + x.price, 0) / period
    return { ...d, ma: parseFloat(avg.toFixed(2)) }
  })
}

export default function Analytics() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(listings[0])
  const [range, setRange] = useState(60)

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  )

  const rawHistory = generatePriceHistory(selected.price, range)
  const withMA = computeMA(rawHistory)
  const withRSI = computeRSI(withMA)

  const first = rawHistory[0]?.price || selected.price
  const last = rawHistory[rawHistory.length - 1]?.price || selected.price
  const pct = (((last - first) / first) * 100).toFixed(1)
  const isUp = parseFloat(pct) >= 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Price Analytics</h1>
      <p className="text-gray-500 mb-8">Advanced charts with moving averages and RSI for every listing</p>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Card selector */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {filtered.map(l => (
              <button
                key={l.id}
                onClick={() => setSelected(l)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors ${selected.id === l.id ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' : 'hover:bg-gray-50 text-gray-700 border border-transparent'}`}
              >
                <div className="font-semibold leading-tight">{l.emoji} {l.title}</div>
                <div className="text-gray-400 mt-0.5 flex justify-between">
                  <span>{l.condition}</span>
                  <span className="font-bold text-gray-700">${l.price.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-5">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.emoji} {selected.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.condition} · by {selected.seller}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${selected.price.toLocaleString()}</div>
                  <div className={`text-sm font-semibold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp ? '+' : ''}{pct}% ({range}d)
                  </div>
                </div>
                <Link to={`/listing/${selected.id}`} className="text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-lg no-underline hover:bg-indigo-700">
                  View Listing
                </Link>
              </div>
            </div>

            {/* Range selector */}
            <div className="flex gap-2 mt-4">
              {[30, 60, 90].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${range === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>

          {/* Price + MA chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3 text-xs">
              <span className="font-semibold text-gray-700">Price & 20-Day MA</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block" /> Price</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-400 inline-block" /> 20D MA</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={withMA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} interval={Math.floor(range / 6)} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`} domain={['auto', 'auto']} />
                <Tooltip formatter={(v, n) => [`$${v?.toLocaleString() ?? '-'}`, n === 'price' ? 'Price' : '20D MA']} />
                <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ma" stroke="#f97316" strokeWidth={1.5} dot={false} strokeDasharray="4 2" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* RSI Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">RSI (14)</span>
              <div className="flex gap-3 text-xs text-gray-400">
                <span className="text-rose-500 font-semibold">Overbought &gt;70</span>
                <span className="text-emerald-500 font-semibold">Oversold &lt;30</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={withRSI}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} interval={Math.floor(range / 6)} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} ticks={[0, 30, 50, 70, 100]} />
                <Tooltip formatter={v => [v?.toFixed(1) ?? '-', 'RSI']} />
                <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" strokeWidth={1} />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} />
                <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} dot={false} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '30D High', value: `$${Math.max(...rawHistory.slice(-30).map(d => d.price)).toLocaleString()}` },
              { label: '30D Low', value: `$${Math.min(...rawHistory.slice(-30).map(d => d.price)).toLocaleString()}` },
              { label: 'Avg Volume', value: `${(rawHistory.reduce((s, d) => s + d.volume, 0) / rawHistory.length).toFixed(1)}/day` },
              { label: 'RSI (now)', value: withRSI[withRSI.length - 1]?.rsi?.toFixed(0) ?? '-' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
