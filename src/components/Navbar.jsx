import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  const tools = [
    { to: '/market',    label: 'Market',      desc: 'Live prices & volume' },
    { to: '/analytics', label: 'Analytics',   desc: 'Price charts & RSI' },
    { to: '/grading',   label: 'Grading ROI', desc: 'PSA vs BGS vs CGC' },
    { to: '/pack-ev',   label: 'Pack EV',     desc: 'Open or sell sealed?' },
    { to: '/portfolio', label: 'Portfolio',   desc: 'Track your collection' },
  ]

  const isActive = p => pathname.startsWith(p)
  const isToolActive = tools.some(t => isActive(t.to))

  const navLink = 'text-sm font-medium no-underline transition-colors'
  const active   = 'text-indigo-400'
  const inactive = 'text-gray-400 hover:text-white'

  return (
    <nav style={{ background: '#0a0a0f', borderBottom: '1px solid #ffffff12' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl text-white no-underline tracking-tight">
          PlaysWell
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link to="/browse"       className={`${navLink} ${isActive('/browse') ? active : inactive}`}>Browse</Link>
          <Link to="/submit"       className={`${navLink} ${isActive('/submit') ? active : inactive}`}>Submit</Link>

          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className={`flex items-center gap-1 ${navLink} ${isToolActive ? active : inactive}`}>
              Tools <ChevronDown size={13} />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-xl py-2 z-50" style={{ background: '#141420', border: '1px solid #ffffff15' }}>
                {tools.map(t => (
                  <Link key={t.to} to={t.to} className="flex flex-col px-4 py-2.5 hover:bg-white/5 no-underline transition-colors" onClick={() => setToolsOpen(false)}>
                    <span className="text-sm font-semibold text-white">{t.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{t.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/sell"         className={`${navLink} ${isActive('/sell') ? active : inactive}`}>Sell</Link>
          <Link to="/how-it-works" className={`${navLink} ${isActive('/how-it-works') ? active : inactive}`}>How It Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/submit" className="text-sm font-semibold px-4 py-2 rounded-lg no-underline transition-colors" style={{ background: '#ffffff12', color: '#e2e8f0' }}>
            Submit Item
          </Link>
          <Link to="/sell" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg no-underline transition-colors">
            List an Item
          </Link>
        </div>

        <button className="md:hidden p-2 text-gray-400" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 py-4 flex flex-col gap-3 border-t" style={{ background: '#0a0a0f', borderColor: '#ffffff10' }}>
          <Link to="/browse"       className="text-sm text-gray-300 no-underline" onClick={() => setOpen(false)}>Browse</Link>
          <Link to="/submit"       className="text-sm text-gray-300 no-underline" onClick={() => setOpen(false)}>Submit</Link>
          <div className="text-xs font-bold text-gray-600 uppercase mt-1">Tools</div>
          {tools.map(t => (
            <Link key={t.to} to={t.to} className="text-sm text-gray-300 no-underline pl-2" onClick={() => setOpen(false)}>{t.label}</Link>
          ))}
          <Link to="/sell"         className="text-sm text-gray-300 no-underline mt-1" onClick={() => setOpen(false)}>Sell</Link>
          <Link to="/how-it-works" className="text-sm text-gray-300 no-underline" onClick={() => setOpen(false)}>How It Works</Link>
          <Link to="/sell" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg no-underline text-center mt-1" onClick={() => setOpen(false)}>
            List an Item
          </Link>
        </div>
      )}
    </nav>
  )
}
