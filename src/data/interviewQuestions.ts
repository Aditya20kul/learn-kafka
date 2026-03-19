export interface InterviewQuestion {
  id: string
  level: 'easy' | 'medium' | 'hard'
  type: 'conceptual' | 'scenario'
  question: string
  answer: string
  tags: string[]
}

export const interviewQuestions: InterviewQuestion[] = [
  // ─── EASY ────────────────────────────────────────────────────────────────
  {
    id: 'e1',
    level: 'easy',
    type: 'conceptual',
    question: 'What is Apache Kafka and what problem does it solve?',
    answer:
      'Apache Kafka is a **distributed event streaming platform** designed for high-throughput, fault-tolerant publish-subscribe messaging.\n\n' +
      'It solves the problem of **point-to-point integration explosion**: without Kafka, every producer must directly connect to every consumer. With Kafka, producers write to topics and any number of consumers read independently — decoupling systems and enabling real-time data pipelines.\n\n' +
      'Key properties: persistent (messages are stored on disk), ordered within a partition, horizontally scalable, and fault-tolerant.',
    tags: ['fundamentals', 'architecture'],
  },
  {
    id: 'e2',
    level: 'easy',
    type: 'conceptual',
    question: 'What is a topic and how is it different from a traditional message queue?',
    answer:
      'A **topic** is a named, append-only log of events. Producers write to it; consumers read from it.\n\n' +
      '**Key differences from a traditional queue:**\n' +
      '- **Retention**: Messages are *not deleted after consumption* — they stay for a configurable period (e.g., 7 days).\n' +
      '- **Multiple consumers**: Many independent consumer groups can read the same topic simultaneously, each at its own pace.\n' +
      '- **Replay**: Consumers can seek backward and re-read past messages.\n' +
      '- **Ordering**: Kafka guarantees ordering *within* a partition; queues typically guarantee FIFO globally.',
    tags: ['topics', 'fundamentals'],
  },
  {
    id: 'e3',
    level: 'easy',
    type: 'conceptual',
    question: 'What is a partition and why does it matter?',
    answer:
      'A **partition** is a subdivision of a topic — an ordered, immutable sequence of records stored on a single broker.\n\n' +
      '**Why it matters:**\n' +
      '- **Parallelism**: Multiple consumers in a group can each read from a different partition simultaneously.\n' +
      '- **Scalability**: Data is distributed across brokers; more partitions = more throughput.\n' +
      '- **Ordering**: Kafka only guarantees ordering *within* a partition, not across partitions.\n\n' +
      'Each message in a partition has a unique, monotonically increasing **offset**.',
    tags: ['partitions', 'scalability'],
  },
  {
    id: 'e4',
    level: 'easy',
    type: 'conceptual',
    question: 'What is an offset?',
    answer:
      'An **offset** is a sequential integer that uniquely identifies each message within a partition (0, 1, 2, …).\n\n' +
      'Offsets serve two purposes:\n' +
      '1. **Position tracking**: Each consumer group tracks its *committed offset* per partition — the position up to which messages have been successfully processed.\n' +
      '2. **Replay**: Consumers can seek to any offset to re-read historical data.\n\n' +
      'Offsets are scoped to a topic-partition — the same offset 42 can exist in both partition-0 and partition-1.',
    tags: ['offsets', 'consumers'],
  },
  {
    id: 'e5',
    level: 'easy',
    type: 'conceptual',
    question: "What's the difference between a producer and a consumer?",
    answer:
      '**Producer**: Writes (publishes) messages to a Kafka topic. Producers choose which topic (and optionally which partition) to send to. They receive acknowledgment based on the `acks` setting.\n\n' +
      '**Consumer**: Reads (subscribes to) messages from a topic. Consumers track their own position using offsets and pull messages at their own rate — Kafka never pushes.\n\n' +
      '**Key asymmetry**: Producers push data; consumers pull. This lets consumers process at their own speed without overwhelming them.',
    tags: ['producers', 'consumers', 'fundamentals'],
  },
  {
    id: 'e6',
    level: 'easy',
    type: 'scenario',
    question:
      'Your service needs to emit user-activity events to three downstream systems: analytics, notifications, and an audit log. All three need every event. How would you model this in Kafka?',
    answer:
      'Create a **single topic** (e.g., `user-activity`) and set up **three separate consumer groups**: one for analytics, one for notifications, one for audit.\n\n' +
      '**Why this works:**\n' +
      '- Each consumer group maintains its own independent offset — all three receive every event.\n' +
      '- Producers only need one destination. Adding a fourth consumer later requires zero producer changes.\n' +
      '- Consumer groups are isolated: a slow audit consumer does not block the notifications consumer.\n\n' +
      '**Anti-pattern to avoid**: Do *not* create three separate topics and have the producer fan-out manually — that couples the producer to downstream consumers and creates operational overhead.',
    tags: ['consumer-groups', 'architecture', 'topics'],
  },
  {
    id: 'e7',
    level: 'easy',
    type: 'conceptual',
    question: 'What is a consumer group?',
    answer:
      'A **consumer group** is a set of consumers that cooperate to consume a topic. Kafka distributes partitions across group members — each partition is assigned to exactly one consumer in the group at a time.\n\n' +
      '**Key properties:**\n' +
      '- **Parallel consumption**: With N partitions and N consumers, each consumer handles one partition.\n' +
      '- **Fault tolerance**: If a consumer dies, its partitions are rebalanced to surviving members.\n' +
      '- **Independent groups**: Multiple groups can consume the same topic independently (each gets all messages).\n\n' +
      'The group coordinator broker tracks offsets on behalf of the group in the `__consumer_offsets` internal topic.',
    tags: ['consumer-groups', 'fundamentals'],
  },
  {
    id: 'e8',
    level: 'easy',
    type: 'scenario',
    question:
      'Your new Kafka topic has 1 partition and a single consumer. Traffic doubles. Consumer lag starts climbing. What is wrong and how do you fix it?',
    answer:
      '**Root cause**: A single partition can only be consumed by one consumer at a time within a group. Adding more consumers does nothing — they will be idle. The bottleneck is the partition count.\n\n' +
      '**Fix:**\n' +
      '1. **Increase the partition count** on the topic (e.g., from 1 to 4 or 8).\n' +
      '2. **Scale up the consumer group** to match the new partition count.\n\n' +
      '**Caveats:**\n' +
      '- Increasing partitions on a live topic is safe for throughput, but breaks key-based ordering for messages that were previously in the single partition.\n' +
      '- Consumers must be idempotent if you replay or rebalance.\n' +
      '- Consider whether the consumer processing logic itself is the bottleneck (slow DB writes, etc.) before adding partitions.',
    tags: ['partitions', 'scalability', 'consumer-lag'],
  },

  {
    id: 'e_s1',
    level: 'easy',
    type: 'scenario',
    question:
      'A developer wants to test a new version of a consumer that processes messages differently, without affecting the production consumer. Both need to read all messages. What is the simplest way to do this?',
    answer:
      'Create a **new consumer group** for the test consumer.\n\n' +
      'Each consumer group maintains its own independent offset pointer. As long as the test consumer uses a different `group.id`, Kafka will deliver every message to both groups independently — the production consumer is completely unaffected.\n\n' +
      '**Steps:**\n' +
      '1. Set `group.id=my-service-test-v2` (or any name not in use) on the test consumer.\n' +
      '2. Set `auto.offset.reset=earliest` if you want to read existing messages from the beginning.\n' +
      '3. Run the test consumer — it reads all messages independently.\n\n' +
      '**Key insight:** Consumer groups are the isolation boundary in Kafka. This is one of the biggest advantages Kafka has over traditional queues, where consuming a message removes it for everyone.',
    tags: ['consumer-groups', 'fundamentals', 'testing'],
  },
  {
    id: 'e_s2',
    level: 'easy',
    type: 'scenario',
    question:
      'A new analytics service needs to replay all events from the past 5 days from a topic with 30-day retention. The service has never consumed this topic before. How do you configure it?',
    answer:
      'Set `auto.offset.reset=earliest` on the new consumer.\n\n' +
      '**How it works:**\n' +
      '- `auto.offset.reset` controls where a consumer starts when **no committed offset exists** for its group.\n' +
      '- `earliest` → start from the oldest available message (the beginning of retention).\n' +
      '- `latest` (the default) → start from new messages only, skipping existing ones.\n\n' +
      'Since this is a brand-new consumer group, there is no prior committed offset. With `auto.offset.reset=earliest`, it will start from the oldest retained message and work forward.\n\n' +
      '**If you need to replay from a specific point in time** (not just the beginning), use `KafkaConsumer.offsetsForTimes()` to find the offset closest to your target timestamp, then call `seek()` to that offset before polling.',
    tags: ['consumers', 'offsets', 'retention', 'replay'],
  },
  {
    id: 'e_s3',
    level: 'easy',
    type: 'scenario',
    question:
      'Your producer sends 1,000 messages but monitoring shows only ~800 are being received by consumers. No exceptions are thrown. What is the most likely cause?',
    answer:
      '**Most likely cause: `acks=0` (fire-and-forget).**\n\n' +
      'With `acks=0`, the producer does not wait for any acknowledgment from the broker. If a broker is temporarily unavailable, experiences a leader election, or the network drops a packet, messages are silently lost — no exception is raised on the producer side.\n\n' +
      '**How to fix:**\n' +
      '- Set `acks=1` (leader acknowledges) or `acks=all` (all ISR members acknowledge).\n' +
      '- Set `retries` to a non-zero value so transient failures are retried.\n' +
      '- Set `enable.idempotence=true` to prevent duplicates from retries.\n\n' +
      '**Other things to check:**\n' +
      '- Is the topic under-replicated? A partition with no leader will silently drop writes if `acks=0`.\n' +
      '- Is the producer\'s internal send buffer full? `buffer.memory` exhaustion with `block.on.buffer.full=false` also silently drops messages.',
    tags: ['producers', 'durability', 'acks', 'troubleshooting'],
  },
  {
    id: 'e_s4',
    level: 'easy',
    type: 'scenario',
    question:
      'You have a consumer that processes each message by calling a slow external API (avg 2 seconds per message). The consumer keeps getting removed from its group. What is happening and what are your options?',
    answer:
      '**What is happening:** The consumer is exceeding `max.poll.interval.ms` (default 5 minutes if processing many messages, but easily exceeded with slow APIs).\n\n' +
      'Kafka\'s consumer sends heartbeats on a background thread, but the group coordinator also requires that `poll()` be called regularly. If the time between two `poll()` calls exceeds `max.poll.interval.ms`, Kafka considers the consumer dead and triggers a rebalance.\n\n' +
      '**Options:**\n' +
      '1. **Reduce `max.poll.records`**: Fetch fewer messages per `poll()` call (e.g., set it to 1 or 10) so each batch finishes processing quickly before the next `poll()`.\n' +
      '2. **Increase `max.poll.interval.ms`**: Give the consumer more time between polls. Raises the failure detection delay as a side effect.\n' +
      '3. **Async processing**: Dispatch API calls to a thread pool, `poll()` immediately after dispatching, and commit offsets only after the thread pool confirms completion.\n' +
      '4. **Batch the external API calls**: If the API supports batch requests, reduce the number of calls per poll cycle.',
    tags: ['consumers', 'rebalancing', 'performance', 'troubleshooting'],
  },
  {
    id: 'e_s5',
    level: 'easy',
    type: 'scenario',
    question:
      'Producers write messages with `null` keys to a topic with 4 partitions. How are messages distributed across partitions, and what is the downside?',
    answer:
      '**Distribution with null keys:** When no key is provided, Kafka\'s default partitioner uses a **sticky partitioning** strategy (Kafka 2.4+): it fills one partition\'s batch before moving to the next. In older versions, it round-robins per message. Either way, messages spread roughly evenly across all partitions over time.\n\n' +
      '**The downside — no ordering guarantee:**\n' +
      'With null keys, related messages can land on any partition. If you have events for the same user, order, or entity, they may be scattered across multiple partitions and consumed in any order.\n\n' +
      '**When null keys are fine:** Append-only log data, metrics, and events where ordering between records is not required (e.g., website click events where each click is independent).\n\n' +
      '**When to use a key:** Any time you need all events for the same entity (user ID, order ID) to be processed in order — use that entity ID as the key.',
    tags: ['producers', 'partitions', 'keys', 'ordering'],
  },

  // ─── MEDIUM ───────────────────────────────────────────────────────────────
  {
    id: 'm1',
    level: 'medium',
    type: 'scenario',
    question:
      'Your topic has 6 partitions and your consumer group has 8 consumers. What happens to the extra 2 consumers?',
    answer:
      'The **2 extra consumers sit idle**. Kafka assigns at most one consumer per partition within a group. With 6 partitions and 8 consumers, 6 consumers each get one partition and 2 consumers receive no partitions.\n\n' +
      '**Why this is still useful:** The idle consumers act as hot standbys. If one of the active 6 consumers fails, Kafka rebalances and one of the idle consumers immediately takes over — reducing recovery time.\n\n' +
      '**Rule of thumb:** `effective_parallelism = min(partition_count, consumer_count)`. Never add consumers beyond the partition count expecting more throughput.',
    tags: ['consumer-groups', 'partitions', 'rebalancing'],
  },
  {
    id: 'm2',
    level: 'medium',
    type: 'conceptual',
    question: 'What is the ISR (In-Sync Replicas) and why does it matter?',
    answer:
      'The **ISR** (In-Sync Replicas) is the set of partition replicas that are fully caught up with the partition leader. A replica is in-sync if it has fetched all messages within `replica.lag.time.max.ms`.\n\n' +
      '**Why it matters:**\n' +
      '- With `acks=all`, the producer waits for acknowledgment from **all ISR members** before the write is considered durable.\n' +
      '- `min.insync.replicas` (default 1) sets the minimum ISR size. If ISR falls below this, the partition rejects writes — preventing data loss at the cost of availability.\n' +
      '- If a follower falls behind (e.g., network issue), it is removed from the ISR. Once it catches up, it rejoins.\n\n' +
      'A leader can only be elected from the ISR, ensuring no data loss during failover.',
    tags: ['replication', 'ISR', 'durability'],
  },
  {
    id: 'm3',
    level: 'medium',
    type: 'scenario',
    question:
      'You are using `auto.offset.reset=latest` and `enable.auto.commit=true`, but you are seeing duplicate messages after consumer restarts. Why?',
    answer:
      '**Root cause: At-least-once delivery from auto-commit timing.**\n\n' +
      '`enable.auto.commit=true` commits offsets on a background timer (default every 5 seconds via `auto.commit.interval.ms`). If the consumer processes messages but crashes *before* the next auto-commit, those messages will be redelivered on restart — causing duplicates.\n\n' +
      '**Solutions:**\n' +
      '1. **Manual commit after processing**: Set `enable.auto.commit=false` and call `commitSync()` or `commitAsync()` after each batch is fully processed.\n' +
      '2. **Idempotent consumers**: Design your downstream writes to tolerate duplicates (e.g., upsert by message ID rather than blind insert).\n' +
      '3. **Transactional producers + consumers** (`isolation.level=read_committed`) for exactly-once semantics.\n\n' +
      '`auto.offset.reset` only controls where to start when *no* committed offset exists — it is unrelated to this problem.',
    tags: ['offsets', 'consumers', 'at-least-once', 'duplicates'],
  },
  {
    id: 'm4',
    level: 'medium',
    type: 'scenario',
    question:
      'Orders must be processed in the exact sequence per customer. How do you ensure ordering with Kafka?',
    answer:
      'Kafka only guarantees ordering **within a single partition**. To enforce per-customer ordering:\n\n' +
      '1. **Use the customer ID as the message key.** Kafka hashes the key and routes all messages with the same key to the same partition — guaranteeing that all events for a given customer land in the same partition and are consumed in order.\n\n' +
      '2. **Assign one consumer per partition** in your consumer group (or ensure your consumer processes each partition sequentially).\n\n' +
      '**Pitfalls to avoid:**\n' +
      '- Do *not* use null keys — messages will round-robin across partitions, breaking ordering.\n' +
      '- If you increase partition count, the key-to-partition mapping changes. Existing in-flight messages and new messages may now route differently. Plan migrations carefully.\n' +
      '- If a single consumer handles multiple partitions, ensure you do not process messages from different partitions concurrently for the same customer.',
    tags: ['ordering', 'partitions', 'producers', 'keys'],
  },
  {
    id: 'm5',
    level: 'medium',
    type: 'scenario',
    question:
      'Consumer lag is growing on one partition but not others. Walk through your diagnosis.',
    answer:
      '**Step 1 — Confirm the symptom.** Use `kafka-consumer-groups.sh --describe` to see per-partition lag. Confirm lag is isolated to one partition.\n\n' +
      '**Step 2 — Check the assigned consumer.** The consumer assigned to the lagging partition may be slow. Look for: high CPU/memory, slow downstream (DB writes, HTTP calls), or the consumer in a tight loop throwing and swallowing exceptions.\n\n' +
      '**Step 3 — Check message characteristics.** Is the lagging partition receiving disproportionate traffic (a hot partition)? Use `kafka-log-dirs.sh` to compare partition sizes.\n\n' +
      '**Step 4 — Check the leader broker.** Is the broker hosting that partition\'s leader under disk or network pressure?\n\n' +
      '**Fixes:**\n' +
      '- Slow consumer logic → optimize processing, add async I/O, or scale out consumer group.\n' +
      '- Hot partition → fix key distribution (avoid high-cardinality skew or null keys).\n' +
      '- Broker saturation → rebalance partition leadership across brokers.',
    tags: ['consumer-lag', 'monitoring', 'partitions', 'troubleshooting'],
  },
  {
    id: 'm6',
    level: 'medium',
    type: 'conceptual',
    question: 'What is log compaction? When would you choose it over time-based retention?',
    answer:
      '**Log compaction** retains the *latest* message for each unique key, discarding earlier values for the same key. The log is compacted in the background by the cleaner thread.\n\n' +
      '**Use log compaction when** your topic represents current state per entity — e.g., a user profile, a device shadow, an account balance. You want consumers to be able to read the full current state even after a long outage, without replaying years of history.\n\n' +
      '**Use time-based retention when** messages are events (immutable facts): click streams, order events, logs. You care about the history of events, not just the latest state.\n\n' +
      '**Key detail:** Compaction does *not* guarantee immediate removal — a compaction lag window exists. You can combine both: `cleanup.policy=compact,delete` to compact old records but still expire very old data.',
    tags: ['retention', 'log-compaction', 'topics'],
  },
  {
    id: 'm7',
    level: 'medium',
    type: 'scenario',
    question:
      'A new downstream service needs to rebuild its entire state from a Kafka topic with 7-day retention. The service was down for 10 days. What is the risk and what are your options?',
    answer:
      '**Risk:** The first 3 days of events have been deleted by the 7-day retention policy. The service cannot reconstruct full state from Kafka alone — it will have a **3-day gap** at the beginning of history.\n\n' +
      '**Options:**\n' +
      '1. **Snapshot + replay hybrid**: Use a database snapshot from day 0 (or the oldest available snapshot) to seed the service\'s state, then replay from the earliest available Kafka offset on top of that snapshot.\n' +
      '2. **Increase retention**: Extend `retention.ms` on the topic going forward to prevent this in future outages.\n' +
      '3. **Log-compacted topic**: If the topic uses compaction (not time retention), the latest value per key is always available regardless of age. Consider compaction for event-sourced state topics.\n' +
      '4. **External event store**: Persist all raw events to S3/GCS via Kafka Connect for indefinite replay beyond Kafka retention.\n\n' +
      'Lesson: Kafka retention is a **sliding window**, not an archive. Design rebuild paths accordingly.',
    tags: ['retention', 'consumers', 'architecture', 'event-sourcing'],
  },
  {
    id: 'm8',
    level: 'medium',
    type: 'conceptual',
    question: 'What is the difference between `acks=1` and `acks=all`?',
    answer:
      '**`acks=1`** (default): The producer waits for acknowledgment from the **partition leader only**. The write is considered successful as soon as the leader appends it to its log — before followers have replicated it. If the leader crashes immediately after, the message may be lost.\n\n' +
      '**`acks=all`** (or `acks=-1`): The producer waits for acknowledgment from the **leader + all in-sync replicas (ISR)**. The write is only confirmed once all ISR members have persisted it. Combined with `min.insync.replicas=2`, this prevents data loss at the cost of higher latency.\n\n' +
      '**Trade-off summary:**\n' +
      '- `acks=0` — fire and forget. No durability guarantee, lowest latency.\n' +
      '- `acks=1` — leader-durable. Good throughput, risk of loss on leader failure.\n' +
      '- `acks=all` — fully durable. Highest latency, required for critical data.',
    tags: ['producers', 'replication', 'durability', 'acks'],
  },
  {
    id: 'm9',
    level: 'medium',
    type: 'scenario',
    question:
      'You need to guarantee a message is processed exactly once end-to-end. What Kafka features make this possible and what are the trade-offs?',
    answer:
      'Kafka\'s **exactly-once semantics (EOS)** requires three components working together:\n\n' +
      '1. **Idempotent producer** (`enable.idempotence=true`): Each producer gets a producer ID + sequence number. The broker deduplicates retried messages within a session.\n' +
      '2. **Transactional producer** (`transactional.id=<unique-id>`): Groups writes across multiple partitions/topics into an atomic transaction. Either all writes commit or all are aborted.\n' +
      '3. **`isolation.level=read_committed`** on consumers: Consumers only see committed transactions, ignoring in-flight or aborted messages.\n\n' +
      '**Trade-offs:**\n' +
      '- **Throughput**: ~20-30% throughput reduction due to coordination overhead.\n' +
      '- **Latency**: `read_committed` consumers wait for the transaction to commit before seeing messages.\n' +
      '- **Complexity**: Requires careful transactional ID management and failure handling.\n' +
      '- **Scope**: EOS is only guaranteed *within Kafka*. Side effects outside Kafka (e.g., HTTP calls, DB writes) require idempotent external operations.',
    tags: ['exactly-once', 'producers', 'transactions', 'consumers'],
  },

  {
    id: 'm_s1',
    level: 'medium',
    type: 'scenario',
    question:
      'Your payment service publishes a "payment-initiated" event to Kafka. The producer retries on failure. How do you ensure the same payment is never processed twice by the consumer, even if the event is delivered more than once?',
    answer:
      '**Problem:** Producer retries + at-least-once delivery = potential duplicate events. A payment processed twice is a serious bug.\n\n' +
      '**Two-layer defense:**\n\n' +
      '**Layer 1 — Idempotent producer** (`enable.idempotence=true`): Prevents the broker from storing the same message twice due to producer retries within the same session. The broker deduplicates using a producer ID + sequence number. This eliminates most duplicates at the Kafka level.\n\n' +
      '**Layer 2 — Idempotent consumer**: Even with an idempotent producer, consumer restarts after a crash (before offset commit) can redeliver messages. The consumer must deduplicate by **payment ID** before processing:\n' +
      '- Before processing a payment, check if `payment_id` already exists in your database.\n' +
      '- Use an `INSERT ... ON CONFLICT DO NOTHING` (upsert) pattern rather than blind inserts.\n' +
      '- Commit the Kafka offset only *after* the database write succeeds.\n\n' +
      '**For stronger guarantees:** Use Kafka transactions (`transactional.id`) + `isolation.level=read_committed` on consumers — this gives exactly-once within the Kafka pipeline, but side effects (external DB, APIs) still need idempotent handling.',
    tags: ['producers', 'exactly-once', 'idempotence', 'consumers', 'payments'],
  },
  {
    id: 'm_s2',
    level: 'medium',
    type: 'scenario',
    question:
      'A consumer group has 4 consumers and 4 partitions. One consumer is processing 10× slower than the others, causing its partition\'s lag to grow while the other three are caught up. What are your options?',
    answer:
      '**First, diagnose the slow consumer:**\n' +
      '- Is it on an underpowered host (CPU, memory, disk I/O)?\n' +
      '- Is it making slow downstream calls (DB, HTTP)? Check latency percentiles.\n' +
      '- Is the slow partition receiving larger/more complex messages?\n' +
      '- Is there a GC pause issue (Java consumers)?\n\n' +
      '**Options to fix:**\n\n' +
      '1. **Fix the root cause**: Optimize processing logic — add indexes, cache results, batch downstream writes, or upgrade the host.\n\n' +
      '2. **Async processing**: Offload slow work to a thread pool so `poll()` cycles remain fast. Commit offsets only after async work completes.\n\n' +
      '3. **Split the slow partition**: If that partition receives a hot key, fix the key distribution upstream so traffic spreads evenly.\n\n' +
      '4. **Manually reassign the partition**: Use `kafka-consumer-groups.sh` to move the slow partition to a faster consumer temporarily.\n\n' +
      '**What not to do:** Adding more consumers beyond the partition count has no effect — the extra consumers will be idle. You must fix the processing speed or the partition assignment.',
    tags: ['consumers', 'consumer-lag', 'performance', 'troubleshooting'],
  },
  {
    id: 'm_s3',
    level: 'medium',
    type: 'scenario',
    question:
      'Your team wants to add a new field to a Kafka message schema. There are already 3 active consumer services reading from the topic. How do you roll this out without breaking any consumers?',
    answer:
      '**The risk:** If you change the schema in a way that is not backward-compatible, existing consumers that do not understand the new field may crash or behave incorrectly.\n\n' +
      '**Recommended approach — backward-compatible schema evolution:**\n\n' +
      '1. **Use a Schema Registry** (Confluent Schema Registry or AWS Glue): Producers register their schema; consumers validate against it. The registry enforces compatibility rules.\n\n' +
      '2. **Add the new field as optional with a default value** (e.g., in Avro or Protobuf). Existing consumers using the old schema will ignore the unknown field — they keep working unchanged.\n\n' +
      '3. **Deploy in order:**\n' +
      '   - Update consumers first to handle both old and new schema (handle missing field gracefully).\n' +
      '   - Then update producers to start sending the new field.\n' +
      '   - Old consumers that have not been updated yet will still work because the field is optional.\n\n' +
      '**If you cannot use a Schema Registry:** Version your schema explicitly (add a `schema_version` field). Consumers branch on the version number.\n\n' +
      '**What not to do:** Never remove, rename, or change the type of an existing field without a full migration plan — that is a breaking change.',
    tags: ['schema', 'producers', 'consumers', 'architecture', 'compatibility'],
  },
  {
    id: 'm_s4',
    level: 'medium',
    type: 'scenario',
    question:
      'A developer accidentally reset a consumer group\'s offset to the beginning of a topic. The topic has 3 days of data and 50,000 messages. The consumer is now reprocessing all of them, causing duplicate side effects. How do you stop the damage and recover?',
    answer:
      '**Immediate action — stop the consumer group:**\n' +
      '1. Stop all consumers in the group immediately to prevent further duplicate processing.\n' +
      '2. Assess how far the reprocessing has gone: `kafka-consumer-groups.sh --describe --group <group>` to see current offsets vs. latest.\n\n' +
      '**Recovery — reset offset to the correct position:**\n' +
      '3. Use `kafka-consumer-groups.sh --reset-offsets` to jump the offset back to where it should be:\n' +
      '   - `--to-latest`: jump to the latest offset (skip all old messages).\n' +
      '   - `--to-datetime <timestamp>`: reset to the offset closest to when the incident started.\n' +
      '   - `--to-offset <N>`: reset to a specific known-good offset.\n\n' +
      '**Mitigate duplicates already processed:**\n' +
      '4. Identify which records were double-written (use the message timestamp or a dedupe ID).\n' +
      '5. Roll back or compensate: delete duplicate DB rows, reverse duplicate charges, etc.\n\n' +
      '**Prevent recurrence:** Restrict `--reset-offsets` to senior engineers; add a confirmation step in your runbook; use `--dry-run` flag first.',
    tags: ['offsets', 'consumers', 'operations', 'troubleshooting', 'recovery'],
  },
  {
    id: 'm_s5',
    level: 'medium',
    type: 'scenario',
    question:
      'You are building an event-driven inventory system. When stock drops to zero, a "stock-depleted" event must trigger both an email alert and a reorder request — but the email service is down for 10 minutes. How does Kafka help, and what should you watch out for?',
    answer:
      '**How Kafka helps — temporal decoupling:**\n' +
      'The inventory service publishes `stock-depleted` to a Kafka topic. The email service and reorder service are separate consumer groups. When the email service goes down, Kafka retains the messages. When it comes back up, it picks up from its committed offset and processes the missed events — no events are lost.\n\n' +
      '**What to watch out for:**\n\n' +
      '1. **Consumer lag alerting**: Set up lag monitoring (e.g., via Burrow or Confluent Control Center). A 10-minute outage with high event rate can create a large backlog. Alert when lag exceeds a threshold so you know the service is behind.\n\n' +
      '2. **Retention must exceed the outage window**: If `retention.ms` is shorter than the downtime (unlikely for 10 minutes, but important for longer outages), messages will be deleted before the consumer recovers.\n\n' +
      '3. **Email deduplication**: When the email service restarts it may reprocess messages if it crashed before committing offsets. Implement idempotency (check if alert already sent for this stock event).\n\n' +
      '4. **Order of alerts**: The email consumer will send alerts in the order events were produced, but if there is a multi-hour lag, alerts may arrive stale (e.g., stock was already replenished). Add a staleness check on the consumer side.',
    tags: ['consumers', 'architecture', 'consumer-lag', 'retention', 'event-driven'],
  },

  // ─── HARD ─────────────────────────────────────────────────────────────────
  {
    id: 'h1',
    level: 'hard',
    type: 'scenario',
    question:
      'Broker-1 in a 3-broker cluster (RF=3, min.insync.replicas=2) goes offline. Broker-1 was the leader for partition-0. What happens to producers (acks=all) and consumers? Walk through the full sequence.',
    answer:
      '**Sequence of events:**\n\n' +
      '1. **Leader detection**: The other brokers detect Broker-1 is unavailable (via ZooKeeper/KRaft heartbeat timeout).\n' +
      '2. **Leader election**: The controller elects a new leader for partition-0 from the ISR (Broker-2 or Broker-3). This happens in seconds.\n' +
      '3. **Producer behavior (acks=all)**: During the election window (typically 5–30 seconds), producers get `NotLeaderForPartitionException` and retry. Once the new leader is elected, writes succeed again. No data loss — `acks=all` + RF=3 + min.ISR=2 means the remaining 2 brokers both have all data.\n' +
      '4. **Consumer behavior**: Consumers also get metadata errors and re-fetch leader info. They resume from their last committed offset — no messages are lost or skipped.\n' +
      '5. **Replication factor drops to 2**: While Broker-1 is offline, RF effectively = 2. If *another* broker fails, ISR may drop below `min.insync.replicas=2` and the partition will reject writes (throws `NotEnoughReplicasException`).\n\n' +
      '**Key insight**: `min.insync.replicas=2` with RF=3 means you can tolerate 1 broker failure with full write availability, but are one failure away from a write stall.',
    tags: ['replication', 'ISR', 'fault-tolerance', 'brokers', 'acks'],
  },
  {
    id: 'h2',
    level: 'hard',
    type: 'scenario',
    question:
      'One partition receives 80% of your topic\'s traffic. Producers are using a key. What\'s likely wrong and how do you rebalance without downtime?',
    answer:
      '**Root cause: Key skew (hot partition).** A small set of keys (or a single high-volume key) maps to the same partition. Kafka\'s default `murmur2` hash is deterministic — a high-frequency key always lands on the same partition.\n\n' +
      '**Common causes:**\n' +
      '- One entity (e.g., a major enterprise customer) generating disproportionate events.\n' +
      '- A poor key choice (e.g., a boolean flag → only 2 effective partitions).\n' +
      '- Null keys defaulting to round-robin, then a code change introducing a skewed key.\n\n' +
      '**Rebalancing without downtime:**\n' +
      '1. **Add a salt suffix to hot keys**: Append a random bucket (e.g., `customerId + "_" + (random % 4)`). Consumers must aggregate across the 4 sub-partitions — adds complexity.\n' +
      '2. **Custom partitioner**: Implement a `Partitioner` that routes hot keys across multiple partitions explicitly.\n' +
      '3. **Separate topic for hot entities**: Route high-volume entities to a dedicated high-partition-count topic.\n' +
      '4. **Increase partition count**: Alone, this does *not* fix key skew — the same key hash still routes to fewer partitions. Fix the key strategy first.',
    tags: ['partitions', 'producers', 'hot-partition', 'scalability', 'keys'],
  },
  {
    id: 'h3',
    level: 'hard',
    type: 'scenario',
    question:
      'Your team wants to increase partition count from 3 to 9 on a live topic to scale throughput, but key-ordered messages cannot be reordered. What breaks and how do you migrate?',
    answer:
      '**What breaks:** Kafka\'s key-to-partition routing is `hash(key) % numPartitions`. Changing `numPartitions` from 3 to 9 changes the modulo, so existing keys route to *different* partitions. Messages written before the increase are in partitions 0-2; new messages for the same key may go to partitions 3-8 — **breaking per-key ordering**.\n\n' +
      '**Migration path:**\n' +
      '1. **Dual-write with cutover**: Create a new topic with 9 partitions. Producers write to both old and new topics. Consumers migrate to the new topic. Once consumers are caught up on the new topic, drain and decommission the old one.\n' +
      '2. **Quiesce + repartition**: If a brief write pause is acceptable — stop producers, wait for consumers to drain the old topic to zero lag, then increase partitions and restart producers. All in-flight messages are consumed in order before routing changes.\n' +
      '3. **If strict ordering can tolerate a one-time boundary**: Accept that messages from before the resize are in the old partition layout. Consumers process old partitions to completion, then handle new partitions. Only feasible if the consumer can distinguish epochs.\n\n' +
      '**Best practice**: Over-partition at topic creation time (e.g., 12 instead of 3) so you have headroom without ever needing to resize.',
    tags: ['partitions', 'ordering', 'migration', 'keys'],
  },
  {
    id: 'h4',
    level: 'hard',
    type: 'scenario',
    question:
      'You\'re designing a multi-region active-active Kafka setup for a payments system. What are the replication pitfalls and how do you handle them?',
    answer:
      '**Core challenge: Kafka replication is unidirectional within a cluster.** Cross-cluster replication (MirrorMaker 2 or Confluent Replicator) is asynchronous — RPO > 0.\n\n' +
      '**Pitfalls and mitigations:**\n\n' +
      '1. **Message duplication on failover**: Same message may be replicated to both regions and processed twice. Use idempotent consumers (deduplicate on payment ID) + transactional writes to DB.\n\n' +
      '2. **Offset mismatch**: Offsets are cluster-local. A consumer group\'s offset in Region A is meaningless in Region B. MirrorMaker 2 translates offsets via the `__consumer_offsets` sync, but there is always a translation lag.\n\n' +
      '3. **Replication lag (RPO)**: Under network partition, Region B may be seconds or minutes behind Region A. Payments processed in Region A may not yet exist in Region B — avoid cross-region reads for payment validation without a distributed lock or consensus layer.\n\n' +
      '4. **Split-brain writes**: If both regions accept writes to the same logical entity (e.g., account balance), you need a conflict resolution strategy — last-write-wins, vector clocks, or a coordination service.\n\n' +
      '**Recommended patterns**: Active-passive with fast failover for simplicity; active-active only for genuinely independent data partitioned by region (e.g., EU customers in EU, US customers in US).',
    tags: ['replication', 'multi-region', 'architecture', 'fault-tolerance'],
  },
  {
    id: 'h5',
    level: 'hard',
    type: 'scenario',
    question:
      'A consumer in a group is processing slowly and repeatedly hitting `session.timeout.ms`. Kafka keeps rebalancing the group. How do you diagnose and fix this without data loss?',
    answer:
      '**Symptom: Thrashing rebalance loop.** The slow consumer fails to send heartbeats within `session.timeout.ms` (default 10s) → group coordinator marks it dead → rebalance → consumer rejoins → gets the same partition → still slow → repeat.\n\n' +
      '**Diagnosis:**\n' +
      '- Check `poll()` interval: Is processing between `poll()` calls exceeding `max.poll.interval.ms` (default 5min)?\n' +
      '- Check `session.timeout.ms`: Is the consumer sending heartbeats (separate thread) but missing `max.poll.interval.ms` due to slow batch processing?\n' +
      '- Check for blocking I/O, GC pauses, or downstream slowness.\n\n' +
      '**Fixes (no data loss):**\n' +
      '1. **Reduce batch size**: Lower `max.poll.records` (default 500) so each `poll()` returns fewer messages and processing completes faster.\n' +
      '2. **Increase `max.poll.interval.ms`**: Buy more time for legitimate slow processing. Caution: delays failure detection.\n' +
      '3. **Async processing with manual offset commit**: Offload work to a thread pool; only commit offset after the worker completes. Ensures no message is lost even if the consumer rebalances.\n' +
      '4. **Scale the consumer group**: Add more consumers to reduce per-consumer partition load.\n\n' +
      'Offsets are only committed on success — rebalancing itself does not cause data loss, but it does cause duplicate delivery during reprocessing.',
    tags: ['consumers', 'rebalancing', 'consumer-lag', 'troubleshooting', 'offsets'],
  },
  {
    id: 'h6',
    level: 'hard',
    type: 'scenario',
    question:
      "Your Kafka cluster's disk is filling up faster than expected on one broker. Other brokers are fine. What are the possible causes and remediation steps?",
    answer:
      '**Possible causes:**\n\n' +
      '1. **Partition leader concentration**: That broker hosts the leader for high-volume partitions. Leaders receive all writes; followers replicate. Use `kafka-preferred-replica-election.sh` or auto-leader-rebalance to redistribute leaders.\n\n' +
      '2. **Replication lag (follower accumulation)**: A follower on that broker is lagging and accumulating unreplicated segments. Check ISR and replica lag metrics.\n\n' +
      '3. **Retention not applying**: Log cleaner thread is stalled or `log.cleanup.policy` is misconfigured. Check cleaner metrics and logs.\n\n' +
      '4. **Large messages / binary blobs**: A producer is sending unusually large messages routed to partitions on this broker.\n\n' +
      '5. **Topic-level retention override**: One topic on that broker has a very long `retention.ms` or `retention.bytes` override.\n\n' +
      '**Remediation:**\n' +
      '- Rebalance partition leaders: `kafka-leader-election.sh --type preferred`\n' +
      '- Reassign replicas to other brokers: `kafka-reassign-partitions.sh`\n' +
      '- Temporarily reduce `retention.ms` on high-volume topics to free disk.\n' +
      '- Add disk capacity or a new broker and trigger reassignment.',
    tags: ['brokers', 'storage', 'operations', 'replication', 'troubleshooting'],
  },
  {
    id: 'h7',
    level: 'hard',
    type: 'conceptual',
    question: "How does KRaft replace ZooKeeper for Kafka's metadata management? What changes operationally?",
    answer:
      "**KRaft (Kafka Raft Metadata mode)** eliminates ZooKeeper by embedding metadata management directly into Kafka brokers using the **Raft consensus algorithm**.\n\n" +
      "**How it works:**\n" +
      "- A subset of brokers act as **controllers** (typically 3). One controller is the active leader; others are followers.\n" +
      "- All cluster metadata (topic configs, partition assignments, ISR, broker state) is stored in an internal Kafka topic `@metadata` and replicated via Raft.\n" +
      "- The active controller is authoritative; followers replicate the metadata log.\n\n" +
      "**What changes operationally:**\n" +
      "1. **No ZooKeeper cluster to manage**: Eliminates a separate distributed system with its own JVMs, configs, and monitoring.\n" +
      "2. **Faster controller failover**: ZooKeeper elections took 10-30+ seconds; KRaft failover is sub-second.\n" +
      "3. **Larger cluster support**: ZooKeeper struggled beyond ~200,000 partitions. KRaft scales to millions.\n" +
      "4. **Single security model**: No more ZooKeeper ACLs separate from Kafka ACLs.\n" +
      "5. **New deployment modes**: Brokers can be combined (broker + controller) or separated. Controller-only nodes are recommended for large deployments.",
    tags: ['KRaft', 'ZooKeeper', 'operations', 'architecture'],
  },
  {
    id: 'h8',
    level: 'hard',
    type: 'scenario',
    question:
      'You need strict cross-partition ordering (e.g., a saga spanning multiple event types). Kafka does not guarantee this natively. What patterns can you use?',
    answer:
      "**Kafka's guarantee**: Ordered within a partition only. Cross-partition ordering is not provided.\n\n" +
      "**Patterns for cross-partition ordering:**\n\n" +
      "1. **Single-partition topic**: Put all saga events in one partition (one topic, one partition). Enforces total order at the cost of parallelism. Only viable for low-volume use cases.\n\n" +
      "2. **Sequence numbers + consumer-side reordering**: Embed a global sequence number in each event. Consumers buffer and reorder before processing. Requires a centralized sequence generator (Redis atomic increment, DB sequence) — adds latency and a potential bottleneck.\n\n" +
      "3. **Saga orchestrator pattern**: Use a single orchestrator service that consumes all relevant event types and issues commands. The orchestrator processes events sequentially, maintaining saga state in a DB. Decouples ordering from Kafka topology.\n\n" +
      "4. **Transactional outbox + event sequencing**: Write events to a DB outbox table in a single transaction (guaranteeing order). A relay service publishes them to Kafka in sequence. Downstream consumers can use the DB-assigned sequence ID for ordering.\n\n" +
      "5. **Kafka Streams / ksqlDB with stream-table joins**: Use stateful stream processing to join and order events with explicit windowing semantics.\n\n" +
      "**Recommendation**: The saga orchestrator pattern is the most operationally practical for payment/order sagas.",
    tags: ['ordering', 'architecture', 'sagas', 'patterns'],
  },
]
