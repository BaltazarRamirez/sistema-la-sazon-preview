import type { ProductoMenu } from '@/components/TablaMenu'

export const MOCK_PRODUCTOS: ProductoMenu[] = [
  { id: 'prod-americana', categoria: 'hamburguesa', nombre: 'Americana', descripcion: 'Cheddar, panceta ahumada, huevo a la chapa, salsita triple', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3400, costo_doble: 5100, costo_triple: 6600, insumos_en_receta: 7, vendidas_30d: 36 },
  { id: 'prod-bacon-cheese', categoria: 'hamburguesa', nombre: 'Bacon Cheese', descripcion: 'Extra cheddar, extra panceta ahumada, salsita triple', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3600, costo_doble: 5400, costo_triple: 7000, insumos_en_receta: 6, vendidas_30d: 52 },
  { id: 'prod-bbq-onion', categoria: 'hamburguesa', nombre: 'BBQ Onion', descripcion: 'Cheddar, panceta ahumada, barbacoa, aros de cebolla Mc Cain x3', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3500, costo_doble: 5200, costo_triple: 6800, insumos_en_receta: 7, vendidas_30d: 28 },
  { id: 'prod-caramelizada', categoria: 'hamburguesa', nombre: 'Caramelizada', descripcion: 'Cheddar, panceta ahumada, cebolla caramelizada a la chapa, salsita triple', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3300, costo_doble: 5000, costo_triple: 6500, insumos_en_receta: 7, vendidas_30d: 31 },
  { id: 'prod-clasica', categoria: 'hamburguesa', nombre: 'Clásica', descripcion: 'Cheddar, huevo a punto, lechuga, tomate, cebolla morada, salsa triple', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3200, costo_doble: 4800, costo_triple: 6200, insumos_en_receta: 9, vendidas_30d: 64 },
  { id: 'prod-crispy-melt', categoria: 'hamburguesa', nombre: 'Crispy Melt', descripcion: 'Cheddar, panceta ahumada, aros de cebollita crispy, salsa La Sazón', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3500, costo_doble: 5300, costo_triple: 6900, insumos_en_receta: 7, vendidas_30d: 41 },
  { id: 'prod-full-cheese', categoria: 'hamburguesa', nombre: 'Full Cheese', descripcion: 'Extra cheddar, salsita triple', precio_simple: 12000, precio_doble: 13000, precio_triple: 14000, activo: true, costo_simple: 3000, costo_doble: 4500, costo_triple: 5800, insumos_en_receta: 5, vendidas_30d: 22 },
  { id: 'prod-la-culposa', categoria: 'hamburguesa', nombre: 'La Culposa', descripcion: 'Salsa de panceta ahumada con trocitos, crispy crocante, panceta, doble cheddar', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3800, costo_doble: 5600, costo_triple: 7200, insumos_en_receta: 7, vendidas_30d: 45 },
  { id: 'prod-la-sazon', categoria: 'hamburguesa', nombre: 'La Sazón', descripcion: 'Cheddar, panceta ahumada, salsa La Sazón', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3400, costo_doble: 5100, costo_triple: 6600, insumos_en_receta: 6, vendidas_30d: 58 },
  { id: 'prod-oklahomaxxx', categoria: 'hamburguesa', nombre: 'Oklahomaxxx', descripcion: 'Cheddar, panceta, salsa de la casa, cebollita en pluma smasheada', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3400, costo_doble: 5200, costo_triple: 6700, insumos_en_receta: 7, vendidas_30d: 33 },
  { id: 'prod-onion-pickles', categoria: 'hamburguesa', nombre: 'Onion Pickles Lover', descripcion: 'Cebolla en brunoise, pepinos encurtidos, cheddar, panceta, mostaza y ketchup', precio_simple: 12000, precio_doble: 14500, precio_triple: 16000, activo: true, costo_simple: 3300, costo_doble: 5000, costo_triple: 6500, insumos_en_receta: 8, vendidas_30d: 27 },
  { id: 'prod-3-quesos', categoria: 'pizzita', nombre: '3 Quesos', descripcion: 'Muzza, queso parmesano, queso azul, oliva', precio_simple: 13000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 3800, costo_doble: 7200, costo_triple: 0, insumos_en_receta: 6, vendidas_30d: 24 },
  { id: 'prod-cherrys', categoria: 'pizzita', nombre: 'Cherrys y Albahaca', descripcion: 'Salsa de tomate, muzza, cherrys, albahaca, oliva', precio_simple: 14000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 3600, costo_doble: 6800, costo_triple: 0, insumos_en_receta: 7, vendidas_30d: 19 },
  { id: 'prod-fugazza', categoria: 'pizzita', nombre: 'Fugazza', descripcion: 'Salsa de tomate, muzza, cebollita en pluma', precio_simple: 13000, precio_doble: 15000, precio_triple: null, activo: true, costo_simple: 3200, costo_doble: 6000, costo_triple: 0, insumos_en_receta: 5, vendidas_30d: 21 },
  { id: 'prod-jamon-morrones', categoria: 'pizzita', nombre: 'Jamón y Morrones', descripcion: 'Salsa de tomate, muzza, jamón, morrones asados, ajillo, oliva', precio_simple: 14000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 3900, costo_doble: 7400, costo_triple: 0, insumos_en_receta: 7, vendidas_30d: 26 },
  { id: 'prod-margarita', categoria: 'pizzita', nombre: 'Margarita', descripcion: 'Salsa de tomate, muzza, albahaca, oliva', precio_simple: 13000, precio_doble: 15000, precio_triple: null, activo: true, costo_simple: 3100, costo_doble: 5800, costo_triple: 0, insumos_en_receta: 6, vendidas_30d: 30 },
  { id: 'prod-muzza', categoria: 'pizzita', nombre: 'Muzza Simple', descripcion: 'Salsa de tomate, muzza, aceite oliva', precio_simple: 11000, precio_doble: 13000, precio_triple: null, activo: true, costo_simple: 2800, costo_doble: 5200, costo_triple: 0, insumos_en_receta: 5, vendidas_30d: 48 },
  { id: 'prod-napolitana', categoria: 'pizzita', nombre: 'Napolitana', descripcion: 'Salsa de tomate, muzza, tomates, ajillo', precio_simple: 13000, precio_doble: 15000, precio_triple: null, activo: true, costo_simple: 3200, costo_doble: 6000, costo_triple: 0, insumos_en_receta: 6, vendidas_30d: 29 },
  { id: 'prod-pepperoni', categoria: 'pizzita', nombre: 'Pepperoni', descripcion: 'Salsa de tomate, muzza, pepperonis', precio_simple: 13000, precio_doble: 15000, precio_triple: null, activo: true, costo_simple: 3500, costo_doble: 6600, costo_triple: 0, insumos_en_receta: 5, vendidas_30d: 38 },
  { id: 'prod-queso-azul', categoria: 'pizzita', nombre: 'Queso Azul', descripcion: 'Salsa de tomate, muzza, queso azul, oliva', precio_simple: 13000, precio_doble: 15000, precio_triple: null, activo: true, costo_simple: 3700, costo_doble: 7000, costo_triple: 0, insumos_en_receta: 6, vendidas_30d: 17 },
  { id: 'prod-azul-cebollita', categoria: 'pizzita', nombre: 'Queso Azul y Cebollita', descripcion: 'Salsa de tomate, muzza, queso azul, cebollita en pluma', precio_simple: 14000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 3800, costo_doble: 7200, costo_triple: 0, insumos_en_receta: 6, vendidas_30d: 15 },
  { id: 'prod-azul-nueces', categoria: 'pizzita', nombre: 'Queso Azul y Nueces', descripcion: 'Salsa de tomate, muzza, queso azul, nueces, oliva', precio_simple: 14000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 4000, costo_doble: 7600, costo_triple: 0, insumos_en_receta: 7, vendidas_30d: 14 },
  { id: 'prod-azul-panceta', categoria: 'pizzita', nombre: 'Queso Azul y Panceta', descripcion: 'Salsa de tomate, lardones de panceta, queso azul', precio_simple: 14000, precio_doble: 16000, precio_triple: null, activo: true, costo_simple: 4100, costo_doble: 7800, costo_triple: 0, insumos_en_receta: 5, vendidas_30d: 18 },

  { id: 'prod-coca', categoria: 'bebida', nombre: 'Coca-Cola 500 ml', descripcion: 'Línea o zero', precio_simple: 2500, precio_doble: null, precio_triple: null, activo: true, costo_simple: 900, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 120 },
  { id: 'prod-sprite', categoria: 'bebida', nombre: 'Sprite 500 ml', descripcion: null, precio_simple: 2500, precio_doble: null, precio_triple: null, activo: true, costo_simple: 900, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 48 },
  { id: 'prod-agua', categoria: 'bebida', nombre: 'Agua mineral 500 ml', descripcion: 'Con o sin gas', precio_simple: 1800, precio_doble: null, precio_triple: null, activo: true, costo_simple: 600, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 65 },
  { id: 'prod-cerveza', categoria: 'bebida', nombre: 'Cerveza artesanal 473 ml', descripcion: 'Rubia o IPA', precio_simple: 4500, precio_doble: null, precio_triple: null, activo: true, costo_simple: 1800, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 72 },
  { id: 'prod-limonada', categoria: 'bebida', nombre: 'Limonada casera', descripcion: 'Jarra individual', precio_simple: 3200, precio_doble: null, precio_triple: null, activo: true, costo_simple: 700, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 40 },

  { id: 'prod-papas', categoria: 'acompanamiento', nombre: 'Papas fritas', descripcion: 'Con sal y orégano', precio_simple: 4500, precio_doble: 6500, precio_triple: null, activo: true, costo_simple: 1200, costo_doble: 1800, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 88 },
  { id: 'prod-aros-extra', categoria: 'acompanamiento', nombre: 'Aros de cebolla', descripcion: 'Porción', precio_simple: 5000, precio_doble: 7500, precio_triple: null, activo: true, costo_simple: 1500, costo_doble: 2200, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 35 },

  // Combos / promos del día (precio fijo en simple)
  { id: 'promo-duo-sazon', categoria: 'promo', nombre: 'Dúo La Sazón', descripcion: 'La Sazón simple + papas chicas + gaseosa 500 ml', precio_simple: 16500, precio_doble: null, precio_triple: null, activo: true, costo_simple: 5500, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 22 },
  { id: 'promo-pizza-birra', categoria: 'promo', nombre: 'Pizzita + birra', descripcion: 'Muzza 4 porc. + cerveza artesanal', precio_simple: 14000, precio_doble: null, precio_triple: null, activo: true, costo_simple: 4600, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 18 },
  { id: 'promo-clasica-doble', categoria: 'promo', nombre: 'Clásica doble + papas', descripcion: 'Clásica doble + papas chicas · promo del día', precio_simple: 17500, precio_doble: null, precio_triple: null, activo: true, costo_simple: 6000, costo_doble: 0, costo_triple: 0, insumos_en_receta: 0, vendidas_30d: 15 },
]

/** Capas visuales vectoriales (orden 0 = arriba, como el despiece McD). */
export type CapaVisual =
  | 'pan_arriba'
  | 'pan_abajo'
  | 'carne'
  | 'cheddar'
  | 'panceta'
  | 'huevo'
  | 'lechuga'
  | 'tomate'
  | 'cebolla'
  | 'cebolla_morada'
  | 'cebolla_caramelizada'
  | 'cebolla_pluma'
  | 'crispy'
  | 'aros'
  | 'pepinos'
  | 'salsa_triple'
  | 'salsa_sazon'
  | 'salsa_panceta'
  | 'bbq'
  | 'mostaza'
  | 'masa'
  | 'salsa_tomate'
  | 'muzza'
  | 'azul'
  | 'parmesano'
  | 'jamon'
  | 'pepperoni'
  | 'cherry'
  | 'albahaca'
  | 'morrones'
  | 'nueces'
  | 'oliva'
  | 'caja'

export type LineaRecetaMock = {
  insumo_id: string
  capa: CapaVisual
  etiqueta: string
  cant_simple: number
  cant_doble: number
  cant_triple: number
  /** Si true, en doble/triple se repite la capa visual (carne, cheddar entre medio). */
  escala_con_tamano?: boolean
}

function L(
  insumo_id: string,
  capa: CapaVisual,
  etiqueta: string,
  s: number,
  d: number,
  t: number,
  escala = false,
): LineaRecetaMock {
  return { insumo_id, capa, etiqueta, cant_simple: s, cant_doble: d, cant_triple: t, escala_con_tamano: escala }
}

const pan = L('ins-pan', 'pan_arriba', 'Pan de papa (tapa)', 0.5, 0.5, 0.5)
const panBase = L('ins-pan', 'pan_abajo', 'Pan de papa (base)', 0.5, 0.5, 0.5)
const carne = L('ins-bollo', 'carne', 'Bollo de carne', 1, 2, 3, true)
const cheddar = L('ins-cheddar', 'cheddar', 'Cheddar', 1, 2, 3, true)
const cheddarX2 = L('ins-cheddar', 'cheddar', 'Extra cheddar', 2, 3, 4, true)
const panceta = L('ins-panceta', 'panceta', 'Panceta ahumada', 2, 2, 3)
const pancetaX = L('ins-panceta', 'panceta', 'Extra panceta ahumada', 3, 4, 5)
const huevo = L('ins-huevo', 'huevo', 'Huevo a la chapa', 1, 1, 1)
const salsaT = L('ins-salsa-triple', 'salsa_triple', 'Salsa triple', 25, 30, 35)
const salsaS = L('ins-salsa-sazon', 'salsa_sazon', 'Salsa La Sazón', 25, 30, 35)
const salsaP = L('ins-panceta', 'salsa_panceta', 'Salsa de panceta', 20, 25, 30)
const bbq = L('ins-bbq', 'bbq', 'Salsa barbacoa', 25, 30, 35)
const mostaza = L('ins-mostaza', 'mostaza', 'Mostaza y ketchup', 20, 25, 30)
const aros = L('ins-aros', 'aros', 'Aros de cebolla', 3, 3, 4)
const crispy = L('ins-crispy', 'crispy', 'Cebollita crispy', 15, 18, 20)
const lechuga = L('ins-lechuga', 'lechuga', 'Lechuga', 20, 25, 30)
const tomate = L('ins-tomate', 'tomate', 'Tomate', 30, 35, 40)
const cebollaM = L('ins-cebolla-morada', 'cebolla_morada', 'Cebolla morada', 15, 18, 20)
const cebollaC = L('ins-cebolla', 'cebolla_caramelizada', 'Cebolla caramelizada', 25, 30, 35)
const cebollaP = L('ins-cebolla', 'cebolla_pluma', 'Cebollita en pluma', 20, 25, 30)
const cebollaB = L('ins-cebolla', 'cebolla', 'Cebolla en brunoise', 15, 18, 20)
const pepinos = L('ins-pepinos', 'pepinos', 'Pepinos encurtidos', 15, 18, 20)
const caja = L('ins-caja-hamb', 'caja', 'Caja hamburguesa', 1, 1, 1)

function pizza(
  toppings: LineaRecetaMock[],
): LineaRecetaMock[] {
  return [
    L('ins-caja-pizza', 'caja', 'Caja pizza', 1, 1, 0),
    ...toppings,
    L('ins-salsa-tomate', 'salsa_tomate', 'Salsa de tomate', 40, 70, 0),
    L('ins-masa', 'masa', 'Masa de pizza', 180, 320, 0),
  ]
}

/** Orden: índice 0 = capa de arriba en el despiece. */
export const MOCK_RECETAS: Record<string, LineaRecetaMock[]> = {
  'prod-americana': [pan, huevo, panceta, cheddar, carne, salsaT, panBase, caja],
  'prod-bacon-cheese': [pan, pancetaX, cheddarX2, carne, salsaT, panBase, caja],
  'prod-bbq-onion': [pan, aros, panceta, cheddar, carne, bbq, panBase, caja],
  'prod-caramelizada': [pan, cebollaC, panceta, cheddar, carne, salsaT, panBase, caja],
  'prod-clasica': [pan, huevo, lechuga, tomate, cebollaM, cheddar, carne, salsaT, panBase, caja],
  'prod-crispy-melt': [pan, crispy, panceta, cheddar, carne, salsaS, panBase, caja],
  'prod-full-cheese': [pan, cheddarX2, carne, salsaT, panBase, caja],
  'prod-la-culposa': [pan, crispy, panceta, cheddarX2, carne, salsaP, panBase, caja],
  'prod-la-sazon': [pan, panceta, cheddar, carne, salsaS, panBase, caja],
  'prod-oklahomaxxx': [pan, cebollaP, panceta, cheddar, carne, salsaS, panBase, caja],
  'prod-onion-pickles': [pan, pepinos, cebollaB, panceta, cheddar, carne, mostaza, panBase, caja],

  'prod-3-quesos': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-azul', 'azul', 'Queso azul', 25, 45, 0),
    L('ins-parmesano', 'parmesano', 'Queso parmesano', 15, 25, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-cherrys': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-albahaca', 'albahaca', 'Albahaca', 4, 6, 0),
    L('ins-cherry', 'cherry', 'Tomates cherry', 40, 70, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-fugazza': pizza([
    L('ins-cebolla', 'cebolla_pluma', 'Cebollita en pluma', 30, 50, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-jamon-morrones': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-morrones', 'morrones', 'Morrones asados', 35, 60, 0),
    L('ins-jamon', 'jamon', 'Jamón cocido', 40, 70, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-margarita': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-albahaca', 'albahaca', 'Albahaca', 4, 6, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-muzza': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-napolitana': pizza([
    L('ins-tomate', 'tomate', 'Tomate', 40, 70, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-pepperoni': pizza([
    L('ins-pepperoni', 'pepperoni', 'Pepperoni', 40, 70, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-queso-azul': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-azul', 'azul', 'Queso azul', 30, 50, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-azul-cebollita': pizza([
    L('ins-cebolla', 'cebolla_pluma', 'Cebollita en pluma', 25, 40, 0),
    L('ins-azul', 'azul', 'Queso azul', 30, 50, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-azul-nueces': pizza([
    L('ins-oliva', 'oliva', 'Aceite de oliva', 5, 8, 0),
    L('ins-nueces', 'nueces', 'Nueces', 15, 25, 0),
    L('ins-azul', 'azul', 'Queso azul', 30, 50, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 80, 140, 0),
  ]),
  'prod-azul-panceta': pizza([
    L('ins-panceta', 'panceta', 'Lardones de panceta', 25, 40, 0),
    L('ins-azul', 'azul', 'Queso azul', 30, 50, 0),
    L('ins-muzza', 'muzza', 'Muzzarella', 70, 120, 0),
  ]),
}

export function getProducto(id: string) {
  return MOCK_PRODUCTOS.find(p => p.id === id) ?? null
}

type RecetasStore = { byId: Record<string, LineaRecetaMock[]> }

function storeRecetas(): RecetasStore {
  const g = globalThis as typeof globalThis & { __sazonRecetas?: RecetasStore }
  if (!g.__sazonRecetas) {
    g.__sazonRecetas = {
      byId: Object.fromEntries(Object.entries(MOCK_RECETAS).map(([k, v]) => [k, v.map(l => ({ ...l }))])),
    }
  }
  return g.__sazonRecetas
}

export function getReceta(productoId: string) {
  return storeRecetas().byId[productoId] ?? []
}

export function guardarRecetaMock(productoId: string, items: LineaRecetaMock[]) {
  storeRecetas().byId[productoId] = items.map(l => ({ ...l }))
  // mantener conteo en listado
  const p = MOCK_PRODUCTOS.find(x => x.id === productoId)
  if (p) {
    const ids = new Set(items.filter(i => i.capa !== 'caja' && i.capa !== 'pan_arriba').map(i => i.insumo_id))
    // pan base + tapa cuentan 1
    p.insumos_en_receta = ids.size
  }
  return true
}
