interface NodeBoxProps {
  x: number
  y: number
  width?: number
  height?: number
  label: string
  sublabel?: string
  color?: string
  active?: boolean
  failed?: boolean
  leader?: boolean
}

export function NodeBox({
  x, y, width = 120, height = 56, label, sublabel, color = 'var(--primary)',
  active = false, failed = false, leader = false,
}: NodeBoxProps) {
  const fill = failed ? 'var(--danger)' : active ? color : 'var(--surface)'
  const stroke = failed ? 'var(--danger)' : active ? color : 'var(--border)'
  const textColor = (active || failed) ? '#fff' : 'var(--text-1)'
  const subTextColor = (active || failed) ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'

  return (
    <g transform={`translate(${x - width / 2}, ${y - height / 2})`}>
      <rect
        width={width}
        height={height}
        rx={10}
        ry={10}
        fill={fill}
        stroke={stroke}
        strokeWidth={active || failed ? 2 : 1.5}
        style={{ filter: active ? `drop-shadow(0 0 8px ${color}60)` : 'none' }}
      />
      {leader && (
        <text
          x={width - 8}
          y={12}
          textAnchor="middle"
          fontSize={10}
          fill="var(--accent)"
          fontFamily="Inter, sans-serif"
          fontWeight={600}
        >
          L
        </text>
      )}
      <text
        x={width / 2}
        y={sublabel ? height / 2 - 4 : height / 2 + 5}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={textColor}
        fontFamily="Inter, sans-serif"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={width / 2}
          y={height / 2 + 12}
          textAnchor="middle"
          fontSize={10}
          fill={subTextColor}
          fontFamily="Inter, sans-serif"
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}
