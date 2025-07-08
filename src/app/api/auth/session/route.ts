import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()
    
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Tokens requeridos' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

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
