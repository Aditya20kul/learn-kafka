import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'
import { Button } from '../components/ui/Button'
import { Plus, Minus, RefreshCw } from 'lucide-react'

interface ConsumerGroupSimProps {
  controls: SimulationControls
}

const PARTITION_COUNT = 4
const PARTITION_COLORS = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)']

function assignPartitions(numConsumers: number): number[][] {
  const assignment: number[][] = Array.from({ length: numConsumers }, () => [])
  for (let p = 0; p < PARTITION_COUNT; p++) {
    assignment[p % numConsumers].push(p)
  }
  return assignment
}

export function ConsumerGroupSim({ controls: _controls }: ConsumerGroupSimProps) {
  const [numConsumers, setNumConsumers] = useState(2)
  const [isRebalancing, setIsRebalancing] = useState(false)

  const handleChange = (delta: number) => {
    const next = Math.max(1, Math.min(6, numConsumers + delta))
    if (next !== numConsumers) {
      setIsRebalancing(true)
      setTimeout(() => {
        setNumConsumers(next)
        setIsRebalancing(false)
      }, 600)
    }
  }

  const assignment = assignPartitions(numConsumers)

  const partitionY = (pi: number) => 70 + pi * 56
  const consumerY = (ci: number) => {
    const totalH = numConsumers * 56
    const startY = (320 - totalH) / 2 + 28
    return startY + ci * 56
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
        <span className="text-sm text-[var(--text-2)]">Consumers in group:</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleChange(-1)} disabled={numConsumers <= 1}>
            <Minus size={14} />
          </Button>
          <span className="font-mono font-bold text-[var(--text-1)] w-6 text-center">{numConsumers}</span>
          <Button size="sm" variant="secondary" onClick={() => handleChange(1)} disabled={numConsumers >= 6}>
            <Plus size={14} />
          </Button>
        </div>
        {isRebalancing && (
          <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
            <RefreshCw size={14} className="animate-spin" />
            Rebalancing…
          </div>
        )}
        {numConsumers > PARTITION_COUNT && (
          <div className="text-sm text-[var(--accent)]">
            ⚠️ {numConsumers - PARTITION_COUNT} consumer{numConsumers - PARTITION_COUNT > 1 ? 's' : ''} idle (no partitions)
          </div>
        )}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 700 320" width="100%">
          <defs>
            <pattern id="cgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
            <marker id="cg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--border)" />
            </marker>
          </defs>
          <rect width="700" height="320" fill="url(#cgrid)" />

          {/* Topic label */}
          <text x="150" y="25" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">
            TOPIC (4 PARTITIONS)
          </text>
          <text x="550" y="25" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">
            CONSUMER GROUP
          </text>

          {/* Partitions */}
          {Array.from({ length: PARTITION_COUNT }).map((_, pi) => (
            <g key={pi}>
              <rect
                x={70} y={partitionY(pi) - 22}
                width={160} height={44}
                rx={8}
                fill={PARTITION_COLORS[pi]}
                opacity={0.15}
                stroke={PARTITION_COLORS[pi]}
                strokeWidth={1.5}
              />
              <text x={150} y={partitionY(pi) - 5} textAnchor="middle" fontSize={11} fontWeight="600" fill={PARTITION_COLORS[pi]} fontFamily="Inter">
                Partition {pi}
              </text>
              <text x={150} y={partitionY(pi) + 10} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
                leader: broker-{pi % 3}
              </text>
            </g>
          ))}

          {/* Consumers & assignment lines */}
          <AnimatePresence>
            {!isRebalancing && assignment.map((partitions, ci) => {
              const cy = consumerY(ci)
              const isIdle = partitions.length === 0
              return (
                <motion.g
                  key={ci}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: ci * 0.05 }}
                >
                  {/* Assignment lines */}
                  {partitions.map(pi => (
                    <motion.line
                      key={pi}
                      x1={230} y1={partitionY(pi)}
                      x2={450} y2={cy}
                      stroke={PARTITION_COLORS[pi]}
                      strokeWidth={1.5}
                      strokeDasharray="5 4"
                      markerEnd="url(#cg-arrow)"
                      opacity={0.6}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  ))}

                  {/* Consumer box */}
                  <rect
                    x={450} y={cy - 22}
                    width={170} height={44}
                    rx={8}
                    fill={isIdle ? 'var(--surface)' : 'var(--primary)'}
                    opacity={isIdle ? 1 : 0.15}
                    stroke={isIdle ? 'var(--border)' : 'var(--primary)'}
                    strokeWidth={isIdle ? 1 : 1.5}
                    strokeDasharray={isIdle ? '5 3' : undefined}
                  />
                  <text x={535} y={cy - 5} textAnchor="middle" fontSize={11} fontWeight="600" fill={isIdle ? 'var(--text-2)' : 'var(--text-1)'} fontFamily="Inter">
                    consumer-{ci + 1}
                  </text>
                  <text x={535} y={cy + 10} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="Inter">
                    {isIdle ? '— idle —' : `partitions: [${partitions.join(', ')}]`}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>

          {/* Rebalancing overlay */}
          {isRebalancing && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={300} y={120} width={200} height={80} rx={12} fill="var(--accent)" opacity={0.15} stroke="var(--accent)" strokeWidth={1.5} />
              <text x={400} y={155} textAnchor="middle" fontSize={13} fontWeight="700" fill="var(--accent)" fontFamily="Inter">
                🔄 Rebalancing
              </text>
              <text x={400} y={175} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
                Reassigning partitions…
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  )
}
