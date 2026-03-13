import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // ── Initialize theme ────────────────────────────────────────────────────────
  // Priority: localStorage → system preference → 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nishi_theme')
    if (saved === 'dark' || saved === 'light') return saved
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  const isDark = theme === 'dark'

  // ── Apply theme class to <html> ─────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    localStorage.setItem('nishi_theme', theme)

    // Update meta theme-color for mobile browser chrome
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', isDark ? '#0a1628' : '#0e7ef5')
  }, [theme, isDark])

  // ── Toggle ──────────────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  // ── Set specific theme (used when loading user profile) ────────────────────
  const applyTheme = useCallback((t) => {
    if (t === 'dark' || t === 'light') setTheme(t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ── Custom hook ───────────────────────────────────────────────────────────────
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
