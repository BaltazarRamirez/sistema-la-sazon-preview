'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { guardarReceta } from '@/app/actions/menu'
import { labelTamano, precioDe, tamanosDe, type Tamano } from '@/lib/catalogo'
import { cantidad, num, pesos } from '@/lib/formato'
import { agregadosCaja } from '@/lib/mock/agregados'
import type { CapaVisual, LineaRecetaMock } from '@/lib/mock/menu'
import { CapaFila } from '@/components/CapasIngredientes'
import { colorMargen, type ProductoMenu } from '@/components/TablaMenu'
import { MensajeError } from '@/components/ui'

type InsumoInfo = {
  id: string
  nombre: string
  unidad: string
  costo_unitario: number
  stock_actual: number
}

const FIJOS_CAPA = new Set<CapaVisual>(['pan_arriba', 'pan_abajo', 'carne', 'caja', 'masa'])

function cantDe(l: LineaRecetaMock, t: Tamano) {
  return t === 'simple' ? l.cant_simple : t === 'doble' ? l.cant_doble : l.cant_triple
}

function capasParaTamano(receta: LineaRecetaMock[], tamano: Tamano) {
  const veces = tamano === 'triple' ? 3 : tamano === 'doble' ? 2 : 1
  const out: { key: string; capa: CapaVisual; etiqueta: string; linea: LineaRecetaMock; idxReceta: number }[] = []
  let i = 0
  while (i < receta.length) {
    const l = receta[i]
    if (l.capa === 'caja' || !(cantDe(l, tamano) > 0)) {
      i++
      continue
    }
    if (l.escala_con_tamano && (l.capa === 'cheddar' || l.capa === 'carne')) {
      const bloque: { linea: LineaRecetaMock; idx: number }[] = []
      while (
        i < receta.length
        && receta[i].escala_con_tamano
        && (receta[i].capa === 'cheddar' || receta[i].capa === 'carne')
        && cantDe(receta[i], tamano) > 0
      ) {
        bloque.push({ linea: receta[i], idx: i })
        i++
      }
      for (let v = 0; v < veces; v++) {
        for (const b of bloque) {
          out.push({
            key: `${b.linea.capa}-${b.linea.insumo_id}-${v}`,
            capa: b.linea.capa,
            etiqueta: b.linea.etiqueta,
            linea: b.linea,
            idxReceta: b.idx,
          })
        }
      }
      continue
    }
    out.push({ key: `${l.capa}-${l.insumo_id}-${i}`, capa: l.capa, etiqueta: l.etiqueta, linea: l, idxReceta: i })
    i++
  }
  return out
}

function cantsDefault(insumoId: string, grupo?: string) {
  if (insumoId === 'ins-aros') return { s: 3, d: 3, t: 4 }
  if (insumoId === 'ins-huevo') return { s: 1, d: 1, t: 1 }
  if (insumoId === 'ins-cheddar' || insumoId === 'ins-panceta') return { s: 1, d: 2, t: 3 }
  if (grupo === 'aderezo') return { s: 25, d: 30, t: 35 }
  return { s: 20, d: 25, t: 30 }
}

export default function HamburguesaArmada({
  producto,
  receta: recetaInicial,
  insumos,
}: {
  producto: ProductoMenu
  receta: LineaRecetaMock[]
  insumos: InsumoInfo[]
}) {
  const router = useRouter()
  const tamanos = tamanosDe(producto.categoria).filter(t => precioDe(producto, t) != null)
  const [tamano, setTamano] = useState<Tamano>(tamanos[0] ?? 'simple')
  const [receta, setReceta] = useState(() => recetaInicial.map(l => ({ ...l })))
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [agregarId, setAgregarId] = useState('')

  const porId = useMemo(() => new Map(insumos.map(i => [i.id, i])), [insumos])
  const capas = useMemo(() => capasParaTamano(receta, tamano), [receta, tamano])
  const esPizza = producto.categoria === 'pizzita'
  const capaSel = capas.find(c => c.key === seleccion) ?? null

  const lineasCosto = receta
    .filter(l => cantDe(l, tamano) > 0)
    .map(l => {
      const ins = porId.get(l.insumo_id)
      const cant = cantDe(l, tamano)
      const costo = (ins?.costo_unitario ?? 0) * cant
      return { ...l, cant, costo, ins }
    })

  const insumosUnicos = new Map<string, typeof lineasCosto[number]>()
  for (const l of lineasCosto) {
    const prev = insumosUnicos.get(l.insumo_id)
    if (!prev) insumosUnicos.set(l.insumo_id, { ...l })
    else insumosUnicos.set(l.insumo_id, { ...prev, cant: prev.cant + l.cant, costo: prev.costo + l.costo })
  }
  const filas = [...insumosUnicos.values()]
  const costoTotal = filas.reduce((a, l) => a + l.costo, 0)
  const precio = precioDe(producto, tamano) ?? 0
  const margen = precio > 0 ? ((precio - costoTotal) / precio) * 100 : 0

  const yaEnReceta = new Set(receta.map(l => l.insumo_id))
  const paraAgregar = agregadosCaja().filter(a => !yaEnReceta.has(a.id))

  function quitarCapa(idxReceta: number) {
    const linea = receta[idxReceta]
    if (!linea || FIJOS_CAPA.has(linea.capa)) return
    setReceta(prev => prev.filter((_, i) => i !== idxReceta))
    setSeleccion(null)
    setAviso(null)
  }

  function agregarComponente() {
    const def = agregadosCaja().find(a => a.id === agregarId)
    if (!def) return
    const c = cantsDefault(def.id, def.grupo)
    const nueva: LineaRecetaMock = {
      insumo_id: def.id,
      capa: def.capa,
      etiqueta: def.nombre,
      cant_simple: c.s,
      cant_doble: c.d,
      cant_triple: c.t,
      escala_con_tamano: def.id === 'ins-cheddar',
    }
    setReceta(prev => {
      const idxCarne = prev.findIndex(l => l.capa === 'carne')
      if (idxCarne >= 0) {
        const copy = [...prev]
        copy.splice(idxCarne, 0, nueva)
        return copy
      }
      const idxPanAbajo = prev.findIndex(l => l.capa === 'pan_abajo')
      if (idxPanAbajo >= 0) {
        const copy = [...prev]
        copy.splice(idxPanAbajo, 0, nueva)
        return copy
      }
      return [...prev, nueva]
    })
    setAgregarId('')
    setAviso(null)
  }

  function cambiarCant(insumoId: string, campo: 'cant_simple' | 'cant_doble' | 'cant_triple', valor: string) {
    const n = Number(valor.replace(',', '.'))
    if (!Number.isFinite(n) || n < 0) return
    setReceta(prev => prev.map(l => (l.insumo_id === insumoId ? { ...l, [campo]: n } : l)))
    setAviso(null)
  }

  async function guardar() {
    setError(null)
    setGuardando(true)
    const r = await guardarReceta(
      producto.id,
      receta.map(l => ({
        insumo_id: l.insumo_id,
        cant_simple: l.cant_simple,
        cant_doble: l.cant_doble,
        cant_triple: l.cant_triple,
        capa: l.capa,
        etiqueta: l.etiqueta,
        escala_con_tamano: l.escala_con_tamano,
      })),
    )
    setGuardando(false)
    if (r.error) return setError(r.error)
    setAviso('Receta guardada.')
    setEditando(false)
    router.refresh()
  }

  function descartar() {
    setReceta(recetaInicial.map(l => ({ ...l })))
    setEditando(false)
    setSeleccion(null)
    setError(null)
    setAviso(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6 items-start">
      <div className="card p-5 md:p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(252,228,180,0.05),transparent_55%)] pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="eyebrow">{esPizza ? 'Armado de la pizzita' : 'Hamburguesa armada'}</p>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">Tocá una capa · el detalle sale abajo</p>
          </div>
          <div className="flex gap-1 bg-[var(--char)] border border-[var(--line-soft)] rounded-lg p-1">
            {tamanos.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTamano(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${tamano === t ? 'bg-[var(--ink)] text-[var(--void)]' : 'text-[var(--ink-soft)] hover:bg-white/[0.04]'}`}
              >
                {labelTamano(producto.categoria, t)}
              </button>
            ))}
          </div>
        </div>

        <div className={`relative mx-auto max-w-md ${esPizza ? 'pt-2' : 'pt-4'}`}>
          <div className="flex flex-col items-stretch">
            {capas.map((c, i) => {
              const activo = seleccion === c.key
              return (
                <CapaFila
                  key={c.key}
                  capa={c.capa}
                  etiqueta={c.etiqueta}
                  first={i === 0}
                  overlap={esPizza ? -10 : -14}
                  activo={activo}
                  onClick={() => setSeleccion(activo ? null : c.key)}
                />
              )
            })}
          </div>
        </div>

        {/* Detalle abajo: no se corta con el borde del card */}
        <div className="relative mt-5 rounded-xl border border-[var(--line-soft)] bg-[var(--char)]/80 px-4 py-3 min-h-[72px]">
          {capaSel ? (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow text-[var(--gold)]">Capa seleccionada</p>
                <p className="font-display text-lg font-semibold mt-0.5">{capaSel.etiqueta}</p>
                <p className="text-xs text-[var(--ink-soft)] mt-1">
                  {cantidad(cantDe(capaSel.linea, tamano), porId.get(capaSel.linea.insumo_id)?.unidad ?? '')}
                  {' · '}
                  <Link href={`/stock/${capaSel.linea.insumo_id}`} className="link">ver en stock</Link>
                </p>
              </div>
              {editando && !FIJOS_CAPA.has(capaSel.capa) && (
                <button type="button" onClick={() => quitarCapa(capaSel.idxReceta)} className="btn btn-sm btn-danger">
                  Sacar de la receta
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--ink-soft)] text-center py-2">
              Elegí una capa del despiece para ver el insumo acá abajo.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4">
            <p className="eyebrow mb-1">Precio</p>
            <p className="font-display text-xl font-bold tabular">{pesos(precio)}</p>
          </div>
          <div className="card p-4">
            <p className="eyebrow mb-1">Costo receta</p>
            <p className="font-display text-xl font-bold tabular">{pesos(costoTotal)}</p>
          </div>
          <div className="card p-4">
            <p className="eyebrow mb-1">Margen</p>
            <p className={`font-display text-xl font-bold tabular ${colorMargen(margen)}`}>{num(margen, 0)}%</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="card-head flex-wrap gap-2">
            <div>
              <h2 className="h2">Insumos de la receta</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                {editando ? 'Agregá o sacá componentes y guardá' : `Cantidades · ${labelTamano(producto.categoria, tamano).toLowerCase()}`}
              </p>
            </div>
            {!editando ? (
              <button type="button" onClick={() => setEditando(true)} className="btn btn-sm btn-primary">
                Modificar receta
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button type="button" onClick={descartar} className="btn btn-sm" disabled={guardando}>Descartar</button>
                <button type="button" onClick={guardar} className="btn btn-sm btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>

          {editando && (
            <div className="px-4 py-3 border-b border-[var(--line-soft)] flex flex-wrap gap-2 items-center bg-white/[0.02]">
              <select className="input input-sm flex-1 min-w-[160px]" value={agregarId} onChange={e => setAgregarId(e.target.value)}>
                <option value="">Agregar componente…</option>
                {paraAgregar.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              <button type="button" onClick={agregarComponente} disabled={!agregarId} className="btn btn-sm btn-ember">
                + Sumar
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Insumo</th>
                  {editando ? (
                    <>
                      <th className="num">Simple</th>
                      <th className="num">Doble</th>
                      <th className="num">Triple</th>
                      <th></th>
                    </>
                  ) : (
                    <>
                      <th className="num">Cantidad</th>
                      <th className="num">Costo</th>
                      <th className="num">Stock</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {editando
                  ? receta
                    .filter(l => l.capa !== 'pan_abajo')
                    .map(l => {
                      const esFijo = FIJOS_CAPA.has(l.capa) || l.capa === 'pan_arriba'
                      const ins = porId.get(l.insumo_id)
                      return (
                        <tr key={`${l.insumo_id}-${l.capa}`}>
                          <td>
                            <p className="font-medium">{ins?.nombre ?? l.etiqueta}</p>
                            <p className="text-[11px] text-[var(--ink-soft)]">{l.etiqueta}</p>
                          </td>
                          {(['cant_simple', 'cant_doble', 'cant_triple'] as const).map(campo => (
                            <td key={campo} className="num">
                              <input
                                className="input input-sm w-16 text-right"
                                inputMode="decimal"
                                value={String(l[campo])}
                                onChange={e => cambiarCant(l.insumo_id, campo, e.target.value)}
                              />
                            </td>
                          ))}
                          <td className="text-right">
                            {!esFijo && (
                              <button
                                type="button"
                                className="text-xs text-[var(--danger)] hover:underline"
                                onClick={() => {
                                  setReceta(prev => prev.filter(x => !(x.insumo_id === l.insumo_id && x.capa === l.capa)))
                                  setSeleccion(null)
                                }}
                              >
                                Sacar
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  : filas.map(l => (
                    <tr
                      key={l.insumo_id}
                      className={capaSel?.linea.insumo_id === l.insumo_id ? 'bg-[var(--gold)]/[0.06]' : ''}
                    >
                      <td>
                        <button
                          type="button"
                          className="text-left font-medium hover:underline"
                          onClick={() => {
                            const hit = capas.find(c => c.linea.insumo_id === l.insumo_id)
                            if (hit) setSeleccion(hit.key)
                          }}
                        >
                          {l.ins?.nombre ?? l.etiqueta}
                        </button>
                        <p className="text-[11px] text-[var(--ink-soft)]">{l.etiqueta}</p>
                      </td>
                      <td className="num tabular">{cantidad(l.cant, l.ins?.unidad ?? '')}</td>
                      <td className="num tabular">{pesos(l.costo)}</td>
                      <td className="num tabular text-xs text-[var(--ink-soft)]">
                        {l.ins ? cantidad(l.ins.stock_actual, l.ins.unidad) : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <MensajeError error={error} />
        {aviso && (
          <div className="card px-4 py-2.5 text-sm bg-[var(--ok-bg)] border-[var(--ok)]/30 text-[var(--ok)]">
            {aviso}
          </div>
        )}
      </div>
    </div>
  )
}
