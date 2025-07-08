const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getDataForRegistration() {
  try {
    console.log('🏢 Obteniendo organizaciones...')
    const organizaciones = await prisma.organizacion.findMany({
      select: {
        idOrganizacion: true,
        razonSocial: true,
        ruc: true
      }
    })
    
    console.log('🏙️ Obteniendo ciudades...')
    const ciudades = await prisma.ciudad.findMany({
      select: {
        idCiudad: true,
        nombreCiudad: true
      }
    })
    
    console.log('\n📋 DATOS DISPONIBLES PARA REGISTRO:\n')
    
    console.log('🏢 ORGANIZACIONES:')
    organizaciones.forEach(org => {
      console.log(`  - ${org.razonSocial} (ID: ${org.idOrganizacion}, RUC: ${org.ruc})`)
    })
    
    console.log('\n🏙️ CIUDADES:')
    ciudades.forEach(ciudad => {
      console.log(`  - ${ciudad.nombreCiudad} (ID: ${ciudad.idCiudad})`)
    })
    
    console.log('\n🧪 USUARIO DE PRUEBA SUGERIDO:')
    console.log('  Email: test@example.com')
    console.log('  Contraseña: Test123456!')
    console.log('  Nombre: Juan')
    console.log('  Apellido: Pérez')
    console.log('  Documento: 12345678')
    console.log('  Teléfono: 0981234567')
    console.log('  Dirección: Calle Test 123')
    console.log(`  Ciudad: ${ciudades[0]?.nombreCiudad} (ID: ${ciudades[0]?.idCiudad})`)
    console.log(`  Organización: ${organizaciones[0]?.razonSocial} (ID: ${organizaciones[0]?.idOrganizacion})`)
    
    return { organizaciones, ciudades }
  } catch (error) {
    console.error('❌ Error obteniendo datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getDataForRegistration()
