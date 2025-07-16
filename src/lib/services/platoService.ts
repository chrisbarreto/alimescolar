import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePlatoData {
  nombre: string;
  descripcion?: string;
  esEjemplo?: boolean;
  idTipoPlato: number;
}

export interface CreatePorcionData {
  idNivelEscolar: number;
  cantidad: number;
  observaciones?: string;
}

export interface RecetaInsumo {
  idInsumo: string;
  cantidadPorRacion: number;
  idUnidadMedida: number;
  pesoBruto?: number;
  pesoNeto?: number;
}

export interface PlatoWithPorciones {
  idPlato: string;
  nombre: string;
  descripcion?: string;
  esEjemplo: boolean;
  idTipoPlato: number;
  createdAt?: Date;
  updatedAt?: Date;
  tipoPlato: {
    idTipoPlato: number;
    nombre: string;
    descripcion?: string;
    orden: number;
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

// Obtener todos los platos - FUNCIÓN SIMPLE PARA PROBAR
export async function getPlatos(): Promise<PlatoWithPorciones[]> {
  console.log('getPlatos llamada - iniciando...');
  try {
    const platos = await prisma.plato.findMany({
      include: {
        tipoPlato: true,
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

    console.log('getPlatos - platos encontrados:', platos.length);
    return platos.map(mapPlatoToResponse);
  } catch (error) {
    console.error('Error fetching platos:', error);
    throw new Error('Error al obtener los platos');
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
    createdAt: plato.createdAt || undefined,
    updatedAt: plato.updatedAt || undefined,
    tipoPlato: {
      idTipoPlato: plato.tipoPlato.idTipoPlato,
      nombre: plato.tipoPlato.nombre,
      descripcion: plato.tipoPlato.descripcion || undefined,
      orden: plato.tipoPlato.orden
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

// Función básica de crear plato
export async function createPlato(data: CreatePlatoData): Promise<PlatoWithPorciones> {
  try {
    const plato = await prisma.plato.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        esEjemplo: data.esEjemplo || false,
        idTipoPlato: data.idTipoPlato
      },
      include: {
        tipoPlato: true,
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

// Placeholder para otras funciones que necesita la API
export async function getInsumos() {
  return [];
}

export async function createPlatoCompleto(
  platoData: CreatePlatoData,
  porciones: CreatePorcionData[],
  receta: RecetaInsumo[]
): Promise<PlatoWithPorciones> {
  // Por ahora solo crea el plato básico
  return createPlato(platoData);
}
