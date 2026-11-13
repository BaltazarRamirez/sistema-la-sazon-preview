import { pesos } from '@/lib/formato'
import KpiCard from '@/components/KpiCard'
import Compras from '@/components/Compras'
import { filtrarCompras, getComprasKpis, getDatosFormCompra } from '@/lib/mock/compras'

export const dynamic = 'force-dynamic'

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; nueva?: string; proveedor?: string; ver?: string }>
}) {
  const sp = await searchParams
  const filtro = ['por_recibir', 'sin_pagar'].includes(sp.filtro ?? '') ? sp.filtro! : 'todas'
  const compras = filtrarCompras(filtro)
  const kpis = getComprasKpis()
  const form = getDatosFormCompra()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Compras</h1>
        <p className="sub mt-1">Lo que se le pide a cada proveedor. Al recibirla, el stock se suma solo y el precio queda registrado.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Gastado este mes" value={pesos(kpis.gastado_mes)} hint="compras recibidas" accent="ink" />
        <KpiCard label="Por recibir" value={String(kpis.por_recibir)} hint={kpis.por_recibir ? pesos(kpis.por_recibir_monto) : 'Nada pendiente'} accent="neutral" />
        <KpiCard label="Atrasadas" value={String(kpis.atrasadas)} hint="pasaron la demora prometida" accent={kpis.atrasadas ? 'danger' : 'ok'} />
        <KpiCard label="Deuda con proveedores" value={pesos(kpis.deuda)} hint={kpis.proveedores_deuda ? `${kpis.proveedores_deuda} proveedores` : 'Todo pagado'} accent={kpis.deuda ? 'danger' : 'ok'} />
      </div>

      <Compras
        compras={compras}
        filtro={filtro}
        abrirNueva={sp.nueva === '1'}
        proveedorInicial={sp.proveedor ?? null}
        verId={sp.ver ?? null}
        form={form}
      />
    </div>
  )
}
