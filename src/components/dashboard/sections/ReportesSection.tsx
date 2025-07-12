'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface ReportesSectionProps {
  subSection: DashboardSubSection
}

export default function ReportesSection({ subSection }: ReportesSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'ventas':
        return <VentasReportComponent />
      case 'inventario-report':
        return <InventarioReportComponent />
      case 'nutricional':
        return <NutricionalReportComponent />
      default:
        return <VentasReportComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
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
    case 'ventas':
      return 'Reportes de Ventas'
    case 'inventario-report':
      return 'Reportes de Inventario'
    case 'nutricional':
      return 'Análisis Nutricional'
    default:
      return 'Reportes de Ventas'
  }
}

function VentasReportComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Reportes de Ventas</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generar Reporte
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No hay datos de ventas disponibles</p>
        <p className="text-sm text-gray-400">Los reportes se generarán automáticamente cuando haya datos</p>
      </div>
    </div>
  )
}

function InventarioReportComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Reportes de Inventario</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generar Reporte
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Análisis de movimientos de inventario</p>
        <p className="text-sm text-gray-400">Esta funcionalidad está en desarrollo</p>
      </div>
    </div>
  )
}

function NutricionalReportComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Análisis Nutricional</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generar Análisis
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Análisis nutricional de menús y platos</p>
        <p className="text-sm text-gray-400">Esta funcionalidad está en desarrollo</p>
      </div>
    </div>
  )
}
