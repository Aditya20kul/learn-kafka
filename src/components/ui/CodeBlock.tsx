import { ReactNode, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  children: ReactNode
  label?: string
}

export function CodeBlock({ children, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const copyable = typeof children === 'string'

  function copy() {
    if (typeof children !== 'string') return
    navigator.clipboard?.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-[var(--border)]">
      {label && (
        <div className="bg-[var(--border)] px-4 py-2 text-xs text-[var(--text-2)] font-mono">
          {label}
        </div>
      )}
      {copyable && (
        <button
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] opacity-0 group-hover:opacity-100 hover:text-[var(--text-1)] transition-opacity"
        >
          {copied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
      <pre className="bg-[var(--bg)] px-4 py-4 overflow-x-auto text-sm font-mono text-[var(--text-1)] leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}
