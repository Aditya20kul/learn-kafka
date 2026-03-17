import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react'
import { SimulationControls } from '../../hooks/useSimulation'
import { Button } from '../ui/Button'

interface StepControlsProps {
  controls: SimulationControls
  steps?: Array<{ label: string; description: string }>
}

export function StepControls({ controls, steps }: StepControlsProps) {
  const { state, currentStep, totalSteps, play, pause, step, reset, speed, setSpeed } = controls
  const isPlaying = state === 'playing'
  const isComplete = state === 'complete'

  const currentStepInfo = steps?.[currentStep]

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      {/* Step info */}
      {currentStepInfo && (
        <div className="mb-4 min-h-[44px]">
          <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
            Step {currentStep + 1} / {totalSteps} — {currentStepInfo.label}
          </div>
          <div className="text-sm text-[var(--text-2)]">{currentStepInfo.description}</div>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[var(--border)] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
          style={{ width: `${((currentStep) / Math.max(totalSteps - 1, 1)) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button size="sm" onClick={pause} aria-label="Pause">
              <Pause size={14} />
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={play} aria-label="Play">
              <Play size={14} />
              {isComplete ? 'Replay' : 'Play'}
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={step} disabled={isComplete && !isPlaying} aria-label="Step forward">
            <SkipForward size={14} />
            Step
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset">
            <RotateCcw size={14} />
          </Button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
          <Gauge size={14} />
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-1)] focus:outline-none"
            aria-label="Playback speed"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
        </div>
      </div>
    </div>
  )
}
