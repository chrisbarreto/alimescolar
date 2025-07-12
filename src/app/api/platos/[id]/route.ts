import { NextRequest, NextResponse } from 'next/server';
import { getPlatoById, createPorcion } from '@/lib/services/platoService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Obtener plato específico con porciones
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const plato = await getPlatoById(id);
    
    if (!plato) {
      return NextResponse.json(
        { error: 'Plato no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: plato
    });
  } catch (error) {
    console.error('Error in GET /api/platos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar plato (no implementado aún)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    return NextResponse.json(
      { error: 'Funcionalidad de actualización no implementada aún' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error in PUT /api/platos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar plato (no implementado aún)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    return NextResponse.json(
      { error: 'Funcionalidad de eliminación no implementada aún' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/platos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
