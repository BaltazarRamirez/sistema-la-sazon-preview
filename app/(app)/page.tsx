import Link from 'next/link'
import { CANALES, ESTADO_COLOR, ESTADO_LABEL, MEDIOS_PAGO, MODALIDADES, labelCategoria } from '@/lib/catalogo'
import { cantidad, haceCuanto, num, pesos, ZONA_AR } from '@/lib/formato'
import { PERIODOS, medianocheAR, parsePeriodo, rangoPeriodo } from '@/lib/periodo'
import { getMockDashboard } from '@/lib/mock/dashboard'
import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import PeriodoSelector from '@/components/PeriodoSelector'
import AlertaCard from '@/components/AlertaCard'

export const dynamic = 'force-dynamic'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const COLORES_CAT: Record<string, string> = {
  hamburguesa: '#c45c45',
  pizzita: '#fce4b4',
  acompanamiento: '#5f9e58',
  bebida: '#6a8f9e',
  postre: '#a87870',
}
const COLORES_CANAL: Record<string, string> = {
  whatsapp: '#25d366',
  mostrador: '#fce4b4',
  app: '#5a8fa0',
  telefono: '#a87870',
  otro: '#6f7d68',
}
const COLORES_PAGO: Record<string, string> = {
  mercado_pago: '#009ee3',
  efectivo: '#5f9e58',
  transferencia: '#fce4b4',
  debito: '#5a8fa0',
  credito: '#c45c45',
  otro: '#6f7d68',
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ periodo?: string }> }) {
  const { periodo: p } = await searchParams
  const periodo = parsePeriodo(p, 'hoy')
  const { dias } = rangoPeriodo(periodo)
  const diasSerie = Math.max(dias, 14)
  const inicioSerie = medianocheAR(diasSerie - 1)

  const { kpis, serie, productos, canales, enCurso, stockCritico, alertas } = getMockDashboard(periodo)

  const porDia = new Map(serie.map(s => [s.dia, s]))
  const dias14 = Array.from({ length: diasSerie }, (_, k) => {
    const d = new Date(inicioSerie.getTime() + k * 86400000 + 12 * 3600000)
    const clave = d.toLocaleDateString('en-CA', { timeZone: ZONA_AR })
    const fila = porDia.get(clave)
    return { label: diasSerie > 16 ? clave.slice(8) : DIAS[d.getUTCDay()], ventas: fila?.ventas ?? 0, ingresos: fila?.ingresos ?? 0 }
  })

  const ventas = kpis.ventas
  const ingresos = kpis.ingresos
  const cmv = kpis.cmv
  const margen = ingresos > 0 ? ((ingresos - cmv) / ingresos) * 100 : null
  const ticket = ventas > 0 ? ingresos / ventas : 0
  const etiqueta = PERIODOS[periodo].toLowerCase()

  const porCategoria = new Map<string, number>()
  for (const pr of productos) porCategoria.set(pr.categoria, (porCategoria.get(pr.categoria) ?? 0) + pr.total)
  const donut = [...porCategoria.entries()].map(([c, v]) => ({ label: labelCategoria(c), value: v, color: COLORES_CAT[c] ?? '#a89886' }))
  const hamburguesas = productos.filter(pr => pr.categoria === 'hamburguesa')
  const totHamb = hamburguesas.reduce((a, h) => ({ s: a.s + h.simple, d: a.d + h.doble, t: a.t + h.triple }), { s: 0, d: 0, t: 0 })
  const totalHamb = totHamb.s + totHamb.d + totHamb.t

  const donutCanal = canales
    .filter(c => c.tipo === 'canal')
    .map(c => ({ label: CANALES[c.clave] ?? c.clave, value: c.ventas, color: COLORES_CANAL[c.clave] ?? '#6f6356' }))
  const donutPago = canales
    .filter(c => c.tipo === 'pago')
    .map(c => ({ label: MEDIOS_PAGO[c.clave] ?? c.clave, value: c.ventas, color: COLORES_PAGO[c.clave] ?? '#6f6356' }))

  const ahora = new Date()
  const fechaLegible = ahora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: ZONA_AR })
  const horaLegible = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: ZONA_AR })

  const hayAlertas = alertas.stock_bajo || alertas.compras_atrasadas || alertas.ventas_demoradas || alertas.cupones_por_vencer

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between flex-wrap gap-3 anim-fade-up">
        <div>
          <p className="eyebrow mb-2">{fechaLegible} · {horaLegible} hs</p>
          <h1 className="h1">Cómo viene {periodo === 'hoy' ? 'el día' : periodo === 'mes' ? 'el mes' : 'la semana'}</h1>
        </div>
        <PeriodoSelector />
      </div>

      {hayAlertas ? (
        <div className="anim-fade-up anim-fade-up-d1">
          <p className="eyebrow mb-2">Necesita atención</p>
          <div className="flex flex-wrap gap-3">
            {alertas.ventas_demoradas > 0 && (
              <AlertaCard count={alertas.ventas_demoradas} label={alertas.ventas_demoradas === 1 ? 'Venta demorada' : 'Ventas demoradas'} detail={`La más vieja: ${haceCuanto(alertas.ventas_demoradas_desde)}`} href="/ventas?vista=cola" urgente />
            )}
            {alertas.stock_bajo > 0 && (
              <AlertaCard count={alertas.stock_bajo} label={alertas.stock_bajo === 1 ? 'Insumo bajo el mínimo' : 'Insumos bajo el mínimo'} detail="Hay que reponer" href="/stock" urgente />
            )}
            {alertas.compras_atrasadas > 0 && (
              <AlertaCard count={alertas.compras_atrasadas} label={alertas.compras_atrasadas === 1 ? 'Compra atrasada' : 'Compras atrasadas'} detail={alertas.compras_atrasadas_detalle ?? ''} href="/compras?filtro=por_recibir" />
            )}
            {alertas.cupones_por_vencer > 0 && (
              <AlertaCard count={alertas.cupones_por_vencer} label="Cupones por vencer" detail="En los próximos 7 días" href="/fidelizacion#por-vencer" />
            )}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 anim-fade-up anim-fade-up-d2">
        <KpiCard label={`Ventas · ${etiqueta}`} value={String(ventas)} hint={kpis.canceladas ? `${kpis.canceladas} canceladas` : undefined} sparkline={dias14.map(d => d.ventas)} accent="ember" />
        <KpiCard label={`Ingresos · ${etiqueta}`} value={pesos(ingresos)} sparkline={dias14.map(d => d.ingresos)} accent="gold" />
        <KpiCard label="Ticket promedio" value={ventas ? pesos(ticket) : '-'} hint={`${kpis.clientes} clientes identificados`} accent="ink" />
        <KpiCard
          label="Margen bruto"
          value={margen != null ? `${num(margen, 0)}%` : '-'}
          hint={ingresos ? `ganancia ${pesos(ingresos - cmv)} · mercadería ${pesos(cmv)}` : 'sin ventas'}
          accent={margen == null ? 'neutral' : margen >= 60 ? 'ok' : 'danger'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 anim-fade-up anim-fade-up-d3">
        <div className="lg:col-span-2 card">
          <div className="card-head">
            <h2 className="h2">Ventas por día</h2>
            <span className="text-xs text-[var(--ink-soft)]">Últimos {diasSerie} días</span>
          </div>
          <div className="p-4 h-64"><BarChart data={dias14.map(d => ({ label: d.label, value: d.ventas }))} /></div>
        </div>
        <div className="card">
          <div className="card-head">
            <h2 className="h2">Por categoría</h2>
            <span className="text-xs text-[var(--ink-soft)]">unidades · {etiqueta}</span>
          </div>
          <div className="p-6 space-y-5">
            {donut.length ? <DonutChart data={donut} /> : <p className="sub text-center py-8">Sin ventas en este período</p>}
            {totalHamb > 0 && (
              <div>
                <p className="eyebrow mb-1.5">Hamburguesas por tamaño</p>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-white/5">
                  <span style={{ width: `${(totHamb.s / totalHamb) * 100}%`, background: '#e8c9a0' }} />
                  <span style={{ width: `${(totHamb.d / totalHamb) * 100}%`, background: '#c45c45' }} />
                  <span style={{ width: `${(totHamb.t / totalHamb) * 100}%`, background: '#1f6b3a' }} />
                </div>
                <div className="flex justify-between text-xs mt-1.5 tabular text-[var(--ink-soft)]">
                  <span>Simple {totHamb.s}</span><span>Doble {totHamb.d}</span><span>Triple {totHamb.t}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 anim-fade-up anim-fade-up-d4">
        <div className="card">
          <div className="card-head"><h2 className="h2">En curso</h2><Link href="/ventas?vista=cola" className="link text-xs">Ir a la cola →</Link></div>
          {enCurso.length === 0 ? <p className="px-6 py-6 sub">No hay ventas abiertas.</p> : (
            <ul className="divide-y divide-[var(--line-soft)] max-h-[280px] overflow-y-auto">
              {enCurso.map(v => (
                <li key={v.id} className="px-5 py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">#{v.numero} · {v.nombre ?? 'Consumidor final'}</p>
                    <p className="text-xs text-[var(--ink-soft)]">{MODALIDADES[v.modalidad]} · {haceCuanto(v.creado_en)}</p>
                  </div>
                  <span className={`chip ${ESTADO_COLOR[v.estado]}`}>{ESTADO_LABEL[v.estado]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-head"><h2 className="h2">Stock crítico</h2><Link href="/stock" className="link text-xs">Ver stock →</Link></div>
          {stockCritico.length === 0 ? <p className="px-6 py-6 sub">Todo el stock está bien.</p> : (
            <ul className="divide-y divide-[var(--line-soft)] max-h-[280px] overflow-y-auto">
              {stockCritico.map(i => (
                <li key={i.id} className="px-5 py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <Link href={`/stock/${i.id}`} className="text-sm font-medium hover:text-[var(--gold)] transition-colors">{i.nombre}</Link>
                    <p className="text-xs text-[var(--ink-soft)]">quedan {cantidad(i.stock_actual, i.unidad)} · mín. {cantidad(i.stock_minimo, i.unidad)}</p>
                  </div>
                  <span className={`chip ${i.dias != null && i.dias < 1.5 ? 'chip-danger' : 'chip-warn'}`}>
                    {i.dias == null ? 'Bajo mínimo' : i.dias < 1 ? 'Menos de 1 día' : Math.floor(i.dias) === 1 ? '1 día' : `${Math.floor(i.dias)} días`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2 className="h2">Lo que más se vendió</h2>
          <span className="text-xs text-[var(--ink-soft)]">{etiqueta} · unidades por tamaño</span>
        </div>
        {productos.length === 0 ? <p className="px-6 py-6 sub">Sin ventas en este período.</p> : (
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="tabla">
              <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
                <tr><th>Producto</th><th className="num">Simple / 4 p.</th><th className="num">Doble / 8 p.</th><th className="num">Triple</th><th className="num">Total</th><th className="num">Ingresos</th><th className="num">Margen</th></tr>
              </thead>
              <tbody>
                {productos.slice(0, 10).map(pr => {
                  const m = pr.ingresos > 0 ? ((pr.ingresos - pr.costo) / pr.ingresos) * 100 : null
                  return (
                    <tr key={pr.id}>
                      <td>
                        <Link href={`/menu/${pr.id}`} className="font-medium hover:text-[var(--gold)] transition-colors">{pr.nombre}</Link>
                        <span className="text-[11px] text-[var(--ink-soft)]"> · {labelCategoria(pr.categoria)}</span>
                      </td>
                      <td className="num tabular">{pr.simple || '-'}</td>
                      <td className="num tabular">{pr.doble || '-'}</td>
                      <td className="num tabular">{pr.categoria === 'hamburguesa' ? pr.triple || '-' : ''}</td>
                      <td className="num tabular font-semibold">{pr.total}</td>
                      <td className="num tabular">{pesos(pr.ingresos)}</td>
                      <td className="num tabular">{m != null ? `${num(m, 0)}%` : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <h2 className="h2">Canal y pago</h2>
          <span className="text-xs text-[var(--ink-soft)]">{etiqueta}</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="eyebrow mb-3">Por dónde compran</p>
            {donutCanal.length ? <DonutChart data={donutCanal} /> : <p className="sub">-</p>}
          </div>
          <div>
            <p className="eyebrow mb-3">Cómo pagan</p>
            {donutPago.length ? <DonutChart data={donutPago} /> : <p className="sub">-</p>}
          </div>
        </div>
        {alertas.deuda > 0 && (
          <p className="text-xs border-t border-[var(--line-soft)] px-5 py-3 text-[var(--ink-soft)]">
            Deuda con proveedores: <Link href="/compras?filtro=sin_pagar" className="link">{pesos(alertas.deuda)}</Link>
          </p>
        )}
      </div>
    </div>
  )
}
