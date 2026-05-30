import { ExternalLink } from 'lucide-react'

export default function CauseBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <span className="text-base">⚖️</span>
          <span>
            <strong>Standing with collectors.</strong> All proceeds beyond operating costs currently go to support
            YouTuber Reckless Ben's legal defense in the Bricks & Minifigs case.
          </span>
        </div>
        <a
          href="https://www.gofundme.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 no-underline whitespace-nowrap"
        >
          Learn more <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}
