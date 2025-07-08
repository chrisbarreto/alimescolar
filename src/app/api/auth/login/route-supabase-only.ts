import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/lib/supabaseClient'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Intento de login para:', email)

    // 1. Validar datos de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // 2. Autenticar ÚNICAMENTE con Supabase Auth (fuente de verdad)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.log('❌ Error de autenticación en Supabase:', authError.message)
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    if (!authData.session || !authData.user) {
      console.log('❌ No se recibió sesión o usuario de Supabase')
      return NextResponse.json(
        { error: 'Error de autenticación' },
        { status: 401 }
      )
    }

    console.log('✅ Autenticación exitosa en Supabase para:', authData.user.email)

    // 3. Buscar usuario en nuestra BD por email
    const authUser = await prisma.authUser.findUnique({
      where: { email },
      include: {
        usuario: {
          include: {
            persona: true,
            organizacion: true
          }
        }
      }
    })

    if (!authUser) {
      console.log('❌ Usuario no encontrado en BD local')
      return NextResponse.json(
        { error: 'Usuario no encontrado en el sistema' },
        { status: 404 }
      )
    }

    // 4. Preparar datos de sesión
    const userSession = {
      idUsuario: authUser.usuario.idUsuario,
      nombreUsuario: authUser.usuario.nombreUsuario,
      email: authUser.email,
      supabaseId: authData.user.id,
      persona: {
        nombre: authUser.usuario.persona.nombre,
        apellido: authUser.usuario.persona.apellido,
        correoPersona: authUser.usuario.persona.correoPersona
      },
      organizacion: {
        razonSocial: authUser.usuario.organizacion.razonSocial,
        idOrganizacion: authUser.usuario.organizacion.idOrganizacion
      }
    }

    console.log('🎉 Login completado exitosamente')
    return NextResponse.json({
      message: 'Login exitoso',
      userSession,
      session: authData.session
    })

  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
