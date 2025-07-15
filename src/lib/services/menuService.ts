import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMenuSemanalData {
  semana: string; // Formato: 'YYYY-MM-DD'
  idEscuela: string;
  idOrganizacion: string;
  observaciones?: string;
}

export interface CreateMenuDiaData {
  fecha: string; // Formato: 'YYYY-MM-DD'
  cantidadRaciones: number;
  observaciones?: string;
}

export interface MenuDiaPlatoData {
  idPlato: string;
  orden?: number;
  racionesPorNivel?: {
    [nivelEscolar: string]: number; // ej: { "INICIAL": 50, "PRIMER_SEGUNDO_CICLO": 100 }
  };
}

export interface MenuSemanalCompleto {
  idMenuSemanal: string;
  semana: string;
  observaciones?: string;
  escuela: {
    idEscuela: string;
    nombre: string;
  };
  organizacion: {
    idOrganizacion: string;
    razonSocial: string;
  };
  menuDias: {
    idMenuDia: string;
    fecha: string;
    cantidadRaciones: number;
    observaciones?: string;
    platos: {
      idPlato: string;
      nombre: string;
      tipo?: string;
      orden: number;
      porciones: {
        nivelEscolar: string;
        cantidad: number;
        unidadMedida: string;
      }[];
    }[];
  }[];
}

export class MenuService {
  
  /**
   * Crear menú semanal
   */
  static async createMenuSemanal(data: CreateMenuSemanalData) {
    try {
      // Verificar que no exista un menú para esa semana y escuela
      const existingMenu = await prisma.menuSemanal.findFirst({
        where: {
          semana: new Date(data.semana),
          idEscuela: data.idEscuela
        }
      });

      if (existingMenu) {
        return {
          success: false,
          error: 'Ya existe un menú para esta semana y escuela'
        };
      }

      const menuSemanal = await prisma.menuSemanal.create({
        data: {
          semana: new Date(data.semana),
          idEscuela: data.idEscuela,
          idOrganizacion: data.idOrganizacion,
          observaciones: data.observaciones
        },
        include: {
          escuela: {
            select: {
              idEscuela: true,
              nombre: true
            }
          },
          organizacion: {
            select: {
              idOrganizacion: true,
              razonSocial: true
            }
          }
        }
      });

      return {
        success: true,
        data: menuSemanal,
        message: 'Menú semanal creado exitosamente'
      };
    } catch (error) {
      console.error('Error creating menu semanal:', error);
      return {
        success: false,
        error: 'Error al crear el menú semanal',
        details: error
      };
    }
  }

  /**
   * Crear menú diario
   */
  static async createMenuDia(idMenuSemanal: string, data: CreateMenuDiaData) {
    try {
      // Verificar que el menú semanal existe
      const menuSemanal = await prisma.menuSemanal.findUnique({
        where: { idMenuSemanal }
      });

      if (!menuSemanal) {
        return {
          success: false,
          error: 'Menú semanal no encontrado'
        };
      }

      // Verificar que no exista un menú para esa fecha en el menú semanal
      const existingMenuDia = await prisma.menuDia.findFirst({
        where: {
          idMenuSemanal,
          fecha: new Date(data.fecha)
        }
      });

      if (existingMenuDia) {
        return {
          success: false,
          error: 'Ya existe un menú para esta fecha'
        };
      }

      const menuDia = await prisma.menuDia.create({
        data: {
          idMenuSemanal,
          fecha: new Date(data.fecha),
          cantidadRaciones: data.cantidadRaciones,
          observaciones: data.observaciones
        }
      });

      return {
        success: true,
        data: menuDia,
        message: 'Menú diario creado exitosamente'
      };
    } catch (error) {
      console.error('Error creating menu dia:', error);
      return {
        success: false,
        error: 'Error al crear el menú diario',
        details: error
      };
    }
  }

  /**
   * Agregar platos a un menú diario
   */
  static async addPlatosToMenuDia(idMenuDia: string, platos: MenuDiaPlatoData[]) {
    try {
      // Verificar que el menú día existe
      const menuDia = await prisma.menuDia.findUnique({
        where: { idMenuDia }
      });

      if (!menuDia) {
        return {
          success: false,
          error: 'Menú diario no encontrado'
        };
      }

      // Crear los platos del menú día
      const platosCreados = await Promise.all(
        platos.map((platoData, index) => 
          prisma.menuDiaPlato.create({
            data: {
              idMenuDia,
              idPlato: platoData.idPlato,
              orden: platoData.orden || index + 1
            },
            include: {
              plato: {
                include: {
                  porciones: {
                    include: {
                      nivelEscolar: true,
                      unidadMedida: true
                    }
                  }
                }
              }
            }
          })
        )
      );

      return {
        success: true,
        data: platosCreados,
        message: `${platosCreados.length} platos agregados al menú diario`
      };
    } catch (error) {
      console.error('Error adding platos to menu dia:', error);
      return {
        success: false,
        error: 'Error al agregar platos al menú diario',
        details: error
      };
    }
  }

  /**
   * Crear menú diario completo con platos
   */
  static async createMenuDiaWithPlatos(
    idMenuSemanal: string,
    menuDiaData: CreateMenuDiaData,
    platos: MenuDiaPlatoData[]
  ) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear el menú día
        const menuDia = await tx.menuDia.create({
          data: {
            idMenuSemanal,
            fecha: new Date(menuDiaData.fecha),
            cantidadRaciones: menuDiaData.cantidadRaciones,
            observaciones: menuDiaData.observaciones
          }
        });

        // Crear los platos del menú día
        const platosCreados = await Promise.all(
          platos.map((platoData, index) => 
            tx.menuDiaPlato.create({
              data: {
                idMenuDia: menuDia.idMenuDia,
                idPlato: platoData.idPlato,
                orden: platoData.orden || index + 1
              },
              include: {
                plato: {
                  include: {
                    porciones: {
                      include: {
                        nivelEscolar: true,
                        unidadMedida: true
                      }
                    }
                  }
                }
              }
            })
          )
        );

        return {
          menuDia,
          platos: platosCreados
        };
      });

      return {
        success: true,
        data: result,
        message: 'Menú diario con platos creado exitosamente'
      };
    } catch (error) {
      console.error('Error creating menu dia with platos:', error);
      return {
        success: false,
        error: 'Error al crear el menú diario con platos',
        details: error
      };
    }
  }

  /**
   * Obtener menú semanal completo
   */
  static async getMenuSemanalCompleto(idMenuSemanal: string): Promise<MenuSemanalCompleto | null> {
    try {
      const menuSemanal = await prisma.menuSemanal.findUnique({
        where: { idMenuSemanal },
        include: {
          escuela: {
            select: {
              idEscuela: true,
              nombre: true
            }
          },
          organizacion: {
            select: {
              idOrganizacion: true,
              razonSocial: true
            }
          },
          menuDia: {
            include: {
              menuDiaPlato: {
                include: {
                  plato: {
                    include: {
                      tipoPlato: true,
                      porciones: {
                        include: {
                          nivelEscolar: true,
                          unidadMedida: true
                        }
                      }
                    }
                  }
                },
                orderBy: {
                  orden: 'asc'
                }
              }
            },
            orderBy: {
              fecha: 'asc'
            }
          }
        }
      });

      if (!menuSemanal) return null;

      return {
        idMenuSemanal: menuSemanal.idMenuSemanal,
        semana: menuSemanal.semana.toISOString().split('T')[0],
        observaciones: menuSemanal.observaciones || undefined,
        escuela: {
          idEscuela: menuSemanal.escuela.idEscuela,
          nombre: menuSemanal.escuela.nombre
        },
        organizacion: {
          idOrganizacion: menuSemanal.organizacion.idOrganizacion,
          razonSocial: menuSemanal.organizacion.razonSocial
        },
        menuDias: menuSemanal.menuDia.map(dia => ({
          idMenuDia: dia.idMenuDia,
          fecha: dia.fecha.toISOString().split('T')[0],
          cantidadRaciones: dia.cantidadRaciones,
          observaciones: dia.observaciones || undefined,
          platos: dia.menuDiaPlato.map(menuPlato => ({
            idPlato: menuPlato.plato.idPlato,
            nombre: menuPlato.plato.nombre,
            tipo: menuPlato.plato.tipoPlato.nombre,
            orden: menuPlato.orden || 1,
            porciones: menuPlato.plato.porciones.map(porcion => ({
              nivelEscolar: porcion.nivelEscolar.nombre,
              cantidad: Number(porcion.cantidad),
              unidadMedida: porcion.unidadMedida.abreviatura
            }))
          }))
        }))
      };
    } catch (error) {
      console.error('Error getting menu semanal completo:', error);
      return null;
    }
  }

  /**
   * Obtener menús semanales por escuela
   */
  static async getMenusSemanalesByEscuela(idEscuela: string) {
    try {
      const menus = await prisma.menuSemanal.findMany({
        where: { idEscuela },
        include: {
          escuela: {
            select: {
              idEscuela: true,
              nombre: true
            }
          },
          organizacion: {
            select: {
              idOrganizacion: true,
              razonSocial: true
            }
          },
          menuDia: {
            select: {
              idMenuDia: true,
              fecha: true,
              cantidadRaciones: true,
              observaciones: true,
              _count: {
                select: {
                  menuDiaPlato: true
                }
              }
            },
            orderBy: {
              fecha: 'asc'
            }
          }
        },
        orderBy: {
          semana: 'desc'
        }
      });

      // Mapear menuDia a menuDias para consistencia con el frontend
      const mappedMenus = menus.map(menu => ({
        ...menu,
        menuDias: menu.menuDia, // Mapear menuDia (Prisma) a menuDias (Frontend)
        menuDia: undefined // Eliminar la propiedad original
      }));

      return {
        success: true,
        data: mappedMenus,
        count: mappedMenus.length
      };
    } catch (error) {
      console.error('Error getting menus semanales by escuela:', error);
      return {
        success: false,
        error: 'Error al obtener los menús semanales',
        details: error
      };
    }
  }

  /**
   * Eliminar menú semanal
   */
  static async deleteMenuSemanal(idMenuSemanal: string) {
    try {
      await prisma.menuSemanal.delete({
        where: { idMenuSemanal }
      });

      return {
        success: true,
        message: 'Menú semanal eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error deleting menu semanal:', error);
      return {
        success: false,
        error: 'Error al eliminar el menú semanal',
        details: error
      };
    }
  }

  /**
   * Calcular los insumos necesarios para un menú semanal
   */
  static async calcularInsumosMenu(idMenuSemanal: string) {
    try {
      const menu = await prisma.menuSemanal.findUnique({
        where: { idMenuSemanal },
        include: {
          menuDia: {
            include: {
              menuDiaPlato: {
                include: {
                  plato: {
                    include: {
                      recetaPlato: {
                        include: {
                          insumo: {
                            include: {
                              tipoInsumo: true,
                              unidadMedida: true
                            }
                          },
                          unidadMedida: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!menu) {
        return {
          success: false,
          error: 'Menú semanal no encontrado'
        };
      }

      const insumosCalculados = new Map();

      // Procesar cada día del menú
      for (const dia of menu.menuDia) {
        for (const menuPlato of dia.menuDiaPlato) {
          const plato = menuPlato.plato;
          
          // Procesar cada ingrediente del plato
          for (const receta of plato.recetaPlato) {
            const insumo = receta.insumo;
            const cantidadPorRacion = Number(receta.cantidadPorRacion);
            const cantidadTotal = cantidadPorRacion * dia.cantidadRaciones;

            if (!insumosCalculados.has(insumo.idInsumo)) {
              insumosCalculados.set(insumo.idInsumo, {
                idInsumo: insumo.idInsumo,
                nombreInsumo: insumo.nombreInsumo,
                cantidadTotal: 0,
                idUnidadMedida: receta.idUnidadMedida,
                unidadMedida: receta.unidadMedida.descUnidadMedida,
                abreviatura: receta.unidadMedida.abreviatura,
                tipoInsumo: insumo.tipoInsumo.descTipoInsumo,
                detallesPorDia: []
              });
            }

            const insumoData = insumosCalculados.get(insumo.idInsumo);
            insumoData.cantidadTotal += cantidadTotal;

            // Buscar si ya existe un detalle para esta fecha
            let detalleDia = insumoData.detallesPorDia.find((d: any) => d.fecha === dia.fecha.toISOString().split('T')[0]);
            
            if (!detalleDia) {
              detalleDia = {
                fecha: dia.fecha.toISOString().split('T')[0],
                cantidadRaciones: dia.cantidadRaciones,
                cantidadInsumo: 0,
                platos: []
              };
              insumoData.detallesPorDia.push(detalleDia);
            }

            detalleDia.cantidadInsumo += cantidadTotal;
            if (!detalleDia.platos.includes(plato.nombre)) {
              detalleDia.platos.push(plato.nombre);
            }
          }
        }
      }

      return {
        success: true,
        data: {
          idMenuSemanal,
          totalInsumos: insumosCalculados.size,
          insumos: Array.from(insumosCalculados.values())
        }
      };
    } catch (error) {
      console.error('Error calculating insumos for menu:', error);
      return {
        success: false,
        error: 'Error al calcular los insumos del menú',
        details: error
      };
    }
  }

  /**
   * Generar orden de compra a partir de un menú semanal
   */
  static async generarOrdenCompra(idMenuSemanal: string, observaciones?: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Verificar que el menú existe
        const menu = await tx.menuSemanal.findUnique({
          where: { idMenuSemanal },
          select: {
            idEscuela: true,
            escuela: {
              select: {
                nombre: true
              }
            }
          }
        });

        if (!menu) {
          throw new Error('Menú semanal no encontrado');
        }

        // 2. Verificar si ya existe una orden de compra para este menú
        const existingOrden = await tx.ordenCompra.findFirst({
          where: { idMenuSemanal }
        });

        if (existingOrden) {
          throw new Error('Ya existe una orden de compra para este menú semanal');
        }

        // 3. Calcular los insumos
        const insumosResult = await this.calcularInsumosMenu(idMenuSemanal);
        
        if (!insumosResult.success) {
          throw new Error(insumosResult.error);
        }

        const insumos = insumosResult.data!.insumos;

        // 4. Crear la orden de compra
        const ordenCompra = await tx.ordenCompra.create({
          data: {
            idMenuSemanal,
            idEscuela: menu.idEscuela,
            fechaOrden: new Date(),
            estado: 'PENDIENTE',
            observaciones
          }
        });

        // 5. Crear los detalles de la orden
        await Promise.all(
          insumos.map((insumo: any) =>
            tx.ordenCompraDetalle.create({
              data: {
                idOrdenCompra: ordenCompra.idOrdenCompra,
                idInsumo: insumo.idInsumo,
                cantidad: insumo.cantidadTotal,
                idUnidadMedida: insumo.idUnidadMedida
              }
            })
          )
        );

        return {
          success: true,
          data: {
            idOrdenCompra: ordenCompra.idOrdenCompra,
            idMenuSemanal: ordenCompra.idMenuSemanal,
            escuela: menu.escuela.nombre,
            fechaOrden: ordenCompra.fechaOrden.toISOString().split('T')[0],
            estado: ordenCompra.estado || 'PENDIENTE',
            observaciones: ordenCompra.observaciones || undefined,
            totalInsumos: insumos.length,
            detalles: insumos.map((insumo: any) => ({
              idInsumo: insumo.idInsumo,
              nombreInsumo: insumo.nombreInsumo,
              cantidad: Number(insumo.cantidadTotal.toFixed(3)),
              unidadMedida: insumo.unidadMedida,
              abreviatura: insumo.abreviatura,
              tipoInsumo: insumo.tipoInsumo
            }))
          },
          message: `Orden de compra generada con ${insumos.length} insumos`
        };
      });
    } catch (error) {
      console.error('Error generating orden de compra:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar la orden de compra',
        details: error
      };
    }
  }

  /**
   * Obtener escuelas disponibles para crear menús
   */
  static async getEscuelasDisponibles() {
    try {
      const escuelas = await prisma.escuela.findMany({
        include: {
          ciudad: {
            select: {
              nombreCiudad: true
            }
          },
          organizacion: {
            select: {
              idOrganizacion: true,
              razonSocial: true
            }
          }
        },
        orderBy: {
          nombre: 'asc'
        }
      });

      return {
        success: true,
        data: escuelas.map(escuela => ({
          idEscuela: escuela.idEscuela,
          nombre: escuela.nombre,
          direccion: escuela.direccion,
          ciudad: escuela.ciudad?.nombreCiudad,
          organizacion: {
            idOrganizacion: escuela.organizacion.idOrganizacion,
            nombre: escuela.organizacion.razonSocial
          }
        }))
      };
    } catch (error) {
      console.error('Error fetching escuelas:', error);
      return {
        success: false,
        error: 'Error al obtener las escuelas',
        details: error
      };
    }
  }

  /**
   * Obtener órdenes de compra por escuela
   */
  static async getOrdenesCompraByEscuela(idEscuela: string) {
    try {
      const ordenes = await prisma.ordenCompra.findMany({
        where: { idEscuela },
        include: {
          menuSemanal: {
            select: {
              semana: true,
              observaciones: true
            }
          },
          escuela: {
            select: {
              nombre: true
            }
          },
          ordenCompraDetalle: {
            include: {
              insumo: {
                include: {
                  tipoInsumo: true,
                  unidadMedida: true
                }
              }
            }
          }
        },
        orderBy: {
          fechaOrden: 'desc'
        }
      });

      return {
        success: true,
        data: ordenes.map(orden => ({
          idOrdenCompra: orden.idOrdenCompra,
          idMenuSemanal: orden.idMenuSemanal,
          semanaMenu: orden.menuSemanal?.semana?.toISOString().split('T')[0],
          escuela: orden.escuela.nombre,
          fechaOrden: orden.fechaOrden.toISOString().split('T')[0],
          estado: orden.estado,
          observaciones: orden.observaciones,
          totalItems: orden.ordenCompraDetalle.length,
          totalInsumos: orden.ordenCompraDetalle.reduce((sum, detalle) => sum + Number(detalle.cantidad), 0)
        }))
      };
    } catch (error) {
      console.error('Error getting ordenes de compra:', error);
      return {
        success: false,
        error: 'Error al obtener las órdenes de compra',
        details: error
      };
    }
  }

}
