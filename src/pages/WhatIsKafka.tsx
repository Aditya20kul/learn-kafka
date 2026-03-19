import { PageWrapper } from '../components/layout/PageWrapper'
import { ConceptCallout } from '../components/shared/ConceptCallout'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CodeBlock } from '../components/ui/CodeBlock'
import { MessageFlowSim } from '../simulations/MessageFlowSim'
import { useSimulation } from '../hooks/useSimulation'
import { ConceptNav } from '../components/shared/ConceptNav'
import { messageFlowSteps } from '../data/simulationSteps'

export default function WhatIsKafka() {
  const controls = useSimulation(messageFlowSteps.length)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="text-sm text-[var(--text-2)] mb-2">Concept 1 of 7</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4">
          ⚡ What is Apache Kafka?
        </h1>
        <p className="text-lg text-[var(--text-2)] leading-relaxed">
          Apache Kafka is a distributed <strong className="text-[var(--text-1)]">event streaming platform</strong> —
          a high-throughput, fault-tolerant system for publishing and subscribing to streams of records,
          like a super-powered message queue.
        </p>
      </div>

      {/* Static diagram */}
      <div className="mb-8">
        <SectionHeader title="The Big Picture" subtitle="Kafka sits between your data producers and consumers" />
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 overflow-hidden">
          <svg viewBox="0 0 700 200" width="100%">
            <defs>
              <marker id="wik-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--border)" />
              </marker>
            </defs>
            {/* Producers */}
            {['Web App', 'Mobile', 'IoT Sensor'].map((label, i) => (
              <g key={label}>
                <rect x={20} y={30 + i * 55} width={110} height={40} rx={8}
                  fill="var(--primary)" opacity={0.15} stroke="var(--primary)" strokeWidth={1.5} />
                <text x={75} y={55 + i * 55} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="var(--primary)" fontFamily="Inter">{label}</text>
                <line x1={130} y1={50 + i * 55} x2={250} y2={95}
                  stroke="var(--border)" strokeWidth={1} markerEnd="url(#wik-arr)" opacity={0.5} />
              </g>
            ))}

            {/* Kafka */}
            <rect x={245} y={50} width={210} height={90} rx={14}
              fill="var(--primary)" opacity={0.12} stroke="var(--primary)" strokeWidth={2} />
            <text x={350} y={72} textAnchor="middle" fontSize={11} fill="var(--primary)">⚡</text>
            <text x={350} y={90} textAnchor="middle" fontSize={14} fontWeight={700}
              fill="var(--primary)" fontFamily="Inter, sans-serif">Apache Kafka</text>
            <text x={350} y={110} textAnchor="middle" fontSize={10}
              fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">Distributed Event Broker</text>
            <text x={350} y={127} textAnchor="middle" fontSize={9}
              fill="var(--text-2)" fontFamily="Inter">Topics · Partitions · Offsets</text>

            {/* Consumers */}
            {['Analytics', 'Database', 'Alerts'].map((label, i) => (
              <g key={label}>
                <line x1={455} y1={95} x2={570} y2={50 + i * 55}
                  stroke="var(--border)" strokeWidth={1} markerEnd="url(#wik-arr)" opacity={0.5} />
                <rect x={565} y={30 + i * 55} width={110} height={40} rx={8}
                  fill="var(--success)" opacity={0.15} stroke="var(--success)" strokeWidth={1.5} />
                <text x={620} y={55 + i * 55} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="var(--success)" fontFamily="Inter">{label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-4 text-[var(--text-2)] leading-relaxed mb-8">
        <p>
          Think of Kafka as a <strong className="text-[var(--text-1)]">persistent, distributed commit log</strong>.
          Every event — a user click, a purchase, a sensor reading — is appended to this log and can be
          read by any number of consumers, at any time, in any order.
        </p>
        <p>
          Unlike traditional message queues (like RabbitMQ), Kafka <strong className="text-[var(--text-1)]">retains messages</strong>
          {' '}for a configurable period. This means consumers can re-read history, replay events, and catch
          up at their own pace.
        </p>
      </div>

      <ConceptCallout type="insight" title="Key Insight: Kafka is a log, not a queue">
        Messages are never "consumed and deleted". They sit in the log until the retention period expires.
        Multiple consumers can independently read the same message — each tracks its own position (offset).
      </ConceptCallout>

      <ConceptCallout type="info" title="Real-world scale">
        LinkedIn (where Kafka was created) processes over 7 trillion messages per day.
        Kafka handles millions of events per second per broker, with sub-10ms latency.
      </ConceptCallout>

      {/* Key use cases */}
      <div className="my-8">
        <SectionHeader title="Why Use Kafka?" />
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: '📊', title: 'Real-time Analytics', desc: 'Stream user events to analytics dashboards with millisecond latency.' },
            { icon: '🔗', title: 'Microservice Integration', desc: 'Decouple services — producers and consumers evolve independently.' },
            { icon: '⏮️', title: 'Event Sourcing', desc: 'Use the log as the system of record. Replay to rebuild any state.' },
          ].map(item => (
            <div key={item.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-[var(--text-1)] text-sm mb-1">{item.title}</div>
              <div className="text-xs text-[var(--text-2)]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock label="Kafka in one line of config">
{`bootstrap.servers=kafka-broker-1:9092,kafka-broker-2:9092
topic=user-events
retention.ms=604800000  # 7 days`}
      </CodeBlock>

      {/* Simulation */}
      <div className="mt-10">
        <SectionHeader
          title="Interactive: Message Flow"
          subtitle="Watch a message travel from producer to consumer through Kafka"
        />
        <MessageFlowSim controls={controls} />
      </div>
      <ConceptNav />
    </PageWrapper>
  )
}
