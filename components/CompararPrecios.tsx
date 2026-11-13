'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { fecha, num, pesos } from '@/lib/formato'
import type { PrecioComparar } from '@/lib/mock/proveedores'

type Ahorro = { insumo: string; proveedor_mejor: string; ahorro: number }

export default function CompararPrecios({
  precios,
}: {
  precios: PrecioComparar[]
  ahorro?: Ahorro[]
}) {
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [soloComparables, setSoloComparables] = useState(true)

  const categorias = useMemo(
    () => [...new Set(precios.map(p => p.categoria))].sort((a, b) => a.localeCompare(b)),
    [precios],
  )

  const cuantos = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of precios) m.set(p.insumo_id, (m.get(p.insumo_id) ?? 0) + 1)
    return m
  }, [precios])

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase()
    return precios.filter(p => {
      if (categoria !== 'todas' && p.categoria !== categoria) return false
      if (soloComparables && (cuantos.get(p.insumo_id) ?? 0) < 2) return false
      if (term && !p.insumo.toLowerCase().includes(term) && !p.proveedor.toLowerCase().includes(term)) return false
      return true
    })
  }, [precios, q, categoria, soloComparables, cuantos])

  const proveedores = useMemo(
    () => [...new Map(filtrados.map(p => [p.proveedor_id, p.proveedor])).entries()].sort((a, b) => a[1].localeCompare(b[1])),
    [filtrados],
  )

  const insumos = useMemo(
    () => [...new Map(filtrados.map(p => [p.insumo_id, { nombre: p.insumo, categoria: p.categoria, unidad: p.unidad_compra }])).entries()]
      .sort((a, b) => a[1].nombre.localeCompare(b[1].nombre)),
    [filtrados],
  )

  const unicos = [...cuantos.values()].filter(n => n === 1).length

  return (
    <div className="card overflow-hidden">
      <div className="card-head flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="min-w-0">
          <h2 className="h2">Precio vigente por insumo</h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">por unidad de compra · en verde el más barato · aviso si el precio está viejo</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="input input-sm w-40"
            placeholder="Buscar insumo…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="input input-sm w-auto" value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setSoloComparables(v => !v)}
            className={`btn btn-sm ${soloComparables ? 'btn-primary' : ''}`}
          >
            {soloComparables ? 'Sólo comparables' : `Incluir ${unicos} sin rival`}
          </button>
        </div>
      </div>

      {insumos.length === 0 ? (
        <p className="px-6 py-8 sub">No hay insumos con esos filtros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="tabla">
            <thead>
              <tr>
                <th>Insumo</th>
                {proveedores.map(([id, nombre]) => (
                  <th key={id} className="num min-w-[110px]">
                    <Link href={`/proveedores/${id}`} className="hover:underline">{nombre}</Link>
                  </th>
                ))}
                <th className="num">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map(([insumoId, ins]) => {
                const fila = filtrados.filter(p => p.insumo_id === insumoId)
                const min = Math.min(...fila.map(f => f.precio))
                const max = Math.max(...fila.map(f => f.precio))
                return (
                  <tr key={insumoId}>
                    <td className="whitespace-nowrap">
                      <Link href={`/stock/${insumoId}`} className="font-medium hover:underline">{ins.nombre}</Link>
                      <p className="text-[11px] text-[var(--ink-soft)]">{ins.categoria} · por {ins.unidad}</p>
                    </td>
                    {proveedores.map(([provId]) => {
                      const c = fila.find(f => f.proveedor_id === provId)
                      if (!c) return <td key={provId} className="num text-[var(--ink-mute)]">—</td>
                      const esMin = c.precio === min && fila.length > 1
                      const dif = min > 0 ? ((c.precio - min) / min) * 100 : 0
                      return (
                        <td key={provId} className="num">
                          <span className={`tabular font-semibold ${esMin ? 'text-[var(--ok)]' : ''}`}>{pesos(c.precio)}</span>
                          {fila.length > 1 && !esMin && <p className="text-[11px] text-[var(--danger)]">+{num(dif, 1)}%</p>}
                          {esMin && <p className="text-[11px] text-[var(--ok)]">más barato</p>}
                          {c.viejo && <p className="text-[10.5px] text-[var(--warn)]" title={`Precio del ${fecha(c.fecha)}`}>precio viejo</p>}
                        </td>
                      )
                    })}
                    <td className="num text-xs">
                      {fila.length > 1
                        ? <b className="tabular">{num(((max - min) / min) * 100, 0)}%</b>
                        : <span className="text-[var(--ink-soft)]">un solo proveedor</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
