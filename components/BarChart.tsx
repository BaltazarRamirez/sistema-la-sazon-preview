'use client'

import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { label: string; value: number }[]
  color?: string
  horizontal?: boolean
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1c1815',
  border: '1px solid rgba(255,236,210,0.12)',
  borderRadius: '10px',
  color: '#f4ebe0',
  fontSize: '12px',
}

export default function BarChart({ data, color = '#d4bc8a', horizontal = false }: Props) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <ReBarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 90, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,236,210,0.08)" horizontal={false} />
          <XAxis type="number" stroke="#6f6356" tick={{ fill: '#a89886', fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="label" stroke="#6f6356" tick={{ fill: '#a89886', fontSize: 11 }} width={85} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} fill={color} />
        </ReBarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <ReBarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,236,210,0.08)" vertical={false} />
        <XAxis dataKey="label" stroke="#6f6356" tick={{ fill: '#a89886', fontSize: 11 }} />
        <YAxis stroke="#6f6356" tick={{ fill: '#a89886', fontSize: 11 }} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(232,184,74,0.06)' }} />
        <Bar dataKey="value" radius={[5, 5, 0, 0]} fill={color} maxBarSize={26} />
      </ReBarChart>
    </ResponsiveContainer>
  )
}
