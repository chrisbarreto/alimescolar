import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const ciudades = await prisma.ciudad.findMany({
      select: {
        idCiudad: true,
        nombreCiudad: true
      },
      orderBy: {
        nombreCiudad: 'asc'
      }
    })

    return NextResponse.json(ciudades)
  } catch (error) {
    console.error('Error obteniendo ciudades:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
