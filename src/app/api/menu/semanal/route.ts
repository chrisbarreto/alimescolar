import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/lib/services/menuService';

// POST - Crear menú semanal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.semana || !body.idEscuela || !body.idOrganizacion) {
      return NextResponse.json(
        { error: 'Semana, escuela y organización son requeridos' },
        { status: 400 }
      );
    }

    const result = await MenuService.createMenuSemanal(body);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/menu/semanal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener menús semanales por escuela
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idEscuela = searchParams.get('idEscuela');

    if (!idEscuela) {
      return NextResponse.json(
        { error: 'ID de escuela requerido' },
        { status: 400 }
      );
    }

    const result = await MenuService.getMenusSemanalesByEscuela(idEscuela);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET /api/menu/semanal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
