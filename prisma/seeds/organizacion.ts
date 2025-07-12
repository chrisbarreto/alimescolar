import { PrismaClient } from '@prisma/client'

export async function seedOrganizacion(prisma: PrismaClient) {
  console.log('🏢 Creando organización base...')

  await prisma.organizacion.upsert({
    where: { ruc: '80000001-1' },
    update: {},
    create: {
      razonSocial: 'Ministerio de Educación y Ciencias',
      ruc: '80000001-1',
      direccion: 'Chile 128 entre Palma y Alberdi',
      correo: 'info@mec.gov.py',
      telefono: '021-414-3000',
      idCiudad: 1, // Asunción
    },
  })

  // Organización de ejemplo para testing
  await prisma.organizacion.upsert({
    where: { ruc: '80000002-2' },
    update: {},
    create: {
      razonSocial: 'Supervisión de Alimentación Escolar Central',
      ruc: '80000002-2',
      direccion: 'Av. Mariscal López 1234',
      correo: 'alimentacion@central.edu.py',
      telefono: '021-555-0100',
      idCiudad: 2, // San Lorenzo
    },
  })

  console.log('✅ Organizaciones creadas')
}