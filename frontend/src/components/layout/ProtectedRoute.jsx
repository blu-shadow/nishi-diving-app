import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()

  // ── Still checking token on startup ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center
                      bg-white dark:bg-gray-950 gap-4">
        {/* Wave loader */}
        <div className="flex items-end gap-1.5 h-10">
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              className="w-2 rounded-full bg-ocean-500"
              style={{
                animation: `bounceDot 1.4s ${i * 0.15}s infinite ease-in-out`,
                height: '24px'
              }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium tracking-wide">
          Loading…
        </p>
      </div>
    )
  }

  // ── Not logged in → redirect to /login, remember where they were ──────────
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
