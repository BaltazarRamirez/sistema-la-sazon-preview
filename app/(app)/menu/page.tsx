import Link from 'next/link'
import TablaMenu from '@/components/TablaMenu'
import TablaAgregados from '@/components/TablaAgregados'
import CartaQrAdmin from '@/components/CartaQrAdmin'
import { listAgregados } from '@/lib/mock/agregados'
import { MOCK_PRODUCTOS } from '@/lib/mock/menu'

export const dynamic = 'force-dynamic'

const SECCIONES = [
  { id: 'productos', label: 'Productos' },
  { id: 'agregados', label: 'Agregados' },
  { id: 'carta', label: 'Carta (QR)' },
] as const

type Seccion = (typeof SECCIONES)[number]['id']

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>
}) {
  const { vista } = await searchParams
  const seccion: Seccion = SECCIONES.some(s => s.id === vista) ? (vista as Seccion) : 'productos'

  const productos = MOCK_PRODUCTOS
  /** Bebidas, acompañamientos, promos y postres no llevan receta de cocina. */
  const sinRecetaCats = new Set(['bebida', 'acompanamiento', 'postre', 'promo'])
  const sinReceta = productos.filter(
    p => p.activo && p.insumos_en_receta === 0 && !sinRecetaCats.has(p.categoria),
  )
  const agregados = listAgregados(true)

  const sub =
    seccion === 'agregados'
      ? 'Extras y toppings que se suman o sacan al armar en caja.'
        : seccion === 'carta'
        ? 'Link y QR para la carta (promos, burgers, pizzas, bebidas). Historial de mesa en Ventas → Mesas.'
        : 'Precios, costo de cada producto según su receta y margen por tamaño.'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Menú y recetas</h1>
        <p className="sub mt-1">{sub}</p>
      </div>

      <div className="flex gap-1.5 bg-[var(--char)] border border-[var(--line-soft)] rounded-xl p-1 w-fit max-w-full overflow-x-auto">
        {SECCIONES.map(s => (
          <Link
            key={s.id}
            href={s.id === 'productos' ? '/menu' : `/menu?vista=${s.id}`}
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

      {seccion === 'productos' && (
        <>
          {sinReceta.length > 0 && (
            <div className="card px-5 py-3 bg-[var(--warn-bg)] border-[var(--warn)]/30 text-sm">
              <b className="text-[var(--warn)]">{sinReceta.length} {sinReceta.length === 1 ? 'producto no tiene' : 'productos no tienen'} receta:</b>{' '}
              {sinReceta.map(p => p.nombre).join(', ')}. Sus ventas no descuentan stock hasta que la cargues.
            </div>
          )}
          <TablaMenu productos={productos} />
        </>
      )}

      {seccion === 'agregados' && <TablaAgregados items={agregados} />}

      {seccion === 'carta' && <CartaQrAdmin />}
    </div>
  )
}
