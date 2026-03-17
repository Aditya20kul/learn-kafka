import { motion, AnimatePresence } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'
import { StepControls } from '../components/shared/StepControls'
import { messageFlowSteps } from '../data/simulationSteps'
import { NodeBox } from '../components/shared/NodeBox'

interface MessageFlowSimProps {
  controls: SimulationControls
  acksMode?: 0 | 1 | 'all'
}

export function MessageFlowSim({ controls, acksMode = 1 }: MessageFlowSimProps) {
  const { currentStep } = controls
  const step = currentStep

  // step 0: idle
  // step 1: produce arrow (producer → broker)
  // step 2: broker receives (message stored)
  // step 3: ack arrow (broker → producer)
  // step 4: consumer poll arrow
  // step 5: consumer receives message
  // step 6: offset commit

  const producerActive = step >= 1
  const brokerActive = step >= 2
  const consumerActive = step >= 5

  const showProduceArrow = step >= 1
  const showMessage = step >= 2
  const showAckArrow = step >= 3 && (acksMode === 1 || acksMode === 'all')
  const showPollArrow = step >= 4
  const showDeliverArrow = step >= 5
  const showCommit = step >= 6

  return (
    <div className="space-y-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 800 300" width="100%">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="800" height="300" fill="url(#grid)" />

          {/* Labels */}
          <text x="120" y="30" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">PRODUCER</text>
          <text x="400" y="30" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">KAFKA BROKER</text>
          <text x="680" y="30" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">CONSUMER</text>

          {/* Arrows: static guides */}
          <line x1="180" y1="150" x2="310" y2="150" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="490" y1="150" x2="620" y2="150" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

          {/* Nodes */}
          <NodeBox x={120} y={150} label="Producer" sublabel="app:9001" color="var(--primary)" active={producerActive} />
          <NodeBox x={400} y={130} width={160} height={64} label="my-topic" sublabel="partition-0" color="var(--secondary)" active={brokerActive} />
          <NodeBox x={680} y={150} label="Consumer" sublabel="group-1" color="var(--success)" active={consumerActive} />

          {/* Animated produce arrow */}
          {showProduceArrow && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <defs>
                <marker id="arr-prod" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--primary)" />
                </marker>
              </defs>
              <motion.line
                x1={180} y1={140} x2={315} y2={140}
                stroke="var(--primary)" strokeWidth={2}
                markerEnd="url(#arr-prod)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <text x={248} y={130} textAnchor="middle" fontSize={10} fill="var(--primary)" fontFamily="Inter">
                send(msg)
              </text>
            </motion.g>
          )}

          {/* Message packet in broker */}
          <AnimatePresence>
            {showMessage && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ transformOrigin: '400px 150px' }}
              >
                <rect x="375" y="140" width="50" height="20" rx="4" fill="var(--secondary)" opacity="0.8" />
                <text x="400" y="154" textAnchor="middle" fontSize={9} fill="#fff" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                  offset:0
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Ack arrow */}
          {showAckArrow && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <defs>
                <marker id="arr-ack" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--success)" />
                </marker>
              </defs>
              <motion.line
                x1={315} y1={162} x2={180} y2={162}
                stroke="var(--success)" strokeWidth={1.5}
                strokeDasharray="6 3"
                markerEnd="url(#arr-ack)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <text x={248} y={180} textAnchor="middle" fontSize={10} fill="var(--success)" fontFamily="Inter">
                ack
              </text>
            </motion.g>
          )}

          {/* Poll arrow */}
          {showPollArrow && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <defs>
                <marker id="arr-poll" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--text-2)" />
                </marker>
              </defs>
              <motion.line
                x1={620} y1={140} x2={490} y2={140}
                stroke="var(--text-2)" strokeWidth={1.5}
                strokeDasharray="5 3"
                markerEnd="url(#arr-poll)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <text x={555} y={130} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
                poll()
              </text>
            </motion.g>
          )}

          {/* Deliver arrow */}
          {showDeliverArrow && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <defs>
                <marker id="arr-deliver" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--secondary)" />
                </marker>
              </defs>
              <motion.line
                x1={490} y1={160} x2={620} y2={160}
                stroke="var(--secondary)" strokeWidth={2}
                markerEnd="url(#arr-deliver)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <text x={555} y={178} textAnchor="middle" fontSize={10} fill="var(--secondary)" fontFamily="Inter">
                message
              </text>
            </motion.g>
          )}

          {/* Commit indicator */}
          {showCommit && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={630} y={190} width={100} height={24} rx={6} fill="var(--success)" opacity={0.15} stroke="var(--success)" strokeWidth={1} />
              <text x={680} y={206} textAnchor="middle" fontSize={10} fill="var(--success)" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                commit: 1
              </text>
            </motion.g>
          )}

          {/* acks label */}
          <text x={400} y={290} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
            acks={acksMode === 'all' ? '"all"' : acksMode}
          </text>
        </svg>
      </div>
      <StepControls controls={controls} steps={messageFlowSteps} />
    </div>
  )
}
