import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, MessageSquare,
         CheckCircle2, ShoppingBag } from 'lucide-react'
import axios from 'axios'

export default function OrderForm() {
  const { id }   = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const service = location.state?.service

  const [form, setForm] = useState({
    details:       '',
    location:      '',
    scheduledDate: '',
  })
  const [loading,   setLoading]  = useState(false)
  const [error,     setError]    = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.details.trim()) { setError('Please describe your requirements.'); return }
    if (!form.location.trim()) { setError('Please provide the work location.'); return }

    setLoading(true)
    setError('')
    try {
      await axios.post('/orders', {
        serviceId:     id,
        details:       form.details,
        location:      form.location,
        scheduledDate: form.scheduledDate || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="py-4 flex flex-col items-center justify-center min-h-[70vh]
                      gap-4 animate-fade-in text-center px-4">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30
                        flex items-center justify-center animate-bounce">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Order Placed! 🎉
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
          Your request for <span className="font-semibold text-ocean-600 dark:text-ocean-400">
          {service?.name}</span> has been received. We'll confirm shortly!
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <button onClick={() => navigate('/orders')} className="btn-primary w-full">
            View My Orders
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary w-full">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Back ─ */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400
                   hover:text-ocean-600 dark:hover:text-ocean-400
                   transition-colors mb-4 font-medium text-sm">
        <ArrowLeft size={18} />
        Back
      </button>

      {/* ─ Service summary ─ */}
      {service && (
        <div className="card p-4 mb-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-ocean-50 dark:bg-ocean-950/50
                          flex items-center justify-center text-2xl flex-shrink-0">
            {service.icon || '🌊'}
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Booking</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {service.name}
            </p>
            <p className="text-xs text-ocean-600 dark:text-ocean-400 font-semibold">
              {service.price || 'Quote on request'}
            </p>
          </div>
        </div>
      )}

      {/* ─ Form ─ */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={18} className="text-ocean-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">Order Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Requirements */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <MessageSquare size={14} />
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              name="details"
              rows={4}
              placeholder="Describe your requirements, vessel details, scope of work…"
              value={form.details}
              onChange={handleChange}
              className="input-field resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <MapPin size={14} />
              Work Location <span className="text-red-500">*</span>
            </label>
            <input
              name="location"
              type="text"
              placeholder="e.g. Chittagong Port, Mongla Port…"
              value={form.location}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <Calendar size={14} />
              Preferred Date
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <input
              name="scheduledDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.scheduledDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Info box */}
          <div className="bg-ocean-50 dark:bg-ocean-950/40
                          border border-ocean-100 dark:border-ocean-900
                          rounded-xl p-3">
            <p className="text-xs text-ocean-700 dark:text-ocean-300 leading-relaxed">
              💡 After placing your order, our team will review and confirm within 24 hours.
              You'll receive a notification once confirmed.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3
                            bg-red-50 dark:bg-red-950/40
                            border border-red-200 dark:border-red-800
                            rounded-xl animate-fade-in">
              <span className="text-red-500 flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-primary w-full h-12 text-base">
            {loading ? (
              <span className="spinner border-white/40 border-t-white" />
            ) : (
              <>
                <ShoppingBag size={18} />
                Place Order
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
