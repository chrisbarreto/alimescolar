import { PrismaClient } from '@prisma/client'
import { seedTiposBase } from './seeds/tipos-base'
import { seedGeografia } from './seeds/geografia'
import { seedUnidades } from './seeds/unidades'
import { seedOrganizacion } from './seeds/organizacion'
import { seedPersonas } from './seeds/personas'
import { seedUsuarios } from './seeds/usuarios'
import { seedInsumosBase } from './seeds/insumos-base'
import { seedPlatosBase } from './seeds/platos-base'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed completo...')

  // Orden importante - respeta las dependencias
  await seedTiposBase(prisma)
  await seedGeografia(prisma)
  await seedUnidades(prisma)
  await seedOrganizacion(prisma)
  await seedPersonas(prisma)
  await seedUsuarios(prisma)
  await seedInsumosBase(prisma)
  await seedPlatosBase(prisma)

  console.log('✅ Seed completo finalizado!')
  
  // Resumen
  console.log('\n📊 Resumen de datos creados:')
  console.log(`- Ciudades: ${await prisma.ciudad.count()}`)
  console.log(`- Tipos de documento: ${await prisma.tipoDocumento.count()}`)
  console.log(`- Tipos de insumo: ${await prisma.tipoInsumo.count()}`)
  console.log(`- Unidades de medida: ${await prisma.unidadMedida.count()}`)
  console.log(`- Organizaciones: ${await prisma.organizacion.count()}`)
  console.log(`- Personas: ${await prisma.persona.count()}`)
  console.log(`- Usuarios: ${await prisma.usuario.count()}`)
  console.log(`- Insumos: ${await prisma.insumo.count()}`)
  console.log(`- Platos: ${await prisma.plato.count()}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })