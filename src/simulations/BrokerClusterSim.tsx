import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'

interface BrokerClusterSimProps {
  controls: SimulationControls
}

interface Broker {
  id: number
  label: string
  x: number
  y: number
  isLeader: boolean
  failed: boolean
}

const initialBrokers: Broker[] = [
  { id: 0, label: 'Broker 0', x: 240, y: 120, isLeader: true, failed: false },
  { id: 1, label: 'Broker 1', x: 460, y: 120, isLeader: false, failed: false },
  { id: 2, label: 'Broker 2', x: 350, y: 250, isLeader: false, failed: false },
]

export function BrokerClusterSim({ controls: _controls }: BrokerClusterSimProps) {
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers)
  const [electing, setElecting] = useState(false)
  const [_lastKilledId, setLastKilledId] = useState<number | null>(null)

  const killBroker = (id: number) => {
    const broker = brokers.find(b => b.id === id)
    if (!broker || broker.failed) return

    const wasLeader = broker.isLeader
    const newBrokers = brokers.map(b =>
      b.id === id ? { ...b, failed: true, isLeader: false } : b
    )
    setBrokers(newBrokers)
    setLastKilledId(id)

    if (wasLeader) {
      setElecting(true)
      setTimeout(() => {
        setBrokers(prev => {
          const alive = prev.filter(b => !b.failed)
          if (alive.length === 0) return prev
          const newLeaderId = alive[0].id
          return prev.map(b => ({
            ...b,
            isLeader: b.id === newLeaderId,
          }))
        })
        setElecting(false)
      }, 1500)
    }
  }

  const reset = () => {
    setBrokers(initialBrokers)
    setElecting(false)
    setLastKilledId(null)
  }

  const aliveCount = brokers.filter(b => !b.failed).length
  const currentLeader = brokers.find(b => b.isLeader && !b.failed)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex-wrap">
        <div className="text-sm text-[var(--text-2)]">
          Click a broker to <span className="text-[var(--danger)] font-medium">kill it</span> and watch leader election:
        </div>
        <button
          onClick={reset}
          className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
        >
          Reset Cluster
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 700 340" width="100%">
          <defs>
            <pattern id="bgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="700" height="340" fill="url(#bgrid)" />

          {/* ZooKeeper / Controller */}
          <rect x="280" y="16" width="140" height="36" rx="8" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--accent)" fontFamily="Inter">
            Controller
          </text>
          <text x="350" y="45" textAnchor="middle" fontSize="9" fill="var(--text-2)" fontFamily="Inter">
            (KRaft / ZooKeeper)
          </text>

          {/* Lines between brokers */}
          {[
            [0, 1], [0, 2], [1, 2],
          ].map(([a, b]) => {
            const ba = brokers[a], bb = brokers[b]
            return (
              <line
                key={`${a}-${b}`}
                x1={ba.x} y1={ba.y}
                x2={bb.x} y2={bb.y}
                stroke={ba.failed || bb.failed ? 'var(--danger)' : 'var(--border)'}
                strokeWidth={1.5}
                strokeDasharray={ba.failed || bb.failed ? '5 4' : undefined}
                opacity={ba.failed || bb.failed ? 0.3 : 0.5}
              />
            )
          })}

          {/* Controller lines */}
          {brokers.filter(b => !b.failed).map(b => (
            <line
              key={`ctrl-${b.id}`}
              x1={350} y1={52}
              x2={b.x} y2={b.y - 30}
              stroke="var(--accent)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.3}
            />
          ))}

          {/* Broker nodes */}
          {brokers.map(broker => (
            <g
              key={broker.id}
              onClick={() => !broker.failed && killBroker(broker.id)}
              style={{ cursor: broker.failed ? 'default' : 'pointer' }}
            >
              <motion.g
                animate={broker.failed ? { opacity: 0.4 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <rect
                  x={broker.x - 72} y={broker.y - 34}
                  width={144} height={68}
                  rx={12}
                  fill={broker.failed ? 'var(--danger)' : broker.isLeader ? 'var(--primary)' : 'var(--surface)'}
                  stroke={broker.failed ? 'var(--danger)' : broker.isLeader ? 'var(--primary)' : 'var(--border)'}
                  strokeWidth={broker.isLeader ? 2.5 : 1.5}
                  opacity={broker.failed ? 0.3 : 0.9}
                  style={{
                    filter: broker.isLeader && !broker.failed
                      ? 'drop-shadow(0 0 12px var(--primary))'
                      : 'none',
                  }}
                />
                <text
                  x={broker.x} y={broker.y - 10}
                  textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={broker.failed ? 'var(--danger)' : broker.isLeader ? '#fff' : 'var(--text-1)'}
                  fontFamily="Inter"
                >
                  {broker.failed ? '💀' : broker.isLeader ? '👑 ' : '🖥️ '}{broker.label}
                </text>
                <text
                  x={broker.x} y={broker.y + 10}
                  textAnchor="middle" fontSize={10}
                  fill={broker.failed ? 'var(--danger)' : broker.isLeader ? 'rgba(255,255,255,0.75)' : 'var(--text-2)'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {broker.failed ? 'FAILED' : broker.isLeader ? 'LEADER' : 'FOLLOWER'}
                </text>
                {/* Hover hint */}
                {!broker.failed && (
                  <text
                    x={broker.x} y={broker.y + 26}
                    textAnchor="middle" fontSize={9}
                    fill={broker.isLeader ? 'rgba(255,255,255,0.5)' : 'var(--text-2)'}
                    fontFamily="Inter"
                    opacity={0.7}
                  >
                    click to kill
                  </text>
                )}
              </motion.g>
            </g>
          ))}

          {/* Leader election animation */}
          <AnimatePresence>
            {electing && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ transformOrigin: '350px 200px' }}
              >
                <rect x="220" y="180" width="260" height="70" rx="12" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="1.5" />
                <text x="350" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--accent)" fontFamily="Inter">
                  🗳️ Leader Election
                </text>
                <text x="350" y="225" textAnchor="middle" fontSize="10" fill="var(--text-2)" fontFamily="Inter">
                  Controller selecting new leader…
                </text>
                <text x="350" y="240" textAnchor="middle" fontSize="9" fill="var(--text-2)" fontFamily="Inter">
                  (ISR member with highest offset wins)
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Status bar */}
          <rect x="20" y="300" width="660" height="30" rx="8" fill="var(--bg)" opacity="0.8" />
          <text x="350" y="318" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="Inter">
            {aliveCount === 0
              ? '❌ Cluster offline — all brokers failed'
              : currentLeader
                ? `✅ Cluster healthy — leader: ${currentLeader.label} | ${aliveCount}/3 brokers alive`
                : '🔄 Electing new leader…'}
          </text>
        </svg>
      </div>
    </div>
  )
}
