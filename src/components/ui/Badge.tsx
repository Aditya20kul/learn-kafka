import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'accent' | 'danger' | 'neutral'
  className?: string
}

const variants = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/30',
  success: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30',
  danger: 'bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30',
  neutral: 'bg-[var(--border)] text-[var(--text-2)] border-[var(--border)]',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
