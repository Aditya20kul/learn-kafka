import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants = {
  primary: 'bg-[var(--primary)] text-white hover:opacity-90 active:opacity-80',
  secondary: 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-1)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
  ghost: 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface)]',
  danger: 'bg-[var(--danger)] text-white hover:opacity-90',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]',
        variants[variant],
        sizes[size],
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
