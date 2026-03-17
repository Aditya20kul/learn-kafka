import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
    >
      {children}
    </motion.div>
  )
}
