'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { labelTamano, precioDe, type Tamano } from '@/lib/catalogo'
import { pesos } from '@/lib/formato'
import { imagenCarta } from '@/lib/mock/carta-imagenes'
import { precioMods, resumenMods, type ModLinea } from '@/lib/mock/agregados'
import { detallePromo } from '@/lib/mock/promos'
import type { LineaRecetaMock } from '@/lib/mock/menu'
import type { ProductoMenu } from '@/components/TablaMenu'
import EditorHamburguesa from '@/components/EditorHamburguesa'
import EditorPizzita from '@/components/EditorPizzita'

export type LineaPromoArmada = {
  producto_id: string
  nombre: string
  categoria: string
  tamano: Tamano
  cantidad: number
  precio: number
  mods: ModLinea[]
  mods_resumen: string
  extra: number
  precio_override: number
  promo_nombre: string
}

type PasoHecho = {
  mods: ModLinea[]
}

export default function PromoArmar({
  promo,
  productos,
  recetas,
  onClose,
  onDone,
}: {
  promo: ProductoMenu
  productos: ProductoMenu[]
  recetas: Record<string, LineaRecetaMock[]>
  onClose: () => void
  onDone: (lineas: LineaPromoArmada[]) => void
}) {
  const det = detallePromo(promo.id)
  const pasos = useMemo(() => {
    if (!det) return []
    return det.items.flatMap(it => {
      const p = productos.find(x => x.id === it.producto_id)
      if (!p) return []
      return Array.from({ length: it.cantidad }, () => ({
        producto: p,
        tamano: it.tamano,
      }))
    })
  }, [det, productos])

  const [idx, setIdx] = useState(0)
  const [hechos, setHechos] = useState<PasoHecho[]>([])
  const [editando, setEditando] = useState(false)

  const actual = pasos[idx]
  const precioPromo = promo.precio_simple
  const totalPasos = pasos.length

  function preciosBase() {
    return pasos.map(({ producto, tamano }) => precioDe(producto, tamano) ?? 0)
  }

  function compartir(lista: number[], total: number) {
    const sum = lista.reduce((a, n) => a + n, 0)
    if (sum <= 0) return lista.map(() => Math.round(total / Math.max(1, lista.length)))
    const raw = lista.map(n => (n / sum) * total)
    const floors = raw.map(n => Math.floor(n))
    let resto = total - floors.reduce((a, n) => a + n, 0)
    const out = [...floors]
    for (let i = 0; i < out.length && resto > 0; i++) {
      out[i] += 1
      resto -= 1
    }
    return out
  }

  function avanzar(mods: ModLinea[]) {
    const nextHechos = [...hechos]
    nextHechos[idx] = { mods }
    setHechos(nextHechos)
    setEditando(false)

    if (idx + 1 < totalPasos) {
      setIdx(idx + 1)
      const siguiente = pasos[idx + 1]
      if (siguiente && (siguiente.producto.categoria === 'hamburguesa' || siguiente.producto.categoria === 'pizzita')) {
        // el usuario puede editar o seguir; no forzar modal
      }
      return
    }

    const bases = preciosBase()
    const shares = compartir(bases, precioPromo)
    const lineas: LineaPromoArmada[] = pasos.map((paso, i) => {
      const mods = nextHechos[i]?.mods ?? []
      const extra = precioMods(mods)
      const resumen = resumenMods(mods)
      return {
        producto_id: paso.producto.id,
        nombre: paso.producto.nombre,
        categoria: paso.producto.categoria,
        tamano: paso.tamano,
        cantidad: 1,
        precio: shares[i] + extra,
        mods,
        mods_resumen: [resumen, `promo ${promo.nombre}`].filter(Boolean).join(' · '),
        extra,
        precio_override: shares[i],
        promo_nombre: promo.nombre,
      }
    })
    onDone(lineas)
  }

  if (!det || !actual) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="card p-6 max-w-sm text-center space-y-3">
          <p className="text-sm text-[var(--ink-soft)]">Esta promo no tiene productos cargados.</p>
          <button type="button" className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    )
  }

  const editable = actual.producto.categoria === 'hamburguesa' || actual.producto.categoria === 'pizzita'
  const img = imagenCarta(actual.producto.id, actual.producto.categoria)

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/55" onClick={onClose}>
        <div
          className="card w-full max-w-lg rounded-b-none sm:rounded-b-xl max-h-[92vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-5 pt-5 pb-3 border-b border-[var(--line-soft)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-[var(--gold)]">Armar promo · {idx + 1}/{totalPasos}</p>
                <h2 className="font-display text-lg font-semibold mt-1">{promo.nombre}</h2>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  Precio fijo {pesos(precioPromo)} · vas eligiendo cada producto
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-[var(--ink-soft)] text-xl px-1" aria-label="Cerrar">×</button>
            </div>
            <div className="flex gap-1 mt-3">
              {pasos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= idx ? 'bg-[var(--ember)]' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div className="flex gap-3 items-start">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold">{actual.producto.nombre}</p>
                <p className="text-sm text-[var(--ink-soft)] mt-0.5">
                  {labelTamano(actual.producto.categoria, actual.tamano)}
                  {actual.producto.descripcion ? ` · ${actual.producto.descripcion}` : ''}
                </p>
              </div>
            </div>

            <ul className="rounded-xl border border-[var(--line-soft)] divide-y divide-[var(--line-soft)] text-sm">
              {pasos.map((p, i) => (
                <li
                  key={`${p.producto.id}-${i}`}
                  className={`px-3 py-2 flex justify-between gap-2 ${i === idx ? 'bg-[var(--gold)]/10' : i < idx ? 'opacity-70' : 'opacity-50'}`}
                >
                  <span className="truncate">
                    {i < idx ? '✓ ' : i === idx ? '→ ' : ''}
                    {p.producto.nombre}
                  </span>
                  <span className="text-[11px] text-[var(--ink-mute)] shrink-0">
                    {labelTamano(p.producto.categoria, p.tamano)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2">
              {editable && (
                <button type="button" className="btn w-full py-3" onClick={() => setEditando(true)}>
                  {actual.producto.categoria === 'pizzita' ? 'Editar (sin / toppings)' : 'Editar (sin / extras)'}
                </button>
              )}
              <button type="button" className="btn btn-ember w-full py-3" onClick={() => avanzar([])}>
                {idx + 1 < totalPasos
                  ? editable
                    ? 'Seguir así →'
                    : 'Siguiente →'
                  : 'Agregar promo al pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {editando && actual.producto.categoria === 'hamburguesa' && (
        <EditorHamburguesa
          producto={actual.producto}
          tamano={actual.tamano}
          receta={recetas[actual.producto.id] ?? []}
          modoCliente
          confirmarLabel={idx + 1 < totalPasos ? 'Listo · siguiente' : 'Listo · agregar promo'}
          onClose={() => setEditando(false)}
          onConfirm={mods => avanzar(mods)}
        />
      )}
      {editando && actual.producto.categoria === 'pizzita' && (
        <EditorPizzita
          producto={actual.producto}
          tamano={actual.tamano}
          receta={recetas[actual.producto.id] ?? []}
          modoCliente
          confirmarLabel={idx + 1 < totalPasos ? 'Listo · siguiente' : 'Listo · agregar promo'}
          onClose={() => setEditando(false)}
          onConfirm={mods => avanzar(mods)}
        />
      )}
    </>
  )
}
