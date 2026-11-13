import type { ConfigFidelidad } from '@/app/actions/fidelidad'
import { MOCK_PRODUCTOS } from '@/lib/mock/menu'
import { MOCK_CLIENTES } from '@/lib/mock/clientes'

function isoHace(dias: number, horas = 0) {
  return new Date(Date.now() - dias * 86400000 - horas * 3600000).toISOString()
}

function isoEn(dias: number) {
  return new Date(Date.now() + dias * 86400000).toISOString()
}

export const MOCK_FIDELIDAD_CONFIG: ConfigFidelidad = {
  activo: true,
  compras_necesarias: 5,
  ventana_dias: null,
  monto_minimo: 0,
  premio_tipo: 'producto',
  premio_valor: null,
  premio_producto_id: 'prod-la-sazon',
  premio_tamano: 'simple',
  vencimiento_dias: 30,
  mensaje: '¡Hola {nombre}! Gracias por elegirnos {compras} veces 🍔 Te ganaste {premio}. Mostrá el código {codigo} en tu próximo pedido{vence}.',
}

export const MOCK_FIDELIDAD_PRODUCTOS = MOCK_PRODUCTOS
  .filter(p => p.activo)
  .map(p => ({ id: p.id, nombre: p.nombre, categoria: p.categoria, precio_doble: p.precio_doble, precio_triple: p.precio_triple }))

export const MOCK_FIDELIDAD_STATS = {
  emitidos: 14,
  usados: 9,
  regalado: 108000,
  ventas: 312,
  ventas_identificadas: 198,
  clientes_activos: 25,
  vencidos: 3,
}

export const MOCK_CERCA_PREMIO = MOCK_CLIENTES
  .filter(c => c.compras_necesarias - c.compras_en_ciclo === 1 && c.cupones === 0)
  .slice(0, 8)
  .map(c => ({
    id: c.id,
    nombre: c.nombre,
    telefono: c.telefono,
    compras_en_ciclo: c.compras_en_ciclo,
    compras_necesarias: c.compras_necesarias,
    ultima: c.ultima,
  }))

export const MOCK_CUPONES_POR_VENCER = [
  {
    id: 'cup-1', codigo: 'SAZON-7K2', tipo: 'producto', valor: null, tamano: 'simple', vence_en: isoEn(2),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa',
    cliente_id: 'cli-02', nombre: 'Joaquín Pérez', telefono: '+5493815000002',
  },
  {
    id: 'cup-2', codigo: 'SAZON-9M1', tipo: 'producto', valor: null, tamano: 'simple', vence_en: isoEn(5),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa',
    cliente_id: 'cli-12', nombre: 'Facundo Medina', telefono: '+5493815000012',
  },
]

export const MOCK_CUPONES_ULTIMOS = [
  {
    id: 'cup-3', codigo: 'SAZON-7K2', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'disponible', creado_en: isoHace(3), vence_en: isoEn(2),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', cliente_id: 'cli-02', nombre: 'Joaquín Pérez',
  },
  {
    id: 'cup-4', codigo: 'SAZON-9M1', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'disponible', creado_en: isoHace(1), vence_en: isoEn(5),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', cliente_id: 'cli-12', nombre: 'Facundo Medina',
  },
  {
    id: 'cup-5', codigo: 'SAZON-2AB', origen: 'manual', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'usado', creado_en: isoHace(8), vence_en: isoHace(-1),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', cliente_id: 'cli-18', nombre: 'Franco Suárez',
  },
  {
    id: 'cup-6', codigo: 'SAZON-4XY', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'vencido', creado_en: isoHace(40), vence_en: isoHace(5),
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', cliente_id: 'cli-07', nombre: 'Camila Sosa',
  },
  {
    id: 'cup-7', codigo: 'BDAY-3F1', origen: 'cumple', tipo: 'porcentaje', valor: 20, tamano: null,
    estado: 'disponible', creado_en: isoHace(0, 6), vence_en: isoEn(7),
    producto_nombre: null, producto_categoria: null, cliente_id: 'cli-05', nombre: 'Valentina Ruiz',
  },
  {
    id: 'cup-9', codigo: 'PED-COCA', origen: 'pedido', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'usado', creado_en: isoHace(4), vence_en: isoEn(10),
    producto_nombre: 'Papas fritas', producto_categoria: 'acompanamiento', cliente_id: 'cli-03', nombre: 'Sofía Díaz',
  },
  {
    id: 'cup-10', codigo: 'SORT-NOV', origen: 'sorteo', tipo: 'producto', valor: null, tamano: 'doble',
    estado: 'disponible', creado_en: isoHace(1, 4), vence_en: isoEn(15),
    producto_nombre: 'Americana', producto_categoria: 'hamburguesa', cliente_id: 'cli-08', nombre: 'Mateo Álvarez',
  },
]

/** Otras mecánicas del programa (preview mock). */
export const MOCK_MECANICAS = [
  {
    id: 'mec-ciclo',
    titulo: 'Cada N compras',
    detalle: 'Cada 5 compras → La Sazón simple',
    activo: true,
    tipo: 'ciclo' as const,
  },
  {
    id: 'mec-pedido-coca',
    titulo: 'Premio por pedido',
    detalle: 'Si pedís 2 hamburguesas + gaseosa → papas chicas gratis',
    activo: true,
    tipo: 'pedido' as const,
  },
  {
    id: 'mec-ticket',
    titulo: 'Ticket alto',
    detalle: 'Pedidos de $25.000 o más → 10% off en el próximo',
    activo: true,
    tipo: 'pedido' as const,
  },
  {
    id: 'mec-viernes',
    titulo: 'Doble viernes',
    detalle: 'Los viernes cada compra cuenta ×2 en el ciclo',
    activo: false,
    tipo: 'bonus' as const,
  },
  {
    id: 'mec-cumple',
    titulo: 'Cumpleaños',
    detalle: '20% off la semana del cumple (aviso por WhatsApp)',
    activo: true,
    tipo: 'cumple' as const,
  },
]

export const MOCK_SORTEOS = [
  {
    id: 'sort-1',
    titulo: 'Combo dúo gratis',
    premio: 'Dúo La Sazón + gaseosa',
    cierra_en: isoEn(4),
    estado: 'abierto' as const,
    participantes: 38,
    ganadores: 0,
    como_entra: '1 chance por cada pedido con WhatsApp cargado',
  },
  {
    id: 'sort-2',
    titulo: 'Merch La Sazón',
    premio: 'Remera + stickers',
    cierra_en: isoEn(18),
    estado: 'abierto' as const,
    participantes: 12,
    ganadores: 0,
    como_entra: 'Clientes con 3+ pedidos en el mes',
  },
  {
    id: 'sort-3',
    titulo: 'Americana doble',
    premio: '1 Americana doble gratis',
    cierra_en: isoHace(3),
    estado: 'cerrado' as const,
    participantes: 54,
    ganadores: 1,
    como_entra: 'Sorteo de octubre · ya entregado',
  },
]

export const MOCK_INSCRIPTOS_SORTEO = MOCK_CLIENTES.slice(0, 6).map((c, i) => ({
  id: c.id,
  nombre: c.nombre,
  telefono: c.telefono,
  chances: 1 + (i % 3),
  ultima_chance: isoHace(i % 4),
}))

export const MOCK_PREMIOS_PEDIDO = [
  {
    id: 'rp-1',
    nombre: 'Combo 2 burgers',
    condicion: '2 hamburguesas + 1 gaseosa en el mismo pedido',
    premio: 'Papas fritas chicas gratis',
    activos_hoy: 3,
    canjes_30d: 11,
  },
  {
    id: 'rp-2',
    nombre: 'Ticket $25k',
    condicion: 'Pedido de $25.000 o más',
    premio: '10% off en el próximo pedido',
    activos_hoy: 5,
    canjes_30d: 7,
  },
  {
    id: 'rp-3',
    nombre: 'Primera pizzita',
    condicion: 'Primera pizzita del cliente',
    premio: 'Gaseosa 500 ml gratis',
    activos_hoy: 1,
    canjes_30d: 4,
  },
]

export const MOCK_CUMPLES_SEMANA = [
  { id: 'cli-05', nombre: 'Valentina Ruiz', telefono: '+5493815000005', dia: 'Hoy', cupon: 'BDAY-3F1' },
  { id: 'cli-11', nombre: 'Agustina Herrera', telefono: '+5493815000011', dia: 'Mañana', cupon: null },
  { id: 'cli-21', nombre: 'Lucía Navarro', telefono: '+5493815000021', dia: 'Domingo', cupon: null },
]

export function labelOrigenCupon(origen: string) {
  if (origen === 'fidelidad' || origen === 'automatico') return 'Por compras'
  if (origen === 'manual') return 'Regalo manual'
  if (origen === 'sorteo') return 'Sorteo'
  if (origen === 'pedido') return 'Por pedido'
  if (origen === 'cumple') return 'Cumpleaños'
  return origen
}
