import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseApi } from '../services/supabaseApi'
import type { Database } from '../lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await supabaseApi.getCurrentUser()
        if (currentUser) {
          const profile = await supabaseApi.getUserProfile(currentUser.id)
          setUser(profile)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await supabaseApi.signIn(email, password)
      if (authUser) {
        const profile = await supabaseApi.getUserProfile(authUser.id)
        setUser(profile)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user: authUser } = await supabaseApi.signUp(email, password, name)
      if (authUser) {
        const profile = await supabaseApi.getUserProfile(authUser.id)
        setUser(profile)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await supabaseApi.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}