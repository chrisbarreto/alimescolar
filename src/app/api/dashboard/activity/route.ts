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

    // Obtener actividad reciente (últimos 10 items)
    const [
      menusRecientes,
      productosRecientes,
      usuariosRecientes,
      ordenesRecientes
    ] = await Promise.all([
      // Menús semanales recientes
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
      
      // Productos recientes
      prisma.insumo.findMany({
        where: {
          idOrganizacion: user.idOrganizacion
        },
        include: {
          tipoInsumo: {
            select: {
              descTipoInsumo: true
            }
          },
          unidadMedida: {
            select: {
              descUnidadMedida: true,
              abreviatura: true
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
      }),
      
      // Órdenes de compra recientes
      prisma.ordenCompra.findMany({
        where: {
          escuela: {
            idOrganizacion: user.idOrganizacion
          }
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
      productos: productosRecientes.map(producto => ({
        id: producto.idInsumo,
        titulo: producto.nombreInsumo,
        descripcion: `${producto.tipoInsumo.descTipoInsumo} - ${producto.unidadMedida.abreviatura}`,
        fecha: producto.createdAt,
        tipo: 'producto'
      })),
      usuarios: usuariosRecientes.map(usuario => ({
        id: usuario.idUsuario,
        titulo: `${usuario.persona.nombre} ${usuario.persona.apellido}`,
        descripcion: usuario.persona.correoPersona,
        fecha: usuario.createdAt,
        tipo: 'usuario'
      })),
      ordenes: ordenesRecientes.map(orden => ({
        id: orden.idOrdenCompra,
        titulo: `Orden #${orden.idOrdenCompra.slice(0, 8)}`,
        descripcion: `${orden.escuela.nombre} - ${orden.estado}`,
        fecha: orden.createdAt,
        tipo: 'orden'
      }))
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error obteniendo actividad:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
