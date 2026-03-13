import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, Clock, CheckCircle2,
         XCircle, Wrench, TrendingUp, ArrowRight,
         RefreshCw, Bell, Settings, Award } from 'lucide-react'
import axios from 'axios'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  pending:      { label: 'Pending',     emoji: '⏳', badge: 'badge-pending'   },
  confirmed:    { label: 'Confirmed',   emoji: '✅', badge: 'badge-confirmed' },
  'in-progress':{ label: 'In Progress', emoji: '🔧', badge: 'badge-progress'  },
  completed:    { label: 'Completed',   emoji: '🎉', badge: 'badge-completed' },
  cancelled:    { label: 'Cancelled',   emoji: '❌', badge: 'badge-cancelled' },
}

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                       flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
          {value ?? '—'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Recent Order Row ──────────────────────────────────────────────────────────
function OrderRow({ order, onClick }) {
  const s = STATUS[order.status] || STATUS.pending
  return (
    <button onClick={() => onClick(order._id)}
      className="w-full flex items-center justify-between gap-3 py-3
                 border-b border-gray-50 dark:border-gray-800 last:border-0
                 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-xl
                 transition-colors text-left">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-ocean-50 dark:bg-ocean-950/50
                        flex items-center justify-center text-lg flex-shrink-0">
          {order.service?.icon || '🌊'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200
                         truncate leading-tight">
            {order.user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-400 truncate">{order.service?.name}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={s.badge}>{s.emoji} {s.label}</span>
        <span className="text-[10px] text-gray-400">{timeAgo(order.createdAt)}</span>
      </div>
    </button>
  )
}

// ── Quick Action ──────────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, path, color, navigate }) {
  return (
    <button onClick={() => navigate(path)}
      className="card-hover flex flex-col items-center gap-2 p-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
        {label}
      </span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/admin/stats')
      setStats(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const statCards = stats ? [
    { icon: ShoppingBag,  label: 'Total Orders',    value: stats.totalOrders,     color: 'bg-ocean-500',   sub: 'all time' },
    { icon: Users,        label: 'Total Users',     value: stats.totalUsers,      color: 'bg-purple-500',  sub: 'registered' },
    { icon: Clock,        label: 'Pending',         value: stats.pendingOrders,   color: 'bg-yellow-500',  sub: 'needs action' },
    { icon: CheckCircle2, label: 'Completed',       value: stats.completedOrders, color: 'bg-green-500',   sub: 'all time' },
    { icon: TrendingUp,   label: 'In Progress',     value: stats.confirmedOrders, color: 'bg-blue-500',    sub: 'active' },
    { icon: XCircle,      label: 'Cancelled',       value: stats.cancelledOrders, color: 'bg-red-400',     sub: 'all time' },
  ] : []

  return (
    <div className="animate-fade-in">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Welcome back, Admin 👋
          </p>
        </div>
        <button onClick={load}
          className="btn-icon w-10 h-10 rounded-xl text-ocean-500
                     hover:bg-ocean-50 dark:hover:bg-ocean-950">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ─ Stats grid ─ */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-4 flex items-center gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-10 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map(c => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      {/* ─ Quick actions ─ */}
      <div className="mb-6">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          <QuickAction navigate={navigate} icon={ShoppingBag} label="Orders"       path="/admin/orders"        color="bg-ocean-500" />
          <QuickAction navigate={navigate} icon={Wrench}      label="Services"     path="/admin/services"      color="bg-purple-500" />
          <QuickAction navigate={navigate} icon={Bell}        label="Notify"       path="/admin/notifications" color="bg-orange-500" />
          <QuickAction navigate={navigate} icon={Settings}    label="Settings"     path="/admin/settings"      color="bg-gray-600" />
        </div>
      </div>

      {/* ─ Pending alert ─ */}
      {stats?.pendingOrders > 0 && (
        <div className="card p-4 mb-6 bg-yellow-50 dark:bg-yellow-950/30
                        border border-yellow-200 dark:border-yellow-800
                        flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
                {stats.pendingOrders} order{stats.pendingOrders > 1 ? 's' : ''} awaiting review
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Tap to review and confirm
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-1 text-yellow-700 dark:text-yellow-300
                       font-semibold text-sm hover:underline flex-shrink-0">
            View <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ─ Recent Orders ─ */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <button onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-1 text-ocean-500 text-sm font-semibold
                       hover:underline">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse py-2">
                <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : stats?.recentOrders?.length === 0 ? (
          <div className="empty-state py-8">
            <ShoppingBag size={36} className="text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
        ) : (
          stats?.recentOrders?.map(o => (
            <OrderRow key={o._id} order={o}
              onClick={() => navigate('/admin/orders')} />
          ))
        )}
      </div>

      {/* ─ Certificates shortcut ─ */}
      <button onClick={() => navigate('/admin/certificates')}
        className="card-hover w-full flex items-center justify-between p-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500
                          flex items-center justify-center">
            <Award size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
              Certificates
            </p>
            <p className="text-xs text-gray-400">Upload & manage certificates</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-gray-400" />
      </button>
    </div>
  )
}
