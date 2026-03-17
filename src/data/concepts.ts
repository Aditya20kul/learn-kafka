export interface Concept {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  teaser: string
  icon: string
  color: string
  order: number
}

export const concepts: Concept[] = [
  {
    id: 'what-is-kafka',
    slug: '/what-is-kafka',
    title: 'What is Kafka?',
    shortTitle: 'What is Kafka?',
    description: 'Apache Kafka is a distributed event streaming platform capable of handling trillions of events per day.',
    teaser: 'A distributed commit log that connects everything.',
    icon: '⚡',
    color: '#6366F1',
    order: 1,
  },
  {
    id: 'topics-and-partitions',
    slug: '/topics-and-partitions',
    title: 'Topics & Partitions',
    shortTitle: 'Topics & Partitions',
    description: 'Topics are logical channels for messages. Partitions enable parallelism and horizontal scaling.',
    teaser: 'How Kafka organizes and scales message streams.',
    icon: '📂',
    color: '#06B6D4',
    order: 2,
  },
  {
    id: 'producers-and-consumers',
    slug: '/producers-and-consumers',
    title: 'Producers & Consumers',
    shortTitle: 'Producers & Consumers',
    description: 'Producers write messages to topics. Consumers read messages at their own pace using offsets.',
    teaser: 'The two actors in every Kafka interaction.',
    icon: '🔄',
    color: '#10B981',
    order: 3,
  },
  {
    id: 'consumer-groups',
    slug: '/consumer-groups',
    title: 'Consumer Groups',
    shortTitle: 'Consumer Groups',
    description: 'Consumer groups enable parallel consumption by distributing partitions across group members.',
    teaser: 'How multiple consumers share the work.',
    icon: '👥',
    color: '#F59E0B',
    order: 4,
  },
  {
    id: 'brokers-and-clusters',
    slug: '/brokers-and-clusters',
    title: 'Brokers & Clusters',
    shortTitle: 'Brokers & Clusters',
    description: 'Brokers are Kafka servers. A cluster of brokers provides fault tolerance and scalability.',
    teaser: 'The distributed backbone of Kafka.',
    icon: '🖥️',
    color: '#8B5CF6',
    order: 5,
  },
  {
    id: 'offsets-and-retention',
    slug: '/offsets-and-retention',
    title: 'Offsets & Retention',
    shortTitle: 'Offsets & Retention',
    description: 'Offsets track consumer position in a partition. Retention policies control how long messages are kept.',
    teaser: 'The bookmark system that enables replay.',
    icon: '📍',
    color: '#F59E0B',
    order: 6,
  },
  {
    id: 'replication-and-fault-tolerance',
    slug: '/replication-and-fault-tolerance',
    title: 'Replication & Fault Tolerance',
    shortTitle: 'Replication',
    description: 'Kafka replicates partitions across brokers. Leaders handle reads/writes, followers stay in sync.',
    teaser: 'How Kafka survives broker failures.',
    icon: '🛡️',
    color: '#EF4444',
    order: 7,
  },
]
