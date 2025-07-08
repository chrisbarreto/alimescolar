import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { supabaseId, email } = await request.json()

    // Buscar usuario por supabaseId primero, luego por email como fallback
    const authUser = await prisma.authUser.findFirst({
      where: supabaseId ? 
        { supabaseId } : 
        { email },
      include: {
        usuario: {
          include: {
            organizacion: true,
            persona: true
          }
        }
      }
    })

    if (authUser && authUser.usuario) {
      return NextResponse.json({
        hasOrganization: true,
        user: {
          idUsuario: authUser.usuario.idUsuario,
          nombreUsuario: authUser.usuario.nombreUsuario,
          email: authUser.email,
          organizacion: authUser.usuario.organizacion,
          persona: authUser.usuario.persona
        }
      })
    }

    return NextResponse.json({ hasOrganization: false })

  } catch (error) {
    console.error('Error verificando organización:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
