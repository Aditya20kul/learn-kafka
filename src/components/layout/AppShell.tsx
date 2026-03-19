import { ReactNode, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar, MobileSidebar, ThemeToggle } from './TopBar'
import { useProgress } from '../../context/ProgressContext'
import { concepts } from '../../data/concepts'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { markComplete } = useProgress()

  useEffect(() => {
    const concept = concepts.find(c => c.slug === location.pathname)
    if (concept) markComplete(concept.id)
  }, [location.pathname, markComplete])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-[var(--border)] bg-[var(--bg)] flex-shrink-0">
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="p-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-2)]">Apache Kafka Learning Guide</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />

        {/* Mobile drawer */}
        <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
