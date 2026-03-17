import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { ConsumerGroupSim } from '../simulations/ConsumerGroupSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'

export default function ConsumerGroups() {
  const controls = useSimulation(8)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 4 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          👥 Consumer Groups
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          A <strong className="text-[var(--text-1)]">consumer group</strong> is a set of consumers
          that cooperate to consume a topic. Kafka distributes the partitions across the group members,
          enabling parallel, scalable processing.
        </p>
      </div>

      {/* Static diagram */}
      <div className="mb-8">
        <SectionHeader title="One Topic, Multiple Groups" subtitle="Each group gets all messages independently" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 200" width="100%">
            <defs>
              <marker id="cg-sarr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--border)" />
              </marker>
            </defs>

            {/* Topic */}
            <rect x={270} y={70} width={160} height={60} rx={10}
              fill="var(--secondary)" opacity={0.12} stroke="var(--secondary)" strokeWidth={2} />
            <text x={350} y={98} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--secondary)" fontFamily="Inter">orders-topic</text>
            <text x={350} y={115} textAnchor="middle" fontSize={9}
              fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">3 partitions</text>

            {/* Group A */}
            <line x1={268} y1={90} x2={180} y2={60} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#cg-sarr)" opacity={0.5} />
            <rect x={20} y={40} width={160} height={44} rx={8}
              fill="var(--primary)" opacity={0.12} stroke="var(--primary)" strokeWidth={1.5} />
            <text x={100} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--primary)" fontFamily="Inter">Group: analytics</text>
            <text x={100} y={76} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="Inter">3 consumers</text>

            {/* Group B */}
            <line x1={268} y1={110} x2={180} y2={140} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#cg-sarr)" opacity={0.5} />
            <rect x={20} y={115} width={160} height={44} rx={8}
              fill="var(--success)" opacity={0.12} stroke="var(--success)" strokeWidth={1.5} />
            <text x={100} y={135} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--success)" fontFamily="Inter">Group: notifications</text>
            <text x={100} y={151} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="Inter">1 consumer</text>

            {/* Group C */}
            <line x1={432} y1={100} x2={520} y2={100} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#cg-sarr)" opacity={0.5} />
            <rect x={520} y={77} width={160} height={44} rx={8}
              fill="var(--accent)" opacity={0.12} stroke="var(--accent)" strokeWidth={1.5} />
            <text x={600} y={97} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--accent)" fontFamily="Inter">Group: billing</text>
            <text x={600} y={113} textAnchor="middle" fontSize={9} fill="var(--text-2)" fontFamily="Inter">2 consumers</text>

            <text x={350} y={190} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter">
              All groups independently consume the same topic
            </text>
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          Each partition is assigned to exactly one consumer per group.
          If you have 4 partitions and 2 consumers, each consumer handles 2 partitions.
          Add more consumers to scale horizontally — up to the number of partitions.
        </p>
        <p>
          When group membership changes (consumer joins or leaves), Kafka triggers a
          <strong className="text-[var(--text-1)]"> rebalance</strong> — reassigning partitions
          to the remaining members. During rebalancing, consumption pauses briefly.
        </p>
      </div>

      <ConceptCallout type="insight" title="The golden rule">
        #consumers ≤ #partitions for maximum efficiency. Extra consumers sit idle.
        Plan your partition count with your expected peak parallelism in mind.
      </ConceptCallout>

      <ConceptCallout type="warning" title="Stop-the-world rebalancing">
        Classic Kafka rebalancing (eager protocol) stops all consumers in the group briefly.
        Kafka 2.4+ supports cooperative incremental rebalancing, which only reassigns
        the affected partitions — no stop-the-world pause.
      </ConceptCallout>

      <div className="my-8 grid sm:grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="font-semibold text-[var(--text-1)] mb-2">Offset tracking per group</div>
          <p className="text-sm text-[var(--text-2)]">
            Each consumer group tracks its own offset position, stored in the internal
            <code className="font-mono text-xs mx-1 bg-[var(--border)] px-1 rounded">__consumer_offsets</code>
            topic. Groups are completely independent — one group being slow doesn't affect others.
          </p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="font-semibold text-[var(--text-1)] mb-2">Group coordinator</div>
          <p className="text-sm text-[var(--text-2)]">
            One broker acts as the group coordinator. It manages the group's lifecycle:
            member join/leave, offset commits, and partition assignment via the chosen
            assignor strategy (Range, RoundRobin, Sticky).
          </p>
        </div>
      </div>

      <CodeBlock label="Consumer group configuration">
{`Properties props = new Properties();
props.put("group.id", "analytics-group");
props.put("auto.offset.reset", "earliest");
props.put("enable.auto.commit", "false");  // manual commits
props.put("partition.assignment.strategy",
  "org.apache.kafka.clients.consumer.StickyAssignor");`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Consumer Group Rebalancing"
          subtitle="Add or remove consumers to see partition reassignment in action"
        />
        <ConsumerGroupSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
