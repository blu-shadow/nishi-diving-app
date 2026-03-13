import { useLocation, useNavigate } from 'react-router-dom'
import { Home, HelpCircle, Info, User } from 'lucide-react'

const TABS = [
  { path: '/',        label: 'Home',    Icon: Home        },
  { path: '/help',    label: 'Help',    Icon: HelpCircle  },
  { path: '/about',   label: 'About',   Icon: Info        },
  { path: '/account', label: 'Account', Icon: User        },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] z-30
                    bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
                    border-t border-gray-200/60 dark:border-gray-700/60
                    shadow-nav">
      <div className="flex items-stretch h-full max-w-lg mx-auto">
        {TABS.map(({ path, label, Icon }) => {
          const active = isActive(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center gap-1
                         relative group select-none
                         transition-all duration-200 active:scale-95"
            >
              {/* Active indicator bar */}
              <span className={`absolute top-0 left-1/2 -translate-x-1/2
                h-0.5 rounded-full transition-all duration-300
                ${active
                  ? 'w-8 bg-ocean-500'
                  : 'w-0 bg-transparent'}`}
              />

              {/* Icon container */}
              <span className={`flex items-center justify-center
                w-10 h-7 rounded-xl transition-all duration-200
                ${active
                  ? 'bg-ocean-100 dark:bg-ocean-900/50 bottom-nav-active-glow'
                  : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-800'}`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={`transition-colors duration-200
                    ${active
                      ? 'text-ocean-600 dark:text-ocean-400'
                      : 'text-gray-400 dark:text-gray-500'}`}
                />
              </span>

              {/* Label */}
              <span className={`text-[10px] font-semibold leading-none
                transition-colors duration-200
                ${active
                  ? 'text-ocean-600 dark:text-ocean-400'
                  : 'text-gray-400 dark:text-gray-500'}`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
