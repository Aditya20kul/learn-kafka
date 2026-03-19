import { NavLink, useLocation } from 'react-router-dom'
import { concepts } from '../../data/concepts'
import { useProgress } from '../../context/ProgressContext'
import { CheckCircle2, Circle } from 'lucide-react'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()
  const { isComplete } = useProgress()

  return (
    <nav className="flex flex-col h-full py-6 px-3">
      {/* Brand */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <div>
            <div className="font-bold text-[var(--text-1)] text-sm">Learn Kafka</div>
            <div className="text-xs text-[var(--text-2)]">Interactive Guide</div>
          </div>
        </div>
      </div>

      {/* Home link */}
      <NavLink
        to="/"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
            isActive
              ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
          }`
        }
      >
        <span className="text-base">🏠</span>
        <span>Overview</span>
      </NavLink>

      <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider px-3 mb-2 mt-4">
        Concepts
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5">
        {concepts.map(concept => {
          const active = location.pathname === concept.slug
          const done = isComplete(concept.id)
          return (
            <NavLink
              key={concept.id}
              to={concept.slug}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                active
                  ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base flex-shrink-0">{concept.icon}</span>
                <span className="truncate">{concept.shortTitle}</span>
              </div>
              {done ? (
                <CheckCircle2 size={14} className="text-[var(--success)] flex-shrink-0" />
              ) : (
                <Circle size={14} className="text-[var(--border)] flex-shrink-0 group-hover:text-[var(--text-2)]" />
              )}
            </NavLink>
          )
        })}
      </div>

      <div className="pt-2">
        <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider px-3 mb-2 mt-4">
          Practice
        </div>
        <NavLink
          to="/interview-qa"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
            }`
          }
        >
          <span className="text-base">🎯</span>
          <span>Interview Q&amp;A</span>
        </NavLink>
      </div>

    </nav>
  )
}
