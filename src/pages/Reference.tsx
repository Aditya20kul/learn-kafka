import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Sliders } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { CodeBlock } from '../components/ui/CodeBlock'
import { Badge } from '../components/ui/Badge'
import { InlineMd } from '../components/shared/InlineMd'
import {
  cliCommands,
  configReference,
  type CliCategory,
  type ConfigScope,
} from '../data/reference'

type Mode = 'cli' | 'config'

const cliCategories: CliCategory[] = ['Topics', 'Consumer Groups', 'Produce & Consume', 'Cluster & Configs']
const configScopes: ConfigScope[] = ['Producer', 'Consumer', 'Topic', 'Broker']

const scopeVariant: Record<ConfigScope, 'primary' | 'success' | 'accent' | 'danger'> = {
  Producer: 'primary',
  Consumer: 'success',
  Topic: 'accent',
  Broker: 'danger',
}

function FilterTabs<T extends string>({
  tabs,
  active,
  counts,
  onSelect,
}: {
  tabs: (T | 'all')[]
  active: T | 'all'
  counts: Record<string, number>
  onSelect: (t: T | 'all') => void
}) {
  return (
    <div className="flex flex-wrap gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 w-fit">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === tab ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          {tab === 'all' ? 'All' : tab}
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              active === tab ? 'bg-white/20 text-white' : 'bg-[var(--border)] text-[var(--text-2)]'
            }`}
          >
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  )
}

function CliView() {
  const [cat, setCat] = useState<CliCategory | 'all'>('all')

  const counts: Record<string, number> = { all: cliCommands.length }
  for (const c of cliCategories) counts[c] = cliCommands.filter(x => x.category === c).length

  const filtered = cat === 'all' ? cliCommands : cliCommands.filter(c => c.category === cat)

  return (
    <>
      <FilterTabs tabs={['all', ...cliCategories]} active={cat} counts={counts} onSelect={setCat} />
      <div className="space-y-4">
        {filtered.map(cmd => (
          <div key={cmd.id} className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-semibold text-[var(--text-1)]">{cmd.task}</p>
              <Badge variant="neutral">{cmd.category}</Badge>
            </div>
            <CodeBlock>{cmd.command}</CodeBlock>
            {cmd.note && (
              <p className="text-xs text-[var(--text-2)] mt-2 leading-relaxed">
                <InlineMd text={cmd.note} />
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function ConfigView() {
  const [scope, setScope] = useState<ConfigScope | 'all'>('all')

  const counts: Record<string, number> = { all: configReference.length }
  for (const s of configScopes) counts[s] = configReference.filter(x => x.scope === s).length

  const filtered = scope === 'all' ? configReference : configReference.filter(c => c.scope === scope)

  return (
    <>
      <FilterTabs tabs={['all', ...configScopes]} active={scope} counts={counts} onSelect={setScope} />
      <div className="space-y-3">
        {filtered.map(cfg => (
          <div key={cfg.id} className="border border-[var(--border)] bg-[var(--surface)] rounded-xl px-5 py-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <code className="font-mono text-sm font-semibold text-[var(--primary)]">{cfg.name}</code>
              <Badge variant={scopeVariant[cfg.scope]}>{cfg.scope}</Badge>
              <span className="ml-auto text-xs text-[var(--text-2)] font-mono">
                default: <span className="text-[var(--text-1)]">{cfg.default}</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-2)] leading-relaxed">
              <InlineMd text={cfg.description} />
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

export default function Reference() {
  const [mode, setMode] = useState<Mode>('cli')

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Reference</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-3">
          📋 CLI &amp; Config Reference
        </h1>
        <p className="text-[var(--text-2)] leading-relaxed max-w-2xl">
          The commands and settings you reach for most — the everyday CLI for operating Kafka, and the
          configs that decide durability, throughput, and rebalancing. Hover a command to copy it.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode('cli')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'cli' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          <Terminal size={15} />
          CLI Commands
        </button>
        <button
          onClick={() => setMode('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'config' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          <Sliders size={15} />
          Configuration
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {mode === 'cli' ? <CliView /> : <ConfigView />}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
