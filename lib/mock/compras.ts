import type { CompraFila, DatosFormCompra, ItemCompra } from '@/components/Compras'
import { MOCK_PROVEEDORES } from '@/lib/mock/proveedores'
import { MOCK_INSUMOS } from '@/lib/mock/stock'

function isoHace(horas: number) {
  return new Date(Date.now() - horas * 3600000).toISOString()
}

const SEED_COMPRAS: CompraFila[] = [
  {
    id: 'com-91', numero: 91, estado: 'pedida', pedida_en: isoHace(30), recibida_en: null, total: 54000, pagada: false,
    medio_pago: null, comprobante: null, notas: null, proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano',
    proveedor_telefono: '+5493814000105', proveedor_contacto: 'Mostrador', demora_prometida_horas: 24, horas: 30,
    items: [
      { id: 'ci-1', insumo_id: 'ins-crispy', nombre: 'Cebollita crispy', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, cantidad_pedida: 2, cantidad_recibida: null, precio: 9000 },
      { id: 'ci-2', insumo_id: 'ins-caja-hamb', nombre: 'Caja hamburguesa', unidad: 'unidad', unidad_compra: 'paquete x100', equivalencia: 100, cantidad_pedida: 2, cantidad_recibida: null, precio: 16000 },
    ],
  },
  {
    id: 'com-90', numero: 90, estado: 'pedida', pedida_en: isoHace(8), recibida_en: null, total: 36000, pagada: false,
    medio_pago: null, comprobante: null, notas: 'Pan del día', proveedor_id: 'prov-el-molino', proveedor: 'Panificadora El Molino',
    proveedor_telefono: '+5493814000103', proveedor_contacto: 'Diego', demora_prometida_horas: 12, horas: 8,
    items: [
      { id: 'ci-3', insumo_id: 'ins-pan', nombre: 'Pan de papa', unidad: 'pan', unidad_compra: 'docena', equivalencia: 12, cantidad_pedida: 6, cantidad_recibida: null, precio: 6000 },
    ],
  },
  {
    id: 'com-89', numero: 89, estado: 'recibida', pedida_en: isoHace(50), recibida_en: isoHace(28), total: 95000, pagada: false,
    medio_pago: null, comprobante: null, notas: null, proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte',
    proveedor_telefono: '+5493814000104', proveedor_contacto: 'Marcela', demora_prometida_horas: 48, horas: 22,
    items: [
      { id: 'ci-4', insumo_id: 'ins-cheddar', nombre: 'Cheddar en fetas', unidad: 'feta', unidad_compra: 'kg', equivalencia: 50, cantidad_pedida: 3, cantidad_recibida: 3, precio: 14000 },
      { id: 'ci-5', insumo_id: 'ins-muzza', nombre: 'Muzzarella', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, cantidad_pedida: 5, cantidad_recibida: 5, precio: 8800 },
    ],
  },
  {
    id: 'com-88', numero: 88, estado: 'recibida', pedida_en: isoHace(72), recibida_en: isoHace(54), total: 114000, pagada: true,
    medio_pago: 'transferencia', comprobante: 'TRX-4412', notas: null, proveedor_id: 'prov-don-ramon', proveedor: 'Frigorífico Don Ramón',
    proveedor_telefono: '+5493814000101', proveedor_contacto: 'Ramón', demora_prometida_horas: 24, horas: 18,
    items: [
      { id: 'ci-6', insumo_id: 'ins-bollo', nombre: 'Bollo de carne', unidad: 'bollo', unidad_compra: 'kg', equivalencia: 10, cantidad_pedida: 12, cantidad_recibida: 12, precio: 9500 },
    ],
  },
  {
    id: 'com-87', numero: 87, estado: 'recibida', pedida_en: isoHace(96), recibida_en: isoHace(90), total: 15400, pagada: true,
    medio_pago: 'efectivo', comprobante: null, notas: null, proveedor_id: 'prov-la-huerta', proveedor: 'Verdulería La Huerta',
    proveedor_telefono: '+5493814000106', proveedor_contacto: 'Chino', demora_prometida_horas: 6, horas: 4,
    items: [
      { id: 'ci-7', insumo_id: 'ins-tomate', nombre: 'Tomate', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, cantidad_pedida: 5, cantidad_recibida: 5, precio: 2200 },
      { id: 'ci-8', insumo_id: 'ins-lechuga', nombre: 'Lechuga', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, cantidad_pedida: 1, cantidad_recibida: 1, precio: 2800 },
    ],
  },
  {
    id: 'com-86', numero: 86, estado: 'recibida', pedida_en: isoHace(120), recibida_en: isoHace(70), total: 92000, pagada: false,
    medio_pago: null, comprobante: null, notas: 'Llegó incompleto', proveedor_id: 'prov-carnes-valle', proveedor: 'Carnes del Valle',
    proveedor_telefono: '+5493814000102', proveedor_contacto: 'Silvia', demora_prometida_horas: 24, horas: 50,
    items: [
      { id: 'ci-9', insumo_id: 'ins-bollo', nombre: 'Bollo de carne', unidad: 'bollo', unidad_compra: 'kg', equivalencia: 10, cantidad_pedida: 10, cantidad_recibida: 8, precio: 9200 },
    ],
  },
]

type Store = { compras: CompraFila[]; nextNumero: number }

const globalStore = globalThis as unknown as { __sazonComprasStore?: Store }

function store(): Store {
  if (!globalStore.__sazonComprasStore) {
    globalStore.__sazonComprasStore = {
      compras: structuredClone(SEED_COMPRAS),
      nextNumero: 100,
    }
  }
  return globalStore.__sazonComprasStore
}

/** Lista viva del mock (se actualiza al crear/recibir/pagar/anular). */
export function getCompras(): CompraFila[] {
  const ahora = Date.now()
  return store().compras.map(c => ({
    ...c,
    horas: (ahora - new Date(c.pedida_en).getTime()) / 3600000,
  }))
}

/** @deprecated usar getCompras() */
export const MOCK_COMPRAS = SEED_COMPRAS

export function getDatosFormCompra(): DatosFormCompra {
  return {
    proveedores: MOCK_PROVEEDORES.filter(p => p.activo).map(p => ({
      id: p.id,
      nombre: p.nombre,
      telefono: p.telefono,
      contacto: p.contacto,
      dias_entrega: p.dias_entrega,
      demora_prometida_horas: p.demora_prometida_horas,
      pedido_minimo: p.pedido_minimo,
      condicion_pago: p.condicion_pago,
    })),
    insumos: MOCK_INSUMOS.filter(i => i.activo).map(i => ({
      id: i.id,
      nombre: i.nombre,
      categoria: i.categoria,
      unidad: i.unidad,
      unidad_compra: i.unidad_compra,
      equivalencia: i.equivalencia,
      stock_actual: i.stock_actual,
      stock_minimo: i.stock_minimo,
      costo_unitario: i.costo_unitario,
      en_camino: i.en_camino,
      consumo_diario: i.consumo_diario,
    })),
    precios: [
      { proveedor_id: 'prov-don-ramon', insumo_id: 'ins-bollo', precio: 9500, fecha: isoHace(240).slice(0, 10) },
      { proveedor_id: 'prov-el-molino', insumo_id: 'ins-pan', precio: 6000, fecha: isoHace(120).slice(0, 10) },
      { proveedor_id: 'prov-lacteos-norte', insumo_id: 'ins-cheddar', precio: 14000, fecha: isoHace(200).slice(0, 10) },
      { proveedor_id: 'prov-san-cayetano', insumo_id: 'ins-crispy', precio: 9000, fecha: isoHace(300).slice(0, 10) },
    ],
  }
}

export function filtrarCompras(filtro: string) {
  const todas = getCompras()
  if (filtro === 'por_recibir') return todas.filter(c => c.estado === 'pedida')
  if (filtro === 'sin_pagar') return todas.filter(c => c.estado === 'recibida' && !c.pagada)
  // Últimas: pedidas primero, después por fecha
  return [...todas].sort((a, b) => {
    if (a.estado === 'pedida' && b.estado !== 'pedida') return -1
    if (b.estado === 'pedida' && a.estado !== 'pedida') return 1
    return new Date(b.pedida_en).getTime() - new Date(a.pedida_en).getTime()
  })
}

export function getComprasKpis() {
  const todas = getCompras()
  const pedidas = todas.filter(c => c.estado === 'pedida')
  const sinPagar = todas.filter(c => c.estado === 'recibida' && !c.pagada)
  const atrasadas = pedidas.filter(c => c.demora_prometida_horas != null && c.horas > c.demora_prometida_horas)
  const mes = new Date()
  mes.setDate(1)
  mes.setHours(0, 0, 0, 0)
  const gastado = todas
    .filter(c => c.estado === 'recibida' && c.recibida_en && new Date(c.recibida_en) >= mes)
    .reduce((a, c) => a + c.total, 0)
  return {
    gastado_mes: gastado,
    por_recibir: pedidas.length,
    por_recibir_monto: pedidas.reduce((a, c) => a + c.total, 0),
    atrasadas: atrasadas.length,
    deuda: sinPagar.reduce((a, c) => a + c.total, 0),
    proveedores_deuda: new Set(sinPagar.map(c => c.proveedor_id)).size,
  }
}

/** @deprecated usar getComprasKpis() */
export const MOCK_COMPRAS_KPIS = getComprasKpis()

export type DatosNuevaCompra = {
  proveedor_id: string
  items: { insumo_id: string; cantidad: number; precio: number }[]
  recibida: boolean
  pagada: boolean
  medio_pago: string | null
  comprobante: string | null
  notas: string | null
}

export function agregarCompraMock(d: DatosNuevaCompra): { id: string; numero: number } {
  const prov = MOCK_PROVEEDORES.find(p => p.id === d.proveedor_id)
  if (!prov) throw new Error('Proveedor no encontrado')

  const s = store()
  const numero = s.nextNumero++
  const ahora = new Date().toISOString()
  const items: ItemCompra[] = d.items.map((it, idx) => {
    const ins = MOCK_INSUMOS.find(i => i.id === it.insumo_id)
    return {
      id: `ci-new-${numero}-${idx}`,
      insumo_id: it.insumo_id,
      nombre: ins?.nombre ?? 'Insumo',
      unidad: ins?.unidad ?? 'u',
      unidad_compra: ins?.unidad_compra ?? 'u',
      equivalencia: ins?.equivalencia ?? 1,
      cantidad_pedida: it.cantidad,
      cantidad_recibida: d.recibida ? it.cantidad : null,
      precio: it.precio,
    }
  })
  const total = items.reduce((a, i) => a + i.cantidad_pedida * i.precio, 0)
  const compra: CompraFila = {
    id: `com-${numero}`,
    numero,
    estado: d.recibida ? 'recibida' : 'pedida',
    pedida_en: ahora,
    recibida_en: d.recibida ? ahora : null,
    total,
    pagada: d.recibida ? d.pagada : false,
    medio_pago: d.recibida && d.pagada ? d.medio_pago : null,
    comprobante: d.comprobante,
    notas: d.notas,
    proveedor_id: prov.id,
    proveedor: prov.nombre,
    proveedor_telefono: prov.telefono,
    proveedor_contacto: prov.contacto,
    demora_prometida_horas: prov.demora_prometida_horas,
    horas: 0,
    items,
  }
  s.compras.unshift(compra)
  return { id: compra.id, numero }
}

export function actualizarPreciosMock(
  id: string,
  items: { id: string; precio: number }[],
): boolean {
  const c = store().compras.find(x => x.id === id)
  if (!c || c.estado !== 'pedida') return false
  for (const it of items) {
    const fila = c.items.find(i => i.id === it.id)
    if (!fila) continue
    fila.precio = it.precio
  }
  c.total = c.items.reduce((a, i) => a + i.cantidad_pedida * i.precio, 0)
  return true
}

export function recibirCompraMock(
  id: string,
  items: { id: string; cantidad_recibida: number; precio: number }[],
  opts?: { pagada?: boolean; medio_pago?: string | null },
): boolean {
  const c = store().compras.find(x => x.id === id)
  if (!c || c.estado !== 'pedida') return false
  const ahora = new Date().toISOString()
  c.estado = 'recibida'
  c.recibida_en = ahora
  c.horas = (Date.now() - new Date(c.pedida_en).getTime()) / 3600000
  for (const it of items) {
    const fila = c.items.find(i => i.id === it.id)
    if (!fila) continue
    fila.cantidad_recibida = it.cantidad_recibida
    fila.precio = it.precio
  }
  c.total = c.items.reduce((a, i) => a + (i.cantidad_recibida ?? i.cantidad_pedida) * i.precio, 0)
  c.pagada = !!opts?.pagada
  c.medio_pago = c.pagada ? (opts?.medio_pago ?? null) : null
  return true
}

export function marcarPagadaMock(id: string, pagada: boolean, medioPago: string | null): boolean {
  const c = store().compras.find(x => x.id === id)
  if (!c || c.estado !== 'recibida') return false
  c.pagada = pagada
  if (pagada && medioPago) c.medio_pago = medioPago
  return true
}

export function anularCompraMock(id: string): boolean {
  const c = store().compras.find(x => x.id === id)
  if (!c || c.estado === 'cancelada') return false
  c.estado = 'cancelada'
  return true
}

export function getComprasProveedor(proveedorId: string) {
  return getCompras().filter(c => c.proveedor_id === proveedorId)
}
