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
              _count: {
                select: {
                  menuDiaPlato: true
                }
              }
            }
          }
        },
        orderBy: {
          semana: 'desc'
        }
      });

      return {
        success: true,
        data: menus,
        count: menus.length
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
}
