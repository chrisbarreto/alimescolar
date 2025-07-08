'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error obteniendo sesión:', error)
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(!!session)
          console.log('🔍 AuthGuard - Estado de autenticación:', !!session)
        }
      } catch (error) {
        console.error('Error en AuthGuard:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 AuthGuard - Cambio de estado de auth:', event, !!session)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Redirección basada en estado de autenticación
  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        console.log('🚫 AuthGuard - Acceso denegado, redirigiendo a login')
        router.push('/login')
      } else if (!requireAuth && isAuthenticated) {
        console.log('✅ AuthGuard - Usuario autenticado, redirigiendo a dashboard')
        router.push('/dashboard')
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si requiere autenticación pero no está autenticado, no mostrar nada (se redirige)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si no requiere autenticación pero está autenticado, no mostrar nada (se redirige)
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}