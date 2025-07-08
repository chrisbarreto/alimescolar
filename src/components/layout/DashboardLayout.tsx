'use client'

import { SidebarProvider } from '@/context/SidebarContext'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  )
}
