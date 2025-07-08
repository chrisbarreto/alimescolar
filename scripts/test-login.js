const loginData = {
  email: 'test2@example.com',
  password: 'Test123456!'
}

async function testLogin() {
  try {
    console.log('🔐 Probando login...')
    console.log('📧 Email:', loginData.email)
    console.log('🔒 Contraseña:', loginData.password)
    
    const response = await fetch('http://localhost:3003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Login exitoso!')
      console.log('📊 Datos de la sesión:')
      console.log('  - Usuario:', data.userSession.nombreUsuario)
      console.log('  - Email:', data.userSession.email)
      console.log('  - Nombre completo:', data.userSession.persona.nombre, data.userSession.persona.apellido)
      console.log('  - Organización:', data.userSession.organizacion.razonSocial)
      console.log('  - Supabase ID:', data.userSession.supabaseId)
      console.log('  - Sesión de Supabase:', data.session ? 'Establecida' : 'No establecida')
      
      if (data.session) {
        console.log('  - Access Token:', data.session.access_token.substring(0, 20) + '...')
        console.log('  - Expires at:', new Date(data.session.expires_at * 1000).toLocaleString())
      }
    } else {
      console.error('❌ Error en login:', data.error)
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  }
}

testLogin()
