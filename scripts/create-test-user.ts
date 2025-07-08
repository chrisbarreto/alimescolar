import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    const email = 'test@example.com'
    const password = 'test123456'
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('1. Creando usuario en Supabase Auth...')
    
    // Crear en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombreCompleto: 'Usuario Test'
      }
    })

    if (authError) {
      console.error('Error creando en Supabase:', authError)
      return
    }

    console.log('✅ Usuario creado en Supabase:', authData.user?.id)

    console.log('2. Verificando si existe en BD local...')

    // Verificar si existe en BD local
    const existingUser = await prisma.authUser.findUnique({
      where: { email }
    })

    if (!existingUser) {
      console.log('3. Creando usuario en BD local...')
      
      // Crear en BD local si no existe
      const result = await prisma.$transaction(async (tx) => {
        // Crear persona
        const persona = await tx.persona.create({
          data: {
            nroDocumento: '12345678',
            nombre: 'Usuario',
            apellido: 'Test',
            direccion: 'Dirección Test',
            nroTelefono: '0981123456',
            correoPersona: email,
            idCiudad: 1, // Asunción
            idTipoDocumento: 1, // CI
          }
        })

        // Crear usuario
        const usuario = await tx.usuario.create({
          data: {
            nombreUsuario: 'usertest',
            idPersona: persona.idPersona,
            idOrganizacion: 'baf23ad3-5622-4aca-8434-4eee3af30fc1', // Ministerio de Educación
            estadoUsuario: 'ACTIVO'
          }
        })

        // Crear auth user
        const authUser = await tx.authUser.create({
          data: {
            email,
            password: hashedPassword,
            idUsuario: usuario.idUsuario
          }
        })

        return { persona, usuario, authUser }
      })

      console.log('✅ Usuario creado en BD local:', result.usuario.idUsuario)
    } else {
      console.log('✅ Usuario ya existe en BD local')
    }

    console.log('\n🎉 Usuario de prueba listo:')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log('\nPuedes usar estas credenciales para hacer login!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
