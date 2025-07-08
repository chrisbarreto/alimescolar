import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { supabaseId, email, nombre, apellido, organizacionId } = await request.json()

    // Verificar si ya existe un usuario con este email
    const existingUser = await prisma.authUser.findUnique({
      where: { email },
      include: {
        usuario: {
          include: {
            organizacion: true,
            persona: true
          }
        }
      }
    })

    if (existingUser) {
      // Si el usuario ya existe pero no tiene supabaseId, lo actualizamos
      if (!existingUser.supabaseId && supabaseId) {
        const updatedUser = await prisma.authUser.update({
          where: { email },
          data: { supabaseId },
          include: {
            usuario: {
              include: {
                organizacion: true,
                persona: true
              }
            }
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Usuario actualizado con Google OAuth',
          user: {
            idUsuario: updatedUser.usuario.idUsuario,
            nombreUsuario: updatedUser.usuario.nombreUsuario,
            email: updatedUser.email,
            organizacion: updatedUser.usuario.organizacion,
            persona: updatedUser.usuario.persona
          }
        })
      }
      
      // Si el usuario ya existe y ya tiene supabaseId, es un error
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Crear el usuario completo en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear persona
      const persona = await tx.persona.create({
        data: {
          nroDocumento: `GOOGLE_${Date.now()}`, // Documento temporal para usuarios de Google
          nombre,
          apellido,
          direccion: '',
          nroTelefono: '',
          correoPersona: email,
          idCiudad: 1, // Asunción por defecto
          idTipoDocumento: 1, // CI por defecto
        }
      })

      // Crear usuario
      const usuario = await tx.usuario.create({
        data: {
          nombreUsuario: email.split('@')[0],
          idPersona: persona.idPersona,
          idOrganizacion: organizacionId,
          estadoUsuario: 'ACTIVO'
        },
        include: {
          organizacion: true
        }
      })

      // Crear auth user
      const authUser = await tx.authUser.create({
        data: {
          email,
          password: '', // No se usa contraseña para usuarios de Google
          supabaseId, // Guardar el supabaseId
          idUsuario: usuario.idUsuario
        }
      })

      return { persona, usuario, authUser }
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        idUsuario: result.usuario.idUsuario,
        nombreUsuario: result.usuario.nombreUsuario,
        email: result.authUser.email
      },
      userSession: {
        idUsuario: result.usuario.idUsuario,
        nombreUsuario: result.usuario.nombreUsuario,
        email: result.authUser.email,
        persona: {
          nombre: result.persona.nombre,
          apellido: result.persona.apellido,
          correoPersona: result.persona.correoPersona
        },
        organizacion: {
          idOrganizacion: result.usuario.idOrganizacion,
          razonSocial: result.usuario.organizacion.razonSocial
        }
      }
    })

  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
