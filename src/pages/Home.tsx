import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { concepts } from '../data/concepts'
import { debuggingIssues } from '../data/debuggingIssues'
import { interviewQuestions } from '../data/interviewQuestions'
import { useProgress } from '../context/ProgressContext'

export default function Home() {
  const { isComplete, completedCount } = useProgress()

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-[var(--primary)]/15 border border-[var(--primary)]/30 rounded-full px-4 py-1.5 text-sm text-[var(--primary)] font-medium mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          Interactive Learning — 7 Core Concepts
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-4xl sm:text-5xl font-bold text-[var(--text-1)] leading-tight mb-4"
        >
          Master Apache{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
            Kafka
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-lg text-[var(--text-2)] max-w-xl mx-auto mb-8"
        >
          Learn distributed streaming through interactive simulations.
          Watch messages flow, partitions balance, and brokers fail — in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <Link to="/what-is-kafka">
            <Button size="lg">
              Start Learning
              <ArrowRight size={18} />
            </Button>
          </Link>
          {completedCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <CheckCircle2 size={16} className="text-[var(--success)]" />
              {completedCount} / {concepts.length} completed
            </div>
          )}
        </motion.div>
      </div>

      {/* Static concept map SVG */}
      <div className="mb-12">
        <ConceptMap />
      </div>

      {/* Concept grid */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-6">All Concepts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
            >
              <Link to={concept.slug}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${concept.color}20` }}
                    >
                      {concept.icon}
                    </div>
                    {isComplete(concept.id) && (
                      <CheckCircle2 size={18} className="text-[var(--success)]" />
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--text-1)] mb-1">{concept.title}</h3>
                  <p className="text-sm text-[var(--text-2)]">{concept.teaser}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: concept.color }}>
                    <span className="text-[var(--text-2)] font-normal">Step {concept.order}</span>
                    <span className="text-[var(--border)]">•</span>
                    <span>Learn more</span>
                    <ArrowRight size={12} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interview Q&A CTA */}
      <div className="mt-6">
        <Link to="/interview-qa">
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[var(--primary)]/60 transition-colors cursor-pointer group">
            <div>
              <div className="font-semibold text-[var(--text-1)] mb-1">🎯 Ready to test your knowledge?</div>
              <div className="text-sm text-[var(--text-2)]">{interviewQuestions.length} interview questions — easy to hard, with real production scenarios.</div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] flex-shrink-0 group-hover:gap-2.5 transition-all">
              Interview Q&amp;A
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      {/* Debugging CTA */}
      <div className="mt-4">
        <Link to="/debugging-common-issues">
          <div className="bg-gradient-to-r from-[var(--accent)]/10 to-[var(--danger)]/10 border border-[var(--accent)]/30 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[var(--accent)]/60 transition-colors cursor-pointer group">
            <div>
              <div className="font-semibold text-[var(--text-1)] mb-1">🛠️ Running Kafka in production?</div>
              <div className="text-sm text-[var(--text-2)]">{debuggingIssues.length} common prod issues — symptoms, root causes, fixes, and prevention.</div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] flex-shrink-0 group-hover:gap-2.5 transition-all">
              Debugging Guide
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>
    </PageWrapper>
  )
}

function ConceptMap() {
  // Node layout: center Kafka circle at (370,150)
  // Left:  What is Kafka at (80, 150)
  // Mid-left top/bot: Topics(240,75) Producers(240,225)
  // Mid-right top/bot: Groups(500,75) Brokers(500,225)
  // Right top/bot: Offsets(660,90) Replication(660,210)
  const W = 130  // node width
  const H = 42   // node height
  const R = 10   // border radius

  const nodes = [
    { x: 80,  y: 150, label: 'What is Kafka?', color: '#6366F1' },
    { x: 240, y:  75, label: 'Topics',         color: '#06B6D4' },
    { x: 240, y: 225, label: 'Producers',      color: '#10B981' },
    { x: 500, y:  75, label: 'Groups',         color: '#F59E0B' },
    { x: 500, y: 225, label: 'Brokers',        color: '#8B5CF6' },
    { x: 660, y:  95, label: 'Offsets',        color: '#F59E0B' },
    { x: 660, y: 205, label: 'Replication',    color: '#EF4444' },
  ]

  const cx = 370, cy = 150  // Kafka center

  const edges = [
    [80, 150, 240, 75],
    [80, 150, 240, 225],
    [240, 75, cx, cy],
    [240, 225, cx, cy],
    [cx, cy, 500, 75],
    [cx, cy, 500, 225],
    [cx, cy, 660, 95],
    [cx, cy, 660, 205],
  ]

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 overflow-hidden">
      <p className="text-xs text-[var(--text-2)] mb-3 text-center uppercase tracking-wider">Kafka Architecture Map</p>
      <svg viewBox="0 0 740 300" width="100%">
        <defs>
          <marker id="map-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="var(--border)" opacity="0.7" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map(([x1, y1, x2, y2], i) => {
          // Shorten endpoints so arrows don't overlap node borders
          const dx = x2 - x1, dy = y2 - y1
          const len = Math.sqrt(dx*dx + dy*dy)
          const ux = dx/len, uy = dy/len
          const pad = 22
          return (
            <line key={i}
              x1={x1 + ux*pad} y1={y1 + uy*pad}
              x2={x2 - ux*pad} y2={y2 - uy*pad}
              stroke="var(--border)" strokeWidth="1.5"
              markerEnd="url(#map-arrow)" opacity="0.5"
            />
          )
        })}

        {/* Kafka core circle */}
        <circle cx={cx} cy={cy} r={42} fill="var(--primary)" opacity="0.12" stroke="var(--primary)" strokeWidth="2" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fill="var(--primary)">⚡</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-1)" fontFamily="Inter, sans-serif">Kafka</text>

        {/* Nodes */}
        {nodes.map(({ x, y, label, color }) => (
          <g key={label} transform={`translate(${x - W/2}, ${y - H/2})`}>
            <rect width={W} height={H} rx={R} ry={R}
              fill={color} fillOpacity="0.1"
              stroke={color} strokeOpacity="0.5" strokeWidth="1.5"
            />
            <text
              x={W / 2} y={H / 2 + 5}
              textAnchor="middle"
              fontSize="12" fontWeight="600"
              fill="var(--text-1)" fontFamily="Inter, sans-serif"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
