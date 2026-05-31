import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'pokemon',
    path: '/pokemon',
    label: 'Pokemon',
    sub: 'Cards',
    desc: 'Base Set to modern era',
    accent: '#FFDE00',
    dark: '#1a1a3e',
    border: '#FFDE0066',
    size: 'large', // takes up more grid space
    preview: [
      'https://images.pokemontcg.io/base1/4.png',
      'https://images.pokemontcg.io/base1/2.png',
      'https://images.pokemontcg.io/base1/10.png',
      'https://images.pokemontcg.io/sv3pt5/199.png',
      'https://images.pokemontcg.io/swsh11/211.png',
    ],
  },
  {
    id: 'lego',
    path: '/lego',
    label: 'LEGO',
    sub: 'Sets',
    desc: '26,939 sets & counting',
    accent: '#ff4444',
    dark: '#1a0808',
    border: '#ff444466',
    size: 'large',
    preview: [
      'https://cdn.rebrickable.com/media/sets/75192-1.jpg',
      'https://cdn.rebrickable.com/media/sets/71043-1.jpg',
      'https://cdn.rebrickable.com/media/sets/10307-1.jpg',
      'https://cdn.rebrickable.com/media/sets/10305-1.jpg',
      'https://cdn.rebrickable.com/media/sets/42083-1.jpg',
    ],
  },
  {
    id: 'baseball',
    path: '/baseball',
    label: 'Baseball',
    sub: 'Cards',
    desc: 'Vintage to modern',
    accent: '#4ade80',
    dark: '#071a07',
    border: '#4ade8044',
    size: 'small',
    preview: [],
  },
  {
    id: 'basketball',
    path: '/basketball',
    label: 'Basketball',
    sub: 'Cards',
    desc: 'Rookies & refractors',
    accent: '#f97316',
    dark: '#1a0e08',
    border: '#f9731644',
    size: 'small',
    preview: [],
  },
  {
    id: 'mtg',
    path: '/mtg',
    label: 'Magic',
    sub: 'The Gathering',
    desc: 'Reserved list & power',
    accent: '#c084fc',
    dark: '#0d061a',
    border: '#c084fc44',
    size: 'small',
    preview: [],
  },
  {
    id: 'hot-wheels',
    path: '/hot-wheels',
    label: 'Hot Wheels',
    sub: 'Diecast',
    desc: 'Redlines & supers',
    accent: '#f87171',
    dark: '#1a0404',
    border: '#f8717144',
    size: 'small',
    preview: [],
  },
  {
    id: 'comics',
    path: '/comics',
    label: 'Comics',
    sub: 'Books',
    desc: 'Key issues & slabs',
    accent: '#60a5fa',
    dark: '#04080f',
    border: '#60a5fa44',
    size: 'small',
    preview: [],
  },
  {
    id: 'vintage-toys',
    path: '/vintage-toys',
    label: 'Vintage',
    sub: 'Toys',
    desc: 'Kenner, Hasbro & more',
    accent: '#34d399',
    dark: '#041208',
    border: '#34d39944',
    size: 'small',
    preview: [],
  },
]

function CategoryTile({ cat, isHovered, onHover, onLeave }) {
  const isLarge = cat.size === 'large'

  return (
    <Link
      to={cat.path}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden no-underline block transition-all duration-300 rounded-2xl group ${isLarge ? 'row-span-2' : ''}`}
      style={{
        background: cat.dark,
        border: `1px solid ${isHovered ? cat.accent + 'aa' : cat.border}`,
        boxShadow: isHovered ? `0 0 40px ${cat.accent}33, inset 0 0 60px ${cat.accent}08` : 'none',
        transform: isHovered ? 'scale(1.015)' : 'scale(1)',
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${cat.accent}18 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Preview images for large tiles */}
      {isLarge && cat.preview.length > 0 && (
        <div className="absolute inset-0 flex items-end justify-center pb-20 px-4 gap-2 pointer-events-none">
          {cat.preview.slice(0, 5).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="object-contain rounded-lg transition-all duration-500"
              style={{
                height: i === 2 ? 140 : i === 1 || i === 3 ? 120 : 95,
                width: 'auto',
                maxWidth: cat.id === 'lego' ? 160 : 90,
                objectFit: cat.id === 'lego' ? 'cover' : 'contain',
                opacity: isHovered ? 1 : 0.5,
                transform: isHovered
                  ? `translateY(${i === 2 ? -12 : i === 1 || i === 3 ? -6 : 0}px) rotate(${[-8,-4,0,4,8][i]}deg)`
                  : `translateY(${i === 2 ? -4 : 0}px) rotate(${[-8,-4,0,4,8][i]}deg)`,
                filter: isHovered ? 'none' : 'brightness(0.6)',
                transition: `all 0.4s ease ${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col h-full">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="w-6 h-0.5 rounded-full mb-3" style={{ background: cat.accent }} />
            <div className="font-black leading-none" style={{ color: cat.accent, fontSize: isLarge ? 28 : 18 }}>
              {cat.label}
            </div>
            <div className="font-semibold" style={{ color: '#ffffff99', fontSize: isLarge ? 14 : 11, marginTop: 2 }}>
              {cat.sub}
            </div>
          </div>
          <div
            className="transition-all duration-300 rounded-full flex items-center justify-center"
            style={{
              width: 28, height: 28,
              background: isHovered ? cat.accent : `${cat.accent}22`,
              color: isHovered ? '#000' : cat.accent,
            }}
          >
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <p style={{ color: '#6b7280', fontSize: isLarge ? 12 : 10 }}>{cat.desc}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [hovered, setHovered] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  const large = CATEGORIES.filter(c => c.size === 'large')
  const small = CATEGORIES.filter(c => c.size === 'small')

  return (
    <div
      style={{
        background: '#07070d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Background grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Main layout — fills the viewport */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          padding: '24px 20px 20px',
          minHeight: 'calc(100vh - 72px)', // account for navbar + banner
        }}
      >
        {/* Header */}
        <div
          className="text-center mb-8 transition-all duration-700"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(-12px)' }}
        >
          <p style={{ color: '#4b5563', fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 10 }}>
            The collector marketplace
          </p>
          <h1
            className="font-black leading-none tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'white' }}
          >
            What are you{' '}
            <span style={{ background: 'linear-gradient(90deg,#FFDE00,#f97316,#c084fc,#4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              collecting?
            </span>
          </h1>
        </div>

        {/* Category grid */}
        <div
          className="flex-1 transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(16px)',
            transitionDelay: '0.1s',
          }}
        >
          {/* Desktop: custom grid layout */}
          <div className="hidden md:grid gap-3 h-full" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', minHeight: 480 }}>
            {/* Pokemon — large, col 1-2, row 1-2 */}
            <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
              <CategoryTile cat={CATEGORIES[0]} isHovered={hovered === 'pokemon'} onHover={() => setHovered('pokemon')} onLeave={() => setHovered(null)} />
            </div>

            {/* LEGO — large, col 3-4, row 1-2 */}
            <div style={{ gridColumn: '3 / 5', gridRow: '1 / 3' }}>
              <CategoryTile cat={CATEGORIES[1]} isHovered={hovered === 'lego'} onHover={() => setHovered('lego')} onLeave={() => setHovered(null)} />
            </div>

            {/* Small tiles — row 3, all 4 columns */}
            {small.map((cat, i) => (
              <div key={cat.id} style={{ gridColumn: `${i + 1} / ${i + 2}`, gridRow: '3 / 4' }}>
                <CategoryTile cat={cat} isHovered={hovered === cat.id} onHover={() => setHovered(cat.id)} onLeave={() => setHovered(null)} />
              </div>
            ))}
          </div>

          {/* Mobile: stacked grid */}
          <div className="md:hidden grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={cat.path}
                className="rounded-xl p-4 no-underline flex flex-col gap-1 border"
                style={{ background: cat.dark, borderColor: cat.border, minHeight: 90 }}
              >
                <div className="w-5 h-0.5 rounded-full" style={{ background: cat.accent }} />
                <div className="font-black text-base" style={{ color: cat.accent }}>{cat.label}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between mt-6 pt-4 flex-wrap gap-3 transition-all duration-700"
          style={{
            borderTop: '1px solid #ffffff0a',
            opacity: loaded ? 1 : 0,
            transitionDelay: '0.2s',
          }}
        >
          <div className="flex items-center gap-5">
            {[
              { val: '30,400+', label: 'items in catalog' },
              { val: '4% + $0.50', label: 'platform fee' },
              { val: '60%', label: 'of fees to Ben' },
            ].map(stat => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{stat.val}</span>
                <span style={{ color: '#4b5563', fontSize: 11 }}>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/submit" className="text-xs font-semibold no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>
              Submit an Item
            </Link>
            <span style={{ color: '#1f2937' }}>|</span>
            <Link to="/how-it-works" className="text-xs font-semibold no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>
              How It Works
            </Link>
            <span style={{ color: '#1f2937' }}>|</span>
            <Link to="/market" className="text-xs font-semibold no-underline transition-colors hover:text-white" style={{ color: '#6b7280' }}>
              Live Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
