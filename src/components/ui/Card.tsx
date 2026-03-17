import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, hover, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5',
        hover && 'transition-all duration-200 hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
