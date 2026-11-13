'use client'

import { useState } from 'react'
import { ESTADO_COLOR, ESTADO_LABEL, labelTamano } from '@/lib/catalogo'
import { fechaHora, pesos } from '@/lib/formato'
import type { VentaFila } from '@/components/ListaVentas'

export default function CartaHistorialMesa({
  mesa,
  pedidos,
}: {
  mesa: number
  pedidos: VentaFila[]
}) {
  const [abierto, setAbierto] = useState(false)
  if (!pedidos.length) return null

  const total = pedidos.reduce((a, p) => a + p.total, 0)

  return (
    <div className="relative max-w-xl mx-auto px-4 mb-4">
      <button
        type="button"
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-4 py-3 text-left"
      >
        <div>
          <p className="text-xs font-semibold text-[var(--gold)]">Historial mesa {mesa}</p>
          <p className="text-[13px] text-[var(--ink-soft)] mt-0.5">
            {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} · total{' '}
            <span className="tabular font-semibold text-[var(--ink)]">{pesos(total)}</span>
          </p>
        </div>
        <span className="text-[var(--ink-soft)] text-sm">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <ul className="mt-2 rounded-xl border border-[var(--line-soft)] bg-[var(--surface)] divide-y divide-[var(--line-soft)] overflow-hidden">
          {pedidos.map(v => (
            <li key={v.id} className="px-4 py-3 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-[var(--ink-soft)]">
                  #{v.numero} · {fechaHora(v.creado_en)}
                </p>
                <span className={`chip ${ESTADO_COLOR[v.estado]}`}>{ESTADO_LABEL[v.estado]}</span>
              </div>
              <ul className="text-xs text-[var(--ink-soft)] space-y-0.5">
                {v.items.map((it, i) => (
                  <li key={i}>
                    {it.cantidad}× {it.nombre}{' '}
                    <span className="text-[var(--ink-mute)]">({labelTamano(it.categoria, it.tamano)})</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold tabular">{pesos(v.total)}</p>
            </li>
          ))}
          <li className="px-4 py-3 flex justify-between items-center bg-white/[0.02]">
            <span className="text-sm text-[var(--ink-soft)]">Total mesa</span>
            <span className="font-display font-bold tabular text-[var(--gold)]">{pesos(total)}</span>
          </li>
        </ul>
      )}
    </div>
  )
}
