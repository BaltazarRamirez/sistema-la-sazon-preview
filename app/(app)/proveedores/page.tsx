import Link from 'next/link'
import { duracionHoras, fecha, linkWhatsApp, num, pesos } from '@/lib/formato'
import type { ProveedorScore } from '@/lib/proveedores'
import { BotonNuevoProveedor } from '@/components/Proveedores'
import CompararPrecios from '@/components/CompararPrecios'
import { chipVelocidad } from '@/lib/score'
import { MOCK_AHORRO_COMPARAR, MOCK_PRECIOS_COMPARAR, MOCK_PROVEEDORES } from '@/lib/mock/proveedores'

export const dynamic = 'force-dynamic'

export default async function ProveedoresPage({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams
  const comparar = vista === 'comparar'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="h1">Proveedores</h1>
          <p className="sub mt-1">Con quién comprás, cuánto les pagaste y qué queda pendiente.</p>
        </div>
        <BotonNuevoProveedor />
      </div>

      <div className="flex gap-1 bg-[var(--paper-card)] border border-[var(--paper-line)] rounded-xl p-1 w-fit">
        <Link href="/proveedores" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!comparar ? 'bg-[var(--ink)] text-[var(--void)]' : 'text-[var(--ink-soft)] hover:bg-white/[0.04]'}`}>Proveedores</Link>
        <Link href="/proveedores?vista=comparar" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${comparar ? 'bg-[var(--ink)] text-[var(--void)]' : 'text-[var(--ink-soft)] hover:bg-white/[0.04]'}`}>Comparar precios</Link>
      </div>

      {comparar ? (
        <CompararPrecios precios={MOCK_PRECIOS_COMPARAR} ahorro={MOCK_AHORRO_COMPARAR} />
      ) : (
        <Lista />
      )}
    </div>
  )
}

function Lista() {
  const proveedores = [...MOCK_PROVEEDORES].sort((a, b) => {
    if (a.activo !== b.activo) return a.activo ? -1 : 1
    return a.nombre.localeCompare(b.nombre)
  })

  const deuda = proveedores.reduce((a, p) => a + p.deuda, 0)
  const pagado30 = proveedores.reduce((a, p) => a + Math.max(0, p.gastado_30d - p.deuda), 0)
  const enCamino = proveedores.reduce((a, p) => a + p.pendientes, 0)
  const atrasadas = proveedores.reduce((a, p) => a + p.atrasadas, 0)

  if (proveedores.length === 0) {
    return <div className="card px-6 py-10 text-center sub">Todavía no hay proveedores. Cargá el primero con el botón de arriba.</div>
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ResumenKpi label="Pagado · 30 días" value={pesos(pagado30)} hint="compras recibidas ya saldadas" tone="ok" />
        <ResumenKpi label="Sin pagar" value={pesos(deuda)} hint={deuda > 0 ? 'deuda abierta' : 'al día'} tone={deuda > 0 ? 'danger' : 'ok'} />
        <ResumenKpi label="Pedidos en camino" value={String(enCamino)} hint={atrasadas ? `${atrasadas} atrasado${atrasadas > 1 ? 's' : ''}` : 'sin atrasos'} tone={atrasadas ? 'danger' : 'ink'} />
        <ResumenKpi label="Proveedores" value={String(proveedores.filter(p => p.activo).length)} hint={`${proveedores.filter(p => p.deuda > 0).length} con deuda`} tone="ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {proveedores.map(p => <TarjetaProveedor key={p.id} p={p} />)}
      </div>
    </div>
  )
}

function ResumenKpi({
  label, value, hint, tone,
}: {
  label: string
  value: string
  hint: string
  tone: 'ok' | 'danger' | 'ink'
}) {
  const color =
    tone === 'ok' ? 'text-[var(--ok)]'
      : tone === 'danger' ? 'text-[var(--danger)]'
        : 'text-[var(--ink)]'
  return (
    <div className="card p-4">
      <p className="eyebrow mb-1">{label}</p>
      <p className={`font-display text-2xl font-bold tabular ${color}`}>{value}</p>
      <p className="text-[11px] text-[var(--ink-soft)] mt-1">{hint}</p>
    </div>
  )
}

function TarjetaProveedor({ p }: { p: ProveedorScore }) {
  const vel = chipVelocidad(p)
  const wa = linkWhatsApp(p.telefono, `Hola${p.contacto ? ' ' + p.contacto : ''}! Te escribo de La Sazón.`)
  const pagadoEstimado = Math.max(0, p.gastado_30d - (p.deuda > 0 ? Math.min(p.deuda, p.gastado_30d) : 0))

  return (
    <div className={`card p-5 space-y-4 ${p.activo ? '' : 'opacity-55'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/proveedores/${p.id}`} className="font-display text-[19px] font-semibold hover:underline">{p.nombre}</Link>
          <p className="text-xs text-[var(--ink-soft)]">
            {[p.rubro, p.dias_entrega && `entrega ${p.dias_entrega}`, p.condicion_pago && `pago ${/^\d/.test(p.condicion_pago) ? 'a ' : ''}${p.condicion_pago.toLowerCase()}`]
              .filter(Boolean).join(' · ') || 'Sin datos'}
          </p>
        </div>
        <div className="flex gap-1.5">
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm">WhatsApp</a>}
          <Link href={`/compras?nueva=1&proveedor=${p.id}`} className="btn btn-sm btn-primary">Pedir</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Metrica titulo="Pagado 30d" ayuda={`${p.compras_recibidas} entregas`}>
          <b className="tabular text-[var(--ok)]">{pesos(pagadoEstimado)}</b>
        </Metrica>
        <Metrica titulo="Sin pagar" ayuda={p.deuda > 0 ? 'deuda abierta' : 'al día'}>
          <b className={`tabular ${p.deuda > 0 ? 'text-[var(--danger)]' : 'text-[var(--ink-soft)]'}`}>{p.deuda > 0 ? pesos(p.deuda) : '—'}</b>
        </Metrica>
        <Metrica titulo="Comprado 30d" ayuda={p.ultima_compra ? `última ${fecha(p.ultima_compra)}` : 'sin compras'}>
          <b className="tabular">{pesos(p.gastado_30d)}</b>
        </Metrica>
        <Metrica titulo="Velocidad" ayuda={p.demora_prometida_horas != null ? `promete ${duracionHoras(p.demora_prometida_horas)}` : 'sin demora prometida'}>
          <span className={`chip ${vel.color}`}>{vel.texto}</span>
        </Metrica>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--ink-soft)] border-t border-[var(--paper-line)] pt-3">
        {p.a_tiempo_pct != null && <span>A tiempo: <b className="text-[var(--ink)] tabular">{num(p.a_tiempo_pct, 0)}%</b></span>}
        {p.cumplimiento_pct != null && <span>Completa: <b className="text-[var(--ink)] tabular">{num(p.cumplimiento_pct, 0)}%</b></span>}
        {p.pendientes > 0 && (
          <span className={p.atrasadas ? 'text-[var(--danger)]' : ''}>
            {p.pendientes} pedido{p.pendientes > 1 ? 's' : ''} en camino{p.atrasadas ? ` (${p.atrasadas} atrasado)` : ''}
          </span>
        )}
        {p.comparables > 0 && (
          <span>Precio: {p.mas_barato_en}/{p.comparables} más barato{p.sobreprecio_pct != null && p.sobreprecio_pct >= 1 ? ` · +${num(p.sobreprecio_pct, 0)}% vs mínimo` : ''}</span>
        )}
        {!p.comparables && p.insumos_en_lista > 0 && <span>{p.insumos_en_lista} insumos en lista</span>}
      </div>
    </div>
  )
}

function Metrica({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-1">{titulo}</p>
      {children}
      {ayuda && <p className="text-[10.5px] text-[var(--ink-soft)] mt-0.5">{ayuda}</p>}
    </div>
  )
}
