import { ZONA_AR } from '@/lib/formato'

export function getMockContadores() {
  // lazy: evita ciclo de imports al cargar
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getComprasKpis } = require('@/lib/mock/compras') as typeof import('@/lib/mock/compras')
  const compras = getComprasKpis()
  return {
    stockBajo: 3,
    comprasPorRecibir: compras.por_recibir,
    ventasEnCurso: 4,
  }
}

/** @deprecated usar getMockContadores() */
export const MOCK_CONTADORES = {
  stockBajo: 3,
  comprasPorRecibir: 2,
  ventasEnCurso: 4,
}

export type MockKpis = {
  ventas: number
  canceladas: number
  ingresos: number
  cmv: number
  descuentos: number
  clientes: number
  nuevos: number
}

export type MockSerie = { dia: string; ventas: number; ingresos: number }
export type MockProducto = {
  id: string
  nombre: string
  categoria: string
  simple: number
  doble: number
  triple: number
  total: number
  ingresos: number
  costo: number
}
export type MockCanal = { tipo: string; clave: string; ventas: number; ingresos: number }
export type MockVentaCurso = {
  id: string
  numero: number
  estado: string
  modalidad: string
  total: number
  creado_en: string
  nombre: string | null
}
export type MockStock = {
  id: string
  nombre: string
  unidad: string
  stock_actual: number
  stock_minimo: number
  dias: number | null
}
export type MockAlertas = {
  stock_bajo: number
  compras_atrasadas: number
  compras_atrasadas_detalle: string | null
  ventas_demoradas: number
  ventas_demoradas_desde: string | null
  cupones_por_vencer: number
  deuda: number
}

const FACTOR: Record<string, number> = {
  hoy: 1,
  '7d': 6.2,
  '30d': 24,
  mes: 18,
}

function haceMinutos(m: number) {
  return new Date(Date.now() - m * 60_000).toISOString()
}

function serieDias(n: number): MockSerie[] {
  const out: MockSerie[] = []
  const pattern = [18, 22, 15, 28, 31, 42, 38, 25, 19, 27, 33, 36, 44, 41]
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const clave = d.toLocaleDateString('en-CA', { timeZone: ZONA_AR })
    const base = pattern[i % pattern.length]
    out.push({
      dia: clave,
      ventas: base,
      ingresos: base * 11800 + (i % 3) * 2400,
    })
  }
  return out
}

export function getMockDashboard(periodo: string) {
  const f = FACTOR[periodo] ?? 1
  const kpis: MockKpis = {
    ventas: Math.round(42 * (periodo === 'hoy' ? 1 : f / 6)),
    canceladas: periodo === 'hoy' ? 1 : Math.round(2 * f / 6),
    ingresos: Math.round(498500 * (periodo === 'hoy' ? 1 : f / 6)),
    cmv: Math.round(168200 * (periodo === 'hoy' ? 1 : f / 6)),
    descuentos: Math.round(8500 * (periodo === 'hoy' ? 1 : f / 6)),
    clientes: Math.round(28 * (periodo === 'hoy' ? 1 : f / 5)),
    nuevos: periodo === 'hoy' ? 3 : Math.round(1.4 * f),
  }

  const productos: MockProducto[] = [
    { id: 'prod-clasica', nombre: 'Clásica', categoria: 'hamburguesa', simple: Math.round(8 * f / 4), doble: Math.round(14 * f / 4), triple: Math.round(6 * f / 4), total: 0, ingresos: Math.round(186000 * f / 6), costo: Math.round(62000 * f / 6) },
    { id: 'prod-bacon-cheese', nombre: 'Bacon Cheese', categoria: 'hamburguesa', simple: Math.round(5 * f / 4), doble: Math.round(11 * f / 4), triple: Math.round(4 * f / 4), total: 0, ingresos: Math.round(164000 * f / 6), costo: Math.round(58000 * f / 6) },
    { id: 'prod-la-sazon', nombre: 'La Sazón', categoria: 'hamburguesa', simple: Math.round(7 * f / 4), doble: Math.round(10 * f / 4), triple: Math.round(5 * f / 4), total: 0, ingresos: Math.round(152000 * f / 6), costo: Math.round(54000 * f / 6) },
    { id: 'prod-la-culposa', nombre: 'La Culposa', categoria: 'hamburguesa', simple: Math.round(4 * f / 4), doble: Math.round(8 * f / 4), triple: Math.round(3 * f / 4), total: 0, ingresos: Math.round(128000 * f / 6), costo: Math.round(48000 * f / 6) },
    { id: 'prod-muzza', nombre: 'Muzza Simple', categoria: 'pizzita', simple: Math.round(9 * f / 4), doble: Math.round(7 * f / 4), triple: 0, total: 0, ingresos: Math.round(98000 * f / 6), costo: Math.round(32000 * f / 6) },
    { id: 'prod-pepperoni', nombre: 'Pepperoni', categoria: 'pizzita', simple: Math.round(6 * f / 4), doble: Math.round(5 * f / 4), triple: 0, total: 0, ingresos: Math.round(82000 * f / 6), costo: Math.round(28000 * f / 6) },
    { id: 'prod-napolitana', nombre: 'Napolitana', categoria: 'pizzita', simple: Math.round(5 * f / 4), doble: Math.round(4 * f / 4), triple: 0, total: 0, ingresos: Math.round(70000 * f / 6), costo: Math.round(24000 * f / 6) },
  ].map(p => ({ ...p, total: p.simple + p.doble + p.triple }))

  const canales: MockCanal[] = [
    { tipo: 'canal', clave: 'whatsapp', ventas: Math.round(22 * f / 6), ingresos: Math.round(268000 * f / 6) },
    { tipo: 'canal', clave: 'mostrador', ventas: Math.round(14 * f / 6), ingresos: Math.round(156000 * f / 6) },
    { tipo: 'canal', clave: 'app', ventas: Math.round(6 * f / 6), ingresos: Math.round(74500 * f / 6) },
    { tipo: 'pago', clave: 'mercado_pago', ventas: Math.round(18 * f / 6), ingresos: Math.round(214000 * f / 6) },
    { tipo: 'pago', clave: 'efectivo', ventas: Math.round(12 * f / 6), ingresos: Math.round(142000 * f / 6) },
    { tipo: 'pago', clave: 'transferencia', ventas: Math.round(8 * f / 6), ingresos: Math.round(98000 * f / 6) },
    { tipo: 'pago', clave: 'debito', ventas: Math.round(4 * f / 6), ingresos: Math.round(44500 * f / 6) },
  ]

  const enCurso: MockVentaCurso[] = [
    { id: 'v1', numero: 1842, estado: 'en_preparacion', modalidad: 'delivery', total: 18500, creado_en: haceMinutos(28), nombre: 'María López' },
    { id: 'v2', numero: 1843, estado: 'confirmado', modalidad: 'take_away', total: 12400, creado_en: haceMinutos(12), nombre: 'Juan Pérez' },
    { id: 'v3', numero: 1844, estado: 'pendiente', modalidad: 'delivery', total: 22100, creado_en: haceMinutos(8), nombre: 'Sofía Gómez' },
    { id: 'v4', numero: 1845, estado: 'en_camino', modalidad: 'delivery', total: 9800, creado_en: haceMinutos(35), nombre: 'Carlos Ruiz' },
  ]

  const stockCritico: MockStock[] = [
    { id: 'ins-bollo', nombre: 'Bollo de carne', unidad: 'bollo', stock_actual: 44, stock_minimo: 80, dias: 0.8 },
    { id: 'ins-panceta', nombre: 'Panceta ahumada', unidad: 'feta', stock_actual: 84, stock_minimo: 120, dias: 1.2 },
    { id: 'ins-crispy', nombre: 'Cebollita crispy', unidad: 'g', stock_actual: 140, stock_minimo: 400, dias: 1.5 },
  ]

  const alertas: MockAlertas = {
    stock_bajo: 3,
    compras_atrasadas: 1,
    compras_atrasadas_detalle: 'Distribuidora Norte',
    ventas_demoradas: 1,
    ventas_demoradas_desde: haceMinutos(48),
    cupones_por_vencer: 2,
    deuda: 86400,
  }

  return {
    kpis,
    serie: serieDias(14),
    productos,
    canales,
    enCurso,
    stockCritico,
    alertas,
  }
}
