'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface Props {
  label: string
  value: string
  hint?: string
  trend?: { label: string; positive: boolean } | null
  sparkline?: number[]
  accent?: 'ember' | 'ink' | 'danger' | 'ok' | 'neutral' | 'gold'
}

const ACCENT_COLOR: Record<string, string> = {
  ember: '#1f6b3a',
  gold: '#fce4b4',
  ink: '#f7ecd8',
  danger: '#c45c45',
  ok: '#5f9e58',
  neutral: '#6f7d68',
}

export default function KpiCard({ label, value, hint, trend, sparkline, accent = 'gold' }: Props) {
  const color = ACCENT_COLOR[accent]
  const data = (sparkline ?? []).map((v, i) => ({ i, v }))
  const idGradiente = `spark-${label.replace(/[^a-z0-9]/gi, '')}`

  return (
    <div className="card p-5 relative overflow-hidden group">
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-10"
        style={{ background: color }}
      />
      <p className="eyebrow mb-2">{label}</p>
      <div className="flex items-end justify-between gap-2 relative">
        <div className="min-w-0">
          <p className="font-display text-[1.65rem] md:text-[1.85rem] font-bold text-[var(--ink)] tabular leading-tight tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.positive ? 'text-[var(--ok)]' : 'text-[var(--danger)]'}`}>
              {trend.positive ? '↗' : '↘'} {trend.label}
            </p>
          )}
          {hint && <p className="text-xs text-[var(--ink-soft)] mt-1.5">{hint}</p>}
        </div>
        {data.length > 1 && (
          <div className="w-20 h-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#${idGradiente})`} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
