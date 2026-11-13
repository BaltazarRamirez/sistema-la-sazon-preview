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
]
