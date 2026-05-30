import { useState } from 'react'
import { TrendingUp, TrendingDown, Package } from 'lucide-react'
import { sealedProducts } from '../data/analytics'

export default function PackEV() {
  const [selected, setSelected] = useState(sealedProducts[0])

  const ev = selected.ev
  const marketPrice = selected.marketPrice
  const evRatio = ((ev / marketPrice) * 100).toFixed(1)
  const isGoodEV = ev >= marketPrice * 0.85

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Pack EV Calculator</h1>
      <p className="text-gray-500 mb-8">Expected value analysis — is it worth opening or selling sealed?</p>

      {/* Product selector */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {sealedProducts.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className={`text-left p-4 border rounded-xl transition-all ${selected.id === p.id ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-300' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className={selected.id === p.id ? 'text-indigo-600' : 'text-gray-400'} />
              <span className="text-xs font-bold text-gray-500 uppercase">{p.category}</span>
            </div>
            <div className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</div>
            <div className="text-xs text-gray-400 mt-1">{p.set}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">${p.marketPrice}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.ev >= p.marketPrice * 0.85 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                EV: ${p.ev}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main analysis */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Verdict */}
        <div className={`rounded-xl p-6 ${isGoodEV ? 'bg-gradient-to-br from-emerald-900 to-teal-900' : 'bg-gradient-to-br from-rose-900 to-pink-900'} text-white`}>
          <div className="text-xs font-bold mb-2 opacity-70">VERDICT</div>
          <div className="flex items-center gap-3 mb-3">
            {isGoodEV ? <TrendingUp size={28} className="text-emerald-300" /> : <TrendingDown size={28} className="text-rose-300" />}
            <div className="text-2xl font-bold">{isGoodEV ? 'Good EV — Open it' : 'Bad EV — Sell sealed'}</div>
          </div>
          <p className="text-sm opacity-80 mb-4">
            {isGoodEV
              ? `Opening this product gives you ${evRatio}% expected return vs. market price. The top pulls justify the cost.`
              : `At ${evRatio}% EV, you're likely to lose money opening. Sell sealed for a better return.`}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">${ev}</div>
              <div className="text-xs opacity-70">Expected Value</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">${marketPrice}</div>
              <div className="text-xs opacity-70">Market Price</div>
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">{selected.name}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>MSRP</span>
              <span>${selected.msrp}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Current Market Price</span>
              <span className="font-semibold text-gray-900">${selected.marketPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Packs Included</span>
              <span>{selected.packs}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Cost per Pack</span>
              <span>${selected.packCost.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
              <span>Expected Value (EV)</span>
              <span className={isGoodEV ? 'text-emerald-600' : 'text-rose-600'}>${ev}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>EV Ratio</span>
              <span className={isGoodEV ? 'text-emerald-600' : 'text-rose-600'}>{evRatio}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Open vs Sell Profit</span>
              <span className={ev - marketPrice >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {ev - marketPrice >= 0 ? '+' : ''}${(ev - marketPrice).toFixed(0)} opening
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top pulls */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Pulls & Pull Rates</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {selected.topPulls.map(pull => {
            const pulls = selected.packs
            const hitRate = pull.pullRate
            return (
              <div key={pull.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{pull.name}</div>
                  <div className="text-xs text-gray-400">Pull rate: {hitRate}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">${pull.value}</div>
                  <div className="text-xs text-gray-400">market value</div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          * EV calculated using documented pull rates and current market prices. Actual results vary. For entertainment purposes.
        </p>
      </div>
    </div>
  )
}
