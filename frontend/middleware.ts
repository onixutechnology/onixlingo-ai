import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 👇 ¡ESTA PALABRA 'export' ES OBLIGATORIA!
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // 1. Rutas Protegidas
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/practice') || pathname.startsWith('/lesson')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. Redirección si ya estás logueado
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// 👇 ESTO TAMBIÉN DEBE LLEVAR 'export'
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/practice/:path*', 
    '/lesson/:path*',    
    '/login',            
    '/register'
  ]
}