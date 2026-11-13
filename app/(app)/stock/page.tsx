import Link from 'next/link'
import { cantidad, fechaHora, pesos } from '@/lib/formato'
import { TIPO_MOVIMIENTO, labelTamano, tamanosDe } from '@/lib/catalogo'
import TablaStock from '@/components/TablaStock'
import KpiCard from '@/components/KpiCard'
import { MOCK_INSUMOS, MOCK_MOVIMIENTOS, MOCK_PRODUCCION, sugerirPedidoInsumo } from '@/lib/mock/stock'

export const dynamic = 'force-dynamic'

const SECCIONES = [
  { id: 'insumos', label: 'Insumos' },
  { id: 'alcance', label: 'Para cuántas ventas' },
  { id: 'movimientos', label: 'Movimientos' },
] as const

type Seccion = (typeof SECCIONES)[number]['id']

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>
}) {
  const { vista } = await searchParams
  const seccion: Seccion = SECCIONES.some(s => s.id === vista) ? (vista as Seccion) : 'insumos'

  const insumos = MOCK_INSUMOS
  const produccion = MOCK_PRODUCCION
  const movimientos = MOCK_MOVIMIENTOS

  const activos = insumos.filter(i => i.activo)
  const valorStock = activos.reduce((acc, i) => acc + Math.max(0, i.stock_actual) * i.costo_unitario, 0)
  const bajos = activos.filter(i => i.stock_actual <= i.stock_minimo)
  const sinStock = activos.filter(i => i.stock_actual <= 0)
  const enCamino = activos.filter(i => i.en_camino > 0)

  const porProducto = new Map<string, { nombre: string; categoria: string; tamanos: Record<string, { posibles: number; limitante: string }> }>()
  for (const f of produccion) {
    if (!tamanosDe(f.categoria).includes(f.tamano as 'simple')) continue
    const e = porProducto.get(f.id) ?? { nombre: f.nombre, categoria: f.categoria, tamanos: {} }
    e.tamanos[f.tamano] = { posibles: f.posibles, limitante: f.limitante }
    porProducto.set(f.id, e)
  }
  const categoriasProd = [...new Set([...porProducto.values()].map(p => p.categoria))]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="h1">Stock</h1>
          <p className="sub mt-1">Cada venta descuenta los insumos según la receta del producto y el tamaño.</p>
        </div>
        <Link href="/compras?nueva=1" className="btn btn-primary">+ Cargar compra</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Valor del stock" value={pesos(valorStock)} hint="a último costo de compra" accent="ink" />
        <KpiCard label="Bajo el mínimo" value={String(bajos.length)} hint={bajos.length ? bajos.slice(0, 3).map(b => b.nombre).join(', ') : 'Todo en orden'} accent={bajos.length ? 'danger' : 'ok'} />
        <KpiCard label="Sin stock" value={String(sinStock.length)} hint={sinStock.length ? sinStock.map(b => b.nombre).join(', ') : 'Ninguno'} accent={sinStock.length ? 'danger' : 'ok'} />
        <KpiCard label="Insumos en camino" value={String(enCamino.length)} hint="compras pedidas sin recibir" accent="neutral" />
      </div>

      {bajos.length > 0 && (
        <div className="card border-[var(--danger)]/30">
          <div className="card-head bg-[var(--danger-bg)] rounded-t-[1rem]">
            <h2 className="h2 text-[var(--danger)]">Hay que reponer</h2>
            <Link href="/compras?nueva=1" className="link text-sm">Armar compra →</Link>
          </div>
          <ul className="divide-y divide-[var(--line-soft)] max-h-[160px] overflow-y-auto">
            {[...bajos].sort((a, b) => a.stock_actual / (a.stock_minimo || 1) - b.stock_actual / (b.stock_minimo || 1)).map(i => {
              const dias = i.consumo_diario > 0 ? Math.max(0, i.stock_actual) / i.consumo_diario : null
              const pedido = sugerirPedidoInsumo(i.id)
              return (
                <li key={i.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <Link href={`/stock/${i.id}`} className="font-semibold hover:underline">{i.nombre}</Link>
                    <span className="text-[var(--ink-soft)]"> · quedan {cantidad(i.stock_actual, i.unidad)} (mínimo {cantidad(i.stock_minimo, i.unidad)})</span>
                    {dias != null && <span className="text-[var(--danger)] font-medium"> · alcanza para {dias < 1 ? 'menos de 1 día' : `~${Math.floor(dias)} ${Math.floor(dias) === 1 ? 'día' : 'días'}`}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)] text-right">
                    {pedido && i.en_camino <= 0 && (
                      <Link href={`/compras?nueva=1&proveedor=${pedido.proveedor_id}`} className="btn btn-sm btn-primary">
                        Pedir
                      </Link>
                    )}
                    {i.en_camino > 0
                      ? <span className="chip chip-info">En camino: {cantidad(i.en_camino, i.unidad)} de {i.en_camino_de}</span>
                      : i.mejor_proveedor
                        ? <>Más barato: <b>{i.mejor_proveedor}</b> a {pesos(i.mejor_precio)}/{i.unidad_compra}</>
                        : 'Sin proveedor cargado'}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="flex gap-1 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl p-1 w-fit max-w-full overflow-x-auto">
        {SECCIONES.map(s => (
          <Link
            key={s.id}
            href={s.id === 'insumos' ? '/stock' : `/stock?vista=${s.id}`}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              seccion === s.id
                ? 'bg-[var(--gold)] text-[var(--void)]'
                : 'text-[var(--ink-soft)] hover:bg-white/[0.04] hover:text-[var(--ink)]'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {seccion === 'insumos' && <TablaStock insumos={insumos} />}

      {seccion === 'alcance' && (
        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="h2">¿Para cuántas ventas alcanza?</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Unidades posibles con el stock de hoy y qué insumo se termina primero</p>
            </div>
          </div>
          {porProducto.size === 0 ? (
            <p className="px-6 py-6 sub">Cargá las recetas en Menú y recetas para ver este cálculo.</p>
          ) : (
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
              {categoriasProd.map(cat => {
                const tamanos = tamanosDe(cat)
                return (
                  <table key={cat} className="tabla">
                    <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
                      <tr>
                        <th>{cat === 'hamburguesa' ? 'Hamburguesitas' : cat === 'pizzita' ? 'Pizzitas' : cat}</th>
                        {tamanos.map(t => <th key={t} className="num">{labelTamano(cat, t)}</th>)}
                        <th>Se termina primero</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...porProducto.entries()].filter(([, p]) => p.categoria === cat).map(([id, p]) => {
                        const primero = Object.values(p.tamanos).sort((a, b) => a.posibles - b.posibles)[0]
                        return (
                          <tr key={id}>
                            <td className="font-medium">{p.nombre}</td>
                            {tamanos.map(t => {
                              const v = p.tamanos[t]
                              return (
                                <td key={t} className={`num tabular ${v && v.posibles <= 5 ? 'text-[var(--danger)] font-semibold' : v && v.posibles <= 15 ? 'text-[var(--warn)] font-semibold' : ''}`}>
                                  {v ? v.posibles : '-'}
                                </td>
                              )
                            })}
                            <td className="text-[var(--ink-soft)] text-xs">{primero?.limitante ?? '-'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )
              })}
            </div>
          )}
        </div>
      )}

      {seccion === 'movimientos' && (
        <div className="card">
          <div className="card-head">
            <h2 className="h2">Últimos movimientos manuales y compras</h2>
            <span className="text-xs text-[var(--ink-soft)]">Los consumos por venta se ven en el detalle de cada insumo</span>
          </div>
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="tabla">
              <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
                <tr><th>Fecha</th><th>Insumo</th><th>Tipo</th><th className="num">Cantidad</th><th>Detalle</th></tr>
              </thead>
              <tbody>
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td className="text-xs text-[var(--ink-soft)] whitespace-nowrap">{fechaHora(m.creado_en)}</td>
                    <td><Link href={`/stock/${m.insumo_id}`} className="hover:underline">{m.insumo}</Link></td>
                    <td><span className={`chip ${TIPO_MOVIMIENTO[m.tipo]?.color}`}>{TIPO_MOVIMIENTO[m.tipo]?.label ?? m.tipo}</span></td>
                    <td className={`num tabular font-medium ${m.cantidad < 0 ? 'text-[var(--danger)]' : 'text-[var(--ok)]'}`}>
                      {m.cantidad > 0 ? '+' : ''}{cantidad(m.cantidad, m.unidad)}
                    </td>
                    <td className="text-xs text-[var(--ink-soft)]">{m.compra_numero ? `Compra #${m.compra_numero}` : m.nota ?? ''}</td>
                  </tr>
                ))}
                {movimientos.length === 0 && <tr><td colSpan={5} className="text-center sub py-6">Todavía no hay movimientos.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
