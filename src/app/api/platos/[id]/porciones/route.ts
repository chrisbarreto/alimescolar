import { NextRequest, NextResponse } from 'next/server';
import { createPorcion, getPorcionesByPlato } from '@/lib/services/platoService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST - Agregar porciones a un plato
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Validar que sea un array de porciones
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de porciones' },
        { status: 400 }
      );
    }

    // Validar cada porción
    for (const porcion of body) {
      if (!porcion.idNivelEscolar || !porcion.cantidad || !porcion.idUnidadMedida) {
        return NextResponse.json(
          { error: 'Cada porción debe tener idNivelEscolar, cantidad e idUnidadMedida' },
          { status: 400 }
        );
      }
    }

    // Crear cada porción individualmente
    const porcionesCreadas = [];
    for (const porcionData of body) {
      try {
        const porcion = await createPorcion(id, porcionData);
        porcionesCreadas.push(porcion);
      } catch (error) {
        console.error('Error creando porción:', error);
        return NextResponse.json(
          { error: 'Error al crear una de las porciones' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      data: porcionesCreadas,
      message: `${porcionesCreadas.length} porciones agregadas exitosamente`
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/platos/[id]/porciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener porciones de un plato
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const porciones = await getPorcionesByPlato(id);
    
    return NextResponse.json({
      success: true,
      data: porciones
    });
  } catch (error) {
    console.error('Error in GET /api/platos/[id]/porciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
