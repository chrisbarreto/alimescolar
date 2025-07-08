import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🛡️ Middleware ejecutándose para:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) {
    console.log('⚠️ Error obteniendo sesión:', error.message)
  }

  if (session) {
    console.log('🔍 Estado de sesión: Autenticado (' + session.user?.email + ')')
  } else {
    console.log('🔍 Estado de sesión: No autenticado')
  }

  // Rutas protegidas
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Si intenta acceder a ruta protegida sin sesión
  if (isProtectedRoute && !session) {
    console.log('🚫 Acceso denegado, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si tiene sesión y está en login/register, redirigir al dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    console.log('✅ Usuario autenticado, redirigiendo a dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  console.log('✅ Middleware: Acceso permitido')
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}