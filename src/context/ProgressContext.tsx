import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

const STORAGE_KEY = 'kafka-learn-progress'

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

interface ProgressContextValue {
  isComplete: (conceptId: string) => boolean
  markComplete: (conceptId: string) => void
  completedCount: number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress)

  const markComplete = useCallback((conceptId: string) => {
    setProgress(prev => {
      if (prev[conceptId]) return prev
      const next = { ...prev, [conceptId]: true }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isComplete = useCallback(
    (conceptId: string) => progress[conceptId] === true,
    [progress]
  )

  const completedCount = Object.values(progress).filter(Boolean).length

  return (
    <ProgressContext.Provider value={{ isComplete, markComplete, completedCount }}>
      {children}
    </ProgressContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook co-located with its provider by design
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
