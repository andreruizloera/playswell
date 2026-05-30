import { useState } from 'react'
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { listings } from '../data/listings'
import { generatePriceHistory } from '../data/analytics'

const STORAGE_KEY = 'playswell_portfolio'

function loadPortfolio() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function savePortfolio(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const defaultItems = [
  { id: Date.now() - 3, listingId: 1, quantity: 1, purchasePrice: 700, purchaseDate: '2025-11-15' },
  { id: Date.now() - 2, listingId: 6, quantity: 2, purchasePrice: 950, purchaseDate: '2026-01-10' },
  { id: Date.now() - 1, listingId: 3, quantity: 1, purchasePrice: 3800, purchaseDate: '2025-09-01' },
]

export default function Portfolio() {
  const [items, setItems] = useState(() => {
    const stored = loadPortfolio()
    return stored.length ? stored : defaultItems
  })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ listingId: '', quantity: 1, purchasePrice: '', purchaseDate: '' })

  const enriched = items.map(item => {
    const listing = listings.find(l => l.id === Number(item.listingId))
    if (!listing) return null
    const currentPrice = listing.price
    const costBasis = item.purchasePrice * item.quantity
    const currentValue = currentPrice * item.quantity
    const gain = currentValue - costBasis
    const gainPct = ((gain / costBasis) * 100).toFixed(1)
    return { ...item, listing, currentPrice, costBasis, currentValue, gain, gainPct }
  }).filter(Boolean)

  const totalCost = enriched.reduce((s, i) => s + i.costBasis, 0)
  const totalValue = enriched.reduce((s, i) => s + i.currentValue, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : '0.0'

  // Portfolio value history (weighted blend)
  const historyDays = 60
  const portfolioHistory = Array.from({ length: historyDays + 1 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (historyDays - i))
    return { date: date.toISOString().split('T')[0] }
  })
  enriched.forEach(item => {
    const hist = generatePriceHistory(item.listing.price, historyDays)
    hist.forEach((h, i) => {
      portfolioHistory[i].value = (portfolioHistory[i].value || 0) + h.price * item.quantity
    })
  })

  const addItem = () => {
    if (!form.listingId || !form.purchasePrice) return
    const newItem = { id: Date.now(), listingId: Number(form.listingId), quantity: Number(form.quantity), purchasePrice: Number(form.purchasePrice), purchaseDate: form.purchaseDate || new Date().toISOString().split('T')[0] }
    const updated = [...items, newItem]
    setItems(updated)
    savePortfolio(updated)
    setForm({ listingId: '', quantity: 1, purchasePrice: '', purchaseDate: '' })
    setAdding(false)
  }

  const removeItem = id => {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    savePortfolio(updated)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
          <p className="text-gray-500 mt-1">Track your collection's value in real-time</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Add item form */}
      {adding && (
        <div className="bg-white border border-indigo-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add to Portfolio</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Listing</label>
              <select value={form.listingId} onChange={e => setForm(f => ({ ...f, listingId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select item</option>
                {listings.map(l => <option key={l.id} value={l.id}>{l.emoji} {l.title.slice(0, 35)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qty</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Purchase Price ($)</label>
              <input type="number" placeholder="0.00" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Purchase Date</label>
              <input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addItem} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Add to Portfolio</button>
            <button onClick={() => setAdding(false)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Current Value</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Cost Basis</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Gain/Loss</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className={`text-2xl font-bold ${parseFloat(totalGainPct) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {parseFloat(totalGainPct) >= 0 ? '+' : ''}{totalGainPct}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Return</div>
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Portfolio Value (60 days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} interval={14} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} domain={['auto', 'auto']} />
            <Tooltip formatter={v => [`$${v?.toLocaleString()}`, 'Portfolio Value']} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#portGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Holdings ({enriched.length} items)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Item</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Qty</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Bought @</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Current</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Value</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Gain/Loss</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.listing.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900 leading-tight">{item.listing.title.slice(0, 40)}</div>
                        <div className="text-xs text-gray-400">{item.purchaseDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-center text-gray-700">${item.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900">${item.currentPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900">${item.currentValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`font-bold ${item.gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.gain >= 0 ? '+' : ''}${item.gain.toLocaleString()}
                    </div>
                    <div className={`text-xs ${item.gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.gain >= 0 ? '+' : ''}{item.gainPct}%
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
