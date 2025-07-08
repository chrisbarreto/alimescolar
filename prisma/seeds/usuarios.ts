import { PrismaClient } from '@prisma/client'

export async function seedUsuarios(prisma: PrismaClient) {
  console.log('👤 Creando usuarios del sistema...')

  // Obtener datos necesarios
  const adminPersona = await prisma.persona.findFirst({
    where: { nroDocumento: '1234567' }
  })
  
  const directorPersona = await prisma.persona.findFirst({
    where: { nroDocumento: '2345678' }
  })
  
  const coordinadorPersona = await prisma.persona.findFirst({
    where: { nroDocumento: '3456789' }
  })

  const organizacionMEC = await prisma.organizacion.findFirst({
    where: { ruc: '80000001-1' }
  })
  
  const organizacionCentral = await prisma.organizacion.findFirst({
    where: { ruc: '80000002-2' }
  })

  if (!adminPersona || !directorPersona || !coordinadorPersona || !organizacionMEC || !organizacionCentral) {
    throw new Error('No se encontraron las personas u organizaciones necesarias')
  }

  // Usuario administrador del sistema
  const adminUsuario = await prisma.usuario.create({
    data: {
      nombreUsuario: 'admin',
      idPersona: adminPersona.idPersona,
      idOrganizacion: organizacionMEC.idOrganizacion,
      estadoUsuario: 'ACTIVO',
    },
  })

  // Usuario director de escuela
  const directorUsuario = await prisma.usuario.create({
    data: {
      nombreUsuario: 'director.gonzalez',
      idPersona: directorPersona.idPersona,
      idOrganizacion: organizacionCentral.idOrganizacion,
      estadoUsuario: 'ACTIVO',
    },
  })

  // Usuario coordinador
  const coordinadorUsuario = await prisma.usuario.create({
    data: {
      nombreUsuario: 'coord.benitez',
      idPersona: coordinadorPersona.idPersona,
      idOrganizacion: organizacionMEC.idOrganizacion,
      estadoUsuario: 'ACTIVO',
    },
  })

  // Crear auth users (en producción usar bcrypt para las contraseñas)
  await prisma.authUser.createMany({
    data: [
      {
        email: 'admin@alimescolar.gov.py',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        idUsuario: adminUsuario.idUsuario,
      },
      {
        email: 'maria.gonzalez@escuela.edu.py',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        idUsuario: directorUsuario.idUsuario,
      },
      {
        email: 'carlos.benitez@alimentacion.gov.py',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        idUsuario: coordinadorUsuario.idUsuario,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Usuarios creados')
  console.log('📧 Credenciales de acceso:')
  console.log('- admin@alimescolar.gov.py / password')
  console.log('- maria.gonzalez@escuela.edu.py / password')
  console.log('- carlos.benitez@alimentacion.gov.py / password')
}