import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRoute() {
  const { isLoggedIn, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center
                      bg-white dark:bg-gray-950 gap-4">
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
        <p className="text-sm text-gray-400 font-medium">Verifying access…</p>
      </div>
    )
  }

  // ── Not logged in at all → go to login ────────────────────────────────────
  if (!isLoggedIn) return <Navigate to="/login" replace />

  // ── Logged in but not admin → go to home ──────────────────────────────────
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}
