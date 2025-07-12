'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface MenusSectionProps {
  subSection: DashboardSubSection
}

export default function MenusSection({ subSection }: MenusSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'create-menu':
        return <CreateMenuComponent />
      case 'list-menus':
        return <ListMenusComponent />
      case 'planning':
        return <MenuPlanningComponent />
      default:
        return <ListMenusComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Menús</h1>
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
    case 'create-menu':
      return 'Crear Nuevo Menú'
    case 'list-menus':
      return 'Lista de Menús'
    case 'planning':
      return 'Planificación de Menús'
    default:
      return 'Lista de Menús'
  }
}

function CreateMenuComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Menú</h3>
        <p className="text-gray-500 mb-6">Esta funcionalidad está en desarrollo</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Crear Menú
        </button>
      </div>
    </div>
  )
}

function ListMenusComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Lista de Menús</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Menú
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500">No hay menús creados aún</p>
      </div>
    </div>
  )
}

function MenuPlanningComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planificación de Menús</h3>
        <p className="text-gray-500 mb-6">Funcionalidad PRO - Esta característica está en desarrollo</p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          PRO
        </span>
      </div>
    </div>
  )
}
