import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, CheckCircle2, Tag, Layers } from 'lucide-react'
import axios from 'axios'

export default function ServiceDetail() {
  const { id }       = useParams()
  const location     = useLocation()
  const navigate     = useNavigate()

  // Use passed state first, then fetch if missing
  const [service, setService] = useState(location.state?.service || null)
  const [loading, setLoading] = useState(!service)

  useEffect(() => {
    if (service) return
    axios.get(`/services/${id}`)
      .then(r => setService(r.data))
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="py-4 space-y-4">
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="card p-5 space-y-3 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-800 mx-auto" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto" />
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (!service) return null

  const CAT_COLORS = {
    Marine:     'from-blue-500   to-ocean-600',
    Offshore:   'from-purple-500 to-indigo-600',
    Repair:     'from-orange-500 to-red-500',
    Inspection: 'from-cyan-500   to-teal-600',
    Recreation: 'from-green-500  to-emerald-600',
    Training:   'from-yellow-500 to-orange-500',
    General:    'from-ocean-500  to-ocean-700',
  }
  const grad = CAT_COLORS[service.category] || CAT_COLORS.General

  const highlights = [
    'Certified by LR, BV, RINA, IRS, KR, ABS & DNV',
    'Experienced team of professional divers',
    '24/7 inquiry and support available',
    'Serving all major ports in Bangladesh',
  ]

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Back button ─ */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400
                   hover:text-ocean-600 dark:hover:text-ocean-400
                   transition-colors mb-4 font-medium text-sm">
        <ArrowLeft size={18} />
        Back to Services
      </button>

      {/* ─ Hero card ─ */}
      <div className={`relative rounded-3xl overflow-hidden mb-4
                       bg-gradient-to-br ${grad} p-6 shadow-ocean`}>
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur
                          flex items-center justify-center text-5xl shadow-lg">
            {service.icon || '🌊'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white leading-tight">
              {service.name}
            </h1>
            <span className="inline-flex items-center gap-1 mt-1.5
                             bg-white/20 text-white text-xs font-semibold
                             px-3 py-1 rounded-full">
              <Layers size={11} />
              {service.category || 'General'}
            </span>
          </div>
        </div>
      </div>

      {/* ─ Description card ─ */}
      <div className="card p-5 mb-3">
        <h2 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📋</span> About this Service
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* ─ Pricing card ─ */}
      <div className="card p-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-ocean-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
            Pricing
          </span>
        </div>
        <span className="font-extrabold text-ocean-600 dark:text-ocean-400">
          {service.price || 'Contact for Quote'}
        </span>
      </div>

      {/* ─ Highlights ─ */}
      <div className="card p-5 mb-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-lg">⭐</span> Why Choose Us
        </h2>
        <ul className="space-y-2.5">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={16}
                className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─ CTA ─ */}
      <button
        onClick={() => navigate(`/order/${service._id}`, { state: { service } })}
        className="btn-primary w-full h-14 text-base sticky bottom-24 shadow-ocean">
        <ShoppingBag size={20} />
        Book This Service
      </button>
    </div>
  )
}
