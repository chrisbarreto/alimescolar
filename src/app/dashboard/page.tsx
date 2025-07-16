'use client'

import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'

const DashboardContainer = dynamic(
  () => import('@/components/dashboard/DashboardContainer'),
  { ssr: false }
)

const DashboardProvider = dynamic(
  () => import('@/context/DashboardContext').then(mod => ({ default: mod.DashboardProvider })),
  { ssr: false }
)

function DashboardPage() {
  const { userSession, loading } = useAuth()

  if (loading) {
    return (
      <DashboardProvider>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </DashboardProvider>
    )
  }

  if (!userSession) {
    return (
      <DashboardProvider>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-500">No se pudo cargar la información del usuario</p>
          </div>
        </DashboardLayout>
      </DashboardProvider>
    )
  }

  return (
    <DashboardProvider>
      <DashboardLayout>
        <DashboardContainer />
      </DashboardLayout>
    </DashboardProvider>
  )
}

// Exportar como dynamic para deshabilitar SSR completamente
export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false })
