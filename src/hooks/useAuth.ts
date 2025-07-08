'use client'

import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { AuthService, UserSession } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const userData = await AuthService.getCurrentUser()
        setUserSession(userData)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userData = await AuthService.getCurrentUser()
          setUserSession(userData)
        } else {
          setUserSession(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    userSession,
    session,
    loading,
    isAuthenticated: !!session,
    signOut: AuthService.signOut
  }
}