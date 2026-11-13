'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { CANALES, ESTADOS_VENTA, MEDIOS_PAGO, MODALIDADES, TAMANOS, type Tamano } from '@/lib/catalogo'
import { MOCK_CLIENTES, MOCK_PROGRAMA_ACTIVO } from '@/lib/mock/clientes'
import { MOCK_PRODUCTOS } from '@/lib/mock/menu'
import { MOCK_CUPONES_POR_VENCER } from '@/lib/mock/fidelizacion'
import { agregarVentaMock, cambiarEstadoMock } from '@/lib/mock/ventas'

export interface ItemVenta {
  producto_id: string
  tamano: Tamano
  cantidad: number
  /** Cargo extra por agregados cobrados (por unidad). */
  extra?: number
  /** Texto corto: sin X · +aros · +salsa (gratis) */
  mods_resumen?: string | null
}

export interface DatosVenta {
  cliente: { telefono: string; nombre: string | null; direccion: string | null } | null
  canal: string
  modalidad: string
  medio_pago: string
  estado: string
  direccion_entrega: string | null
  notas: string | null
  items: ItemVenta[]
  cupon_id: string | null
}

export interface CuponGanado {
  codigo: string
  tipo: string
  valor: number | null
  producto_nombre: string | null
  producto_categoria: string | null
  tamano: string | null
  vence_en: string | null
  cliente_nombre: string | null
  cliente_telefono: string
  compras: number
}

export interface AlertaStock {
  nombre: string
  stock_actual: number
  stock_minimo: number
  unidad: string
}

export type ResultadoVenta =
  | { ok: true; numero: number; total: number; cuponGanado: CuponGanado | null; alertas: AlertaStock[] }
  | { ok?: false; error: string }

export async function crearVenta(d: DatosVenta): Promise<ResultadoVenta> {
  await verifySession()

  if (!d.items.length) return { error: 'Agregá al menos un producto.' }
  if (!(d.canal in CANALES) || !(d.modalidad in MODALIDADES) || !(d.medio_pago in MEDIOS_PAGO)) {
    return { error: 'Revisá canal, modalidad y medio de pago.' }
  }
  if (!ESTADOS_VENTA.includes(d.estado as (typeof ESTADOS_VENTA)[number]) || d.estado === 'cancelado') {
    return { error: 'Estado de venta inválido.' }
  }
  for (const it of d.items) {
    if (!TAMANOS.includes(it.tamano) || !Number.isInteger(it.cantidad) || it.cantidad < 1 || it.cantidad > 99) {
      return { error: 'Hay un producto con cantidad o tamaño inválido.' }
    }
  }
  const telefono = d.cliente?.telefono.trim() ?? ''
  if (d.cupon_id && !telefono) return { error: 'Para usar un cupón tiene que haber un cliente cargado.' }
  if (d.modalidad === 'delivery' && !d.direccion_entrega?.trim()) return { error: 'Falta la dirección de entrega.' }

  let subtotal = 0
  let costo = 0
  const items: { nombre: string; categoria: string; tamano: string; cantidad: number; precio: number; regalo: boolean }[] = []
  for (const it of d.items) {
    const p = MOCK_PRODUCTOS.find(x => x.id === it.producto_id)
    if (!p) return { error: 'Un producto del pedido ya no existe.' }
    const precioBase = it.tamano === 'triple' ? p.precio_triple : it.tamano === 'doble' ? p.precio_doble : p.precio_simple
    const costoU = it.tamano === 'triple' ? p.costo_triple : it.tamano === 'doble' ? p.costo_doble : p.costo_simple
    if (precioBase == null) return { error: `${p.nombre} no tiene precio para ese tamaño.` }
    const extra = Math.max(0, it.extra ?? 0)
    const precio = precioBase + extra
    subtotal += precio * it.cantidad
    costo += costoU * it.cantidad
    const nombre = it.mods_resumen ? `${p.nombre} (${it.mods_resumen})` : p.nombre
    items.push({ nombre, categoria: p.categoria, tamano: it.tamano, cantidad: it.cantidad, precio, regalo: false })
  }

  const cli = telefono
    ? MOCK_CLIENTES.find(c => c.telefono.replace(/\D/g, '').endsWith(telefono.replace(/\D/g, '').slice(-10)))
      ?? MOCK_CLIENTES.find(c => c.telefono === telefono)
    : null

  const venta = agregarVentaMock({
    estado: d.estado,
    canal: d.canal,
    modalidad: d.modalidad,
    medio_pago: d.medio_pago,
    subtotal,
    descuento: 0,
    total: subtotal,
    notas: d.notas,
    direccion_entrega: d.direccion_entrega,
    creado_en: new Date().toISOString(),
    cliente_id: cli?.id ?? null,
    cliente_nombre: d.cliente?.nombre ?? cli?.nombre ?? null,
    cliente_telefono: telefono || null,
    cupon_codigo: null,
    costo,
    items,
  })

  const cuponGanado =
    cli && MOCK_PROGRAMA_ACTIVO && cli.compras_en_ciclo + 1 >= cli.compras_necesarias
      ? {
          codigo: `SAZON-${venta.numero.toString(36).toUpperCase()}`,
          tipo: 'producto',
          valor: null,
          producto_nombre: 'La Sazón',
          producto_categoria: 'hamburguesa',
          tamano: 'simple',
          vence_en: new Date(Date.now() + 30 * 86400000).toISOString(),
          cliente_nombre: cli.nombre,
          cliente_telefono: cli.telefono,
          compras: cli.compras_necesarias,
        }
      : null

  revalidatePath('/', 'layout')
  return {
    ok: true,
    numero: venta.numero,
    total: venta.total,
    cuponGanado,
    alertas: [],
  }
}

export async function cambiarEstadoVenta(id: string, nuevoEstado: string): Promise<{ ok?: true; error?: string; aviso?: string }> {
  await verifySession()
  if (!ESTADOS_VENTA.includes(nuevoEstado as (typeof ESTADOS_VENTA)[number])) return { error: 'Estado inválido.' }
  if (!cambiarEstadoMock(id, nuevoEstado)) return { error: 'No se encontró la venta.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export interface ClienteCaja {
  id: string
  telefono: string
  nombre: string | null
  direccion_default: string | null
  compras_en_ciclo: number
  compras_necesarias: number
  programa_activo: boolean
  total_compras: number
  cupones: {
    id: string
    codigo: string
    tipo: string
    valor: number | null
    tamano: string | null
    vence_en: string | null
    producto_id: string | null
    producto_nombre: string | null
    producto_categoria: string | null
  }[]
}

export async function buscarClientes(texto: string): Promise<ClienteCaja[]> {
  await verifySession()
  const t = texto.trim().toLowerCase()
  if (t.length < 2) return []
  const soloDigitos = t.replace(/\D/g, '')

  return MOCK_CLIENTES
    .filter(c => {
      const nombre = (c.nombre ?? '').toLowerCase()
      const tel = c.telefono.replace(/\D/g, '')
      return nombre.includes(t) || (soloDigitos.length >= 3 && tel.includes(soloDigitos))
    })
    .slice(0, 6)
    .map(c => ({
      id: c.id,
      telefono: c.telefono,
      nombre: c.nombre,
      direccion_default: c.direccion_default,
      compras_en_ciclo: c.compras_en_ciclo,
      compras_necesarias: c.compras_necesarias,
      programa_activo: MOCK_PROGRAMA_ACTIVO,
      total_compras: c.compras,
      cupones: MOCK_CUPONES_POR_VENCER
        .filter(cu => cu.cliente_id === c.id)
        .map(cu => ({
          id: cu.id,
          codigo: cu.codigo,
          tipo: cu.tipo,
          valor: cu.valor,
          tamano: cu.tamano,
          vence_en: cu.vence_en,
          producto_id: 'prod-la-sazon',
          producto_nombre: cu.producto_nombre,
          producto_categoria: cu.producto_categoria,
        })),
    }))
}
