import type { CapaVisual } from '@/lib/mock/menu'

/** Extras / toppings disponibles al armar en caja. */
export type AgregadoDef = {
  id: string
  nombre: string
  /** Precio unitario si se marca “cobrar”. */
  precio: number
  /** Aderezos suelen ir gratis por defecto; toppings se cobran. */
  cobrar_por_defecto: boolean
  capa: CapaVisual
  grupo: 'aderezo' | 'topping' | 'extra'
  activo: boolean
}

export const GRUPOS_AGREGADO: Record<AgregadoDef['grupo'], string> = {
  aderezo: 'Aderezos',
  topping: 'Toppings',
  extra: 'Extras',
}

const SEED: AgregadoDef[] = [
  { id: 'ins-salsa-triple', nombre: 'Salsa triple', precio: 300, cobrar_por_defecto: false, capa: 'salsa_triple', grupo: 'aderezo', activo: true },
  { id: 'ins-salsa-sazon', nombre: 'Salsa La Sazón', precio: 300, cobrar_por_defecto: false, capa: 'salsa_sazon', grupo: 'aderezo', activo: true },
  { id: 'ins-bbq', nombre: 'Barbacoa', precio: 300, cobrar_por_defecto: false, capa: 'bbq', grupo: 'aderezo', activo: true },
  { id: 'ins-mostaza', nombre: 'Mostaza y ketchup', precio: 0, cobrar_por_defecto: false, capa: 'mostaza', grupo: 'aderezo', activo: true },
  { id: 'ins-cheddar', nombre: 'Cheddar', precio: 800, cobrar_por_defecto: true, capa: 'cheddar', grupo: 'extra', activo: true },
  { id: 'ins-panceta', nombre: 'Panceta ahumada', precio: 1200, cobrar_por_defecto: true, capa: 'panceta', grupo: 'extra', activo: true },
  { id: 'ins-huevo', nombre: 'Huevo a la chapa', precio: 700, cobrar_por_defecto: true, capa: 'huevo', grupo: 'extra', activo: true },
  { id: 'ins-lechuga', nombre: 'Lechuga', precio: 400, cobrar_por_defecto: true, capa: 'lechuga', grupo: 'topping', activo: true },
  { id: 'ins-tomate', nombre: 'Tomate', precio: 400, cobrar_por_defecto: true, capa: 'tomate', grupo: 'topping', activo: true },
  { id: 'ins-cebolla-morada', nombre: 'Cebolla morada', precio: 300, cobrar_por_defecto: true, capa: 'cebolla_morada', grupo: 'topping', activo: true },
  { id: 'ins-cebolla', nombre: 'Cebolla', precio: 300, cobrar_por_defecto: true, capa: 'cebolla', grupo: 'topping', activo: true },
  { id: 'ins-aros', nombre: 'Aros de cebolla', precio: 900, cobrar_por_defecto: true, capa: 'aros', grupo: 'topping', activo: true },
  { id: 'ins-crispy', nombre: 'Cebollita crispy', precio: 700, cobrar_por_defecto: true, capa: 'crispy', grupo: 'topping', activo: true },
  { id: 'ins-pepinos', nombre: 'Pepinos encurtidos', precio: 400, cobrar_por_defecto: true, capa: 'pepinos', grupo: 'topping', activo: true },
]

type Store = { items: AgregadoDef[] }

function store(): Store {
  const g = globalThis as typeof globalThis & { __sazonAgregados?: Store }
  if (!g.__sazonAgregados) {
    g.__sazonAgregados = { items: SEED.map(a => ({ ...a })) }
  }
  return g.__sazonAgregados
}

/** Todos (incl. inactivos) — para admin. */
export function listAgregados(incluirInactivos = true): AgregadoDef[] {
  const items = store().items.map(a => ({ ...a }))
  return incluirInactivos ? items : items.filter(a => a.activo)
}

/** Solo activos — caja / recetas (lee el store en cada llamada). */
export function agregadosCaja(): AgregadoDef[] {
  return store().items.filter(a => a.activo).map(a => ({ ...a }))
}

export type ModLinea = {
  insumo_id: string
  nombre: string
  /** Quitar de la receta base, o agregar encima. */
  accion: 'quitar' | 'agregar'
  cobrar: boolean
  precio: number
  capa?: CapaVisual
}

export function precioMods(mods: ModLinea[]): number {
  return mods.reduce((a, m) => a + (m.accion === 'agregar' && m.cobrar ? m.precio : 0), 0)
}

export function resumenMods(mods: ModLinea[]): string {
  if (!mods.length) return ''
  const partes: string[] = []
  for (const m of mods) {
    if (m.accion === 'quitar') partes.push(`sin ${m.nombre.toLowerCase()}`)
    else if (m.cobrar) partes.push(`+${m.nombre.toLowerCase()}`)
    else partes.push(`+${m.nombre.toLowerCase()} (gratis)`)
  }
  return partes.join(' · ')
}

export function defAgregado(insumoId: string) {
  return store().items.find(a => a.id === insumoId) ?? null
}

export function guardarAgregadoMock(data: Omit<AgregadoDef, 'id' | 'activo'> & { id?: string; activo?: boolean }): AgregadoDef {
  const s = store()
  if (data.id) {
    const idx = s.items.findIndex(a => a.id === data.id)
    if (idx >= 0) {
      s.items[idx] = {
        ...s.items[idx],
        nombre: data.nombre.trim(),
        precio: data.precio,
        cobrar_por_defecto: data.cobrar_por_defecto,
        capa: data.capa,
        grupo: data.grupo,
        activo: data.activo ?? s.items[idx].activo,
      }
      return { ...s.items[idx] }
    }
  }
  const nuevo: AgregadoDef = {
    id: data.id ?? `ins-agg-${Date.now()}`,
    nombre: data.nombre.trim(),
    precio: data.precio,
    cobrar_por_defecto: data.cobrar_por_defecto,
    capa: data.capa,
    grupo: data.grupo,
    activo: data.activo ?? true,
  }
  s.items.push(nuevo)
  return { ...nuevo }
}

export function toggleAgregadoMock(id: string, activo: boolean) {
  const a = store().items.find(x => x.id === id)
  if (a) a.activo = activo
}

export const CAPAS_PARA_AGREGADO: { id: CapaVisual; label: string }[] = [
  { id: 'salsa_triple', label: 'Salsa triple' },
  { id: 'salsa_sazon', label: 'Salsa La Sazón' },
  { id: 'bbq', label: 'Barbacoa' },
  { id: 'mostaza', label: 'Mostaza / ketchup' },
  { id: 'cheddar', label: 'Cheddar' },
  { id: 'panceta', label: 'Panceta' },
  { id: 'huevo', label: 'Huevo' },
  { id: 'lechuga', label: 'Lechuga' },
  { id: 'tomate', label: 'Tomate' },
  { id: 'cebolla', label: 'Cebolla' },
  { id: 'cebolla_morada', label: 'Cebolla morada' },
  { id: 'cebolla_caramelizada', label: 'Cebolla caramelizada' },
  { id: 'cebolla_pluma', label: 'Cebolla en pluma' },
  { id: 'crispy', label: 'Crispy' },
  { id: 'aros', label: 'Aros' },
  { id: 'pepinos', label: 'Pepinos' },
]
