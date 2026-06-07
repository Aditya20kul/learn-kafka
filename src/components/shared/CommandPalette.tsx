import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { concepts } from '../../data/concepts'
import { interviewQuestions } from '../../data/interviewQuestions'
import { debuggingIssues } from '../../data/debuggingIssues'
import { cliCommands, configReference } from '../../data/reference'

type Group = 'Concepts' | 'Interview Q&A' | 'Debugging' | 'Reference'

interface SearchItem {
  id: string
  group: Group
  title: string
  subtitle: string
  keywords: string
  to: string
  icon: string
}

/** Event any button can dispatch to open the palette: window.dispatchEvent(new Event(OPEN_EVENT)) */
export const OPEN_COMMAND_PALETTE = 'open-command-palette'

// Static data → build the index once at module load.
const INDEX: SearchItem[] = [
  ...concepts.map(c => ({
    id: `concept-${c.id}`,
    group: 'Concepts' as const,
    title: c.title,
    subtitle: c.teaser,
    keywords: `${c.title} ${c.description} ${c.teaser}`.toLowerCase(),
    to: c.slug,
    icon: c.icon,
  })),
  ...interviewQuestions.map(q => ({
    id: `iv-${q.id}`,
    group: 'Interview Q&A' as const,
    title: q.question,
    subtitle: `${q.level} · ${q.tags.join(', ')}`,
    keywords: `${q.question} ${q.tags.join(' ')} ${q.level} ${q.type}`.toLowerCase(),
    to: '/interview-qa',
    icon: '🎯',
  })),
  ...debuggingIssues.map(d => ({
    id: `dbg-${d.id}`,
    group: 'Debugging' as const,
    title: d.title,
    subtitle: `${d.category} · ${d.tags.join(', ')}`,
    keywords: `${d.title} ${d.category} ${d.tags.join(' ')} ${d.symptoms}`.toLowerCase(),
    to: '/debugging-common-issues',
    icon: '🛠️',
  })),
  ...cliCommands.map(c => ({
    id: `cli-${c.id}`,
    group: 'Reference' as const,
    title: c.task,
    subtitle: c.command.split('\n')[0],
    keywords: `${c.task} ${c.command} ${c.category}`.toLowerCase(),
    to: '/reference',
    icon: '⌨️',
  })),
  ...configReference.map(c => ({
    id: `cfg-${c.id}`,
    group: 'Reference' as const,
    title: c.name,
    subtitle: `${c.scope} · default: ${c.default}`,
    keywords: `${c.name} ${c.scope} ${c.description}`.toLowerCase(),
    to: '/reference',
    icon: '🔧',
  })),
]

const GROUP_ORDER: Group[] = ['Concepts', 'Debugging', 'Reference', 'Interview Q&A']

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Open on ⌘K / Ctrl+K, or when any trigger dispatches the open event.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen)
    }
  }, [])

  // Reset state each time it opens, and focus the input.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // focus after the enter animation paints
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // No query → show concepts + a few starters so the palette isn't empty.
      return INDEX.filter(i => i.group === 'Concepts')
    }
    const terms = q.split(/\s+/)
    const matched = INDEX.filter(i => terms.every(t => i.keywords.includes(t)))
    return [...matched]
      .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group))
      .slice(0, 40)
  }, [query])

  // Keep the active index in range when results change.
  useEffect(() => {
    setActive(0)
  }, [query])

  // Scroll the active row into view.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function choose(item: SearchItem | undefined) {
    if (!item) return
    setOpen(false)
    navigate(item.to)
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    }
  }

  // Render results with a group header before the first item of each group.
  let lastGroup: Group | null = null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {/* Input */}
            <div className="flex items-center gap-2 px-4 border-b border-[var(--border)]">
              <Search size={16} className="text-[var(--text-2)] flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search concepts, issues, configs, questions…"
                className="flex-1 bg-transparent py-3.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-2)] outline-none"
              />
              <kbd className="text-[10px] font-mono text-[var(--text-2)] border border-[var(--border)] rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[var(--text-2)]">
                  No results for “{query}”.
                </div>
              ) : (
                results.map((item, idx) => {
                  const showHeader = item.group !== lastGroup
                  lastGroup = item.group
                  return (
                    <div key={item.id}>
                      {showHeader && (
                        <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-2)]">
                          {item.group}
                        </div>
                      )}
                      <button
                        data-idx={idx}
                        onClick={() => choose(item)}
                        onMouseMove={() => setActive(idx)}
                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                          idx === active ? 'bg-[var(--primary)]/15' : ''
                        }`}
                      >
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-sm truncate ${
                              idx === active ? 'text-[var(--primary)]' : 'text-[var(--text-1)]'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="block text-xs text-[var(--text-2)] truncate font-mono">
                            {item.subtitle}
                          </span>
                        </span>
                        {idx === active && (
                          <CornerDownLeft size={14} className="text-[var(--text-2)] flex-shrink-0" />
                        )}
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--text-2)]">
              <span className="flex items-center gap-1">
                <ArrowUp size={11} />
                <ArrowDown size={11} />
                navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={11} />
                open
              </span>
              <span className="ml-auto">{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
