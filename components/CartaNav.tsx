'use client'

export default function CartaNav({
  categorias,
  activa,
  onChange,
}: {
  categorias: { id: string; label: string }[]
  activa: string
  onChange: (id: string) => void
}) {
  return (
    <nav className="sticky top-0 z-20 mb-6 backdrop-blur-md bg-[var(--char)]/85 border-y border-[var(--line-soft)]">
      <div className="max-w-xl mx-auto px-3 flex gap-1 overflow-x-auto py-2.5 scrollbar-none">
        {categorias.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activa === c.id
                ? 'bg-[var(--ember)] text-[var(--ink)]'
                : 'text-[var(--ink-soft)] hover:bg-white/[0.05] hover:text-[var(--ink)]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
