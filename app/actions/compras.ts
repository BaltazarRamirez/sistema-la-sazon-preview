'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import {
  actualizarPreciosMock,
  agregarCompraMock,
  anularCompraMock,
  marcarPagadaMock,
  recibirCompraMock,
} from '@/lib/mock/compras'

export interface DatosCompra {
  proveedor_id: string
  items: { insumo_id: string; cantidad: number; precio: number }[]
  recibida: boolean
  fecha: string | null
  pagada: boolean
  medio_pago: string | null
  comprobante: string | null
  notas: string | null
}

type Resultado = { ok?: true; error?: string; id?: string; numero?: number }

export async function crearCompra(d: DatosCompra): Promise<Resultado> {
  await verifySession()
  if (!d.proveedor_id) return { error: 'Elegí el proveedor.' }
  const items = d.items.filter(i => i.insumo_id)
  if (items.length === 0) return { error: 'Agregá al menos un insumo.' }
  if (new Set(items.map(i => i.insumo_id)).size !== items.length) return { error: 'Hay un insumo repetido.' }
  for (const i of items) {
    if (!(i.cantidad > 0)) return { error: 'Todas las cantidades tienen que ser mayores a cero.' }
    if (!(i.precio >= 0)) return { error: 'Revisá los precios.' }
  }

  try {
    const r = agregarCompraMock({
      proveedor_id: d.proveedor_id,
      items,
      recibida: d.recibida,
      pagada: d.pagada,
      medio_pago: d.medio_pago,
      comprobante: d.comprobante,
      notas: d.notas,
    })
    revalidatePath('/', 'layout')
    return { ok: true, id: r.id, numero: r.numero }
  } catch {
    return { error: 'No se pudo guardar la compra.' }
  }
}

export async function actualizarPreciosCompra(
  id: string,
  items: { id: string; precio: number }[],
): Promise<Resultado> {
  await verifySession()
  for (const i of items) {
    if (!(i.precio >= 0)) return { error: 'Revisá los precios.' }
  }
  if (!actualizarPreciosMock(id, items)) return { error: 'No se pudieron actualizar los precios.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function recibirCompra(
  id: string,
  items: { id: string; cantidad_recibida: number; precio: number }[],
  _fecha: string | null,
  opts?: { pagada?: boolean; medio_pago?: string | null },
): Promise<Resultado> {
  await verifySession()
  for (const i of items) {
    if (!(i.cantidad_recibida >= 0) || !(i.precio >= 0)) return { error: 'Revisá cantidades y precios.' }
  }
  if (!recibirCompraMock(id, items, opts)) return { error: 'No se pudo registrar la recepción.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function marcarPagada(id: string, pagada: boolean, medioPago: string | null): Promise<Resultado> {
  await verifySession()
  if (!marcarPagadaMock(id, pagada, medioPago)) return { error: 'No se pudo actualizar el pago.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function anularCompra(id: string): Promise<Resultado> {
  await verifySession()
  if (!anularCompraMock(id)) return { error: 'No se pudo anular la compra.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}
