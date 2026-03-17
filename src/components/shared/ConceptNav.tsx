import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { concepts } from '../../data/concepts'

export function ConceptNav() {
  const { pathname } = useLocation()
  const currentIndex = concepts.findIndex(c => c.slug === pathname)

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? concepts[currentIndex - 1] : null
  const next = currentIndex < concepts.length - 1 ? concepts[currentIndex + 1] : null

  return (
    <nav className="mt-12 pt-6 border-t border-[var(--border)] flex items-center justify-between gap-4">
      {prev ? (
        <Link
          to={prev.slug}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all duration-200 min-w-0 max-w-[48%]"
        >
          <ChevronLeft size={18} className="text-[var(--text-2)] group-hover:text-[var(--primary)] flex-shrink-0 transition-colors" />
          <div className="min-w-0">
            <div className="text-xs text-[var(--text-2)] mb-0.5">Previous</div>
            <div className="text-sm font-medium text-[var(--text-1)] truncate group-hover:text-[var(--primary)] transition-colors">
              {prev.icon} {prev.shortTitle}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={next.slug}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all duration-200 min-w-0 max-w-[48%] ml-auto text-right"
        >
          <div className="min-w-0">
            <div className="text-xs text-[var(--text-2)] mb-0.5">Next</div>
            <div className="text-sm font-medium text-[var(--text-1)] truncate group-hover:text-[var(--primary)] transition-colors">
              {next.icon} {next.shortTitle}
            </div>
          </div>
          <ChevronRight size={18} className="text-[var(--text-2)] group-hover:text-[var(--primary)] flex-shrink-0 transition-colors" />
        </Link>
      ) : (
        <Link
          to="/"
          className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all duration-200 ml-auto"
        >
          <div className="text-right">
            <div className="text-xs text-[var(--text-2)] mb-0.5">All done!</div>
            <div className="text-sm font-medium text-[var(--text-1)] group-hover:text-[var(--primary)] transition-colors">
              Back to Overview
            </div>
          </div>
          <ChevronRight size={18} className="text-[var(--text-2)] group-hover:text-[var(--primary)] flex-shrink-0 transition-colors" />
        </Link>
      )}
    </nav>
  )
}
