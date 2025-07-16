'use client'

import React, { createContext, useContext, useState } from 'react'

interface LogoutContextType {
  isLoggingOut: boolean
  setIsLoggingOut: (value: boolean) => void
  logout: () => Promise<void>
}

const LogoutContext = createContext<LogoutContextType | undefined>(undefined)

export function LogoutProvider({ children }: { children: React.ReactNode }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    try {
      // Llamar a la API de logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        // Limpiar el localStorage
        localStorage.clear()
        
        // Pequeña pausa para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirigir al login
        window.location.href = '/login'
      } else {
        console.error('Error al cerrar sesión')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <LogoutContext.Provider value={{ isLoggingOut, setIsLoggingOut, logout }}>
      {children}
    </LogoutContext.Provider>
  )
}

export function useLogout() {
  const context = useContext(LogoutContext)
  if (context === undefined) {
    throw new Error('useLogout must be used within a LogoutProvider')
  }
  return context
}
