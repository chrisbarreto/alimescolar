// Script para probar el flujo completo de autenticación
const baseUrl = 'http://localhost:3004'

async function testAuthFlow() {
  console.log('🧪 Iniciando pruebas del flujo de autenticación...')
  
  try {
    // 1. Verificar el estado inicial de la sesión
    console.log('\n1. Verificando estado inicial de sesión...')
    const initialSession = await fetch(`${baseUrl}/api/debug/session`)
    const initialData = await initialSession.json()
    console.log('Estado inicial:', initialData)
    
    // 2. Verificar el middleware
    console.log('\n2. Verificando middleware...')
    const dashboardResponse = await fetch(`${baseUrl}/dashboard`, {
      redirect: 'manual'
    })
    console.log('Status del dashboard:', dashboardResponse.status)
    console.log('Redirect location:', dashboardResponse.headers.get('location'))
    
    // 3. Verificar la página de login
    console.log('\n3. Verificando página de login...')
    const loginResponse = await fetch(`${baseUrl}/login`)
    console.log('Status del login:', loginResponse.status)
    
    // 4. Verificar endpoint de sesión
    console.log('\n4. Verificando endpoint de sesión...')
    const sessionResponse = await fetch(`${baseUrl}/api/auth/session`)
    const sessionData = await sessionResponse.json()
    console.log('Datos de sesión:', sessionData)
    
    console.log('\n✅ Pruebas completadas.')
    console.log('\n📋 Resumen:')
    console.log('- Estado inicial:', initialData.hasSession ? 'Con sesión' : 'Sin sesión')
    console.log('- Middleware:', dashboardResponse.status === 302 ? 'Funciona (redirige)' : 'No funciona')
    console.log('- Login:', loginResponse.status === 200 ? 'Accesible' : 'No accesible')
    console.log('- Sesión API:', sessionResponse.status === 200 ? 'Funciona' : 'No funciona')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  }
}

// Ejecutar las pruebas
testAuthFlow()
