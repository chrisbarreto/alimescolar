import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de Supabase para el cliente con configuración optimizada para cookies
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  }
})

// Cliente de Supabase con permisos de administrador (solo para uso en servidor)
// Este solo está disponible cuando hay una clave de servicio
export const supabaseAdmin = (() => {
  // Solo crear el cliente admin si estamos en el servidor Y tenemos la clave
  if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return null
})()

// Helper function para usar en lugar de importar supabaseAdmin directamente
export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin can only be used on the server side')
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}