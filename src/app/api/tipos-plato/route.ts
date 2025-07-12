import { NextRequest, NextResponse } from 'next/server';
import { getTiposPlato } from '@/lib/services/platoService';

export async function GET(request: NextRequest) {
  try {
    const tipos = await getTiposPlato();
    
    return NextResponse.json({
      success: true,
      data: tipos
    });
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
