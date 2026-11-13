import Link from 'next/link'
import { pesos } from '@/lib/formato'
import { PERIODOS, parsePeriodo } from '@/lib/periodo'
import ListaVentas from '@/components/ListaVentas'
import ColaVentas from '@/components/ColaVentas'
import HistorialMesas from '@/components/HistorialMesas'
import PeriodoSelector from '@/components/PeriodoSelector'
import { filtrarVentas, resumenMesas, resumenVentas } from '@/lib/mock/ventas'

export const dynamic = 'force-dynamic'

const POR_PAGINA = 25

export default async function VentasPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; estado?: string; q?: string; pagina?: string; vista?: string }>
}) {
  const sp = await searchParams
  const periodo = parsePeriodo(sp.periodo, 'hoy')
  const estado = sp.estado ?? ''
  const texto = (sp.q ?? '').trim()
  const pagina = Math.max(1, Number(sp.pagina) || 1)
  const vista = sp.vista === 'lista' || sp.vista === 'mesas' || sp.vista === 'cola'
    ? sp.vista
    : (!estado && !texto && periodo === 'hoy' ? 'cola' : 'lista')
  const cola = vista === 'cola'
  const mesasVista = vista === 'mesas'

  const filtradas = filtrarVentas({
    estado: cola || mesasVista ? '' : estado,
    q: texto,
    periodo: cola || mesasVista ? undefined : periodo,
    soloCurso: cola,
  })
  const resumen = resumenVentas(cola || mesasVista ? filtrarVentas({ periodo }) : filtradas)
  const ventas = cola ? filtradas : filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
  const total = cola ? filtradas.length : resumen.cantidad
  const validas = resumen.validas
  const ticket = validas > 0 ? resumen.ingresos / validas : 0
  const mesas = resumenMesas()

  const sub = mesasVista
    ? 'Pedidos por mesa · total a cobrar'
    : cola
      ? 'Cola del momento'
      : PERIODOS[periodo]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="h1">Ventas</h1>
          <p className="sub mt-1">{sub}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {vista === 'lista' && <PeriodoSelector />}
          <Link href="/ventas/nueva" className="btn btn-ember">+ Nueva venta</Link>
        </div>
      </div>

      <div className="flex gap-1 bg-[var(--paper-card)] border border-[var(--paper-line)] rounded-xl p-1 w-fit max-w-full overflow-x-auto">
        {([
          { id: 'cola', href: '/ventas?vista=cola', label: 'Cola' },
          { id: 'mesas', href: '/ventas?vista=mesas', label: 'Mesas' },
          { id: 'lista', href: '/ventas?vista=lista', label: 'Lista' },
        ] as const).map(t => (
          <Link
            key={t.id}
            href={t.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              vista === t.id ? 'bg-[var(--ink)] text-[var(--void)]' : 'text-[var(--ink-soft)] hover:bg-white/[0.04]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {vista === 'lista' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Resumen label="Ventas" valor={String(validas)} detalle={total > validas ? `${total - validas} canceladas` : undefined} />
          <Resumen label="Ingresos" valor={pesos(resumen.ingresos)} />
          <Resumen label="Ticket promedio" valor={pesos(ticket)} />
          <Resumen label="Regalado con cupones" valor={pesos(resumen.descuentos)} />
        </div>
      )}

      {mesasVista && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Resumen label="Mesas del salón" valor="12" />
          <Resumen label="Con pedidos" valor={String(mesas.length)} detalle={`${12 - mesas.length} libres`} />
          <Resumen label="Total a cobrar" valor={pesos(mesas.reduce((a, m) => a + m.total, 0))} />
          <Resumen label="Pedidos abiertos" valor={String(mesas.reduce((a, m) => a + m.abiertos, 0))} />
        </div>
      )}

      {cola ? (
        <ColaVentas ventas={ventas} />
      ) : mesasVista ? (
        <HistorialMesas mesas={mesas} />
      ) : (
        <ListaVentas
          ventas={ventas}
          pagina={pagina}
          totalPaginas={Math.max(1, Math.ceil(total / POR_PAGINA))}
          filtros={{ estado, q: texto }}
        />
      )}
    </div>
  )
}

function Resumen({ label, valor, detalle }: { label: string; valor: string; detalle?: string }) {
  return (
    <div className="card px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className="font-display text-[22px] font-semibold tabular mt-0.5">{valor}</p>
      {detalle && <p className="text-[11px] text-[var(--ink-soft)]">{detalle}</p>}
    </div>
  )
}
