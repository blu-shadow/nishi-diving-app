/**
 * StatsWidget — reusable stat display card for admin dashboard
 *
 * Props:
 *   icon     — Lucide icon component
 *   label    — stat label string
 *   value    — number or string value
 *   color    — Tailwind bg class e.g. 'bg-ocean-500'
 *   sub      — optional sub-label
 *   onClick  — optional click handler
 */
export default function StatsWidget({ icon: Icon, label, value, color, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 flex items-center gap-3
                  ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                       flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
          {value ?? '—'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
          {label}
        </p>
        {sub && (
          <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  )
}
