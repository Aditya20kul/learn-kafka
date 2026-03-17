import { useState, useCallback } from 'react'
import { useInterval } from './useInterval'

export type SimState = 'idle' | 'playing' | 'paused' | 'stepping' | 'complete'

export interface SimulationControls {
  state: SimState
  currentStep: number
  totalSteps: number
  play: () => void
  pause: () => void
  step: () => void
  reset: () => void
  speed: number
  setSpeed: (n: number) => void
}

export function useSimulation(totalSteps: number): SimulationControls {
  const [state, setState] = useState<SimState>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState(1)

  const advance = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1
      if (next >= totalSteps) {
        setState('complete')
        return totalSteps - 1
      }
      return next
    })
  }, [totalSteps])

  useInterval(
    advance,
    state === 'playing' ? Math.round(1200 / speed) : null
  )

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0)
    }
    setState('playing')
  }, [currentStep, totalSteps])

  const pause = useCallback(() => {
    setState('paused')
  }, [])

  const step = useCallback(() => {
    setState('stepping')
    setCurrentStep(prev => {
      const next = prev + 1
      if (next >= totalSteps) {
        setState('complete')
        return totalSteps - 1
      }
      return next
    })
  }, [totalSteps])

  const reset = useCallback(() => {
    setState('idle')
    setCurrentStep(0)
  }, [])

  return {
    state,
    currentStep,
    totalSteps,
    play,
    pause,
    step,
    reset,
    speed,
    setSpeed,
  }
}
