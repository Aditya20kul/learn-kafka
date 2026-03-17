export interface SimStep {
  id: string
  label: string
  description: string
}

export const messageFlowSteps: SimStep[] = [
  { id: 'idle', label: 'Ready', description: 'Producer is ready to send a message.' },
  { id: 'produce', label: 'Producing', description: 'Producer sends a message to the topic.' },
  { id: 'broker-receive', label: 'Broker Receives', description: 'Broker receives the message and appends it to the partition log.' },
  { id: 'ack', label: 'Acknowledgment', description: 'Broker sends acknowledgment back to the producer.' },
  { id: 'consumer-poll', label: 'Consumer Polls', description: 'Consumer polls the broker for new messages.' },
  { id: 'consumer-receive', label: 'Message Delivered', description: 'Consumer receives and processes the message.' },
  { id: 'commit', label: 'Offset Committed', description: 'Consumer commits its new offset position.' },
]

export const partitionSteps: SimStep[] = [
  { id: 'idle', label: 'Ready', description: 'Click send to route a message.' },
  { id: 'send-0', label: 'Message 1', description: 'First message sent.' },
  { id: 'send-1', label: 'Message 2', description: 'Second message sent.' },
  { id: 'send-2', label: 'Message 3', description: 'Third message sent.' },
  { id: 'send-3', label: 'Message 4', description: 'Fourth message routed.' },
  { id: 'complete', label: 'Complete', description: 'All messages distributed across partitions.' },
]

export const offsetSteps: SimStep[] = [
  { id: 'idle', label: 'Ready', description: 'Three messages in the partition. Consumer at offset 0.' },
  { id: 'read-0', label: 'Read msg 0', description: 'Consumer reads message at offset 0.' },
  { id: 'read-1', label: 'Read msg 1', description: 'Consumer reads message at offset 1.' },
  { id: 'commit-1', label: 'Commit offset 2', description: 'Consumer commits offset 2 (processed up to 1).' },
  { id: 'read-2', label: 'Read msg 2', description: 'Consumer reads message at offset 2.' },
  { id: 'crash', label: 'Consumer Crash!', description: 'Consumer crashes before committing offset 3.' },
  { id: 'restart', label: 'Restart', description: 'Consumer restarts and resumes from committed offset 2.' },
]

export const replicationSteps: SimStep[] = [
  { id: 'idle', label: 'Ready', description: 'Producer sending with acks=all. Leader + 2 followers.' },
  { id: 'produce', label: 'Produce', description: 'Producer sends message to leader.' },
  { id: 'leader-write', label: 'Leader Writes', description: 'Leader appends message to its log.' },
  { id: 'replicate', label: 'Replicating', description: 'Leader replicates to all ISR followers.' },
  { id: 'follower-ack', label: 'Followers Ack', description: 'Both followers acknowledge the write.' },
  { id: 'producer-ack', label: 'Producer Ack', description: 'Leader sends final ack to producer. Fully durable!' },
]
