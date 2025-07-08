import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/lib/supabaseClient'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verificar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user?.email) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Buscar usuario en tu BD
    const authUser = await prisma.authUser.findUnique({
      where: { email: user.email },
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
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

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

    return NextResponse.json({ userSession })

  } catch (error: any) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}