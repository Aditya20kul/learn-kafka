import { useState, useEffect } from 'react'
import { Menu, Sun, Moon, X } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface TopBarProps {
  onMenuToggle: () => void
  menuOpen: boolean
}

export function TopBar({ onMenuToggle, menuOpen }: TopBarProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs">
          K
        </div>
        <span className="font-bold text-[var(--text-1)] text-sm">Learn Kafka</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsDark(d => !d)}
          className="p-2 rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border)] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border)] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  )
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      className="p-2 rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border)] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg)] border-r border-[var(--border)] z-50 lg:hidden overflow-y-auto">
        <Sidebar onNavigate={onClose} />
      </div>
    </>
  )
}
