'use client'

import React, { useState, useEffect } from 'react'
import { DashboardSubSection } from '@/context/DashboardContext'
import { generarPDFOrdenCompra } from '../utils/pdfGenerator'

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

      // Cargar platos desde la API de menús
      const platosResponse = await fetch('/api/menus?action=platos')
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
      console.log('Cargando menús para escuela (CreateMenuComponent):', idEscuela)
      const response = await fetch(`/api/menus?idEscuela=${idEscuela}`)
      const data = await response.json()
      
      console.log('Respuesta de menús (CreateMenuComponent):', data)
      
      if (data.success) {
        // Verificar que los datos tengan la estructura correcta
        const menusConDatos = data.data.map((menu: any) => {
          console.log('Menú individual (CreateMenuComponent):', menu)
          return {
            ...menu,
            menuDias: menu.menuDias || []
          }
        })
        
        setMenusSemanales(menusConDatos)
        console.log('Menús cargados (CreateMenuComponent):', menusConDatos.length)
      }
    } catch (error) {
      console.error('Error cargando menús (CreateMenuComponent):', error)
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

    // Validar datos antes de enviar
    console.log('Datos a enviar:')
    console.log('Selected escuela:', selectedEscuela)
    console.log('Semana inicio:', semanaInicio)
    console.log('Días con platos:', diasConPlatos)
    
    // Validar que todos los platos tengan IDs válidos
    for (const dia of diasConPlatos) {
      for (const plato of dia.platos) {
        if (!plato.idPlato || plato.idPlato.trim() === '') {
          alert(`Error: Se encontró un plato sin ID válido en el día ${dia.fecha}`)
          return
        }
      }
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
        console.error('Error del servidor:', menuData);
        alert(`Error creando menú semanal: ${menuData.error}${menuData.details ? '\n\nDetalles: ' + JSON.stringify(menuData.details) : ''}`)
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
          console.error(`Error creando día ${dia.fecha}:`, diaData)
          alert(`Error creando día ${dia.fecha}: ${diaData.error}${diaData.details ? '\n\nDetalles: ' + JSON.stringify(diaData.details) : ''}`)
          // Continuar con los otros días aunque uno falle
        } else {
          console.log(`Día ${dia.fecha} creado exitosamente`)
        }
      }

      alert('¡Menú semanal creado exitosamente!')
      
      // Resetear formulario
      setSelectedEscuela('')
      setSemanaInicio('')
      setObservacionesMenu('')
      setMenusDia([])
      setCurrentStep(1)
      
      // Recargar menús de la escuela después de un pequeño delay para asegurar que el servidor termine de procesar
      if (selectedEscuela) {
        console.log('Recargando menús después de crear menú semanal...')
        setTimeout(() => {
          cargarMenusEscuela(selectedEscuela)
        }, 1000)
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
                    <div key={`${indiceDia}-${plato.idPlato}-${indicePlato}`} className="flex justify-between items-center bg-gray-50 p-2 rounded">
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

                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
                    {menu.menuDias.map((dia) => (
                      <div key={dia.idMenuDia} className="bg-gray-50 p-3 rounded-lg shadow-sm border min-h-[160px]">
                        <div className="font-semibold text-sm text-gray-800 mb-1">{getDayName(dia.fecha)}</div>
                        <div className="text-gray-600 text-xs mb-1">{new Date(dia.fecha).getDate()}</div>
                        <div className="text-blue-600 text-xs font-medium mb-2">👥 {dia.cantidadRaciones}</div>
                        <div className="mt-2 space-y-1">
                          {dia.platos.map((plato) => (
                            <div key={`${dia.idMenuDia}-${plato.idPlato}`} className="text-gray-800 text-xs leading-relaxed">
                              <span className="font-medium text-blue-700">•</span> {plato.nombre}
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
  const [loading, setLoading] = useState(false)
  const [escuelas, setEscuelas] = useState<Escuela[]>([])
  const [selectedEscuela, setSelectedEscuela] = useState<string>('')
  const [menusSemanales, setMenusSemanales] = useState<MenuSemanal[]>([])
  const [insumosCalculados, setInsumosCalculados] = useState<InsumoCalculado[]>([])
  const [menuSeleccionadoParaInsumos, setMenuSeleccionadoParaInsumos] = useState<string>('')
  const [mostrarInsumos, setMostrarInsumos] = useState(false)

  // Función simplificada para generar PDF de orden de compra
  const descargarPDFOrdenCompra = async (idMenuSemanal: string) => {
    setLoading(true)
    try {
      // Primero calcular los insumos
      console.log('Calculando insumos para PDF:', idMenuSemanal)
      const response = await fetch(`/api/menus?action=calcular-insumos&idMenuSemanal=${idMenuSemanal}`)
      const data = await response.json()
      
      console.log('Respuesta completa del API:', data)
      
      if (!data.success) {
        alert(`Error calculando insumos: ${data.error}`)
        return
      }

      const insumos = data.data.insumos
      console.log('Insumos recibidos:', insumos)
      
      if (!insumos || insumos.length === 0) {
        alert('No se encontraron insumos para este menú. Verifique que el menú tenga platos con insumos configurados.')
        return
      }

      // Obtener información del menú y escuela
      const menu = menusSemanales.find(m => m.idMenuSemanal === idMenuSemanal)
      const escuela = escuelas.find(e => e.idEscuela === selectedEscuela)
      
      console.log('Información del menú:', menu)
      console.log('Información de la escuela:', escuela)
      
      if (!menu || !escuela) {
        alert('No se pudo obtener la información del menú o escuela')
        return
      }

      // Preparar datos para el PDF
      const menuInfo = { 
        semana: menu.semana, 
        idMenuSemanal: menu.idMenuSemanal 
      }
      const escuelaInfo = { 
        nombre: escuela.nombre, 
        ciudad: escuela.ciudad 
      }
      
      console.log('Datos preparados para PDF:', { insumos, menuInfo, escuelaInfo })

      // Generar el PDF usando la función externa
      await generarPDFOrdenCompra(insumos, menuInfo, escuelaInfo)

      alert('PDF generado exitosamente')
      
    } catch (error) {
      console.error('Error detallado generando PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
      alert(`Error al generar el PDF de orden de compra: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEscuelas()
  }, [])

  const cargarEscuelas = async () => {
    try {
      const response = await fetch('/api/menus?action=escuelas')
      const data = await response.json()
      if (data.success) {
        setEscuelas(data.data)
      }
    } catch (error) {
      console.error('Error cargando escuelas:', error)
    }
  }

  const cargarMenusEscuela = async (idEscuela: string) => {
    if (!idEscuela) {
      setMenusSemanales([])
      return
    }

    setLoading(true)
    try {
      console.log('Cargando menús para escuela:', idEscuela)
      const response = await fetch(`/api/menus?idEscuela=${idEscuela}`)
      const data = await response.json()
      
      console.log('Respuesta de menús:', data)
      
      if (data.success) {
        // Verificar que los datos tengan la estructura correcta
        const menusConDatos = data.data.map((menu: any) => {
          console.log('Menú individual:', menu)
          console.log('Días del menú:', menu.menuDias)
          return {
            ...menu,
            menuDias: menu.menuDias || []
          }
        })
        
        setMenusSemanales(menusConDatos)
        console.log('Menús cargados:', menusConDatos.length)
      } else {
        console.error('Error en la respuesta:', data.error)
        setMenusSemanales([])
      }
    } catch (error) {
      console.error('Error cargando menús:', error)
      setMenusSemanales([])
    } finally {
      setLoading(false)
    }
  }

  const calcularInsumos = async (idMenuSemanal: string) => {
    setLoading(true)
    try {
      console.log('Iniciando cálculo de insumos para menú:', idMenuSemanal)
      const response = await fetch(`/api/menus?action=calcular-insumos&idMenuSemanal=${idMenuSemanal}`)
      const data = await response.json()
      
      console.log('Respuesta del servidor:', data)
      
      if (data.success) {
        if (data.data && data.data.insumos && data.data.insumos.length > 0) {
          setInsumosCalculados(data.data.insumos)
          setMenuSeleccionadoParaInsumos(idMenuSemanal)
          setMostrarInsumos(true)
          console.log('Insumos calculados exitosamente:', data.data.insumos.length)
        } else {
          alert('No se encontraron insumos para este menú. Verifique que:\n1. El menú tenga días con platos\n2. Los platos tengan insumos configurados\n3. Las porciones estén definidas correctamente')
          console.log('No hay insumos en la respuesta:', data.data)
        }
      } else {
        alert(`Error calculando insumos: ${data.error}`)
        console.error('Error en el cálculo:', data.error)
      }
    } catch (error) {
      console.error('Error calculando insumos:', error)
      alert('Error de conexión al calcular insumos')
    } finally {
      setLoading(false)
    }
  }

  const calcularYGenerarOrden = async (idMenuSemanal: string) => {
    setLoading(true)
    try {
      // Primero calcular los insumos
      console.log('Calculando insumos para menú:', idMenuSemanal)
      const responseInsumos = await fetch(`/api/menus?action=calcular-insumos&idMenuSemanal=${idMenuSemanal}`)
      const dataInsumos = await responseInsumos.json()
      
      if (!dataInsumos.success) {
        alert(`Error calculando insumos: ${dataInsumos.error}`)
        return
      }

      const insumosCalculados = dataInsumos.data.insumos
      console.log('Insumos calculados:', insumosCalculados)

      if (!insumosCalculados || insumosCalculados.length === 0) {
        alert('No se encontraron insumos para este menú. Verifique que el menú tenga platos con insumos configurados.')
        return
      }

      // Luego generar la orden de compra con los insumos
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generar-orden-compra',
          idMenuSemanal,
          insumos: insumosCalculados,
          observaciones: `Orden generada desde lista de menús el ${new Date().toLocaleDateString()}. Total de insumos: ${insumosCalculados.length}`
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`¡Orden de compra generada exitosamente!\n\nID: ${data.data.idOrdenCompra}\nTotal de insumos: ${data.data.totalInsumos || insumosCalculados.length}\nFecha: ${data.data.fechaOrden}`)
        
        // Actualizar la lista de menús para reflejar cambios
        if (selectedEscuela) {
          cargarMenusEscuela(selectedEscuela)
        }
      } else {
        alert(`Error generando orden: ${data.error}`)
      }
    } catch (error) {
      console.error('Error en el proceso de orden de compra:', error)
      alert('Error de conexión al generar orden de compra')
    } finally {
      setLoading(false)
    }
  }

  const generarOrdenCompra = async (idMenuSemanal: string) => {
    // Si ya tenemos insumos calculados para este menú, usar esos datos
    if (menuSeleccionadoParaInsumos === idMenuSemanal && insumosCalculados && insumosCalculados.length > 0) {
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
            insumos: insumosCalculados,
            observaciones: `Orden generada desde lista de menús el ${new Date().toLocaleDateString()}. Total de insumos: ${insumosCalculados.length}`
          })
        })

        const data = await response.json()
        
        if (data.success) {
          alert(`¡Orden de compra generada exitosamente!\n\nID: ${data.data.idOrdenCompra}\nTotal de insumos: ${data.data.totalInsumos || insumosCalculados.length}\nFecha: ${data.data.fechaOrden}`)
          
          // Actualizar la lista de menús
          if (selectedEscuela) {
            cargarMenusEscuela(selectedEscuela)
          }
        } else {
          alert(`Error: ${data.error}`)
        }
      } catch (error) {
        console.error('Error generando orden de compra:', error)
        alert('Error de conexión al generar orden de compra')
      } finally {
        setLoading(false)
      }
    } else {
      // Si no tenemos insumos calculados, calcular primero y luego generar
      await calcularYGenerarOrden(idMenuSemanal)
    }
  }

  const probarConexionAPI = async (idMenuSemanal: string) => {
    try {
      console.log('=== PRUEBA DIRECTA DE API ===')
      console.log('Probando API para menú ID:', idMenuSemanal)
      
      // Probar la llamada de cálculo de insumos que debería mostrar la estructura del menú
      const response = await fetch(`/api/menus?action=calcular-insumos&idMenuSemanal=${idMenuSemanal}`)
      const data = await response.json()
      
      console.log('Respuesta completa de calcular-insumos:', data)
      
      if (data.success) {
        console.log('✅ API responde correctamente')
        if (data.data && data.data.menu) {
          console.log('📊 Estructura del menú en la respuesta:', data.data.menu)
          console.log('📅 Días encontrados:', data.data.menu.menuDias?.length || 0)
        }
        if (data.data && data.data.insumos) {
          console.log('🥗 Insumos calculados:', data.data.insumos.length)
        }
      } else {
        console.log('❌ Error en API:', data.error)
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error)
    }
  }

  const getDayName = (fecha: string) => {
    const date = new Date(fecha)
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[date.getDay()]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          📋 Lista de Menús
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Escuela
          </label>
          <select
            value={selectedEscuela}
            onChange={(e) => {
              setSelectedEscuela(e.target.value)
              cargarMenusEscuela(e.target.value)
              setMostrarInsumos(false)
              setInsumosCalculados([])
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar escuela...</option>
            {escuelas && escuelas.map((escuela) => (
              <option key={escuela.idEscuela} value={escuela.idEscuela}>
                {escuela.nombre} - {escuela.ciudad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Menús */}
      {selectedEscuela && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Menús de {escuelas.find(e => e.idEscuela === selectedEscuela)?.nombre}
            </h3>
            <div className="flex items-center space-x-2">
              {mostrarInsumos && (
                <button
                  onClick={() => setMostrarInsumos(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Volver a Menús
                </button>
              )}
              {!mostrarInsumos && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => cargarMenusEscuela(selectedEscuela)}
                    disabled={loading}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:bg-gray-400"
                  >
                    {loading ? '🔄' : '🔄 Recargar'}
                  </button>
                  <button
                    onClick={() => {
                      console.log('=== DIAGNÓSTICO DETALLADO ===')
                      console.log('ID Escuela seleccionada:', selectedEscuela)
                      console.log('Menús cargados:', menusSemanales)
                      console.log('Cantidad de menús:', menusSemanales.length)
                      menusSemanales.forEach((menu, index) => {
                        console.log(`Menú ${index + 1}:`, {
                          id: menu.idMenuSemanal,
                          semana: menu.semana,
                          diasCount: menu.menuDias ? menu.menuDias.length : 'undefined',
                          dias: menu.menuDias
                        })
                      })
                      alert('Revisa la consola del navegador (F12) para ver el diagnóstico completo')
                    }}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                  >
                    🔍 Diagnóstico
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Cargando...</p>
            </div>
          )}

          {!loading && !mostrarInsumos && (
            <div className="space-y-4">
              {!menusSemanales || menusSemanales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay menús semanales para esta escuela
                </p>
              ) : (
                menusSemanales.map((menu) => (
                  <div key={menu.idMenuSemanal} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          📅 Semana del {new Date(menu.semana).toLocaleDateString()}
                        </h4>
                        {menu.observaciones && (
                          <p className="text-gray-600 text-sm mt-1">{menu.observaciones}</p>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                          Total de días: {menu.menuDias ? menu.menuDias.length : 0}
                          {menu.menuDias && menu.menuDias.length === 0 && (
                            <span className="text-orange-600 ml-2">⚠️ Sin días configurados</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {menu.idMenuSemanal}
                        </div>
                      </div>
                      <div className="space-x-2 space-y-2">
                        <button
                          onClick={() => calcularInsumos(menu.idMenuSemanal)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 block w-full"
                        >
                          {loading ? '🔄 Calculando...' : '🧮 Ver Insumos'}
                        </button>
                        <button
                          onClick={() => calcularYGenerarOrden(menu.idMenuSemanal)}
                          disabled={loading}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 block w-full"
                        >
                          {loading ? '⏳ Procesando...' : '📄 Calcular y Generar Orden'}
                        </button>
                        <button
                          onClick={() => descargarPDFOrdenCompra(menu.idMenuSemanal)}
                          disabled={loading}
                          className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:bg-gray-400 block w-full"
                        >
                          {loading ? '📄 Generando...' : '📄 Descargar PDF Orden'}
                        </button>
                      </div>
                    </div>

                    {/* Vista previa de los días */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                      {menu.menuDias && menu.menuDias.length > 0 ? (
                        menu.menuDias.map((dia) => (
                          <div key={dia.idMenuDia} className="bg-gray-50 p-4 rounded-lg shadow-sm border min-h-[180px]">
                            <div className="font-semibold text-center mb-2 text-sm text-gray-800">
                              {getDayName(dia.fecha)}
                            </div>
                            <div className="text-gray-600 text-center mb-3 text-xs">
                              {new Date(dia.fecha).toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: '2-digit' 
                              })}
                            </div>
                            <div className="text-blue-600 text-center mb-3 font-medium text-xs">
                              👥 {dia.cantidadRaciones}
                            </div>
                            <div className="space-y-2">
                              {dia.platos && dia.platos.slice(0, 3).map((plato, index) => (
                                <div key={`${dia.idMenuDia}-${plato.nombre}-${index}`} className="text-gray-800 text-xs leading-relaxed">
                                  <span className="font-medium text-blue-700">•</span> {plato.nombre}
                                </div>
                              ))}
                              {dia.platos && dia.platos.length > 3 && (
                                <div className="text-gray-500 italic text-xs">
                                  +{dia.platos.length - 3} más...
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <p className="text-yellow-800 text-sm">
                            ⚠️ Este menú no tiene días configurados o los datos no se cargaron correctamente.
                          </p>
                          <p className="text-yellow-600 text-xs mt-1">
                            Intente recargar la página o contacte al administrador.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Vista de Insumos Calculados */}
          {!loading && mostrarInsumos && insumosCalculados && insumosCalculados.length > 0 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  🧮 Insumos Calculados para Menú Semanal
                </h4>
                <div className="text-blue-700 space-y-1">
                  <p>Total de insumos diferentes: <strong>{insumosCalculados.length}</strong></p>
                  <p className="text-sm">Menú ID: {menuSeleccionadoParaInsumos}</p>
                  <p className="text-sm">Calculado el: {new Date().toLocaleString()}</p>
                </div>
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => generarOrdenCompra(menuSeleccionadoParaInsumos)}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? '� Generando...' : '�📄 Generar Orden de Compra'}
                  </button>
                  <button
                    onClick={() => calcularInsumos(menuSeleccionadoParaInsumos)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    🔄 Recalcular
                  </button>
                </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {insumo.cantidadTotal.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.abreviatura}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.detallesPorDia ? insumo.detallesPorDia.length : 0} días
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">
                              Ver detalles
                            </summary>
                            <div className="mt-2 space-y-1">
                              {insumo.detallesPorDia && insumo.detallesPorDia.map((detalle, index) => (
                                <div key={`${insumo.idInsumo}-${detalle.fecha}-${index}`} className="text-xs">
                                  <strong>{new Date(detalle.fecha).toLocaleDateString()}:</strong> {detalle.cantidadInsumo.toFixed(3)} {insumo.abreviatura} 
                                  ({detalle.cantidadRaciones} raciones)
                                  <div className="text-gray-400 ml-2">
                                    Platos: {detalle.platos && detalle.platos.join(', ')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
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
