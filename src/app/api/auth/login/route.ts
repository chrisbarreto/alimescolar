import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Crear cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // 1. Verificar en tu BD
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

    if (!authUser?.usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // 2. Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, authUser.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    if (authUser.usuario.estadoUsuario !== 'ACTIVO') {
      return NextResponse.json(
        { error: 'Usuario inactivo' },
        { status: 401 }
      )
    }

    // 3. Autenticar con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      // Si no existe en Supabase, crear el usuario automáticamente
      console.log('Usuario no existe en Supabase, creando...', authError.message)
      
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          idUsuario: authUser.usuario.idUsuario,
          nombreUsuario: authUser.usuario.nombreUsuario,
          nombreCompleto: `${authUser.usuario.persona.nombre} ${authUser.usuario.persona.apellido}`
        }
      })

      if (signUpError) {
        console.error('Error creando usuario en Supabase:', signUpError)
        return NextResponse.json(
          { error: 'Error de autenticación en Supabase' },
          { status: 500 }
        )
      }

      // Intentar login nuevamente después de crear el usuario
      const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError2) {
        console.error('Error en segundo intento de login:', authError2)
        return NextResponse.json(
          { error: 'Error de autenticación' },
          { status: 401 }
        )
      }

      // Retornar con datos de la segunda autenticación
      const userSession = {
        idUsuario: authUser.usuario.idUsuario,
        nombreUsuario: authUser.usuario.nombreUsuario,
        email: authUser.email,
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

      return NextResponse.json({
        success: true,
        user: authData2.user,
        session: authData2.session,
        userSession
      })
    }

    // 4. Si el login fue exitoso desde el primer intento
    const userSession = {
      idUsuario: authUser.usuario.idUsuario,
      nombreUsuario: authUser.usuario.nombreUsuario,
      email: authUser.email,
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

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
      userSession
    })

  } catch (error: any) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
