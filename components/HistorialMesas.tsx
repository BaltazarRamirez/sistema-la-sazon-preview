'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ESTADO_COLOR, ESTADO_LABEL, labelTamano } from '@/lib/catalogo'
import { fechaHora, pesos } from '@/lib/formato'
import type { ResumenMesa } from '@/lib/mock/ventas'

const TOTAL_MESAS = 12

export default function HistorialMesas({ mesas }: { mesas: ResumenMesa[] }) {
  const porNumero = useMemo(() => new Map(mesas.map(m => [m.mesa, m])), [mesas])
  const conDatos = mesas.filter(m => m.pedidos.length > 0)
  const primeraConDatos = conDatos[0]?.mesa ?? null
  const [abierta, setAbierta] = useState<number | null>(primeraConDatos)

  const detalle = abierta != null ? porNumero.get(abierta) ?? null : null
  const vacia = abierta != null && !detalle

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {Array.from({ length: TOTAL_MESAS }, (_, i) => i + 1).map(n => {
          const m = porNumero.get(n)
          const activa = abierta === n
          const ocupada = !!m && m.pedidos.length > 0
          const itemsResumen = ocupada
            ? m!.pedidos.flatMap(v => v.items).slice(0, 3)
            : []
          const masItems = ocupada
            ? Math.max(0, m!.pedidos.reduce((a, v) => a + v.items.length, 0) - 3)
            : 0

          return (
            <button
              key={n}
              type="button"
              onClick={() => setAbierta(n)}
              className={`aspect-square rounded-2xl border p-3 flex flex-col text-left transition-colors ${
                activa
                  ? 'border-[var(--gold)] bg-[var(--gold)]/12 ring-1 ring-[var(--gold)]/40'
                  : ocupada
                    ? 'border-[var(--line-soft)] bg-[var(--surface)] hover:border-[var(--gold)]/40'
                    : 'border-dashed border-[var(--line)] bg-[var(--char)]/40 hover:border-[var(--ink-mute)]'
              }`}
            >
              <div className="flex items-start justify-between gap-1 shrink-0">
                <p className={`font-display text-lg font-bold leading-none ${ocupada ? '' : 'text-[var(--ink-mute)]'}`}>
                  {n}
                </p>
                {ocupada ? (
                  m!.abiertos > 0 ? (
                    <span className="chip chip-warn text-[10px] px-1.5 py-0.5">{m!.abiertos} abiertos</span>
                  ) : (
                    <span className="chip chip-ok text-[10px] px-1.5 py-0.5">ok</span>
                  )
                ) : (
                  <span className="text-[10px] text-[var(--ink-mute)] font-medium">libre</span>
                )}
              </div>

              <p className={`eyebrow mt-2 mb-1 ${ocupada ? '' : 'text-[var(--ink-mute)]'}`}>Mesa {n}</p>

              {ocupada ? (
                <>
                  <ul className="flex-1 min-h-0 space-y-0.5 overflow-hidden text-[11px] text-[var(--ink-soft)] leading-snug">
                    {itemsResumen.map((it, idx) => (
                      <li key={idx} className="truncate">
                        {it.cantidad}× {it.nombre.replace(/\s*\(.*\)$/, '')}
                      </li>
                    ))}
                    {masItems > 0 && (
                      <li className="text-[var(--ink-mute)]">+{masItems} más</li>
                    )}
                  </ul>
                  <p className="mt-auto pt-2 tabular text-sm font-semibold text-[var(--gold)] shrink-0">
                    {pesos(m!.total)}
                  </p>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-[11px] text-[var(--ink-mute)] leading-snug">Sin pedidos</p>
                  <p className="tabular text-sm font-medium text-[var(--ink-mute)]/70 mt-1">{pesos(0)}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {abierta != null && (
        <div className="card overflow-hidden anim-fade-up">
          <div className="card-head flex-wrap gap-2">
            <div>
              <h2 className="h2">Mesa {abierta}</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                {vacia
                  ? 'Todavía no pidieron nada en esta mesa'
                  : <>Historial · total a cobrar <b className="tabular text-[var(--gold)]">{pesos(detalle!.total)}</b></>}
              </p>
            </div>
            <Link href={`/carta?mesa=${abierta}`} target="_blank" className="btn btn-sm">
              Abrir carta QR
            </Link>
          </div>

          {vacia ? (
            <div className="px-6 py-10 text-center space-y-2">
              <p className="font-display text-lg font-semibold text-[var(--ink-mute)]">Mesa libre</p>
              <p className="text-sm text-[var(--ink-soft)] max-w-sm mx-auto">
                Cuando escaneen el QR de la mesa {abierta} y manden un pedido, aparece acá el detalle y el total.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-[var(--line-soft)]">
                {detalle!.pedidos.map(v => (
                  <li key={v.id} className="px-5 py-4 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          <span className="text-[var(--ink-soft)] tabular">#{v.numero}</span>{' '}
                          {fechaHora(v.creado_en)}
                        </p>
                        {v.notas && <p className="text-[11px] text-[var(--ink-mute)] mt-0.5">{v.notas}</p>}
                      </div>
                      <span className={`chip ${ESTADO_COLOR[v.estado]}`}>{ESTADO_LABEL[v.estado]}</span>
                    </div>
                    <ul className="text-xs text-[var(--ink-soft)] space-y-0.5">
                      {v.items.map((it, i) => (
                        <li key={i}>
                          {it.cantidad}× {it.nombre}{' '}
                          <span className="text-[var(--ink-mute)]">({labelTamano(it.categoria, it.tamano)})</span>
                          {' · '}
                          <span className="tabular">{pesos(it.precio * it.cantidad)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-semibold tabular text-sm">{pesos(v.total)}</p>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-4 border-t border-[var(--line-soft)] flex items-center justify-between gap-3 bg-white/[0.02]">
                <p className="text-sm text-[var(--ink-soft)]">Total mesa</p>
                <p className="font-display text-xl font-bold tabular text-[var(--gold)]">{pesos(detalle!.total)}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
