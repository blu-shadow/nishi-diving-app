import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Waves,
         ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

// ── Password strength checker ─────────────────────────────────────────────
function getStrength(pw) {
  let score = 0
  if (pw.length >= 6)                   score++
  if (pw.length >= 10)                  score++
  if (/[A-Z]/.test(pw))                 score++
  if (/[0-9]/.test(pw))                 score++
  if (/[^A-Za-z0-9]/.test(pw))          score++
  if (score <= 1) return { level: 'Weak',   color: 'bg-red-400',    w: 'w-1/4' }
  if (score <= 2) return { level: 'Fair',   color: 'bg-yellow-400', w: 'w-2/4' }
  if (score <= 3) return { level: 'Good',   color: 'bg-blue-400',   w: 'w-3/4' }
  return           { level: 'Strong', color: 'bg-green-500',  w: 'w-full' }
}

export default function Register() {
  const { register, isLoggedIn } = useAuth()
  const { isDark }    = useTheme()
  const navigate      = useNavigate()

  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true })
  }, [isLoggedIn])

  const strength = form.password ? getStrength(form.password) : null

  const handleChange = (e) => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim())           return 'Full name is required.'
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.'
    if (!form.email)                 return 'Email address is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.'
    if (!form.password)              return 'Password is required.'
    if (form.password.length < 6)   return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password })
      setSuccess(true)
      setTimeout(() => navigate('/', { replace: true }), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center
                      bg-white dark:bg-gray-950 px-6 gap-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30
                        flex items-center justify-center animate-bounce">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Account Created! 🎉
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
          Welcome to Nishi Diving. Taking you to the app…
        </p>
        <div className="flex gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-ocean-400"
              style={{ animation: `bounceDot 1.2s ${i*0.2}s infinite` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950
                    transition-colors duration-300">

      {/* ── Header banner ─────────────────────────────────────────────────── */}
      <div className="relative h-52 bg-gradient-to-br
                      from-nishi-secondary via-ocean-700 to-ocean-500
                      overflow-hidden flex-shrink-0">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 left-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />

        {/* Back button */}
        <Link to="/login"
          className="absolute top-5 left-4 flex items-center gap-1.5
                     text-white/80 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={18} />
          Sign In
        </Link>

        <div className="relative z-10 flex flex-col items-center
                        justify-center h-full gap-2 px-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur
                          flex items-center justify-center ring-2 ring-white/30">
            <Waves size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-white">Create Account</h1>
            <p className="text-ocean-200 text-xs mt-0.5">Join Nishi Diving today</p>
          </div>
        </div>

        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 40"
             fill="none" preserveAspectRatio="none">
          <path d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40 Z"
                fill={isDark ? '#030712' : '#ffffff'} />
        </svg>
      </div>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 -mt-1 max-w-sm mx-auto w-full pb-10">

        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Your details
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Fill in your information to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Full Name */}
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none" />
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Md. Rahim Uddin"
                value={form.name}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                placeholder="Min. 6 characters"
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

            {/* Strength bar */}
            {strength && (
              <div className="mt-2 space-y-1 animate-fade-in">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500
                                  ${strength.color} ${strength.w}`} />
                </div>
                <p className={`text-xs font-medium
                  ${strength.level === 'Weak'   ? 'text-red-500'   : ''}
                  ${strength.level === 'Fair'   ? 'text-yellow-500' : ''}
                  ${strength.level === 'Good'   ? 'text-blue-500'  : ''}
                  ${strength.level === 'Strong' ? 'text-green-500' : ''}`}>
                  {strength.level} password
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="input-label">Confirm Password</label>
            <div className="relative">
              <Lock size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none" />
              <input
                name="confirm"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                className={`input-field pl-10
                  ${form.confirm && form.confirm !== form.password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : form.confirm && form.confirm === form.password
                    ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                    : ''}`}
              />
              {/* Match indicator */}
              {form.confirm && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  {form.confirm === form.password ? '✅' : '❌'}
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3
                            bg-red-50 dark:bg-red-950/40
                            border border-red-200 dark:border-red-800
                            rounded-xl animate-fade-in">
              <span className="text-red-500 flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-primary w-full h-12 text-base mt-2">
            {loading ? (
              <span className="spinner border-white/40 border-t-white" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login"
            className="text-ocean-600 dark:text-ocean-400 font-semibold
                       hover:underline underline-offset-2">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
