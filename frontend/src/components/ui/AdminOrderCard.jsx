import { useState } from 'react'
import { ChevronDown, MapPin, Calendar,
         User, Phone, Save, X } from 'lucide-react'
import axios from 'axios'

const STATUS_OPTIONS = [
  { value: 'pending',     label: '⏳ Pending'     },
  { value: 'confirmed',   label: '✅ Confirmed'   },
  { value: 'in-progress', label: '🔧 In Progress' },
  { value: 'completed',   label: '🎉 Completed'   },
  { value: 'cancelled',   label: '❌ Cancelled'   },
]

const BADGE = {
  pending:       'badge-pending',
  confirmed:     'badge-confirmed',
  'in-progress': 'badge-progress',
  completed:     'badge-completed',
  cancelled:     'badge-cancelled',
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

/**
 * AdminOrderCard — expandable order card with inline status editing
 *
 * Props:
 *   order     — full order object
 *   onUpdate  — callback(updatedOrder) after saving
 */
export default function AdminOrderCard({ order, onUpdate }) {
  const [open,      setOpen]      = useState(false)
  const [status,    setStatus]    = useState(order.status)
  const [adminNote, setAdminNote] = useState(order.adminNote || '')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put(`/admin/orders/${order._id}`, {
        status, adminNote
      })
      onUpdate?.(data)
      setSaved(true)
      setTimeout(() => { setSaved(false); setOpen(false) }, 1200)
    } catch (err) {
      console.error('Update order error:', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`card overflow-hidden transition-all duration-200
                     ${open ? 'shadow-ocean ring-1 ring-ocean-200 dark:ring-ocean-800' : ''}`}>

      {/* Summary */}
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
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <User size={11} />{order.user?.name || '—'}
              </p>
            </div>
            <span className={`${BADGE[order.status]} flex-shrink-0`}>
              {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            #{order._id?.slice(-6).toUpperCase()} · {fmt(order.createdAt)}
          </p>
        </div>
        <ChevronDown size={16}
          className={`text-gray-400 flex-shrink-0 mt-1
                      transition-transform duration-200
                      ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800
                        px-4 py-4 space-y-4 animate-fade-in">

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-medium mb-1">Customer</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {order.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{order.user?.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-medium mb-1 flex items-center gap-1">
                <Phone size={10} /> Phone
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {order.user?.phone || 'N/A'}
              </p>
            </div>
          </div>

          {/* Location / date */}
          {(order.location || order.scheduledDate) && (
            <div className="space-y-2">
              {order.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={14} className="text-ocean-400" />
                  {order.location}
                </div>
              )}
              {order.scheduledDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar size={14} className="text-ocean-400" />
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
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold
                              text-center transition-all border
                    ${status === opt.value
                      ? 'bg-ocean-600 text-white border-ocean-600 shadow-ocean'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <label className="input-label">Note to Customer</label>
            <textarea rows={3} value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Optional message…"
              className="input-field resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">
              <X size={15} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving
                ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
                : saved ? '✅ Saved!'
                : <><Save size={15} /> Save</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
