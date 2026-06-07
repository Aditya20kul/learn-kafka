import { NavLink, useLocation } from 'react-router-dom'
import { concepts } from '../../data/concepts'
import { useProgress } from '../../context/ProgressContext'
import { OPEN_COMMAND_PALETTE } from '../shared/CommandPalette'
import { CheckCircle2, Circle, Search } from 'lucide-react'

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent)

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

      {/* Search trigger */}
      <button
        onClick={() => {
          onNavigate?.()
          window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE))
        }}
        className="flex items-center gap-2.5 px-3 py-2 mb-3 rounded-lg text-sm text-[var(--text-2)] border border-[var(--border)] bg-[var(--surface)] hover:text-[var(--text-1)] hover:border-[var(--text-2)]/40 transition-colors"
      >
        <Search size={15} className="flex-shrink-0" />
        <span>Search…</span>
        <kbd className="ml-auto text-[10px] font-mono border border-[var(--border)] rounded px-1.5 py-0.5">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

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
        <NavLink
          to="/debugging-common-issues"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-0.5 ${
              isActive
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
            }`
          }
        >
          <span className="text-base">🛠️</span>
          <span>Debugging</span>
        </NavLink>

        <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider px-3 mb-2 mt-4">
          Reference
        </div>
        <NavLink
          to="/reference"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
            }`
          }
        >
          <span className="text-base">📋</span>
          <span>CLI &amp; Configs</span>
        </NavLink>
      </div>

    </nav>
  )
}
