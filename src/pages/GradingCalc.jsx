import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, Award } from 'lucide-react'
import { gradingServices } from '../data/analytics'

export default function GradingCalc() {
  const [rawValue, setRawValue] = useState('')
  const [cardName, setCardName] = useState('')
  const [likelyGrade, setLikelyGrade] = useState('9')

  const raw = parseFloat(rawValue) || 0

  const results = gradingServices.map(svc => {
    const gradeMultiplier = svc.popMultiplier[parseInt(likelyGrade)] || 1.5
    const gradedValue = raw * gradeMultiplier
    const totalCost = svc.cost + (raw * 0.05) // shipping + insurance estimate
    const profit = gradedValue - raw - totalCost
    const roi = raw > 0 ? ((profit / (raw + totalCost)) * 100).toFixed(1) : 0
    return { ...svc, gradedValue, totalCost, profit, roi }
  }).sort((a, b) => b.profit - a.profit)

  const best = results[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Grading ROI Calculator</h1>
      <p className="text-gray-500 mb-8">Is it worth grading your card? Compare PSA, BGS, CGC, and TAG returns.</p>

      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Card Name (optional)</label>
            <input
              type="text"
              placeholder="e.g. Charizard Base Set Holo"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Raw Card Value ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={rawValue}
              onChange={e => setRawValue(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Grade</label>
            <select
              value={likelyGrade}
              onChange={e => setLikelyGrade(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="10">10 — Gem Mint</option>
              <option value="9">9 — Mint</option>
            </select>
          </div>
        </div>
      </div>

      {raw > 0 && (
        <>
          {/* Best pick banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-xl p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold text-indigo-300 mb-1">RECOMMENDED</div>
              <div className="text-xl font-bold">Submit to {best.name}</div>
              <div className="text-indigo-200 text-sm mt-1">
                Best ROI at <span className="text-amber-300 font-bold">{best.roi}%</span> · Est. profit <span className="text-emerald-300 font-bold">${best.profit.toFixed(0)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-300">${best.gradedValue.toFixed(0)}</div>
              <div className="text-sm text-indigo-300">Est. graded value</div>
            </div>
          </div>

          {/* Service comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {results.map((svc, i) => (
              <div
                key={svc.name}
                className={`bg-white border rounded-xl p-5 ${i === 0 ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{svc.name}</span>
                      {i === 0 && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Best ROI</span>}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {svc.turnaround}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${parseFloat(svc.roi) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {svc.roi}% ROI
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Raw card value</span>
                    <span>${raw.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Grading fee</span>
                    <span>-${svc.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping + insurance (est.)</span>
                    <span>-${(svc.totalCost - svc.cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total cost</span>
                    <span>-${(raw + svc.totalCost).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Est. graded value (Grade {likelyGrade})</span>
                    <span className="text-emerald-600">${svc.gradedValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Est. profit</span>
                    <span className={svc.profit > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {svc.profit > 0 ? '+' : ''}${svc.profit.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Avg graded grade</span>
                    <span className="font-semibold">{svc.avgGrade}/10</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Grade {likelyGrade} value multiplier</span>
                    <span className="font-semibold">{svc.popMultiplier[parseInt(likelyGrade)]}×</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Disclaimer:</strong> Estimates are based on typical grade multipliers and market averages. Actual graded values vary. Always check recent sold comps before submitting.
          </div>
        </>
      )}

      {!raw && (
        <div className="text-center py-16 text-gray-400">
          <Award size={48} className="mx-auto mb-3 opacity-30" />
          <p>Enter your card's raw value above to see the grading ROI breakdown</p>
        </div>
      )}
    </div>
  )
}
