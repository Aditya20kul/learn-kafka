import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Badge } from '../components/ui/Badge'
import { interviewQuestions, type InterviewQuestion } from '../data/interviewQuestions'

const STORAGE_KEY = 'kafka-interview-reviewed'

type Level = 'all' | 'easy' | 'medium' | 'hard'

const levelVariant: Record<string, 'success' | 'accent' | 'danger'> = {
  easy: 'success',
  medium: 'accent',
  hard: 'danger',
}

const levelLabel: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

function useReviewed() {
  const [reviewed, setReviewed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch {
      return {}
    }
  })

  function toggle(id: string) {
    setReviewed(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const reviewedCount = Object.values(reviewed).filter(Boolean).length

  return { reviewed, toggle, reviewedCount }
}

function AnswerText({ text }: { text: string }) {
  // Render markdown-lite: **bold** and `code` inline
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-[var(--text-1)] font-semibold">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="font-mono text-[0.85em] bg-[var(--border)]/40 text-[var(--primary)] px-1 py-0.5 rounded">
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part === '\n') {
          return <br key={i} />
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

function QuestionCard({
  q,
  isReviewed,
  onToggleReviewed,
}: {
  q: InterviewQuestion
  isReviewed: boolean
  onToggleReviewed: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border rounded-xl transition-all duration-200 ${
        isReviewed
          ? 'border-[var(--success)]/40 bg-[var(--success)]/5'
          : 'border-[var(--border)] bg-[var(--surface)]'
      }`}
    >
      {/* Question header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge variant={levelVariant[q.level]}>{levelLabel[q.level]}</Badge>
            <Badge variant={q.type === 'scenario' ? 'accent' : 'primary'}>
              {q.type === 'scenario' ? 'Scenario' : 'Conceptual'}
            </Badge>
            {isReviewed && (
              <Badge variant="success">
                <CheckCircle2 size={10} className="mr-1" />
                Reviewed
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium text-[var(--text-1)] leading-snug">{q.question}</p>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {q.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--border)]/60 text-[var(--text-2)]"
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

      {/* Answer panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-2)] leading-relaxed whitespace-pre-line">
                <AnswerText text={q.answer} />
              </p>
              <button
                onClick={e => { e.stopPropagation(); onToggleReviewed() }}
                className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isReviewed
                    ? 'bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25'
                    : 'bg-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]'
                }`}
              >
                <CheckCircle2 size={13} />
                {isReviewed ? 'Reviewed ✓' : 'Mark as reviewed'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const tabs: { id: Level; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export default function InterviewQA() {
  const [activeLevel, setActiveLevel] = useState<Level>('all')
  const { reviewed, toggle, reviewedCount } = useReviewed()

  const counts: Record<Level, number> = {
    all: interviewQuestions.length,
    easy: interviewQuestions.filter(q => q.level === 'easy').length,
    medium: interviewQuestions.filter(q => q.level === 'medium').length,
    hard: interviewQuestions.filter(q => q.level === 'hard').length,
  }

  const filtered =
    activeLevel === 'all'
      ? interviewQuestions
      : interviewQuestions.filter(q => q.level === activeLevel)

  return (
    <PageWrapper>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-[var(--text-2)] mb-2">Practice</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-3">
            🎯 Interview Q&amp;A
          </h1>
          <p className="text-[var(--text-2)] leading-relaxed max-w-xl">
            {interviewQuestions.length} questions — easy to hard, with real production scenarios. Click any question to reveal the answer, then mark it reviewed to track your progress.
          </p>
        </div>

        {/* Progress */}
        <div className="sm:text-right flex-shrink-0">
          <div className="text-sm font-medium text-[var(--text-1)] mb-1">
            {reviewedCount} / {interviewQuestions.length} reviewed
          </div>
          <div className="w-40 h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--success)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(reviewedCount / interviewQuestions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Level filter tabs */}
      <div className="flex gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveLevel(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeLevel === tab.id
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeLevel === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--border)] text-[var(--text-2)]'
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Question list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="space-y-3"
        >
          {filtered.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              isReviewed={!!reviewed[q.id]}
              onToggleReviewed={() => toggle(q.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
