import Link from 'next/link'

interface AlertaCardProps {
  count: number
  label: string
  detail: string
  href: string
  urgente?: boolean
}

export default function AlertaCard({ count, label, detail, href, urgente = false }: AlertaCardProps) {
  return (
    <Link
      href={href}
      className={`flex-1 min-w-[200px] rounded-xl border p-4 transition-all hover:-translate-y-0.5 ${
        urgente
          ? 'bg-[var(--danger-bg)] border-[var(--danger)]/35 hover:border-[var(--danger)]'
          : 'bg-[var(--surface)] border-[var(--line-soft)] hover:border-[var(--gold)]/40'
      }`}
    >
      <p className={`font-display text-[1.7rem] font-bold tabular ${urgente ? 'text-[var(--danger)]' : 'text-[var(--gold)]'}`}>
        {count}
      </p>
      <p className="text-sm font-medium text-[var(--ink)] mt-0.5">{label}</p>
      <p className="text-xs text-[var(--ink-soft)] mt-0.5">{detail}</p>
    </Link>
  )
}
