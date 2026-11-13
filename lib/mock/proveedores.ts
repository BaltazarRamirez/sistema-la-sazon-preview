import type { ProveedorScore } from '@/lib/proveedores'

function isoHace(dias: number) {
  return new Date(Date.now() - dias * 86400000).toISOString()
}

export const MOCK_PROVEEDORES: ProveedorScore[] = [
  {
    id: 'prov-don-ramon', nombre: 'Frigorífico Don Ramón', rubro: 'Carnes', contacto: 'Ramón', telefono: '+5493814000101',
    email: null, direccion: null, cuit: null, dias_entrega: 'Lun a Sáb', demora_prometida_horas: 24, pedido_minimo: 50000,
    condicion_pago: 'Contado', notas: 'Entrega a primera hora. Bollos de 100 g ya armados.', activo: true,
    compras_recibidas: 12, demora_prom_h: 18, a_tiempo_pct: 92, cumplimiento_pct: 100, ultima_compra: isoHace(2),
    gastado_30d: 286000, deuda: 0, pendientes: 0, atrasadas: 0, insumos_en_lista: 2, comparables: 2, mas_barato_en: 1, sobreprecio_pct: 2.1,
  },
  {
    id: 'prov-carnes-valle', nombre: 'Carnes del Valle', rubro: 'Carnes', contacto: 'Silvia', telefono: '+5493814000102',
    email: null, direccion: null, cuit: null, dias_entrega: 'Mar, Jue y Sáb', demora_prometida_horas: 24, pedido_minimo: 80000,
    condicion_pago: '7 días', notas: 'Más barato pero suele atrasarse.', activo: true,
    compras_recibidas: 8, demora_prom_h: 46, a_tiempo_pct: 38, cumplimiento_pct: 86, ultima_compra: isoHace(6),
    gastado_30d: 164000, deuda: 42000, pendientes: 0, atrasadas: 0, insumos_en_lista: 1, comparables: 1, mas_barato_en: 1, sobreprecio_pct: 0,
  },
  {
    id: 'prov-el-molino', nombre: 'Panificadora El Molino', rubro: 'Panificados', contacto: 'Diego', telefono: '+5493814000103',
    email: null, direccion: null, cuit: null, dias_entrega: 'Todos los días', demora_prometida_horas: 12, pedido_minimo: 20000,
    condicion_pago: 'Contado', notas: 'Pan de papa y bollos de masa.', activo: true,
    compras_recibidas: 18, demora_prom_h: 9, a_tiempo_pct: 100, cumplimiento_pct: 100, ultima_compra: isoHace(1),
    gastado_30d: 98000, deuda: 0, pendientes: 1, atrasadas: 0, insumos_en_lista: 2, comparables: 1, mas_barato_en: 1, sobreprecio_pct: 0,
  },
  {
    id: 'prov-lacteos-norte', nombre: 'Lácteos del Norte', rubro: 'Quesos y fiambres', contacto: 'Marcela', telefono: '+5493814000104',
    email: null, direccion: null, cuit: null, dias_entrega: 'Lun y Jue', demora_prometida_horas: 48, pedido_minimo: 100000,
    condicion_pago: '15 días', notas: null, activo: true,
    compras_recibidas: 6, demora_prom_h: 44, a_tiempo_pct: 83, cumplimiento_pct: 98, ultima_compra: isoHace(4),
    gastado_30d: 214000, deuda: 86400, pendientes: 0, atrasadas: 0, insumos_en_lista: 7, comparables: 5, mas_barato_en: 4, sobreprecio_pct: 1.5,
  },
  {
    id: 'prov-san-cayetano', nombre: 'Mayorista San Cayetano', rubro: 'Almacén, fiambres, descartables', contacto: 'Mostrador', telefono: '+5493814000105',
    email: null, direccion: null, cuit: null, dias_entrega: 'Lun a Vie', demora_prometida_horas: 24, pedido_minimo: 60000,
    condicion_pago: 'Contado', notas: 'Se puede retirar en el local.', activo: true,
    compras_recibidas: 10, demora_prom_h: 26, a_tiempo_pct: 70, cumplimiento_pct: 91, ultima_compra: isoHace(3),
    gastado_30d: 178000, deuda: 0, pendientes: 1, atrasadas: 1, insumos_en_lista: 18, comparables: 8, mas_barato_en: 3, sobreprecio_pct: 6.4,
  },
  {
    id: 'prov-la-huerta', nombre: 'Verdulería La Huerta', rubro: 'Verduras', contacto: 'Chino', telefono: '+5493814000106',
    email: null, direccion: null, cuit: null, dias_entrega: 'Lun a Sáb', demora_prometida_horas: 6, pedido_minimo: 10000,
    condicion_pago: 'Contado', notas: null, activo: true,
    compras_recibidas: 22, demora_prom_h: 4, a_tiempo_pct: 100, cumplimiento_pct: 100, ultima_compra: isoHace(0),
    gastado_30d: 64000, deuda: 0, pendientes: 0, atrasadas: 0, insumos_en_lista: 7, comparables: 3, mas_barato_en: 3, sobreprecio_pct: 0,
  },
]

export type PrecioComparar = {
  proveedor_id: string
  proveedor: string
  insumo_id: string
  insumo: string
  categoria: string
  unidad_compra: string
  precio: number
  fecha: string
  viejo: boolean
}

export const MOCK_PRECIOS_COMPARAR: PrecioComparar[] = [
  { proveedor_id: 'prov-don-ramon', proveedor: 'Frigorífico Don Ramón', insumo_id: 'ins-bollo', insumo: 'Bollo de carne', categoria: 'Carnes', unidad_compra: 'kg', precio: 9500, fecha: isoHace(10).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-carnes-valle', proveedor: 'Carnes del Valle', insumo_id: 'ins-bollo', insumo: 'Bollo de carne', categoria: 'Carnes', unidad_compra: 'kg', precio: 9200, fecha: isoHace(32).slice(0, 10), viejo: true },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-bollo', insumo: 'Bollo de carne', categoria: 'Carnes', unidad_compra: 'kg', precio: 10200, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-el-molino', proveedor: 'Panificadora El Molino', insumo_id: 'ins-pan', insumo: 'Pan de papa', categoria: 'Panificados', unidad_compra: 'docena', precio: 6000, fecha: isoHace(5).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-pan', insumo: 'Pan de papa', categoria: 'Panificados', unidad_compra: 'docena', precio: 6600, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte', insumo_id: 'ins-cheddar', insumo: 'Cheddar en fetas', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 14000, fecha: isoHace(8).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-cheddar', insumo: 'Cheddar en fetas', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 14900, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte', insumo_id: 'ins-muzza', insumo: 'Muzzarella', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 8800, fecha: isoHace(8).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-muzza', insumo: 'Muzzarella', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 9400, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-la-huerta', proveedor: 'Verdulería La Huerta', insumo_id: 'ins-tomate', insumo: 'Tomate', categoria: 'Verduras', unidad_compra: 'kg', precio: 2200, fecha: isoHace(2).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-tomate', insumo: 'Tomate', categoria: 'Verduras', unidad_compra: 'kg', precio: 2500, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-la-huerta', proveedor: 'Verdulería La Huerta', insumo_id: 'ins-cebolla', insumo: 'Cebolla', categoria: 'Verduras', unidad_compra: 'kg', precio: 1100, fecha: isoHace(2).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-cebolla', insumo: 'Cebolla', categoria: 'Verduras', unidad_compra: 'kg', precio: 1300, fecha: isoHace(20).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-don-ramon', proveedor: 'Frigorífico Don Ramón', insumo_id: 'ins-panceta', insumo: 'Panceta ahumada', categoria: 'Fiambres', unidad_compra: 'kg', precio: 17000, fecha: isoHace(10).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-el-molino', proveedor: 'Panificadora El Molino', insumo_id: 'ins-masa', insumo: 'Masa de pizza', categoria: 'Panificados', unidad_compra: 'kg', precio: 1800, fecha: isoHace(5).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte', insumo_id: 'ins-azul', insumo: 'Queso azul', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 16000, fecha: isoHace(8).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte', insumo_id: 'ins-parmesano', insumo: 'Queso parmesano', categoria: 'Lácteos y quesos', unidad_compra: 'kg', precio: 22000, fecha: isoHace(8).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-lacteos-norte', proveedor: 'Lácteos del Norte', insumo_id: 'ins-panceta', insumo: 'Panceta ahumada', categoria: 'Fiambres', unidad_compra: 'kg', precio: 16500, fecha: isoHace(8).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-crispy', insumo: 'Cebollita crispy', categoria: 'Congelados', unidad_compra: 'kg', precio: 9000, fecha: isoHace(12).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-san-cayetano', proveedor: 'Mayorista San Cayetano', insumo_id: 'ins-caja-hamb', insumo: 'Caja hamburguesa', categoria: 'Descartables', unidad_compra: 'paquete x100', precio: 16000, fecha: isoHace(12).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-la-huerta', proveedor: 'Verdulería La Huerta', insumo_id: 'ins-lechuga', insumo: 'Lechuga', categoria: 'Verduras', unidad_compra: 'kg', precio: 2800, fecha: isoHace(2).slice(0, 10), viejo: false },
  { proveedor_id: 'prov-la-huerta', proveedor: 'Verdulería La Huerta', insumo_id: 'ins-cebolla-morada', insumo: 'Cebolla morada', categoria: 'Verduras', unidad_compra: 'kg', precio: 1800, fecha: isoHace(2).slice(0, 10), viejo: false },
]

export const MOCK_AHORRO_COMPARAR = [
  { insumo: 'Bollo de carne', proveedor_mejor: 'Carnes del Valle', ahorro: 18600 },
  { insumo: 'Cheddar en fetas', proveedor_mejor: 'Lácteos del Norte', ahorro: 7200 },
  { insumo: 'Muzzarella', proveedor_mejor: 'Lácteos del Norte', ahorro: 5400 },
  { insumo: 'Pan de papa', proveedor_mejor: 'Panificadora El Molino', ahorro: 3600 },
]

export function getProveedor(id: string) {
  return MOCK_PROVEEDORES.find(p => p.id === id) ?? null
}

export type PrecioFicha = {
  insumo_id: string
  insumo: string
  unidad_compra: string
  precio: number
  fecha: string
  origen: string
  anterior: number | null
  minimo: number | null
  proveedor_minimo: string | null
}

export function getPreciosProveedor(proveedorId: string): PrecioFicha[] {
  const propios = MOCK_PRECIOS_COMPARAR.filter(p => p.proveedor_id === proveedorId)
  return propios.map(p => {
    const otros = MOCK_PRECIOS_COMPARAR.filter(x => x.insumo_id === p.insumo_id && x.proveedor_id !== proveedorId)
    const min = otros.length ? otros.reduce((a, b) => (a.precio <= b.precio ? a : b)) : null
    return {
      insumo_id: p.insumo_id,
      insumo: p.insumo,
      unidad_compra: p.unidad_compra,
      precio: p.precio,
      fecha: p.fecha,
      origen: 'lista',
      anterior: p.viejo ? Math.round(p.precio * 0.96) : null,
      minimo: min?.precio ?? null,
      proveedor_minimo: min?.proveedor ?? null,
    }
  })
}

