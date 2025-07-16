import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const tipos = await prisma.tipoPlato.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' }
    });

    const response = {
      success: true,
      data: tipos.map(tipo => ({
        idTipoPlato: tipo.idTipoPlato,
        nombre: tipo.nombre,
        descripcion: tipo.descripcion || undefined,
        orden: tipo.orden
      }))
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in tipos-plato API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los tipos de plato'
      },
      { status: 500 }
    );
  }
}
