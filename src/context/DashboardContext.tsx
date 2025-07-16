'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Tipos para las secciones del dashboard
export type DashboardSection = 
  | 'dashboard' 
  | 'platos'
  | 'menus' 
  | 'inventario'
  | 'organizaciones'
  | 'usuarios'
  | 'reportes'
  | 'configuracion'

export type DashboardSubSection = 
  | 'principal'
  | 'analytics'
  | 'stats'
  | 'create-plato'
  | 'list-platos'
  | 'porciones'
  | 'create-menu'
  | 'list-menus'
  | 'planning'
  | 'productos'
  | 'stock'
  | 'proveedores'
  | 'list-organizaciones'
  | 'create-organizacion'
  | 'list-usuarios'
  | 'create-usuario'
  | 'roles'
  | 'ventas'
  | 'inventario-report'
  | 'nutricional'
  | 'general'
  | 'seguridad'
  | 'notificaciones'

interface DashboardContextType {
  currentSection: DashboardSection
  currentSubSection: DashboardSubSection
  setCurrentSection: (section: DashboardSection, subSection?: DashboardSubSection) => void
  navigationHistory: Array<{ section: DashboardSection; subSection: DashboardSubSection }>
  goBack: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

interface DashboardProviderProps {
  children: ReactNode
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [currentSection, setCurrentSectionState] = useState<DashboardSection>('dashboard')
  const [currentSubSection, setCurrentSubSectionState] = useState<DashboardSubSection>('principal')
  const [navigationHistory, setNavigationHistory] = useState<Array<{ section: DashboardSection; subSection: DashboardSubSection }>>([
    { section: 'dashboard', subSection: 'principal' }
  ])

  const setCurrentSection = (section: DashboardSection, subSection?: DashboardSubSection) => {
    // Determinar la subsección por defecto para cada sección
    const defaultSubSections: Record<DashboardSection, DashboardSubSection> = {
      dashboard: 'principal',
      platos: 'list-platos',
      menus: 'list-menus',
      inventario: 'productos',
      organizaciones: 'list-organizaciones',
      usuarios: 'list-usuarios',
      reportes: 'ventas',
      configuracion: 'general'
    }

    const targetSubSection = subSection || defaultSubSections[section]

    // Actualizar estado
    setCurrentSectionState(section)
    setCurrentSubSectionState(targetSubSection)

    // Agregar a historial si es diferente al actual
    const currentState = { section, subSection: targetSubSection }
    const lastState = navigationHistory[navigationHistory.length - 1]
    
    if (!lastState || lastState.section !== section || lastState.subSection !== targetSubSection) {
      setNavigationHistory(prev => [...prev, currentState])
    }
  }

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1)
      const previousState = newHistory[newHistory.length - 1]
      
      setNavigationHistory(newHistory)
      setCurrentSectionState(previousState.section)
      setCurrentSubSectionState(previousState.subSection)
    }
  }

  return (
    <DashboardContext.Provider value={{
      currentSection,
      currentSubSection,
      setCurrentSection,
      navigationHistory,
      goBack
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
