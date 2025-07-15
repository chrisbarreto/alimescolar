import { NextRequest, NextResponse } from 'next/server';
import { 
  createPlato, 
  createPlatoWithPorciones, 
  getPlatos,
  CreatePlatoData,
  CreatePorcionData
} from '@/lib/services/platoService';

// POST - Crear plato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.idTipoPlato || !body.idEscuela) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nombre, tipo de plato y escuela son requeridos' 
        },
        { status: 400 }
      );
    }

    const platoData: CreatePlatoData = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      esEjemplo: body.esEjemplo || false,
      idTipoPlato: parseInt(body.idTipoPlato)
    };

    // Si vienen porciones, crear plato completo
    if (body.porciones && Array.isArray(body.porciones)) {
      const porciones: CreatePorcionData[] = body.porciones.map((p: any) => ({
        idNivelEscolar: p.idNivelEscolar,
        cantidad: parseFloat(p.cantidad),
        idUnidadMedida: p.idUnidadMedida,
        observaciones: p.observaciones
      }));

      const plato = await createPlatoWithPorciones(platoData, porciones);
      
      return NextResponse.json({
        success: true,
        data: plato
      }, { status: 201 });
    }

    // Solo crear plato
    const plato = await createPlato(platoData);
    
    return NextResponse.json({
      success: true,
      data: plato
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/platos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los platos
export async function GET(request: NextRequest) {
  try {
    const platos = await getPlatos();
    
    return NextResponse.json({
      success: true,
      data: platos
    });
  } catch (error) {
    console.error('Error in GET /api/platos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al obtener los platos' 
      },
      { status: 500 }
    );
  }
}
