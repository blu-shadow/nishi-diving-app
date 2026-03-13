import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, Sun, Moon, LogOut, User,
         ChevronRight, Volume2, VolumeX, Info,
         HelpCircle, Code2, X, CheckCheck, Trash2 } from 'lucide-react'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotif } from '../../context/NotifContext'
import axios from 'axios'

// ── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Notification Panel ───────────────────────────────────────────────────────
function NotifPanel({ onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotif()

  return (
    <div className="absolute right-0 top-14 w-80 max-h-[75vh] flex flex-col
                    card shadow-xl z-50 animate-slide-down">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
                      border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-ocean-500" />
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="badge bg-ocean-100 text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-300">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead}
              className="btn-icon w-8 h-8 text-ocean-500 hover:bg-ocean-50
                         dark:hover:bg-ocean-950 rounded-lg" title="Mark all read">
              <CheckCheck size={15} />
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll}
              className="btn-icon w-8 h-8 text-red-400 hover:bg-red-50
                         dark:hover:bg-red-950 rounded-lg" title="Clear all">
              <Trash2 size={15} />
            </button>
          )}
          <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="empty-state py-10">
            <Bell size={36} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <button
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`w-full text-left px-4 py-3 border-b last:border-0
                border-gray-50 dark:border-gray-800/60
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                transition-colors duration-150
                ${!n.read ? 'bg-ocean-50/60 dark:bg-ocean-950/40' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Unread dot */}
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0
                  ${!n.read ? 'bg-ocean-500' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight
                    ${!n.read
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ── Settings Drawer ──────────────────────────────────────────────────────────
function SettingsDrawer({ onClose }) {
  const { user, logout, updateUser } = useAuth()
  const { isDark, toggleTheme }      = useTheme()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(null)
  const [notifOn,  setNotifOn]  = useState(user?.notificationsEnabled ?? true)

  useEffect(() => {
    axios.get('/upload/settings')
      .then(r => setSettings(r.data))
      .catch(() => {})
  }, [])

  const handleNotifToggle = async () => {
    const newVal = !notifOn
    setNotifOn(newVal)
    try {
      await axios.put('/users/settings', { notificationsEnabled: newVal })
      updateUser({ notificationsEnabled: newVal })
    } catch {}
  }

  const handleThemeToggle = async () => {
    toggleTheme()
    const newTheme = isDark ? 'light' : 'dark'
    try {
      await axios.put('/users/settings', { theme: newTheme })
      updateUser({ theme: newTheme })
    } catch {}
  }

  const handleLogout = () => { onClose(); logout(); navigate('/login') }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
           onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw]
                      bg-white dark:bg-gray-900
                      shadow-2xl z-50 flex flex-col
                      animate-slide-down overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4
                        border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-ocean-500" />
            <span className="font-bold text-gray-900 dark:text-white">Settings</span>
          </div>
          <button onClick={onClose} className="btn-icon w-9 h-9 rounded-xl">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2">

          {/* ─ Theme ─ */}
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark
                ? <Moon size={18} className="text-ocean-400" />
                : <Sun  size={18} className="text-yellow-500" />
              }
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-gray-400">Change appearance</p>
              </div>
            </div>
            {/* Toggle switch */}
            <button onClick={handleThemeToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                ${isDark ? 'bg-ocean-500' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                transition-transform duration-300
                ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* ─ Notifications ─ */}
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifOn
                ? <Volume2 size={18} className="text-green-500" />
                : <VolumeX size={18} className="text-gray-400" />
              }
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Notifications
                </p>
                <p className="text-xs text-gray-400">
                  {notifOn ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <button onClick={handleNotifToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                ${notifOn ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                transition-transform duration-300
                ${notifOn ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* ─ Quick links ─ */}
          {[
            { icon: HelpCircle, label: 'Help & FAQ',  path: '/help'  },
            { icon: Info,       label: 'About Us',    path: '/about' },
            { icon: User,       label: 'My Account',  path: '/account' },
          ].map(({ icon: Icon, label, path }) => (
            <button key={path}
              onClick={() => { onClose(); navigate(path) }}
              className="card w-full p-4 flex items-center justify-between
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-ocean-500" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {label}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}

          {/* ─ Developer Note ─ */}
          {settings?.devNote && (
            <div className="card p-4 bg-gradient-to-br from-ocean-50 to-blue-50
                            dark:from-ocean-950/30 dark:to-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <Code2 size={15} className="text-ocean-500" />
                <span className="text-xs font-bold text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">
                  Developer's Note
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {settings.devNote}
              </p>
            </div>
          )}

          {/* ─ App version ─ */}
          <p className="text-center text-[11px] text-gray-300 dark:text-gray-700 pt-2">
            Nishi Diving v1.0.0
          </p>
        </div>

        {/* ─ Logout ─ */}
        <div className="px-4 pb-8 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout}
            className="btn-danger w-full gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

// ── TopBar ───────────────────────────────────────────────────────────────────
export default function TopBar() {
  const { user }        = useAuth()
  const { unreadCount, isOpen: notifOpen, togglePanel, closePanel } = useNotif()

  const [showSettings, setShowSettings] = useState(false)
  const [appLogo,      setAppLogo]      = useState('')
  const [appName,      setAppName]      = useState('Nishi Diving')

  const notifRef = useRef(null)
  const navigate = useNavigate()

  // Load logo & app name
  useEffect(() => {
    axios.get('/upload/settings')
      .then(r => {
        if (r.data.logo)    setAppLogo(r.data.logo)
        if (r.data.appName) setAppName(r.data.appName)
      })
      .catch(() => {})
  }, [])

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        closePanel()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [closePanel])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 glass z-30
                         flex items-center justify-between px-4">

        {/* ── Logo + Name ────────────────────────────────────────── */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2.5 select-none">
          {appLogo ? (
            <img src={appLogo} alt="logo"
                 className="h-9 w-9 object-contain rounded-xl" />
          ) : (
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br
                            from-ocean-500 to-ocean-700
                            flex items-center justify-center shadow-ocean">
              <span className="text-white font-black text-lg leading-none">N</span>
            </div>
          )}
          <span className="font-extrabold text-gray-900 dark:text-white
                           text-lg leading-tight tracking-tight">
            {appName}
          </span>
        </button>

        {/* ── Right side icons ───────────────────────────────────── */}
        <div className="flex items-center gap-1">

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={togglePanel} className="btn-icon relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            {notifOpen && <NotifPanel onClose={closePanel} />}
          </div>

          {/* Settings */}
          <button onClick={() => setShowSettings(true)} className="btn-icon">
            <Settings size={20} />
          </button>

          {/* Profile avatar */}
          <button onClick={() => navigate('/account')}
            className="ml-1 w-9 h-9 rounded-xl overflow-hidden
                       ring-2 ring-ocean-200 dark:ring-ocean-800
                       hover:ring-ocean-400 transition-all flex-shrink-0">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="profile"
                   className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br
                              from-ocean-400 to-ocean-600
                              flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </button>

        </div>
      </header>

      {/* Settings Drawer */}
      {showSettings && <SettingsDrawer onClose={() => setShowSettings(false)} />}
    </>
  )
}
