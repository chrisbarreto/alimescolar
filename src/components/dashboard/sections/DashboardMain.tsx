'use client'

import { useAuth } from '@/hooks/useAuth'
import { DashboardSubSection } from '@/context/DashboardContext'
import { 
  FoodIcon, 
  InventoryIcon, 
  UsersIcon,
  ChartIcon 
} from '@/components/icons'
import { useEffect, useState } from 'react'

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

interface DashboardMainProps {
  subSection: DashboardSubSection
}

export default function DashboardMain({ subSection }: DashboardMainProps) {
  const { userSession, session, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<DashboardActivity | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [activityLoading, setActivityLoading] = useState(false)
  const [statsLoaded, setStatsLoaded] = useState(false)

  // Solo cargar datos cuando se muestre la sección principal del dashboard
  const shouldLoadData = subSection === 'principal'

  useEffect(() => {
    if (!shouldLoadData || statsLoaded || !session?.access_token) return

    const loadStats = async () => {
      setStatsLoading(true)
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Datos por defecto en caso de error
          setStats({
            menusActivos: { count: 0, cambio: 0, tipo: 'desde ayer' },
            productos: { count: 0, nuevos: 0, tipo: 'últimos 7 días' },
            usuarios: { count: 0, nuevos: 0, tipo: 'este mes' }
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
        setStats({
          menusActivos: { count: 0, cambio: 0, tipo: 'desde ayer' },
          productos: { count: 0, nuevos: 0, tipo: 'últimos 7 días' },
          usuarios: { count: 0, nuevos: 0, tipo: 'este mes' }
        })
      } finally {
        setStatsLoading(false)
        setStatsLoaded(true)
      }
    }

    const loadActivity = async () => {
      setActivityLoading(true)
      try {
        const response = await fetch('/api/dashboard/activity', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          const data = result.data || result
          setActivity(data)
        } else {
          // Datos por defecto en caso de error
          setActivity({
            menus: [],
            productos: [],
            usuarios: [],
            ordenes: []
          })
        }
      } catch (error) {
        console.error('Error loading activity:', error)
        setActivity({
          menus: [],
          productos: [],
          usuarios: [],
          ordenes: []
        })
      } finally {
        setActivityLoading(false)
      }
    }

    // Solo cargar si tenemos sesión y necesitamos los datos
    if (shouldLoadData) {
      loadStats()
      loadActivity()
    }
  }, [shouldLoadData, session?.access_token, statsLoaded])

  if (loading || !userSession) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ¡Bienvenido, {userSession.persona?.nombre}!
        </h1>
        <p className="text-blue-100">
          {userSession.organizacion?.razonSocial} - Dashboard de administración
        </p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menús Activos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Menús Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : (stats?.menusActivos.count || 0)}
              </p>
              {!statsLoading && stats?.menusActivos && (
                <p className={`text-sm flex items-center ${
                  stats.menusActivos.cambio >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="mr-1">
                    {stats.menusActivos.cambio >= 0 ? '↑' : '↓'}
                  </span>
                  {Math.abs(stats.menusActivos.cambio)} {stats.menusActivos.tipo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <InventoryIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Productos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : (stats?.productos.count || 0)}
              </p>
              {!statsLoading && stats?.productos && (
                <p className="text-sm text-green-600">
                  {stats.productos.nuevos} {stats.productos.tipo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Usuarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : (stats?.usuarios.count || 0)}
              </p>
              {!statsLoading && stats?.usuarios && (
                <p className="text-sm text-purple-600">
                  {stats.usuarios.nuevos} {stats.usuarios.tipo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente y perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="px-6 py-4">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activity && activity.menus && activity.productos ? (
              <div className="space-y-4">
                {/* Mostrar actividad de menús */}
                {(activity.menus || []).slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <FoodIcon className="h-5 w-5 text-blue-500 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                      <p className="text-sm text-gray-500">{item.descripcion}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Mostrar actividad de productos */}
                {(activity.productos || []).slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <InventoryIcon className="h-5 w-5 text-green-500 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                      <p className="text-sm text-gray-500">{item.descripcion}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay actividad reciente disponible
              </p>
            )}
          </div>
        </div>

        {/* Mi Perfil */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mi Perfil</h3>
          </div>
          <div className="px-6 py-4">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {userSession.persona?.nombre.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">
                {userSession.persona?.nombre} {userSession.persona?.apellido}
              </h4>
              <p className="text-sm text-gray-500 mb-1">
                {userSession.nombreUsuario}
              </p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{userSession.persona?.correoPersona}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Organización</label>
                <p className="text-sm text-gray-900">{userSession.organizacion?.razonSocial}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Contacto</label>
                <p className="text-sm text-gray-900">{userSession.persona?.correoPersona}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
