import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// ── Axios default base URL ───────────────────────────────────────────────────
axios.defaults.baseURL = '/api'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('nishi_token') || null)
  const [loading, setLoading] = useState(true)  // initial auth check

  // ── Set auth header whenever token changes ─────────────────────────────────
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('nishi_token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('nishi_token')
    }
  }, [token])

  // ── On mount: fetch profile if token exists ────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await axios.get('/users/profile')
        setUser(data)
      } catch {
        // Token expired or invalid → clear everything
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, []) // run once on mount

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await axios.post('/auth/register', { name, email, password })
    setToken(data.token)
    setUser({
      _id:        data._id,
      name:       data.name,
      email:      data.email,
      role:       data.role,
      profilePic: data.profilePic || '',
      theme:      data.theme || 'light',
      notificationsEnabled: data.notificationsEnabled ?? true,
    })
    return data
  }, [])

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const { data } = await axios.post('/auth/login', { email, password })
    setToken(data.token)
    setUser({
      _id:        data._id,
      name:       data.name,
      email:      data.email,
      role:       data.role,
      profilePic: data.profilePic || '',
      theme:      data.theme || 'light',
      notificationsEnabled: data.notificationsEnabled ?? true,
    })
    return data
  }, [])

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // ── Update local user state (after profile edit) ───────────────────────────
  const updateUser = useCallback((updated) => {
    setUser(prev => ({ ...prev, ...updated }))
  }, [])

  // ── Refresh profile from server ────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/users/profile')
      setUser(data)
    } catch (err) {
      console.error('refreshUser error:', err.message)
    }
  }, [])

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!user && !!token

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAdmin,
      isLoggedIn,
      register,
      login,
      logout,
      updateUser,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Custom hook ───────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
