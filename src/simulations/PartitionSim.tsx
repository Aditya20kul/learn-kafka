import { useState } from 'react'
import { motion } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'
import { StepControls } from '../components/shared/StepControls'
import { NodeBox } from '../components/shared/NodeBox'
import { partitionSteps } from '../data/simulationSteps'

interface PartitionSimProps {
  controls: SimulationControls
}

// Round-robin: step 1→P0, step2→P1, step3→P2, step4→P0
// Key-based: all messages with same key → same partition
const roundRobinTargets = [0, 1, 2, 0]
const keyBasedTargets = [0, 0, 1, 1] // key-A→P0, key-B→P1

export function PartitionSim({ controls }: PartitionSimProps) {
  const [useKey, setUseKey] = useState(false)
  const { currentStep } = controls
  const step = currentStep

  const targets = useKey ? keyBasedTargets : roundRobinTargets
  const partitionCounts = [0, 0, 0]

  for (let i = 1; i <= Math.min(step, 4); i++) {
    if (targets[i - 1] !== undefined) {
      partitionCounts[targets[i - 1]]++
    }
  }

  const activeTarget = step >= 1 && step <= 4 ? targets[step - 1] : -1
  const keys = useKey ? ['key=A', 'key=A', 'key=B', 'key=B'] : ['no key', 'no key', 'no key', 'no key']

  const partitionColors = ['var(--primary)', 'var(--secondary)', 'var(--accent)']

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
        <span className="text-sm text-[var(--text-2)]">Routing strategy:</span>
        <button
          onClick={() => { setUseKey(false); controls.reset() }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !useKey ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-2)] hover:bg-[var(--border)]'
          }`}
        >
          Round-robin (no key)
        </button>
        <button
          onClick={() => { setUseKey(true); controls.reset() }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            useKey ? 'bg-[var(--secondary)] text-white' : 'text-[var(--text-2)] hover:bg-[var(--border)]'
          }`}
        >
          Key-based
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 800 320" width="100%">
          <defs>
            <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="800" height="320" fill="url(#pgrid)" />

          {/* Labels */}
          <text x="120" y="30" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">PRODUCER</text>
          <text x="500" y="30" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">PARTITIONS</text>

          {/* Producer */}
          <NodeBox x={120} y={160} label="Producer" sublabel={step >= 1 && step <= 4 ? keys[step - 1] : 'ready'} color="var(--primary)" active={step >= 1} />

          {/* Partitions */}
          {[0, 1, 2].map(pi => {
            const py = 80 + pi * 90
            const isActive = activeTarget === pi
            const count = partitionCounts[pi]
            return (
              <g key={pi}>
                {/* Arrow from producer */}
                {isActive && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <defs>
                      <marker id={`pa${pi}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L8,3 z" fill={partitionColors[pi]} />
                      </marker>
                    </defs>
                    <motion.line
                      x1={180} y1={160}
                      x2={340} y2={py}
                      stroke={partitionColors[pi]}
                      strokeWidth={2}
                      markerEnd={`url(#pa${pi})`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.g>
                )}

                {/* Partition box */}
                <NodeBox
                  x={400} y={py}
                  width={160} height={52}
                  label={`Partition ${pi}`}
                  sublabel={`${count} msg${count !== 1 ? 's' : ''}`}
                  color={partitionColors[pi]}
                  active={isActive}
                />

                {/* Message dots in partition */}
                {Array.from({ length: count }).map((_, mi) => (
                  <motion.g
                    key={`${pi}-${mi}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ transformOrigin: `${490 + mi * 22}px ${py}px` }}
                  >
                    <circle
                      cx={490 + mi * 22}
                      cy={py}
                      r={8}
                      fill={partitionColors[pi]}
                      opacity={0.8}
                    />
                    <text
                      x={490 + mi * 22}
                      y={py + 4}
                      textAnchor="middle"
                      fontSize={8}
                      fill="#fff"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      {mi}
                    </text>
                  </motion.g>
                ))}
              </g>
            )
          })}

          {/* Strategy label */}
          <text x={400} y={310} textAnchor="middle" fontSize={11} fill="var(--text-2)" fontFamily="Inter">
            {useKey ? 'Messages with same key always go to the same partition' : 'Messages distributed sequentially across partitions'}
          </text>
        </svg>
      </div>
      <StepControls controls={controls} steps={partitionSteps} />
    </div>
  )
}
