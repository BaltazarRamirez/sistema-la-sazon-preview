'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'

export interface DatosProveedor {
  nombre: string
  rubro: string | null
  contacto: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  cuit: string | null
  dias_entrega: string | null
  demora_prometida_horas: number | null
  pedido_minimo: number | null
  condicion_pago: string | null
  notas: string | null
}

type Resultado = { ok?: true; error?: string; id?: string }

export async function guardarProveedor(d: DatosProveedor, id?: string): Promise<Resultado> {
  await verifySession()
  if (!d.nombre.trim()) return { error: 'Falta el nombre del proveedor.' }
  if (d.demora_prometida_horas != null && d.demora_prometida_horas < 0) return { error: 'La demora no puede ser negativa.' }
  revalidatePath('/', 'layout')
  return { ok: true, id: id ?? `prov-${Date.now()}` }
}

export async function toggleProveedor(_id: string, _activo: boolean): Promise<Resultado> {
  await verifySession()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function guardarPrecio(_proveedorId: string, insumoId: string, precio: number, _nota: string | null): Promise<Resultado> {
  await verifySession()
  if (!insumoId) return { error: 'Elegí el insumo.' }
  if (!(precio >= 0)) return { error: 'El precio no es válido.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function quitarDeLista(_proveedorId: string, _insumoId: string): Promise<Resultado> {
  await verifySession()
  revalidatePath('/', 'layout')
  return { ok: true }
}
