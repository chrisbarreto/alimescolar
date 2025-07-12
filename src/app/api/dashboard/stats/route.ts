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

    // Obtener estadísticas
    const [
      menusActivos,
      totalProductos,
      totalUsuarios
    ] = await Promise.all([
      // Menús activos (menús semanales creados en los últimos 30 días)
      prisma.menuSemanal.count({
        where: {
          idOrganizacion: user.idOrganizacion,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 días
          }
        }
      }),
      
      // Total de productos/insumos - temporalmente 0 ya que no hay relación con organización
      Promise.resolve(0),
      
      // Total de usuarios en la organización
      prisma.usuario.count({
        where: {
          idOrganizacion: user.idOrganizacion
        }
      })
    ])

    // Obtener datos para comparaciones (cambios desde ayer, etc.)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const [
      menusAyer,
      usuariosEstesMes
    ] = await Promise.all([
      // Menús creados ayer
      prisma.menuSemanal.count({
        where: {
          idOrganizacion: user.idOrganizacion,
          createdAt: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Usuarios nuevos este mes
      prisma.usuario.count({
        where: {
          idOrganizacion: user.idOrganizacion,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    // Productos recientes - temporalmente 0 ya que no hay relación con organización
    const productosRecientes = 0

    // Organizaciones nuevas (últimos 30 días) - removido ya que no se usa

    const stats = {
      menusActivos: {
        count: menusActivos,
        cambio: menusAyer,
        tipo: 'desde ayer'
      },
      productos: {
        count: totalProductos,
        nuevos: productosRecientes,
        tipo: 'nuevos'
      },
      usuarios: {
        count: totalUsuarios,
        nuevos: usuariosEstesMes,
        tipo: 'este mes'
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
