'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cambiarEstadoVenta } from '@/app/actions/ventas'
import { CANALES, ESTADO_COLOR, ESTADO_LABEL, MODALIDADES, labelTamano } from '@/lib/catalogo'
import { duracionHoras, fechaHora, linkWhatsApp, pesos } from '@/lib/formato'
import { COLUMNAS_COLA, labelAvanzar, siguienteEstado } from '@/lib/mock/ventas'
import type { VentaFila } from '@/components/ListaVentas'

export default function ColaVentas({ ventas: inicial }: { ventas: VentaFila[] }) {
  const router = useRouter()
  const [lista, setLista] = useState(inicial)
  const [guardando, setGuardando] = useState<string | null>(null)

  async function avanzar(v: VentaFila) {
    const next = siguienteEstado(v.estado, v.modalidad)
    if (!next) return
    setGuardando(v.id)
    setLista(prev => prev.map(x => x.id === v.id ? { ...x, estado: next } : x))
    const r = await cambiarEstadoVenta(v.id, next)
    setGuardando(null)
    if (r.error) {
      setLista(prev => prev.map(x => x.id === v.id ? { ...x, estado: v.estado } : x))
      return
    }
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {COLUMNAS_COLA.map(col => {
        const items = lista.filter(v => v.estado === col.id).sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime())
        return (
          <div key={col.id} className="card min-h-[220px] flex flex-col">
            <div className="card-head py-3 shrink-0">
              <h2 className="h2 text-base">{col.label}</h2>
              <span className="chip chip-neutral tabular">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-xs text-[var(--ink-mute)] text-center">Vacío</p>
            ) : (
              <ul className="divide-y divide-[var(--line-soft)]">
                {items.map(v => {
                  const horas = (Date.now() - new Date(v.creado_en).getTime()) / 3600000
                  const demorada = horas > 0.75 && (v.estado === 'pendiente' || v.estado === 'confirmado' || v.estado === 'en_preparacion')
                  const btn = labelAvanzar(v.estado, v.modalidad)
                  const wa = v.cliente_telefono
                    ? linkWhatsApp(v.cliente_telefono, `Hola${v.cliente_nombre ? ' ' + v.cliente_nombre.split(' ')[0] : ''}! Tu pedido #${v.numero} de La Sazón: ${v.items.map(i => `${i.cantidad}× ${i.nombre}`).join(', ')}. Total ${pesos(v.total)}.`)
                    : null
                  return (
                    <li key={v.id} className="px-3 py-3 space-y-2.5">
                      <div className="flex flex-wrap items-start gap-1.5 justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold break-words">
                            <span className="text-[var(--ink-soft)] tabular font-medium">#{v.numero}</span>{' '}
                            {v.mesa != null ? `Mesa ${v.mesa}` : (v.cliente_nombre ?? 'Consumidor final')}
                          </p>
                          <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 break-words">
                            {fechaHora(v.creado_en)} · {CANALES[v.canal] ?? v.canal} · {MODALIDADES[v.modalidad] ?? v.modalidad}
                            {v.mesa != null && v.cliente_nombre && !v.cliente_nombre.startsWith('Mesa ') ? ` · ${v.cliente_nombre}` : ''}
                          </p>
                        </div>
                        <span className={`chip shrink-0 ${demorada ? 'chip-danger' : ESTADO_COLOR[v.estado]}`}>
                          {demorada ? `Demorada · ${duracionHoras(horas)}` : ESTADO_LABEL[v.estado]}
                        </span>
                      </div>

                      <ul className="text-xs text-[var(--ink-soft)] space-y-0.5 break-words">
                        {v.items.map((it, i) => (
                          <li key={i}>
                            {it.cantidad}× {it.nombre}{' '}
                            <span className="text-[var(--ink-mute)]">({labelTamano(it.categoria, it.tamano)})</span>
                            {it.regalo ? ' · regalo' : ''}
                          </li>
                        ))}
                      </ul>

                      {v.direccion_entrega && (
                        <p className="text-[11px] text-[var(--ink-soft)] break-words">{v.direccion_entrega}</p>
                      )}
                      {v.notas && (
                        <p className="text-[11px] text-[var(--warn)] break-words">{v.notas}</p>
                      )}

                      <p className="font-semibold tabular text-sm">{pesos(v.total)}</p>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {wa && (
                            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm flex-1 min-w-[4.5rem]">
                              WA
                            </a>
                          )}
                          {v.cliente_id && (
                            <Link href={`/clientes/${v.cliente_id}`} className="btn btn-sm flex-1 min-w-[4.5rem]">
                              Cliente
                            </Link>
                          )}
                        </div>
                        {btn && (
                          <button
                            type="button"
                            disabled={guardando === v.id}
                            onClick={() => avanzar(v)}
                            className="btn btn-sm btn-primary w-full whitespace-normal text-center leading-snug py-2"
                          >
                            {guardando === v.id ? '...' : btn}
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
