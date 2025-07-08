require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Configurar cliente admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function checkSupabaseUser() {
  try {
    console.log('🔍 Verificando usuario en Supabase...')
    
    // Listar usuarios recientes
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error)
      return
    }
    
    console.log('📊 Usuarios encontrados:', users.users.length)
    
    // Buscar nuestro usuario de prueba
    const testUser = users.users.find(user => user.email === 'test2@example.com')
    
    if (testUser) {
      console.log('✅ Usuario encontrado en Supabase!')
      console.log('  - ID:', testUser.id)
      console.log('  - Email:', testUser.email)
      console.log('  - Confirmado:', testUser.email_confirmed_at ? 'Sí' : 'No')
      console.log('  - Creado:', new Date(testUser.created_at).toLocaleString())
      console.log('  - Última sesión:', testUser.last_sign_in_at ? new Date(testUser.last_sign_in_at).toLocaleString() : 'Nunca')
      
      // Intentar resetear la contraseña para confirmar que funciona
      console.log('\n🔧 Intentando resetear contraseña...')
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
        password: 'Test123456!'
      })
      
      if (resetError) {
        console.error('❌ Error reseteando contraseña:', resetError)
      } else {
        console.log('✅ Contraseña reseteada exitosamente')
      }
    } else {
      console.log('❌ Usuario no encontrado en Supabase')
    }
    
    // Mostrar todos los usuarios para debug
    console.log('\n📋 Todos los usuarios:')
    users.users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id}) - Confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkSupabaseUser()
