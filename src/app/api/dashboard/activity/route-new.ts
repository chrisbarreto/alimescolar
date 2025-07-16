import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyJWT } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = await verifyJWT(token)
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Obtener el usuario para conocer su organización
    const user = await prisma.usuario.findUnique({
      where: { idUsuario: decoded.userId },
      include: { organizacion: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener datos de actividad reciente
    const [menusRecientes, usuariosRecientes] = await Promise.all([
      // Menús recientes
      prisma.menuSemanal.findMany({
        where: {
          idOrganizacion: user.idOrganizacion
        },
        include: {
          escuela: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),

      // Usuarios recientes
      prisma.usuario.findMany({
        where: {
          idOrganizacion: user.idOrganizacion
        },
        include: {
          persona: {
            select: {
              nombre: true,
              apellido: true,
              correoPersona: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ])

    // Formatear datos para respuesta
    const activity = {
      menus: menusRecientes.map(menu => ({
        id: menu.idMenuSemanal,
        titulo: `Menú para ${menu.escuela.nombre}`,
        descripcion: `Semana del ${menu.semana.toLocaleDateString()}`,
        fecha: menu.createdAt,
        tipo: 'menu'
      })),
      productos: [], // Temporalmente vacío - los insumos ya no tienen relación con organización
      usuarios: usuariosRecientes.map(usuario => ({
        id: usuario.idUsuario,
        titulo: `${usuario.persona.nombre} ${usuario.persona.apellido}`,
        descripcion: usuario.persona.correoPersona,
        fecha: usuario.createdAt,
        tipo: 'usuario'
      })),
      ordenes: [] // Temporalmente vacío
    }

    return NextResponse.json({
      success: true,
      data: activity
    })

  } catch (error) {
    console.error('Error in GET /api/dashboard/activity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
