'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface UsuariosSectionProps {
  subSection: DashboardSubSection
}

export default function UsuariosSection({ subSection }: UsuariosSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'list-usuarios':
        return <ListUsuariosComponent />
      case 'create-usuario':
        return <CreateUsuarioComponent />
      case 'roles':
        return <RolesComponent />
      default:
        return <ListUsuariosComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
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
    case 'list-usuarios':
      return 'Lista de Usuarios'
    case 'create-usuario':
      return 'Crear Nuevo Usuario'
    case 'roles':
      return 'Gestión de Roles'
    default:
      return 'Lista de Usuarios'
  }
}

function ListUsuariosComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Usuarios del Sistema</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Usuario
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500">No hay usuarios adicionales registrados</p>
      </div>
    </div>
  )
}

function CreateUsuarioComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Usuario</h3>
        <p className="text-gray-500 mb-6">Esta funcionalidad está en desarrollo</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Crear Usuario
        </button>
      </div>
    </div>
  )
}

function RolesComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Roles</h3>
        <p className="text-gray-500 mb-6">Configuración de permisos y roles de usuario</p>
        <p className="text-sm text-gray-400">Esta funcionalidad está en desarrollo</p>
      </div>
    </div>
  )
}
