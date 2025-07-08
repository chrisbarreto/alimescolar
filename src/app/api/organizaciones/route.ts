import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const organizaciones = await prisma.organizacion.findMany({
      select: {
        idOrganizacion: true,
        razonSocial: true
      },
      orderBy: {
        razonSocial: 'asc'
      }
    })

    return NextResponse.json(organizaciones)
  } catch (error) {
    console.error('Error obteniendo organizaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
