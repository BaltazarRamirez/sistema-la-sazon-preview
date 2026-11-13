import type { InsumoFila } from '@/components/TablaStock'

type Seed = {
  id: string
  nombre: string
  categoria: string
  unidad: string
  unidad_compra: string
  equivalencia: number
  minimo: number
  precioCompra: number
  factorStock?: number
  consumo?: number
  enCamino?: number
  enCaminoDe?: string | null
  mejor?: string | null
  mejorPrecio?: number | null
  usos?: number
}

const SEED: Seed[] = [
  { id: 'ins-bollo', nombre: 'Bollo de carne', categoria: 'Carnes', unidad: 'bollo', unidad_compra: 'kg', equivalencia: 10, minimo: 80, precioCompra: 9100, factorStock: 0.55, consumo: 28, mejor: 'Carnes del Valle', mejorPrecio: 9200, usos: 11 },
  { id: 'ins-pan', nombre: 'Pan de papa', categoria: 'Panificados', unidad: 'pan', unidad_compra: 'docena', equivalencia: 12, minimo: 48, precioCompra: 6000, factorStock: 1.4, consumo: 22, enCamino: 36, enCaminoDe: 'Panificadora El Molino', mejor: 'Panificadora El Molino', mejorPrecio: 6000, usos: 11 },
  { id: 'ins-masa', nombre: 'Masa de pizza', categoria: 'Panificados', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 3000, precioCompra: 1800, factorStock: 1.8, consumo: 900, usos: 12 },
  { id: 'ins-cheddar', nombre: 'Cheddar en fetas', categoria: 'Lácteos y quesos', unidad: 'feta', unidad_compra: 'kg', equivalencia: 50, minimo: 100, precioCompra: 14000, factorStock: 1.5, consumo: 40, mejor: 'Lácteos del Norte', mejorPrecio: 14000, usos: 11 },
  { id: 'ins-muzza', nombre: 'Muzzarella', categoria: 'Lácteos y quesos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 4000, precioCompra: 8800, factorStock: 1.3, consumo: 1200, usos: 11 },
  { id: 'ins-azul', nombre: 'Queso azul', categoria: 'Lácteos y quesos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 600, precioCompra: 16000, factorStock: 1.6, consumo: 180, usos: 5 },
  { id: 'ins-parmesano', nombre: 'Queso parmesano', categoria: 'Lácteos y quesos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 300, precioCompra: 22000, factorStock: 2, consumo: 40, usos: 1 },
  { id: 'ins-panceta', nombre: 'Panceta ahumada', categoria: 'Fiambres', unidad: 'feta', unidad_compra: 'kg', equivalencia: 40, minimo: 120, precioCompra: 15800, factorStock: 0.7, consumo: 35, mejor: 'Mayorista San Cayetano', mejorPrecio: 15800, usos: 10 },
  { id: 'ins-jamon', nombre: 'Jamón cocido', categoria: 'Fiambres', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 500, precioCompra: 11000, factorStock: 1.5, consumo: 120, usos: 1 },
  { id: 'ins-pepperoni', nombre: 'Pepperoni', categoria: 'Fiambres', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 300, precioCompra: 20500, factorStock: 1.8, consumo: 80, usos: 1 },
  { id: 'ins-huevo', nombre: 'Huevo', categoria: 'Almacén', unidad: 'unidad', unidad_compra: 'maple x30', equivalencia: 30, minimo: 30, precioCompra: 6000, factorStock: 1.6, consumo: 12, usos: 2 },
  { id: 'ins-cebolla', nombre: 'Cebolla', categoria: 'Verduras', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 2500, precioCompra: 1100, factorStock: 1.4, consumo: 600, mejor: 'Verdulería La Huerta', mejorPrecio: 1100, usos: 5 },
  { id: 'ins-cebolla-morada', nombre: 'Cebolla morada', categoria: 'Verduras', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 500, precioCompra: 1800, factorStock: 1.5, consumo: 120, usos: 1 },
  { id: 'ins-lechuga', nombre: 'Lechuga', categoria: 'Verduras', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 300, precioCompra: 2800, factorStock: 1.2, consumo: 80, usos: 1 },
  { id: 'ins-tomate', nombre: 'Tomate', categoria: 'Verduras', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 1500, precioCompra: 2200, factorStock: 1.3, consumo: 400, mejor: 'Verdulería La Huerta', mejorPrecio: 2200, usos: 2 },
  { id: 'ins-cherry', nombre: 'Tomates cherry', categoria: 'Verduras', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 400, precioCompra: 6000, factorStock: 1.5, consumo: 90, usos: 1 },
  { id: 'ins-albahaca', nombre: 'Albahaca', categoria: 'Verduras', unidad: 'g', unidad_compra: 'atado 50 g', equivalencia: 50, minimo: 40, precioCompra: 800, factorStock: 1.4, consumo: 8, usos: 2 },
  { id: 'ins-morrones', nombre: 'Morrones asados', categoria: 'Almacén', unidad: 'g', unidad_compra: 'frasco 1 kg', equivalencia: 1000, minimo: 300, precioCompra: 7000, factorStock: 1.7, consumo: 50, usos: 1 },
  { id: 'ins-salsa-triple', nombre: 'Salsa triple', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 1000, precioCompra: 4500, factorStock: 1.5, consumo: 280, usos: 5 },
  { id: 'ins-salsa-sazon', nombre: 'Salsa La Sazón', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 1000, precioCompra: 5000, factorStock: 1.4, consumo: 320, usos: 4 },
  { id: 'ins-bbq', nombre: 'Salsa barbacoa', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 400, precioCompra: 5500, factorStock: 1.6, consumo: 60, usos: 1 },
  { id: 'ins-salsa-tomate', nombre: 'Salsa de tomate', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 2500, precioCompra: 2500, factorStock: 1.5, consumo: 700, usos: 10 },
  { id: 'ins-mostaza', nombre: 'Mostaza y ketchup', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 400, precioCompra: 3500, factorStock: 1.8, consumo: 40, usos: 1 },
  { id: 'ins-pepinos', nombre: 'Pepinos encurtidos', categoria: 'Salsas y aderezos', unidad: 'g', unidad_compra: 'frasco 1 kg', equivalencia: 1000, minimo: 300, precioCompra: 6500, factorStock: 1.5, consumo: 50, usos: 1 },
  { id: 'ins-oliva', nombre: 'Aceite de oliva', categoria: 'Almacén', unidad: 'ml', unidad_compra: 'litro', equivalencia: 1000, minimo: 300, precioCompra: 18000, factorStock: 2, consumo: 40, usos: 6 },
  { id: 'ins-nueces', nombre: 'Nueces', categoria: 'Almacén', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 150, precioCompra: 20000, factorStock: 1.8, consumo: 20, usos: 1 },
  { id: 'ins-aros', nombre: 'Aros de cebolla', categoria: 'Congelados', unidad: 'unidad', unidad_compra: 'bolsa 1 kg', equivalencia: 45, minimo: 45, precioCompra: 9000, factorStock: 1.5, consumo: 10, usos: 1 },
  { id: 'ins-crispy', nombre: 'Cebollita crispy', categoria: 'Congelados', unidad: 'g', unidad_compra: 'kg', equivalencia: 1000, minimo: 400, precioCompra: 9000, factorStock: 0.35, consumo: 90, usos: 2 },
  { id: 'ins-caja-hamb', nombre: 'Caja hamburguesa', categoria: 'Descartables', unidad: 'unidad', unidad_compra: 'paquete x100', equivalencia: 100, minimo: 100, precioCompra: 16000, factorStock: 1.6, consumo: 35, usos: 11 },
  { id: 'ins-caja-pizza', nombre: 'Caja pizza', categoria: 'Descartables', unidad: 'unidad', unidad_compra: 'paquete x50', equivalencia: 50, minimo: 40, precioCompra: 12000, factorStock: 1.7, consumo: 18, usos: 12 },
]

export const MOCK_INSUMOS: InsumoFila[] = SEED.map(s => ({
  id: s.id,
  nombre: s.nombre,
  categoria: s.categoria,
  unidad: s.unidad,
  unidad_compra: s.unidad_compra,
  equivalencia: s.equivalencia,
  stock_actual: Math.round(s.minimo * (s.factorStock ?? 1.5) * 10) / 10,
  stock_minimo: s.minimo,
  costo_unitario: Math.round((s.precioCompra / s.equivalencia) * 10000) / 10000,
  activo: true,
  notas: null,
  consumo_diario: s.consumo ?? 0,
  en_camino: s.enCamino ?? 0,
  en_camino_de: s.enCaminoDe ?? null,
  mejor_proveedor: s.mejor ?? null,
  mejor_precio: s.mejorPrecio ?? null,
  usos: s.usos ?? 0,
}))

export const MOCK_PRODUCCION = [
  { id: 'prod-clasica', nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'simple', posibles: 18, limitante: 'Bollo de carne', precio: 12000 },
  { id: 'prod-clasica', nombre: 'Clásica', categoria: 'hamburguesa', tamano: 'doble', posibles: 9, limitante: 'Bollo de carne', precio: 14500 },
  { id: 'prod-bacon-cheese', nombre: 'Bacon Cheese', categoria: 'hamburguesa', tamano: 'simple', posibles: 14, limitante: 'Panceta ahumada', precio: 12000 },
  { id: 'prod-muzza', nombre: 'Muzza Simple', categoria: 'pizzita', tamano: 'simple', posibles: 42, limitante: 'Masa de pizza', precio: 11000 },
  { id: 'prod-pepperoni', nombre: 'Pepperoni', categoria: 'pizzita', tamano: 'doble', posibles: 18, limitante: 'Pepperoni', precio: 15000 },
]

export const MOCK_MOVIMIENTOS = [
  { id: 'mov-1', tipo: 'compra', cantidad: 120, nota: 'Recepción Don Ramón', creado_en: new Date(Date.now() - 2 * 3600000).toISOString(), insumo: 'Bollo de carne', insumo_id: 'ins-bollo', unidad: 'bollo', compra_numero: 88 },
  { id: 'mov-2', tipo: 'merma', cantidad: -8, nota: 'Pan seco', creado_en: new Date(Date.now() - 5 * 3600000).toISOString(), insumo: 'Pan de papa', insumo_id: 'ins-pan', unidad: 'pan', compra_numero: null },
  { id: 'mov-3', tipo: 'ajuste', cantidad: -3, nota: 'Conteo físico', creado_en: new Date(Date.now() - 28 * 3600000).toISOString(), insumo: 'Cebollita crispy', insumo_id: 'ins-crispy', unidad: 'g', compra_numero: null },
  { id: 'mov-4', tipo: 'compra', cantidad: 2000, nota: 'Huerta', creado_en: new Date(Date.now() - 30 * 3600000).toISOString(), insumo: 'Tomate', insumo_id: 'ins-tomate', unidad: 'g', compra_numero: 87 },
  { id: 'mov-5', tipo: 'inicial', cantidad: 500, nota: 'Stock inicial', creado_en: new Date(Date.now() - 20 * 86400000).toISOString(), insumo: 'Salsa La Sazón', insumo_id: 'ins-salsa-sazon', unidad: 'g', compra_numero: null },
]

export function getInsumo(id: string) {
  return MOCK_INSUMOS.find(i => i.id === id) ?? null
}

export function getUsosInsumo(insumoId: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MOCK_PRODUCTOS, MOCK_RECETAS } = require('@/lib/mock/menu') as typeof import('@/lib/mock/menu')
  const out: {
    producto_id: string
    nombre: string
    categoria: string
    cant_simple: number
    cant_doble: number
    cant_triple: number
    precio_doble: number | null
    precio_triple: number | null
    activo: boolean
  }[] = []
  for (const p of MOCK_PRODUCTOS) {
    const receta = MOCK_RECETAS[p.id] ?? []
    const lineas = receta.filter(l => l.insumo_id === insumoId)
    if (!lineas.length) continue
    out.push({
      producto_id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      cant_simple: lineas.reduce((a, l) => a + l.cant_simple, 0),
      cant_doble: lineas.reduce((a, l) => a + l.cant_doble, 0),
      cant_triple: lineas.reduce((a, l) => a + l.cant_triple, 0),
      precio_doble: p.precio_doble,
      precio_triple: p.precio_triple,
      activo: p.activo,
    })
  }
  return out
}

export function getPreciosInsumo(insumoId: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MOCK_PRECIOS_COMPARAR } = require('@/lib/mock/proveedores') as typeof import('@/lib/mock/proveedores')
  return MOCK_PRECIOS_COMPARAR
    .filter(p => p.insumo_id === insumoId)
    .map(p => ({
      proveedor_id: p.proveedor_id,
      proveedor: p.proveedor,
      precio: p.precio,
      fecha: p.fecha,
      origen: 'lista',
      anterior: p.viejo ? Math.round(p.precio * 0.95) : null,
      viejo: p.viejo,
      demora_prometida_horas: null as number | null,
    }))
    .sort((a, b) => a.precio - b.precio)
}

export function getMovimientosInsumo(insumoId: string) {
  const propios = MOCK_MOVIMIENTOS.filter(m => m.insumo_id === insumoId)
  if (propios.length) {
    return propios.map(m => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: m.cantidad,
      nota: m.nota,
      creado_en: m.creado_en,
      venta_numero: null as number | null,
      compra_numero: m.compra_numero,
      compra_id: m.compra_numero ? `com-${m.compra_numero}` : null,
    }))
  }
  const ins = getInsumo(insumoId)
  if (!ins) return []
  const ahora = Date.now()
  return [
    { id: `mov-${insumoId}-1`, tipo: 'venta', cantidad: -Math.max(1, Math.round(ins.consumo_diario * 0.4)), nota: null, creado_en: new Date(ahora - 3 * 3600000).toISOString(), venta_numero: 1844, compra_numero: null, compra_id: null },
    { id: `mov-${insumoId}-2`, tipo: 'venta', cantidad: -Math.max(1, Math.round(ins.consumo_diario * 0.3)), nota: null, creado_en: new Date(ahora - 28 * 3600000).toISOString(), venta_numero: 1839, compra_numero: null, compra_id: null },
    { id: `mov-${insumoId}-3`, tipo: 'compra', cantidad: Math.round(ins.stock_minimo * 1.2), nota: 'Reposición', creado_en: new Date(ahora - 4 * 86400000).toISOString(), venta_numero: null, compra_numero: 88, compra_id: 'com-88' },
  ]
}

export function getConsumoSerieInsumo(insumoId: string) {
  const ins = getInsumo(insumoId)
  const base = ins?.consumo_diario ?? 10
  return Array.from({ length: 14 }, (_, k) => {
    const factor = 0.7 + ((k * 17 + insumoId.length) % 7) * 0.08
    const finDeSemana = k % 7 === 0 || k % 7 === 6
    return Math.round(base * factor * (finDeSemana ? 1.25 : 1))
  })
}

/** Proveedor sugerido para pedir este insumo (más barato vigente). */
export function sugerirPedidoInsumo(insumoId: string) {
  const precios = getPreciosInsumo(insumoId)
  const mejor = precios[0]
  if (!mejor) return null
  return {
    proveedor_id: mejor.proveedor_id,
    proveedor: mejor.proveedor,
    precio: mejor.precio,
    viejo: mejor.viejo,
  }
}
