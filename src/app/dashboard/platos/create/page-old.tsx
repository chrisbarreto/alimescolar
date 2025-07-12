'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface NivelEscolar {
  idNivelEscolar: string
  nombre: string
  descripcion: string
  orden: number
  edadMinima: number
  edadMaxima: number
}

interface UnidadMedida {
  idUnidadMedida: string
  descUnidadMedida: string
  abreviatura: string
}

interface PorcionData {
  idNivelEscolar: string
  cantidad: number
  idUnidadMedida: string
  observaciones?: string
}

interface PlatoData {
  nombre: string
  descripcion: string
  tipo: string
  preparacion: string
  energiaKcal: number
  pesoPorPorcion: number
  rendimiento: number
  observaciones: string
}

export default function CreatePlatoPage() {
  const { userSession } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [nivelesEscolares, setNivelesEscolares] = useState<NivelEscolar[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])
  
  // Estado del formulario
  const [platoData, setPlatoData] = useState<PlatoData>({
    nombre: '',
    descripcion: '',
    tipo: 'PRINCIPAL',
    preparacion: '',
    energiaKcal: 0,
    pesoPorPorcion: 0,
    rendimiento: 0,
    observaciones: ''
  })
  
  const [porciones, setPorciones] = useState<PorcionData[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Cargar niveles escolares
        const nivelesResponse = await fetch('/api/niveles-escolares')
        if (nivelesResponse.ok) {
          const nivelesData = await nivelesResponse.json()
          setNivelesEscolares(nivelesData.data || [])
          
          // Inicializar porciones con todos los niveles
          const porcionesIniciales = (nivelesData.data || []).map((nivel: NivelEscolar) => ({
            idNivelEscolar: nivel.idNivelEscolar,
            cantidad: 0,
            idUnidadMedida: '',
            observaciones: ''
          }))
          setPorciones(porcionesIniciales)
        }
        
        // Cargar unidades de medida
        const unidadesResponse = await fetch('/api/unidades-medida')
        if (unidadesResponse.ok) {
          const unidadesData = await unidadesResponse.json()
          setUnidadesMedida(unidadesData.data || [])
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handlePlatoChange = (field: keyof PlatoData, value: string | number) => {
    setPlatoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePorcionChange = (nivelId: string, field: keyof PorcionData, value: string | number) => {
    setPorciones(prev => 
      prev.map(porcion => 
        porcion.idNivelEscolar === nivelId 
          ? { ...porcion, [field]: value }
          : porcion
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userSession?.organizacion?.idOrganizacion) {
      alert('Error: No se encontró la organización')
      return
    }

    try {
      setLoading(true)
      
      // Validar que todas las porciones tengan cantidad y unidad
      const porcionesValidas = porciones.filter(p => p.cantidad > 0 && p.idUnidadMedida)
      
      if (porcionesValidas.length === 0) {
        alert('Debe agregar al menos una porción válida')
        return
      }

      const requestData = {
        ...platoData,
        idOrganizacion: userSession.organizacion.idOrganizacion,
        porciones: porcionesValidas
      }

      const response = await fetch('/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const result = await response.json()
        alert('Plato creado exitosamente')
        router.push('/dashboard/platos')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Error al crear el plato'}`)
      }
    } catch (error) {
      console.error('Error creando plato:', error)
      alert('Error al crear el plato')
    } finally {
      setLoading(false)
    }
  }

  const tiposPlato = [
    { value: 'PRINCIPAL', label: 'Plato Principal' },
    { value: 'ENSALADA', label: 'Ensalada' },
    { value: 'POSTRE', label: 'Postre' },
    { value: 'BEBIDA', label: 'Bebida' },
    { value: 'APERITIVO', label: 'Aperitivo' }
  ]

  if (loading && nivelesEscolares.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Plato</h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete la información del plato y configure las porciones para cada nivel escolar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Información básica del plato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={platoData.nombre}
                  onChange={(e) => handlePlatoChange('nombre', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Salsa de Legumbres con Arroz quesú"
                />
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                  Tipo de Plato *
                </label>
                <select
                  id="tipo"
                  required
                  value={platoData.tipo}
                  onChange={(e) => handlePlatoChange('tipo', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {tiposPlato.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  value={platoData.descripcion}
                  onChange={(e) => handlePlatoChange('descripcion', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Descripción del plato..."
                />
              </div>

              <div>
                <label htmlFor="energiaKcal" className="block text-sm font-medium text-gray-700">
                  Energía (Kcal)
                </label>
                <input
                  type="number"
                  id="energiaKcal"
                  min="0"
                  value={platoData.energiaKcal}
                  onChange={(e) => handlePlatoChange('energiaKcal', parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="rendimiento" className="block text-sm font-medium text-gray-700">
                  Rendimiento (porciones)
                </label>
                <input
                  type="number"
                  id="rendimiento"
                  min="0"
                  value={platoData.rendimiento}
                  onChange={(e) => handlePlatoChange('rendimiento', parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="preparacion" className="block text-sm font-medium text-gray-700">
                  Preparación
                </label>
                <textarea
                  id="preparacion"
                  rows={4}
                  value={platoData.preparacion}
                  onChange={(e) => handlePlatoChange('preparacion', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Instrucciones de preparación..."
                />
              </div>
            </div>

            {/* Porciones por nivel escolar */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Porciones por Nivel Escolar
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Configure la cantidad de porción para cada nivel escolar
              </p>

              <div className="space-y-4">
                {nivelesEscolares.map((nivel) => {
                  const porcion = porciones.find(p => p.idNivelEscolar === nivel.idNivelEscolar)
                  return (
                    <div key={nivel.idNivelEscolar} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {nivel.nombre.replace(/_/g, ' ')}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {nivel.edadMinima} - {nivel.edadMaxima} años
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Cantidad *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={porcion?.cantidad || 0}
                            onChange={(e) => handlePorcionChange(
                              nivel.idNivelEscolar, 
                              'cantidad', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Unidad de Medida *
                          </label>
                          <select
                            value={porcion?.idUnidadMedida || ''}
                            onChange={(e) => handlePorcionChange(
                              nivel.idNivelEscolar, 
                              'idUnidadMedida', 
                              e.target.value
                            )}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Seleccionar...</option>
                            {unidadesMedida.map(unidad => (
                              <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                                {unidad.descUnidadMedida} ({unidad.abreviatura})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Observaciones
                          </label>
                          <input
                            type="text"
                            value={porcion?.observaciones || ''}
                            onChange={(e) => handlePorcionChange(
                              nivel.idNivelEscolar, 
                              'observaciones', 
                              e.target.value
                            )}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            placeholder="Observaciones..."
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Observaciones generales */}
            <div className="border-t border-gray-200 pt-6">
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                Observaciones Generales
              </label>
              <textarea
                id="observaciones"
                rows={3}
                value={platoData.observaciones}
                onChange={(e) => handlePlatoChange('observaciones', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard/platos')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Plato'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
