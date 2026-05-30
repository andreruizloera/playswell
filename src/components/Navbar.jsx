import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  const tools = [
    { to: '/market', label: '📈 Market', desc: 'Live prices & volume' },
    { to: '/analytics', label: '📊 Analytics', desc: 'Price charts & RSI' },
    { to: '/grading', label: '🏆 Grading ROI', desc: 'PSA vs BGS vs CGC' },
    { to: '/pack-ev', label: '📦 Pack EV', desc: 'Open or sell sealed?' },
    { to: '/portfolio', label: '💼 Portfolio', desc: 'Track your collection' },
  ]

  const isActive = (path) => pathname.startsWith(path)
  const isToolActive = tools.some(t => isActive(t.to))

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 no-underline">
          <span className="text-2xl">🎮</span>
          <span>PlaysWell</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className={`text-sm font-medium no-underline transition-colors ${isActive('/browse') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
            Browse
          </Link>

          {/* Tools dropdown */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${isToolActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Tools <ChevronDown size={14} />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                {tools.map(t => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="flex flex-col px-4 py-2.5 hover:bg-gray-50 no-underline transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    <span className="text-sm font-semibold text-gray-900">{t.label}</span>
                    <span className="text-xs text-gray-400">{t.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/sell" className={`text-sm font-medium no-underline transition-colors ${isActive('/sell') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
            Sell
          </Link>
          <Link to="/how-it-works" className={`text-sm font-medium no-underline transition-colors ${isActive('/how-it-works') ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
            How It Works
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/sell" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg no-underline transition-colors">
            List an Item
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          <Link to="/browse" className="text-sm font-medium text-gray-700 no-underline py-1" onClick={() => setOpen(false)}>Browse</Link>
          <div className="text-xs font-bold text-gray-400 uppercase mt-2 mb-1">Tools</div>
          {tools.map(t => (
            <Link key={t.to} to={t.to} className="text-sm font-medium text-gray-700 no-underline py-1 pl-2" onClick={() => setOpen(false)}>
              {t.label}
            </Link>
          ))}
          <Link to="/sell" className="text-sm font-medium text-gray-700 no-underline py-1 mt-1" onClick={() => setOpen(false)}>Sell</Link>
          <Link to="/how-it-works" className="text-sm font-medium text-gray-700 no-underline py-1" onClick={() => setOpen(false)}>How It Works</Link>
          <Link to="/sell" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg no-underline text-center mt-2" onClick={() => setOpen(false)}>
            List an Item
          </Link>
        </div>
      )}
    </nav>
  )
}
