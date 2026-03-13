import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, Settings, Sun, Moon, Volume2, VolumeX,
  HelpCircle, Info, User, LogOut, ChevronRight, Code2
} from 'lucide-react'
import axios from 'axios'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

/**
 * SettingsDrawer — slide-in settings drawer from the right
 *
 * Props:
 *   onClose — called when backdrop or X is clicked
 */
export default function SettingsDrawer({ onClose }) {
  const { user, logout, updateUser } = useAuth()
  const { isDark, toggleTheme }      = useTheme()
  const navigate = useNavigate()

  const [notifOn,  setNotifOn]  = useState(user?.notificationsEnabled ?? true)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    axios.get('/upload/settings')
      .then(r => setSettings(r.data))
      .catch(() => {})
  }, [])

  // ── Theme toggle + sync to server ─────────────────────────────────────────
  const handleThemeToggle = async () => {
    toggleTheme()
    const newTheme = isDark ? 'light' : 'dark'
    try {
      await axios.put('/users/settings', { theme: newTheme })
      updateUser({ theme: newTheme })
    } catch {}
  }

  // ── Notif toggle + sync to server ─────────────────────────────────────────
  const handleNotifToggle = async () => {
    const newVal = !notifOn
    setNotifOn(newVal)
    try {
      await axios.put('/users/settings', { notificationsEnabled: newVal })
      updateUser({ notificationsEnabled: newVal })
    } catch {}
  }

  const go = (path) => { onClose(); navigate(path) }
  const handleLogout = () => { onClose(); logout(); navigate('/login') }

  // ── Toggle Switch UI ──────────────────────────────────────────────────────
  const Toggle = ({ on, onToggle, colorOn = 'bg-ocean-500' }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300
                  ${on ? colorOn : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                        transition-transform duration-300
                        ${on ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw] z-50
                      bg-white dark:bg-gray-900
                      shadow-2xl flex flex-col
                      animate-slide-down overflow-hidden">

        {/* ─ Header ─ */}
        <div className="flex items-center justify-between
                        px-5 pt-14 pb-4
                        border-b border-gray-100 dark:border-gray-800
                        flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-ocean-500" />
            <span className="font-bold text-gray-900 dark:text-white">
              Settings
            </span>
          </div>
          <button onClick={onClose} className="btn-icon w-9 h-9 rounded-xl">
            <X size={18} />
          </button>
        </div>

        {/* ─ Content ─ */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

          {/* ── Theme ── */}
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
            <Toggle on={isDark} onToggle={handleThemeToggle} colorOn="bg-ocean-500" />
          </div>

          {/* ── Notifications ── */}
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
            <Toggle on={notifOn} onToggle={handleNotifToggle} colorOn="bg-green-500" />
          </div>

          {/* ── Quick Links ── */}
          {[
            { icon: HelpCircle, label: 'Help & FAQ',  path: '/help'    },
            { icon: Info,       label: 'About Us',    path: '/about'   },
            { icon: User,       label: 'My Account',  path: '/account' },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => go(path)}
              className="card w-full p-4 flex items-center justify-between
                         hover:bg-gray-50 dark:hover:bg-gray-800
                         transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-ocean-500" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {label}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}

          {/* ── Developer's Note ── */}
          {settings?.devNote && (
            <div className="card p-4
                            bg-gradient-to-br from-ocean-50 to-blue-50
                            dark:from-ocean-950/30 dark:to-gray-900
                            border border-ocean-100 dark:border-ocean-900">
              <div className="flex items-center gap-2 mb-2">
                <Code2 size={14} className="text-ocean-500" />
                <span className="text-xs font-bold text-ocean-600
                                 dark:text-ocean-400 uppercase tracking-wider">
                  Developer's Note
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {settings.devNote}
              </p>
            </div>
          )}

          {/* ── App version ── */}
          <p className="text-center text-[11px] text-gray-300 dark:text-gray-700 pt-2 pb-1">
            {settings?.appName || 'Nishi Diving'} · v1.0.0
          </p>
        </div>

        {/* ─ Logout ─ */}
        <div className="px-4 pb-8 pt-3
                        border-t border-gray-100 dark:border-gray-800
                        flex-shrink-0">
          <button onClick={handleLogout} className="btn-danger w-full gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
