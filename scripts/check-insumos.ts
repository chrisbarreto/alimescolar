import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkInsumos() {
  try {
    const count = await prisma.insumo.count()
    console.log('📊 Total de insumos en la base de datos:', count)
    
    const insumos = await prisma.insumo.findMany({
      include: {
        tipoInsumo: true,
        unidadMedida: true
      },
      take: 15
    })
    
    console.log('\n🥬 Insumos cargados:')
    insumos.forEach((insumo, index) => {
      console.log(`${index + 1}. ${insumo.nombreInsumo} (${insumo.tipoInsumo.descTipoInsumo}) - ${insumo.unidadMedida.abreviatura}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkInsumos()
