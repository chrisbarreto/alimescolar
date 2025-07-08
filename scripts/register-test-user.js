const userData = {
  email: 'test2@example.com',
  password: 'Test123456!',
  nombre: 'María',
  apellido: 'González',
  nroDocumento: '87654321',
  telefono: '0987654321',
  direccion: 'Avenida Test 456',
  idCiudad: '2', // San Lorenzo
  idOrganizacion: 'baf23ad3-5622-4aca-8434-4eee3af30fc1' // Ministerio de Educación y Ciencias
}

async function registerTestUser() {
  try {
    console.log('📝 Registrando usuario de prueba...')
    console.log('📧 Email:', userData.email)
    console.log('🔒 Contraseña:', userData.password)
    console.log('👤 Nombre:', userData.nombre, userData.apellido)
    console.log('📄 Documento:', userData.nroDocumento)
    console.log('🏢 Organización ID:', userData.idOrganizacion)
    
    const response = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Usuario registrado exitosamente!')
      console.log('📊 Datos del usuario:', data)
      console.log('\n🔐 Ahora puedes hacer login con:')
      console.log('📧 Email:', userData.email)
      console.log('🔒 Contraseña:', userData.password)
    } else {
      console.error('❌ Error al registrar usuario:', data.error)
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  }
}

registerTestUser()
