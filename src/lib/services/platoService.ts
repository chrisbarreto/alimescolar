import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePlatoData {
  nombre: string;
  descripcion?: string;
  esEjemplo?: boolean;
  idTipoPlato: number;
  idEscuela: string;
}

export interface CreatePorcionData {
  idNivelEscolar: number;
  cantidad: number;
  idUnidadMedida: number;
  observaciones?: string;
}

export interface PlatoWithPorciones {
  idPlato: string;
  nombre: string;
  descripcion?: string;
  esEjemplo: boolean;
  idTipoPlato: number;
  idEscuela: string;
  createdAt?: Date;
  updatedAt?: Date;
  tipoPlato: {
    idTipoPlato: number;
    nombre: string;
    descripcion?: string;
    orden: number;
  };
  escuela: {
    idEscuela: string;
    nombre: string;
  };
  porciones: {
    idPorcion: string;
    cantidad: number;
    observaciones?: string;
    nivelEscolar: {
      idNivelEscolar: number;
      nombre: string;
      descripcion?: string;
      orden: number;
    };
    unidadMedida: {
      idUnidadMedida: number;
      descUnidadMedida: string;
      abreviatura: string;
    };
  }[];
}

// Crear un plato
export async function createPlato(data: CreatePlatoData): Promise<PlatoWithPorciones> {
  try {
    const plato = await prisma.plato.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        esEjemplo: data.esEjemplo || false,
        idTipoPlato: data.idTipoPlato,
        idEscuela: data.idEscuela
      },
      include: {
        tipoPlato: true,
        escuela: {
          select: {
            idEscuela: true,
            nombre: true
          }
        },
        porciones: {
          include: {
            nivelEscolar: true,
            unidadMedida: true
          },
          orderBy: {
            nivelEscolar: {
              orden: 'asc'
            }
          }
        }
      }
    });

    return mapPlatoToResponse(plato);
  } catch (error) {
    console.error('Error creating plato:', error);
    throw new Error('Error al crear el plato');
  }
}

// Obtener todos los platos
export async function getPlatos(): Promise<PlatoWithPorciones[]> {
  try {
    const platos = await prisma.plato.findMany({
      include: {
        tipoPlato: true,
        escuela: {
          select: {
            idEscuela: true,
            nombre: true
          }
        },
        porciones: {
          include: {
            nivelEscolar: true,
            unidadMedida: true
          },
          orderBy: {
            nivelEscolar: {
              orden: 'asc'
            }
          }
        }
      },
      orderBy: [
        { tipoPlato: { orden: 'asc' } },
        { nombre: 'asc' }
      ]
    });

    return platos.map(mapPlatoToResponse);
  } catch (error) {
    console.error('Error fetching platos:', error);
    throw new Error('Error al obtener los platos');
  }
}

// Obtener un plato por ID
export async function getPlatoById(idPlato: string): Promise<PlatoWithPorciones | null> {
  try {
    const plato = await prisma.plato.findUnique({
      where: { idPlato },
      include: {
        tipoPlato: true,
        escuela: {
          select: {
            idEscuela: true,
            nombre: true
          }
        },
        porciones: {
          include: {
            nivelEscolar: true,
            unidadMedida: true
          },
          orderBy: {
            nivelEscolar: {
              orden: 'asc'
            }
          }
        }
      }
    });

    return plato ? mapPlatoToResponse(plato) : null;
  } catch (error) {
    console.error('Error fetching plato by ID:', error);
    throw new Error('Error al obtener el plato');
  }
}

// Crear una porción para un plato
export async function createPorcion(idPlato: string, data: CreatePorcionData) {
  try {
    const porcion = await prisma.porcionNivelEscolar.create({
      data: {
        idPlato,
        idNivelEscolar: data.idNivelEscolar,
        cantidad: data.cantidad,
        idUnidadMedida: data.idUnidadMedida,
        observaciones: data.observaciones
      },
      include: {
        nivelEscolar: true,
        unidadMedida: true
      }
    });

    return {
      idPorcion: porcion.idPorcion,
      cantidad: Number(porcion.cantidad),
      observaciones: porcion.observaciones,
      nivelEscolar: {
        idNivelEscolar: porcion.nivelEscolar.idNivelEscolar,
        nombre: porcion.nivelEscolar.nombre,
        descripcion: porcion.nivelEscolar.descripcion,
        orden: porcion.nivelEscolar.orden
      },
      unidadMedida: {
        idUnidadMedida: porcion.unidadMedida.idUnidadMedida,
        descUnidadMedida: porcion.unidadMedida.descUnidadMedida,
        abreviatura: porcion.unidadMedida.abreviatura
      }
    };
  } catch (error) {
    console.error('Error creating porcion:', error);
    throw new Error('Error al crear la porción');
  }
}

// Crear un plato completo con porciones
export async function createPlatoWithPorciones(
  platoData: CreatePlatoData,
  porciones: CreatePorcionData[]
): Promise<PlatoWithPorciones> {
  try {
    return await prisma.$transaction(async (tx) => {
      // Crear el plato
      const plato = await tx.plato.create({
        data: {
          nombre: platoData.nombre,
          descripcion: platoData.descripcion,
          esEjemplo: platoData.esEjemplo || false,
          idTipoPlato: platoData.idTipoPlato,
          idEscuela: platoData.idEscuela
        }
      });

      // Crear las porciones
      for (const porcionData of porciones) {
        await tx.porcionNivelEscolar.create({
          data: {
            idPlato: plato.idPlato,
            idNivelEscolar: porcionData.idNivelEscolar,
            cantidad: porcionData.cantidad,
            idUnidadMedida: porcionData.idUnidadMedida,
            observaciones: porcionData.observaciones
          }
        });
      }

      // Obtener el plato completo con sus relaciones
      const platoCompleto = await tx.plato.findUnique({
        where: { idPlato: plato.idPlato },
        include: {
          tipoPlato: true,
          escuela: {
            select: {
              idEscuela: true,
              nombre: true
            }
          },
          porciones: {
            include: {
              nivelEscolar: true,
              unidadMedida: true
            },
            orderBy: {
              nivelEscolar: {
                orden: 'asc'
              }
            }
          }
        }
      });

      if (!platoCompleto) {
        throw new Error('Error al crear el plato completo');
      }

      return mapPlatoToResponse(platoCompleto);
    });
  } catch (error) {
    console.error('Error creating plato with porciones:', error);
    throw new Error('Error al crear el plato con porciones');
  }
}

// Obtener porciones de un plato
export async function getPorcionesByPlato(idPlato: string) {
  try {
    const porciones = await prisma.porcionNivelEscolar.findMany({
      where: { idPlato },
      include: {
        nivelEscolar: true,
        unidadMedida: true
      },
      orderBy: {
        nivelEscolar: {
          orden: 'asc'
        }
      }
    });

    return porciones.map(porcion => ({
      idPorcion: porcion.idPorcion,
      cantidad: Number(porcion.cantidad),
      observaciones: porcion.observaciones,
      nivelEscolar: {
        idNivelEscolar: porcion.nivelEscolar.idNivelEscolar,
        nombre: porcion.nivelEscolar.nombre,
        descripcion: porcion.nivelEscolar.descripcion,
        orden: porcion.nivelEscolar.orden
      },
      unidadMedida: {
        idUnidadMedida: porcion.unidadMedida.idUnidadMedida,
        descUnidadMedida: porcion.unidadMedida.descUnidadMedida,
        abreviatura: porcion.unidadMedida.abreviatura
      }
    }));
  } catch (error) {
    console.error('Error fetching porciones:', error);
    throw new Error('Error al obtener las porciones');
  }
}

// Función auxiliar para mapear el resultado de Prisma a nuestro tipo
function mapPlatoToResponse(plato: any): PlatoWithPorciones {
  return {
    idPlato: plato.idPlato,
    nombre: plato.nombre,
    descripcion: plato.descripcion || undefined,
    esEjemplo: plato.esEjemplo,
    idTipoPlato: plato.idTipoPlato,
    idEscuela: plato.idEscuela,
    createdAt: plato.createdAt || undefined,
    updatedAt: plato.updatedAt || undefined,
    tipoPlato: {
      idTipoPlato: plato.tipoPlato.idTipoPlato,
      nombre: plato.tipoPlato.nombre,
      descripcion: plato.tipoPlato.descripcion || undefined,
      orden: plato.tipoPlato.orden
    },
    escuela: {
      idEscuela: plato.escuela.idEscuela,
      nombre: plato.escuela.nombre
    },
    porciones: plato.porciones?.map((porcion: any) => ({
      idPorcion: porcion.idPorcion,
      cantidad: Number(porcion.cantidad),
      observaciones: porcion.observaciones || undefined,
      nivelEscolar: {
        idNivelEscolar: porcion.nivelEscolar.idNivelEscolar,
        nombre: porcion.nivelEscolar.nombre,
        descripcion: porcion.nivelEscolar.descripcion || undefined,
        orden: porcion.nivelEscolar.orden
      },
      unidadMedida: {
        idUnidadMedida: porcion.unidadMedida.idUnidadMedida,
        descUnidadMedida: porcion.unidadMedida.descUnidadMedida,
        abreviatura: porcion.unidadMedida.abreviatura
      }
    })) || []
  };
}

// Obtener tipos de plato disponibles
export async function getTiposPlato() {
  try {
    const tipos = await prisma.tipoPlato.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' }
    });

    return tipos.map(tipo => ({
      idTipoPlato: tipo.idTipoPlato,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || undefined,
      orden: tipo.orden
    }));
  } catch (error) {
    console.error('Error fetching tipos plato:', error);
    throw new Error('Error al obtener los tipos de plato');
  }
}
