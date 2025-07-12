import { PrismaClient } from '@prisma/client'

export async function seedPlatosBase(prisma: PrismaClient) {
  console.log('🍽️ Creando plato de ejemplo...')

  // Buscar la escuela y tipo de plato
  const escuela = await prisma.escuela.findFirst()
  const tipoPlato = await prisma.tipoPlato.findFirst({
    where: { nombre: 'Almuerzo' }
  })

  if (!escuela || !tipoPlato) {
    console.log('❌ No se encontró escuela o tipo de plato necesarios')
    return
  }

  await prisma.plato.create({
    data: {
      nombre: 'Arroz con Pollo',
      descripcion: 'Arroz con pollo y verduras - Plato ejemplo para el sistema',
      esEjemplo: true,
      idTipoPlato: tipoPlato.idTipoPlato,
      idEscuela: escuela.idEscuela,
    },
  })

  console.log('✅ Plato de ejemplo creado')
}