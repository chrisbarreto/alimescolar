'use client'

import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  FoodIcon, 
  InventoryIcon, 
  OrganizationIcon, 
  UsersIcon,
  ChartIcon 
} from '@/components/icons'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface DashboardStats {
  menusActivos: {
    count: number
    cambio: number
    tipo: string
  }
  productos: {
    count: number
    nuevos: number
    tipo: string
  }
  organizaciones: {
    count: number
    nuevas: number
    tipo: string
  }
  usuarios: {
    count: number
    nuevos: number
    tipo: string
  }
}

interface ActivityItem {
  id: string
  titulo: string
  descripcion: string
  fecha: Date
  tipo: string
}

interface DashboardActivity {
  menus: ActivityItem[]
  productos: ActivityItem[]
  usuarios: ActivityItem[]
  ordenes: ActivityItem[]
}

export default function DashboardPage() {
  const { userSession, loading, session } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<DashboardActivity | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    if (userSession && session) {
      fetchStats()
      fetchActivity()
    }
  }, [userSession, session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/dashboard/activity', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setActivity(data)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setActivityLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!userSession) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">No se pudo cargar la información del usuario</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Función para formatear números
  const formatChange = (current: number, change: number) => {
    if (change === 0) return 'Sin cambios'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change} ${current > 1 ? 'nuevos' : 'nuevo'}`
  }

  return (
    <DashboardLayout>
      {/* Header de bienvenida */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-3 text-white">
          <h1 className="text-xl font-bold mb-1">
            ¡Bienvenido, {userSession.persona.nombre}!
          </h1>
          <p className="text-blue-100 text-sm">
            {userSession.organizacion.razonSocial} - Dashboard de administración
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Menús Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FoodIcon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Menús Activos</h3>
              </div>
            </div>
            <div className="mb-2">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.menusActivos.count || 0}</p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-500">
                {statsLoading ? 'Cargando...' : formatChange(stats?.menusActivos.count || 0, stats?.menusActivos.cambio || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <InventoryIcon className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Productos</h3>
              </div>
            </div>
            <div className="mb-2">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.productos.count || 0}</p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-500">
                {statsLoading ? 'Cargando...' : `${stats?.productos.nuevos || 0} ${stats?.productos.tipo || 'nuevos'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Organizaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <OrganizationIcon className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Organizaciones</h3>
              </div>
            </div>
            <div className="mb-2">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.organizaciones.count || 0}</p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-xs text-gray-500">
                {statsLoading ? 'Cargando...' : `${stats?.organizaciones.nuevas || 0} ${stats?.organizaciones.tipo || 'nuevas'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Usuarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900">Usuarios</h3>
              </div>
            </div>
            <div className="mb-2">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.usuarios.count || 0}</p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-xs text-gray-500">
                {statsLoading ? 'Cargando...' : `${stats?.usuarios.nuevos || 0} ${stats?.usuarios.tipo || 'nuevos'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila - Actividad reciente y perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartIcon className="w-5 h-5 mr-2 text-green-600" />
              Actividad Reciente
            </h3>
          </div>
          <div className="p-6">
            {activityLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activity?.menus.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{item.titulo}</p>
                      <p className="text-xs text-gray-500">{item.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                ))}
                {activity?.productos.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{item.titulo}</p>
                      <p className="text-xs text-gray-500">{item.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                ))}
                {activity?.usuarios.slice(0, 1).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{item.titulo}</p>
                      <p className="text-xs text-gray-500">{item.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                ))}
                {!activity?.menus.length && !activity?.productos.length && !activity?.usuarios.length && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay actividad reciente disponible</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Información del usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
              Mi Perfil
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {userSession.persona.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {userSession.persona.nombre} {userSession.persona.apellido}
              </h4>
              <p className="text-sm text-gray-500">{userSession.nombreUsuario}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{userSession.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organización</label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{userSession.organizacion.razonSocial}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{userSession.persona.correoPersona}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <FoodIcon className="w-5 h-5" />
            <span>Crear Menú</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <InventoryIcon className="w-5 h-5" />
            <span>Actualizar Inventario</span>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <ChartIcon className="w-5 h-5" />
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
