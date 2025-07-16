import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todas las unidades de medida
export async function GET(request: NextRequest) {
  try {
    const unidades = await prisma.unidadMedida.findMany({
      where: { deletedAt: null },
      orderBy: { descUnidadMedida: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: unidades,
      count: unidades.length
    });
  } catch (error) {
    console.error('Error in GET /api/unidades-medida:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
