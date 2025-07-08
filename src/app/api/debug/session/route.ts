import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar sesión
    const { data: { session }, error } = await supabase.auth.getSession()
    
    return NextResponse.json({
      hasSession: !!session,
      sessionError: error?.message || null,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        aud: session.user.aud,
        created_at: session.user.created_at
      } : null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Error en debug:', error)
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
