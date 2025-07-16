import { PrismaClient } from '@prisma/client'
import { seedInsumosBase } from '../prisma/seeds/insumos-base'

const prisma = new PrismaClient()

async function loadInsumos() {
  try {
    console.log('🥬 Cargando nuevos insumos...')
    await seedInsumosBase(prisma)
    console.log('🎉 Insumos cargados exitosamente!')
  } catch (error) {
    console.error('❌ Error al cargar insumos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

loadInsumos()
  .then(() => {
    console.log('✅ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  })
