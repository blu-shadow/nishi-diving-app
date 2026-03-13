import { MapPin, Calendar, Clock } from 'lucide-react'

const STATUS_CONFIG = {
  pending:      { label: 'Pending',     emoji: '⏳', badge: 'badge-pending'   },
  confirmed:    { label: 'Confirmed',   emoji: '✅', badge: 'badge-confirmed' },
  'in-progress':{ label: 'In Progress', emoji: '🔧', badge: 'badge-progress'  },
  completed:    { label: 'Completed',   emoji: '🎉', badge: 'badge-completed' },
  cancelled:    { label: 'Cancelled',   emoji: '❌', badge: 'badge-cancelled' },
}

function fmtDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

/**
 * OrderCard — reusable order display card for user-facing pages
 *
 * Props:
 *   order — full order object (populated with service)
 */
export default function OrderCard({ order }) {
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

  return (
    <div className="card p-4 animate-slide-up">

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-ocean-50 dark:bg-ocean-950/50
                          flex items-center justify-center text-xl flex-shrink-0">
            {order.service?.icon || '🌊'}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
              {order.service?.name || 'Service'}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              #{order._id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
        <span className={s.badge}>
          {s.emoji} {s.label}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 mb-3">
        {order.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{order.location}</span>
          </div>
        )}
        {order.scheduledDate && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="text-gray-400 flex-shrink-0" />
            <span>{fmtDate(order.scheduledDate)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} className="text-gray-400 flex-shrink-0" />
          <span>Placed {fmtDate(order.createdAt)}</span>
        </div>
      </div>

      {/* Admin note */}
      {order.adminNote && (
        <div className="bg-ocean-50 dark:bg-ocean-950/30
                        border border-ocean-100 dark:border-ocean-900
                        rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-ocean-700 dark:text-ocean-300 font-semibold mb-0.5">
            📝 Note from Admin:
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {order.adminNote}
          </p>
        </div>
      )}

      {/* Requirements preview */}
      {order.details && (
        <p className="text-xs text-gray-500 dark:text-gray-400
                      bg-gray-50 dark:bg-gray-800
                      rounded-xl px-3 py-2 line-clamp-2">
          {order.details}
        </p>
      )}
    </div>
  )
}
