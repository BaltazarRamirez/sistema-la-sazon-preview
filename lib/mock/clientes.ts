import type { ClienteFila } from '@/components/ListaClientes'

function isoHace(dias: number, horas = 0) {
  return new Date(Date.now() - dias * 86400000 - horas * 3600000).toISOString()
}

const RAW: { n: number; nombre: string; direccion: string | null }[] = [
  { n: 1, nombre: 'Martina Gómez', direccion: 'Av. Mate de Luna 2150' },
  { n: 2, nombre: 'Joaquín Pérez', direccion: 'San Martín 845' },
  { n: 3, nombre: 'Sofía Díaz', direccion: 'Laprida 1320' },
  { n: 4, nombre: 'Tomás Romero', direccion: null },
  { n: 5, nombre: 'Valentina Ruiz', direccion: 'Junín 560' },
  { n: 6, nombre: 'Lucas Fernández', direccion: 'Av. Aconquija 1450' },
  { n: 7, nombre: 'Camila Sosa', direccion: null },
  { n: 8, nombre: 'Mateo Álvarez', direccion: 'Crisóstomo Álvarez 980' },
  { n: 9, nombre: 'Julieta Torres', direccion: 'Santiago 1120' },
  { n: 10, nombre: 'Benjamín Castro', direccion: null },
  { n: 11, nombre: 'Agustina Herrera', direccion: 'Muñecas 450' },
  { n: 12, nombre: 'Facundo Medina', direccion: 'Av. Roca 2300' },
  { n: 13, nombre: 'Florencia Acosta', direccion: null },
  { n: 14, nombre: 'Nicolás Ríos', direccion: 'Lamadrid 740' },
  { n: 15, nombre: 'Milagros Vega', direccion: 'Marcos Paz 1650' },
  { n: 16, nombre: 'Santiago Molina', direccion: null },
  { n: 17, nombre: 'Abril Ortiz', direccion: 'Salta 890' },
  { n: 18, nombre: 'Franco Suárez', direccion: 'Av. Belgrano 3100' },
  { n: 19, nombre: 'Delfina Rojas', direccion: null },
  { n: 20, nombre: 'Ignacio Paz', direccion: 'Rivadavia 520' },
  { n: 21, nombre: 'Lucía Navarro', direccion: 'Córdoba 1880' },
  { n: 22, nombre: 'Thiago Giménez', direccion: null },
  { n: 23, nombre: 'Morena Luna', direccion: 'Jujuy 1015' },
  { n: 24, nombre: 'Bruno Cabrera', direccion: 'Av. Sarmiento 760' },
  { n: 25, nombre: 'Pilar Ibáñez', direccion: null },
]

// perfil demo: cerca del premio, con cupón, dormidos, frecuentes
const PERFIL: Record<number, Partial<ClienteFila>> = {
  1: { compras: 12, gastado: 168000, compras_en_ciclo: 4, cupones: 0, ultima: isoHace(0, 3) },
  2: { compras: 8, gastado: 98000, compras_en_ciclo: 0, cupones: 1, ultima: isoHace(1, 5) },
  3: { compras: 15, gastado: 210000, compras_en_ciclo: 2, cupones: 0, ultima: isoHace(0, 8) },
  4: { compras: 3, gastado: 36000, compras_en_ciclo: 3, cupones: 0, ultima: isoHace(4) },
  5: { compras: 9, gastado: 112000, compras_en_ciclo: 4, cupones: 0, ultima: isoHace(2) },
  7: { compras: 2, gastado: 24000, compras_en_ciclo: 2, cupones: 0, ultima: isoHace(22) },
  10: { compras: 6, gastado: 72000, compras_en_ciclo: 1, cupones: 0, ultima: isoHace(18) },
  12: { compras: 11, gastado: 145000, compras_en_ciclo: 0, cupones: 1, ultima: isoHace(1) },
  18: { compras: 7, gastado: 89000, compras_en_ciclo: 4, cupones: 0, ultima: isoHace(0, 1) },
}

export const MOCK_PROGRAMA_ACTIVO = true

export const MOCK_CLIENTES: ClienteFila[] = RAW.map(({ n, nombre, direccion }) => {
  const baseCompras = 1 + (n % 7)
  const perfil = PERFIL[n] ?? {}
  return {
    id: `cli-${String(n).padStart(2, '0')}`,
    telefono: `+54938150000${String(n).padStart(2, '0')}`,
    nombre,
    direccion_default: direccion,
    creado_en: isoHace(31 + n),
    compras: perfil.compras ?? baseCompras,
    gastado: perfil.gastado ?? baseCompras * 12000,
    ultima: perfil.ultima ?? isoHace(n % 12),
    compras_en_ciclo: perfil.compras_en_ciclo ?? n % 5,
    compras_necesarias: 5,
    cupones: perfil.cupones ?? 0,
  }
})

export function getCliente(id: string) {
  return MOCK_CLIENTES.find(c => c.id === id) ?? null
}

export type CuponMock = {
  id: string
  codigo: string
  origen: string
  tipo: string
  valor: number | null
  tamano: string | null
  estado: string
  creado_en: string
  vence_en: string | null
  usado_en: string | null
  nota: string | null
  producto_nombre: string | null
  producto_categoria: string | null
  pedido_origen: number | null
  pedido_uso: number | null
}

const CUPONES_POR_CLIENTE: Record<string, CuponMock[]> = {
  'cli-02': [{
    id: 'cup-cli-02', codigo: 'SAZON-7K2', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'disponible', creado_en: isoHace(3), vence_en: isoHace(-2), usado_en: null, nota: null,
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', pedido_origen: 1830, pedido_uso: null,
  }],
  'cli-12': [{
    id: 'cup-cli-12', codigo: 'SAZON-9M1', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'disponible', creado_en: isoHace(1), vence_en: isoHace(-5), usado_en: null, nota: null,
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', pedido_origen: 1837, pedido_uso: null,
  }],
  'cli-18': [{
    id: 'cup-cli-18', codigo: 'SAZON-2AB', origen: 'manual', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'usado', creado_en: isoHace(8), vence_en: isoHace(1), usado_en: isoHace(0, 2), nota: null,
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', pedido_origen: null, pedido_uso: 1841,
  }],
  'cli-07': [{
    id: 'cup-cli-07', codigo: 'SAZON-4XY', origen: 'automatico', tipo: 'producto', valor: null, tamano: 'simple',
    estado: 'vencido', creado_en: isoHace(40), vence_en: isoHace(5), usado_en: null, nota: null,
    producto_nombre: 'La Sazón', producto_categoria: 'hamburguesa', pedido_origen: 1790, pedido_uso: null,
  }],
}

const FAVORITOS: Record<string, { nombre: string; categoria: string; tamano: string; unidades: number }[]> = {
  'cli-01': [
    { nombre: 'Bacon Cheese', categoria: 'hamburguesa', tamano: 'simple', unidades: 5 },
    { nombre: 'La Sazón', categoria: 'hamburguesa', tamano: 'doble', unidades: 4 },
    { nombre: 'Muzza Simple', categoria: 'pizzita', tamano: 'simple', unidades: 3 },
  ],
  'cli-03': [
    { nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'doble', unidades: 7 },
    { nombre: 'Pepperoni', categoria: 'pizzita', tamano: 'simple', unidades: 4 },
  ],
  'cli-18': [
    { nombre: 'La Culposa', categoria: 'hamburguesa', tamano: 'triple', unidades: 3 },
  ],
}

export function getClientesDormidos(dias = 14) {
  const corte = Date.now() - dias * 86400000
  return MOCK_CLIENTES
    .filter(c => c.ultima && new Date(c.ultima).getTime() < corte)
    .sort((a, b) => new Date(a.ultima!).getTime() - new Date(b.ultima!).getTime())
}

export function getClienteDetalle(id: string) {
  const cliente = getCliente(id)
  if (!cliente) return null

  // lazy para no ciclar con ventas al cargar el módulo
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getVentas } = require('@/lib/mock/ventas') as typeof import('@/lib/mock/ventas')
  const ventasCli = getVentas()
    .filter(v => v.cliente_id === id)
    .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())

  const validas = ventasCli.filter(v => v.estado !== 'cancelado')
  const gastadoHist = validas.reduce((a, v) => a + v.total, 0)
  const ahorro = validas.reduce((a, v) => a + v.descuento, 0)

  return {
    cliente: {
      id: cliente.id,
      telefono: cliente.telefono,
      nombre: cliente.nombre,
      direccion_default: cliente.direccion_default,
      notas: id === 'cli-01' ? 'Pide sin cebolla a veces.' : null,
      creado_en: cliente.creado_en,
      compras_en_ciclo: cliente.compras_en_ciclo,
      compras_necesarias: cliente.compras_necesarias,
      programa_activo: MOCK_PROGRAMA_ACTIVO,
    },
    stats: {
      compras: Math.max(cliente.compras, validas.length),
      gastado: Math.max(cliente.gastado, gastadoHist),
      primera: cliente.creado_en,
      ultima: cliente.ultima,
      ahorro,
    },
    favoritos: FAVORITOS[id] ?? [
      { nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'doble', unidades: 2 },
      { nombre: 'Muzza Simple', categoria: 'pizzita', tamano: 'simple', unidades: 1 },
    ],
    cupones: CUPONES_POR_CLIENTE[id] ?? [],
    ventas: ventasCli.slice(0, 40).map(v => ({
      id: v.id,
      numero: v.numero,
      estado: v.estado,
      canal: v.canal,
      total: v.total,
      descuento: v.descuento,
      creado_en: v.creado_en,
      detalle: v.items.map(i => `${i.cantidad}× ${i.nombre}${i.regalo ? ' (regalo)' : ''}`).join(', '),
    })),
  }
}
