import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Activity, Search, Wrench, ShieldCheck } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Badge } from '../components/ui/Badge'
import {
  debuggingIssues,
  type DebugIssue,
  type IssueCategory,
  type IssueSeverity,
} from '../data/debuggingIssues'

type Filter = 'all' | IssueCategory

const categories: IssueCategory[] = [
  'Consumers',
  'Producers',
  'Replication',
  'Brokers',
  'Data Integrity',
  'Connectivity',
]

const severityVariant: Record<IssueSeverity, 'danger' | 'accent' | 'primary'> = {
  critical: 'danger',
  high: 'accent',
  medium: 'primary',
}

const severityLabel: Record<IssueSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
}

/** Inline markdown-lite: **bold**, `code`, and newlines. */
function Md({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-[var(--text-1)] font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-[0.85em] bg-[var(--border)]/40 text-[var(--primary)] px-1 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part === '\n') return <br key={i} />
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function Section({
  icon,
  label,
  color,
  children,
}: {
  icon: React.ReactNode
  label: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {icon}
        {label}
      </div>
      <div className="text-sm text-[var(--text-2)] leading-relaxed">{children}</div>
    </div>
  )
}

function IssueCard({ issue }: { issue: DebugIssue }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl transition-colors hover:border-[var(--text-2)]/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge variant={severityVariant[issue.severity]}>{severityLabel[issue.severity]}</Badge>
            <Badge variant="neutral">{issue.category}</Badge>
          </div>
          <p className="text-sm font-medium text-[var(--text-1)] leading-snug">{issue.title}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--border)]/60 text-[var(--text-2)] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-0.5 text-[var(--text-2)] group-hover:text-[var(--text-1)]"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)] space-y-4">
              <Section icon={<Search size={12} />} label="Symptoms" color="var(--text-2)">
                <Md text={issue.symptoms} />
              </Section>

              <Section icon={<Activity size={12} />} label="Root causes" color="var(--danger)">
                <ul className="space-y-1">
                  {issue.causes.map((cause, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--danger)] flex-shrink-0 mt-0.5">•</span>
                      <span><Md text={cause} /></span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section icon={<Wrench size={12} />} label="How to fix" color="var(--success)">
                <Md text={issue.fix} />
              </Section>

              <Section icon={<ShieldCheck size={12} />} label="Prevention" color="var(--primary)">
                <Md text={issue.prevention} />
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DebuggingCommonIssues() {
  const [filter, setFilter] = useState<Filter>('all')

  const counts: Record<Filter, number> = {
    all: debuggingIssues.length,
    Consumers: 0,
    Producers: 0,
    Replication: 0,
    Brokers: 0,
    'Data Integrity': 0,
    Connectivity: 0,
  }
  for (const issue of debuggingIssues) counts[issue.category]++

  const filtered =
    filter === 'all' ? debuggingIssues : debuggingIssues.filter(i => i.category === filter)

  const tabs: Filter[] = ['all', ...categories]

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Practice</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-3">
          🛠️ Debugging Common Issues
        </h1>
        <p className="text-[var(--text-2)] leading-relaxed max-w-2xl">
          {debuggingIssues.length} problems you actually hit running Kafka in production — what you{' '}
          <strong className="text-[var(--text-1)]">see</strong>, why it happens, how to fix it now,
          and how to stop it recurring. Click any issue to expand.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            {tab === 'all' ? 'All' : tab}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                filter === tab ? 'bg-white/20 text-white' : 'bg-[var(--border)] text-[var(--text-2)]'
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Issue list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="space-y-3"
        >
          {filtered.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
