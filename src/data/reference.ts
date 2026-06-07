// ─── CLI Commands ────────────────────────────────────────────────────────────
// Commands assume Kafka 3.x+ shell scripts and `--bootstrap-server localhost:9092`.

export type CliCategory = 'Topics' | 'Consumer Groups' | 'Produce & Consume' | 'Cluster & Configs'

export interface CliCommand {
  id: string
  category: CliCategory
  task: string
  command: string
  note?: string
}

export const cliCommands: CliCommand[] = [
  // Topics
  {
    id: 'topic-list',
    category: 'Topics',
    task: 'List all topics',
    command: 'kafka-topics.sh --bootstrap-server localhost:9092 --list',
  },
  {
    id: 'topic-describe',
    category: 'Topics',
    task: 'Describe a topic (partitions, leaders, ISR)',
    command: 'kafka-topics.sh --bootstrap-server localhost:9092 \\\n  --describe --topic orders',
  },
  {
    id: 'topic-create',
    category: 'Topics',
    task: 'Create a topic',
    command:
      'kafka-topics.sh --bootstrap-server localhost:9092 --create \\\n  --topic orders --partitions 6 --replication-factor 3',
  },
  {
    id: 'topic-add-partitions',
    category: 'Topics',
    task: 'Add partitions to a topic',
    command: 'kafka-topics.sh --bootstrap-server localhost:9092 \\\n  --alter --topic orders --partitions 12',
    note: 'You can only increase partitions, never decrease. This also remaps keys → partitions.',
  },
  {
    id: 'topic-under-replicated',
    category: 'Topics',
    task: 'Find under-replicated partitions',
    command:
      'kafka-topics.sh --bootstrap-server localhost:9092 \\\n  --describe --under-replicated-partitions',
    note: 'Empty output is healthy. Any rows mean a broker/replica is behind.',
  },
  {
    id: 'topic-delete',
    category: 'Topics',
    task: 'Delete a topic',
    command: 'kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic orders',
  },

  // Consumer Groups
  {
    id: 'group-list',
    category: 'Consumer Groups',
    task: 'List consumer groups',
    command: 'kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list',
  },
  {
    id: 'group-describe',
    category: 'Consumer Groups',
    task: 'Show a group’s lag per partition',
    command:
      'kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\\n  --describe --group billing',
    note: 'Read the LAG column = LOG-END-OFFSET − CURRENT-OFFSET. Growing lag = consumers falling behind.',
  },
  {
    id: 'group-reset-dry',
    category: 'Consumer Groups',
    task: 'Preview an offset reset (dry run)',
    command:
      'kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group billing \\\n  --topic orders --reset-offsets --to-earliest --dry-run',
    note: 'Always dry-run first. The group must be stopped (no active members) to reset.',
  },
  {
    id: 'group-reset-execute',
    category: 'Consumer Groups',
    task: 'Reset offsets to a point in time',
    command:
      'kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group billing \\\n  --topic orders --reset-offsets --to-datetime 2024-01-01T00:00:00.000 --execute',
  },
  {
    id: 'group-delete',
    category: 'Consumer Groups',
    task: 'Delete a consumer group',
    command: 'kafka-consumer-groups.sh --bootstrap-server localhost:9092 --delete --group billing',
  },

  // Produce & Consume
  {
    id: 'console-produce',
    category: 'Produce & Consume',
    task: 'Produce messages from the console',
    command: 'kafka-console-producer.sh --bootstrap-server localhost:9092 --topic orders',
    note: 'Type a message per line, Ctrl-D to finish.',
  },
  {
    id: 'console-produce-key',
    category: 'Produce & Consume',
    task: 'Produce keyed messages',
    command:
      'kafka-console-producer.sh --bootstrap-server localhost:9092 --topic orders \\\n  --property parse.key=true --property key.separator=:',
    note: 'Then type  user-42:{"amount":10}  — the key controls the partition.',
  },
  {
    id: 'console-consume',
    category: 'Produce & Consume',
    task: 'Consume from the beginning',
    command:
      'kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic orders --from-beginning',
  },
  {
    id: 'console-consume-keys',
    category: 'Produce & Consume',
    task: 'Consume showing keys + partitions',
    command:
      'kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic orders \\\n  --property print.key=true --property print.partition=true',
  },
  {
    id: 'get-offsets',
    category: 'Produce & Consume',
    task: 'Get earliest/latest offsets of a topic',
    command:
      'kafka-get-offsets.sh --bootstrap-server localhost:9092 --topic orders',
    note: 'On older clusters: kafka-run-class.sh kafka.tools.GetOffsetShell ...',
  },

  // Cluster & Configs
  {
    id: 'config-describe-topic',
    category: 'Cluster & Configs',
    task: 'Show a topic’s overridden configs',
    command:
      'kafka-configs.sh --bootstrap-server localhost:9092 --describe \\\n  --entity-type topics --entity-name orders',
  },
  {
    id: 'config-set-retention',
    category: 'Cluster & Configs',
    task: 'Change a topic config live (e.g. retention)',
    command:
      'kafka-configs.sh --bootstrap-server localhost:9092 --alter \\\n  --entity-type topics --entity-name orders \\\n  --add-config retention.ms=604800000',
    note: 'Live change, no restart. Lowering retention frees disk as old segments roll off.',
  },
  {
    id: 'leader-election',
    category: 'Cluster & Configs',
    task: 'Rebalance leadership (preferred election)',
    command:
      'kafka-leader-election.sh --bootstrap-server localhost:9092 \\\n  --election-type PREFERRED --all-topic-partitions',
    note: 'Use after a broker recovers to move leadership back off the survivors.',
  },
  {
    id: 'reassign',
    category: 'Cluster & Configs',
    task: 'Move partitions across brokers',
    command:
      'kafka-reassign-partitions.sh --bootstrap-server localhost:9092 \\\n  --reassignment-json-file plan.json --execute --throttle 50000000',
    note: 'Always --throttle so the reassignment doesn’t starve normal replication traffic.',
  },
]

// ─── Configuration Reference ─────────────────────────────────────────────────
// Defaults reflect Kafka 3.x.

export type ConfigScope = 'Producer' | 'Consumer' | 'Topic' | 'Broker'

export interface ConfigEntry {
  id: string
  scope: ConfigScope
  name: string
  default: string
  /** When/why to change it — markdown-lite (**bold**, `code`). */
  description: string
}

export const configReference: ConfigEntry[] = [
  // Producer
  {
    id: 'acks',
    scope: 'Producer',
    name: 'acks',
    default: 'all (≥3.0)',
    description:
      'How many replicas must ack a write. `all` waits for every in-sync replica — **no data loss** but slower. `1` = leader only (can lose data on failover); `0` = fire-and-forget.',
  },
  {
    id: 'enable-idempotence',
    scope: 'Producer',
    name: 'enable.idempotence',
    default: 'true (≥3.0)',
    description:
      'Dedupes producer retries and **preserves ordering** per partition. Keep it on; it is required for exactly-once and forces `acks=all`.',
  },
  {
    id: 'delivery-timeout',
    scope: 'Producer',
    name: 'delivery.timeout.ms',
    default: '120000',
    description:
      'Hard upper bound on time from `send()` to success or failure, across all retries. Raise it if you see `TimeoutException: Expiring records` under load.',
  },
  {
    id: 'linger-batch',
    scope: 'Producer',
    name: 'linger.ms / batch.size',
    default: '0 / 16384',
    description:
      'Batching knobs. Raise `linger.ms` to 5–100 ms and `batch.size` to trade a little latency for **much higher throughput** and better compression.',
  },
  {
    id: 'compression-type',
    scope: 'Producer',
    name: 'compression.type',
    default: 'none',
    description: 'Set `lz4` or `zstd` to cut network and disk usage — almost always worth it for text/JSON payloads.',
  },
  {
    id: 'max-request-size',
    scope: 'Producer',
    name: 'max.request.size',
    default: '1048576',
    description:
      'Largest record the producer will send (~1 MB). Raising it must be matched by the topic `max.message.bytes` and consumer fetch sizes.',
  },

  // Consumer
  {
    id: 'group-id',
    scope: 'Consumer',
    name: 'group.id',
    default: '(none)',
    description:
      'The consumer group. Members of one group **share** a topic’s partitions; different groups each get the full stream independently.',
  },
  {
    id: 'auto-offset-reset',
    scope: 'Consumer',
    name: 'auto.offset.reset',
    default: 'latest',
    description:
      'Where to start when there is no committed offset. `earliest` replays history, `latest` only reads new messages, `none` throws. Decide deliberately per use case.',
  },
  {
    id: 'enable-auto-commit',
    scope: 'Consumer',
    name: 'enable.auto.commit',
    default: 'true',
    description:
      'Auto-commits offsets on a timer. Set `false` and commit **after** processing for at-least-once control (avoids losing in-flight work on a crash).',
  },
  {
    id: 'max-poll-records',
    scope: 'Consumer',
    name: 'max.poll.records',
    default: '500',
    description:
      'Records returned per `poll()`. **Lower it** if processing a batch risks exceeding `max.poll.interval.ms` and triggering rebalances.',
  },
  {
    id: 'max-poll-interval',
    scope: 'Consumer',
    name: 'max.poll.interval.ms',
    default: '300000',
    description:
      'Max time allowed between polls before the broker assumes the consumer is dead and rebalances. The #1 cause of **rebalance storms** when processing is slow.',
  },
  {
    id: 'session-heartbeat',
    scope: 'Consumer',
    name: 'session.timeout.ms / heartbeat.interval.ms',
    default: '45000 / 3000',
    description:
      'Liveness detection for group membership. Keep heartbeat ≈ ⅓ of the session timeout. Too-low values cause false-dead rebalances during GC pauses.',
  },
  {
    id: 'assignment-strategy',
    scope: 'Consumer',
    name: 'partition.assignment.strategy',
    default: '[Range, CooperativeSticky]',
    description:
      'Prefer the `CooperativeStickyAssignor` for **incremental** rebalances — consumers keep most partitions instead of stopping the whole group.',
  },
  {
    id: 'isolation-level',
    scope: 'Consumer',
    name: 'isolation.level',
    default: 'read_uncommitted',
    description: 'Set `read_committed` to only see records from committed transactions (needed for exactly-once reads).',
  },

  // Topic
  {
    id: 'retention-ms',
    scope: 'Topic',
    name: 'retention.ms',
    default: '604800000',
    description: 'Time-based retention (7 days). `-1` keeps messages forever (event sourcing). The main lever for disk usage.',
  },
  {
    id: 'retention-bytes',
    scope: 'Topic',
    name: 'retention.bytes',
    default: '-1',
    description: 'Per-partition size cap (default unlimited). Set it as a **disk backstop** so a traffic spike can’t fill the broker.',
  },
  {
    id: 'cleanup-policy',
    scope: 'Topic',
    name: 'cleanup.policy',
    default: 'delete',
    description:
      '`delete` drops old segments by time/size. `compact` keeps only the **latest value per key** (changelogs, CDC). `compact,delete` does both.',
  },
  {
    id: 'min-insync-replicas',
    scope: 'Topic',
    name: 'min.insync.replicas',
    default: '1',
    description:
      'With `acks=all`, the minimum in-sync replicas required to accept a write. Set **2** with replication factor 3 to survive one broker loss without data loss.',
  },
  {
    id: 'max-message-bytes',
    scope: 'Topic',
    name: 'max.message.bytes',
    default: '1048588',
    description: 'Largest record the topic accepts (~1 MB). Must stay in sync with producer `max.request.size` and consumer fetch sizes.',
  },

  // Broker
  {
    id: 'unclean-leader',
    scope: 'Broker',
    name: 'unclean.leader.election.enable',
    default: 'false',
    description:
      'Keep it **false**. `true` lets an out-of-sync replica become leader to restore availability — at the cost of **silently losing** the most recent messages.',
  },
  {
    id: 'default-rf',
    scope: 'Broker',
    name: 'default.replication.factor',
    default: '1',
    description: 'Default RF for auto-created topics. Set **3** in production so every partition tolerates a broker failure.',
  },
  {
    id: 'num-partitions',
    scope: 'Broker',
    name: 'num.partitions',
    default: '1',
    description: 'Default partition count for auto-created topics. Partitions set the **max consumer parallelism**, so size for peak throughput.',
  },
  {
    id: 'auto-create-topics',
    scope: 'Broker',
    name: 'auto.create.topics.enable',
    default: 'true',
    description: 'Disable in production so a typo’d topic name doesn’t silently create a 1-partition, RF-1 topic.',
  },
  {
    id: 'replica-lag-time',
    scope: 'Broker',
    name: 'replica.lag.time.max.ms',
    default: '30000',
    description: 'How long a follower can fail to fetch before it’s dropped from the ISR. Lower = stricter ISR, more sensitive to brief slowness.',
  },
  {
    id: 'log-retention-hours',
    scope: 'Broker',
    name: 'log.retention.hours',
    default: '168',
    description: 'Cluster-wide default retention (7 days) for topics without their own `retention.ms` override.',
  },
]
