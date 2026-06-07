export type IssueCategory =
  | 'Consumers'
  | 'Producers'
  | 'Replication'
  | 'Brokers'
  | 'Data Integrity'
  | 'Connectivity'

export type IssueSeverity = 'critical' | 'high' | 'medium'

export interface DebugIssue {
  id: string
  title: string
  category: IssueCategory
  severity: IssueSeverity
  /** What you observe in metrics/logs — markdown-lite (**bold**, `code`, \n). */
  symptoms: string
  /** Root causes, rendered as a bulleted list. */
  causes: string[]
  /** How to fix it now — markdown-lite. */
  fix: string
  /** How to stop it from recurring — markdown-lite. */
  prevention: string
  tags: string[]
  /** Slug of the most relevant concept page, e.g. '/replication-and-fault-tolerance'. */
  relatedConcept?: string
}

export const debuggingIssues: DebugIssue[] = [
  // ─── CONSUMERS ─────────────────────────────────────────────────────────────
  {
    id: 'consumer-lag-growing',
    title: 'Consumer lag keeps growing — consumers fall behind',
    category: 'Consumers',
    severity: 'high',
    symptoms:
      'The `records-lag-max` metric climbs steadily and `kafka-consumer-groups.sh --describe` shows a large and increasing **LAG** column. ' +
      'Messages are processed minutes or hours after they were produced; downstream data is stale.',
    causes: [
      'Consumer throughput is simply lower than producer throughput.',
      'Too few consumers or too few partitions — parallelism in a group is capped at the partition count.',
      'Slow per-record work: synchronous DB writes, external API calls, or heavy deserialization on the poll thread.',
      'Long GC pauses or under-provisioned consumer pods.',
      '`max.poll.records` too high, so each batch takes longer than expected to process.',
    ],
    fix:
      'Add consumers **up to** the number of partitions (extra consumers beyond that sit idle). ' +
      'If you are already at the partition count, increase partitions: `kafka-topics.sh --alter --topic t --partitions N`.\n' +
      'Move blocking I/O off the poll loop (batch DB writes, async calls) and lower `max.poll.records` so each loop finishes within `max.poll.interval.ms`.',
    prevention:
      'Alert on `records-lag-max` and on lag **trend**, not just absolute value (Burrow, kafka-lag-exporter, or Cruise Control). ' +
      'Capacity-plan partitions for peak throughput and load-test before launch.',
    tags: ['lag', 'scaling', 'throughput'],
    relatedConcept: '/consumer-groups',
  },
  {
    id: 'frequent-rebalances',
    title: 'Frequent / never-ending consumer group rebalances',
    category: 'Consumers',
    severity: 'high',
    symptoms:
      'Consumers repeatedly log "(Re-)joining group"; all processing in the group **stalls** during each rebalance; ' +
      'you see `RebalanceInProgress` and partitions bouncing between members.',
    causes: [
      'A batch takes longer than `max.poll.interval.ms` (default 5 min) between polls, so the broker assumes the consumer died.',
      '`session.timeout.ms` too low relative to `heartbeat.interval.ms`, or long GC pauses missing heartbeats.',
      'Pods being autoscaled / restarted frequently.',
      'The eager `RangeAssignor`/`RoundRobinAssignor` stops the whole group on every membership change.',
    ],
    fix:
      'Reduce `max.poll.records` or speed up processing so every loop polls in time; raise `max.poll.interval.ms` only if the work is legitimately long. ' +
      'Switch to the `CooperativeStickyAssignor` for incremental rebalancing, and use **static group membership** (`group.instance.id`) so a transient pod restart does not trigger a full reassignment.',
    prevention:
      'Keep the poll loop fast, pin stable pods with static membership, and monitor the rebalance rate as a first-class metric.',
    tags: ['rebalance', 'max.poll.interval.ms', 'static-membership'],
    relatedConcept: '/consumer-groups',
  },
  {
    id: 'commit-failed-exception',
    title: 'CommitFailedException when committing offsets',
    category: 'Consumers',
    severity: 'medium',
    symptoms:
      'Your consumer throws `CommitFailedException: Commit cannot be completed since the group has already rebalanced ' +
      'and assigned the partitions to another member`.',
    causes: [
      'The consumer fell out of the group (exceeded `max.poll.interval.ms`) before it committed.',
      'Another member already took over its partitions during a rebalance.',
      'Committing once after a very long, slow batch.',
    ],
    fix:
      'This is the same root cause as a rebalance: process faster, lower `max.poll.records`, or raise `max.poll.interval.ms`. ' +
      'Commit **incrementally** (every N records) instead of once at the end of a huge batch so a single slow record cannot invalidate the whole commit.',
    prevention:
      'Tune the poll loop and prefer smaller, more frequent commits. Treat repeated commit failures as a rebalance-storm signal.',
    tags: ['offsets', 'commit', 'rebalance'],
    relatedConcept: '/consumer-groups',
  },
  {
    id: 'offset-out-of-range',
    title: 'OffsetOutOfRangeException — consumer resets unexpectedly',
    category: 'Consumers',
    severity: 'medium',
    symptoms:
      '`OffsetOutOfRangeException` in logs; a consumer suddenly **reprocesses from the start** or **jumps to the end**, leaving a gap in processed data.',
    causes: [
      'The committed offset points to a segment already deleted by retention — the consumer was down longer than `retention.ms`.',
      '`auto.offset.reset` kicked in because no valid offset existed.',
      'The topic was deleted and recreated, resetting the log.',
    ],
    fix:
      'Set `auto.offset.reset` deliberately per use case: `earliest` to reprocess history, `latest` to skip the gap and resume live. ' +
      'For critical topics, raise `retention.ms` so a recovering consumer can still find its offset. ' +
      'If you need an exact position, reset explicitly: `kafka-consumer-groups.sh --reset-offsets --to-datetime ... --execute`.',
    prevention:
      'Keep retention longer than the maximum expected consumer downtime, and alert when a consumer group goes idle for too long.',
    tags: ['offsets', 'retention', 'auto.offset.reset'],
    relatedConcept: '/offsets-and-retention',
  },

  // ─── PRODUCERS ─────────────────────────────────────────────────────────────
  {
    id: 'producer-timeout-expiring',
    title: 'Producer TimeoutException — "Expiring N records"',
    category: 'Producers',
    severity: 'high',
    symptoms:
      '`TimeoutException: Expiring N record(s) for topic-partition: NNN ms has passed since batch creation`; ' +
      'produce latency spikes and send callbacks start failing.',
    causes: [
      'A partition leader is unavailable (broker down or mid-election) so the batch can never be acknowledged.',
      'Network saturation or an overloaded broker with a full request queue.',
      '`delivery.timeout.ms` / `request.timeout.ms` too low for the current load.',
      'Producer `buffer.memory` exhausted, blocking new sends.',
    ],
    fix:
      'Check broker health and the network **first** — this is usually a cluster problem, not a client bug. ' +
      'Increase `delivery.timeout.ms`, and batch more with `linger.ms` + `batch.size`. ' +
      'Keep `retries` high (it is effectively `MAX_INT` when `enable.idempotence=true`) and fix or fail over the slow partition leader.',
    prevention:
      'Monitor produce error rate and broker request latency; size `delivery.timeout.ms` for worst-case, and spread partition leadership evenly.',
    tags: ['producer', 'timeout', 'delivery.timeout.ms'],
    relatedConcept: '/producers-and-consumers',
  },
  {
    id: 'record-too-large',
    title: 'RecordTooLargeException — message rejected',
    category: 'Producers',
    severity: 'medium',
    symptoms:
      '`RecordTooLargeException: The message is N bytes when serialized which is larger than ...`; large payloads are rejected by the producer or broker, or a consumer cannot fetch them.',
    causes: [
      'Message exceeds the producer `max.request.size` (default ~1 MB).',
      'Message exceeds the topic/broker `max.message.bytes`.',
      'Consumer `max.partition.fetch.bytes` is smaller than the message, so it can never be read.',
    ],
    fix:
      'Raise the limits **together** so they stay consistent: `max.message.bytes` (topic/broker), `max.request.size` (producer), and `max.partition.fetch.bytes` / `fetch.max.bytes` (consumer). ' +
      'Or compress with `compression.type=lz4` / `zstd`. Best of all, keep large blobs in object storage (S3/GCS) and publish only a reference — the **claim-check** pattern.',
    prevention:
      'Cap payload size in the application and prefer references over embedding large binaries in Kafka.',
    tags: ['producer', 'message-size', 'claim-check'],
    relatedConcept: '/producers-and-consumers',
  },

  // ─── DATA INTEGRITY ────────────────────────────────────────────────────────
  {
    id: 'out-of-order-messages',
    title: 'Messages consumed out of order',
    category: 'Data Integrity',
    severity: 'high',
    symptoms:
      'Consumers observe events in the wrong sequence; state machines, aggregations, or "last write wins" logic produce corrupt results.',
    causes: [
      'Ordering is only guaranteed **within a partition** — related events landed on different partitions because of a missing or changing key.',
      'Retries with `max.in.flight.requests.per.connection > 1` and idempotence **disabled** can reorder a batch on retry.',
    ],
    fix:
      'Give related events a stable partition key (e.g. the entity id) so they share a partition and stay ordered. ' +
      'Enable `enable.idempotence=true`, which preserves order even with up to 5 in-flight requests. ' +
      'Never combine `retries` with `max.in.flight > 1` while idempotence is off.',
    prevention:
      'Design partition keys around your ordering requirements, and run the idempotent producer by default.',
    tags: ['ordering', 'partitioning', 'idempotence'],
    relatedConcept: '/topics-and-partitions',
  },
  {
    id: 'duplicate-messages',
    title: 'Duplicate messages processed',
    category: 'Data Integrity',
    severity: 'high',
    symptoms:
      'The same record is processed more than once — double charges, duplicate rows, or repeated side effects downstream.',
    causes: [
      'Default **at-least-once** delivery: the consumer crashed after processing but before committing its offset.',
      'The producer retried a send without idempotence, writing the record twice.',
      'A rebalance replayed records that were processed but not yet committed.',
    ],
    fix:
      'Enable the **idempotent producer** (`enable.idempotence=true`) to dedupe producer retries. ' +
      'Make consumers idempotent — dedupe by a business key or use upserts. ' +
      'For end-to-end exactly-once, use Kafka transactions (`transactional.id` + `isolation.level=read_committed`) or Kafka Streams EOS.',
    prevention:
      'Assume at-least-once and design idempotent consumers; reserve transactions for flows where duplicates are unacceptable.',
    tags: ['duplicates', 'exactly-once', 'idempotence'],
    relatedConcept: '/offsets-and-retention',
  },
  {
    id: 'data-loss-broker-failure',
    title: 'Data loss after a broker failure',
    category: 'Data Integrity',
    severity: 'critical',
    symptoms:
      'Messages that were acknowledged go **missing** after a broker crash or leader change; consumers see gaps in the log.',
    causes: [
      '`acks=0` or `acks=1` — the leader acknowledged but died before replicating to followers.',
      '`unclean.leader.election.enable=true` promoted an out-of-sync replica that was missing the latest records.',
      '`min.insync.replicas=1`, so a single-replica window lost data when that replica failed.',
    ],
    fix:
      'Set `acks=all` on producers, `min.insync.replicas=2` with replication factor **≥ 3**, and **disable** unclean leader election (`unclean.leader.election.enable=false`).',
    prevention:
      'Make durable settings the default (acks=all, RF=3, min.ISR=2, no unclean election) and spread replicas across racks / availability zones.',
    tags: ['data-loss', 'acks', 'durability'],
    relatedConcept: '/replication-and-fault-tolerance',
  },

  // ─── REPLICATION ───────────────────────────────────────────────────────────
  {
    id: 'under-replicated-partitions',
    title: 'Under-replicated partitions (URP)',
    category: 'Replication',
    severity: 'high',
    symptoms:
      'The `UnderReplicatedPartitions` metric is `> 0`; the ISR (in-sync replica) set is shrinking; alerts fire on `ReplicaManager`.',
    causes: [
      'A broker is down, so its replicas cannot stay in sync.',
      'A follower is too slow (disk or network saturated) and drops out of the ISR after `replica.lag.time.max.ms`.',
      'Uneven leadership load or a long GC pause on one broker.',
    ],
    fix:
      'Restart or replace the failed broker and confirm replicas rejoin the ISR. ' +
      'Investigate disk and network on the lagging broker. Rebalance leadership with preferred-replica election ' +
      '(`kafka-leader-election.sh --election-type PREFERRED`), and **throttle** any reassignment so it does not starve normal replication.',
    prevention:
      'Monitor URP and the ISR shrink/expand rate, keep capacity headroom, and use rack-aware replica placement.',
    tags: ['isr', 'replication', 'urp'],
    relatedConcept: '/replication-and-fault-tolerance',
  },
  {
    id: 'not-enough-replicas',
    title: 'NotEnoughReplicasException — producers blocked',
    category: 'Replication',
    severity: 'critical',
    symptoms:
      'Producers using `acks=all` fail with `NotEnoughReplicasException` or `NotEnoughReplicasAfterAppendException`; writes stop on some partitions.',
    causes: [
      'The live ISR dropped **below** `min.insync.replicas` — e.g. two brokers down with min.ISR=2 and RF=3.',
      'A partition is left with only its leader in sync.',
    ],
    fix:
      'The real fix is to bring the missing brokers/replicas back into the ISR. ' +
      'Only as an emergency, temporarily lower `min.insync.replicas` — knowing this weakens durability — to unblock writes, then restore it. ' +
      'Diagnose why followers fell out (disk, network, GC).',
    prevention:
      'Run RF ≥ 3 with `min.insync.replicas=2` so you can lose one broker and still accept writes. Never pair RF=2 with min.ISR=2.',
    tags: ['min.insync.replicas', 'isr', 'availability'],
    relatedConcept: '/replication-and-fault-tolerance',
  },

  // ─── BROKERS ───────────────────────────────────────────────────────────────
  {
    id: 'broker-disk-full',
    title: 'Broker disk full',
    category: 'Brokers',
    severity: 'critical',
    symptoms:
      'A broker stops accepting writes; logs show `KafkaStorageException` or `IOException: No space left on device`; the broker shuts down or marks log directories **offline**.',
    causes: [
      'Retention too long, or `log.retention.bytes` unset so partitions grow unbounded.',
      'A traffic spike, or a few very large partitions concentrated on one broker.',
      'Compaction backlog or leftover `.deleted` segments not yet cleaned.',
    ],
    fix:
      'Recover space fast: reduce `retention.ms` / `retention.bytes` on the largest topics so old segments roll off, or add disk capacity. ' +
      '**Never** hand-delete `.log` files from a running broker — corrupt the log and you lose the partition. Restart offline log dirs once space is back.',
    prevention:
      'Set size-based retention as a backstop, alert at ~70–75% disk, and balance partition count and size across brokers (Cruise Control).',
    tags: ['disk', 'retention', 'storage'],
    relatedConcept: '/offsets-and-retention',
  },
  {
    id: 'gc-pauses-isr-flapping',
    title: 'High broker GC pauses / ISR flapping',
    category: 'Brokers',
    severity: 'high',
    symptoms:
      'Periodic latency spikes; the ISR repeatedly shrinks then expands; request-queue time is high; ZooKeeper/controller session timeouts appear in logs.',
    causes: [
      'JVM heap too large or GC mis-tuned, causing long stop-the-world pauses.',
      'Too many partitions per broker — each adds memory, file handles, and replication overhead.',
      'CPU pressure from SSL termination or compression.',
      'An oversized heap starving the OS page cache that Kafka relies on.',
    ],
    fix:
      'Keep the broker heap modest (≈ 6 GB) and let the OS page cache do the heavy lifting; use G1GC with a sane pause-time target. ' +
      'Reduce partitions per broker, and profile CPU to confirm whether SSL or compression is the cost.',
    prevention:
      'Right-size the heap, cap partitions per broker (keep well under a few thousand), and track GC pause time as a key metric.',
    tags: ['jvm', 'gc', 'partitions'],
    relatedConcept: '/brokers-and-clusters',
  },
  {
    id: 'hot-partition-skew',
    title: 'Hot partition — skewed load on one broker',
    category: 'Brokers',
    severity: 'medium',
    symptoms:
      'One partition carries far more throughput and lag than its siblings; a single broker runs hotter than the rest; tail latency concentrates on one key.',
    causes: [
      'Skewed key distribution — low-cardinality or "celebrity" keys all hash to the same partition.',
      'A handful of keys dominate total volume.',
      'Uneven partition-to-broker assignment so one broker leads the busy partitions.',
    ],
    fix:
      'Pick a higher-cardinality or composite key; if strict per-key ordering is not required, add a salt to hot keys to spread them. ' +
      'Increase partitions and rebalance, and move leadership off the hot broker.',
    prevention:
      'Validate key distribution before launch and watch **per-partition** metrics, not just topic-level totals.',
    tags: ['partitioning', 'skew', 'hotspot'],
    relatedConcept: '/topics-and-partitions',
  },

  // ─── CONNECTIVITY ──────────────────────────────────────────────────────────
  {
    id: 'leader-not-available',
    title: 'LEADER_NOT_AVAILABLE — clients cannot connect',
    category: 'Connectivity',
    severity: 'medium',
    symptoms:
      'Clients get `LEADER_NOT_AVAILABLE` or `UnknownTopicOrPartition`; they reach the bootstrap server but then fail — often it works **inside** the cluster but not from outside (Docker, Kubernetes, or cloud).',
    causes: [
      'Misconfigured `advertised.listeners` — the broker advertises an address the client cannot resolve or route to.',
      'Transient right after topic creation while leader election is still in progress.',
      'DNS issues, or internal and external listeners mixed up.',
    ],
    fix:
      'Set `advertised.listeners` to an address reachable by the client network. ' +
      'Use separate internal/external listeners via `listeners` + `listener.security.protocol.map`. ' +
      'The just-after-create case is transient — clients retry and recover on their own.',
    prevention:
      'Get listener configuration right per environment and smoke-test connectivity from the actual client network, not just from a broker.',
    tags: ['advertised.listeners', 'networking', 'dns'],
    relatedConcept: '/brokers-and-clusters',
  },
]
