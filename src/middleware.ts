import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🛡️ Middleware ejecutándose para:', req.nextUrl.pathname)
  
  // Rutas protegidas
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Crear cliente de Supabase para el middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // En el middleware, las cookies se establecen en la respuesta
          req.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar la sesión de Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const hasValidSession = !!session

  console.log('🔍 Sesión de Supabase:', hasValidSession ? 'Válida' : 'No válida')

  // Si intenta acceder a ruta protegida sin sesión válida
  if (isProtectedRoute && !hasValidSession) {
    console.log('🚫 Acceso denegado, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si tiene sesión válida y está en login/register, redirigir al dashboard
  if (hasValidSession && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    console.log('✅ Usuario autenticado, redirigiendo a dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  console.log('✅ Middleware: Acceso permitido')
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}