'use client'

import Image from 'next/image'
import { useMemo, useState, useTransition } from 'react'
import { crearPedidoCarta } from '@/app/actions/carta'
import { CATEGORIAS, labelTamano, precioDe, tamanosDe, type Tamano } from '@/lib/catalogo'
import { pesos } from '@/lib/formato'
import { imagenCarta } from '@/lib/mock/carta-imagenes'
import { precioMods, resumenMods, type ModLinea } from '@/lib/mock/agregados'
import { detallePromo } from '@/lib/mock/promos'
import type { CapaVisual, LineaRecetaMock } from '@/lib/mock/menu'
import type { ProductoMenu } from '@/components/TablaMenu'
import { CapaFila, labelCapa } from '@/components/CapasIngredientes'
import CartaNav from '@/components/CartaNav'
import EditorHamburguesa from '@/components/EditorHamburguesa'
import EditorPizzita from '@/components/EditorPizzita'
import PromoArmar from '@/components/PromoArmar'

function esEditableCarta(categoria: string) {
  return categoria === 'hamburguesa' || categoria === 'pizzita'
}

function esDestacadoCat(categoria: string) {
  return categoria === 'hamburguesa' || categoria === 'pizzita' || categoria === 'promo'
}

type Linea = {
  key: string
  producto_id: string
  nombre: string
  categoria: string
  tamano: Tamano
  precio: number
  cantidad: number
  mods: ModLinea[]
  mods_resumen: string
  extra: number
  precio_override?: number | null
  promo_nombre?: string | null
}

function capasPreview(receta: LineaRecetaMock[], tamano: Tamano): { capa: CapaVisual; etiqueta: string }[] {
  const veces = tamano === 'triple' ? 3 : tamano === 'doble' ? 2 : 1
  const out: { capa: CapaVisual; etiqueta: string }[] = []
  let i = 0
  while (i < receta.length) {
    const l = receta[i]
    const cant = tamano === 'triple' ? l.cant_triple : tamano === 'doble' ? l.cant_doble : l.cant_simple
    if (l.capa === 'caja' || !(cant > 0)) {
      i++
      continue
    }
    if (l.escala_con_tamano && (l.capa === 'cheddar' || l.capa === 'carne')) {
      const bloque: { capa: CapaVisual; etiqueta: string }[] = []
      while (
        i < receta.length
        && receta[i].escala_con_tamano
        && (receta[i].capa === 'cheddar' || receta[i].capa === 'carne')
      ) {
        bloque.push({
          capa: receta[i].capa,
          etiqueta: labelCapa(receta[i].capa, receta[i].etiqueta),
        })
        i++
      }
      for (let v = 0; v < veces; v++) out.push(...bloque)
      continue
    }
    out.push({ capa: l.capa, etiqueta: labelCapa(l.capa, l.etiqueta) })
    i++
  }
  return out
}

export default function CartaPedido({
  productos,
  categorias,
  mesa,
  recetas,
}: {
  productos: ProductoMenu[]
  categorias: string[]
  mesa: number | null
  recetas: Record<string, LineaRecetaMock[]>
}) {
  const modo = mesa != null ? 'mesa' : 'whatsapp'
  const [carrito, setCarrito] = useState<Linea[]>([])
  const [abierto, setAbierto] = useState(false)
  const [filtro, setFiltro] = useState(categorias[0] ?? '')
  const [detalle, setDetalle] = useState<ProductoMenu | null>(null)
  const [tamanoDet, setTamanoDet] = useState<Tamano>('simple')
  const [editando, setEditando] = useState<{ producto: ProductoMenu; tamano: Tamano; inicial?: ModLinea[]; key?: string } | null>(null)
  const [armarPromo, setArmarPromo] = useState<ProductoMenu | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState<{ numero: number; total: number } | null>(null)
  const [pending, startTransition] = useTransition()

  const total = useMemo(() => carrito.reduce((a, l) => a + l.precio * l.cantidad, 0), [carrito])
  const unidades = useMemo(() => carrito.reduce((a, l) => a + l.cantidad, 0), [carrito])

  function abrirDetalle(p: ProductoMenu) {
    const tams = tamanosDe(p.categoria).filter(t => precioDe(p, t) != null)
    setTamanoDet(tams[0] ?? 'simple')
    setDetalle(p)
  }

  function keyMods(mods: ModLinea[]) {
    return mods.map(m => `${m.accion}:${m.insumo_id}:${m.cobrar ? 1 : 0}`).sort().join('|')
  }

  function pushLinea(linea: Omit<Linea, 'key'> & { key?: string }) {
    const key = linea.key ?? `${linea.producto_id}-${linea.tamano}-${keyMods(linea.mods)}-${linea.promo_nombre ?? ''}-${Date.now()}`
    setCarrito(prev => {
      if (!linea.promo_nombre) {
        const hit = prev.find(l => l.key === key)
        if (hit) return prev.map(l => (l.key === key ? { ...l, cantidad: Math.min(99, l.cantidad + 1) } : l))
      }
      return [...prev, { ...linea, key }]
    })
  }

  function agregar(p: ProductoMenu, tamano: Tamano, mods: ModLinea[] = []) {
    if (p.categoria === 'promo') {
      setDetalle(null)
      setArmarPromo(p)
      return
    }
    const precioBase = precioDe(p, tamano)
    if (precioBase == null) return
    const extra = precioMods(mods)
    const resumen = resumenMods(mods)
    pushLinea({
      producto_id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      tamano,
      precio: precioBase + extra,
      cantidad: 1,
      mods,
      mods_resumen: resumen,
      extra,
    })
    setDetalle(null)
    setEditando(null)
    setAbierto(true)
    setError(null)
  }

  function confirmarEdicion(mods: ModLinea[]) {
    if (!editando) return
    if (editando.key) {
      const precioBase = precioDe(editando.producto, editando.tamano)
      if (precioBase == null) return
      const extra = precioMods(mods)
      const resumen = resumenMods(mods)
      const nuevaKey = `${editando.producto.id}-${editando.tamano}-${keyMods(mods)}`
      setCarrito(prev => prev.map(l => {
        if (l.key !== editando.key) return l
        return {
          ...l,
          key: nuevaKey,
          precio: precioBase + extra,
          mods,
          mods_resumen: resumen,
          extra,
        }
      }))
      setEditando(null)
      setAbierto(true)
      return
    }
    agregar(editando.producto, editando.tamano, mods)
  }

  function setCant(key: string, cantidad: number) {
    setCarrito(prev => {
      if (cantidad < 1) return prev.filter(l => l.key !== key)
      return prev.map(l => (l.key === key ? { ...l, cantidad } : l))
    })
  }

  function enviar() {
    setError(null)
    startTransition(async () => {
      const r = await crearPedidoCarta({
        modo,
        mesa,
        nombre: nombre || null,
        telefono: telefono || null,
        direccion: direccion || null,
        notas: notas || null,
        items: carrito.map(l => ({
          producto_id: l.producto_id,
          tamano: l.tamano,
          cantidad: l.cantidad,
          extra: l.extra,
          mods_resumen: l.mods_resumen || null,
          precio_override: l.precio_override ?? null,
        })),
      })
      if (!r.ok) {
        setError(r.error ?? 'No se pudo enviar el pedido.')
        return
      }
      setListo({ numero: r.numero, total: r.total })
      setCarrito([])
      setAbierto(false)
      if (r.waUrl) window.open(r.waUrl, '_blank', 'noopener,noreferrer')
    })
  }

  const capasDet = detalle
    ? capasPreview(recetas[detalle.id] ?? [], tamanoDet)
    : []

  const catActiva = categorias.includes(filtro) ? filtro : (categorias[0] ?? '')
  const itemsFiltro = productos.filter(p => p.categoria === catActiva)
  const esDestacado = esDestacadoCat(catActiva)
  const promoDet = detalle && detalle.categoria === 'promo' ? detallePromo(detalle.id) : null

  return (
    <>
      <CartaNav
        categorias={categorias.map(c => ({ id: c, label: CATEGORIAS[c]?.label ?? c }))}
        activa={catActiva}
        onChange={setFiltro}
      />

      <div className={`relative max-w-xl mx-auto px-4 ${unidades > 0 ? 'pb-28' : 'pb-16'}`}>
        <section key={catActiva} className="anim-fade-up">
          <h2 className="font-display text-xl font-bold tracking-tight mb-4 flex items-baseline gap-3">
            <span>{CATEGORIAS[catActiva]?.label ?? catActiva}</span>
            <span className="flex-1 h-px bg-[var(--line-soft)]" aria-hidden />
            <span className="text-xs font-medium text-[var(--ink-mute)] tabular">{itemsFiltro.length}</span>
          </h2>

          <ul className={esDestacado ? 'space-y-5' : 'space-y-3'}>
            {itemsFiltro.map(p => {
              const img = imagenCarta(p.id, p.categoria)
              const tamanos = tamanosDe(p.categoria).filter(t => precioDe(p, t) != null)
              const desde = Math.min(...tamanos.map(t => precioDe(p, t)!))

                  if (esDestacado) {
                    const promo = p.categoria === 'promo' ? detallePromo(p.id) : null
                    const promoNombres = promo
                      ? promo.items
                        .map(it => productos.find(x => x.id === it.producto_id)?.nombre)
                        .filter(Boolean)
                        .join(' · ')
                      : null
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => abrirDetalle(p)}
                          className="w-full text-left group overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] hover:border-[var(--gold)]/35 transition-colors"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={img}
                              alt={p.nombre}
                              fill
                              sizes="(max-width: 640px) 100vw, 560px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--char)] via-[var(--char)]/20 to-transparent" />
                            {p.categoria === 'promo' && (
                              <span className="absolute top-3 left-3 chip chip-ember border-0">Promo del día</span>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="font-display text-[1.35rem] font-bold leading-tight drop-shadow">{p.nombre}</p>
                              <p className="text-[13px] text-[var(--ink-soft)] mt-1 line-clamp-2">
                                {promoNombres || p.descripcion}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3 px-4 py-3">
                            <p className="text-sm text-[var(--ink-soft)]">
                              {p.categoria === 'promo' ? (
                                <span className="text-[var(--gold)] font-semibold tabular">{pesos(desde)}</span>
                              ) : (
                                <>desde <span className="text-[var(--gold)] font-semibold tabular">{pesos(desde)}</span></>
                              )}
                            </p>
                            <span className="btn btn-sm btn-ember pointer-events-none">
                              {p.categoria === 'promo' ? 'Ver promo' : 'Ver · pedir'}
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  }

              return (
                <li
                  key={p.id}
                  className="flex gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface)]/80 p-2.5"
                >
                  <button
                    type="button"
                    onClick={() => abrirDetalle(p)}
                    className="relative w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden"
                  >
                    <Image src={img} alt="" fill sizes="72px" className="object-cover" />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <button type="button" onClick={() => abrirDetalle(p)} className="text-left">
                      <p className="font-display text-[15px] font-semibold leading-snug">{p.nombre}</p>
                      {p.descripcion && (
                        <p className="text-[12px] text-[var(--ink-soft)] line-clamp-2 mt-0.5">{p.descripcion}</p>
                      )}
                    </button>
                    <div className="flex flex-wrap gap-1.5">
                      {tamanos.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => agregar(p, t)}
                          className="btn btn-sm py-1 text-[11px] btn-ember"
                        >
                          {tamanos.length > 1 ? `${labelTamano(p.categoria, t)} · ` : ''}
                          {pesos(precioDe(p, t)!)}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {/* Detalle tipo menú / despiece */}
      {detalle && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/55" onClick={() => setDetalle(null)}>
          <div
            className="card w-full max-w-lg rounded-b-none sm:rounded-b-xl max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={imagenCarta(detalle.id, detalle.categoria)}
                alt={detalle.nombre}
                fill
                sizes="560px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--char)] via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setDetalle(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/45 text-white text-xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="eyebrow text-[var(--gold)]">{CATEGORIAS[detalle.categoria]?.label}</p>
                <h2 className="font-display text-2xl font-bold mt-1">{detalle.nombre}</h2>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {detalle.descripcion && (
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{detalle.descripcion}</p>
              )}

              {promoDet && (
                <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-4 py-3 space-y-2.5">
                  <p className="eyebrow text-[var(--gold)]">Lo que incluye</p>
                  <ul className="space-y-2">
                    {promoDet.items.map((it, i) => {
                      const p = productos.find(x => x.id === it.producto_id)
                      if (!p) return null
                      return (
                        <li key={`${it.producto_id}-${i}`} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image src={imagenCarta(p.id, p.categoria)} alt="" fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{p.nombre}</p>
                            <p className="text-[11px] text-[var(--ink-soft)]">
                              {labelTamano(p.categoria, it.tamano)}
                              {it.cantidad > 1 ? ` · ×${it.cantidad}` : ''}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="text-xs text-[var(--ink-soft)]">
                    Al pedirla armás cada producto (sin / extras en burgers y pizzas). Total fijo {pesos(detalle.precio_simple)}.
                  </p>
                </div>
              )}

              {esEditableCarta(detalle.categoria) && capasDet.length > 0 && (
                <div className="rounded-xl border border-[var(--line-soft)] bg-black/20 p-3">
                  <p className="eyebrow mb-2 text-center">Cómo va armada</p>
                  <div className="flex flex-col max-w-sm mx-auto">
                    {capasDet.map((c, idx) => (
                      <CapaFila
                        key={`${c.capa}-${idx}`}
                        capa={c.capa}
                        etiqueta={c.etiqueta}
                        first={idx === 0}
                        overlap={detalle.categoria === 'pizzita' ? -8 : -12}
                      />
                    ))}
                  </div>
                </div>
              )}

              {detalle.categoria !== 'promo' && (
                <div>
                  <p className="eyebrow mb-2">Elegí tamaño</p>
                  <div className="flex gap-1 bg-[var(--char)] border border-[var(--line-soft)] rounded-xl p-1">
                    {tamanosDe(detalle.categoria).filter(t => precioDe(detalle, t) != null).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTamanoDet(t)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                          tamanoDet === t
                            ? 'bg-[var(--gold)] text-[var(--void)]'
                            : 'text-[var(--ink-soft)] hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="block">{labelTamano(detalle.categoria, t)}</span>
                        <span className="block tabular mt-0.5 text-[13px]">{pesos(precioDe(detalle, t)!)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {esEditableCarta(detalle.categoria) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditando({ producto: detalle, tamano: tamanoDet })
                      setDetalle(null)
                    }}
                    className="btn w-full py-3 text-base"
                  >
                    {detalle.categoria === 'pizzita' ? 'Editar (sin / toppings)' : 'Editar (sin / extras)'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => agregar(detalle, tamanoDet)}
                  className="btn btn-ember w-full py-3 text-base"
                >
                  {detalle.categoria === 'promo'
                    ? `Armar promo · ${pesos(detalle.precio_simple)}`
                    : esEditableCarta(detalle.categoria)
                      ? `Agregar así · ${pesos(precioDe(detalle, tamanoDet)!)}`
                      : `Agregar · ${pesos(precioDe(detalle, tamanoDet)!)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {armarPromo && (
        <PromoArmar
          promo={armarPromo}
          productos={productos}
          recetas={recetas}
          onClose={() => setArmarPromo(null)}
          onDone={lineas => {
            for (const l of lineas) {
              pushLinea({
                ...l,
                key: `promo-${armarPromo.id}-${l.producto_id}-${keyMods(l.mods)}-${Math.random().toString(36).slice(2, 7)}`,
              })
            }
            setArmarPromo(null)
            setAbierto(true)
            setError(null)
          }}
        />
      )}

      {editando && editando.producto.categoria === 'hamburguesa' && (
        <EditorHamburguesa
          producto={editando.producto}
          tamano={editando.tamano}
          receta={recetas[editando.producto.id] ?? []}
          inicial={editando.inicial}
          modoCliente
          confirmarLabel={editando.key ? 'Guardar cambios' : 'Agregar al pedido'}
          onClose={() => {
            const prod = editando.producto
            const key = editando.key
            setEditando(null)
            if (!key) setDetalle(prod)
          }}
          onConfirm={confirmarEdicion}
        />
      )}

      {editando && editando.producto.categoria === 'pizzita' && (
        <EditorPizzita
          producto={editando.producto}
          tamano={editando.tamano}
          receta={recetas[editando.producto.id] ?? []}
          inicial={editando.inicial}
          modoCliente
          confirmarLabel={editando.key ? 'Guardar cambios' : 'Agregar al pedido'}
          onClose={() => {
            const prod = editando.producto
            const key = editando.key
            setEditando(null)
            if (!key) setDetalle(prod)
          }}
          onConfirm={confirmarEdicion}
        />
      )}

      {unidades > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="mx-auto max-w-xl w-full flex items-center justify-between gap-3 rounded-2xl bg-[var(--ember)] text-[var(--ink)] px-5 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.45)] font-semibold text-sm"
          >
            <span className="chip bg-black/20 text-[var(--ink)] border-0">{unidades}</span>
            <span className="flex-1 text-left">{modo === 'mesa' ? 'Ver pedido de mesa' : 'Pedir por WhatsApp'}</span>
            <span className="tabular">{pesos(total)}</span>
          </button>
        </div>
      )}

      {abierto && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/45" onClick={() => setAbierto(false)}>
          <div
            className="card w-full max-w-lg rounded-b-none sm:rounded-b-xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
              <div>
                <h2 className="font-display text-lg font-semibold">
                  {modo === 'mesa' ? `Pedido · Mesa ${mesa}` : 'Pedido por WhatsApp'}
                </h2>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  {modo === 'mesa'
                    ? 'Entra a Ventas como pendiente. Cuando cobran, confirman el pago.'
                    : 'Se carga en el sistema y se abre el chat con el pedido armado.'}
                </p>
              </div>
              <button type="button" onClick={() => setAbierto(false)} className="text-[var(--ink-soft)] text-xl px-1" aria-label="Cerrar">×</button>
            </div>

            <div className="px-5 pb-5 space-y-4">
              {carrito.length === 0 ? (
                <p className="text-sm text-[var(--ink-soft)] py-4 text-center">Todavía no agregaste nada.</p>
              ) : (
                <ul className="space-y-2">
                  {carrito.map(l => {
                    const prod = productos.find(p => p.id === l.producto_id)
                    return (
                      <li key={l.key} className="flex items-start gap-2 text-sm">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 mt-0.5">
                          <Image src={imagenCarta(l.producto_id, l.categoria)} alt="" fill sizes="44px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{l.nombre}</p>
                          <p className="text-[11px] text-[var(--ink-soft)]">
                            {labelTamano(l.categoria, l.tamano)} · {pesos(l.precio)}
                          </p>
                          {l.promo_nombre && (
                            <p className="text-[11px] text-[var(--ember)] mt-0.5">Promo · {l.promo_nombre}</p>
                          )}
                          {l.mods_resumen && (
                            <p className="text-[11px] text-[var(--gold)] mt-0.5 break-words">{l.mods_resumen}</p>
                          )}
                          {prod && esEditableCarta(l.categoria) && !l.promo_nombre && (
                            <button
                              type="button"
                              className="text-[11px] link mt-1"
                              onClick={() => {
                                setAbierto(false)
                                setEditando({ producto: prod, tamano: l.tamano, inicial: l.mods, key: l.key })
                              }}
                            >
                              Editar
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" className="btn btn-sm px-2" onClick={() => setCant(l.key, l.cantidad - 1)}>−</button>
                          <span className="w-6 text-center tabular font-semibold">{l.cantidad}</span>
                          <button type="button" className="btn btn-sm px-2" onClick={() => setCant(l.key, l.cantidad + 1)}>+</button>
                        </div>
                        <span className="tabular w-16 text-right font-semibold shrink-0">{pesos(l.precio * l.cantidad)}</span>
                      </li>
                    )
                  })}
                </ul>
              )}

              {modo === 'whatsapp' && (
                <div className="space-y-2.5 border-t border-[var(--line-soft)] pt-3">
                  <input className="input" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                  <input className="input" placeholder="WhatsApp (ej. 3815123456)" inputMode="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
                  <input className="input" placeholder="Dirección (delivery) o vacío = retiro" value={direccion} onChange={e => setDireccion(e.target.value)} />
                </div>
              )}

              <textarea
                className="input min-h-[72px]"
                placeholder="Notas (sin cebolla, punto de carne…)"
                value={notas}
                onChange={e => setNotas(e.target.value)}
              />

              {error && <p className="text-[var(--danger)] text-xs" role="alert">{error}</p>}

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="font-display text-xl font-bold tabular">{pesos(total)}</p>
                <button
                  type="button"
                  disabled={pending || carrito.length === 0}
                  onClick={enviar}
                  className="btn btn-ember"
                >
                  {pending
                    ? 'Enviando…'
                    : modo === 'mesa'
                      ? 'Enviar pedido'
                      : 'Enviar y abrir WhatsApp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4">
          <div className="card w-full max-w-md p-6 text-center space-y-3 anim-fade-up">
            <p className="eyebrow text-[var(--ok)]">Pedido enviado</p>
            <p className="font-display text-3xl font-bold">#{listo.numero}</p>
            <p className="text-[var(--ink-soft)] text-sm">
              {modo === 'mesa'
                ? `Mesa ${mesa}: ya está en la cola. Cuando cobren, lo marcan como confirmado.`
                : 'Se abrió WhatsApp con tu pedido. En el local aparece como pendiente hasta confirmar el pago.'}
            </p>
            <p className="font-display text-xl font-semibold tabular text-[var(--gold)]">{pesos(listo.total)}</p>
            <button type="button" className="btn btn-primary w-full" onClick={() => setListo(null)}>
              Seguir mirando la carta
            </button>
          </div>
        </div>
      )}
    </>
  )
}
