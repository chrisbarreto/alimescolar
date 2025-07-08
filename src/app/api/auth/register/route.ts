import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabaseClient'

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

    // 1. Validar que el email no exista
    const existingUser = await prisma.authUser.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // 2. Validar que el documento no exista
    const existingDocument = await prisma.persona.findFirst({
      where: { nroDocumento }
    })

    if (existingDocument) {
      return NextResponse.json(
        { error: 'El número de documento ya está registrado' },
        { status: 400 }
      )
    }

    // 3. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Crear en nuestra BD primero (transacción)
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

      // Crear auth user
      const authUser = await tx.authUser.create({
        data: {
          email,
          password: hashedPassword,
          idUsuario: usuario.idUsuario
        }
      })

      return { persona, usuario, authUser }
    })

    // 5. Crear en Supabase Auth (opcional - se puede crear en el primer login)
    try {
      const { error: supabaseError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          idUsuario: result.usuario.idUsuario,
          nombreUsuario: result.usuario.nombreUsuario,
          nombreCompleto: `${nombre} ${apellido}`
        }
      })

      if (supabaseError) {
        console.warn('Error creando en Supabase Auth:', supabaseError)
        // No fallar aquí, se creará en el primer login
      }
    } catch (supabaseError) {
      console.warn('Error con Supabase Auth:', supabaseError)
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        idUsuario: result.usuario.idUsuario,
        nombreUsuario: result.usuario.nombreUsuario,
        email
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
