import { Bell, CheckCheck, Trash2, X } from 'lucide-react'
import { useNotif } from '../../context/NotifContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/**
 * NotificationPanel — dropdown panel showing user notifications
 *
 * Props:
 *   onClose — called when X is clicked or item is tapped
 */
export default function NotificationPanel({ onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotif()

  return (
    <div className="absolute right-0 top-14 w-80 max-h-[75vh] flex flex-col
                    card shadow-xl z-50 animate-slide-down">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between px-4 py-3
                      border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-ocean-500" />
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="badge bg-ocean-100 text-ocean-700
                             dark:bg-ocean-900/40 dark:text-ocean-300">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead}
              className="btn-icon w-8 h-8 rounded-lg text-ocean-500
                         hover:bg-ocean-50 dark:hover:bg-ocean-950"
              title="Mark all read">
              <CheckCheck size={15} />
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll}
              className="btn-icon w-8 h-8 rounded-lg text-red-400
                         hover:bg-red-50 dark:hover:bg-red-950"
              title="Clear all">
              <Trash2 size={15} />
            </button>
          )}
          <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ─ List ─ */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="empty-state py-10">
            <Bell size={36} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map(n => (
            <button
              key={n._id}
              onClick={() => { markAsRead(n._id); onClose?.() }}
              className={`w-full text-left px-4 py-3
                          border-b last:border-0
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
                  <p className="text-xs text-gray-500 dark:text-gray-400
                                mt-0.5 leading-relaxed">
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
