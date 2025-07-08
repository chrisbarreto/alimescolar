'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const [status, setStatus] = useState('Procesando autenticación...')
  const router = useRouter()

  useEffect(() => {
    console.log('🔄 Callback useEffect ejecutándose')
    
    const handleAuthCallback = async () => {
      try {
        // Obtener la sesión después del login con Google
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error obteniendo sesión:', error)
          setStatus('Error en la autenticación')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        if (!session) {
          console.log('No hay sesión activa')
          setStatus('No se pudo establecer la sesión')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        console.log('✅ Sesión obtenida:', session.user.email)
        setStatus('Verificando usuario...')

        // Pequeña pausa para asegurar que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Verificar si el usuario ya tiene una organización asociada
        const response = await fetch('/api/user/check-organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            supabaseId: session.user.id,
            email: session.user.email
          })
        })

        const userData = await response.json()

        if (response.ok && userData.hasOrganization) {
          // El usuario ya tiene organización, ir al dashboard
          console.log('✅ Usuario ya tiene organización, redirigiendo al dashboard')
          
          // Guardar datos del usuario en localStorage
          if (userData.user) {
            const userSession = {
              idUsuario: userData.user.idUsuario,
              nombreUsuario: userData.user.nombreUsuario,
              email: userData.user.email,
              persona: {
                nombre: userData.user.persona.nombre,
                apellido: userData.user.persona.apellido,
                correoPersona: userData.user.persona.correoPersona
              },
              organizacion: {
                idOrganizacion: userData.user.organizacion.idOrganizacion,
                razonSocial: userData.user.organizacion.razonSocial
              }
            }
            localStorage.setItem('userSession', JSON.stringify(userSession))
          }
          
          // Establecer la sesión en el servidor
          try {
            const setSessionResponse = await fetch('/api/auth/set-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token
              })
            })
            
            if (setSessionResponse.ok) {
              console.log('✅ Sesión establecida en el servidor')
            } else {
              console.warn('⚠️ Error estableciendo sesión en el servidor')
            }
          } catch (error) {
            console.error('Error llamando set-session:', error)
          }
          
          setStatus('Redirigiendo al dashboard...')
          console.log('🔄 Ejecutando redirección al dashboard')
          
          // Usar window.location.href para forzar una navegación completa
          setTimeout(() => {
            console.log('🔄 Redirigiendo al dashboard')
            window.location.href = '/dashboard'
          }, 1500)
        } else {
          // El usuario no tiene organización, debe seleccionar una
          console.log('📝 Usuario nuevo, debe seleccionar organización')
          setStatus('Redirigiendo para seleccionar organización...')
          router.push('/auth/choose-organization')
        }

      } catch (error) {
        console.error('Error en callback:', error)
        setStatus('Error procesando la autenticación')
        setTimeout(() => router.push('/login'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-900">{status}</h2>
      </div>
    </div>
  )
}
