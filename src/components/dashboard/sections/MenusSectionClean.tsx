'use client'

import React, { useState, useEffect } from 'react'
import { DashboardSubSection } from '@/context/DashboardContext'

interface MenusSectionProps {
  subSection: DashboardSubSection
}

interface Escuela {
  idEscuela: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  organizacion: {
    idOrganizacion: string;
    nombre: string;
  };
}

interface Plato {
  idPlato: string;
  nombre: string;
  descripcion?: string;
  tipoPlato: {
    nombre: string;
    orden: number;
  };
}

interface MenuDia {
  fecha: string;
  cantidadRaciones: number;
  observaciones?: string;
  platos: {
    idPlato: string;
    orden: number;
  }[];
}

interface MenuSemanal {
  idMenuSemanal: string;
  semana: string;
  observaciones?: string;
  escuela: {
    nombre: string;
  };
  menuDias: {
    idMenuDia: string;
    fecha: string;
    cantidadRaciones: number;
    observaciones?: string;
    platos: {
      idPlato: string;
      nombre: string;
      tipo: string;
      orden: number;
    }[];
  }[];
}

interface InsumoCalculado {
  idInsumo: string;
  nombreInsumo: string;
  cantidadTotal: number;
  unidadMedida: string;
  abreviatura: string;
  tipoInsumo: string;
  detallesPorDia: {
    fecha: string;
    cantidadRaciones: number;
    cantidadInsumo: number;
    platos: string[];
  }[];
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
        return <CreateMenuComponent />
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
      return 'Crear Nuevo Menú'
  }
}

function CreateMenuComponent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingCatalogos, setLoadingCatalogos] = useState(true)

  // Estados para catálogos
  const [escuelas, setEscuelas] = useState<Escuela[]>([])
  const [platos, setPlatos] = useState<Plato[]>([])
  const [menusSemanaless, setMenusSemanales] = useState<MenuSemanal[]>([])

  // Estados del formulario
  const [selectedEscuela, setSelectedEscuela] = useState<string>('')
  const [semanaInicio, setSemanaInicio] = useState<string>('')
  const [observacionesMenu, setObservacionesMenu] = useState<string>('')
  
  // Estados para menús diarios
  const [menusDia, setMenusDia] = useState<MenuDia[]>([])
  
  // Estados para cálculo de insumos
  const [insumosCalculados, setInsumosCalculados] = useState<InsumoCalculado[]>([])
  const [menuSeleccionadoParaInsumos, setMenuSeleccionadoParaInsumos] = useState<string>('')

  useEffect(() => {
    cargarCatalogos()
  }, [])

  const cargarCatalogos = async () => {
    setLoadingCatalogos(true)
    try {
      // Cargar escuelas
      const escuelasResponse = await fetch('/api/menus?action=escuelas')
      const escuelasData = await escuelasResponse.json()
      if (escuelasData.success) {
        setEscuelas(escuelasData.data)
      }

      // Cargar platos
      const platosResponse = await fetch('/api/platos')
      const platosData = await platosResponse.json()
      if (platosData.success) {
        setPlatos(platosData.data)
      }
    } catch (error) {
      console.error('Error cargando catálogos:', error)
      alert('Error al cargar los catálogos')
    } finally {
      setLoadingCatalogos(false)
    }
  }

  const cargarMenusEscuela = async (idEscuela: string) => {
    try {
      const response = await fetch(`/api/menus?idEscuela=${idEscuela}`)
      const data = await response.json()
      if (data.success) {
        setMenusSemanales(data.data)
      }
    } catch (error) {
      console.error('Error cargando menús:', error)
    }
  }

  const inicializarSemana = () => {
    if (!semanaInicio) return

    const fechaInicio = new Date(semanaInicio)
    const menusSemana: MenuDia[] = []

    // Generar 7 días a partir de la fecha de inicio
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaInicio)
      fecha.setDate(fechaInicio.getDate() + i)
      
      menusSemana.push({
        fecha: fecha.toISOString().split('T')[0],
        cantidadRaciones: 0,
        observaciones: '',
        platos: []
      })
    }

    setMenusDia(menusSemana)
    setCurrentStep(2)
  }

  const agregarPlatoADia = (indiceDia: number, idPlato: string) => {
    if (!idPlato) return

    const nuevosMenus = [...menusDia]
    const orden = nuevosMenus[indiceDia].platos.length + 1
    
    // Verificar que el plato no esté ya agregado
    const platoExiste = nuevosMenus[indiceDia].platos.find(p => p.idPlato === idPlato)
    if (platoExiste) {
      alert('Este plato ya está agregado para este día')
      return
    }

    nuevosMenus[indiceDia].platos.push({
      idPlato,
      orden
    })

    setMenusDia(nuevosMenus)
  }

  const removerPlatoDeDia = (indiceDia: number, indiceePlato: number) => {
    const nuevosMenus = [...menusDia]
    nuevosMenus[indiceDia].platos.splice(indiceePlato, 1)
    
    // Reordenar los platos restantes
    nuevosMenus[indiceDia].platos = nuevosMenus[indiceDia].platos.map((plato, index) => ({
      ...plato,
      orden: index + 1
    }))

    setMenusDia(nuevosMenus)
  }

  const actualizarCantidadRaciones = (indiceDia: number, cantidad: number) => {
    const nuevosMenus = [...menusDia]
    nuevosMenus[indiceDia].cantidadRaciones = cantidad
    setMenusDia(nuevosMenus)
  }

  const calcularInsumos = async (idMenuSemanal: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/menus?action=calcular-insumos&idMenuSemanal=${idMenuSemanal}`)
      const data = await response.json()
      
      if (data.success) {
        setInsumosCalculados(data.data.insumos)
        setMenuSeleccionadoParaInsumos(idMenuSemanal)
        setCurrentStep(4)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error calculando insumos:', error)
      alert('Error de conexión al calcular insumos')
    } finally {
      setLoading(false)
    }
  }

  const generarOrdenCompra = async (idMenuSemanal: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generar-orden-compra',
          idMenuSemanal,
          observaciones: `Orden generada automáticamente para menú semanal del ${new Date().toLocaleDateString()}`
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`¡Orden de compra generada exitosamente!\n\nID: ${data.data.idOrdenCompra}\nTotal de insumos: ${data.data.totalInsumos}\nFecha: ${data.data.fechaOrden}`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error generando orden de compra:', error)
      alert('Error de conexión al generar orden de compra')
    } finally {
      setLoading(false)
    }
  }

  const guardarMenuSemanal = async () => {
    if (!selectedEscuela || !semanaInicio) {
      alert('Por favor, selecciona una escuela y fecha de inicio')
      return
    }

    // Validar que al menos un día tenga platos
    const diasConPlatos = menusDia.filter(dia => dia.platos.length > 0 && dia.cantidadRaciones > 0)
    if (diasConPlatos.length === 0) {
      alert('Por favor, agrega al menos un plato a un día con cantidad de raciones mayor a 0')
      return
    }

    setLoading(true)
    try {
      // 1. Crear el menú semanal
      const escuelaSeleccionada = escuelas.find(e => e.idEscuela === selectedEscuela)
      const responseMenu = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'crear-menu-semanal',
          semana: semanaInicio,
          idEscuela: selectedEscuela,
          idOrganizacion: escuelaSeleccionada?.organizacion.idOrganizacion,
          observaciones: observacionesMenu
        })
      })

      const menuData = await responseMenu.json()
      
      if (!menuData.success) {
        alert(`Error creando menú semanal: ${menuData.error}`)
        return
      }

      const idMenuSemanal = menuData.data.idMenuSemanal

      // 2. Crear cada día con platos
      for (const dia of diasConPlatos) {
        const responseDia = await fetch('/api/menus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'crear-menu-dia-completo',
            idMenuSemanal,
            menuDia: {
              fecha: dia.fecha,
              cantidadRaciones: dia.cantidadRaciones,
              observaciones: dia.observaciones
            },
            platos: dia.platos
          })
        })

        const diaData = await responseDia.json()
        if (!diaData.success) {
          console.error(`Error creando día ${dia.fecha}:`, diaData.error)
        }
      }

      alert('¡Menú semanal creado exitosamente!')
      
      // Resetear formulario
      setSelectedEscuela('')
      setSemanaInicio('')
      setObservacionesMenu('')
      setMenusDia([])
      setCurrentStep(1)
      
      // Recargar menús de la escuela
      if (selectedEscuela) {
        cargarMenusEscuela(selectedEscuela)
      }

    } catch (error) {
      console.error('Error guardando menú:', error)
      alert('Error de conexión al guardar el menú')
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (fecha: string) => {
    const date = new Date(fecha)
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[date.getDay()]
  }

  const getPlatoNombre = (idPlato: string) => {
    const plato = platos.find(p => p.idPlato === idPlato)
    return plato ? plato.nombre : 'Plato no encontrado'
  }

  if (loadingCatalogos) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-gray-500">Cargando catálogos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <div className="ml-2 text-sm">
                {step === 1 && 'Configuración Inicial'}
                {step === 2 && 'Planificación Semanal'}
                {step === 3 && 'Menús Creados'}
                {step === 4 && 'Cálculo de Insumos'}
              </div>
              {step < 4 && <div className="mx-4 w-12 h-0.5 bg-gray-200"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Paso 1: Configuración Inicial */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            📅 Crear Nuevo Menú Semanal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escuela
              </label>
              <select
                value={selectedEscuela}
                onChange={(e) => {
                  setSelectedEscuela(e.target.value)
                  if (e.target.value) {
                    cargarMenusEscuela(e.target.value)
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar escuela...</option>
                {escuelas.map((escuela) => (
                  <option key={escuela.idEscuela} value={escuela.idEscuela}>
                    {escuela.nombre} - {escuela.ciudad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio de la semana
              </label>
              <input
                type="date"
                value={semanaInicio}
                onChange={(e) => setSemanaInicio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (opcional)
              </label>
              <textarea
                value={observacionesMenu}
                onChange={(e) => setObservacionesMenu(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones sobre el menú semanal..."
              />
            </div>

            <button
              onClick={inicializarSemana}
              disabled={!selectedEscuela || !semanaInicio}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continuar a Planificación
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Planificación Semanal */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              👨‍🍳 Planificación Semanal
            </h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menusDia.map((dia, indiceDia) => (
              <div key={dia.fecha} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                  {getDayName(dia.fecha)} - {new Date(dia.fecha).toLocaleDateString()}
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    👥 Cantidad de raciones
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dia.cantidadRaciones}
                    onChange={(e) => actualizarCantidadRaciones(indiceDia, parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 150"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agregar plato
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        agregarPlatoADia(indiceDia, e.target.value)
                        e.target.value = '' // Reset select
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar plato...</option>
                    {platos.map((plato) => (
                      <option key={plato.idPlato} value={plato.idPlato}>
                        {plato.nombre} ({plato.tipoPlato.nombre})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lista de platos agregados */}
                <div className="space-y-2">
                  {dia.platos.map((plato, indicePlato) => (
                    <div key={indicePlato} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm">
                        {indicePlato + 1}. {getPlatoNombre(plato.idPlato)}
                      </span>
                      <button
                        onClick={() => removerPlatoDeDia(indiceDia, indicePlato)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <button
              onClick={guardarMenuSemanal}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : 'Guardar Menú Semanal'}
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Menús Creados */}
      {currentStep === 3 && selectedEscuela && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              📄 Menús Semanales - {escuelas.find(e => e.idEscuela === selectedEscuela)?.nombre}
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                + Nuevo Menú
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {menusSemanaless.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay menús semanales creados para esta escuela
              </p>
            ) : (
              menusSemanaless.map((menu) => (
                <div key={menu.idMenuSemanal} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Semana del {new Date(menu.semana).toLocaleDateString()}
                      </h3>
                      {menu.observaciones && (
                        <p className="text-gray-600 text-sm mt-1">{menu.observaciones}</p>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => calcularInsumos(menu.idMenuSemanal)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        🧮 Calcular Insumos
                      </button>
                      <button
                        onClick={() => generarOrdenCompra(menu.idMenuSemanal)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        📄 Generar Orden
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
                    {menu.menuDias.map((dia) => (
                      <div key={dia.idMenuDia} className="bg-gray-50 p-2 rounded text-xs">
                        <div className="font-medium">{getDayName(dia.fecha)}</div>
                        <div className="text-gray-600">{new Date(dia.fecha).getDate()}</div>
                        <div className="text-gray-600">{dia.cantidadRaciones} raciones</div>
                        <div className="mt-1 space-y-1">
                          {dia.platos.map((plato) => (
                            <div key={plato.idPlato} className="text-gray-800">
                              {plato.nombre}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Paso 4: Cálculo de Insumos */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              🧮 Insumos Calculados
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Volver a Menús
              </button>
              <button
                onClick={() => generarOrdenCompra(menuSeleccionadoParaInsumos)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📄 Generar Orden de Compra
              </button>
            </div>
          </div>

          {insumosCalculados.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay insumos calculados
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Resumen</h3>
                <p className="text-blue-700">
                  Total de insumos diferentes: <strong>{insumosCalculados.length}</strong>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insumo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Días de uso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {insumosCalculados.map((insumo) => (
                      <tr key={insumo.idInsumo}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {insumo.nombreInsumo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.tipoInsumo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {insumo.cantidadTotal.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.abreviatura}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.detallesPorDia.length} días
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón flotante para ir a ver menús existentes */}
      {currentStep === 1 && selectedEscuela && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setCurrentStep(3)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            📊
          </button>
        </div>
      )}
    </div>
  )
}

function ListMenusComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Lista de Menús</h2>
      <p className="text-gray-500">Esta funcionalidad estará disponible pronto.</p>
    </div>
  )
}

function MenuPlanningComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Planificación de Menús</h2>
      <p className="text-gray-500">Esta funcionalidad estará disponible pronto.</p>
    </div>
  )
}
