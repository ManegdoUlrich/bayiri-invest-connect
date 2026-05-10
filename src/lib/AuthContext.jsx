import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { authApi } from '@/api/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth]     = useState(true)

  // Vérifie le token stocké au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoadingAuth(false)
      return
    }
    authApi.me()
      .then(u => { setUser(u); setIsAuthenticated(true) })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoadingAuth(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await authApi.login(email, password)
    localStorage.setItem('token', token)
    setUser(u)
    setIsAuthenticated(true)
    return u
  }, [])

  const register = useCallback(async (email, password, fullName, role) => {
    const { user: u, token } = await authApi.register(email, password, fullName, role)
    localStorage.setItem('token', token)
    setUser(u)
    setIsAuthenticated(true)
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // Rafraîchit le profil après une mise à jour (onboarding, settings…)
  const refreshUser = useCallback(async () => {
    const u = await authApi.me()
    setUser(u)
    return u
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
