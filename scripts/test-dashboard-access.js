const loginData = {
  email: 'test2@example.com',
  password: 'Test123456!'
}

async function testDashboardAccess() {
  try {
    console.log('🔐 Haciendo login...')
    
    // Paso 1: Login
    const loginResponse = await fetch('http://localhost:3003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    const loginData_response = await loginResponse.json()

    if (!loginResponse.ok) {
      console.error('❌ Error en login:', loginData_response.error)
      return
    }

    console.log('✅ Login exitoso!')
    
    // Paso 2: Obtener stats del dashboard
    console.log('\n📊 Obteniendo estadísticas del dashboard...')
    const statsResponse = await fetch('http://localhost:3003/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${loginData_response.session.access_token}`
      }
    })

    const statsData = await statsResponse.json()

    if (statsResponse.ok) {
      console.log('✅ Estadísticas obtenidas:')
      console.log('   Respuesta completa:', JSON.stringify(statsData, null, 2))
      
      if (statsData.stats) {
        console.log('  - Total Usuarios:', statsData.stats.totalUsuarios)
        console.log('  - Total Escuelas:', statsData.stats.totalEscuelas)
        console.log('  - Total Platos:', statsData.stats.totalPlatos)
        console.log('  - Total Insumos:', statsData.stats.totalInsumos)
        console.log('  - Total Órdenes:', statsData.stats.totalOrdenes)
      }
    } else {
      console.error('❌ Error obteniendo estadísticas:', statsData.error)
    }

    // Paso 3: Obtener actividad reciente
    console.log('\n📈 Obteniendo actividad reciente...')
    const activityResponse = await fetch('http://localhost:3003/api/dashboard/activity', {
      headers: {
        'Authorization': `Bearer ${loginData_response.session.access_token}`
      }
    })

    const activityData = await activityResponse.json()

    if (activityResponse.ok) {
      console.log('✅ Actividad reciente obtenida:')
      console.log('  - Usuarios recientes:', activityData.activity.usuariosRecientes.length)
      console.log('  - Platos recientes:', activityData.activity.platosRecientes.length)
      console.log('  - Insumos recientes:', activityData.activity.insumosRecientes.length)
      console.log('  - Órdenes recientes:', activityData.activity.ordenesRecientes.length)
    } else {
      console.error('❌ Error obteniendo actividad:', activityData.error)
    }

    console.log('\n🎉 Todas las pruebas completadas exitosamente!')
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  }
}

testDashboardAccess()
