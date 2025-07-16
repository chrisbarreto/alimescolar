import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/lib/services/menuService';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Obtener menú semanal completo
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const menuSemanal = await MenuService.getMenuSemanalCompleto(id);
    
    if (!menuSemanal) {
      return NextResponse.json(
        { error: 'Menú semanal no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: menuSemanal
    });
  } catch (error) {
    console.error('Error in GET /api/menu/semanal/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar menú semanal
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const result = await MenuService.deleteMenuSemanal(id);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in DELETE /api/menu/semanal/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
