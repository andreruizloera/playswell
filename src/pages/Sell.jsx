import { useState } from 'react'
import { CheckCircle, Info } from 'lucide-react'
import { categories, getFeeBreakdown } from '../data/listings'

export default function Sell() {
  const [form, setForm] = useState({
    title: '', category: '', price: '', condition: '', description: '', contact: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const fee = getFeeBreakdown(form.price)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
        <p className="text-gray-500 mb-2">
          We'll review your listing and get it live shortly. You'll hear back at <strong>{form.contact}</strong>.
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4">
          ⚖️ Your listing fee will contribute 60% to Reckless Ben's legal defense. Thank you for supporting the community.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ title: '', category: '', price: '', condition: '', description: '', contact: '' }) }}
          className="mt-6 text-indigo-600 font-semibold hover:underline text-sm"
        >
          Submit another listing
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">List an Item</h1>
      <p className="text-gray-500 mb-8">Fill in the details below. It's free to list — we only take a fee when it sells.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Charizard Base Set Holo PSA 9"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                required
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Condition *</label>
              <select
                required
                value={form.condition}
                onChange={e => set('condition', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select condition</option>
                {['New - Sealed', 'Like New - Complete', 'Graded (PSA/CGC)', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavy Play'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Asking Price ($) *</label>
            <input
              required
              type="number"
              min="1"
              placeholder="0.00"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Condition details, cert numbers, known flaws, what's included..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Email *</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.contact}
              onChange={e => set('contact', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Submit Listing
          </button>
        </form>

        {/* Fee Calculator */}
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700">Fee Calculator</span>
            </div>
            {form.price && parseFloat(form.price) > 0 ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sale Price</span>
                  <span>${parseFloat(form.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee ({(fee.rate * 100).toFixed(0)}%)</span>
                  <span>-${fee.fee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>You Receive</span>
                  <span>${parseFloat(fee.youGet).toLocaleString()}</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-amber-700">
                    <span>⚖️ To Ben's defense</span>
                    <span>${fee.causeAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>🔧 Operations</span>
                    <span>${fee.opsAmount}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Enter a price to see the breakdown</p>
            )}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 space-y-1">
            <div className="font-semibold mb-2">Fee Tiers</div>
            <div className="flex justify-between"><span>Under $50</span><span className="font-bold">15%</span></div>
            <div className="flex justify-between"><span>$50 – $500</span><span className="font-bold">10%</span></div>
            <div className="flex justify-between"><span>Over $500</span><span className="font-bold">7%</span></div>
            <p className="text-indigo-500 mt-2 pt-2 border-t border-indigo-200">60% of every fee goes to Reckless Ben's defense. 40% covers operations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
