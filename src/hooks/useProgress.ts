import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kafka-learn-progress'

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress)

  const markComplete = useCallback((conceptId: string) => {
    setProgress(prev => {
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

  return { progress, markComplete, isComplete, completedCount }
}
