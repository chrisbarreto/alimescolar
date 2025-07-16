import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearInsumos() {
  try {
    console.log('🧹 Eliminando todos los insumos...')
    
    // Primero eliminar las relaciones en RecetaPlato
    await prisma.recetaPlato.deleteMany({})
    console.log('✅ Eliminadas todas las relaciones receta-plato (insumos)')
    
    // Eliminar las relaciones en OrdenCompraDetalle 
    await prisma.ordenCompraDetalle.deleteMany({})
    console.log('✅ Eliminadas todas las relaciones orden-compra (insumos)')
    
    // Luego eliminar todos los insumos
    const deletedInsumos = await prisma.insumo.deleteMany({})
    console.log(`✅ Eliminados ${deletedInsumos.count} insumos`)
    
    console.log('🎉 Limpieza de insumos completada')
    
  } catch (error) {
    console.error('❌ Error al eliminar insumos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  clearInsumos()
    .then(() => {
      console.log('✅ Script de limpieza ejecutado exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error en script de limpieza:', error)
      process.exit(1)
    })
}

export { clearInsumos }
