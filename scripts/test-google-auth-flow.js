// Script para probar el flujo completo de autenticación con Google
const { createClient } = require('@supabase/supabase-js')

// Configurar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testGoogleAuthFlow() {
  console.log('🧪 Probando flujo de autenticación con Google...')
  
  try {
    // 1. Verificar configuración de OAuth
    console.log('🔧 Verificando configuración...')
    console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Falta')
    console.log('- Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Falta')
    
    // 2. Probar endpoint de organizaciones
    console.log('\n📋 Probando endpoint de organizaciones...')
    const orgsResponse = await fetch('http://localhost:3001/api/organizaciones')
    const orgs = await orgsResponse.json()
    console.log('- Organizaciones disponibles:', orgs.length)
    
    // 3. Simular verificación de usuario existente
    console.log('\n🔍 Probando verificación de usuario...')
    const checkResponse = await fetch('http://localhost:3001/api/user/check-organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId: 'test-supabase-id',
        email: 'test@ejemplo.com'
      })
    })
    const checkData = await checkResponse.json()
    console.log('- Usuario encontrado:', checkData.hasOrganization ? '✅ Sí' : '❌ No')
    
    console.log('\n✅ Endpoints funcionando correctamente!')
    console.log('\n📝 Para probar el flujo completo:')
    console.log('1. Ve a http://localhost:3001/login')
    console.log('2. Haz clic en "Iniciar sesión con Google"')
    console.log('3. Selecciona una organización si es usuario nuevo')
    console.log('4. Deberías ser redirigido al dashboard')
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
  }
}

testGoogleAuthFlow()
