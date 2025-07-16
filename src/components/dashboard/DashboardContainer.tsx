'use client'

import { useDashboard } from '@/context/DashboardContext'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Importaciones dinámicas para mejorar el rendimiento
const DashboardMain = dynamic(() => import('./sections/DashboardMain').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const MenusSection = dynamic(() => import('./sections/MenusSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const InventarioSection = dynamic(() => import('./sections/InventarioSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const OrganizacionesSection = dynamic(() => import('./sections/OrganizacionesSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const UsuariosSection = dynamic(() => import('./sections/UsuariosSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const ReportesSection = dynamic(() => import('./sections/ReportesSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const ConfiguracionSection = dynamic(() => import('./sections/ConfiguracionSection').then(mod => ({ default: mod.default })), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Componente de loading simple
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function DashboardContainer() {
  const { currentSection, currentSubSection } = useDashboard()

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardMain subSection={currentSubSection} />
      
      case 'platos':
        // Los platos se gestionan directamente en la base de datos
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Gestión de Platos</h2>
            <p className="text-gray-600">Los platos se gestionan directamente en la base de datos.</p>
            <p className="text-gray-600">Use la sección de Menús para crear menús semanales.</p>
          </div>
        )
      
      case 'menus':
        return <MenusSection subSection={currentSubSection} />
      
      case 'inventario':
        return <InventarioSection subSection={currentSubSection} />
      
      case 'organizaciones':
        return <OrganizacionesSection subSection={currentSubSection} />
      
      case 'usuarios':
        return <UsuariosSection subSection={currentSubSection} />
      
      case 'reportes':
        return <ReportesSection subSection={currentSubSection} />
      
      case 'configuracion':
        return <ConfiguracionSection subSection={currentSubSection} />
      
      default:
        return <DashboardMain subSection="principal" />
    }
  }

  return (
    <div className="min-h-full">
      {renderCurrentSection()}
    </div>
  )
}
