import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Wrench, Users,
  Settings, Award, Bell, Menu, X,
  LogOut, ChevronRight, ExternalLink
} from 'lucide-react'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  { path: '/admin',               label: 'Dashboard',     Icon: LayoutDashboard, exact: true },
  { path: '/admin/orders',        label: 'Orders',        Icon: ShoppingBag  },
  { path: '/admin/services',      label: 'Services',      Icon: Wrench       },
  { path: '/admin/users',         label: 'Users',         Icon: Users        },
  { path: '/admin/certificates',  label: 'Certificates',  Icon: Award        },
  { path: '/admin/notifications', label: 'Send Notif',    Icon: Bell         },
  { path: '/admin/settings',      label: 'App Settings',  Icon: Settings     },
]

function SidebarContent({ onClose }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { logout, user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path)

  const go = (path) => { navigate(path); onClose?.() }
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-full">

      {/* ─ Brand ─ */}
      <div className="px-4 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br
                          from-ocean-500 to-ocean-700
                          flex items-center justify-center shadow-ocean flex-shrink-0">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 dark:text-white leading-tight">
              Nishi Diving
            </p>
            <p className="text-xs text-ocean-500 font-semibold">Admin Panel</p>
          </div>
        </div>
        {/* Admin badge */}
        <div className="mt-4 px-3 py-2 rounded-xl bg-ocean-50 dark:bg-ocean-950/50
                        flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ocean-200 dark:bg-ocean-800
                          flex items-center justify-center flex-shrink-0">
            <span className="text-ocean-700 dark:text-ocean-300 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-ocean-500 font-semibold">Administrator</p>
          </div>
        </div>
      </div>

      {/* ─ Nav links ─ */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, Icon, exact }) => {
          const active = isActive({ path, exact })
          return (
            <button
              key={path}
              onClick={() => go(path)}
              className={`admin-nav-item w-full ${active ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} className="opacity-50" />}
            </button>
          )
        })}

        <div className="divider" />

        {/* View User App */}
        <button onClick={() => go('/')}
          className="admin-nav-item w-full text-green-600 dark:text-green-400
                     hover:bg-green-50 dark:hover:bg-green-950">
          <ExternalLink size={18} />
          <span className="flex-1 text-left">View User App</span>
        </button>
      </nav>

      {/* ─ Bottom: theme + logout ─ */}
      <div className="px-3 pb-6 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button onClick={toggleTheme}
          className="admin-nav-item w-full">
          <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={handleLogout}
          className="admin-nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Get current page title
  const currentNav = NAV_ITEMS.find(n =>
    n.exact
      ? location.pathname === n.path
      : location.pathname.startsWith(n.path)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">

      {/* ── Desktop Sidebar ────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0
                        bg-white dark:bg-gray-900
                        border-r border-gray-100 dark:border-gray-800
                        fixed left-0 top-0 h-full z-20">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
               onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-72 z-50 md:hidden
                            bg-white dark:bg-gray-900
                            shadow-2xl animate-slide-down">
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 btn-icon">
              <X size={20} />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Mobile top header */}
        <header className="md:hidden sticky top-0 glass z-30
                           flex items-center justify-between px-4 h-14">
          <button onClick={() => setMobileOpen(true)} className="btn-icon">
            <Menu size={22} />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">
            {currentNav?.label ?? 'Admin'}
          </span>
          <div className="w-9" /> {/* spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
