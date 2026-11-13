'use server'

import { revalidatePath } from 'next/cache'
import { TAMANOS, type Tamano } from '@/lib/catalogo'
import { MOCK_PRODUCTOS } from '@/lib/mock/menu'
import { agregarVentaMock } from '@/lib/mock/ventas'

/** WhatsApp del local (preview). No exportar: en "use server" solo van funciones async. */
const WA_LOCAL = '5493815550100'

type ItemPedidoCarta = {
  producto_id: string
  tamano: Tamano
  cantidad: number
  /** Cargo por agregados cobrados (por unidad). */
  extra?: number
  mods_resumen?: string | null
  /** Precio unitario forzado (ej. parte de una promo). */
  precio_override?: number | null
}

type ResultadoPedidoCarta =
  | { ok: true; numero: number; total: number; waUrl: string | null }
  | { ok?: false; error: string }

/**
 * Pedido desde la carta pública (sin login).
 * - mesa: salón → entra pendiente; al confirmar pago en el panel pasa a confirmado.
 * - sin mesa: WhatsApp → entra pendiente y se abre el chat con el pedido armado.
 */
export async function crearPedidoCarta(d: {
  items: ItemPedidoCarta[]
  mesa?: number | null
  nombre?: string | null
  telefono?: string | null
  direccion?: string | null
  notas?: string | null
  /** 'mesa' | 'whatsapp' */
  modo: 'mesa' | 'whatsapp'
}): Promise<ResultadoPedidoCarta> {
  if (!d.items.length) return { error: 'Agregá al menos un producto.' }
  if (d.modo === 'mesa') {
    const m = d.mesa
    if (m == null || !Number.isInteger(m) || m < 1 || m > 99) return { error: 'Mesa inválida. Escaneá el QR de tu mesa.' }
  }
  if (d.modo === 'whatsapp') {
    const tel = (d.telefono ?? '').replace(/\D/g, '')
    if (tel.length < 8) return { error: 'Necesitamos tu WhatsApp para el pedido.' }
  }

  let subtotal = 0
  let costo = 0
  const items: { nombre: string; categoria: string; tamano: string; cantidad: number; precio: number; regalo: boolean }[] = []

  for (const it of d.items) {
    if (!TAMANOS.includes(it.tamano) || !Number.isInteger(it.cantidad) || it.cantidad < 1 || it.cantidad > 99) {
      return { error: 'Hay un producto con cantidad o tamaño inválido.' }
    }
    const p = MOCK_PRODUCTOS.find(x => x.id === it.producto_id && x.activo)
    if (!p) return { error: 'Un producto ya no está en la carta.' }
    const precioLista = it.tamano === 'triple' ? p.precio_triple : it.tamano === 'doble' ? p.precio_doble : p.precio_simple
    const costoU = it.tamano === 'triple' ? p.costo_triple : it.tamano === 'doble' ? p.costo_doble : p.costo_simple
    if (precioLista == null && it.precio_override == null) return { error: `${p.nombre} no tiene ese tamaño.` }
    const extra = Math.max(0, it.extra ?? 0)
    const base = it.precio_override != null ? it.precio_override : precioLista!
    const precio = base + extra
    subtotal += precio * it.cantidad
    costo += (costoU ?? 0) * it.cantidad
    const detalleTxt = it.mods_resumen || null
    const nombre = detalleTxt ? `${p.nombre} (${detalleTxt})` : p.nombre
    items.push({
      nombre,
      categoria: p.categoria,
      tamano: it.tamano,
      cantidad: it.cantidad,
      precio,
      regalo: false,
    })
  }

  const esMesa = d.modo === 'mesa'
  const mesa = esMesa ? d.mesa! : null
  const telefono = (d.telefono ?? '').trim() || null
  const nombre = (d.nombre ?? '').trim() || (esMesa ? `Mesa ${mesa}` : null)
  const notasParts = [
    esMesa ? `Pedido desde carta · mesa ${mesa}` : 'Pedido desde carta · WhatsApp',
    d.notas?.trim() || null,
  ].filter(Boolean)

  const venta = agregarVentaMock({
    estado: 'pendiente',
    canal: esMesa ? 'mostrador' : 'whatsapp',
    modalidad: esMesa ? 'salon' : (d.direccion?.trim() ? 'delivery' : 'take_away'),
    medio_pago: esMesa ? 'efectivo' : 'transferencia',
    subtotal,
    descuento: 0,
    total: subtotal,
    notas: notasParts.join(' · '),
    direccion_entrega: d.direccion?.trim() || null,
    creado_en: new Date().toISOString(),
    cliente_id: null,
    cliente_nombre: nombre,
    cliente_telefono: telefono,
    cupon_codigo: null,
    mesa,
    costo,
    items,
  })

  let waUrl: string | null = null
  if (!esMesa) {
    const lineas = items.map(i => `• ${i.cantidad}× ${i.nombre} (${i.tamano})`).join('\n')
    const texto = [
      `Hola! Pedido desde la carta #${venta.numero}`,
      nombre ? `Nombre: ${nombre}` : null,
      telefono ? `WhatsApp: ${telefono}` : null,
      d.direccion?.trim() ? `Dirección: ${d.direccion.trim()}` : 'Retiro en el local',
      '',
      lineas,
      '',
      `Total: $${Math.round(subtotal).toLocaleString('es-AR')}`,
      d.notas?.trim() ? `Nota: ${d.notas.trim()}` : null,
    ].filter(x => x != null).join('\n')
    waUrl = `https://wa.me/${WA_LOCAL}?text=${encodeURIComponent(texto)}`
  }

  revalidatePath('/', 'layout')
  revalidatePath('/carta')
  return { ok: true, numero: venta.numero, total: venta.total, waUrl }
}
