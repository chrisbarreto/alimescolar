'use client'

import { MenuIcon, BellIcon } from '@/components/icons'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { toggleSidebar } = useSidebar()
  const { userSession } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Lado izquierdo - Botón de menú y título */}
        <div className="flex items-center space-x-4">
          {/* Botón de menú (solo visible en móvil) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Título de la página */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema de Alimentación Escolar
            </h1>
            <p className="text-xs text-gray-500">
              Gestión integral de menús y nutrición
            </p>
          </div>
        </div>

        {/* Lado derecho - Notificaciones y usuario */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors">
            <BellIcon className="h-6 w-6" />
            {/* Badge de notificaciones */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Información del usuario (solo desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {userSession?.persona.nombre} {userSession?.persona.apellido}
              </p>
              <p className="text-xs text-gray-500">
                {userSession?.organizacion.razonSocial}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userSession?.persona.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
