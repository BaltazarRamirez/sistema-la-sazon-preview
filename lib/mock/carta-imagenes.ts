/**
 * Imágenes temporales de la carta pública.
 * Cuando mandes las fotos reales, reemplazá los archivos en /public/carta
 * o actualizá este mapa.
 */
export const CARTA_IMAGENES: Record<string, string> = {
  'prod-americana': '/carta/burger-1.jpg',
  'prod-bacon-cheese': '/carta/burger-2.jpg',
  'prod-bbq-onion': '/carta/burger-3.jpg',
  'prod-caramelizada': '/carta/burger-4.jpg',
  'prod-clasica': '/carta/burger-5.jpg',
  'prod-crispy-melt': '/carta/burger-1.jpg',
  'prod-full-cheese': '/carta/burger-2.jpg',
  'prod-la-culposa': '/carta/burger-3.jpg',
  'prod-la-sazon': '/carta/burger-4.jpg',
  'prod-oklahomaxxx': '/carta/burger-5.jpg',
  'prod-onion-pickles': '/carta/burger-2.jpg',

  'prod-3-quesos': '/carta/pizza-4.jpg',
  'prod-cherrys': '/carta/pizza-2.jpg',
  'prod-fugazza': '/carta/pizza-5.jpg',
  'prod-jamon-morrones': '/carta/pizza-1.jpg',
  'prod-margarita': '/carta/pizza-2.jpg',
  'prod-muzza': '/carta/pizza-1.jpg',
  'prod-napolitana': '/carta/pizza-2.jpg',
  'prod-pepperoni': '/carta/pizza-3.jpg',
  'prod-queso-azul': '/carta/pizza-4.jpg',
  'prod-azul-cebollita': '/carta/pizza-5.jpg',
  'prod-azul-nueces': '/carta/pizza-4.jpg',
  'prod-azul-panceta': '/carta/pizza-3.jpg',

  'prod-coca': '/carta/bebida-1.jpg',
  'prod-sprite': '/carta/bebida-1.jpg',
  'prod-agua': '/carta/bebida-2.jpg',
  'prod-cerveza': '/carta/bebida-2.jpg',
  'prod-limonada': '/carta/bebida-1.jpg',

  'prod-papas': '/carta/combo-1.jpg',
  'prod-aros-extra': '/carta/burger-3.jpg',

  'promo-duo-sazon': '/carta/combo-1.jpg',
  'promo-pizza-birra': '/carta/pizza-1.jpg',
  'promo-clasica-doble': '/carta/burger-5.jpg',
}

export function imagenCarta(productoId: string, categoria: string): string {
  return CARTA_IMAGENES[productoId]
    ?? (categoria === 'hamburguesa' ? '/carta/burger-1.jpg' : '/carta/pizza-1.jpg')
}
