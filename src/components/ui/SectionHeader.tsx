interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-[var(--text-1)]">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-[var(--text-2)]">{subtitle}</p>
      )}
    </div>
  )
}
