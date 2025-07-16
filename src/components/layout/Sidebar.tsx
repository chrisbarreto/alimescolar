'use client'

import { useState } from 'react'
import { useSidebar } from '@/context/SidebarContext'
import { useDashboard } from '@/context/DashboardContext'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/context/LogoutContext'
import { 
  DashboardIcon, 
  UsersIcon, 
  ChartIcon, 
  SettingsIcon, 
  LogoutIcon,
  FoodIcon,
  InventoryIcon,
  OrganizationIcon,
  CloseIcon
} from '@/components/icons'

// Icono de chevron para submenús
const ChevronIcon = ({ isOpen, className = "w-4 h-4" }: { isOpen: boolean, className?: string }) => (
  <svg 
    className={`${className} transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// Tipos para la estructura del menú
interface SubMenuItem {
  name: string
  section: string
  subSection: string
  badge?: string
  badgeColor?: string
}

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  section?: string
  subSection?: string
  subItems?: SubMenuItem[]
  badge?: string
  badgeColor?: string
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const menuStructure: MenuGroup[] = [
  {
    title: "MENU",
    items: [
      {
        name: "Dashboard",
        icon: DashboardIcon,
        subItems: [
          { name: "Principal", section: "dashboard", subSection: "principal" },
          { name: "Analíticas", section: "dashboard", subSection: "analytics", badge: "PRO", badgeColor: "blue" },
          { name: "Estadísticas", section: "dashboard", subSection: "stats", badge: "NEW", badgeColor: "green" }
        ]
      },
      {
        name: "Platos",
        icon: FoodIcon,
        subItems: [
          { name: "Lista de Platos", section: "platos", subSection: "list-platos" },
          { name: "Crear Plato", section: "platos", subSection: "create-plato" },
          { name: "Gestionar Porciones", section: "platos", subSection: "porciones" }
        ]
      },
      {
        name: "Gestión de Menús",
        icon: FoodIcon,
        subItems: [
          { name: "Lista de Menús", section: "menus", subSection: "list-menus" },
          { name: "Crear Menú", section: "menus", subSection: "create-menu" },
          { name: "Planificación", section: "menus", subSection: "planning", badge: "PRO", badgeColor: "blue" }
        ]
      },
      {
        name: "Inventario",
        icon: InventoryIcon,
        subItems: [
          { name: "Productos", section: "inventario", subSection: "productos" },
          { name: "Stock", section: "inventario", subSection: "stock", badge: "NEW", badgeColor: "green" },
          { name: "Proveedores", section: "inventario", subSection: "proveedores" }
        ]
      }
    ]
  },
  {
    title: "ADMINISTRACIÓN",
    items: [
      {
        name: "Organizaciones",
        icon: OrganizationIcon,
        subItems: [
          { name: "Lista de Organizaciones", section: "organizaciones", subSection: "list-organizaciones" },
          { name: "Crear Organización", section: "organizaciones", subSection: "create-organizacion" }
        ]
      },
      {
        name: "Usuarios",
        icon: UsersIcon,
        subItems: [
          { name: "Lista de Usuarios", section: "usuarios", subSection: "list-usuarios" },
          { name: "Crear Usuario", section: "usuarios", subSection: "create-usuario" },
          { name: "Roles", section: "usuarios", subSection: "roles", badge: "PRO", badgeColor: "blue" }
        ]
      }
    ]
  },
  {
    title: "REPORTES",
    items: [
      {
        name: "Reportes",
        icon: ChartIcon,
        subItems: [
          { name: "Ventas", section: "reportes", subSection: "ventas" },
          { name: "Inventario", section: "reportes", subSection: "inventario-report" },
          { name: "Nutricional", section: "reportes", subSection: "nutricional" }
        ]
      },
      {
        name: "Configuración",
        icon: SettingsIcon,
        section: "configuracion",
        subSection: "general"
      }
    ]
  }
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const { currentSection, currentSubSection, setCurrentSection } = useDashboard()
  const { userSession } = useAuth()
  const { isLoggingOut, logout } = useLogout()
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const handleNavigation = (section: string, subSection: string) => {
    setCurrentSection(section as any, subSection as any)
  }

  const isSubmenuOpen = (itemName: string) => openSubmenus.includes(itemName)

  const handleLogout = async () => {
    await logout()
  }

  const getBadgeStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium'
      case 'green':
        return 'bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium'
      case 'purple':
        return 'bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium'
      default:
        return 'bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium'
    }
  }

  return (
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white shadow-xl border-r border-gray-200 flex-shrink-0
        ${sidebarOpen ? 'block' : 'hidden'} lg:block
        fixed inset-y-0 left-0 z-50 lg:static lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Header del sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">AlimEscolar</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <CloseIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {menuStructure.map((group, groupIndex) => (
            <div key={group.title} className={groupIndex > 0 ? 'mt-8' : ''}>
              {/* Título del grupo */}
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {group.title}
              </div>

              {/* Items del grupo */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const hasSubItems = item.subItems && item.subItems.length > 0
                  const isOpen = isSubmenuOpen(item.name)
                  
                  // Si no tiene subitems, es un enlace directo
                  if (!hasSubItems && item.section) {
                    const isActive = currentSection === item.section && currentSubSection === item.subSection
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.section!, item.subSection || 'principal')}
                        className={`
                          flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className={getBadgeStyles(item.badgeColor || 'blue')}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  }

                  // Si tiene subitems, es un menú colapsable
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                      >
                        <Icon className="mr-3 h-5 w-5 text-gray-400" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className={getBadgeStyles(item.badgeColor || 'blue')}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronIcon isOpen={isOpen} className="ml-2 h-4 w-4 text-gray-400" />
                      </button>

                      {/* Submenú */}
                      {isOpen && item.subItems && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isActive = currentSection === subItem.section && currentSubSection === subItem.subSection
                            return (
                              <button
                                key={subItem.name}
                                onClick={() => handleNavigation(subItem.section, subItem.subSection)}
                                className={`
                                  flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200
                                  ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }
                                `}
                              >
                                <span className="flex-1 text-left">{subItem.name}</span>
                                {subItem.badge && (
                                  <span className={getBadgeStyles(subItem.badgeColor || 'blue')}>
                                    {subItem.badge}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-gray-200 p-4">
          {/* Información del usuario */}
          <div className="flex items-center px-3 py-2 text-sm bg-gray-50 rounded-lg mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-semibold text-sm">
                {userSession?.persona.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">
                {userSession?.persona.nombre}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userSession?.organizacion.razonSocial}
              </p>
            </div>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
              ${isLoggingOut 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50'
              }
            `}
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-3"></div>
                Cerrando...
              </>
            ) : (
              <>
                <LogoutIcon className="mr-3 h-4 w-4" />
                Cerrar Sesión
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
