'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface Organization {
  idOrganizacion: string
  razonSocial: string
  ruc: string
}

export default function ChooseOrganization() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar que hay una sesión activa
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        setUserInfo(session.user)

        // Cargar organizaciones
        const response = await fetch('/api/organizaciones')
        const orgs = await response.json()
        setOrganizations(orgs)

      } catch (error) {
        console.error('Error cargando datos:', error)
        setError('Error cargando las organizaciones')
      }
    }

    loadData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      // Crear el usuario con la organización seleccionada
      const response = await fetch('/api/user/create-with-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          supabaseId: session.user.id,
          email: session.user.email,
          nombre: session.user.user_metadata?.full_name?.split(' ')[0] || 'Usuario',
          apellido: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Google',
          organizacionId: selectedOrg
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Usuario creado exitosamente')
        
        // Guardar datos del usuario en localStorage
        if (data.userSession) {
          localStorage.setItem('userSession', JSON.stringify(data.userSession))
        }
        
        router.push('/dashboard')
      } else {
        setError(data.error || 'Error al crear el usuario')
      }

    } catch (error) {
      console.error('Error creando usuario:', error)
      setError('Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Selecciona tu Organización
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hola {userInfo.user_metadata?.full_name || userInfo.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organización
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una organización</option>
              {organizations.map(org => (
                <option key={org.idOrganizacion} value={org.idOrganizacion}>
                  {org.razonSocial}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedOrg}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}
