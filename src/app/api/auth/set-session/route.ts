import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()
    
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Tokens de acceso requeridos' },
        { status: 400 }
      )
    }

    // Crear cliente de Supabase con las cookies del servidor
    const supabase = await createSupabaseServerClient()

    // Establecer la sesión con los tokens
    const { data: { session }, error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    })

    if (error) {
      console.error('Error estableciendo sesión:', error)
      return NextResponse.json(
        { error: 'Error estableciendo sesión: ' + error.message },
        { status: 400 }
      )
    }

    if (!session) {
      return NextResponse.json(
        { error: 'No se pudo establecer la sesión' },
        { status: 400 }
      )
    }

    console.log('✅ Sesión establecida exitosamente para:', session.user.email)

    return NextResponse.json({
      success: true,
      message: 'Sesión establecida exitosamente',
      user: {
        id: session.user.id,
        email: session.user.email
      }
    })

  } catch (error: any) {
    console.error('Error en /api/auth/set-session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
