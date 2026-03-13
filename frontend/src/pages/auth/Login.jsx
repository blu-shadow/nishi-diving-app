import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Waves, ArrowRight } from 'lucide-react'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Login() {
  const { login, isLoggedIn, isAdmin } = useAuth()
  const { isDark } = useTheme()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // If already logged in → redirect
  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/')
      navigate(from, { replace: true })
    }
  }, [isLoggedIn])

  const handleChange = (e) => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await login(form)
      const dest = location.state?.from?.pathname || (data.role === 'admin' ? '/admin' : '/')
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950
                    transition-colors duration-300">

      {/* ── Top ocean wave bg ─────────────────────────────────────────────── */}
      <div className="relative h-64 bg-gradient-to-br
                      from-ocean-600 via-ocean-500 to-nishi-accent
                      overflow-hidden flex-shrink-0">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48
                        bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40
                        bg-white/10 rounded-full blur-xl" />

        {/* Logo + heading */}
        <div className="relative z-10 flex flex-col items-center
                        justify-center h-full gap-3 px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur
                          flex items-center justify-center shadow-xl ring-2 ring-white/30">
            <Waves size={32} className="text-white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Nishi Diving
            </h1>
            <p className="text-ocean-100 text-sm font-medium mt-0.5">
              Professional Diving Services
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 right-0 w-full"
             viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none">
          <path d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40 Z"
                fill={isDark ? '#030712' : '#ffffff'} />
        </svg>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-6 -mt-2 max-w-sm mx-auto w-full pb-10">

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Welcome back 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Email */}
          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none" />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10 pr-11"
              />
              <button type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-400 hover:text-gray-600
                           dark:hover:text-gray-300 transition-colors p-0.5">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3
                            bg-red-50 dark:bg-red-950/40
                            border border-red-200 dark:border-red-800
                            rounded-xl animate-fade-in">
              <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-primary w-full mt-2 h-12 text-base">
            {loading ? (
              <span className="spinner border-white/40 border-t-white" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* ─ Footer ─ */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register"
            className="text-ocean-600 dark:text-ocean-400 font-semibold
                       hover:underline underline-offset-2">
            Create one
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-6 p-3 rounded-xl bg-gray-50 dark:bg-gray-900
                        border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            🔑 Admin? Use your admin credentials to access the dashboard
          </p>
        </div>

      </div>
    </div>
  )
}
