'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando logout...')
      await signOut()
      
      console.log('📍 Redirigiendo a login...')
      // Usar window.location.href para una redirección completa
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
      // Redirigir incluso si hay error
      window.location.href = '/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Cerrar Sesión
    </button>
  )
}