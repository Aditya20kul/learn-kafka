import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { OffsetSim } from '../simulations/OffsetSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'
import { offsetSteps } from '../data/simulationSteps'

export default function OffsetsAndRetention() {
  const controls = useSimulation(offsetSteps.length)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 6 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          📍 Offsets & Retention
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          An <strong className="text-[var(--text-1)]">offset</strong> is a sequential integer that
          uniquely identifies each message in a partition. Consumers use offsets as bookmarks —
          committing them to track what's been processed.
        </p>
      </div>

      {/* Static offset diagram */}
      <div className="mb-8">
        <SectionHeader title="The Offset System" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 160" width="100%">
            <defs>
              <marker id="or-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--primary)" />
              </marker>
            </defs>

            {/* Partition log */}
            {[0, 1, 2, 3, 4, 5].map(o => {
              const isConsumed = o <= 3
              const isCommitted = o <= 2
              return (
                <g key={o}>
                  <rect x={40 + o * 100} y={40} width={90} height={50} rx={8}
                    fill={isConsumed ? (isCommitted ? 'var(--success)' : 'var(--secondary)') : 'var(--surface)'}
                    opacity={isConsumed ? 0.2 : 1}
                    stroke={isConsumed ? (isCommitted ? 'var(--success)' : 'var(--secondary)') : 'var(--border)'}
                    strokeWidth={1.5} />
                  <text x={85 + o * 100} y={60} textAnchor="middle" fontSize={9}
                    fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">offset:{o}</text>
                  <text x={85 + o * 100} y={78} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={isConsumed ? (isCommitted ? 'var(--success)' : 'var(--secondary)') : 'var(--text-1)'}
                    fontFamily="Inter">msg_{o}</text>
                  {isCommitted && (
                    <text x={85 + o * 100} y={105} textAnchor="middle" fontSize={8}
                      fill="var(--success)" fontFamily="Inter">✓</text>
                  )}
                </g>
              )
            })}

            {/* Consumer pointer */}
            <line x1={385} y1={100} x2={385} y2={120} stroke="var(--primary)" strokeWidth={2} />
            <polygon points="377,120 393,120 385,130" fill="var(--primary)" />
            <text x={385} y={148} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--primary)" fontFamily="JetBrains Mono, monospace">consumer @ 3</text>

            {/* Committed marker */}
            <line x1={285} y1={95} x2={285} y2={130} stroke="var(--success)" strokeWidth={2} strokeDasharray="4 3" />
            <text x={285} y={145} textAnchor="middle" fontSize={9}
              fill="var(--success)" fontFamily="JetBrains Mono, monospace">committed: 3</text>
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          Offsets are <strong className="text-[var(--text-1)]">per-partition, per-consumer-group</strong>.
          Each consumer group has its own offset position for every partition it consumes.
          Committing an offset tells Kafka "I've processed everything up to this point."
        </p>
        <p>
          If a consumer crashes and restarts, it resumes from its last committed offset —
          potentially re-processing some messages (at-least-once delivery semantics).
        </p>
      </div>

      <ConceptCallout type="insight" title="auto.offset.reset — what happens on first read">
        When a consumer group starts with no committed offset, <code>auto.offset.reset</code> controls behavior:
        <br /><strong>earliest</strong> — read from the beginning of the partition.
        <br /><strong>latest</strong> — only read new messages going forward.
      </ConceptCallout>

      <div className="my-8">
        <SectionHeader title="Retention Policies" subtitle="How long Kafka keeps your messages" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">⏱️ Time-based retention</div>
            <p className="text-sm text-[var(--text-2)] mb-3">
              Delete messages older than N milliseconds.
              Default: 7 days (<code className="font-mono text-xs bg-[var(--border)] px-1 rounded">retention.ms=604800000</code>).
            </p>
            <CodeBlock>{`log.retention.hours=168  # 7 days`}</CodeBlock>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">💾 Size-based retention</div>
            <p className="text-sm text-[var(--text-2)] mb-3">
              Delete oldest messages when partition exceeds N bytes.
              Useful for bounded disk usage.
            </p>
            <CodeBlock>{`log.retention.bytes=1073741824  # 1 GB`}</CodeBlock>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">🗜️ Log compaction</div>
            <p className="text-sm text-[var(--text-2)]">
              Instead of deleting by time, keep only the latest value per key.
              Perfect for change data capture and building materialized views.
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-1)] mb-2">♾️ Infinite retention</div>
            <p className="text-sm text-[var(--text-2)]">
              Set <code className="font-mono text-xs bg-[var(--border)] px-1 rounded">retention.ms=-1</code> to
              keep messages forever. Used for event sourcing where the log IS the truth.
            </p>
          </div>
        </div>
      </div>

      <ConceptCallout type="warning" title="Delivery semantics">
        <strong>At-most-once</strong>: commit before processing — may lose messages on crash.
        <br /><strong>At-least-once</strong>: commit after processing — may re-process on crash.
        <br /><strong>Exactly-once</strong>: requires Kafka transactions (idempotent producer + transactional consumer).
      </ConceptCallout>

      <CodeBlock label="Manual offset commit (at-least-once)">
{`ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
for (ConsumerRecord<String, String> record : records) {
    process(record);  // process first
}
consumer.commitSync();  // then commit — safe but slower`}
      </CodeBlock>

      <div className="mt-10">
        <SectionHeader
          title="Interactive: Offset Tracking"
          subtitle="Consume messages, commit an offset, then crash and watch the consumer rewind"
        />
        <OffsetSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
