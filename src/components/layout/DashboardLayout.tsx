'use client'

import { SidebarProvider } from '@/context/SidebarContext'
import { LogoutProvider, useLogout } from '@/context/LogoutContext'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { isLoggingOut } = useLogout()

  return (
    <>
      {/* Overlay de logout - mismo estilo que carga inicial */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-6">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cerrando sesión...</h2>
              <p className="text-gray-600">Por favor espera un momento</p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard content - oculto completamente durante logout */}
      {!isLoggingOut && (
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar fijo a la izquierda */}
          <Sidebar />
          
          {/* Main content que ocupa el resto del espacio */}
          <div className="flex-1 flex flex-col">
            <Header />
            
            {/* Page content */}
            <main className="flex-1 p-4">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <LogoutProvider>
      <SidebarProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </SidebarProvider>
    </LogoutProvider>
  )
}
