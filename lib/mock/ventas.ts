import type { VentaFila } from '@/components/ListaVentas'
import type { Periodo } from '@/lib/periodo'
import { rangoPeriodo } from '@/lib/periodo'

function isoHace(minutos: number) {
  return new Date(Date.now() - minutos * 60000).toISOString()
}

const SEED: VentaFila[] = [
  {
    id: 'ven-1845', numero: 1845, estado: 'en_camino', canal: 'whatsapp', modalidad: 'delivery', medio_pago: 'mercado_pago',
    subtotal: 9800, descuento: 0, total: 9800, notas: null, direccion_entrega: 'San Martín 845', creado_en: isoHace(35),
    cliente_id: 'cli-02', cliente_nombre: 'Joaquín Pérez', cliente_telefono: '+5493815000002', cupon_codigo: null, costo: 2800,
    items: [{ nombre: 'Muzza Simple', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 11000, regalo: false }],
  },
  {
    id: 'ven-1844', numero: 1844, estado: 'pendiente', canal: 'whatsapp', modalidad: 'delivery', medio_pago: 'transferencia',
    subtotal: 22100, descuento: 0, total: 22100, notas: 'Sin cebolla', direccion_entrega: 'Laprida 1320', creado_en: isoHace(8),
    cliente_id: 'cli-03', cliente_nombre: 'Sofía Díaz', cliente_telefono: '+5493815000003', cupon_codigo: null, costo: 6400,
    items: [
      { nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false },
      { nombre: 'Pepperoni', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 13000, regalo: false },
    ],
  },
  {
    id: 'ven-1843', numero: 1843, estado: 'confirmado', canal: 'mostrador', modalidad: 'take_away', medio_pago: 'efectivo',
    subtotal: 12400, descuento: 0, total: 12400, notas: null, direccion_entrega: null, creado_en: isoHace(12),
    cliente_id: 'cli-01', cliente_nombre: 'Martina Gómez', cliente_telefono: '+5493815000001', cupon_codigo: null, costo: 3600,
    items: [{ nombre: 'Bacon Cheese', categoria: 'hamburguesa', tamano: 'simple', cantidad: 1, precio: 12000, regalo: false }],
  },
  {
    id: 'ven-1842', numero: 1842, estado: 'en_preparacion', canal: 'app', modalidad: 'delivery', medio_pago: 'mercado_pago',
    subtotal: 18500, descuento: 0, total: 18500, notas: null, direccion_entrega: 'Av. Mate de Luna 2150', creado_en: isoHace(28),
    cliente_id: 'cli-01', cliente_nombre: 'Martina Gómez', cliente_telefono: '+5493815000001', cupon_codigo: null, costo: 5200,
    items: [
      { nombre: 'La Sazón', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false },
      { nombre: 'Muzza Simple', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 11000, regalo: false },
    ],
  },
  {
    id: 'ven-1841', numero: 1841, estado: 'entregado', canal: 'whatsapp', modalidad: 'delivery', medio_pago: 'debito',
    subtotal: 29000, descuento: 12000, total: 17000, notas: null, direccion_entrega: 'Av. Belgrano 3100', creado_en: isoHace(90),
    cliente_id: 'cli-18', cliente_nombre: 'Franco Suárez', cliente_telefono: '+5493815000018', cupon_codigo: 'SAZON-7K2', costo: 6800,
    items: [
      { nombre: 'La Culposa', categoria: 'hamburguesa', tamano: 'triple', cantidad: 1, precio: 16000, regalo: false },
      { nombre: 'La Sazón', categoria: 'hamburguesa', tamano: 'simple', cantidad: 1, precio: 12000, regalo: true },
    ],
  },
  {
    id: 'ven-1840', numero: 1840, estado: 'entregado', canal: 'mostrador', modalidad: 'salon', medio_pago: 'efectivo',
    subtotal: 26500, descuento: 0, total: 26500, notas: null, direccion_entrega: null, creado_en: isoHace(140),
    cliente_id: null, cliente_nombre: null, cliente_telefono: null, cupon_codigo: null, costo: 7400,
    items: [
      { nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false },
      { nombre: 'Napolitana', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 13000, regalo: false },
    ],
  },
  {
    id: 'ven-1847', numero: 1847, estado: 'en_preparacion', canal: 'mostrador', modalidad: 'salon', medio_pago: 'efectivo',
    subtotal: 19000, descuento: 0, total: 19000, notas: 'Pedido desde carta · mesa 3', direccion_entrega: null, creado_en: isoHace(18),
    cliente_id: null, cliente_nombre: 'Mesa 3', cliente_telefono: null, cupon_codigo: null, mesa: 3, costo: 5200,
    items: [
      { nombre: 'La Sazón', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false },
      { nombre: 'Coca-Cola 500 ml', categoria: 'bebida', tamano: 'simple', cantidad: 1, precio: 2500, regalo: false },
      { nombre: 'Papas fritas', categoria: 'acompanamiento', tamano: 'simple', cantidad: 1, precio: 4500, regalo: false },
    ],
  },
  {
    id: 'ven-1848', numero: 1848, estado: 'pendiente', canal: 'mostrador', modalidad: 'salon', medio_pago: 'efectivo',
    subtotal: 16500, descuento: 0, total: 16500, notas: 'Pedido desde carta · mesa 3 · promo', direccion_entrega: null, creado_en: isoHace(6),
    cliente_id: null, cliente_nombre: 'Mesa 3', cliente_telefono: null, cupon_codigo: null, mesa: 3, costo: 5500,
    items: [
      { nombre: 'Dúo La Sazón (La Sazón simple · Papas fritas chicas · Gaseosa 500 ml)', categoria: 'promo', tamano: 'simple', cantidad: 1, precio: 16500, regalo: false },
    ],
  },
  {
    id: 'ven-1849', numero: 1849, estado: 'confirmado', canal: 'mostrador', modalidad: 'salon', medio_pago: 'transferencia',
    subtotal: 14000, descuento: 0, total: 14000, notas: 'Pedido desde carta · mesa 7', direccion_entrega: null, creado_en: isoHace(25),
    cliente_id: null, cliente_nombre: 'Mesa 7', cliente_telefono: null, cupon_codigo: null, mesa: 7, costo: 4600,
    items: [
      { nombre: 'Pizzita + birra (Muzza Simple 4 porc. · Cerveza artesanal)', categoria: 'promo', tamano: 'simple', cantidad: 1, precio: 14000, regalo: false },
    ],
  },
  {
    id: 'ven-1850', numero: 1850, estado: 'entregado', canal: 'mostrador', modalidad: 'salon', medio_pago: 'efectivo',
    subtotal: 4500, descuento: 0, total: 4500, notas: 'Pedido desde carta · mesa 7', direccion_entrega: null, creado_en: isoHace(55),
    cliente_id: null, cliente_nombre: 'Mesa 7', cliente_telefono: null, cupon_codigo: null, mesa: 7, costo: 1800,
    items: [
      { nombre: 'Cerveza artesanal 473 ml', categoria: 'bebida', tamano: 'simple', cantidad: 1, precio: 4500, regalo: false },
    ],
  },
  {
    id: 'ven-1839', numero: 1839, estado: 'entregado', canal: 'telefono', modalidad: 'take_away', medio_pago: 'transferencia',
    subtotal: 14500, descuento: 0, total: 14500, notas: null, direccion_entrega: null, creado_en: isoHace(200),
    cliente_id: 'cli-05', cliente_nombre: 'Valentina Ruiz', cliente_telefono: '+5493815000005', cupon_codigo: null, costo: 4100,
    items: [{ nombre: 'Crispy Melt', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false }],
  },
  {
    id: 'ven-1838', numero: 1838, estado: 'cancelado', canal: 'whatsapp', modalidad: 'delivery', medio_pago: 'mercado_pago',
    subtotal: 12000, descuento: 0, total: 12000, notas: 'Cliente canceló', direccion_entrega: 'Junín 560', creado_en: isoHace(260),
    cliente_id: 'cli-05', cliente_nombre: 'Valentina Ruiz', cliente_telefono: '+5493815000005', cupon_codigo: null, costo: 0,
    items: [{ nombre: 'Full Cheese', categoria: 'hamburguesa', tamano: 'simple', cantidad: 1, precio: 12000, regalo: false }],
  },
  {
    id: 'ven-1837', numero: 1837, estado: 'entregado', canal: 'app', modalidad: 'delivery', medio_pago: 'mercado_pago',
    subtotal: 27000, descuento: 0, total: 27000, notas: null, direccion_entrega: 'Av. Roca 2300', creado_en: isoHace(320),
    cliente_id: 'cli-12', cliente_nombre: 'Facundo Medina', cliente_telefono: '+5493815000012', cupon_codigo: null, costo: 7800,
    items: [
      { nombre: 'Bacon Cheese', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false },
      { nombre: 'Jamón y Morrones', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 14000, regalo: false },
    ],
  },
  {
    id: 'ven-1836', numero: 1836, estado: 'entregado', canal: 'mostrador', modalidad: 'take_away', medio_pago: 'efectivo',
    subtotal: 24000, descuento: 0, total: 24000, notas: null, direccion_entrega: null, creado_en: isoHace(400),
    cliente_id: 'cli-08', cliente_nombre: 'Mateo Álvarez', cliente_telefono: '+5493815000008', cupon_codigo: null, costo: 7000,
    items: [{ nombre: 'Americana', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false }, { nombre: 'Margarita', categoria: 'pizzita', tamano: 'simple', cantidad: 1, precio: 13000, regalo: false }],
  },
  // más viejas para período 7d / 30d
  {
    id: 'ven-1820', numero: 1820, estado: 'entregado', canal: 'whatsapp', modalidad: 'delivery', medio_pago: 'mercado_pago',
    subtotal: 14500, descuento: 0, total: 14500, notas: null, direccion_entrega: 'Salta 890', creado_en: isoHace(60 * 24 * 3),
    cliente_id: 'cli-17', cliente_nombre: 'Abril Ortiz', cliente_telefono: '+5493815000017', cupon_codigo: null, costo: 4200,
    items: [{ nombre: 'Oklahomaxxx', categoria: 'hamburguesa', tamano: 'doble', cantidad: 1, precio: 14500, regalo: false }],
  },
  {
    id: 'ven-1801', numero: 1801, estado: 'entregado', canal: 'mostrador', modalidad: 'salon', medio_pago: 'efectivo',
    subtotal: 12000, descuento: 0, total: 12000, notas: null, direccion_entrega: null, creado_en: isoHace(60 * 24 * 12),
    cliente_id: 'cli-10', cliente_nombre: 'Benjamín Castro', cliente_telefono: '+5493815000010', cupon_codigo: null, costo: 3400,
    items: [{ nombre: 'La Sazón', categoria: 'hamburguesa', tamano: 'simple', cantidad: 1, precio: 12000, regalo: false }],
  },
]

type Store = { ventas: VentaFila[]; seq: number }

function store(): Store {
  const g = globalThis as typeof globalThis & { __sazonVentas?: Store }
  if (!g.__sazonVentas) g.__sazonVentas = { ventas: SEED.map(v => ({ ...v, items: v.items.map(i => ({ ...i })) })), seq: 1851 }
  return g.__sazonVentas
}

export const MOCK_VENTAS = SEED

export function getVentas() {
  return store().ventas
}

export function siguienteEstado(estado: string, modalidad: string): string | null {
  if (estado === 'pendiente') return 'confirmado'
  if (estado === 'confirmado') return 'en_preparacion'
  if (estado === 'en_preparacion') return modalidad === 'delivery' ? 'en_camino' : 'entregado'
  if (estado === 'en_camino') return 'entregado'
  return null
}

export function labelAvanzar(estado: string, modalidad: string): string | null {
  const n = siguienteEstado(estado, modalidad)
  if (!n) return null
  if (n === 'confirmado') return 'Confirmar pago'
  if (n === 'en_preparacion') return 'A cocina'
  if (n === 'en_camino') return 'Sale a delivery'
  if (n === 'entregado') return 'Entregar'
  return null
}

export function cambiarEstadoMock(id: string, nuevo: string): boolean {
  const v = store().ventas.find(x => x.id === id)
  if (!v) return false
  v.estado = nuevo
  return true
}

export function agregarVentaMock(v: Omit<VentaFila, 'id' | 'numero'> & { numero?: number }): VentaFila {
  const s = store()
  const numero = v.numero ?? s.seq++
  const fila: VentaFila = { ...v, id: `ven-${numero}`, numero }
  s.ventas.unshift(fila)
  return fila
}

export function resumenVentas(ventas: VentaFila[]) {
  const validas = ventas.filter(v => v.estado !== 'cancelado')
  return {
    cantidad: ventas.length,
    validas: validas.length,
    ingresos: validas.reduce((a, v) => a + v.total, 0),
    descuentos: validas.reduce((a, v) => a + v.descuento, 0),
  }
}

export function filtrarVentas(opts: { estado?: string; q?: string; periodo?: Periodo; soloCurso?: boolean }) {
  const estado = opts.estado ?? ''
  const texto = (opts.q ?? '').trim().toLowerCase()
  const { inicio } = opts.periodo ? rangoPeriodo(opts.periodo) : { inicio: new Date(0) }
  const curso = new Set(['pendiente', 'confirmado', 'en_preparacion', 'en_camino'])

  return getVentas().filter(v => {
    if (opts.soloCurso && !curso.has(v.estado)) return false
    if (opts.periodo && new Date(v.creado_en).getTime() < inicio.getTime()) return false
    if (estado && v.estado !== estado) return false
    if (!texto) return true
    return (
      (v.cliente_nombre ?? '').toLowerCase().includes(texto) ||
      (v.cliente_telefono ?? '').includes(texto) ||
      String(v.numero) === texto ||
      v.items.some(i => i.nombre.toLowerCase().includes(texto))
    )
  })
}

export const COLUMNAS_COLA = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'confirmado', label: 'Confirmado' },
  { id: 'en_preparacion', label: 'En cocina' },
  { id: 'en_camino', label: 'Delivery' },
] as const

const ESTADOS_MESA_ABIERTA = new Set(['pendiente', 'confirmado', 'en_preparacion', 'entregado'])

/** Pedidos de una mesa (hoy), del más viejo al más nuevo. */
export function ventasDeMesa(mesa: number, soloAbiertas = false) {
  return getVentas()
    .filter(v => {
      if (v.mesa !== mesa) return false
      if (v.estado === 'cancelado') return false
      if (soloAbiertas && !ESTADOS_MESA_ABIERTA.has(v.estado)) return false
      return true
    })
    .sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime())
}

export type ResumenMesa = {
  mesa: number
  pedidos: ReturnType<typeof getVentas>
  total: number
  abiertos: number
  ultimo: string
}

/** Mesas con pedidos en curso / de la noche (no cancelados). */
export function resumenMesas(): ResumenMesa[] {
  const map = new Map<number, ReturnType<typeof getVentas>>()
  for (const v of getVentas()) {
    if (v.mesa == null || v.estado === 'cancelado') continue
    const list = map.get(v.mesa) ?? []
    list.push(v)
    map.set(v.mesa, list)
  }
  return [...map.entries()]
    .map(([mesa, pedidos]) => {
      const ordenados = [...pedidos].sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime())
      const abiertos = ordenados.filter(p => p.estado !== 'entregado').length
      return {
        mesa,
        pedidos: ordenados,
        total: ordenados.reduce((a, p) => a + p.total, 0),
        abiertos,
        ultimo: ordenados[ordenados.length - 1]?.creado_en ?? '',
      }
    })
    .sort((a, b) => a.mesa - b.mesa)
}
