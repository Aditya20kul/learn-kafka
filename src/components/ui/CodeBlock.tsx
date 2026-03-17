import { ReactNode } from 'react'

interface CodeBlockProps {
  children: ReactNode
  label?: string
}

export function CodeBlock({ children, label }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)]">
      {label && (
        <div className="bg-[var(--border)] px-4 py-2 text-xs text-[var(--text-2)] font-mono">
          {label}
        </div>
      )}
      <pre className="bg-[var(--bg)] px-4 py-4 overflow-x-auto text-sm font-mono text-[var(--text-1)] leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}
