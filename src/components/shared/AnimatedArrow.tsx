import { motion } from 'framer-motion'

interface AnimatedArrowProps {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  animated?: boolean
  label?: string
  dashed?: boolean
  id?: string
}

export function AnimatedArrow({
  x1, y1, x2, y2,
  color = 'var(--border)',
  animated = false,
  label,
  dashed = false,
  id,
}: AnimatedArrowProps) {
  const arrowId = id || `arrow-${x1}-${y1}`
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)

  return (
    <g>
      <defs>
        <marker
          id={arrowId}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      {animated ? (
        <motion.line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? '6 4' : `${len}`}
          markerEnd={`url(#${arrowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      ) : (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={dashed ? '6 4' : undefined}
          markerEnd={`url(#${arrowId})`}
          opacity={0.5}
        />
      )}
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          textAnchor="middle"
          fontSize={10}
          fill="var(--text-2)"
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  )
}
