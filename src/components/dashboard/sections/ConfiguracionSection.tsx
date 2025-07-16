'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface ConfiguracionSectionProps {
  subSection: DashboardSubSection
}

export default function ConfiguracionSection({ subSection }: ConfiguracionSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'general':
        return <GeneralConfigComponent />
      case 'seguridad':
        return <SeguridadConfigComponent />
      case 'notificaciones':
        return <NotificacionesConfigComponent />
      default:
        return <GeneralConfigComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
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
    case 'general':
      return 'Configuración General'
    case 'seguridad':
      return 'Configuración de Seguridad'
    case 'notificaciones':
      return 'Configuración de Notificaciones'
    default:
      return 'Configuración General'
  }
}

function GeneralConfigComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración General</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Institución</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Ministerio de Educación"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>GMT-5 (Colombia)</option>
              <option>GMT-6 (México)</option>
              <option>GMT-3 (Argentina)</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

function SeguridadConfigComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Seguridad</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Autenticación de dos factores</h4>
            <p className="text-sm text-gray-500">Requiere código adicional para iniciar sesión</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Cerrar sesión automáticamente</h4>
            <p className="text-sm text-gray-500">Después de 30 minutos de inactividad</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
        </div>
        
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificacionesConfigComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Notificaciones</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificaciones por email</h4>
            <p className="text-sm text-gray-500">Recibir alertas importantes por correo</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificaciones en tiempo real</h4>
            <p className="text-sm text-gray-500">Mostrar notificaciones push en el navegador</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        </div>
        
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  )
}
