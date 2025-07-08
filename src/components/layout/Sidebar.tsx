'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/hooks/useAuth'
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
  href: string
  badge?: string
  badgeColor?: string
}

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
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
          { name: "Principal", href: "/dashboard" },
          { name: "Analíticas", href: "/dashboard/analytics", badge: "PRO", badgeColor: "blue" },
          { name: "Estadísticas", href: "/dashboard/stats", badge: "NEW", badgeColor: "green" }
        ]
      },
      {
        name: "Gestión de Menús",
        icon: FoodIcon,
        subItems: [
          { name: "Crear Menú", href: "/dashboard/menus/create" },
          { name: "Lista de Menús", href: "/dashboard/menus" },
          { name: "Planificación", href: "/dashboard/menus/planning", badge: "PRO", badgeColor: "blue" }
        ]
      },
      {
        name: "Inventario",
        icon: InventoryIcon,
        subItems: [
          { name: "Productos", href: "/dashboard/inventario/productos" },
          { name: "Stock", href: "/dashboard/inventario/stock", badge: "NEW", badgeColor: "green" },
          { name: "Proveedores", href: "/dashboard/inventario/proveedores" }
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
          { name: "Escuelas", href: "/dashboard/organizaciones/escuelas" },
          { name: "Distritos", href: "/dashboard/organizaciones/distritos" },
          { name: "Regiones", href: "/dashboard/organizaciones/regiones" }
        ]
      },
      {
        name: "Usuarios",
        icon: UsersIcon,
        subItems: [
          { name: "Gestionar Usuarios", href: "/dashboard/usuarios" },
          { name: "Roles", href: "/dashboard/usuarios/roles", badge: "PRO", badgeColor: "blue" },
          { name: "Permisos", href: "/dashboard/usuarios/permisos", badge: "PRO", badgeColor: "blue" }
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
          { name: "Nutricional", href: "/dashboard/reportes/nutricional" },
          { name: "Financiero", href: "/dashboard/reportes/financiero", badge: "PRO", badgeColor: "blue" },
          { name: "Consumo", href: "/dashboard/reportes/consumo" }
        ]
      },
      {
        name: "Configuración",
        icon: SettingsIcon,
        href: "/dashboard/configuracion"
      }
    ]
  }
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const { userSession } = useAuth()
  const pathname = usePathname()
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isSubmenuOpen = (itemName: string) => openSubmenus.includes(itemName)

  const handleLogout = async () => {
    try {
      const { AuthService } = await import('@/lib/auth')
      await AuthService.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
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
                  if (!hasSubItems && item.href) {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={getBadgeStyles(item.badgeColor || 'blue')}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
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
                            const isActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`
                                  flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200
                                  ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="flex-1">{subItem.name}</span>
                                {subItem.badge && (
                                  <span className={getBadgeStyles(subItem.badgeColor || 'blue')}>
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
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
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <LogoutIcon className="mr-3 h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}
