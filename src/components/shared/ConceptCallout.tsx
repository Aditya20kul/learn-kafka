import { ReactNode } from 'react'
import { Lightbulb, AlertTriangle, Info } from 'lucide-react'
import { clsx } from 'clsx'

interface ConceptCalloutProps {
  type?: 'insight' | 'warning' | 'info'
  title: string
  children: ReactNode
}

const styles = {
  insight: {
    wrapper: 'bg-[var(--primary)]/10 border-[var(--primary)]/40',
    icon: 'text-[var(--primary)]',
    title: 'text-[var(--primary)]',
    Icon: Lightbulb,
  },
  warning: {
    wrapper: 'bg-[var(--accent)]/10 border-[var(--accent)]/40',
    icon: 'text-[var(--accent)]',
    title: 'text-[var(--accent)]',
    Icon: AlertTriangle,
  },
  info: {
    wrapper: 'bg-[var(--secondary)]/10 border-[var(--secondary)]/40',
    icon: 'text-[var(--secondary)]',
    title: 'text-[var(--secondary)]',
    Icon: Info,
  },
}

export function ConceptCallout({ type = 'insight', title, children }: ConceptCalloutProps) {
  const s = styles[type]
  const Icon = s.Icon
  return (
    <div className={clsx('rounded-xl border p-4 my-4', s.wrapper)}>
      <div className={clsx('flex items-center gap-2 mb-2 font-semibold text-sm', s.title)}>
        <Icon size={16} className={s.icon} />
        {title}
      </div>
      <div className="text-sm text-[var(--text-2)] leading-relaxed">{children}</div>
    </div>
  )
}
