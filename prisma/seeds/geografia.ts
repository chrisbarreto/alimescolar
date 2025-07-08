import { PrismaClient } from '@prisma/client'

export async function seedGeografia(prisma: PrismaClient) {
  console.log('🗺️ Creando geografía de Paraguay...')

  await prisma.ciudad.createMany({
    data: [
      // Región Central
      { idCiudad: 1, nombreCiudad: 'Asunción' },
      { idCiudad: 2, nombreCiudad: 'San Lorenzo' },
      { idCiudad: 3, nombreCiudad: 'Luque' },
      { idCiudad: 4, nombreCiudad: 'Fernando de la Mora' },
      { idCiudad: 5, nombreCiudad: 'Capiatá' },
      { idCiudad: 6, nombreCiudad: 'Lambaré' },
      { idCiudad: 7, nombreCiudad: 'Mariano Roque Alonso' },
      { idCiudad: 8, nombreCiudad: 'Villa Elisa' },
      { idCiudad: 9, nombreCiudad: 'Ñemby' },
      { idCiudad: 10, nombreCiudad: 'San Antonio' },
      
      // Región Oriental
      { idCiudad: 11, nombreCiudad: 'Ciudad del Este' },
      { idCiudad: 12, nombreCiudad: 'Hernandarias' },
      { idCiudad: 13, nombreCiudad: 'Minga Guazú' },
      { idCiudad: 14, nombreCiudad: 'Presidente Franco' },
      
      // Región Central Interior
      { idCiudad: 15, nombreCiudad: 'Areguá' },
      { idCiudad: 16, nombreCiudad: 'Itá' },
      { idCiudad: 17, nombreCiudad: 'Guarambaré' },
      { idCiudad: 18, nombreCiudad: 'Villeta' },
      
      // Otras ciudades importantes
      { idCiudad: 19, nombreCiudad: 'Encarnación' },
      { idCiudad: 20, nombreCiudad: 'Coronel Oviedo' },
      { idCiudad: 21, nombreCiudad: 'Pedro Juan Caballero' },
      { idCiudad: 22, nombreCiudad: 'Concepción' },
      { idCiudad: 23, nombreCiudad: 'Villarrica' },
      { idCiudad: 24, nombreCiudad: 'Caaguazú' },
      { idCiudad: 25, nombreCiudad: 'Pilar' },
      { idCiudad: 26, nombreCiudad: 'Fuerte Olimpo' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Geografía creada')
}