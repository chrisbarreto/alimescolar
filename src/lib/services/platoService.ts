// Archivo simplificado - Los platos se cargan directamente desde la base de datos
// No se necesitan APIs para crear/editar platos

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Solo mantenemos las interfaces básicas para compatibilidad
export interface PlatoWithPorciones {
  idPlato: string;
  nombre: string;
  descripcion?: string;
  tipoPlato: {
    idTipoPlato: number;
    nombre: string;
    descripcion?: string;
    orden: number;
  };
}

// Función básica para obtener platos (solo para uso interno del sistema de menús)
export async function getPlatos(): Promise<PlatoWithPorciones[]> {
  try {
    const platos = await prisma.plato.findMany({
      include: {
        tipoPlato: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return platos.map(plato => ({
      idPlato: plato.idPlato,
      nombre: plato.nombre,
      descripcion: plato.descripcion || undefined,
      tipoPlato: {
        idTipoPlato: plato.tipoPlato.idTipoPlato,
        nombre: plato.tipoPlato.nombre,
        descripcion: plato.tipoPlato.descripcion || undefined,
        orden: plato.tipoPlato.orden
      }
    }));
  } catch (error) {
    console.error('Error fetching platos:', error);
    return [];
  }
}

// Función para obtener insumos (mantenida para compatibilidad)
export async function getInsumos() {
  try {
    const insumos = await prisma.insumo.findMany({
      include: {
        tipoInsumo: true,
        unidadMedida: true
      },
      orderBy: {
        nombreInsumo: 'asc'
      }
    });

    return insumos;
  } catch (error) {
    console.error('Error fetching insumos:', error);
    return [];
  }
}