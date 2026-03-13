import { useState, useEffect } from 'react'
import { Search, RefreshCw, MapPin, Calendar,
         ChevronDown, X, Save, User, Phone } from 'lucide-react'
import axios from 'axios'

const STATUSES = [
  { key: 'all',          label: 'All'         },
  { key: 'pending',      label: '⏳ Pending'   },
  { key: 'confirmed',    label: '✅ Confirmed' },
  { key: 'in-progress',  label: '🔧 Active'   },
  { key: 'completed',    label: '🎉 Done'      },
  { key: 'cancelled',    label: '❌ Cancelled' },
]

const STATUS_OPTIONS = [
  { value: 'pending',     label: '⏳ Pending'     },
  { value: 'confirmed',   label: '✅ Confirmed'   },
  { value: 'in-progress', label: '🔧 In Progress' },
  { value: 'completed',   label: '🎉 Completed'   },
  { value: 'cancelled',   label: '❌ Cancelled'   },
]

const BADGE = {
  pending:      'badge-pending',
  confirmed:    'badge-confirmed',
  'in-progress':'badge-progress',
  completed:    'badge-completed',
  cancelled:    'badge-cancelled',
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onUpdate }) {
  const [open,      setOpen]      = useState(false)
  const [status,    setStatus]    = useState(order.status)
  const [adminNote, setAdminNote] = useState(order.adminNote || '')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put(`/admin/orders/${order._id}`, { status, adminNote })
      onUpdate(data)
      setSaved(true)
      setTimeout(() => { setSaved(false); setOpen(false) }, 1200)
    } catch {}
    finally { setSaving(false) }
  }

  const current = order.status

  return (
    <div className={`card overflow-hidden transition-all duration-200
                     ${open ? 'shadow-ocean ring-1 ring-ocean-200 dark:ring-ocean-800' : ''}`}>

      {/* ─ Summary row ─ */}
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-start gap-3 p-4 text-left">
        <div className="w-11 h-11 rounded-2xl bg-ocean-50 dark:bg-ocean-950/50
                        flex items-center justify-center text-xl flex-shrink-0">
          {order.service?.icon || '🌊'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-white
                             leading-tight truncate">
                {order.service?.name || 'Service'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <User size={11} />
                {order.user?.name || '—'}
              </p>
            </div>
            <span className={`${BADGE[current]} flex-shrink-0`}>
              {STATUS_OPTIONS.find(s => s.value === current)?.label || current}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-gray-400">
              #{order._id?.slice(-6).toUpperCase()}
            </span>
            <span className="text-[11px] text-gray-400">
              {fmt(order.createdAt)}
            </span>
          </div>
        </div>
        <ChevronDown size={16}
          className={`text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200
                      ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* ─ Expanded edit panel ─ */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800
                        px-4 py-4 space-y-4 animate-fade-in">

          {/* User info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-medium mb-1 flex items-center gap-1">
                <User size={10} /> Customer
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {order.user?.name || '—'}
              </p>
              <p className="text-xs text-gray-500 truncate">{order.user?.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-medium mb-1 flex items-center gap-1">
                <Phone size={10} /> Phone
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {order.user?.phone || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Location & date */}
          {(order.location || order.scheduledDate) && (
            <div className="space-y-2">
              {order.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={14} className="text-ocean-400 flex-shrink-0" />
                  {order.location}
                </div>
              )}
              {order.scheduledDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar size={14} className="text-ocean-400 flex-shrink-0" />
                  Preferred: {fmt(order.scheduledDate)}
                </div>
              )}
            </div>
          )}

          {/* Requirements */}
          {order.details && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-medium mb-1">Requirements</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {order.details}
              </p>
            </div>
          )}

          {/* Status selector */}
          <div>
            <label className="input-label">Update Status</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold
                              text-center transition-all duration-150 border
                    ${status === opt.value
                      ? 'bg-ocean-600 text-white border-ocean-600 shadow-ocean'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <label className="input-label">Note to Customer</label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Optional message for the customer…"
              className="input-field resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)}
              className="btn-secondary flex-1">
              <X size={15} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex-1">
              {saving
                ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
                : saved
                ? '✅ Saved!'
                : <><Save size={15} /> Save</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders,  setOrders]  = useState([])
  const [filter,  setFilter]  = useState('all')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      if (search) params.search = search
      const { data } = await axios.get('/admin/orders', { params })
      setOrders(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  const handleUpdate = (updated) => {
    setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))
  }

  const filtered = search
    ? orders.filter(o =>
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o._id?.slice(-6).toLowerCase().includes(search.toLowerCase())
      )
    : orders

  return (
    <div className="animate-fade-in">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load}
          className="btn-icon w-10 h-10 rounded-xl text-ocean-500
                     hover:bg-ocean-50 dark:hover:bg-ocean-950">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ─ Search ─ */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer, service, order ID…"
          className="input-field pl-10"
        />
      </div>

      {/* ─ Filter tabs ─ */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {STATUSES.map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold
                        transition-all whitespace-nowrap
              ${filter === s.key
                ? 'bg-ocean-600 text-white shadow-ocean'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
            {s.label}
            {s.key !== 'all' && orders.filter(o => o.status === s.key).length > 0 && (
              <span className="ml-1.5 bg-white/20 rounded-full px-1.5 text-[10px]">
                {orders.filter(o => o.status === s.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─ List ─ */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 flex gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="text-5xl mb-3">📭</span>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <OrderCard key={o._id} order={o} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
