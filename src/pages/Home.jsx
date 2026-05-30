import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Heart, TrendingUp } from 'lucide-react'
import { categories, listings } from '../data/listings'
import ListingCard from '../components/ListingCard'

export default function Home() {
  const featured = listings.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>⚖️</span>
            <span>Proceeds support Reckless Ben's legal defense</span>
            <Link to="/how-it-works" className="text-amber-300 font-semibold hover:text-amber-200 no-underline">Learn more →</Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The marketplace for<br />
            <span className="text-amber-300">serious collectors</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Buy and sell Pokémon cards, LEGO sets, sports cards, comics, vintage toys, and more — while standing up for the collector community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/browse"
              className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-3 rounded-xl no-underline flex items-center gap-2 transition-colors"
            >
              Browse Listings <ArrowRight size={18} />
            </Link>
            <Link
              to="/sell"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl no-underline transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Cause Section */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">OUR CAUSE</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Collectors protecting collectors
              </h2>
              <p className="text-gray-600 mb-4">
                In 2023, Bryan Mansell and his father consigned their $200,000 LEGO Star Wars collection to a Bricks & Minifigs franchise in Oregon. When the store changed hands, their collection vanished. YouTuber Reckless Ben turned it into a viral investigation — and is now facing criminal charges in Utah for it.
              </p>
              <p className="text-gray-600 mb-6">
                PlaysWell was built in response. <strong>60% of every platform fee goes directly to Reckless Ben's legal defense fund</strong> until the case is resolved. The remaining 40% keeps the lights on.
              </p>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-lg no-underline transition-colors"
              >
                See our fee structure <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Raised for Ben', value: '$12,400+', sub: 'and growing', emoji: '⚖️' },
                { label: 'Listings Active', value: '12', sub: 'across 8 categories', emoji: '🃏' },
                { label: 'Categories', value: '8', sub: 'collectibles covered', emoji: '🧱' },
                { label: 'Fee to Cause', value: '60%', sub: 'of every platform fee', emoji: '❤️' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-4 border border-amber-100 text-center">
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-gray-700">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-500 mb-8">From rookie cards to retired LEGO sets — it's all here.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/browse?category=${cat.id}`}
              className="rounded-xl p-5 flex flex-col items-center gap-2 no-underline hover:scale-105 transition-transform cursor-pointer"
              style={{ background: cat.bg }}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked grails and must-haves</p>
            </div>
            <Link to="/browse" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold no-underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <Shield size={32} className="text-indigo-600" />, title: 'Buyer Protection', body: 'Every transaction is covered. If the item isn\'t as described, we make it right.' },
            { icon: <Heart size={32} className="text-rose-500" />, title: 'Mission-Driven', body: '60% of platform fees go to Reckless Ben\'s defense fund. Every sale is a vote for collectors.' },
            { icon: <TrendingUp size={32} className="text-emerald-600" />, title: 'Fair Fees', body: 'Tiered pricing means the more valuable your item, the lower your percentage. No hidden costs.' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              {item.icon}
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap justify-between gap-6">
          <div>
            <div className="text-white font-bold text-lg mb-2">🎮 PlaysWell</div>
            <p className="max-w-xs">The collector marketplace built for the community, by the community.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-white font-semibold mb-3">Marketplace</div>
              <div className="flex flex-col gap-2">
                <Link to="/browse" className="hover:text-white no-underline transition-colors">Browse</Link>
                <Link to="/sell" className="hover:text-white no-underline transition-colors">Sell</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3">Company</div>
              <div className="flex flex-col gap-2">
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors">How It Works</Link>
                <Link to="/how-it-works" className="hover:text-white no-underline transition-colors">Fee Structure</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 max-w-7xl mx-auto px-4 py-4 text-xs text-gray-600">
          © 2026 PlaysWell. All proceeds beyond operating costs support Reckless Ben's legal defense fund.
        </div>
      </footer>
    </div>
  )
}
