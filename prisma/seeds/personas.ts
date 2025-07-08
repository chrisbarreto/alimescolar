import { PrismaClient } from '@prisma/client'

export async function seedPersonas(prisma: PrismaClient) {
  console.log('👥 Creando personas base...')

  // Administrador del sistema
  await prisma.persona.create({
    data: {
      nroDocumento: '1234567',
      nombre: 'Admin',
      apellido: 'Sistema',
      fechaNacimiento: new Date('1980-01-01'),
      direccion: 'Dirección del Administrador',
      nroTelefono: '0981-000000',
      correoPersona: 'admin@alimescolar.gov.py',
      idCiudad: 1, // Asunción
      idTipoDocumento: 1, // CI
    },
  })

  // Director de escuela ejemplo
  await prisma.persona.create({
    data: {
      nroDocumento: '2345678',
      nombre: 'María Elena',
      apellido: 'González Rodríguez',
      fechaNacimiento: new Date('1975-03-15'),
      direccion: 'Av. Eusebio Ayala 2345',
      nroTelefono: '0985-123456',
      correoPersona: 'maria.gonzalez@escuela.edu.py',
      idCiudad: 2, // San Lorenzo
      idTipoDocumento: 1, // CI
    },
  })

  // Coordinador de alimentación
  await prisma.persona.create({
    data: {
      nroDocumento: '3456789',
      nombre: 'Carlos Alberto',
      apellido: 'Benítez Silva',
      fechaNacimiento: new Date('1982-07-20'),
      direccion: 'Calle Palma 567',
      nroTelefono: '0984-789012',
      correoPersona: 'carlos.benitez@alimentacion.gov.py',
      idCiudad: 1, // Asunción
      idTipoDocumento: 1, // CI
    },
  })

  console.log('✅ Personas creadas')
}