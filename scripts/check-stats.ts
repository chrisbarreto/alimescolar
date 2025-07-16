import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStats() {
  try {
    console.log('📊 Verificando estadísticas del sistema...')
    
    const insumos = await prisma.insumo.count()
    console.log(`🥬 Insumos totales: ${insumos}`)
    
    const platos = await prisma.plato.count()
    console.log(`🍽️ Platos totales: ${platos}`)
    
    const usuarios = await prisma.usuario.count()
    console.log(`👥 Usuarios totales: ${usuarios}`)
    
    const organizaciones = await prisma.organizacion.count()
    console.log(`🏢 Organizaciones totales: ${organizaciones}`)
    
    const menus = await prisma.menuSemanal.count()
    console.log(`📅 Menús semanales totales: ${menus}`)
    
    // Mostrar algunos datos de ejemplo
    if (usuarios > 0) {
      const sampleUser = await prisma.usuario.findFirst({
        include: {
          organizacion: true,
          persona: true
        }
      })
      console.log(`👤 Usuario ejemplo: ${sampleUser?.nombreUsuario} (${sampleUser?.organizacion.razonSocial})`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStats()
