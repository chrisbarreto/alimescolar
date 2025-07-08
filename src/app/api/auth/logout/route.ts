import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  console.log('=== POST /api/auth/logout iniciado ===')
  
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Primero, intentar cerrar sesión si existe
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error cerrando sesión en Supabase:', error)
      } else {
        console.log('Sesión cerrada en Supabase exitosamente')
      }
    } catch (signOutError) {
      console.error('Error durante signOut:', signOutError)
    }

    // Crear respuesta de éxito
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })

    // Limpiar TODAS las cookies de Supabase Auth
    // Estos son los nombres reales que usa @supabase/auth-helpers-nextjs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const urlObj = new URL(supabaseUrl)
    const domain = urlObj.hostname
    
    // Nombres de cookies que usa Supabase Auth Helpers
    const cookieNames = [
      `sb-${domain.replace(/\./g, '-')}-auth-token`,
      `sb-${domain.replace(/\./g, '-')}-auth-token.0`,
      `sb-${domain.replace(/\./g, '-')}-auth-token.1`,
      `sb-${domain.replace(/\./g, '-')}-auth-token.2`,
      `sb-${domain.replace(/\./g, '-')}-auth-token.3`,
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token'
    ]

    const cookieOptions = {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    }

    // Limpiar todas las cookies posibles
    cookieNames.forEach(name => {
      response.cookies.set(name, '', cookieOptions)
      console.log(`Cookie limpiada: ${name}`)
    })

    console.log('=== Logout completado exitosamente ===')
    return response

  } catch (error: any) {
    console.error('Error crítico en /api/auth/logout:', error)
    
    // Incluso si hay error, limpiar cookies y devolver éxito
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada (forzado por error)'
    })

    // Limpiar cookies básicas
    const cookieOptions = {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    }

    const basicCookieNames = [
      'supabase-auth-token',
      'sb-access-token', 
      'sb-refresh-token'
    ]

    basicCookieNames.forEach(name => {
      response.cookies.set(name, '', cookieOptions)
    })

    return response
  }
}
