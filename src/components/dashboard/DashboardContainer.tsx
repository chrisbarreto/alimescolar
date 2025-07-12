'use client'

import { useDashboard } from '@/context/DashboardContext'
import DashboardMain from './sections/DashboardMain'
import PlatosSection from './sections/PlatosSection'
import MenusSection from './sections/MenusSection'
import InventarioSection from './sections/InventarioSection'
import OrganizacionesSection from './sections/OrganizacionesSection'
import UsuariosSection from './sections/UsuariosSection'
import ReportesSection from './sections/ReportesSection'
import ConfiguracionSection from './sections/ConfiguracionSection'

export default function DashboardContainer() {
  const { currentSection, currentSubSection } = useDashboard()

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardMain subSection={currentSubSection} />
      
      case 'platos':
        return <PlatosSection subSection={currentSubSection} />
      
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
