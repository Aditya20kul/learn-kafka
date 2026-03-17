import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'

const Home = lazy(() => import('./pages/Home'))
const WhatIsKafka = lazy(() => import('./pages/WhatIsKafka'))
const TopicsAndPartitions = lazy(() => import('./pages/TopicsAndPartitions'))
const ProducersAndConsumers = lazy(() => import('./pages/ProducersAndConsumers'))
const ConsumerGroups = lazy(() => import('./pages/ConsumerGroups'))
const BrokersAndClusters = lazy(() => import('./pages/BrokersAndClusters'))
const OffsetsAndRetention = lazy(() => import('./pages/OffsetsAndRetention'))
const ReplicationAndFaultTolerance = lazy(() => import('./pages/ReplicationAndFaultTolerance'))
const InterviewQA = lazy(() => import('./pages/InterviewQA'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/what-is-kafka" element={<WhatIsKafka />} />
              <Route path="/topics-and-partitions" element={<TopicsAndPartitions />} />
              <Route path="/producers-and-consumers" element={<ProducersAndConsumers />} />
              <Route path="/consumer-groups" element={<ConsumerGroups />} />
              <Route path="/brokers-and-clusters" element={<BrokersAndClusters />} />
              <Route path="/offsets-and-retention" element={<OffsetsAndRetention />} />
              <Route path="/replication-and-fault-tolerance" element={<ReplicationAndFaultTolerance />} />
              <Route path="/interview-qa" element={<InterviewQA />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </AppShell>
    </BrowserRouter>
  )
}
