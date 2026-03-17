import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulationControls } from '../hooks/useSimulation'
import { StepControls } from '../components/shared/StepControls'
import { replicationSteps } from '../data/simulationSteps'

interface ReplicationSimProps {
  controls: SimulationControls
}

type AcksMode = 0 | 1 | 'all'

export function ReplicationSim({ controls }: ReplicationSimProps) {
  const [acks, setAcks] = useState<AcksMode>(1)
  const [follower1Down, setFollower1Down] = useState(false)
  const { currentStep } = controls
  const step = currentStep

  // step 0: idle
  // step 1: produce arrow
  // step 2: leader writes
  // step 3: replicate to followers
  // step 4: followers ack
  // step 5: producer ack (only if acks match)

  const showProduceArrow = step >= 1
  const leaderActive = step >= 2
  const showReplArrow1 = step >= 3
  const showReplArrow2 = step >= 3 && !follower1Down
  const showFollowerAck = step >= 4
  const showProducerAck = step >= 5 && (acks === 0 ? true : acks === 1 ? true : !follower1Down)
  const isrWarning = acks === 'all' && follower1Down && step >= 3

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-2)]">acks=</span>
          {([0, 1, 'all'] as AcksMode[]).map(a => (
            <button
              key={String(a)}
              onClick={() => { setAcks(a); controls.reset() }}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${
                acks === a
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-2)] hover:bg-[var(--border)]'
              }`}
            >
              {String(a)}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setFollower1Down(d => !d); controls.reset() }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            follower1Down
              ? 'bg-[var(--danger)] text-white'
              : 'text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--danger)] hover:text-[var(--danger)]'
          }`}
        >
          {follower1Down ? '💀 Follower 1 offline' : 'Kill Follower 1'}
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <svg viewBox="0 0 800 340" width="100%">
          <defs>
            <pattern id="rgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />
            </pattern>
            {['prod', 'repl1', 'repl2', 'ack1', 'ack2', 'back'].map(id => (
              <marker key={id} id={`rm-${id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={
                  id === 'prod' ? 'var(--primary)'
                  : id === 'back' ? 'var(--success)'
                  : id.startsWith('ack') ? 'var(--success)'
                  : 'var(--secondary)'
                } />
              </marker>
            ))}
          </defs>
          <rect width="800" height="340" fill="url(#rgrid)" />

          {/* Columns */}
          <text x="110" y="25" textAnchor="middle" fontSize="10" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">PRODUCER</text>
          <text x="360" y="25" textAnchor="middle" fontSize="10" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">LEADER</text>
          <text x="570" y="25" textAnchor="middle" fontSize="10" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">FOLLOWER 1</text>
          <text x="710" y="25" textAnchor="middle" fontSize="10" fill="var(--text-2)" fontFamily="Inter" fontWeight="600">FOLLOWER 2</text>

          {/* Producer */}
          <rect x={50} y={110} width={120} height={56} rx={10}
            fill={showProduceArrow ? 'var(--primary)' : 'var(--surface)'}
            stroke={showProduceArrow ? 'var(--primary)' : 'var(--border)'}
            strokeWidth={showProduceArrow ? 2 : 1.5}
            opacity={0.9}
          />
          <text x={110} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={showProduceArrow ? '#fff' : 'var(--text-1)'} fontFamily="Inter">Producer</text>
          <text x={110} y={156} textAnchor="middle" fontSize={9} fill={showProduceArrow ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'} fontFamily="JetBrains Mono, monospace">
            acks={String(acks)}
          </text>

          {/* Leader */}
          <rect x={295} y={100} width={130} height={76} rx={10}
            fill={leaderActive ? 'var(--primary)' : 'var(--surface)'}
            stroke={leaderActive ? 'var(--primary)' : 'var(--border)'}
            strokeWidth={leaderActive ? 2 : 1.5}
            style={{ filter: leaderActive ? 'drop-shadow(0 0 10px var(--primary))' : 'none' }}
          />
          <text x={360} y={130} textAnchor="middle" fontSize={12} fontWeight={700} fill={leaderActive ? '#fff' : 'var(--text-1)'} fontFamily="Inter">
            👑 Leader
          </text>
          <text x={360} y={148} textAnchor="middle" fontSize={9} fill={leaderActive ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'} fontFamily="Inter">Broker 0</text>
          {leaderActive && (
            <text x={360} y={164} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.6)" fontFamily="JetBrains Mono, monospace">
              LEO: 1
            </text>
          )}

          {/* Follower 1 */}
          <rect x={510} y={110} width={120} height={56} rx={10}
            fill={follower1Down ? 'var(--danger)' : showFollowerAck ? 'var(--success)' : 'var(--surface)'}
            stroke={follower1Down ? 'var(--danger)' : showFollowerAck ? 'var(--success)' : 'var(--border)'}
            strokeWidth={1.5}
            opacity={follower1Down ? 0.4 : 0.9}
          />
          <text x={570} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={follower1Down ? 'var(--danger)' : showFollowerAck ? '#fff' : 'var(--text-1)'} fontFamily="Inter">
            {follower1Down ? '💀 Dead' : 'Follower 1'}
          </text>
          <text x={570} y={156} textAnchor="middle" fontSize={9} fill={follower1Down ? 'var(--danger)' : 'var(--text-2)'} fontFamily="Inter">
            {follower1Down ? 'OFFLINE' : 'Broker 1'}
          </text>

          {/* Follower 2 */}
          <rect x={650} y={110} width={120} height={56} rx={10}
            fill={showFollowerAck ? 'var(--success)' : 'var(--surface)'}
            stroke={showFollowerAck ? 'var(--success)' : 'var(--border)'}
            strokeWidth={1.5}
          />
          <text x={710} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={showFollowerAck ? '#fff' : 'var(--text-1)'} fontFamily="Inter">Follower 2</text>
          <text x={710} y={156} textAnchor="middle" fontSize={9} fill={showFollowerAck ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'} fontFamily="Inter">Broker 2</text>

          {/* Arrows */}
          {showProduceArrow && (
            <motion.line x1={170} y1={138} x2={293} y2={138}
              stroke="var(--primary)" strokeWidth={2} markerEnd="url(#rm-prod)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
            />
          )}
          {showReplArrow1 && (
            <motion.line x1={425} y1={132} x2={508} y2={132}
              stroke="var(--secondary)" strokeWidth={1.5} markerEnd="url(#rm-repl1)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
            />
          )}
          {showReplArrow2 && (
            <motion.line x1={425} y1={144} x2={648} y2={144}
              stroke="var(--secondary)" strokeWidth={1.5} markerEnd="url(#rm-repl2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
            />
          )}
          {showFollowerAck && !follower1Down && (
            <motion.line x1={508} y1={158} x2={425} y2={158}
              stroke="var(--success)" strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#rm-ack1)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
            />
          )}
          {showFollowerAck && (
            <motion.line x1={648} y1={158} x2={425} y2={158}
              stroke="var(--success)" strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#rm-ack2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
            />
          )}
          {showProducerAck && (
            <motion.line x1={293} y1={150} x2={170} y2={150}
              stroke="var(--success)" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#rm-back)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
            />
          )}

          {/* ISR warning */}
          <AnimatePresence>
            {isrWarning && (
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <rect x={200} y={220} width={400} height={60} rx={10} fill="var(--accent)" opacity={0.15} stroke="var(--accent)" strokeWidth={1.5} />
                <text x={400} y={243} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--accent)" fontFamily="Inter">
                  ⚠️ ISR Shrank!
                </text>
                <text x={400} y={260} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
                  acks=all requires all ISR members. Follower 1 removed from ISR.
                </text>
                <text x={400} y={274} textAnchor="middle" fontSize={10} fill="var(--accent)" fontFamily="Inter">
                  min.insync.replicas may block writes if ISR too small.
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Ack explanation */}
          <text x={400} y={325} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
            {acks === 0
              ? 'acks=0: No ack — fire and forget. Fastest, but data may be lost.'
              : acks === 1
                ? 'acks=1: Leader acks after writing. Followers may lag.'
                : 'acks=all: Full ISR must confirm. Slowest, most durable.'}
          </text>
        </svg>
      </div>
      <StepControls controls={controls} steps={replicationSteps} />
    </div>
  )
}
