import { ChevronRight } from 'lucide-react'

const CAT_COLORS = {
  Marine:     'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  Offshore:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Repair:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Inspection: 'bg-cyan-100   text-cyan-700   dark:bg-cyan-900/40   dark:text-cyan-300',
  Recreation: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  Training:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  General:    'bg-gray-100   text-gray-700   dark:bg-gray-800      dark:text-gray-300',
}

/**
 * ServiceCard — reusable card for a single service
 *
 * Props:
 *   service  — { _id, name, icon, description, category, price }
 *   onClick  — click handler (receives service._id)
 */
export default function ServiceCard({ service, onClick }) {
  const catColor = CAT_COLORS[service.category] || CAT_COLORS.General

  return (
    <button
      onClick={() => onClick?.(service._id)}
      className="card-hover w-full text-left p-4 flex items-start gap-3 group"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-ocean-50 dark:bg-ocean-950/50
                      flex items-center justify-center text-2xl flex-shrink-0
                      group-hover:scale-110 transition-transform duration-200">
        {service.icon || '🌊'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm
                         leading-tight line-clamp-1">
            {service.name}
          </h3>
          <ChevronRight
            size={16}
            className="text-gray-300 dark:text-gray-600 flex-shrink-0
                       group-hover:text-ocean-500 group-hover:translate-x-0.5
                       transition-all duration-200"
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400
                      leading-relaxed line-clamp-2 mb-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <span className={`badge text-[10px] ${catColor}`}>
            {service.category || 'General'}
          </span>
          <span className="text-[11px] font-semibold text-ocean-600 dark:text-ocean-400">
            {service.price || 'Get Quote'}
          </span>
        </div>
      </div>
    </button>
  )
}
