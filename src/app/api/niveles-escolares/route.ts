import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los niveles escolares
export async function GET(request: NextRequest) {
  try {
    const niveles = await prisma.nivelEscolar.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: niveles,
      count: niveles.length
    });
  } catch (error) {
    console.error('Error in GET /api/niveles-escolares:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
