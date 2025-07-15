import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupMinimalData() {
  try {
    console.log('🔧 Configurando datos mínimos para pruebas...')

    // 1. Tipos de plato
    console.log('📋 Creando tipos de plato...')
    await prisma.tipoPlato.createMany({
      data: [
        { nombre: 'Almuerzo', descripcion: 'Comida principal del mediodía', orden: 1 },
        { nombre: 'Ensalada', descripcion: 'Acompañamiento de verduras', orden: 2 },
        { nombre: 'Postre', descripcion: 'Dulce para finalizar', orden: 3 }
      ],
      skipDuplicates: true
    })

    // 2. Niveles escolares
    console.log('🎓 Creando niveles escolares...')
    await prisma.nivelEscolar.createMany({
      data: [
        { nombre: 'Inicial', descripcion: 'Educación Inicial', orden: 1 },
        { nombre: 'Primer y Segundo Ciclo', descripcion: 'Educación Básica 1er y 2do Ciclo', orden: 2 },
        { nombre: 'Tercer Ciclo', descripcion: 'Educación Básica 3er Ciclo', orden: 3 }
      ],
      skipDuplicates: true
    })

    // 3. Unidades de medida
    console.log('⚖️ Creando unidades de medida...')
    await prisma.unidadMedida.createMany({
      data: [
        { descUnidadMedida: 'Gramos', abreviatura: 'g' },
        { descUnidadMedida: 'Kilogramos', abreviatura: 'kg' },
        { descUnidadMedida: 'Litros', abreviatura: 'L' },
        { descUnidadMedida: 'Mililitros', abreviatura: 'ml' },
        { descUnidadMedida: 'Unidades', abreviatura: 'u' }
      ],
      skipDuplicates: true
    })

    console.log('\n✅ Datos mínimos configurados!')
    
    // Mostrar resumen
    const tipos = await prisma.tipoPlato.count()
    const niveles = await prisma.nivelEscolar.count()
    const unidades = await prisma.unidadMedida.count()
    
    console.log(`📊 Resumen:`)
    console.log(`- Tipos de plato: ${tipos}`)
    console.log(`- Niveles escolares: ${niveles}`)
    console.log(`- Unidades de medida: ${unidades}`)

  } catch (error) {
    console.error('❌ Error configurando datos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupMinimalData()
  .then(() => {
    console.log('✅ Configuración completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en configuración:', error)
    process.exit(1)
  })
