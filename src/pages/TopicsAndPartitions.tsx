import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { PartitionSim } from '../simulations/PartitionSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'
import { partitionSteps } from '../data/simulationSteps'

export default function TopicsAndPartitions() {
  const controls = useSimulation(partitionSteps.length)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 2 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          📂 Topics & Partitions
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          A <strong className="text-[var(--text-1)]">topic</strong> is a named channel for messages —
          like a category or feed. Each topic is split into <strong className="text-[var(--text-1)]">partitions</strong>,
          which are the unit of parallelism and scalability in Kafka.
        </p>
      </div>

      {/* Static diagram */}
      <div className="mb-8">
        <SectionHeader title="Topics & Partitions Structure" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 220" width="100%">
            {/* Topic box */}
            <rect x={40} y={20} width={620} height={180} rx={14}
              fill="var(--primary)" opacity={0.06} stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="8 4" />
            <text x={350} y={45} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--primary)" fontFamily="Inter">Topic: "user-events"</text>

            {/* Partitions */}
            {[0, 1, 2].map(pi => {
              const y = 55 + pi * 45
              const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)']
              const offsets = [
                ['msg@0', 'msg@1', 'msg@2', 'msg@3', 'msg@4'],
                ['msg@0', 'msg@1', 'msg@2'],
                ['msg@0', 'msg@1', 'msg@2', 'msg@3'],
              ]
              return (
                <g key={pi}>
                  <text x={80} y={y + 18} textAnchor="start" fontSize={10} fontWeight={600}
                    fill={colors[pi]} fontFamily="JetBrains Mono, monospace">
                    P{pi}
                  </text>
                  {offsets[pi].map((_, oi) => (
                    <g key={oi}>
                      <rect x={110 + oi * 100} y={y} width={90} height={30} rx={5}
                        fill={colors[pi]} opacity={0.12 + oi * 0.03}
                        stroke={colors[pi]} strokeWidth={1} />
                      <text x={155 + oi * 100} y={y + 20} textAnchor="middle" fontSize={9}
                        fill={colors[pi]} fontFamily="JetBrains Mono, monospace">
                        offset:{oi}
                      </text>
                    </g>
                  ))}
                  <text x={620} y={y + 18} textAnchor="end" fontSize={9}
                    fill="var(--text-2)" fontFamily="Inter">→ append only</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          Messages within a partition are strictly ordered and immutable — you can only append.
          Each message gets a sequential <strong className="text-[var(--text-1)]">offset</strong> number.
          Partitions across a topic can be on different brokers, enabling horizontal scaling.
        </p>
        <p>
          When you create a topic, you choose the number of partitions. More partitions =
          more parallelism for producers writing and consumers reading.
        </p>
      </div>

      <ConceptCallout type="insight" title="Partition = Unit of Parallelism">
        Each partition can only be consumed by ONE consumer in a consumer group at a time.
        With 4 partitions, you can have at most 4 consumers processing in parallel.
        A 5th consumer would sit idle.
      </ConceptCallout>

      <ConceptCallout type="warning" title="Ordering is per-partition only">
        Kafka guarantees message order within a partition, but NOT across partitions.
        If ordering matters (e.g., all events for user #123 must be ordered), use a message key
        to ensure they land in the same partition.
      </ConceptCallout>

      <div className="my-8">
        <SectionHeader title="How Routing Works" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">🔄 Round-robin (no key)</div>
            <p className="text-sm text-[var(--text-2)]">
              Messages are distributed evenly across partitions in order.
              Great for throughput when ordering doesn't matter.
            </p>
            <CodeBlock>{`producer.send("user-events", value="click")`}</CodeBlock>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">🔑 Key-based routing</div>
            <p className="text-sm text-[var(--text-2)]">
              <code className="font-mono text-xs">hash(key) % numPartitions</code> — all messages
              with the same key always land in the same partition, preserving order.
            </p>
            <CodeBlock>{`producer.send("user-events", key="user-123", value="click")`}</CodeBlock>
          </div>
        </div>
      </div>

      <CodeBlock label="Creating a topic with 3 partitions">
{`kafka-topics.sh --create \\
  --bootstrap-server localhost:9092 \\
  --topic user-events \\
  --partitions 3 \\
  --replication-factor 2`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Partition Routing"
          subtitle="Toggle between round-robin and key-based routing, then send messages"
        />
        <PartitionSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
