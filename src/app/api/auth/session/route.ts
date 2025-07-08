import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error obteniendo sesión:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 })
    }
    
    return NextResponse.json({ 
      session: {
        user: {
          id: session.user.id,
          email: session.user.email
        }
      }
    })
    
  } catch (error) {
    console.error('Error en endpoint de sesión:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()
    
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Tokens requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    // Establecer la sesión en el servidor
    const { data: { session }, error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    })

    if (error) {
      console.error('Error estableciendo sesión en servidor:', error)
      return NextResponse.json(
        { error: 'Error estableciendo sesión' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      session: session
    })

  } catch (error: any) {
    console.error('Error en /api/auth/session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
