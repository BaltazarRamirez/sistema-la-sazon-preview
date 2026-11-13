'use client'

import { useMemo, useState } from 'react'
import { labelTamano, type Tamano } from '@/lib/catalogo'
import { pesos } from '@/lib/formato'
import {
  GRUPOS_AGREGADO,
  precioMods,
  type AgregadoDef,
  type ModLinea,
} from '@/lib/mock/agregados'
import { agregadosPizza, defAgregadoPizza } from '@/lib/mock/agregados-pizza'
import type { CapaVisual, LineaRecetaMock } from '@/lib/mock/menu'
import { CapaFila, labelCapa } from '@/components/CapasIngredientes'
import { Modal } from '@/components/ui'
import type { ProductoCaja } from '@/components/PuntoDeVenta'

const FIJOS = new Set(['ins-masa', 'ins-caja-pizza', 'ins-salsa-tomate'])

type ItemBase = {
  insumo_id: string
  nombre: string
  capa: CapaVisual
  incluido: boolean
}

export default function EditorPizzita({
  producto,
  tamano,
  receta,
  inicial,
  onClose,
  onConfirm,
  modoCliente = false,
  confirmarLabel = 'Agregar al ticket',
}: {
  producto: ProductoCaja
  tamano: Tamano
  receta: LineaRecetaMock[]
  inicial?: ModLinea[]
  onClose: () => void
  onConfirm: (mods: ModLinea[]) => void
  modoCliente?: boolean
  confirmarLabel?: string
}) {
  const baseInicial = useMemo(() => {
    const vistos = new Set<string>()
    const items: ItemBase[] = []
    for (const l of receta) {
      if (FIJOS.has(l.insumo_id) || l.capa === 'caja' || l.capa === 'masa' || l.capa === 'salsa_tomate') continue
      if (vistos.has(l.insumo_id)) continue
      vistos.add(l.insumo_id)
      const quitado = inicial?.some(m => m.accion === 'quitar' && m.insumo_id === l.insumo_id)
      items.push({
        insumo_id: l.insumo_id,
        nombre: l.etiqueta,
        capa: l.capa,
        incluido: !quitado,
      })
    }
    return items
  }, [receta, inicial])

  const [base, setBase] = useState(baseInicial)
  const [extras, setExtras] = useState<{ insumo_id: string; cobrar: boolean }[]>(() =>
    (inicial ?? [])
      .filter(m => m.accion === 'agregar')
      .map(m => ({ insumo_id: m.insumo_id, cobrar: m.cobrar })),
  )
  const [pestania, setPestania] = useState<'base' | AgregadoDef['grupo']>('base')

  const mods: ModLinea[] = useMemo(() => {
    const out: ModLinea[] = []
    for (const b of base) {
      if (!b.incluido) {
        out.push({
          insumo_id: b.insumo_id,
          nombre: b.nombre,
          accion: 'quitar',
          cobrar: false,
          precio: 0,
          capa: b.capa,
        })
      }
    }
    for (const e of extras) {
      const def = defAgregadoPizza(e.insumo_id)
      if (!def) continue
      out.push({
        insumo_id: e.insumo_id,
        nombre: def.nombre,
        accion: 'agregar',
        cobrar: e.cobrar,
        precio: def.precio,
        capa: def.capa,
      })
    }
    return out
  }, [base, extras])

  const disponibles = agregadosPizza()

  const capasPreview = useMemo(() => {
    const capas: { capa: CapaVisual; etiqueta: string }[] = []
    for (const e of extras) {
      const def = defAgregadoPizza(e.insumo_id)
      if (def) capas.push({ capa: def.capa, etiqueta: def.nombre })
    }
    for (const b of base) {
      if (b.incluido) capas.push({ capa: b.capa, etiqueta: b.nombre })
    }
    capas.push({ capa: 'salsa_tomate', etiqueta: labelCapa('salsa_tomate') })
    capas.push({ capa: 'masa', etiqueta: labelCapa('masa') })
    return capas
  }, [base, extras])

  const cargoExtras = precioMods(mods)
  const precioBase = tamano === 'doble'
    ? (producto.precio_doble ?? 0)
    : producto.precio_simple

  function toggleBase(insumoId: string) {
    setBase(prev => prev.map(b => b.insumo_id === insumoId ? { ...b, incluido: !b.incluido } : b))
  }

  function toggleExtra(insumoId: string) {
    setExtras(prev => {
      if (prev.some(e => e.insumo_id === insumoId)) return prev.filter(e => e.insumo_id !== insumoId)
      const def = defAgregadoPizza(insumoId)
      const cobrar = modoCliente
        ? (def ? def.precio > 0 : true)
        : (def?.cobrar_por_defecto ?? true)
      return [...prev, { insumo_id: insumoId, cobrar }]
    })
  }

  function toggleCobrar(insumoId: string) {
    setExtras(prev => prev.map(e => e.insumo_id === insumoId ? { ...e, cobrar: !e.cobrar } : e))
  }

  return (
    <Modal
      open
      titulo={`Armar · ${producto.nombre}`}
      subtitulo={`${labelTamano(producto.categoria, tamano)} · base ${pesos(precioBase)}`}
      onClose={onClose}
      ancho="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,280px)_1fr] gap-5">
        <div className="rounded-xl border border-[var(--line-soft)] bg-black/20 p-3 self-start">
          <p className="eyebrow mb-2 text-center">Vista</p>
          <div className="flex flex-col">
            {capasPreview.map((c, i) => (
              <CapaFila
                key={`${c.capa}-${i}`}
                capa={c.capa}
                etiqueta={c.etiqueta}
                first={i === 0}
                overlap={-8}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex gap-1 bg-[var(--char)] border border-[var(--line-soft)] rounded-lg p-1 sticky top-0 z-10">
            {([
              { id: 'base' as const, label: 'Va en' },
              { id: 'topping' as const, label: GRUPOS_AGREGADO.topping },
              { id: 'extra' as const, label: GRUPOS_AGREGADO.extra },
              { id: 'aderezo' as const, label: 'Toque' },
            ]).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPestania(t.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                  pestania === t.id
                    ? 'bg-[var(--gold)] text-[var(--void)]'
                    : 'text-[var(--ink-soft)] hover:bg-white/[0.04] hover:text-[var(--ink)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {pestania === 'base' ? (
            <div>
              <p className="text-[11px] text-[var(--ink-soft)] mb-2">Desmarcá lo que no querés. Masa y salsa siempre van.</p>
              <ul className="space-y-1.5">
                {base.map(b => (
                  <li key={b.insumo_id}>
                    <label className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                      b.incluido
                        ? 'border-[var(--line-soft)] bg-white/[0.03]'
                        : 'border-[var(--danger)]/25 bg-[var(--danger-bg)]/40 opacity-80'
                    }`}>
                      <input type="checkbox" checked={b.incluido} onChange={() => toggleBase(b.insumo_id)} />
                      <span className={`flex-1 text-sm ${b.incluido ? '' : 'line-through text-[var(--ink-soft)]'}`}>{b.nombre}</span>
                      {!b.incluido && <span className="chip chip-danger">Sin</span>}
                    </label>
                  </li>
                ))}
                {base.length === 0 && <p className="text-xs text-[var(--ink-soft)]">Esta pizzita no tiene toppings editables.</p>}
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-[11px] text-[var(--ink-soft)] mb-2">
                {modoCliente ? 'Al sumarlos se agregan al precio.' : 'Marcá extras; cobrá o regalá con el tilde.'}
              </p>
              <ul className="space-y-1.5">
                {disponibles.filter(a => a.grupo === pestania).map(a => {
                  const on = extras.find(e => e.insumo_id === a.id)
                  const yaEnBase = base.some(b => b.insumo_id === a.id && b.incluido)
                  if (yaEnBase) return null
                  return (
                    <li key={a.id} className="rounded-lg border border-[var(--line-soft)] bg-white/[0.03] px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                          <input type="checkbox" checked={!!on} onChange={() => toggleExtra(a.id)} />
                          <span className="text-sm truncate">{a.nombre}</span>
                          <span className="text-[11px] text-[var(--ink-soft)] shrink-0">
                            {a.precio > 0 ? pesos(a.precio) : 'gratis'}
                          </span>
                        </label>
                        {on && !modoCliente && (
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer shrink-0">
                            <input type="checkbox" checked={on.cobrar} onChange={() => toggleCobrar(a.id)} />
                            Cobrar
                          </label>
                        )}
                      </div>
                      {on && (
                        <p className="text-[11px] mt-1 ml-7">
                          {on.cobrar && a.precio > 0
                            ? <span className="text-[var(--gold)]">+{pesos(a.precio)} al ticket</span>
                            : <span className="text-[var(--ok)]">Gratis · no suma al precio</span>}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[var(--line-soft)]">
        <div className="text-sm">
          <p>
            Total línea: <b className="tabular">{pesos(precioBase + cargoExtras)}</b>
            {cargoExtras > 0 && <span className="text-[var(--ink-soft)]"> · base {pesos(precioBase)} + extras {pesos(cargoExtras)}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn">Cancelar</button>
          <button type="button" onClick={() => onConfirm(mods)} className="btn btn-primary">
            {confirmarLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
