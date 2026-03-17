import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { BrokerClusterSim } from '../simulations/BrokerClusterSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'

export default function BrokersAndClusters() {
  const controls = useSimulation(6)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 5 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          🖥️ Brokers & Clusters
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          A <strong className="text-[var(--text-1)]">broker</strong> is a Kafka server that stores
          messages and serves producers and consumers. A <strong className="text-[var(--text-1)]">cluster</strong>
          {' '}is a group of brokers working together for fault tolerance and scalability.
        </p>
      </div>

      {/* Static diagram */}
      <div className="mb-8">
        <SectionHeader title="Cluster Architecture" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 200" width="100%">
            <defs>
              <marker id="bc-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--border)" />
              </marker>
            </defs>

            {/* Producer */}
            <rect x={20} y={80} width={110} height={40} rx={8}
              fill="var(--primary)" opacity={0.12} stroke="var(--primary)" strokeWidth={1.5} />
            <text x={75} y={105} textAnchor="middle" fontSize={11} fontWeight={600}
              fill="var(--primary)" fontFamily="Inter">Producer</text>
            <line x1={130} y1={100} x2={195} y2={100} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#bc-arr)" opacity={0.5} />

            {/* Brokers */}
            {[
              { id: 0, x: 240, y: 50, leader: true },
              { id: 1, x: 370, y: 50, leader: false },
              { id: 2, x: 305, y: 140, leader: false },
            ].map(b => (
              <g key={b.id}>
                <rect x={b.x - 55} y={b.y - 22} width={110} height={44} rx={8}
                  fill={b.leader ? 'var(--primary)' : 'var(--surface)'}
                  opacity={b.leader ? 0.15 : 1}
                  stroke={b.leader ? 'var(--primary)' : 'var(--border)'}
                  strokeWidth={b.leader ? 2 : 1.5} />
                <text x={b.x} y={b.y - 4} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={b.leader ? 'var(--primary)' : 'var(--text-1)'} fontFamily="Inter">
                  {b.leader ? '👑 ' : ''}Broker {b.id}
                </text>
                <text x={b.x} y={b.y + 12} textAnchor="middle" fontSize={9}
                  fill={b.leader ? 'var(--primary)' : 'var(--text-2)'} fontFamily="JetBrains Mono, monospace">
                  {b.leader ? 'LEADER' : 'FOLLOWER'}
                </text>
              </g>
            ))}

            {/* Replication lines */}
            <line x1={295} y1={50} x2={315} y2={50} stroke="var(--secondary)" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#bc-arr)" opacity={0.6} />
            <line x1={265} y1={72} x2={290} y2={118} stroke="var(--secondary)" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#bc-arr)" opacity={0.6} />

            {/* Consumer */}
            <line x1={425} y1={100} x2={490} y2={100} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#bc-arr)" opacity={0.5} />
            <rect x={490} y={80} width={110} height={40} rx={8}
              fill="var(--success)" opacity={0.12} stroke="var(--success)" strokeWidth={1.5} />
            <text x={545} y={105} textAnchor="middle" fontSize={11} fontWeight={600}
              fill="var(--success)" fontFamily="Inter">Consumer</text>

            {/* Controller */}
            <rect x={580} y={20} width={110} height={36} rx={8}
              fill="var(--accent)" opacity={0.12} stroke="var(--accent)" strokeWidth={1.5} />
            <text x={635} y={37} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--accent)" fontFamily="Inter">KRaft Controller</text>
            <text x={635} y={50} textAnchor="middle" fontSize={9}
              fill="var(--text-2)" fontFamily="Inter">metadata mgmt</text>

            <text x={350} y={185} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
              Each partition has one leader broker — all reads/writes go through the leader
            </text>
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          Every partition has a <strong className="text-[var(--text-1)]">leader broker</strong> that
          handles all produce and fetch requests for that partition. The other brokers that hold
          copies are <strong className="text-[var(--text-1)]">followers</strong>.
        </p>
        <p>
          In modern Kafka (2.8+), the <strong className="text-[var(--text-1)]">KRaft</strong> protocol
          replaces ZooKeeper for cluster coordination. The controller is responsible for leader
          elections, topic creation, and cluster metadata.
        </p>
      </div>

      <ConceptCallout type="insight" title="Partitions spread across brokers">
        A topic with 6 partitions across 3 brokers distributes 2 partitions per broker.
        This spreads both storage and network load, preventing hotspots.
        Kafka auto-balances partition leadership with the preferred replica election.
      </ConceptCallout>

      <ConceptCallout type="warning" title="Leader election on failure">
        When a leader broker dies, the controller elects a new leader from the ISR
        (In-Sync Replicas). Clients automatically discover the new leader via
        metadata requests. No manual intervention needed.
      </ConceptCallout>

      <div className="my-8 grid sm:grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="font-semibold text-[var(--text-1)] mb-2">Scaling brokers</div>
          <p className="text-sm text-[var(--text-2)]">
            Adding brokers to a cluster requires rebalancing partitions. The
            <code className="font-mono text-xs mx-1 bg-[var(--border)] px-1 rounded">kafka-reassign-partitions.sh</code>
            tool (or Cruise Control) moves partition replicas to the new broker automatically.
          </p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="font-semibold text-[var(--text-1)] mb-2">Broker configuration</div>
          <p className="text-sm text-[var(--text-2)]">
            Each broker has a unique <code className="font-mono text-xs bg-[var(--border)] px-1 rounded">broker.id</code>.
            Key settings: <code className="font-mono text-xs bg-[var(--border)] px-1 rounded">log.dirs</code> (data path),
            <code className="font-mono text-xs mx-1 bg-[var(--border)] px-1 rounded">num.partitions</code> (default partitions),
            and <code className="font-mono text-xs bg-[var(--border)] px-1 rounded">replication.factor</code>.
          </p>
        </div>
      </div>

      <CodeBlock label="server.properties">
{`broker.id=1
listeners=PLAINTEXT://0.0.0.0:9092
log.dirs=/var/kafka/logs
num.partitions=3
default.replication.factor=3
min.insync.replicas=2
process.roles=broker,controller    # KRaft mode`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Broker Cluster"
          subtitle="Click a broker to kill it and watch leader election happen in real time"
        />
        <BrokerClusterSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
