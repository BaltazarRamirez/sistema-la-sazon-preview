import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CANALES, ESTADO_COLOR, ESTADO_LABEL, labelTamano } from '@/lib/catalogo'
import { fecha, fechaHora, haceCuanto, linkWhatsApp, num, pesos } from '@/lib/formato'
import { getClienteDetalle } from '@/lib/mock/clientes'
import { MOCK_FIDELIDAD_CONFIG, MOCK_FIDELIDAD_PRODUCTOS } from '@/lib/mock/fidelizacion'
import KpiCard from '@/components/KpiCard'
import { Barra } from '@/components/ui'
import FichaCliente from '@/components/FichaCliente'

export const dynamic = 'force-dynamic'

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = getClienteDetalle(id)
  if (!data) notFound()

  const { cliente, stats, favoritos, cupones, ventas } = data
  const compras = stats.compras
  const frecuencia = compras > 1 && stats.primera && stats.ultima
    ? (new Date(stats.ultima).getTime() - new Date(stats.primera).getTime()) / 86400000 / (compras - 1)
    : null
  const falta = cliente.compras_necesarias - cliente.compras_en_ciclo
  const dormido = stats.ultima ? (Date.now() - new Date(stats.ultima).getTime()) / 86400000 >= 14 : false
  const waVolve = linkWhatsApp(
    cliente.telefono,
    `¡Hola${cliente.nombre ? ' ' + cliente.nombre.split(' ')[0] : ''}! Te extrañamos en La Sazón 🍔 ¿Pedimos algo rico hoy?`,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/clientes" className="text-xs link">← Clientes</Link>
          <h1 className="h1 mt-1">{cliente.nombre ?? 'Sin nombre'}</h1>
          <p className="sub mt-1">
            {cliente.telefono}{cliente.direccion_default ? ` · ${cliente.direccion_default}` : ''} · cliente desde {fecha(cliente.creado_en)}
          </p>
          {cliente.notas && <p className="text-sm mt-1"><span className="chip chip-info">Nota</span> {cliente.notas}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {dormido && waVolve && (
            <a href={waVolve} target="_blank" rel="noopener noreferrer" className="btn btn-ember">WhatsApp · hace rato que no viene</a>
          )}
          <Link href={`/ventas/nueva?cliente=${cliente.id}`} className="btn btn-primary">Nueva venta</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Compras"
          value={String(compras)}
          hint={frecuencia == null ? undefined : frecuencia < 1.5 ? 'casi una por día' : `una cada ${num(frecuencia, 0)} días`}
          accent="ink"
        />
        <KpiCard label="Gastado" value={pesos(stats.gastado)} hint={compras ? `ticket promedio ${pesos(stats.gastado / compras)}` : undefined} accent="ink" />
        <KpiCard
          label="Última compra"
          value={stats.ultima ? haceCuanto(stats.ultima) : '-'}
          hint={stats.ultima ? fecha(stats.ultima) : undefined}
          accent={dormido ? 'danger' : 'ink'}
        />
        <KpiCard label="Ahorró con cupones" value={pesos(stats.ahorro)} accent="ok" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 space-y-4">
          <h2 className="h2">Fidelización</h2>
          {cliente.programa_activo ? (
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{cliente.compras_en_ciclo} de {cliente.compras_necesarias} compras</span>
                <span className="text-[var(--ink-soft)]">{falta <= 0 ? 'Gana en la próxima' : `faltan ${falta}`}</span>
              </div>
              <Barra valor={cliente.compras_en_ciclo} max={cliente.compras_necesarias} />
            </div>
          ) : (
            <p className="sub">El programa está pausado.</p>
          )}
          {favoritos.length > 0 && (
            <div>
              <p className="eyebrow mb-1">Lo que más pide</p>
              <ul className="text-sm space-y-0.5">
                {favoritos.map(f => (
                  <li key={f.nombre + f.tamano}>
                    {f.nombre} {labelTamano(f.categoria, f.tamano).toLowerCase()}{' '}
                    <span className="text-[var(--ink-soft)]">· {f.unidades}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <FichaCliente
            cliente={cliente}
            cupones={cupones}
            productos={MOCK_FIDELIDAD_PRODUCTOS}
            plantilla={MOCK_FIDELIDAD_CONFIG.mensaje}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h2 className="h2">Historial de compras</h2></div>
        {ventas.length === 0 ? (
          <p className="px-6 py-6 sub">Todavía no compró en el preview (o no hay ventas ligadas).</p>
        ) : (
          <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
            <table className="tabla">
              <thead className="sticky top-0 z-10 [&_tr]:bg-[var(--char-raised)]">
                <tr><th>#</th><th>Fecha</th><th>Detalle</th><th>Canal</th><th className="num">Total</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {ventas.map(v => (
                  <tr key={v.id} className={v.estado === 'cancelado' ? 'opacity-50' : ''}>
                    <td className="tabular text-xs">
                      <Link href={`/ventas?q=${v.numero}`} className="link">#{v.numero}</Link>
                    </td>
                    <td className="text-xs whitespace-nowrap">{fechaHora(v.creado_en)}</td>
                    <td className="text-xs max-w-[380px]">{v.detalle}</td>
                    <td className="text-xs">{CANALES[v.canal] ?? v.canal}</td>
                    <td className="num tabular">
                      {pesos(v.total)}
                      {v.descuento > 0 && <p className="text-[11px] text-[var(--ok)]">−{pesos(v.descuento)} cupón</p>}
                    </td>
                    <td><span className={`chip ${ESTADO_COLOR[v.estado]}`}>{ESTADO_LABEL[v.estado]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
