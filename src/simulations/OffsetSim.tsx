import { motion, AnimatePresence } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'
import { StepControls } from '../components/shared/StepControls'
import { offsetSteps } from '../data/simulationSteps'

interface OffsetSimProps {
  controls: SimulationControls
}

const messages = [
  { offset: 0, content: 'user.signup' },
  { offset: 1, content: 'order.placed' },
  { offset: 2, content: 'payment.ok' },
]

export function OffsetSim({ controls }: OffsetSimProps) {
  const { currentStep } = controls
  const step = currentStep

  // step 0: idle — pointer at 0, no reads
  // step 1: read offset 0
  // step 2: read offset 1
  // step 3: commit offset 2 (committed up to 1)
  // step 4: read offset 2
  // step 5: CRASH
  // step 6: restart — rewind to committed offset 2

  const isCrash = step === 5
  const isRestart = step === 6

  const consumerOffset = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 2 : step === 4 ? 3 : step === 5 ? 3 : 2
  const committedOffset = step >= 3 ? 2 : 0

  const readMessages = step >= 1 ? [0] : []
  if (step >= 2) readMessages.push(1)
  if (step >= 4 && !isCrash) readMessages.push(2)

  return (
    <div className="space-y-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 800 340" width="100%">
          <defs>
            <pattern id="ogrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="800" height="340" fill="url(#ogrid)" />

          {/* Title */}
          <text x="400" y="30" textAnchor="middle" fontSize="12" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">PARTITION LOG</text>

          {/* Message cells */}
          {messages.map(msg => {
            const x = 140 + msg.offset * 190
            const isRead = readMessages.includes(msg.offset)
            const isCommitted = msg.offset < committedOffset
            return (
              <g key={msg.offset}>
                <rect
                  x={x - 70} y={60}
                  width={140} height={80}
                  rx={10}
                  fill={isRead ? (isCommitted ? 'var(--success)' : 'var(--secondary)') : 'var(--surface)'}
                  stroke={isRead ? (isCommitted ? 'var(--success)' : 'var(--secondary)') : 'var(--border)'}
                  strokeWidth={1.5}
                  opacity={isRead ? 0.9 : 0.7}
                />
                <text x={x} y={88} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
                  offset: {msg.offset}
                </text>
                <text x={x} y={108} textAnchor="middle" fontSize={11} fontWeight="600" fill={isRead ? '#fff' : 'var(--text-1)'} fontFamily="Inter">
                  {msg.content}
                </text>
                {isCommitted && (
                  <text x={x} y={128} textAnchor="middle" fontSize={9} fill={isRead ? 'rgba(255,255,255,0.7)' : 'var(--success)'} fontFamily="Inter">
                    ✓ committed
                  </text>
                )}
              </g>
            )
          })}

          {/* Consumer offset pointer */}
          <AnimatePresence mode="wait">
            <motion.g
              key={`pointer-${step}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {consumerOffset < 3 && (
                <>
                  <motion.line
                    x1={140 + consumerOffset * 190}
                    y1={160}
                    x2={140 + consumerOffset * 190}
                    y2={190}
                    stroke={isCrash ? 'var(--danger)' : isRestart ? 'var(--accent)' : 'var(--primary)'}
                    strokeWidth={2}
                  />
                  <polygon
                    points={`${140 + consumerOffset * 190 - 8},190 ${140 + consumerOffset * 190 + 8},190 ${140 + consumerOffset * 190},200`}
                    fill={isCrash ? 'var(--danger)' : isRestart ? 'var(--accent)' : 'var(--primary)'}
                  />
                </>
              )}
            </motion.g>
          </AnimatePresence>

          {/* Committed offset marker */}
          {committedOffset > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line
                x1={140 + (committedOffset - 0.5) * 190 - 95}
                y1={155}
                x2={140 + (committedOffset - 0.5) * 190 - 95}
                y2={205}
                stroke="var(--success)"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              <text
                x={140 + (committedOffset - 0.5) * 190 - 95 - 8}
                y={220}
                textAnchor="middle"
                fontSize={9}
                fill="var(--success)"
                fontFamily="JetBrains Mono, monospace"
              >
                committed
              </text>
            </motion.g>
          )}

          {/* Labels */}
          <text
            x={140 + Math.min(consumerOffset, 2) * 190}
            y={240}
            textAnchor="middle"
            fontSize={10}
            fill={isCrash ? 'var(--danger)' : isRestart ? 'var(--accent)' : 'var(--primary)'}
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            {isCrash ? '💥 CRASHED' : isRestart ? '⟳ rewind to offset 2' : `consumer @ offset ${consumerOffset}`}
          </text>

          {/* Crash explosion */}
          {isCrash && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ transformOrigin: '400px 270px' }}
            >
              <circle cx={400} cy={270} r={45} fill="var(--danger)" opacity={0.15} stroke="var(--danger)" strokeWidth={1.5} />
              <text x={400} y={265} textAnchor="middle" fontSize={24}>💥</text>
              <text x={400} y={285} textAnchor="middle" fontSize={11} fontWeight="700" fill="var(--danger)" fontFamily="Inter">
                Consumer Crashed!
              </text>
            </motion.g>
          )}

          {/* Restart message */}
          {isRestart && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={280} y={250} width={240} height={50} rx={10} fill="var(--accent)" opacity={0.15} stroke="var(--accent)" strokeWidth={1.5} />
              <text x={400} y={270} textAnchor="middle" fontSize={11} fontWeight="600" fill="var(--accent)" fontFamily="Inter">
                Resumed from committed offset 2
              </text>
              <text x={400} y={288} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
                Message at offset 2 will be re-processed
              </text>
            </motion.g>
          )}

          {/* Timeline axis */}
          <line x1={70} y1={100} x2={70} y2={155} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={70} y={155} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
            oldest
          </text>
          <line x1={730} y1={100} x2={730} y2={155} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={730} y={155} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
            newest
          </text>
        </svg>
      </div>
      <StepControls controls={controls} steps={offsetSteps} />
    </div>
  )
}
