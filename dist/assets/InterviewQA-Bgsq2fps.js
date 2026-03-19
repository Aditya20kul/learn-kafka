import{c as f,j as e,r as m,A as g,C as p}from"./index-ZAtNdKdu.js";import{c as y,P as b,m as d}from"./clsx-ey4cgaXv.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=f("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),w={primary:"bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/30",success:"bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",accent:"bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",danger:"bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30",neutral:"bg-[var(--border)] text-[var(--text-2)] border-[var(--border)]"};function u({children:t,variant:n="neutral",className:s}){return e.jsx("span",{className:y("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",w[n],s),children:t})}const i=[{id:"e1",level:"easy",type:"conceptual",question:"What is Apache Kafka and what problem does it solve?",answer:`Apache Kafka is a **distributed event streaming platform** designed for high-throughput, fault-tolerant publish-subscribe messaging.

It solves the problem of **point-to-point integration explosion**: without Kafka, every producer must directly connect to every consumer. With Kafka, producers write to topics and any number of consumers read independently — decoupling systems and enabling real-time data pipelines.

Key properties: persistent (messages are stored on disk), ordered within a partition, horizontally scalable, and fault-tolerant.`,tags:["fundamentals","architecture"]},{id:"e2",level:"easy",type:"conceptual",question:"What is a topic and how is it different from a traditional message queue?",answer:`A **topic** is a named, append-only log of events. Producers write to it; consumers read from it.

**Key differences from a traditional queue:**
- **Retention**: Messages are *not deleted after consumption* — they stay for a configurable period (e.g., 7 days).
- **Multiple consumers**: Many independent consumer groups can read the same topic simultaneously, each at its own pace.
- **Replay**: Consumers can seek backward and re-read past messages.
- **Ordering**: Kafka guarantees ordering *within* a partition; queues typically guarantee FIFO globally.`,tags:["topics","fundamentals"]},{id:"e3",level:"easy",type:"conceptual",question:"What is a partition and why does it matter?",answer:`A **partition** is a subdivision of a topic — an ordered, immutable sequence of records stored on a single broker.

**Why it matters:**
- **Parallelism**: Multiple consumers in a group can each read from a different partition simultaneously.
- **Scalability**: Data is distributed across brokers; more partitions = more throughput.
- **Ordering**: Kafka only guarantees ordering *within* a partition, not across partitions.

Each message in a partition has a unique, monotonically increasing **offset**.`,tags:["partitions","scalability"]},{id:"e4",level:"easy",type:"conceptual",question:"What is an offset?",answer:`An **offset** is a sequential integer that uniquely identifies each message within a partition (0, 1, 2, …).

Offsets serve two purposes:
1. **Position tracking**: Each consumer group tracks its *committed offset* per partition — the position up to which messages have been successfully processed.
2. **Replay**: Consumers can seek to any offset to re-read historical data.

Offsets are scoped to a topic-partition — the same offset 42 can exist in both partition-0 and partition-1.`,tags:["offsets","consumers"]},{id:"e5",level:"easy",type:"conceptual",question:"What's the difference between a producer and a consumer?",answer:`**Producer**: Writes (publishes) messages to a Kafka topic. Producers choose which topic (and optionally which partition) to send to. They receive acknowledgment based on the \`acks\` setting.

**Consumer**: Reads (subscribes to) messages from a topic. Consumers track their own position using offsets and pull messages at their own rate — Kafka never pushes.

**Key asymmetry**: Producers push data; consumers pull. This lets consumers process at their own speed without overwhelming them.`,tags:["producers","consumers","fundamentals"]},{id:"e6",level:"easy",type:"scenario",question:"Your service needs to emit user-activity events to three downstream systems: analytics, notifications, and an audit log. All three need every event. How would you model this in Kafka?",answer:`Create a **single topic** (e.g., \`user-activity\`) and set up **three separate consumer groups**: one for analytics, one for notifications, one for audit.

**Why this works:**
- Each consumer group maintains its own independent offset — all three receive every event.
- Producers only need one destination. Adding a fourth consumer later requires zero producer changes.
- Consumer groups are isolated: a slow audit consumer does not block the notifications consumer.

**Anti-pattern to avoid**: Do *not* create three separate topics and have the producer fan-out manually — that couples the producer to downstream consumers and creates operational overhead.`,tags:["consumer-groups","architecture","topics"]},{id:"e7",level:"easy",type:"conceptual",question:"What is a consumer group?",answer:`A **consumer group** is a set of consumers that cooperate to consume a topic. Kafka distributes partitions across group members — each partition is assigned to exactly one consumer in the group at a time.

**Key properties:**
- **Parallel consumption**: With N partitions and N consumers, each consumer handles one partition.
- **Fault tolerance**: If a consumer dies, its partitions are rebalanced to surviving members.
- **Independent groups**: Multiple groups can consume the same topic independently (each gets all messages).

The group coordinator broker tracks offsets on behalf of the group in the \`__consumer_offsets\` internal topic.`,tags:["consumer-groups","fundamentals"]},{id:"e8",level:"easy",type:"scenario",question:"Your new Kafka topic has 1 partition and a single consumer. Traffic doubles. Consumer lag starts climbing. What is wrong and how do you fix it?",answer:`**Root cause**: A single partition can only be consumed by one consumer at a time within a group. Adding more consumers does nothing — they will be idle. The bottleneck is the partition count.

**Fix:**
1. **Increase the partition count** on the topic (e.g., from 1 to 4 or 8).
2. **Scale up the consumer group** to match the new partition count.

**Caveats:**
- Increasing partitions on a live topic is safe for throughput, but breaks key-based ordering for messages that were previously in the single partition.
- Consumers must be idempotent if you replay or rebalance.
- Consider whether the consumer processing logic itself is the bottleneck (slow DB writes, etc.) before adding partitions.`,tags:["partitions","scalability","consumer-lag"]},{id:"m1",level:"medium",type:"scenario",question:"Your topic has 6 partitions and your consumer group has 8 consumers. What happens to the extra 2 consumers?",answer:`The **2 extra consumers sit idle**. Kafka assigns at most one consumer per partition within a group. With 6 partitions and 8 consumers, 6 consumers each get one partition and 2 consumers receive no partitions.

**Why this is still useful:** The idle consumers act as hot standbys. If one of the active 6 consumers fails, Kafka rebalances and one of the idle consumers immediately takes over — reducing recovery time.

**Rule of thumb:** \`effective_parallelism = min(partition_count, consumer_count)\`. Never add consumers beyond the partition count expecting more throughput.`,tags:["consumer-groups","partitions","rebalancing"]},{id:"m2",level:"medium",type:"conceptual",question:"What is the ISR (In-Sync Replicas) and why does it matter?",answer:`The **ISR** (In-Sync Replicas) is the set of partition replicas that are fully caught up with the partition leader. A replica is in-sync if it has fetched all messages within \`replica.lag.time.max.ms\`.

**Why it matters:**
- With \`acks=all\`, the producer waits for acknowledgment from **all ISR members** before the write is considered durable.
- \`min.insync.replicas\` (default 1) sets the minimum ISR size. If ISR falls below this, the partition rejects writes — preventing data loss at the cost of availability.
- If a follower falls behind (e.g., network issue), it is removed from the ISR. Once it catches up, it rejoins.

A leader can only be elected from the ISR, ensuring no data loss during failover.`,tags:["replication","ISR","durability"]},{id:"m3",level:"medium",type:"scenario",question:"You are using `auto.offset.reset=latest` and `enable.auto.commit=true`, but you are seeing duplicate messages after consumer restarts. Why?",answer:"**Root cause: At-least-once delivery from auto-commit timing.**\n\n`enable.auto.commit=true` commits offsets on a background timer (default every 5 seconds via `auto.commit.interval.ms`). If the consumer processes messages but crashes *before* the next auto-commit, those messages will be redelivered on restart — causing duplicates.\n\n**Solutions:**\n1. **Manual commit after processing**: Set `enable.auto.commit=false` and call `commitSync()` or `commitAsync()` after each batch is fully processed.\n2. **Idempotent consumers**: Design your downstream writes to tolerate duplicates (e.g., upsert by message ID rather than blind insert).\n3. **Transactional producers + consumers** (`isolation.level=read_committed`) for exactly-once semantics.\n\n`auto.offset.reset` only controls where to start when *no* committed offset exists — it is unrelated to this problem.",tags:["offsets","consumers","at-least-once","duplicates"]},{id:"m4",level:"medium",type:"scenario",question:"Orders must be processed in the exact sequence per customer. How do you ensure ordering with Kafka?",answer:`Kafka only guarantees ordering **within a single partition**. To enforce per-customer ordering:

1. **Use the customer ID as the message key.** Kafka hashes the key and routes all messages with the same key to the same partition — guaranteeing that all events for a given customer land in the same partition and are consumed in order.

2. **Assign one consumer per partition** in your consumer group (or ensure your consumer processes each partition sequentially).

**Pitfalls to avoid:**
- Do *not* use null keys — messages will round-robin across partitions, breaking ordering.
- If you increase partition count, the key-to-partition mapping changes. Existing in-flight messages and new messages may now route differently. Plan migrations carefully.
- If a single consumer handles multiple partitions, ensure you do not process messages from different partitions concurrently for the same customer.`,tags:["ordering","partitions","producers","keys"]},{id:"m5",level:"medium",type:"scenario",question:"Consumer lag is growing on one partition but not others. Walk through your diagnosis.",answer:`**Step 1 — Confirm the symptom.** Use \`kafka-consumer-groups.sh --describe\` to see per-partition lag. Confirm lag is isolated to one partition.

**Step 2 — Check the assigned consumer.** The consumer assigned to the lagging partition may be slow. Look for: high CPU/memory, slow downstream (DB writes, HTTP calls), or the consumer in a tight loop throwing and swallowing exceptions.

**Step 3 — Check message characteristics.** Is the lagging partition receiving disproportionate traffic (a hot partition)? Use \`kafka-log-dirs.sh\` to compare partition sizes.

**Step 4 — Check the leader broker.** Is the broker hosting that partition's leader under disk or network pressure?

**Fixes:**
- Slow consumer logic → optimize processing, add async I/O, or scale out consumer group.
- Hot partition → fix key distribution (avoid high-cardinality skew or null keys).
- Broker saturation → rebalance partition leadership across brokers.`,tags:["consumer-lag","monitoring","partitions","troubleshooting"]},{id:"m6",level:"medium",type:"conceptual",question:"What is log compaction? When would you choose it over time-based retention?",answer:`**Log compaction** retains the *latest* message for each unique key, discarding earlier values for the same key. The log is compacted in the background by the cleaner thread.

**Use log compaction when** your topic represents current state per entity — e.g., a user profile, a device shadow, an account balance. You want consumers to be able to read the full current state even after a long outage, without replaying years of history.

**Use time-based retention when** messages are events (immutable facts): click streams, order events, logs. You care about the history of events, not just the latest state.

**Key detail:** Compaction does *not* guarantee immediate removal — a compaction lag window exists. You can combine both: \`cleanup.policy=compact,delete\` to compact old records but still expire very old data.`,tags:["retention","log-compaction","topics"]},{id:"m7",level:"medium",type:"scenario",question:"A new downstream service needs to rebuild its entire state from a Kafka topic with 7-day retention. The service was down for 10 days. What is the risk and what are your options?",answer:`**Risk:** The first 3 days of events have been deleted by the 7-day retention policy. The service cannot reconstruct full state from Kafka alone — it will have a **3-day gap** at the beginning of history.

**Options:**
1. **Snapshot + replay hybrid**: Use a database snapshot from day 0 (or the oldest available snapshot) to seed the service's state, then replay from the earliest available Kafka offset on top of that snapshot.
2. **Increase retention**: Extend \`retention.ms\` on the topic going forward to prevent this in future outages.
3. **Log-compacted topic**: If the topic uses compaction (not time retention), the latest value per key is always available regardless of age. Consider compaction for event-sourced state topics.
4. **External event store**: Persist all raw events to S3/GCS via Kafka Connect for indefinite replay beyond Kafka retention.

Lesson: Kafka retention is a **sliding window**, not an archive. Design rebuild paths accordingly.`,tags:["retention","consumers","architecture","event-sourcing"]},{id:"m8",level:"medium",type:"conceptual",question:"What is the difference between `acks=1` and `acks=all`?",answer:"**`acks=1`** (default): The producer waits for acknowledgment from the **partition leader only**. The write is considered successful as soon as the leader appends it to its log — before followers have replicated it. If the leader crashes immediately after, the message may be lost.\n\n**`acks=all`** (or `acks=-1`): The producer waits for acknowledgment from the **leader + all in-sync replicas (ISR)**. The write is only confirmed once all ISR members have persisted it. Combined with `min.insync.replicas=2`, this prevents data loss at the cost of higher latency.\n\n**Trade-off summary:**\n- `acks=0` — fire and forget. No durability guarantee, lowest latency.\n- `acks=1` — leader-durable. Good throughput, risk of loss on leader failure.\n- `acks=all` — fully durable. Highest latency, required for critical data.",tags:["producers","replication","durability","acks"]},{id:"m9",level:"medium",type:"scenario",question:"You need to guarantee a message is processed exactly once end-to-end. What Kafka features make this possible and what are the trade-offs?",answer:`Kafka's **exactly-once semantics (EOS)** requires three components working together:

1. **Idempotent producer** (\`enable.idempotence=true\`): Each producer gets a producer ID + sequence number. The broker deduplicates retried messages within a session.
2. **Transactional producer** (\`transactional.id=<unique-id>\`): Groups writes across multiple partitions/topics into an atomic transaction. Either all writes commit or all are aborted.
3. **\`isolation.level=read_committed\`** on consumers: Consumers only see committed transactions, ignoring in-flight or aborted messages.

**Trade-offs:**
- **Throughput**: ~20-30% throughput reduction due to coordination overhead.
- **Latency**: \`read_committed\` consumers wait for the transaction to commit before seeing messages.
- **Complexity**: Requires careful transactional ID management and failure handling.
- **Scope**: EOS is only guaranteed *within Kafka*. Side effects outside Kafka (e.g., HTTP calls, DB writes) require idempotent external operations.`,tags:["exactly-once","producers","transactions","consumers"]},{id:"h1",level:"hard",type:"scenario",question:"Broker-1 in a 3-broker cluster (RF=3, min.insync.replicas=2) goes offline. Broker-1 was the leader for partition-0. What happens to producers (acks=all) and consumers? Walk through the full sequence.",answer:"**Sequence of events:**\n\n1. **Leader detection**: The other brokers detect Broker-1 is unavailable (via ZooKeeper/KRaft heartbeat timeout).\n2. **Leader election**: The controller elects a new leader for partition-0 from the ISR (Broker-2 or Broker-3). This happens in seconds.\n3. **Producer behavior (acks=all)**: During the election window (typically 5–30 seconds), producers get `NotLeaderForPartitionException` and retry. Once the new leader is elected, writes succeed again. No data loss — `acks=all` + RF=3 + min.ISR=2 means the remaining 2 brokers both have all data.\n4. **Consumer behavior**: Consumers also get metadata errors and re-fetch leader info. They resume from their last committed offset — no messages are lost or skipped.\n5. **Replication factor drops to 2**: While Broker-1 is offline, RF effectively = 2. If *another* broker fails, ISR may drop below `min.insync.replicas=2` and the partition will reject writes (throws `NotEnoughReplicasException`).\n\n**Key insight**: `min.insync.replicas=2` with RF=3 means you can tolerate 1 broker failure with full write availability, but are one failure away from a write stall.",tags:["replication","ISR","fault-tolerance","brokers","acks"]},{id:"h2",level:"hard",type:"scenario",question:"One partition receives 80% of your topic's traffic. Producers are using a key. What's likely wrong and how do you rebalance without downtime?",answer:`**Root cause: Key skew (hot partition).** A small set of keys (or a single high-volume key) maps to the same partition. Kafka's default \`murmur2\` hash is deterministic — a high-frequency key always lands on the same partition.

**Common causes:**
- One entity (e.g., a major enterprise customer) generating disproportionate events.
- A poor key choice (e.g., a boolean flag → only 2 effective partitions).
- Null keys defaulting to round-robin, then a code change introducing a skewed key.

**Rebalancing without downtime:**
1. **Add a salt suffix to hot keys**: Append a random bucket (e.g., \`customerId + "_" + (random % 4)\`). Consumers must aggregate across the 4 sub-partitions — adds complexity.
2. **Custom partitioner**: Implement a \`Partitioner\` that routes hot keys across multiple partitions explicitly.
3. **Separate topic for hot entities**: Route high-volume entities to a dedicated high-partition-count topic.
4. **Increase partition count**: Alone, this does *not* fix key skew — the same key hash still routes to fewer partitions. Fix the key strategy first.`,tags:["partitions","producers","hot-partition","scalability","keys"]},{id:"h3",level:"hard",type:"scenario",question:"Your team wants to increase partition count from 3 to 9 on a live topic to scale throughput, but key-ordered messages cannot be reordered. What breaks and how do you migrate?",answer:`**What breaks:** Kafka's key-to-partition routing is \`hash(key) % numPartitions\`. Changing \`numPartitions\` from 3 to 9 changes the modulo, so existing keys route to *different* partitions. Messages written before the increase are in partitions 0-2; new messages for the same key may go to partitions 3-8 — **breaking per-key ordering**.

**Migration path:**
1. **Dual-write with cutover**: Create a new topic with 9 partitions. Producers write to both old and new topics. Consumers migrate to the new topic. Once consumers are caught up on the new topic, drain and decommission the old one.
2. **Quiesce + repartition**: If a brief write pause is acceptable — stop producers, wait for consumers to drain the old topic to zero lag, then increase partitions and restart producers. All in-flight messages are consumed in order before routing changes.
3. **If strict ordering can tolerate a one-time boundary**: Accept that messages from before the resize are in the old partition layout. Consumers process old partitions to completion, then handle new partitions. Only feasible if the consumer can distinguish epochs.

**Best practice**: Over-partition at topic creation time (e.g., 12 instead of 3) so you have headroom without ever needing to resize.`,tags:["partitions","ordering","migration","keys"]},{id:"h4",level:"hard",type:"scenario",question:"You're designing a multi-region active-active Kafka setup for a payments system. What are the replication pitfalls and how do you handle them?",answer:`**Core challenge: Kafka replication is unidirectional within a cluster.** Cross-cluster replication (MirrorMaker 2 or Confluent Replicator) is asynchronous — RPO > 0.

**Pitfalls and mitigations:**

1. **Message duplication on failover**: Same message may be replicated to both regions and processed twice. Use idempotent consumers (deduplicate on payment ID) + transactional writes to DB.

2. **Offset mismatch**: Offsets are cluster-local. A consumer group's offset in Region A is meaningless in Region B. MirrorMaker 2 translates offsets via the \`__consumer_offsets\` sync, but there is always a translation lag.

3. **Replication lag (RPO)**: Under network partition, Region B may be seconds or minutes behind Region A. Payments processed in Region A may not yet exist in Region B — avoid cross-region reads for payment validation without a distributed lock or consensus layer.

4. **Split-brain writes**: If both regions accept writes to the same logical entity (e.g., account balance), you need a conflict resolution strategy — last-write-wins, vector clocks, or a coordination service.

**Recommended patterns**: Active-passive with fast failover for simplicity; active-active only for genuinely independent data partitioned by region (e.g., EU customers in EU, US customers in US).`,tags:["replication","multi-region","architecture","fault-tolerance"]},{id:"h5",level:"hard",type:"scenario",question:"A consumer in a group is processing slowly and repeatedly hitting `session.timeout.ms`. Kafka keeps rebalancing the group. How do you diagnose and fix this without data loss?",answer:"**Symptom: Thrashing rebalance loop.** The slow consumer fails to send heartbeats within `session.timeout.ms` (default 10s) → group coordinator marks it dead → rebalance → consumer rejoins → gets the same partition → still slow → repeat.\n\n**Diagnosis:**\n- Check `poll()` interval: Is processing between `poll()` calls exceeding `max.poll.interval.ms` (default 5min)?\n- Check `session.timeout.ms`: Is the consumer sending heartbeats (separate thread) but missing `max.poll.interval.ms` due to slow batch processing?\n- Check for blocking I/O, GC pauses, or downstream slowness.\n\n**Fixes (no data loss):**\n1. **Reduce batch size**: Lower `max.poll.records` (default 500) so each `poll()` returns fewer messages and processing completes faster.\n2. **Increase `max.poll.interval.ms`**: Buy more time for legitimate slow processing. Caution: delays failure detection.\n3. **Async processing with manual offset commit**: Offload work to a thread pool; only commit offset after the worker completes. Ensures no message is lost even if the consumer rebalances.\n4. **Scale the consumer group**: Add more consumers to reduce per-consumer partition load.\n\nOffsets are only committed on success — rebalancing itself does not cause data loss, but it does cause duplicate delivery during reprocessing.",tags:["consumers","rebalancing","consumer-lag","troubleshooting","offsets"]},{id:"h6",level:"hard",type:"scenario",question:"Your Kafka cluster's disk is filling up faster than expected on one broker. Other brokers are fine. What are the possible causes and remediation steps?",answer:`**Possible causes:**

1. **Partition leader concentration**: That broker hosts the leader for high-volume partitions. Leaders receive all writes; followers replicate. Use \`kafka-preferred-replica-election.sh\` or auto-leader-rebalance to redistribute leaders.

2. **Replication lag (follower accumulation)**: A follower on that broker is lagging and accumulating unreplicated segments. Check ISR and replica lag metrics.

3. **Retention not applying**: Log cleaner thread is stalled or \`log.cleanup.policy\` is misconfigured. Check cleaner metrics and logs.

4. **Large messages / binary blobs**: A producer is sending unusually large messages routed to partitions on this broker.

5. **Topic-level retention override**: One topic on that broker has a very long \`retention.ms\` or \`retention.bytes\` override.

**Remediation:**
- Rebalance partition leaders: \`kafka-leader-election.sh --type preferred\`
- Reassign replicas to other brokers: \`kafka-reassign-partitions.sh\`
- Temporarily reduce \`retention.ms\` on high-volume topics to free disk.
- Add disk capacity or a new broker and trigger reassignment.`,tags:["brokers","storage","operations","replication","troubleshooting"]},{id:"h7",level:"hard",type:"conceptual",question:"How does KRaft replace ZooKeeper for Kafka's metadata management? What changes operationally?",answer:`**KRaft (Kafka Raft Metadata mode)** eliminates ZooKeeper by embedding metadata management directly into Kafka brokers using the **Raft consensus algorithm**.

**How it works:**
- A subset of brokers act as **controllers** (typically 3). One controller is the active leader; others are followers.
- All cluster metadata (topic configs, partition assignments, ISR, broker state) is stored in an internal Kafka topic \`@metadata\` and replicated via Raft.
- The active controller is authoritative; followers replicate the metadata log.

**What changes operationally:**
1. **No ZooKeeper cluster to manage**: Eliminates a separate distributed system with its own JVMs, configs, and monitoring.
2. **Faster controller failover**: ZooKeeper elections took 10-30+ seconds; KRaft failover is sub-second.
3. **Larger cluster support**: ZooKeeper struggled beyond ~200,000 partitions. KRaft scales to millions.
4. **Single security model**: No more ZooKeeper ACLs separate from Kafka ACLs.
5. **New deployment modes**: Brokers can be combined (broker + controller) or separated. Controller-only nodes are recommended for large deployments.`,tags:["KRaft","ZooKeeper","operations","architecture"]},{id:"h8",level:"hard",type:"scenario",question:"You need strict cross-partition ordering (e.g., a saga spanning multiple event types). Kafka does not guarantee this natively. What patterns can you use?",answer:`**Kafka's guarantee**: Ordered within a partition only. Cross-partition ordering is not provided.

**Patterns for cross-partition ordering:**

1. **Single-partition topic**: Put all saga events in one partition (one topic, one partition). Enforces total order at the cost of parallelism. Only viable for low-volume use cases.

2. **Sequence numbers + consumer-side reordering**: Embed a global sequence number in each event. Consumers buffer and reorder before processing. Requires a centralized sequence generator (Redis atomic increment, DB sequence) — adds latency and a potential bottleneck.

3. **Saga orchestrator pattern**: Use a single orchestrator service that consumes all relevant event types and issues commands. The orchestrator processes events sequentially, maintaining saga state in a DB. Decouples ordering from Kafka topology.

4. **Transactional outbox + event sequencing**: Write events to a DB outbox table in a single transaction (guaranteeing order). A relay service publishes them to Kafka in sequence. Downstream consumers can use the DB-assigned sequence ID for ordering.

5. **Kafka Streams / ksqlDB with stream-table joins**: Use stateful stream processing to join and order events with explicit windowing semantics.

**Recommendation**: The saga orchestrator pattern is the most operationally practical for payment/order sagas.`,tags:["ordering","architecture","sagas","patterns"]}],h="kafka-interview-reviewed",k={easy:"success",medium:"accent",hard:"danger"},x={easy:"Easy",medium:"Medium",hard:"Hard"};function R(){const[t,n]=m.useState(()=>{try{return JSON.parse(localStorage.getItem(h)??"{}")}catch{return{}}});function s(l){n(r=>{const c={...r,[l]:!r[l]};return localStorage.setItem(h,JSON.stringify(c)),c})}const o=Object.values(t).filter(Boolean).length;return{reviewed:t,toggle:s,reviewedCount:o}}function K({text:t}){const n=t.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);return e.jsx("span",{children:n.map((s,o)=>s.startsWith("**")&&s.endsWith("**")?e.jsx("strong",{className:"text-[var(--text-1)] font-semibold",children:s.slice(2,-2)},o):s.startsWith("`")&&s.endsWith("`")?e.jsx("code",{className:"font-mono text-[0.85em] bg-[var(--border)]/40 text-[var(--primary)] px-1 py-0.5 rounded",children:s.slice(1,-1)},o):s===`
`?e.jsx("br",{},o):e.jsx("span",{children:s},o))})}function C({q:t,isReviewed:n,onToggleReviewed:s}){const[o,l]=m.useState(!1);return e.jsxs("div",{className:`border rounded-xl transition-all duration-200 ${n?"border-[var(--success)]/40 bg-[var(--success)]/5":"border-[var(--border)] bg-[var(--surface)]"}`,children:[e.jsxs("button",{onClick:()=>l(r=>!r),className:"w-full text-left px-5 py-4 flex items-start gap-3 group","aria-expanded":o,children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 mb-2",children:[e.jsx(u,{variant:k[t.level],children:x[t.level]}),e.jsx(u,{variant:t.type==="scenario"?"accent":"primary",children:t.type==="scenario"?"Scenario":"Conceptual"}),n&&e.jsxs(u,{variant:"success",children:[e.jsx(p,{size:10,className:"mr-1"}),"Reviewed"]})]}),e.jsx("p",{className:"text-sm font-medium text-[var(--text-1)] leading-snug",children:t.question}),e.jsx("div",{className:"flex flex-wrap gap-1 mt-2",children:t.tags.map(r=>e.jsx("span",{className:"text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--border)]/60 text-[var(--text-2)]",children:r},r))})]}),e.jsx(d.div,{animate:{rotate:o?180:0},transition:{duration:.2},className:"flex-shrink-0 mt-0.5 text-[var(--text-2)] group-hover:text-[var(--text-1)]",children:e.jsx(v,{size:18})})]}),e.jsx(g,{initial:!1,children:o&&e.jsx(d.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.22,ease:"easeOut"},className:"overflow-hidden",children:e.jsxs("div",{className:"px-5 pb-5 pt-1 border-t border-[var(--border)]",children:[e.jsx("p",{className:"text-sm text-[var(--text-2)] leading-relaxed whitespace-pre-line",children:e.jsx(K,{text:t.answer})}),e.jsxs("button",{onClick:r=>{r.stopPropagation(),s()},className:`mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${n?"bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25":"bg-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]"}`,children:[e.jsx(p,{size:13}),n?"Reviewed ✓":"Mark as reviewed"]})]})},"answer")})]})}const I=[{id:"all",label:"All"},{id:"easy",label:"Easy"},{id:"medium",label:"Medium"},{id:"hard",label:"Hard"}];function q(){const[t,n]=m.useState("all"),{reviewed:s,toggle:o,reviewedCount:l}=R(),r={all:i.length,easy:i.filter(a=>a.level==="easy").length,medium:i.filter(a=>a.level==="medium").length,hard:i.filter(a=>a.level==="hard").length},c=t==="all"?i:i.filter(a=>a.level===t);return e.jsxs(b,{children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-[var(--text-2)] mb-2",children:"Practice"}),e.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-3",children:"🎯 Interview Q&A"}),e.jsx("p",{className:"text-[var(--text-2)] leading-relaxed max-w-xl",children:"35 questions — easy to hard, with real production scenarios. Click any question to reveal the answer, then mark it reviewed to track your progress."})]}),e.jsxs("div",{className:"sm:text-right flex-shrink-0",children:[e.jsxs("div",{className:"text-sm font-medium text-[var(--text-1)] mb-1",children:[l," / ",i.length," reviewed"]}),e.jsx("div",{className:"w-40 h-2 bg-[var(--border)] rounded-full overflow-hidden",children:e.jsx(d.div,{className:"h-full bg-[var(--success)] rounded-full",initial:{width:0},animate:{width:`${l/i.length*100}%`},transition:{duration:.4}})})]})]}),e.jsx("div",{className:"flex gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 w-fit",children:I.map(a=>e.jsxs("button",{onClick:()=>n(a.id),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${t===a.id?"bg-[var(--primary)] text-white":"text-[var(--text-2)] hover:text-[var(--text-1)]"}`,children:[a.label,e.jsx("span",{className:`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t===a.id?"bg-white/20 text-white":"bg-[var(--border)] text-[var(--text-2)]"}`,children:r[a.id]})]},a.id))}),e.jsx(g,{mode:"wait",children:e.jsx(d.div,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-4},transition:{duration:.18},className:"space-y-3",children:c.map(a=>e.jsx(C,{q:a,isReviewed:!!s[a.id],onToggleReviewed:()=>o(a.id)},a.id))},t)})]})}export{q as default};
