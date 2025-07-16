'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { PlatoWithPorciones } from '@/lib/services/platoService'

export default function PlatosPage() {
  const { userSession } = useAuth()
  const [platos, setPlatos] = useState<PlatoWithPorciones[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlatos()
  }, [])

  const loadPlatos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/platos')
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPlatos(result.data || [])
        } else {
          setError(result.error || 'Error al cargar los platos')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al cargar los platos')
      }
    } catch (err) {
      console.error('Error loading platos:', err)
      setError('Error al cargar los platos')
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
          <p className="mt-4">Cargando platos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Platos</h1>
        <Link
          href="/dashboard/platos/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear Nuevo Plato
        </Link>
      </div>

      {platos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay platos registrados</p>
          <Link
            href="/dashboard/platos/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Crear Primer Plato
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {platos.map((plato) => (
            <div key={plato.idPlato} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {plato.nombre}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(plato.tipoPlato.orden)}`}>
                      {plato.tipoPlato.nombre}
                    </span>
                    {plato.esEjemplo && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        Ejemplo
                      </span>
                    )}
                  </div>
                  
                  {plato.descripcion && (
                    <p className="text-gray-600 mb-3">{plato.descripcion}</p>
                  )}
                  
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/platos/${plato.idPlato}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>

              {/* Porciones por nivel escolar */}
              {plato.porciones && plato.porciones.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Porciones por Nivel Escolar:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plato.porciones
                      .sort((a, b) => a.nivelEscolar.orden - b.nivelEscolar.orden)
                      .map((porcion) => (
                        <div key={porcion.idPorcion} className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium text-sm text-gray-800">
                            {porcion.nivelEscolar.nombre}
                          </div>
                          <div className="text-sm text-gray-600">
                            {porcion.cantidad} {porcion.unidadMedida.abreviatura}
                          </div>
                          {porcion.observaciones && (
                            <div className="text-xs text-gray-500 mt-1">
                              {porcion.observaciones}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Fechas de creación/actualización */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  {plato.createdAt && (
                    <span>
                      Creado: {new Date(plato.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {plato.updatedAt && (
                    <span>
                      Actualizado: {new Date(plato.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
