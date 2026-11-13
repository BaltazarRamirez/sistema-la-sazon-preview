import Link from 'next/link'
import { notFound } from 'next/navigation'
import { labelCategoria } from '@/lib/catalogo'
import { getProducto, getReceta, MOCK_PRODUCTOS } from '@/lib/mock/menu'
import { detallePromo } from '@/lib/mock/promos'
import { MOCK_INSUMOS } from '@/lib/mock/stock'
import HamburguesaArmada from '@/components/HamburguesaArmada'
import EditorPromo from '@/components/EditorPromo'

export const dynamic = 'force-dynamic'

const SIN_RECETA = new Set(['bebida', 'acompanamiento', 'postre'])

export default async function RecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const producto = getProducto(id)
  if (!producto) notFound()

  const hermanos = MOCK_PRODUCTOS
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id && p.activo)
    .slice(0, 8)

  if (producto.categoria === 'promo') {
    const det = detallePromo(id)
    const catalogo = MOCK_PRODUCTOS.map(p => ({
      id: p.id,
      categoria: p.categoria,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_simple: p.precio_simple,
      precio_doble: p.precio_doble,
      precio_triple: p.precio_triple,
      activo: p.activo,
      costo_simple: p.costo_simple,
      costo_doble: p.costo_doble,
      costo_triple: p.costo_triple,
      insumos_en_receta: p.insumos_en_receta,
      vendidas_30d: p.vendidas_30d,
    }))
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/menu" className="text-xs link">← Menú y recetas</Link>
            <h1 className="h1 mt-1">{producto.nombre}</h1>
            <p className="sub mt-1">
              {labelCategoria(producto.categoria)}
              {producto.descripcion ? ` · ${producto.descripcion}` : ''}
            </p>
          </div>
          {!producto.activo && <span className="chip chip-neutral">Desactivado</span>}
        </div>

        <EditorPromo
          promo={catalogo.find(p => p.id === producto.id)!}
          itemsInicial={det?.items ?? []}
          catalogo={catalogo}
        />

        {hermanos.length > 0 && (
          <div>
            <p className="eyebrow mb-2">Otras promos</p>
            <div className="flex flex-wrap gap-2">
              {hermanos.map(p => (
                <Link key={p.id} href={`/menu/${p.id}`} className="chip chip-neutral hover:border-[var(--gold)]/40 transition-colors">
                  {p.nombre}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (SIN_RECETA.has(producto.categoria)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/menu" className="text-xs link">← Menú y recetas</Link>
            <h1 className="h1 mt-1">{producto.nombre}</h1>
            <p className="sub mt-1">
              {labelCategoria(producto.categoria)}
              {producto.descripcion ? ` · ${producto.descripcion}` : ''}
            </p>
          </div>
          {!producto.activo && <span className="chip chip-neutral">Desactivado</span>}
        </div>
        <div className="card px-6 py-10 text-center sub">
          Este producto no lleva receta de cocina: se vende tal cual, sin descontar insumos por capas.
        </div>
        {hermanos.length > 0 && (
          <div>
            <p className="eyebrow mb-2">Otras {labelCategoria(producto.categoria).toLowerCase()}</p>
            <div className="flex flex-wrap gap-2">
              {hermanos.map(p => (
                <Link key={p.id} href={`/menu/${p.id}`} className="chip chip-neutral hover:border-[var(--gold)]/40 transition-colors">
                  {p.nombre}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const receta = getReceta(id)
  const insumos = MOCK_INSUMOS.map(i => ({
    id: i.id,
    nombre: i.nombre,
    unidad: i.unidad,
    costo_unitario: i.costo_unitario,
    stock_actual: i.stock_actual,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/menu" className="text-xs link">← Menú y recetas</Link>
          <h1 className="h1 mt-1">{producto.nombre}</h1>
          <p className="sub mt-1">
            {labelCategoria(producto.categoria)}
            {producto.descripcion ? ` · ${producto.descripcion}` : ''}
          </p>
        </div>
        {!producto.activo && <span className="chip chip-neutral">Desactivado</span>}
      </div>

      {receta.length === 0 ? (
        <div className="card px-6 py-10 text-center sub">Todavía no hay receta cargada para este producto.</div>
      ) : (
        <HamburguesaArmada producto={producto} receta={receta} insumos={insumos} />
      )}

      {hermanos.length > 0 && (
        <div>
          <p className="eyebrow mb-2">Otras {labelCategoria(producto.categoria).toLowerCase()}s</p>
          <div className="flex flex-wrap gap-2">
            {hermanos.map(p => (
              <Link key={p.id} href={`/menu/${p.id}`} className="chip chip-neutral hover:border-[var(--gold)]/40 transition-colors">
                {p.nombre}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
