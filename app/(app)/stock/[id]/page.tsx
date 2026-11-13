import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cantidad, fecha, fechaHora, num, pesos, plural } from '@/lib/formato'
import { TIPO_MOVIMIENTO, labelTamano, tamanosDe } from '@/lib/catalogo'
import { medianocheAR } from '@/lib/periodo'
import BarChart from '@/components/BarChart'
import AccionesInsumo from '@/components/AccionesInsumo'
import { estadoStock } from '@/lib/stock'
import {
  getConsumoSerieInsumo,
  getInsumo,
  getMovimientosInsumo,
  getPreciosInsumo,
  getUsosInsumo,
  sugerirPedidoInsumo,
} from '@/lib/mock/stock'

export const dynamic = 'force-dynamic'

export default async function InsumoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const insumo = getInsumo(id)
  if (!insumo) notFound()

  const desde = medianocheAR(13)
  const recetas = getUsosInsumo(id)
  const precios = getPreciosInsumo(id)
  const movimientos = getMovimientosInsumo(id)
  const consumoVals = getConsumoSerieInsumo(id)
  const pedido = sugerirPedidoInsumo(id)

  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const serie = Array.from({ length: 14 }, (_, k) => {
    const d = new Date(desde.getTime() + k * 86400000 + 12 * 3600000)
    const clave = d.toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
    return { label: `${DIAS[d.getUTCDay()]} ${clave.slice(8)}`, value: consumoVals[k] ?? 0 }
  })
  const promedio = serie.reduce((a, s) => a + s.value, 0) / 14
  const est = estadoStock(insumo)
  const masBarato = precios.length ? Math.min(...precios.map(p => p.precio)) : null

  return (
    <div className="space-y-6">
      <div>
        <Link href="/stock" className="text-xs link">← Stock</Link>
        <div className="flex items-start justify-between flex-wrap gap-3 mt-1">
          <div>
            <h1 className="h1">{insumo.nombre}</h1>
            <p className="sub mt-1">
              {insumo.categoria} · se usa por {insumo.unidad}, se compra por {insumo.unidad_compra}
              {insumo.equivalencia !== 1 && ` (1 ${insumo.unidad_compra} = ${num(insumo.equivalencia)} ${plural(insumo.unidad, insumo.equivalencia)})`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {pedido && (
              <Link
                href={`/compras?nueva=1&proveedor=${pedido.proveedor_id}`}
                className="btn btn-ember"
                title={pedido.viejo ? 'El precio cargado está viejo: conviene cotizar' : undefined}
              >
                Pedir a {pedido.proveedor.split(' ').slice(-2).join(' ')}
                {pedido.viejo ? ' · cotizar' : ` · ${pesos(pedido.precio)}`}
              </Link>
            )}
            <AccionesInsumo insumo={insumo} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="eyebrow mb-2">Stock</p>
          <p className="font-display text-[28px] font-semibold tabular leading-tight">{cantidad(insumo.stock_actual, insumo.unidad)}</p>
          <span className={`chip ${est.color} mt-1`}>{est.label}</span>
        </div>
        <div className="card p-5">
          <p className="eyebrow mb-2">Mínimo</p>
          <p className="font-display text-[28px] font-semibold tabular leading-tight">{cantidad(insumo.stock_minimo, insumo.unidad)}</p>
        </div>
        <div className="card p-5">
          <p className="eyebrow mb-2">Consumo promedio</p>
          <p className="font-display text-[28px] font-semibold tabular leading-tight">{cantidad(promedio, insumo.unidad)}</p>
          <p className="text-xs text-[var(--ink-soft)]">por día · últimos 14 días</p>
        </div>
        <div className="card p-5">
          <p className="eyebrow mb-2">Alcanza para</p>
          <p className="font-display text-[28px] font-semibold tabular leading-tight">
            {promedio > 0 ? `${num(Math.max(0, insumo.stock_actual) / promedio, 1)} días` : '-'}
          </p>
          <p className="text-xs text-[var(--ink-soft)]">al ritmo de venta actual</p>
        </div>
      </div>

      {insumo.en_camino > 0 && (
        <div className="card px-5 py-3.5 border-[var(--info)]/30 text-sm">
          Hay <b>{cantidad(insumo.en_camino, insumo.unidad)}</b> en camino
          {insumo.en_camino_de ? ` de ${insumo.en_camino_de}` : ''}.{' '}
          <Link href="/compras?filtro=por_recibir" className="link">Ver pedidos →</Link>
        </div>
      )}

      {recetas.length > 0 && (
        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="h2">Qué ventas representa el stock</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Con {cantidad(insumo.stock_actual, insumo.unidad)} se pueden hacer, sólo mirando este insumo:
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr><th>Producto</th><th>Lleva</th><th>Alcanza para</th></tr>
              </thead>
              <tbody>
                {recetas.map(r => {
                  const tamanos = tamanosDe(r.categoria).filter(t => (t === 'simple' || (t === 'doble' ? r.precio_doble != null : r.precio_triple != null)))
                  const cant = (t: string) => (t === 'simple' ? r.cant_simple : t === 'doble' ? r.cant_doble : r.cant_triple)
                  return (
                    <tr key={r.producto_id} className={r.activo ? '' : 'opacity-50'}>
                      <td><Link href={`/menu/${r.producto_id}`} className="font-medium hover:underline">{r.nombre}</Link></td>
                      <td className="text-xs text-[var(--ink-soft)]">
                        {tamanos.filter(t => cant(t) > 0).map(t => `${labelTamano(r.categoria, t)}: ${cantidad(cant(t), insumo.unidad)}`).join(' · ')}
                      </td>
                      <td className="text-sm">
                        {tamanos.filter(t => cant(t) > 0).map(t => (
                          <span key={t} className="mr-3 whitespace-nowrap">
                            <b className="tabular">{Math.floor(Math.max(0, insumo.stock_actual) / cant(t))}</b> {labelTamano(r.categoria, t).toLowerCase()}
                          </span>
                        ))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="card-head">
            <h2 className="h2">Consumo por día</h2>
            <span className="text-xs text-[var(--ink-soft)]">{plural(insumo.unidad, 2)} · últimos 14 días</span>
          </div>
          <div className="p-4 h-60"><BarChart data={serie} /></div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2 className="h2">Precio por proveedor</h2>
            <span className="text-xs text-[var(--ink-soft)]">por {insumo.unidad_compra}</span>
          </div>
          {precios.length === 0 ? (
            <p className="px-6 py-6 sub">Ningún proveedor tiene precio cargado. Cargalo desde Proveedores.</p>
          ) : (
            <table className="tabla">
              <thead><tr><th>Proveedor</th><th className="num">Precio</th><th className="num">vs. más barato</th><th>Actualizado</th></tr></thead>
              <tbody>
                {precios.map(p => {
                  const dif = masBarato ? ((p.precio - masBarato) / masBarato) * 100 : 0
                  const variacion = p.anterior ? ((p.precio - p.anterior) / p.anterior) * 100 : null
                  return (
                    <tr key={p.proveedor_id}>
                      <td><Link href={`/proveedores/${p.proveedor_id}`} className="font-medium hover:underline">{p.proveedor}</Link></td>
                      <td className="num tabular font-semibold">
                        {pesos(p.precio)}
                        {variacion != null && Math.abs(variacion) >= 0.5 && (
                          <p className={`text-[11px] ${variacion > 0 ? 'text-[var(--danger)]' : 'text-[var(--ok)]'}`}>{variacion > 0 ? '↑' : '↓'} {num(Math.abs(variacion), 1)}%</p>
                        )}
                      </td>
                      <td className="num">{dif < 0.5 ? <span className="chip chip-ok">Más barato</span> : <span className="text-[var(--danger)] text-xs font-semibold">+{num(dif, 1)}%</span>}</td>
                      <td className="text-xs text-[var(--ink-soft)]">
                        {fecha(p.fecha)}
                        {p.viejo && <span className="text-[var(--warn)]"> · precio viejo</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h2 className="h2">Movimientos</h2><span className="text-xs text-[var(--ink-soft)]">últimos</span></div>
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="tabla">
            <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
              <tr><th>Fecha</th><th>Tipo</th><th className="num">Cantidad</th><th>Detalle</th></tr>
            </thead>
            <tbody>
              {movimientos.map(m => (
                <tr key={m.id}>
                  <td className="text-xs text-[var(--ink-soft)] whitespace-nowrap">{fechaHora(m.creado_en)}</td>
                  <td><span className={`chip ${TIPO_MOVIMIENTO[m.tipo]?.color ?? 'chip-neutral'}`}>{TIPO_MOVIMIENTO[m.tipo]?.label ?? m.tipo}</span></td>
                  <td className={`num tabular font-medium ${m.cantidad < 0 ? 'text-[var(--danger)]' : 'text-[var(--ok)]'}`}>
                    {m.cantidad > 0 ? '+' : ''}{cantidad(m.cantidad, insumo.unidad)}
                  </td>
                  <td className="text-xs text-[var(--ink-soft)]">
                    {m.venta_numero ? (
                      <Link href={`/ventas?q=${m.venta_numero}`} className="link">Venta #{m.venta_numero}</Link>
                    ) : m.compra_numero ? (
                      <Link href={`/compras?ver=${m.compra_id}`} className="link">Compra #{m.compra_numero}</Link>
                    ) : (m.nota ?? '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
