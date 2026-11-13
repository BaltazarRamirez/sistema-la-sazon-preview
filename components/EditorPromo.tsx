'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { guardarPromo } from '@/app/actions/menu'
import { labelTamano, tamanosDe, type Tamano } from '@/lib/catalogo'
import { pesos } from '@/lib/formato'
import type { PromoItem } from '@/lib/mock/promos'
import type { ProductoMenu } from '@/components/TablaMenu'
import { MensajeError } from '@/components/ui'

type Linea = PromoItem & { key: string }

function nuevaKey() {
  return `k-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function EditorPromo({
  promo,
  itemsInicial,
  catalogo,
}: {
  promo: ProductoMenu
  itemsInicial: PromoItem[]
  catalogo: ProductoMenu[]
}) {
  const router = useRouter()
  const elegibles = catalogo.filter(
    p => p.activo && p.categoria !== 'promo' && p.id !== promo.id,
  )
  const [lineas, setLineas] = useState<Linea[]>(() =>
    itemsInicial.map(i => ({ ...i, key: nuevaKey() })),
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  function agregar() {
    const primero = elegibles[0]
    if (!primero) return
    const tams = tamanosDe(primero.categoria)
    setLineas(prev => [
      ...prev,
      {
        key: nuevaKey(),
        producto_id: primero.id,
        tamano: tams[0] ?? 'simple',
        cantidad: 1,
      },
    ])
    setOk(false)
  }

  function setProducto(key: string, productoId: string) {
    const p = elegibles.find(x => x.id === productoId)
    const tams = p ? tamanosDe(p.categoria) : (['simple'] as Tamano[])
    setLineas(prev =>
      prev.map(l =>
        l.key === key
          ? {
              ...l,
              producto_id: productoId,
              tamano: tams.includes(l.tamano) ? l.tamano : (tams[0] ?? 'simple'),
            }
          : l,
      ),
    )
    setOk(false)
  }

  async function guardar() {
    setError(null)
    setOk(false)
    if (lineas.length === 0) return setError('Agregá al menos un producto del menú.')
    for (const l of lineas) {
      if (!l.producto_id) return setError('Elegí un producto en cada fila.')
      if (!(l.cantidad > 0)) return setError('La cantidad tiene que ser mayor a 0.')
    }
    setGuardando(true)
    const r = await guardarPromo(
      promo.id,
      lineas.map(({ producto_id, tamano, cantidad }) => ({ producto_id, tamano, cantidad })),
    )
    setGuardando(false)
    if (r.error) return setError(r.error)
    setOk(true)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--line-soft)] flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-[var(--gold)]">Contenido de la promo</p>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              Productos del menú (hamburguesa, papas, gaseosa…). No es una receta de insumos.
            </p>
          </div>
          <p className="tabular font-semibold text-sm">{pesos(promo.precio_simple)} combo</p>
        </div>

        {lineas.length === 0 ? (
          <div className="px-5 py-10 text-center sub">
            Todavía no hay productos en esta promo. Agregá ítems del catálogo.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line-soft)]">
            {lineas.map((l, idx) => {
              const prod = elegibles.find(p => p.id === l.producto_id) ?? catalogo.find(p => p.id === l.producto_id)
              const cat = prod?.categoria ?? 'hamburguesa'
              const tams = tamanosDe(cat)
              return (
                <li key={l.key} className="px-5 py-3.5 flex flex-wrap items-end gap-3">
                  <span className="text-xs tabular text-[var(--ink-mute)] w-5 pt-6">{idx + 1}</span>
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-[11px] text-[var(--ink-soft)] block mb-1">Producto</label>
                    <select
                      className="input"
                      value={l.producto_id}
                      onChange={e => setProducto(l.key, e.target.value)}
                    >
                      {elegibles.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[120px]">
                    <label className="text-[11px] text-[var(--ink-soft)] block mb-1">Tamaño</label>
                    <select
                      className="input"
                      value={l.tamano}
                      onChange={e => {
                        setLineas(prev =>
                          prev.map(x =>
                            x.key === l.key ? { ...x, tamano: e.target.value as Tamano } : x,
                          ),
                        )
                        setOk(false)
                      }}
                    >
                      {tams.map(t => (
                        <option key={t} value={t}>
                          {labelTamano(cat, t)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[72px]">
                    <label className="text-[11px] text-[var(--ink-soft)] block mb-1">Cant.</label>
                    <input
                      className="input"
                      inputMode="numeric"
                      value={l.cantidad}
                      onChange={e => {
                        const n = Number(e.target.value.replace(',', '.'))
                        setLineas(prev =>
                          prev.map(x =>
                            x.key === l.key ? { ...x, cantidad: Number.isFinite(n) ? n : 0 } : x,
                          ),
                        )
                        setOk(false)
                      }}
                    />
                  </div>
                  {prod && (
                    <Link
                      href={`/menu/${prod.id}`}
                      className="text-xs link pb-2.5 whitespace-nowrap"
                    >
                      Ver ficha
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm mb-0.5"
                    onClick={() => {
                      setLineas(prev => prev.filter(x => x.key !== l.key))
                      setOk(false)
                    }}
                  >
                    Quitar
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="px-5 py-4 border-t border-[var(--line-soft)] flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn btn-sm" onClick={agregar} disabled={elegibles.length === 0}>
            + Producto
          </button>
          <div className="flex items-center gap-2">
            {ok && <span className="text-xs text-[var(--ok)]">Guardado</span>}
            <button type="button" className="btn btn-primary" disabled={guardando} onClick={guardar}>
              {guardando ? 'Guardando…' : 'Guardar contenido'}
            </button>
          </div>
        </div>
      </div>
      <MensajeError error={error} />
    </div>
  )
}
