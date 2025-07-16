import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/lib/services/menuService';
import { getPlatos } from '@/lib/services/platoService';

// GET - Obtener menús semanales, escuelas disponibles, o calcular insumos
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const idEscuela = url.searchParams.get('idEscuela');
    const idMenuSemanal = url.searchParams.get('idMenuSemanal');

    switch (action) {
      case 'escuelas':
        const escuelasResult = await MenuService.getEscuelasDisponibles();
        return NextResponse.json(escuelasResult);

      case 'platos':
        const platos = await getPlatos();
        return NextResponse.json({ success: true, data: platos });

      case 'calcular-insumos':
        if (!idMenuSemanal) {
          return NextResponse.json(
            { success: false, error: 'ID del menú semanal es requerido' },
            { status: 400 }
          );
        }
        const insumosResult = await MenuService.calcularInsumosMenu(idMenuSemanal);
        return NextResponse.json(insumosResult);

      case 'menu-completo':
        if (!idMenuSemanal) {
          return NextResponse.json(
            { success: false, error: 'ID del menú semanal es requerido' },
            { status: 400 }
          );
        }
        const menuCompleto = await MenuService.getMenuSemanalCompleto(idMenuSemanal);
        if (!menuCompleto) {
          return NextResponse.json(
            { success: false, error: 'Menú semanal no encontrado' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: menuCompleto });

      case 'ordenes-compra':
        if (!idEscuela) {
          return NextResponse.json(
            { success: false, error: 'ID de escuela es requerido' },
            { status: 400 }
          );
        }
        const ordenesResult = await MenuService.getOrdenesCompraByEscuela(idEscuela);
        return NextResponse.json(ordenesResult);

      default:
        // Obtener menús por escuela
        if (idEscuela) {
          const menusResult = await MenuService.getMenusSemanalesByEscuela(idEscuela);
          return NextResponse.json(menusResult);
        }

        return NextResponse.json(
          { success: false, error: 'Acción no válida o parámetros faltantes' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in GET /api/menus:', error);
    return NextResponse.json(
      { 
        success: false,
        error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

// POST - Crear menú semanal o generar orden de compra
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    console.log('POST /api/menus - Action:', action);
    console.log('POST /api/menus - Body:', JSON.stringify(body, null, 2));

    switch (action) {
      case 'crear-menu-semanal':
        if (!body.semana || !body.idEscuela || !body.idOrganizacion) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Datos requeridos: semana, idEscuela, idOrganizacion' 
            },
            { status: 400 }
          );
        }

        const menuResult = await MenuService.createMenuSemanal({
          semana: body.semana,
          idEscuela: body.idEscuela,
          idOrganizacion: body.idOrganizacion,
          observaciones: body.observaciones
        });

        return NextResponse.json(menuResult, { 
          status: menuResult.success ? 201 : 400 
        });

      case 'crear-menu-dia':
        if (!body.idMenuSemanal || !body.fecha || !body.cantidadRaciones) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Datos requeridos: idMenuSemanal, fecha, cantidadRaciones' 
            },
            { status: 400 }
          );
        }

        const menuDiaResult = await MenuService.createMenuDia(body.idMenuSemanal, {
          fecha: body.fecha,
          cantidadRaciones: parseInt(body.cantidadRaciones),
          observaciones: body.observaciones
        });

        return NextResponse.json(menuDiaResult, { 
          status: menuDiaResult.success ? 201 : 400 
        });

      case 'agregar-platos':
        if (!body.idMenuDia || !body.platos || !Array.isArray(body.platos)) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Datos requeridos: idMenuDia, platos (array)' 
            },
            { status: 400 }
          );
        }

        const platosResult = await MenuService.addPlatosToMenuDia(
          body.idMenuDia,
          body.platos
        );

        return NextResponse.json(platosResult, { 
          status: platosResult.success ? 201 : 400 
        });

      case 'crear-menu-dia-completo':
        if (!body.idMenuSemanal || !body.menuDia || !body.platos) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Datos requeridos: idMenuSemanal, menuDia, platos' 
            },
            { status: 400 }
          );
        }

        const menuCompletoResult = await MenuService.createMenuDiaWithPlatos(
          body.idMenuSemanal,
          {
            fecha: body.menuDia.fecha,
            cantidadRaciones: parseInt(body.menuDia.cantidadRaciones),
            observaciones: body.menuDia.observaciones
          },
          body.platos
        );

        return NextResponse.json(menuCompletoResult, { 
          status: menuCompletoResult.success ? 201 : 400 
        });

      case 'generar-orden-compra':
        if (!body.idMenuSemanal) {
          return NextResponse.json(
            { 
              success: false,
              error: 'ID del menú semanal es requerido' 
            },
            { status: 400 }
          );
        }

        const ordenResult = await MenuService.generarOrdenCompra(
          body.idMenuSemanal,
          body.observaciones
        );

        return NextResponse.json(ordenResult, { 
          status: ordenResult.success ? 201 : 400 
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in POST /api/menus:', error);
    return NextResponse.json(
      { 
        success: false,
        error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar menú semanal
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idMenuSemanal = url.searchParams.get('idMenuSemanal');

    if (!idMenuSemanal) {
      return NextResponse.json(
        { success: false, error: 'ID del menú semanal es requerido' },
        { status: 400 }
      );
    }

    const result = await MenuService.deleteMenuSemanal(idMenuSemanal);
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error('Error in DELETE /api/menus:', error);
    return NextResponse.json(
      { 
        success: false,
        error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
