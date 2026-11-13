import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const publicRoutes = ['/login', '/carta']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Solo el login redirige al panel si ya hay sesión; la carta queda abierta al cliente
  if (path === '/login' && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  // No pasar por auth archivos estáticos de /public
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)'],
}
