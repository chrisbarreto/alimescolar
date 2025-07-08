// Script para probar el flujo completo de Google OAuth

async function testGoogleOAuthFlow() {
  console.log('🧪 Probando flujo de Google OAuth...')
  
  // Datos de ejemplo de un usuario que viene de Google
  const testUser = {
    supabaseId: 'google-user-123',
    email: 'test@gmail.com',
    nombre: 'Juan',
    apellido: 'Pérez'
  }

  try {
    // 1. Simular check-organization
    console.log('\n1️⃣ Verificando si el usuario ya tiene organización...')
    const checkResponse = await fetch('http://localhost:3000/api/user/check-organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supabaseId: testUser.supabaseId,
        email: testUser.email
      })
    })

    const checkData = await checkResponse.json()
    console.log('Resultado check-organization:', checkData)

    if (checkData.hasOrganization) {
      console.log('✅ Usuario ya tiene organización, debería ir al dashboard')
      return
    }

    // 2. Simular create-with-organization
    console.log('\n2️⃣ Creando usuario con organización...')
    const createResponse = await fetch('http://localhost:3000/api/user/create-with-organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testUser,
        organizacionId: 'alguna-organizacion-id' // Reemplazar con ID real
      })
    })

    const createData = await createResponse.json()
    console.log('Resultado create-with-organization:', createData)

    if (createResponse.ok) {
      console.log('✅ Usuario creado exitosamente')
    } else {
      console.log('❌ Error creando usuario:', createData.error)
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error)
  }
}

// Ejecutar la prueba
testGoogleOAuthFlow()
