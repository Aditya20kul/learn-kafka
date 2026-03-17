import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { ReplicationSim } from '../simulations/ReplicationSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'
import { replicationSteps } from '../data/simulationSteps'

export default function ReplicationAndFaultTolerance() {
  const controls = useSimulation(replicationSteps.length)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 7 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          🛡️ Replication & Fault Tolerance
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          Kafka replicates each partition across multiple brokers.
          One replica is the <strong className="text-[var(--text-1)]">leader</strong> (handles all I/O)
          and the rest are <strong className="text-[var(--text-1)]">followers</strong> (stay in sync).
          If the leader dies, a follower is automatically elected as the new leader.
        </p>
      </div>

      {/* Static replication diagram */}
      <div className="mb-8">
        <SectionHeader title="Replication Factor = 3" subtitle="Each partition has 3 copies across different brokers" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 180" width="100%">
            <defs>
              <marker id="rf-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--secondary)" />
              </marker>
            </defs>

            {/* Partition-0 on all 3 brokers */}
            {[
              { broker: 'Broker 0', x: 110, role: 'LEADER', active: true },
              { broker: 'Broker 1', x: 350, role: 'FOLLOWER', active: false },
              { broker: 'Broker 2', x: 590, role: 'FOLLOWER', active: false },
            ].map(({ broker, x, role, active }) => (
              <g key={broker}>
                <rect x={x - 90} y={40} width={180} height={100} rx={12}
                  fill={active ? 'var(--primary)' : 'var(--surface)'}
                  opacity={active ? 0.12 : 1}
                  stroke={active ? 'var(--primary)' : 'var(--border)'}
                  strokeWidth={active ? 2 : 1.5}
                  style={{ filter: active ? 'drop-shadow(0 0 8px var(--primary))' : 'none' }} />
                <text x={x} y={68} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="var(--text-2)" fontFamily="Inter">{broker}</text>
                <rect x={x - 50} y={76} width={100} height={28} rx={6}
                  fill={active ? 'var(--primary)' : 'var(--secondary)'}
                  opacity={0.2} stroke={active ? 'var(--primary)' : 'var(--secondary)'} strokeWidth={1} />
                <text x={x} y={94} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? 'var(--primary)' : 'var(--secondary)'} fontFamily="JetBrains Mono, monospace">
                  partition-0
                </text>
                <text x={x} y={128} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={active ? 'var(--primary)' : 'var(--text-2)'} fontFamily="Inter">
                  {active ? '👑 ' : ''}{role}
                </text>
              </g>
            ))}

            {/* Replication arrows */}
            <line x1={200} y1={90} x2={258} y2={90} stroke="var(--secondary)" strokeWidth={1.5} markerEnd="url(#rf-arr)" opacity={0.6} />
            <line x1={440} y1={90} x2={498} y2={90} stroke="var(--secondary)" strokeWidth={1.5} markerEnd="url(#rf-arr)" opacity={0.6} />

            <text x={350} y={170} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
              Leader replicates to followers in real-time. All in ISR = In-Sync Replicas
            </text>
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          The <strong className="text-[var(--text-1)]">ISR (In-Sync Replicas)</strong> is the set of
          replicas that are fully caught up with the leader. Only ISR members are eligible to become
          the new leader if the current one fails.
        </p>
        <p>
          A replica is removed from the ISR if it falls too far behind
          (<code className="font-mono text-xs bg-[var(--border)] px-1 rounded mx-1">replica.lag.time.max.ms</code>).
          With <code className="font-mono text-xs bg-[var(--border)] px-1 rounded mx-1">acks=all</code>,
          messages only commit after all ISR members acknowledge — guaranteeing no data loss.
        </p>
      </div>

      <ConceptCallout type="insight" title="replication.factor vs min.insync.replicas">
        <strong>replication.factor=3</strong>: 3 copies of each partition.
        <br /><strong>min.insync.replicas=2</strong>: at least 2 replicas must be in-sync for
        acks=all writes to succeed. If only 1 is in-sync, the write is rejected with
        NotEnoughReplicasException — preventing unacknowledged data loss.
      </ConceptCallout>

      <ConceptCallout type="warning" title="Unclean leader election">
        By default (<code>unclean.leader.election.enable=false</code>), Kafka refuses to elect
        an out-of-sync replica as leader — preventing data loss. Enabling it allows availability
        at the cost of potentially losing messages. Never enable in production.
      </ConceptCallout>

      <div className="my-8 grid sm:grid-cols-3 gap-3">
        {[
          { label: 'acks=0', risk: 'High loss risk', speed: '⚡⚡⚡', color: 'var(--danger)', desc: 'No ack — fire and forget' },
          { label: 'acks=1', risk: 'Leader crash = loss', speed: '⚡⚡', color: 'var(--accent)', desc: 'Leader-only ack' },
          { label: 'acks=all', risk: 'No loss (ISR full)', speed: '⚡', color: 'var(--success)', desc: 'Full ISR ack' },
        ].map(item => (
          <div key={item.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
            style={{ borderColor: item.color + '40' }}>
            <code className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.label}</code>
            <div className="text-sm text-[var(--text-2)] mt-2">{item.desc}</div>
            <div className="text-xs mt-2 font-medium" style={{ color: item.color }}>{item.risk}</div>
            <div className="text-xs text-[var(--text-2)] mt-1">Speed: {item.speed}</div>
          </div>
        ))}
      </div>

      <CodeBlock label="Topic with replication">
{`kafka-topics.sh --create \\
  --topic payments \\
  --partitions 6 \\
  --replication-factor 3

# Topic-level config
kafka-configs.sh --alter --topic payments \\
  --add-config min.insync.replicas=2`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Replication Flow"
          subtitle="Toggle acks modes, take a follower offline, and see ISR behavior"
        />
        <ReplicationSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
