'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Ingrediente {
  idInsumo: string
  cantidadPorRacion: number
  idUnidadMedida: number
  pesoBruto?: number
  pesoNeto?: number
  insumo: {
    nombreInsumo: string
    descripcion?: string
    tipoInsumo: {
      descTipoInsumo: string
    }
  }
  unidadMedida: {
    descUnidadMedida: string
    abreviatura: string
  }
}

interface PlatoDetalle {
  idPlato: string
  nombre: string
  descripcion?: string
  esEjemplo: boolean
  createdAt?: string
  updatedAt?: string
  tipoPlato: {
    nombre: string
    descripcion?: string
    orden: number
  }
  porciones: {
    idPorcion: string
    cantidad: number
    observaciones?: string
    nivelEscolar: {
      nombre: string
      descripcion?: string
      orden: number
    }
    unidadMedida: {
      descUnidadMedida: string
      abreviatura: string
    }
  }[]
  recetaPlato: Ingrediente[]
}

export default function PlatoDetallePage() {
  const { userSession } = useAuth()
  const router = useRouter()
  const params = useParams()
  const platoId = params.id as string

  const [plato, setPlato] = useState<PlatoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (platoId) {
      loadPlatoDetalle()
    }
  }, [platoId])

  const loadPlatoDetalle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/platos/${platoId}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPlato(result.data)
        } else {
          setError(result.error || 'Error al cargar el plato')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Plato no encontrado')
      }
    } catch (err) {
      console.error('Error loading plato:', err)
      setError('Error al cargar el plato')
    } finally {
      setLoading(false)
    }
  }

  const getTipoColor = (tipoOrden: number) => {
    switch (tipoOrden) {
      case 1: return 'bg-blue-100 text-blue-800' // Almuerzo
      case 2: return 'bg-green-100 text-green-800' // Ensalada
      case 3: return 'bg-orange-100 text-orange-800' // Postre
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Cargando detalles del plato...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          href="/dashboard/platos"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Volver a la lista de platos
        </Link>
      </div>
    )
  }

  if (!plato) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Plato no encontrado</p>
          <Link
            href="/dashboard/platos"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            ← Volver a la lista de platos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/platos"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Detalles del Plato</h1>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Editar
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos básicos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Plato
                </label>
                <p className="text-gray-900">{plato.nombre}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Plato
                </label>
                <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getTipoColor(plato.tipoPlato.orden)}`}>
                  {plato.tipoPlato.nombre}
                </span>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <p className="text-gray-900">{plato.descripcion || 'Sin descripción'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                  plato.esEjemplo 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {plato.esEjemplo ? 'Plato de Ejemplo' : 'Plato Activo'}
                </span>
              </div>
            </div>

            {/* Fechas */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                {plato.createdAt && (
                  <div>
                    <span className="font-medium">Creado:</span> {new Date(plato.createdAt).toLocaleDateString()}
                  </div>
                )}
                {plato.updatedAt && (
                  <div>
                    <span className="font-medium">Actualizado:</span> {new Date(plato.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Porciones por nivel escolar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Porciones por Nivel Escolar</h2>
            
            {plato.porciones && plato.porciones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel Escolar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plato.porciones
                      .sort((a, b) => a.nivelEscolar.orden - b.nivelEscolar.orden)
                      .map((porcion) => (
                        <tr key={porcion.idPorcion}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {porcion.nivelEscolar.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {porcion.cantidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {porcion.unidadMedida.abreviatura}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {porcion.observaciones || '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No hay porciones configuradas para este plato.</p>
            )}
          </div>
        </div>

        {/* Sidebar - Ingredientes */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingredientes e Insumos
              {plato.recetaPlato && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({plato.recetaPlato.length} ingredientes)
                </span>
              )}
            </h2>
            
            {plato.recetaPlato && plato.recetaPlato.length > 0 ? (
              <div className="space-y-3">
                {plato.recetaPlato.map((ingrediente, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="font-medium text-gray-900 mb-2">
                      {ingrediente.insumo.nombreInsumo}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Cantidad por ración:</span>
                        <span className="font-medium">
                          {ingrediente.cantidadPorRacion} {ingrediente.unidadMedida.abreviatura}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span>{ingrediente.insumo.tipoInsumo.descTipoInsumo}</span>
                      </div>
                      
                      {ingrediente.pesoBruto && (
                        <div className="flex justify-between">
                          <span>Peso bruto:</span>
                          <span>{ingrediente.pesoBruto} g</span>
                        </div>
                      )}
                      
                      {ingrediente.pesoNeto && (
                        <div className="flex justify-between">
                          <span>Peso neto:</span>
                          <span>{ingrediente.pesoNeto} g</span>
                        </div>
                      )}
                    </div>
                    
                    {ingrediente.insumo.descripcion && (
                      <div className="mt-2 text-xs text-gray-500">
                        {ingrediente.insumo.descripcion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Este plato no tiene ingredientes configurados.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Los ingredientes son necesarios para el cálculo de insumos en los menús.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
