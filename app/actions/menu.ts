'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { CATEGORIAS } from '@/lib/catalogo'
import {
  agregadosCaja,
  guardarAgregadoMock,
  toggleAgregadoMock,
  type AgregadoDef,
} from '@/lib/mock/agregados'
import { guardarRecetaMock, type CapaVisual, type LineaRecetaMock } from '@/lib/mock/menu'

export interface DatosProducto {
  categoria: string
  nombre: string
  descripcion: string | null
  precio_simple: number
  precio_doble: number | null
  precio_triple: number | null
}

type Resultado = { ok?: true; error?: string; id?: string }

export async function guardarProducto(d: DatosProducto, id?: string): Promise<Resultado> {
  await verifySession()
  if (!d.nombre.trim()) return { error: 'Falta el nombre.' }
  if (!(d.categoria in CATEGORIAS)) return { error: 'Categoría inválida.' }
  for (const p of [d.precio_simple, d.precio_doble, d.precio_triple]) {
    if (p != null && !(p >= 0)) return { error: 'Revisá los precios.' }
  }
  if (!(d.precio_simple >= 0)) return { error: 'Falta el precio principal.' }
  revalidatePath('/', 'layout')
  return { ok: true, id: id ?? `prod-${Date.now()}` }
}

export async function toggleProducto(_id: string, _activo: boolean): Promise<Resultado> {
  await verifySession()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export interface ItemReceta {
  insumo_id: string
  cant_simple: number
  cant_doble: number
  cant_triple: number
  capa?: CapaVisual
  etiqueta?: string
  escala_con_tamano?: boolean
}

function metaInsumo(insumoId: string): { capa: CapaVisual; etiqueta: string; escala?: boolean } {
  const a = agregadosCaja().find(x => x.id === insumoId)
  if (a) return { capa: a.capa, etiqueta: a.nombre, escala: a.id === 'ins-cheddar' }
  if (insumoId === 'ins-pan') return { capa: 'pan_arriba', etiqueta: 'Pan de papa' }
  if (insumoId === 'ins-bollo') return { capa: 'carne', etiqueta: 'Bollo de carne', escala: true }
  if (insumoId === 'ins-caja-hamb') return { capa: 'caja', etiqueta: 'Caja hamburguesa' }
  if (insumoId === 'ins-caja-pizza') return { capa: 'caja', etiqueta: 'Caja pizza' }
  if (insumoId === 'ins-masa') return { capa: 'masa', etiqueta: 'Masa de pizza' }
  if (insumoId === 'ins-muzza') return { capa: 'muzza', etiqueta: 'Muzzarella' }
  if (insumoId === 'ins-salsa-tomate') return { capa: 'salsa_tomate', etiqueta: 'Salsa de tomate' }
  return { capa: 'cheddar', etiqueta: insumoId }
}

export async function guardarAgregado(d: {
  id?: string
  nombre: string
  precio: number
  grupo: AgregadoDef['grupo']
  capa: CapaVisual
  cobrar_por_defecto: boolean
}): Promise<Resultado> {
  await verifySession()
  if (!d.nombre.trim()) return { error: 'Falta el nombre.' }
  if (!(d.precio >= 0)) return { error: 'Revisá el precio.' }
  if (!['aderezo', 'topping', 'extra'].includes(d.grupo)) return { error: 'Grupo inválido.' }
  const a = guardarAgregadoMock({
    id: d.id,
    nombre: d.nombre,
    precio: d.precio,
    grupo: d.grupo,
    capa: d.capa,
    cobrar_por_defecto: d.cobrar_por_defecto,
  })
  revalidatePath('/', 'layout')
  return { ok: true, id: a.id }
}

export async function toggleAgregado(id: string, activo: boolean): Promise<Resultado> {
  await verifySession()
  if (!id) return { error: 'Agregado inválido.' }
  toggleAgregadoMock(id, activo)
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Preview mock: guarda la receta en memoria (orden de capas inclusive). */
export async function guardarReceta(productoId: string, items: ItemReceta[]): Promise<Resultado> {
  await verifySession()
  if (!productoId) return { error: 'Producto inválido.' }
  const validos = items.filter(i => i.insumo_id)
  for (const i of validos) {
    if ([i.cant_simple, i.cant_doble, i.cant_triple].some(n => !(n >= 0))) {
      return { error: 'Las cantidades no pueden ser negativas.' }
    }
  }
  const lineas: LineaRecetaMock[] = validos.map(i => {
    const meta = metaInsumo(i.insumo_id)
    return {
      insumo_id: i.insumo_id,
      capa: i.capa ?? meta.capa,
      etiqueta: i.etiqueta ?? meta.etiqueta,
      cant_simple: i.cant_simple,
      cant_doble: i.cant_doble,
      cant_triple: i.cant_triple,
      escala_con_tamano: i.escala_con_tamano ?? meta.escala,
    }
  })
  guardarRecetaMock(productoId, lineas)
  revalidatePath('/', 'layout')
  return { ok: true }
}
