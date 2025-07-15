import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateBasicData() {
  try {
    console.log('🔧 Poblando datos básicos faltantes...')

    // 1. Poblar tipos de documento
    console.log('📄 Creando tipos de documento...')
    await prisma.tipoDocumento.createMany({
      data: [
        { descTipoDocumento: 'Cédula de Identidad' },
        { descTipoDocumento: 'Pasaporte' },
        { descTipoDocumento: 'RUC' },
        { descTipoDocumento: 'Otro' }
      ],
      skipDuplicates: true
    })

    // 2. Poblar ciudades básicas si no existen
    console.log('🏙️ Verificando ciudades...')
    const ciudadCount = await prisma.ciudad.count()
    if (ciudadCount === 0) {
      await prisma.ciudad.createMany({
        data: [
          { nombreCiudad: 'Asunción' },
          { nombreCiudad: 'Ciudad del Este' },
          { nombreCiudad: 'San Lorenzo' },
          { nombreCiudad: 'Luque' },
          { nombreCiudad: 'Capiatá' }
        ],
        skipDuplicates: true
      })
    }

    // 3. Verificar estado final
    console.log('\n📊 Estado de los datos básicos:')
    console.log(`- Tipos de documento: ${await prisma.tipoDocumento.count()}`)
    console.log(`- Ciudades: ${await prisma.ciudad.count()}`)

    // Mostrar los datos creados
    console.log('\n📄 Tipos de documento disponibles:')
    const tiposDoc = await prisma.tipoDocumento.findMany()
    tiposDoc.forEach(tipo => {
      console.log(`  - ID ${tipo.idTipoDocumento}: ${tipo.descTipoDocumento}`)
    })

    console.log('\n🏙️ Ciudades disponibles:')
    const ciudades = await prisma.ciudad.findMany()
    ciudades.forEach(ciudad => {
      console.log(`  - ID ${ciudad.idCiudad}: ${ciudad.nombreCiudad}`)
    })

    console.log('\n✅ Datos básicos poblados exitosamente!')
    
  } catch (error) {
    console.error('❌ Error al poblar datos básicos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

populateBasicData()
  .then(() => {
    console.log('✅ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  })
