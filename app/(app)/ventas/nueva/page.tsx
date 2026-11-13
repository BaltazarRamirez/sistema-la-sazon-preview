import PuntoDeVenta, { type ProductoCaja } from '@/components/PuntoDeVenta'
import { MOCK_PRODUCTOS, MOCK_RECETAS } from '@/lib/mock/menu'
import { MOCK_FIDELIDAD_CONFIG } from '@/lib/mock/fidelizacion'

export const dynamic = 'force-dynamic'

export default async function NuevaVentaPage() {
  const productos: ProductoCaja[] = MOCK_PRODUCTOS
    .filter(p => p.activo)
    .map(p => ({
      id: p.id,
      categoria: p.categoria,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_simple: p.precio_simple,
      precio_doble: p.precio_doble,
      precio_triple: p.precio_triple,
    }))

  const alcance: Record<string, Partial<Record<string, number | null>>> = {}
  for (const p of MOCK_PRODUCTOS) {
    alcance[p.id] = {
      simple: Math.max(8, 40 - (p.vendidas_30d % 20)),
      doble: p.precio_doble != null ? Math.max(5, 25 - (p.vendidas_30d % 15)) : null,
      triple: p.precio_triple != null ? Math.max(3, 15 - (p.vendidas_30d % 10)) : null,
    }
  }

  const config = {
    activo: MOCK_FIDELIDAD_CONFIG.activo,
    compras_necesarias: MOCK_FIDELIDAD_CONFIG.compras_necesarias,
    mensaje: MOCK_FIDELIDAD_CONFIG.mensaje,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="h1">Nueva venta</h1>
        <p className="sub mt-1">En hamburguesas podés armar: sacar cosas, agregar y decidir si se cobran.</p>
      </div>
      <PuntoDeVenta productos={productos} alcance={alcance} fidelidad={config} recetas={MOCK_RECETAS} />
    </div>
  )
}
