import { createClient } from '@supabase/supabase-js'

// Configurar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface UserSession {
  idUsuario: string
  nombreUsuario: string
  email: string
  persona: {
    nombre: string
    apellido: string
    correoPersona: string
  }
  organizacion: {
    razonSocial: string
    idOrganizacion: string
  }
}

export class AuthService {
  // LOGIN - llama a la API y maneja sesión real de Supabase
  static async signIn(email: string, password: string) {
    try {
      console.log('🔐 Iniciando login para:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('📡 Respuesta de API:', response.status, response.statusText)

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Respuesta no JSON:', text)
        throw new Error('Error de servidor: respuesta no válida')
      }

      const data = await response.json()
      console.log('📋 Datos recibidos:', data)
      
      if (!response.ok) throw new Error(data.error || 'Error de autenticación')
      
      // Establecer sesión de Supabase en cliente
      if (data.session) {
        console.log('🔑 Estableciendo sesión de Supabase en cliente...')
        
        const { data: sessionData, error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })

        if (error) {
          console.error('❌ Error estableciendo sesión en cliente:', error)
          throw new Error('Error estableciendo sesión en cliente')
        }
        
        console.log('✅ Sesión establecida en cliente')

        // Establecer en el servidor para que el middleware pueda verla
        console.log('🔑 Estableciendo sesión en servidor...')
        
        const serverResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          }),
        })

        if (!serverResponse.ok) {
          console.error('❌ Error estableciendo sesión en servidor')
          throw new Error('Error estableciendo sesión en servidor')
        }

        console.log('✅ Sesión establecida en servidor')
        
        // Verificar que la sesión se estableció correctamente
        const { data: { session: verifySession } } = await supabase.auth.getSession()
        console.log('🔍 Verificación de sesión:', verifySession ? 'Establecida' : 'No establecida')
      }
      
      // Guardar datos del usuario
      if (data.userSession) {
        console.log('💾 Guardando datos de usuario...')
        localStorage.setItem('userSession', JSON.stringify(data.userSession))
      }
      
      console.log('🎉 Login completado exitosamente')
      return data
    } catch (error: any) {
      console.error('❌ Error en signIn:', error)
      if (error.message.includes('JSON')) {
        throw new Error('Error de conexión con el servidor')
      }
      throw error
    }
  }

  // LOGOUT - usando Supabase Auth real
  static async signOut() {
    try {
      console.log('🚪 Cerrando sesión...')
      
      // 1. Cerrar sesión en el servidor primero
      console.log('🔓 Cerrando sesión en servidor...')
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          console.warn('⚠️ Error cerrando sesión en servidor, continuando...')
        } else {
          console.log('✅ Sesión cerrada en servidor')
        }
      } catch (serverError) {
        console.warn('⚠️ Error de conexión con servidor logout, continuando...', serverError)
      }
      
      // 2. Cerrar sesión en el cliente
      console.log('🔓 Cerrando sesión en cliente...')
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.warn('⚠️ Error cerrando sesión en cliente:', error)
        } else {
          console.log('✅ Sesión cerrada en cliente')
        }
      } catch (clientError) {
        console.warn('⚠️ Error cerrando sesión cliente:', clientError)
      }

      // 3. Limpiar datos locales
      console.log('🧹 Limpiando datos locales...')
      localStorage.removeItem('userSession')
      
      console.log('✅ Sesión cerrada exitosamente')
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
      // Limpiar localStorage incluso si hay error
      localStorage.removeItem('userSession')
    }
  }

  // OBTENER SESIÓN ACTUAL de Supabase
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Error obteniendo sesión:', error)
      return null
    }
  }

  // OBTENER USUARIO - combinando Supabase con datos locales
  static async getCurrentUser(): Promise<UserSession | null> {
    try {
      // Verificar sesión de Supabase
      const session = await this.getCurrentSession()
      if (!session) return null

      // Obtener datos de usuario de localStorage
      const userSessionData = localStorage.getItem('userSession')
      if (!userSessionData) return null

      return JSON.parse(userSessionData)
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return null
    }
  }

  // VERIFICAR SI ESTÁ AUTENTICADO
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession()
    return !!session
  }
}

// Función para verificar JWT de Supabase
export async function verifyJWT(token: string) {
  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error) throw error
    
    if (!data.user) return null
    
    // Buscar el usuario en nuestra base de datos
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    try {
      const authUser = await prisma.authUser.findUnique({
        where: { email: data.user.email! },
        include: {
          usuario: {
            include: {
              persona: true,
              organizacion: true
            }
          }
        }
      })
      
      if (!authUser) return null
      
      return {
        userId: authUser.usuario.idUsuario,
        email: data.user.email,
        usuario: authUser.usuario
      }
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('Error verificando JWT:', error)
    return null
  }
}