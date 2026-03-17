import { useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { MessageFlowSim } from '../simulations/MessageFlowSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'
import { messageFlowSteps } from '../data/simulationSteps'

type AcksMode = 0 | 1 | 'all'

export default function ProducersAndConsumers() {
  const [acks, setAcks] = useState<AcksMode>(1)
  const controls = useSimulation(messageFlowSteps.length)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 3 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          🔄 Producers & Consumers
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          <strong className="text-[var(--text-1)]">Producers</strong> write messages to Kafka topics.
          <strong className="text-[var(--text-1)]"> Consumers</strong> read from them.
          These two roles are completely decoupled — producers don't know or care who reads their messages.
        </p>
      </div>

      {/* Static producer/consumer diagram */}
      <div className="mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 160" width="100%">
            <defs>
              <marker id="pc-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--border)" />
              </marker>
            </defs>
            {/* Producer side */}
            <text x={110} y={20} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter" fontWeight={600}>PRODUCERS</text>
            {['Service A', 'Service B'].map((s, i) => (
              <g key={s}>
                <rect x={30} y={28 + i * 55} width={160} height={40} rx={8}
                  fill="var(--primary)" opacity={0.12} stroke="var(--primary)" strokeWidth={1.5} />
                <text x={110} y={53 + i * 55} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="var(--primary)" fontFamily="Inter">{s}</text>
                <line x1={190} y1={48 + i * 55} x2={290} y2={75}
                  stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#pc-arr)" opacity={0.5} />
              </g>
            ))}

            {/* Topic */}
            <rect x={280} y={45} width={140} height={60} rx={10}
              fill="var(--secondary)" opacity={0.12} stroke="var(--secondary)" strokeWidth={2} />
            <text x={350} y={73} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--secondary)" fontFamily="Inter">Topic</text>
            <text x={350} y={90} textAnchor="middle" fontSize={9}
              fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">P0 P1 P2</text>
            <line x1={420} y1={65} x2={510} y2={45}
              stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#pc-arr)" opacity={0.5} />
            <line x1={420} y1={85} x2={510} y2={105}
              stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#pc-arr)" opacity={0.5} />

            {/* Consumer side */}
            <text x={590} y={20} textAnchor="middle" fontSize={10} fill="var(--text-2)" fontFamily="Inter" fontWeight={600}>CONSUMERS</text>
            {['Analytics DB', 'Alert Service'].map((s, i) => (
              <g key={s}>
                <rect x={505} y={28 + i * 67} width={170} height={40} rx={8}
                  fill="var(--success)" opacity={0.12} stroke="var(--success)" strokeWidth={1.5} />
                <text x={590} y={53 + i * 67} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="var(--success)" fontFamily="Inter">{s}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-[var(--text-1)] mb-3">Producers</h3>
          <div className="space-y-2 text-sm text-[var(--text-2)]">
            <p>• Push messages into Kafka topics</p>
            <p>• Choose partition via key or round-robin</p>
            <p>• Configure durability with <code className="font-mono text-xs bg-[var(--border)] px-1 rounded">acks</code></p>
            <p>• Can batch messages for higher throughput</p>
            <p>• Fully async by default</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-1)] mb-3">Consumers</h3>
          <div className="space-y-2 text-sm text-[var(--text-2)]">
            <p>• Pull messages by polling the broker</p>
            <p>• Track position with <strong>offsets</strong></p>
            <p>• Can replay from any offset</p>
            <p>• Belong to a <strong>consumer group</strong></p>
            <p>• Commit offsets to track progress</p>
          </div>
        </div>
      </div>

      <ConceptCallout type="insight" title="Pull, not push">
        Consumers poll Kafka at their own pace. This means a slow consumer won't crash Kafka —
        it just falls behind. You can catch up later (as long as messages are within retention).
      </ConceptCallout>

      <div className="my-8">
        <SectionHeader title="Producer Acknowledgment Modes" subtitle="The acks setting controls the durability vs. latency tradeoff" />
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { acks: '0', title: 'acks=0 (Fire & Forget)', color: 'var(--danger)', desc: 'Producer doesn\'t wait for any ack. Fastest, but data can be lost if broker crashes.' },
            { acks: '1', title: 'acks=1 (Leader Ack)', color: 'var(--accent)', desc: 'Leader broker acknowledges after writing. Fast, but data can be lost if leader fails before replication.' },
            { acks: '"all"', title: 'acks=all (Full ISR)', color: 'var(--success)', desc: 'All in-sync replicas must acknowledge. Slowest, but fully durable — no data loss on any failure.' },
          ].map(item => (
            <div key={item.acks} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
              style={{ borderColor: item.color + '40' }}>
              <code className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: item.color + '20', color: item.color }}>
                {item.acks}
              </code>
              <div className="font-semibold text-[var(--text-1)] text-sm mt-2 mb-1">{item.title}</div>
              <p className="text-xs text-[var(--text-2)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock label="Producer configuration">
{`Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("acks", "all");          // durability
props.put("retries", 3);
props.put("batch.size", 16384);    // batch for throughput
props.put("linger.ms", 5);         // wait 5ms to fill batch`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Message Flow with acks"
          subtitle="Change the acks mode and observe the difference in acknowledgment flow"
        />
        {/* Acks selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-[var(--text-2)]">acks =</span>
          {([0, 1, 'all'] as AcksMode[]).map(a => (
            <button
              key={String(a)}
              onClick={() => { setAcks(a); controls.reset() }}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${
                acks === a
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-2)] border border-[var(--border)] hover:text-[var(--text-1)]'
              }`}
            >
              {String(a)}
            </button>
          ))}
        </div>
        <MessageFlowSim controls={controls} acksMode={acks} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
