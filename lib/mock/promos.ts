import type { Tamano } from '@/lib/catalogo'

/** Detalle de qué incluye cada promo (para mostrar en carta). */
export type PromoDetalle = {
  id: string
  incluye: string[]
  /** Productos que descuenta stock al vender (preview). */
  items: { producto_id: string; tamano: Tamano; cantidad: number }[]
}

export const PROMO_DETALLE: Record<string, PromoDetalle> = {
  'promo-duo-sazon': {
    id: 'promo-duo-sazon',
    incluye: ['La Sazón simple', 'Papas fritas chicas', 'Gaseosa 500 ml'],
    items: [
      { producto_id: 'prod-la-sazon', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-papas', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-coca', tamano: 'simple', cantidad: 1 },
    ],
  },
  'promo-pizza-birra': {
    id: 'promo-pizza-birra',
    incluye: ['Muzza Simple 4 porc.', 'Cerveza artesanal'],
    items: [
      { producto_id: 'prod-muzza', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-cerveza', tamano: 'simple', cantidad: 1 },
    ],
  },
  'promo-clasica-doble': {
    id: 'promo-clasica-doble',
    incluye: ['Clásica doble', 'Papas fritas chicas'],
    items: [
      { producto_id: 'prod-clasica', tamano: 'doble', cantidad: 1 },
      { producto_id: 'prod-papas', tamano: 'simple', cantidad: 1 },
    ],
  },
}

export function detallePromo(id: string) {
  return PROMO_DETALLE[id] ?? null
}
