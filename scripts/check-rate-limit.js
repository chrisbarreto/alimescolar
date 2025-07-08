const loginData = {
  email: 'test2@example.com',
  password: 'Test123456!'
}

async function checkRateLimit() {
  try {
    console.log('🔍 Verificando rate limits...')
    
    const response = await fetch('http://localhost:3003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    // Verificar headers de rate limit
    console.log('📋 Headers de respuesta:')
    console.log('  - Status:', response.status)
    console.log('  - X-RateLimit-Limit:', response.headers.get('X-RateLimit-Limit'))
    console.log('  - X-RateLimit-Remaining:', response.headers.get('X-RateLimit-Remaining'))
    console.log('  - X-RateLimit-Reset:', response.headers.get('X-RateLimit-Reset'))
    console.log('  - Retry-After:', response.headers.get('Retry-After'))
    
    // Mostrar todos los headers para debug
    console.log('\n🔍 Todos los headers:')
    response.headers.forEach((value, key) => {
      console.log(`  - ${key}: ${value}`)
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Login exitoso!')
    } else {
      console.log('❌ Error:', data.error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkRateLimit()
