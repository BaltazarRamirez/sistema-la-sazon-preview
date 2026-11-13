import type { CapaVisual } from '@/lib/mock/menu'
import type { AgregadoDef } from '@/lib/mock/agregados'

/** Toppings extras para armar pizzitas en carta / caja. */
export const AGGREGADOS_PIZZA: AgregadoDef[] = [
  { id: 'ins-pepperoni', nombre: 'Pepperoni', precio: 1200, cobrar_por_defecto: true, capa: 'pepperoni', grupo: 'extra', activo: true },
  { id: 'ins-jamon', nombre: 'Jamón', precio: 1000, cobrar_por_defecto: true, capa: 'jamon', grupo: 'extra', activo: true },
  { id: 'ins-morrones', nombre: 'Morrones', precio: 800, cobrar_por_defecto: true, capa: 'morrones', grupo: 'topping', activo: true },
  { id: 'ins-cherry', nombre: 'Tomates cherry', precio: 700, cobrar_por_defecto: true, capa: 'cherry', grupo: 'topping', activo: true },
  { id: 'ins-azul', nombre: 'Queso azul', precio: 1100, cobrar_por_defecto: true, capa: 'azul', grupo: 'extra', activo: true },
  { id: 'ins-parmesano', nombre: 'Parmesano', precio: 700, cobrar_por_defecto: true, capa: 'parmesano', grupo: 'extra', activo: true },
  { id: 'ins-muzza', nombre: 'Extra muzza', precio: 900, cobrar_por_defecto: true, capa: 'muzza', grupo: 'extra', activo: true },
  { id: 'ins-panceta', nombre: 'Panceta', precio: 1200, cobrar_por_defecto: true, capa: 'panceta', grupo: 'extra', activo: true },
  { id: 'ins-cebolla', nombre: 'Cebollita en pluma', precio: 500, cobrar_por_defecto: true, capa: 'cebolla_pluma', grupo: 'topping', activo: true },
  { id: 'ins-nueces', nombre: 'Nueces', precio: 800, cobrar_por_defecto: true, capa: 'nueces', grupo: 'topping', activo: true },
  { id: 'ins-albahaca', nombre: 'Albahaca', precio: 400, cobrar_por_defecto: true, capa: 'albahaca', grupo: 'topping', activo: true },
  { id: 'ins-oliva', nombre: 'Aceite de oliva', precio: 300, cobrar_por_defecto: true, capa: 'oliva', grupo: 'aderezo', activo: true },
  { id: 'ins-tomate', nombre: 'Tomate', precio: 500, cobrar_por_defecto: true, capa: 'tomate', grupo: 'topping', activo: true },
]

export function defAgregadoPizza(insumoId: string) {
  return AGGREGADOS_PIZZA.find(a => a.id === insumoId) ?? null
}

export function agregadosPizza(): AgregadoDef[] {
  return AGGREGADOS_PIZZA.filter(a => a.activo).map(a => ({ ...a }))
}

export type CapaPizza = CapaVisual
