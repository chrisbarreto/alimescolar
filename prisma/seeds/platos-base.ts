import { PrismaClient } from '@prisma/client'

export async function seedPlatosBase(prisma: PrismaClient) {
  console.log('🍽️ Creando plato de ejemplo...')

  const organizacion = await prisma.organizacion.findFirst({
    where: { ruc: '80000001-1' }
  })

  if (!organizacion) {
    throw new Error('No se encontró la organización')
  }

  await prisma.plato.create({
    data: {
      nombre: 'Arroz con Pollo',
      descripcion: 'Arroz con pollo y verduras - Plato ejemplo para el sistema',
      tipo: 'ALMUERZO',
      idOrganizacion: organizacion.idOrganizacion,
      preparacion: '1. Cocinar el arroz en agua con sal. 2. Sofreír el pollo cortado en trozos. 3. Agregar verduras cortadas en cubitos. 4. Mezclar el arroz cocido con el pollo y verduras. 5. Condimentar al gusto.',
      energiaKcal: 450,
      pesoPorPorcion: 250.00,
      rendimiento: 10,
      nivelInicial: 200.00,
      edadEscolar: 250.00,
      adolescentes: 300.00,
      observaciones: 'Plato nutritivo y balanceado - Ejemplo base del sistema',
    },
  })

  console.log('✅ Plato de ejemplo creado')
}