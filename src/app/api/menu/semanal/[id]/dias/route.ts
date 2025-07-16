import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/lib/services/menuService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST - Crear menú diario
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.fecha || !body.cantidadRaciones) {
      return NextResponse.json(
        { error: 'Fecha y cantidad de raciones son requeridos' },
        { status: 400 }
      );
    }

    // Si vienen platos, crear menú día completo
    if (body.platos && Array.isArray(body.platos)) {
      const { platos, ...menuDiaData } = body;
      const result = await MenuService.createMenuDiaWithPlatos(id, menuDiaData, platos);
      
      if (result.success) {
        return NextResponse.json(result, { status: 201 });
      } else {
        return NextResponse.json(result, { status: 400 });
      }
    }

    // Solo crear menú día
    const result = await MenuService.createMenuDia(id, body);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/menu/semanal/[id]/dias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
