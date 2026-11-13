import type { Tamano } from '@/lib/catalogo'
import { getProducto } from '@/lib/mock/menu'

/** Ítem de una promo: producto del menú (no texto libre). */
export type PromoItem = {
  producto_id: string
  tamano: Tamano
  cantidad: number
}

export type PromoDetalle = {
  id: string
  items: PromoItem[]
}

const SEED: Record<string, PromoDetalle> = {
  'promo-duo-sazon': {
    id: 'promo-duo-sazon',
    items: [
      { producto_id: 'prod-la-sazon', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-papas', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-coca', tamano: 'simple', cantidad: 1 },
    ],
  },
  'promo-pizza-birra': {
    id: 'promo-pizza-birra',
    items: [
      { producto_id: 'prod-muzza', tamano: 'simple', cantidad: 1 },
      { producto_id: 'prod-cerveza', tamano: 'simple', cantidad: 1 },
    ],
  },
  'promo-clasica-doble': {
    id: 'promo-clasica-doble',
    items: [
      { producto_id: 'prod-clasica', tamano: 'doble', cantidad: 1 },
      { producto_id: 'prod-papas', tamano: 'simple', cantidad: 1 },
    ],
  },
}

type PromosStore = { byId: Record<string, PromoDetalle> }

function storePromos(): PromosStore {
  const g = globalThis as typeof globalThis & { __sazonPromos?: PromosStore }
  if (!g.__sazonPromos) {
    g.__sazonPromos = {
      byId: Object.fromEntries(
        Object.entries(SEED).map(([k, v]) => [
          k,
          { id: v.id, items: v.items.map(i => ({ ...i })) },
        ]),
      ),
    }
  }
  return g.__sazonPromos
}

export function detallePromo(id: string): PromoDetalle | null {
  return storePromos().byId[id] ?? null
}

export function cantidadItemsPromo(id: string): number {
  return detallePromo(id)?.items.length ?? 0
}

/** Etiquetas legibles desde productos del menú (carta / listados). */
export function labelsPromo(id: string): string[] {
  const det = detallePromo(id)
  if (!det) return []
  return det.items.map(it => {
    const p = getProducto(it.producto_id)
    const nombre = p?.nombre ?? it.producto_id
    const t = it.tamano !== 'simple' ? ` ${it.tamano}` : ''
    const c = it.cantidad > 1 ? ` ×${it.cantidad}` : ''
    return `${nombre}${t}${c}`
  })
}

export function guardarPromoItemsMock(promoId: string, items: PromoItem[]) {
  storePromos().byId[promoId] = {
    id: promoId,
    items: items
      .filter(i => i.producto_id && i.cantidad > 0)
      .map(i => ({
        producto_id: i.producto_id,
        tamano: i.tamano,
        cantidad: i.cantidad,
      })),
  }
  return true
}
