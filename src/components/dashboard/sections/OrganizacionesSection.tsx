'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface OrganizacionesSectionProps {
  subSection: DashboardSubSection
}

export default function OrganizacionesSection({ subSection }: OrganizacionesSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'list-organizaciones':
        return <ListOrganizacionesComponent />
      case 'create-organizacion':
        return <CreateOrganizacionComponent />
      default:
        return <ListOrganizacionesComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Organizaciones</h1>
        <div className="text-sm text-gray-500">
          {getSubSectionTitle(subSection)}
        </div>
      </div>
      
      {renderSubSection()}
    </div>
  )
}

function getSubSectionTitle(subSection: DashboardSubSection): string {
  switch (subSection) {
    case 'list-organizaciones':
      return 'Lista de Organizaciones'
    case 'create-organizacion':
      return 'Crear Nueva Organización'
    default:
      return 'Lista de Organizaciones'
  }
}

function ListOrganizacionesComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Organizaciones</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nueva Organización
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500">No hay organizaciones registradas aún</p>
      </div>
    </div>
  )
}

function CreateOrganizacionComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Organización</h3>
        <p className="text-gray-500 mb-6">Esta funcionalidad está en desarrollo</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Crear Organización
        </button>
      </div>
    </div>
  )
}
