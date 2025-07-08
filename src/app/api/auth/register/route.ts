import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSupabaseAdmin } from '@/lib/supabaseClient'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { 
      email, 
      password, 
      nombre, 
      apellido, 
      nroDocumento, 
      telefono, 
      direccion, 
      idCiudad, 
      idOrganizacion 
    } = await request.json()

    // 1. Validar que el documento no exista
    const existingDocument = await prisma.persona.findFirst({
      where: { nroDocumento }
    })

    if (existingDocument) {
      return NextResponse.json(
        { error: 'El número de documento ya está registrado' },
        { status: 400 }
      )
    }

    // 2. Crear usuario en Supabase Auth PRIMERO (fuente de verdad)
    const supabaseAdmin = getSupabaseAdmin()
    const { data: authData, error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombreCompleto: `${nombre} ${apellido}`,
        nombre,
        apellido,
        nroDocumento,
        telefono,
        direccion,
        idCiudad,
        idOrganizacion
      }
    })

    if (supabaseError) {
      console.error('Error creando usuario en Supabase Auth:', supabaseError)
      return NextResponse.json(
        { error: supabaseError.message || 'Error creando usuario' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error creando usuario en Supabase' },
        { status: 500 }
      )
    }

    // 3. Crear registros asociados en nuestra BD
    const result = await prisma.$transaction(async (tx) => {
      // Crear persona
      const persona = await tx.persona.create({
        data: {
          nroDocumento,
          nombre,
          apellido,
          direccion: direccion || '',
          nroTelefono: telefono || '',
          correoPersona: email,
          idCiudad: parseInt(idCiudad),
          idTipoDocumento: 1, // CI por defecto
        }
      })

      // Crear usuario
      const usuario = await tx.usuario.create({
        data: {
          nombreUsuario: email.split('@')[0],
          idPersona: persona.idPersona,
          idOrganizacion,
          estadoUsuario: 'ACTIVO'
        }
      })

      // Crear auth user (vinculando con Supabase)
      const authUser = await tx.authUser.create({
        data: {
          email,
          password: '', // Ya no almacenamos contraseña, Supabase es la fuente de verdad
          supabaseId: authData.user.id, // Guardamos el ID de Supabase
          idUsuario: usuario.idUsuario
        }
      })

      return { persona, usuario, authUser }
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        idUsuario: result.usuario.idUsuario,
        nombreUsuario: result.usuario.nombreUsuario,
        email,
        supabaseId: authData.user.id
      }
    })

  } catch (error: any) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
