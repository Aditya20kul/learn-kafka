/**
 * Renders markdown-lite inline: **bold**, `code`, and newlines.
 * Shared by the Debugging and Reference pages so the parsing lives in one place.
 */
export function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-[var(--text-1)] font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-[0.85em] bg-[var(--border)]/40 text-[var(--primary)] px-1 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part === '\n') return <br key={i} />
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
