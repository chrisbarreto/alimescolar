'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface PlatosSectionProps {
  subSection: DashboardSubSection
}

export default function PlatosSection({ subSection }: PlatosSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'create-plato':
        return <PlatosCreate />
      case 'list-platos':
        return <PlatosList />
      case 'porciones':
        return <PorcionesComponent />
      default:
        return <PlatosList />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Platos</h1>
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
    case 'create-plato':
      return 'Crear Nuevo Plato'
    case 'list-platos':
      return 'Lista de Platos'
    case 'porciones':
      return 'Gestionar Porciones'
    default:
      return 'Lista de Platos'
  }
}

// Componente para mostrar la lista de platos
function PlatosList() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Lista de Platos</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Nuevo Plato
        </button>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">
          Aquí se mostrará la lista de platos existentes
        </p>
        {/* Aquí irá el componente real de lista de platos */}
      </div>
    </div>
  )
}

// Componente para crear platos
function PlatosCreate() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Plato</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">
          Aquí irá el formulario para crear platos
        </p>
        {/* Aquí irá el componente real de creación de platos */}
      </div>
    </div>
  )
}

// Componente para gestionar porciones
function PorcionesComponent() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Gestionar Porciones</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">
          Aquí se gestionarán las porciones por nivel escolar
        </p>
        {/* Aquí irá el componente real de gestión de porciones */}
      </div>
    </div>
  )
}
