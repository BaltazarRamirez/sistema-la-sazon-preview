import Image from 'next/image'
import type { Metadata } from 'next'
import { ORDEN_CATEGORIAS } from '@/lib/catalogo'
import { getReceta, MOCK_PRODUCTOS } from '@/lib/mock/menu'
import { ventasDeMesa } from '@/lib/mock/ventas'
import CartaPedido from '@/components/CartaPedido'
import CartaHistorialMesa from '@/components/CartaHistorialMesa'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'La Sazón · Carta',
  description: 'Carta digital de La Sazón — pedí desde la mesa o por WhatsApp.',
  robots: { index: false, follow: false },
}

export default async function CartaPage({
  searchParams,
}: {
  searchParams: Promise<{ mesa?: string }>
}) {
  const { mesa: mesaRaw } = await searchParams
  const mesaParsed = mesaRaw?.trim() && /^\d{1,2}$/.test(mesaRaw.trim()) ? Number(mesaRaw.trim()) : null
  const mesa = mesaParsed != null && mesaParsed >= 1 && mesaParsed <= 99 ? mesaParsed : null

  const productos = MOCK_PRODUCTOS.filter(p => p.activo)
  const categorias = ORDEN_CATEGORIAS.filter(c => productos.some(p => p.categoria === c))
  const recetas = Object.fromEntries(productos.map(p => [p.id, getReceta(p.id)]))
  const historialMesa = mesa != null ? ventasDeMesa(mesa) : []

  return (
    <div className="min-h-screen relative">
      <div
        className="pointer-events-none fixed inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(31,107,58,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(252,228,180,0.06), transparent 45%)',
        }}
      />

      <header className="relative pt-10 pb-6 px-5 text-center anim-fade-up">
        <Image
          src="/logo-la-sazon.png"
          alt="La Sazón"
          width={112}
          height={112}
          priority
          className="mx-auto rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        />
        <h1 className="font-display text-[clamp(2.4rem,8vw,3.4rem)] font-extrabold tracking-tight mt-5 leading-none">
          La <span className="text-[var(--gold)]">Sazón</span>
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] text-[15px] max-w-sm mx-auto">
          {mesa
            ? 'Elegí y enviá el pedido a cocina desde tu mesa'
            : 'Armá el pedido y mandalo por WhatsApp'}
        </p>
        {mesa != null && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--gold)]">
            Mesa {mesa}
          </p>
        )}
      </header>

      {mesa != null && <CartaHistorialMesa mesa={mesa} pedidos={historialMesa} />}

      <CartaPedido productos={productos} categorias={categorias} mesa={mesa} recetas={recetas} />

      <footer className="relative text-center px-5 pb-10 text-[11px] text-[var(--ink-mute)]">
        Precios sujetos a cambio · Fotos provisionales · La Sazón
      </footer>
    </div>
  )
}
