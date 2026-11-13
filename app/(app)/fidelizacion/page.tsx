import Link from 'next/link'
import { fecha, haceCuanto, linkWhatsApp, num, pesos } from '@/lib/formato'
import { ESTADO_CUPON, describirPremio, estadoCupon, mensajeCupon } from '@/lib/premios'
import KpiCard from '@/components/KpiCard'
import ConfigFidelidadForm from '@/components/ConfigFidelidadForm'
import MecanicasFidelidad from '@/components/MecanicasFidelidad'
import { getClientesDormidos } from '@/lib/mock/clientes'
import {
  MOCK_CERCA_PREMIO,
  MOCK_CUPONES_POR_VENCER,
  MOCK_CUPONES_ULTIMOS,
  MOCK_CUMPLES_SEMANA,
  MOCK_FIDELIDAD_CONFIG,
  MOCK_FIDELIDAD_PRODUCTOS,
  MOCK_FIDELIDAD_STATS,
  MOCK_INSCRIPTOS_SORTEO,
  MOCK_MECANICAS,
  MOCK_PREMIOS_PEDIDO,
  MOCK_SORTEOS,
  labelOrigenCupon,
} from '@/lib/mock/fidelizacion'

export const dynamic = 'force-dynamic'

export default async function FidelizacionPage() {
  const cfg = MOCK_FIDELIDAD_CONFIG
  const productos = MOCK_FIDELIDAD_PRODUCTOS
  const stats = MOCK_FIDELIDAD_STATS
  const cerca = MOCK_CERCA_PREMIO
  const porVencer = MOCK_CUPONES_POR_VENCER
  const ultimos = MOCK_CUPONES_ULTIMOS
  const dormidos = getClientesDormidos(14).slice(0, 8)
  const sorteos = MOCK_SORTEOS
  const sorteoActivo = sorteos.find(s => s.estado === 'abierto') ?? sorteos[0]
  const premiosPedido = MOCK_PREMIOS_PEDIDO
  const cumples = MOCK_CUMPLES_SEMANA

  const identificadas = stats.ventas ? (stats.ventas_identificadas / stats.ventas) * 100 : 0
  const canje = stats.usados + stats.vencidos > 0 ? (stats.usados / (stats.usados + stats.vencidos)) * 100 : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Fidelización</h1>
        <p className="sub mt-1">
          Ciclo de compras, premios por pedido, sorteos y cumple — todo mock de preview.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Premios entregados" value={String(stats.emitidos)} hint="últimos 30 días" accent="ember" />
        <KpiCard label="Canjeados" value={String(stats.usados)} hint={canje != null ? `${num(canje, 0)}% de los que vencían o se usaron` : 'últimos 30 días'} accent="ok" />
        <KpiCard label="Valor regalado" value={pesos(stats.regalado)} hint="en descuentos y productos" accent="ink" />
        <KpiCard
          label="Ventas con cliente"
          value={`${num(identificadas, 0)}%`}
          hint={identificadas < 60 ? 'Cargá el WhatsApp en cada venta para que sume' : `${stats.clientes_activos} clientes compraron`}
          accent={identificadas < 60 ? 'danger' : 'ok'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="h2">A una compra del premio</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Un mensaje ahora suele traerlos de vuelta</p>
            </div>
          </div>
          {cerca.length === 0 ? <p className="px-6 py-6 sub">Nadie está a una compra del premio.</p> : (
            <ul className="divide-y divide-[var(--line-soft)] max-h-[320px] overflow-y-auto">
              {cerca.map(c => {
                const wa = linkWhatsApp(c.telefono, `¡Hola${c.nombre ? ' ' + c.nombre.split(' ')[0] : ''}! Te falta una sola compra en La Sazón para ganarte tu premio. ¡Te esperamos!`)
                return (
                  <li key={c.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <Link href={`/clientes/${c.id}`} className="text-sm font-medium hover:underline">{c.nombre ?? c.telefono}</Link>
                      <p className="text-xs text-[var(--ink-soft)]">{c.compras_en_ciclo} de {c.compras_necesarias} · última compra {fecha(c.ultima)}</p>
                    </div>
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember">WhatsApp</a>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="card" id="por-vencer">
          <div className="card-head">
            <div>
              <h2 className="h2">Cupones por vencer</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Vencen en los próximos 7 días y todavía no se usaron</p>
            </div>
          </div>
          {porVencer.length === 0 ? <p className="px-6 py-6 sub">No hay cupones por vencer.</p> : (
            <ul className="divide-y divide-[var(--line-soft)] max-h-[320px] overflow-y-auto">
              {porVencer.map(c => {
                const premio = describirPremio(c)
                const wa = linkWhatsApp(c.telefono, mensajeCupon(cfg.mensaje, { nombre: c.nombre, compras: cfg.compras_necesarias, premio, codigo: c.codigo, vence_en: c.vence_en }))
                return (
                  <li key={c.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <Link href={`/clientes/${c.cliente_id}`} className="text-sm font-medium hover:underline">{c.nombre ?? c.telefono}</Link>
                      <p className="text-xs text-[var(--ink-soft)]">{premio} · vence {fecha(c.vence_en)}</p>
                    </div>
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember">WhatsApp</a>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="h2">Hace rato que no vienen</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Sin comprar hace 14 días o más</p>
            </div>
          </div>
          {dormidos.length === 0 ? <p className="px-6 py-6 sub">Nadie dormido por ahora.</p> : (
            <ul className="divide-y divide-[var(--line-soft)] max-h-[320px] overflow-y-auto">
              {dormidos.map(c => {
                const wa = linkWhatsApp(
                  c.telefono,
                  `¡Hola${c.nombre ? ' ' + c.nombre.split(' ')[0] : ''}! Te extrañamos en La Sazón. ¿Pedimos algo rico hoy?`,
                )
                return (
                  <li key={c.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <Link href={`/clientes/${c.id}`} className="text-sm font-medium hover:underline">{c.nombre ?? c.telefono}</Link>
                      <p className="text-xs text-[var(--ink-soft)]">
                        Última {c.ultima ? haceCuanto(c.ultima) : '—'}
                        {c.compras_en_ciclo > 0 ? ` · ${c.compras_en_ciclo}/${c.compras_necesarias} del ciclo` : ''}
                      </p>
                    </div>
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember">WhatsApp</a>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card" id="sorteos">
          <div className="card-head">
            <div>
              <h2 className="h2">Sorteos</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Chances por pedidos con WhatsApp · mock</p>
            </div>
            {sorteoActivo?.estado === 'abierto' && <span className="chip chip-ember">En curso</span>}
          </div>
          <ul className="divide-y divide-[var(--line-soft)]">
            {sorteos.map(s => (
              <li key={s.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{s.titulo}</p>
                    <p className="text-xs text-[var(--ink-soft)] mt-0.5">{s.premio}</p>
                    <p className="text-[11px] text-[var(--ink-mute)] mt-1">{s.como_entra}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`chip ${s.estado === 'abierto' ? 'chip-ok' : 'chip-neutral'}`}>
                      {s.estado === 'abierto' ? 'Abierto' : 'Cerrado'}
                    </span>
                    <p className="text-[11px] text-[var(--ink-soft)] mt-1.5 tabular">
                      {s.participantes} inscritos
                      {s.ganadores > 0 ? ` · ${s.ganadores} ganador` : ''}
                    </p>
                    <p className="text-[11px] text-[var(--ink-mute)]">
                      {s.estado === 'abierto' ? `Cierra ${fecha(s.cierra_en)}` : `Cerró ${fecha(s.cierra_en)}`}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {sorteoActivo && (
            <div className="border-t border-[var(--line-soft)]">
              <p className="px-5 pt-3 pb-1 text-[11px] uppercase tracking-wide text-[var(--ink-mute)]">
                Últimas chances · {sorteoActivo.titulo}
              </p>
              <ul className="divide-y divide-[var(--line-soft)] max-h-[200px] overflow-y-auto">
                {MOCK_INSCRIPTOS_SORTEO.map(c => {
                  const wa = linkWhatsApp(
                    c.telefono,
                    `¡Hola${c.nombre ? ' ' + c.nombre.split(' ')[0] : ''}! Estás en el sorteo de La Sazón (${c.chances} chance${c.chances === 1 ? '' : 's'}). ¡Suerte!`,
                  )
                  return (
                    <li key={c.id} className="px-5 py-2 flex items-center justify-between gap-3">
                      <div>
                        <Link href={`/clientes/${c.id}`} className="text-sm font-medium hover:underline">{c.nombre}</Link>
                        <p className="text-[11px] text-[var(--ink-soft)]">{c.chances} chance{c.chances === 1 ? '' : 's'} · {haceCuanto(c.ultima_chance)}</p>
                      </div>
                      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm">WA</a>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="card" id="por-pedido">
          <div className="card-head">
            <div>
              <h2 className="h2">Premios por pedido</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">Se disparan con lo que hay en el ticket · mock</p>
            </div>
          </div>
          <ul className="divide-y divide-[var(--line-soft)]">
            {premiosPedido.map(r => (
              <li key={r.id} className="px-5 py-3.5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{r.nombre}</p>
                  <p className="text-xs text-[var(--ink-soft)] mt-0.5">{r.condicion}</p>
                  <p className="text-xs text-[var(--gold)] mt-1">{r.premio}</p>
                </div>
                <div className="text-right shrink-0 text-[11px] text-[var(--ink-soft)] tabular">
                  <p><span className="font-semibold text-[var(--ink)]">{r.activos_hoy}</span> activos hoy</p>
                  <p className="mt-0.5">{r.canjes_30d} canjes · 30 d</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2 className="h2">Cumpleaños de la semana</h2>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">20% off · avisá por WhatsApp</p>
          </div>
        </div>
        <ul className="divide-y divide-[var(--line-soft)]">
          {cumples.map(c => {
            const wa = linkWhatsApp(
              c.telefono,
              `¡Feliz cumple${c.nombre ? ' ' + c.nombre.split(' ')[0] : ''}! En La Sazón te regalamos 20% off esta semana${c.cupon ? ` · código ${c.cupon}` : ''}. ¡Te esperamos!`,
            )
            return (
              <li key={c.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                <div>
                  <Link href={`/clientes/${c.id}`} className="text-sm font-medium hover:underline">{c.nombre}</Link>
                  <p className="text-xs text-[var(--ink-soft)]">
                    {c.dia}
                    {c.cupon ? ` · cupón ${c.cupon}` : ' · aún sin cupón'}
                  </p>
                </div>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember">WhatsApp</a>}
              </li>
            )
          })}
        </ul>
      </div>

      <ConfigFidelidadForm config={cfg} productos={productos} />
      <MecanicasFidelidad items={MOCK_MECANICAS} />

      <div className="card">
        <div className="card-head"><h2 className="h2">Últimos cupones</h2></div>
        <div className="overflow-x-auto">
          <table className="tabla">
            <thead><tr><th>Código</th><th>Cliente</th><th>Premio</th><th>Origen</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>
              {ultimos.map(c => {
                const est = estadoCupon(c)
                return (
                  <tr key={c.id}>
                    <td className="tabular text-xs tracking-wide">{c.codigo}</td>
                    <td><Link href={`/clientes/${c.cliente_id}`} className="hover:underline">{c.nombre ?? 'Sin nombre'}</Link></td>
                    <td className="text-sm">{describirPremio(c)}</td>
                    <td className="text-xs">{labelOrigenCupon(c.origen)}</td>
                    <td className="text-xs whitespace-nowrap">{fecha(c.creado_en)}</td>
                    <td><span className={`chip ${ESTADO_CUPON[est].color}`}>{ESTADO_CUPON[est].label}</span></td>
                  </tr>
                )
              })}
              {ultimos.length === 0 && <tr><td colSpan={6} className="text-center sub py-6">Todavía no se generaron cupones.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
