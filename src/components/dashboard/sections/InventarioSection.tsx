'use client'

import { DashboardSubSection } from '@/context/DashboardContext'

interface InventarioSectionProps {
  subSection: DashboardSubSection
}

export default function InventarioSection({ subSection }: InventarioSectionProps) {
  const renderSubSection = () => {
    switch (subSection) {
      case 'productos':
        return <ProductosComponent />
      case 'stock':
        return <StockComponent />
      case 'proveedores':
        return <ProveedoresComponent />
      default:
        return <ProductosComponent />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
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
    case 'productos':
      return 'Gestión de Productos'
    case 'stock':
      return 'Control de Stock'
    case 'proveedores':
      return 'Gestión de Proveedores'
    default:
      return 'Gestión de Productos'
  }
}

function ProductosComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Productos</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Producto
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos registrados aún</p>
      </div>
    </div>
  )
}

function StockComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Control de Stock</h3>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            NEW
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Actualizar Stock
          </button>
        </div>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Control de inventario en tiempo real</p>
        <p className="text-sm text-gray-400">Esta funcionalidad está en desarrollo</p>
      </div>
    </div>
  )
}

function ProveedoresComponent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Proveedores</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Proveedor
        </button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-500">No hay proveedores registrados aún</p>
      </div>
    </div>
  )
}
