import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const insumos = await prisma.insumo.findMany({
      where: { deletedAt: null },
      include: {
        tipoInsumo: true,
        unidadMedida: true
      },
      orderBy: { nombreInsumo: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: insumos.map(insumo => ({
        idInsumo: insumo.idInsumo,
        nombre: insumo.nombreInsumo,
        descripcion: insumo.descripcion,
        idTipoInsumo: insumo.idTipoInsumo,
        tipoInsumo: insumo.tipoInsumo.descTipoInsumo,
        idUnidadMedida: insumo.idUnidadMedida,
        unidadMedida: insumo.unidadMedida.descUnidadMedida,
        abreviatura: insumo.unidadMedida.abreviatura
      }))
    });
  } catch (error) {
    console.error('Error in insumos API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los insumos'
      },
      { status: 500 }
    );
  }
}
