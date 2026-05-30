import { Link } from 'react-router-dom'
import { DollarSign, Heart, Wrench, ArrowRight, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-4">BUSINESS MODEL</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How PlaysWell Works</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A transparent breakdown of how we make money, where it goes, and why we built this.
        </p>
      </div>

      {/* The Story */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We Exist</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-600 text-sm leading-relaxed">
          <div>
            <p className="mb-3">In 2023, Bryan Mansell and his 83-year-old father consigned their life's collection — 780+ LEGO Star Wars sets and 1,200+ minifigures worth up to <strong>$200,000</strong> — to a Bricks & Minifigs franchise in Salem-Keizer, Oregon.</p>
            <p>When the franchise changed hands in late 2024, the new operator and BAM corporate refused to return the unsold inventory, claiming the original consignment arrangement was made without corporate approval.</p>
          </div>
          <div>
            <p className="mb-3">YouTuber <strong>Reckless Ben Schneider</strong> launched a viral investigation, producing multiple long-form videos, setting up competing businesses, and eventually traveling to BAM's Utah headquarters — where he was arrested on May 30, 2026.</p>
            <p>PlaysWell was built to put money behind the collector community. Every sale on this platform directly supports Ben's legal defense.</p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How the Marketplace Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', icon: '📦', title: 'Seller lists an item', body: 'Free to list. Sellers set their asking price and condition. We review every listing before it goes live.' },
            { step: '2', icon: '🤝', title: 'Buyer purchases', body: 'Buyer pays the listed price via secure checkout. We hold the funds in escrow until the item is delivered and confirmed.' },
            { step: '3', icon: '💸', title: 'Funds distributed', body: 'Seller receives their cut. We take the platform fee and split it: 60% to Ben\'s fund, 40% to operations.' },
          ].map(s => (
            <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-8 h-8 bg-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center mb-4">{s.step}</div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee Structure */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Fee Structure</h2>
        <p className="text-center text-gray-500 mb-8">Tiered rates that reward high-value sales. No listing fees, no monthly subscriptions.</p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { range: 'Under $50', rate: '15%', example: '$20 item → $3.00 fee', color: 'bg-rose-50 border-rose-200 text-rose-700' },
            { range: '$50 – $500', rate: '10%', example: '$200 item → $20.00 fee', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
            { range: 'Over $500', rate: '7%', example: '$1,000 item → $70.00 fee', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(tier => (
            <div key={tier.range} className={`border rounded-xl p-6 text-center ${tier.color}`}>
              <div className="text-3xl font-bold mb-1">{tier.rate}</div>
              <div className="text-sm font-semibold mb-1">{tier.range}</div>
              <div className="text-xs opacity-70">{tier.example}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-indigo-600" /> How the Fee Gets Split
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⚖️</div>
              <div>
                <div className="font-semibold text-gray-900">60% → Reckless Ben's Legal Defense</div>
                <p className="text-sm text-gray-500 mt-1">Funds transferred monthly to the active GoFundMe / legal trust for Ben Schneider's criminal defense case in Utah.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🔧</div>
              <div>
                <div className="font-semibold text-gray-900">40% → Platform Operations</div>
                <p className="text-sm text-gray-500 mt-1">Server hosting, payment processing, customer support, fraud prevention, and development costs. Zero profit until Ben's case concludes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 border border-gray-200 text-gray-700">Platform</th>
                <th className="px-4 py-3 border border-gray-200 text-gray-700">Fees</th>
                <th className="px-4 py-3 border border-gray-200 text-gray-700">Listing Fee</th>
                <th className="px-4 py-3 border border-gray-200 text-gray-700">Cause</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-indigo-50">
                <td className="px-4 py-3 border border-gray-200 font-bold text-indigo-700">🎮 PlaysWell</td>
                <td className="px-4 py-3 border border-gray-200 text-center font-semibold text-indigo-700">7–15%</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-emerald-600 font-semibold">Free</td>
                <td className="px-4 py-3 border border-gray-200 text-center">⚖️ 60% to Ben's defense</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-gray-200 text-gray-700">eBay</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-600">~13.25%</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-500">Up to 250 free/mo</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-400">None</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 border border-gray-200 text-gray-700">TCGPlayer</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-600">~10.25%</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-500">Free</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-400">None</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-gray-200 text-gray-700">StockX</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-600">~9.5–10%</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-500">Free</td>
                <td className="px-4 py-3 border border-gray-200 text-center text-gray-400">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Next</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { done: true, label: 'Marketplace listings & browsing' },
            { done: true, label: 'Tiered fee structure with cause split' },
            { done: true, label: 'Sell / listing submission flow' },
            { done: false, label: 'Stripe payment processing' },
            { done: false, label: 'Seller accounts & dashboards' },
            { done: false, label: 'Graded card verification integration' },
            { done: false, label: 'Live auction format (like eBay bidding)' },
            { done: false, label: 'Community forums & price guides' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <CheckCircle size={16} className={item.done ? 'text-emerald-500' : 'text-gray-300'} />
              <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-indigo-900 text-white rounded-2xl py-12 px-8">
        <div className="text-4xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold mb-2">Ready to make your first sale?</h2>
        <p className="text-indigo-300 mb-6">Every listing supports the collector community.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/sell" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-3 rounded-xl no-underline flex items-center gap-2 transition-colors">
            List an Item <ArrowRight size={16} />
          </Link>
          <Link to="/browse" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl no-underline transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
