import { PrismaClient } from '@prisma/client'

export async function seedTiposBase(prisma: PrismaClient) {
  console.log('📋 Creando tipos base...')

  // Tipos de documento
  await prisma.tipoDocumento.createMany({
    data: [
      { idTipoDocumento: 1, descTipoDocumento: 'Cédula de Identidad' },
      { idTipoDocumento: 2, descTipoDocumento: 'RUC' },
      { idTipoDocumento: 3, descTipoDocumento: 'Pasaporte' },
      { idTipoDocumento: 4, descTipoDocumento: 'Carnet de Extranjería' },
    ],
    skipDuplicates: true,
  })

  // Tipos de insumo
  await prisma.tipoInsumo.createMany({
    data: [
      { descTipoInsumo: 'Verduras y Hortalizas' },
      { descTipoInsumo: 'Frutas' },
      { descTipoInsumo: 'Carnes y Aves' },
      { descTipoInsumo: 'Pescados y Mariscos' },
      { descTipoInsumo: 'Lácteos y Huevos' },
      { descTipoInsumo: 'Cereales y Granos' },
      { descTipoInsumo: 'Leguminosas' },
      { descTipoInsumo: 'Aceites y Grasas' },
      { descTipoInsumo: 'Condimentos y Especias' },
      { descTipoInsumo: 'Bebidas' },
      { descTipoInsumo: 'Azúcares y Dulces' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Tipos base creados')
}