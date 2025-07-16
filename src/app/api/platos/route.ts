import { NextRequest, NextResponse } from 'next/server';
import type { 
  CreatePlatoData,
  CreatePorcionData,
  RecetaInsumo
} from '@/lib/services/platoService';

// POST - Crear plato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Datos recibidos:', JSON.stringify(body, null, 2));
    
    // Importación dinámica para las funciones
    const { createPlato, createPlatoCompleto } = await import('@/lib/services/platoService');
    
    // Validar campos requeridos del plato
    const platoInfo = body.plato || body; // Soportar ambas estructuras
    if (!platoInfo.nombre || !platoInfo.idTipoPlato) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Datos del plato (nombre y tipo de plato) son requeridos' 
        },
        { status: 400 }
      );
    }

    const platoData: CreatePlatoData = {
      nombre: platoInfo.nombre,
      descripcion: platoInfo.descripcion,
      esEjemplo: platoInfo.esEjemplo || false,
      idTipoPlato: parseInt(platoInfo.idTipoPlato)
    };

    // Si viene plato completo con porciones y receta
    if (body.porciones || body.receta) {
      const porciones: CreatePorcionData[] = (body.porciones || []).map((p: any) => ({
        idNivelEscolar: p.idNivelEscolar,
        cantidad: parseFloat(p.cantidad),
        observaciones: p.observaciones
      }));

      const receta: RecetaInsumo[] = (body.receta || []).map((r: any) => ({
        idInsumo: r.idInsumo,
        cantidadPorRacion: parseFloat(r.cantidadPorRacion),
        idUnidadMedida: r.idUnidadMedida || 1, // Gramos por defecto
        pesoBruto: r.pesoBruto ? parseFloat(r.pesoBruto) : undefined,
        pesoNeto: r.pesoNeto ? parseFloat(r.pesoNeto) : undefined
      }));

      console.log('Datos procesados:', { platoData, porciones, receta });

      // Crear plato completo con porciones y receta
      const plato = await createPlatoCompleto(platoData, porciones, receta);
      
      return NextResponse.json({
        success: true,
        data: plato,
        message: `Plato "${platoData.nombre}" creado exitosamente con ${receta.length} ingredientes.`
      }, { status: 201 });
    }

    // Solo crear plato básico
    const plato = await createPlato(platoData);
    
    return NextResponse.json({
      success: true,
      data: plato
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/platos:', error);
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        success: false,
        error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

// GET - Obtener platos o insumos según query params
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // Si piden insumos específicamente
    if (action === 'get-insumos') {
      try {
        const { getInsumos } = await import('@/lib/services/platoService');
        const insumosResult = await getInsumos();
        
        if (insumosResult.success) {
          return NextResponse.json({
            success: true,
            insumos: insumosResult.data
          });
        } else {
          return NextResponse.json({
            success: false,
            error: insumosResult.error
          }, { status: 500 });
        }
      } catch (error) {
        console.error('Error getting insumos:', error);
        return NextResponse.json({
          success: false,
          error: 'Error al obtener insumos'
        }, { status: 500 });
      }
    }

    // Por defecto, obtener platos
    try {
      const { getPlatos } = await import('@/lib/services/platoService');
      const platos = await getPlatos();
      
      return NextResponse.json({
        success: true,
        data: platos
      });
    } catch (error) {
      console.error('Error específico en getPlatos:', error);
      return NextResponse.json({
        success: false,
        error: `Error al obtener platos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/platos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: `Error general: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
