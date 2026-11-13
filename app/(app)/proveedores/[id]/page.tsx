import Link from 'next/link'
import { notFound } from 'next/navigation'
import { duracionHoras, fechaHora, linkWhatsApp, num, pesos } from '@/lib/formato'
import { chipVelocidad } from '@/lib/score'
import KpiCard from '@/components/KpiCard'
import { BotonEditarProveedor, ListaPrecios } from '@/components/Proveedores'
import { getComprasProveedor } from '@/lib/mock/compras'
import { getPreciosProveedor, getProveedor } from '@/lib/mock/proveedores'
import { MOCK_INSUMOS } from '@/lib/mock/stock'

export const dynamic = 'force-dynamic'

const SECCIONES = [
  { id: 'precios', label: 'Lista de precios' },
  { id: 'compras', label: 'Compras' },
] as const

type Seccion = (typeof SECCIONES)[number]['id']

export default async function ProveedorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ vista?: string }>
}) {
  const { id } = await params
  const { vista } = await searchParams
  const p = getProveedor(id)
  if (!p) notFound()

  const seccion: Seccion = SECCIONES.some(s => s.id === vista) ? (vista as Seccion) : 'precios'
  const precios = getPreciosProveedor(id)
  const insumos = MOCK_INSUMOS.filter(i => i.activo).map(i => ({ id: i.id, nombre: i.nombre, unidad_compra: i.unidad_compra }))
  const compras = getComprasProveedor(id)
    .map(c => ({
      id: c.id,
      numero: c.numero,
      estado: c.estado,
      pedida_en: c.pedida_en,
      recibida_en: c.recibida_en,
      total: c.total,
      pagada: c.pagada,
      horas: c.horas,
      completitud: c.estado === 'recibida'
        ? (() => {
            const ratios = c.items
              .filter(i => i.cantidad_pedida > 0 && i.cantidad_recibida != null)
              .map(i => Math.min((i.cantidad_recibida as number) / i.cantidad_pedida, 1))
            return ratios.length ? (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100 : 100
          })()
        : null,
      items: c.items.length,
    }))

  const sinPagar = compras.filter(c => c.estado === 'recibida' && !c.pagada)
  const porRecibir = compras.filter(c => c.estado === 'pedida')
  const vel = chipVelocidad(p)
  const wa = linkWhatsApp(p.telefono, `Hola${p.contacto ? ' ' + p.contacto : ''}! Te escribo de La Sazón.`)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/proveedores" className="text-xs link">← Proveedores</Link>
        <div className="flex items-start justify-between flex-wrap gap-3 mt-1">
          <div>
            <h1 className="h1">{p.nombre}{!p.activo && <span className="chip chip-neutral ml-2 align-middle">Dado de baja</span>}</h1>
            <p className="sub mt-1">
              {[p.rubro, p.contacto && `Contacto: ${p.contacto}`, p.telefono, p.dias_entrega && `Entrega ${p.dias_entrega}`, p.condicion_pago && `Pago ${p.condicion_pago}`]
                .filter(Boolean).join(' · ')}
            </p>
            {(p.direccion || p.cuit || p.email || p.notas) && (
              <p className="text-xs text-[var(--ink-soft)] mt-1">{[p.direccion, p.cuit && `CUIT ${p.cuit}`, p.email, p.notas].filter(Boolean).join(' · ')}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn">WhatsApp</a>}
            <BotonEditarProveedor proveedor={p} />
            <Link href={`/compras?nueva=1&proveedor=${p.id}`} className="btn btn-ember">Hacer pedido</Link>
            {p.deuda > 0 && (
              <Link href={`/compras?filtro=sin_pagar`} className="btn btn-primary">
                Registrar pago · {pesos(p.deuda)}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="eyebrow mb-2">Velocidad real</p>
          <span className={`chip ${vel.color}`}>{vel.texto}</span>
          <p className="text-xs text-[var(--ink-soft)] mt-2">
            {p.demora_prometida_horas != null ? `Promete ${duracionHoras(p.demora_prometida_horas)}` : 'No cargaste lo que promete'}
            {p.a_tiempo_pct != null ? ` · ${num(p.a_tiempo_pct, 0)}% a tiempo` : ''}
          </p>
        </div>
        <KpiCard label="Entrega completa" value={p.cumplimiento_pct != null ? `${num(p.cumplimiento_pct, 0)}%` : '-'} hint="de lo pedido, en las últimas entregas" accent={p.cumplimiento_pct != null && p.cumplimiento_pct < 95 ? 'danger' : 'ok'} />
        <KpiCard label="Compras 30 días" value={pesos(p.gastado_30d)} hint={`${p.compras_recibidas} entregas medidas`} accent="ink" />
        <KpiCard label="Le debés" value={pesos(p.deuda)} hint={p.deuda > 0 ? `${sinPagar.length || 1} compra${(sinPagar.length || 1) > 1 ? 's' : ''} sin pagar` : 'Al día'} accent={p.deuda > 0 ? 'danger' : 'ok'} />
      </div>

      {(porRecibir.length > 0 || sinPagar.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {porRecibir.map(c => (
            <Link key={c.id} href={`/compras?ver=${c.id}`} className="card flex-1 min-w-[200px] p-4 border-[var(--info)]/30 hover:border-[var(--gold)]/40 transition-colors">
              <p className="eyebrow mb-1">Pedido en camino</p>
              <p className="font-display text-lg font-bold">#{c.numero} · {pesos(c.total)}</p>
              <p className="text-xs text-[var(--ink-soft)] mt-1">Esperando {duracionHoras(c.horas)} · {c.items} ítems</p>
            </Link>
          ))}
          {sinPagar.map(c => (
            <Link key={c.id} href={`/compras?ver=${c.id}`} className="card flex-1 min-w-[200px] p-4 border-[var(--danger)]/30 hover:border-[var(--danger)]/50 transition-colors">
              <p className="eyebrow mb-1 text-[var(--danger)]">Sin pagar</p>
              <p className="font-display text-lg font-bold text-[var(--danger)]">#{c.numero} · {pesos(c.total)}</p>
              <p className="text-xs text-[var(--ink-soft)] mt-1">Recibida · marcar como pagada en compras</p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-1 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl p-1 w-fit max-w-full overflow-x-auto">
        {SECCIONES.map(s => (
          <Link
            key={s.id}
            href={s.id === 'precios' ? `/proveedores/${id}` : `/proveedores/${id}?vista=${s.id}`}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              seccion === s.id
                ? 'bg-[var(--gold)] text-[var(--void)]'
                : 'text-[var(--ink-soft)] hover:bg-white/[0.04] hover:text-[var(--ink)]'
            }`}
          >
            {s.label}
            {s.id === 'compras' && compras.length > 0 ? ` (${compras.length})` : ''}
            {s.id === 'precios' && precios.length > 0 ? ` (${precios.length})` : ''}
          </Link>
        ))}
      </div>

      {seccion === 'precios' && (
        <ListaPrecios proveedorId={p.id} precios={precios} insumos={insumos} />
      )}

      {seccion === 'compras' && (
        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="h2">Historial de compras</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Pedidos, demoras y estado de pago</p>
            </div>
            <Link href={`/compras?nueva=1&proveedor=${p.id}`} className="btn btn-sm btn-ember">+ Pedido</Link>
          </div>
          {compras.length === 0 ? (
            <p className="px-6 py-6 sub">Todavía no le compraste nada. Armá el primer pedido.</p>
          ) : (
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className="tabla">
                <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
                  <tr><th>#</th><th>Pedida</th><th>Demora</th><th className="num">Completa</th><th className="num">Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {compras.map(c => {
                    const tarde = p.demora_prometida_horas != null && c.horas > p.demora_prometida_horas
                    return (
                      <tr key={c.id} className={c.estado === 'cancelada' ? 'opacity-50' : ''}>
                        <td><Link href={`/compras?ver=${c.id}`} className="link tabular">#{c.numero}</Link></td>
                        <td className="text-xs whitespace-nowrap">{fechaHora(c.pedida_en)}</td>
                        <td>
                          {c.estado === 'cancelada' ? '-' : (
                            <span className={`chip ${tarde ? (c.estado === 'pedida' ? 'chip-danger' : 'chip-warn') : c.estado === 'pedida' ? 'chip-info' : 'chip-ok'}`}>
                              {c.estado === 'pedida' ? `Esperando ${duracionHoras(c.horas)}` : duracionHoras(c.horas)}
                            </span>
                          )}
                        </td>
                        <td className={`num tabular ${c.completitud != null && c.completitud < 100 ? 'text-[var(--warn)] font-semibold' : ''}`}>
                          {c.completitud != null ? `${num(c.completitud, 0)}%` : '-'}
                        </td>
                        <td className="num tabular">{pesos(c.total)}</td>
                        <td>
                          {c.estado === 'cancelada' ? <span className="chip chip-danger">Anulada</span>
                            : c.estado === 'pedida' ? <span className="chip chip-info">Por recibir</span>
                            : <span className={`chip ${c.pagada ? 'chip-ok' : 'chip-danger'}`}>{c.pagada ? 'Pagada' : 'Sin pagar'}</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
