import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, MapPin, Calendar,
         Clock, ChevronRight, RefreshCw } from 'lucide-react'
import axios from 'axios'

// ── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:     { label: 'Pending',     emoji: '⏳', badge: 'badge-pending'   },
  confirmed:   { label: 'Confirmed',   emoji: '✅', badge: 'badge-confirmed' },
  'in-progress':{ label: 'In Progress', emoji: '🔧', badge: 'badge-progress'  },
  completed:   { label: 'Completed',   emoji: '🎉', badge: 'badge-completed' },
  cancelled:   { label: 'Cancelled',   emoji: '❌', badge: 'badge-cancelled' },
}

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const s = STATUS[order.status] || STATUS.pending

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

      {/* Details */}
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
            <span>{formatDate(order.scheduledDate)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} className="text-gray-400 flex-shrink-0" />
          <span>Placed on {formatDate(order.createdAt)}</span>
        </div>
      </div>

      {/* Admin note (if any) */}
      {order.adminNote && (
        <div className="bg-ocean-50 dark:bg-ocean-950/30
                        border border-ocean-100 dark:border-ocean-900
                        rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-ocean-700 dark:text-ocean-300 font-medium mb-0.5">
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
                      bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2
                      line-clamp-2">
          {order.details}
        </p>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function OrderHistory() {
  const navigate = useNavigate()

  const [orders,   setOrders]   = useState([])
  const [filter,   setFilter]   = useState('all')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.get('/orders/my')
      setOrders(data)
    } catch (err) {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const FILTERS = [
    { key: 'all',         label: 'All'      },
    { key: 'pending',     label: 'Pending'  },
    { key: 'confirmed',   label: 'Confirmed'},
    { key: 'in-progress', label: 'Active'   },
    { key: 'completed',   label: 'Done'     },
    { key: 'cancelled',   label: 'Cancelled'},
  ]

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-icon w-9 h-9 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-extrabold text-gray-900 dark:text-white text-lg">My Orders</h1>
            <p className="text-xs text-gray-400">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={fetchOrders}
          className="btn-icon w-9 h-9 rounded-xl text-ocean-500 hover:bg-ocean-50 dark:hover:bg-ocean-950">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ─ Filter tabs ─ */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {FILTERS.map(f => (
          <button key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold
                        transition-all duration-200 whitespace-nowrap
              ${filter === f.key
                ? 'bg-ocean-600 text-white shadow-ocean'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
          >
            {f.label}
            {f.key !== 'all' && orders.filter(o => o.status === f.key).length > 0 && (
              <span className="ml-1.5 bg-white/20 text-current rounded-full px-1.5 text-[10px]">
                {orders.filter(o => o.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─ Content ─ */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-4 animate-pulse space-y-3">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          <span className="text-4xl mb-3">😕</span>
          <p className="font-semibold text-gray-700 dark:text-gray-300">{error}</p>
          <button onClick={fetchOrders} className="btn-secondary mt-4 text-sm">
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === 'all'
              ? 'Book a service to get started!'
              : 'Try a different filter'}
          </p>
          {filter === 'all' && (
            <button onClick={() => navigate('/')} className="btn-primary mt-4">
              Browse Services
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => <OrderCard key={o._id} order={o} />)}
        </div>
      )}
    </div>
  )
}
