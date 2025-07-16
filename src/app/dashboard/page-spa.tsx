'use client'

import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { DashboardProvider } from '@/context/DashboardContext'

export default function DashboardPage() {
  const { userSession, loading } = useAuth()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!userSession) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No se pudo cargar la información del usuario</p>
        </div>
      </DashboardLayout>
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
