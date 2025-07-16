'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { PlatoWithPorciones } from '@/lib/services/platoService'

interface PlatosSectionProps {
  subSection?: string
}

interface NivelEscolar {
  idNivelEscolar: string
  nombre: string
  descripcion: string
  orden: number
}

interface UnidadMedida {
  idUnidadMedida: string
  descUnidadMedida: string
  abreviatura: string
}

interface TipoPlato {
  idTipoPlato: number
  nombre: string
  descripcion?: string
  orden: number
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
  esEjemplo: boolean
  idTipoPlato: number
}

// Componente para mostrar la lista de platos
function PlatosList({ onCreateNew }: { onCreateNew: () => void }) {
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
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando platos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Lista de Platos</h2>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear Nuevo Plato
        </button>
      </div>

      {platos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay platos registrados</p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Crear Primer Plato
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {platos.map((plato) => (
            <div key={plato.idPlato} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plato.nombre}</h3>
                  {plato.descripcion && (
                    <p className="text-gray-600 mb-2">{plato.descripcion}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(plato.tipoPlato.orden)}`}>
                      {plato.tipoPlato.nombre}
                    </span>
                    {plato.esEjemplo && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Ejemplo
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/platos/${plato.idPlato}`}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>

              {plato.porciones && plato.porciones.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Porciones:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {plato.porciones.map((porcion) => (
                      <div key={porcion.nivelEscolar.idNivelEscolar} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <span className="font-medium">{porcion.nivelEscolar.nombre}:</span> {porcion.cantidad} {porcion.unidadMedida.abreviatura}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente para crear un nuevo plato
function CreatePlatoForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
  const { userSession } = useAuth()
  const [loading, setLoading] = useState(false)
  const [nivelesEscolares, setNivelesEscolares] = useState<NivelEscolar[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])
  const [tiposPlato, setTiposPlato] = useState<TipoPlato[]>([])
  
  // Estados del formulario
  const [platoData, setPlatoData] = useState<PlatoData>({
    nombre: '',
    descripcion: '',
    esEjemplo: false,
    idTipoPlato: 1
  })

  const [porciones, setPorciones] = useState<PorcionData[]>([])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Cargar niveles escolares
      const nivelesResponse = await fetch('/api/niveles-escolares')
      const nivelesData = await nivelesResponse.json()
      if (nivelesData.success) {
        setNivelesEscolares(nivelesData.data)
        
        // Inicializar porciones con un registro por cada nivel escolar
        const porcionesIniciales = nivelesData.data.map((nivel: NivelEscolar) => ({
          idNivelEscolar: nivel.idNivelEscolar,
          cantidad: 0,
          idUnidadMedida: '',
          observaciones: ''
        }))
        setPorciones(porcionesIniciales)
      }

      // Cargar unidades de medida
      const unidadesResponse = await fetch('/api/unidades-medida')
      const unidadesData = await unidadesResponse.json()
      if (unidadesData.success) {
        setUnidadesMedida(unidadesData.data)
        
        // Establecer gramos como unidad por defecto
        const gramosUnit = unidadesData.data.find((u: UnidadMedida) => u.abreviatura === 'g')
        if (gramosUnit) {
          setPorciones(prev => prev.map(p => ({ ...p, idUnidadMedida: gramosUnit.idUnidadMedida })))
        }
      }

      // Cargar tipos de plato
      const tiposResponse = await fetch('/api/tipos-plato')
      const tiposData = await tiposResponse.json()
      if (tiposData.success) {
        setTiposPlato(tiposData.data)
        if (tiposData.data.length > 0) {
          setPlatoData(prev => ({ ...prev, idTipoPlato: tiposData.data[0].idTipoPlato }))
        }
      }

    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error al cargar los datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const updatePorcion = (index: number, field: keyof PorcionData, value: any) => {
    setPorciones(prev => prev.map((porcion, i) => 
      i === index ? { ...porcion, [field]: value } : porcion
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!platoData.nombre.trim()) {
      alert('El nombre del plato es requerido')
      return
    }

    // Validar que al menos una porción tenga cantidad > 0
    const porcionesValidas = porciones.filter(p => p.cantidad > 0 && p.idUnidadMedida)
    if (porcionesValidas.length === 0) {
      alert('Debe definir al menos una porción válida')
      return
    }

    try {
      setLoading(true)

      const payload = {
        ...platoData,
        porciones: porcionesValidas
      }

      const response = await fetch('/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        alert('Plato creado exitosamente')
        onSuccess()
      } else {
        console.error('Error response:', result)
        alert(result.error || 'Error al crear el plato')
      }
    } catch (error) {
      console.error('Error creating plato:', error)
      alert('Error al crear el plato')
    } finally {
      setLoading(false)
    }
  }

  if (loading && nivelesEscolares.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando formulario...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Plato</h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Volver a la lista
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica del plato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Plato *
            </label>
            <input
              type="text"
              value={platoData.nombre}
              onChange={(e) => setPlatoData({...platoData, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Plato *
            </label>
            <select
              value={platoData.idTipoPlato}
              onChange={(e) => setPlatoData({...platoData, idTipoPlato: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {tiposPlato.map((tipo) => (
                <option key={tipo.idTipoPlato} value={tipo.idTipoPlato}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={platoData.descripcion}
              onChange={(e) => setPlatoData({...platoData, descripcion: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={platoData.esEjemplo}
                onChange={(e) => setPlatoData({...platoData, esEjemplo: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">¿Es un plato de ejemplo?</span>
            </label>
          </div>
        </div>

        {/* Porciones por nivel escolar */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Porciones por Nivel Escolar
          </h3>
          
          <div className="space-y-4">
            {nivelesEscolares.map((nivel, index) => (
              <div key={nivel.idNivelEscolar} className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-3">
                  {nivel.nombre}
                  {nivel.descripcion && (
                    <span className="text-sm text-gray-600 ml-2">({nivel.descripcion})</span>
                  )}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={porciones[index]?.cantidad || ''}
                      onChange={(e) => updatePorcion(index, 'cantidad', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidad
                    </label>
                    <select
                      value={porciones[index]?.idUnidadMedida || ''}
                      onChange={(e) => updatePorcion(index, 'idUnidadMedida', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar unidad</option>
                      {unidadesMedida.map((unidad) => (
                        <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                          {unidad.descUnidadMedida} ({unidad.abreviatura})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <input
                      type="text"
                      value={porciones[index]?.observaciones || ''}
                      onChange={(e) => updatePorcion(index, 'observaciones', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Plato'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Componente principal de la sección de platos
export default function PlatosSection({ subSection }: PlatosSectionProps) {
  const [currentView, setCurrentView] = useState<'lista' | 'crear'>('lista')

  // Cambiar vista basado en la subsección
  useEffect(() => {
    if (subSection === 'crear') {
      setCurrentView('crear')
    } else {
      setCurrentView('lista')
    }
  }, [subSection])

  const handleCreateNew = () => {
    setCurrentView('crear')
  }

  const handleCancelCreate = () => {
    setCurrentView('lista')
  }

  const handleCreateSuccess = () => {
    setCurrentView('lista')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Platos</h1>
        <p className="text-gray-600 mt-1">
          Administra los platos disponibles en el sistema
        </p>
      </div>

      {currentView === 'lista' ? (
        <PlatosList onCreateNew={handleCreateNew} />
      ) : (
        <CreatePlatoForm 
          onCancel={handleCancelCreate} 
          onSuccess={handleCreateSuccess} 
        />
      )}
    </div>
  )
}
