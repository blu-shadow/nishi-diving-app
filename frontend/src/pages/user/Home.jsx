import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Waves, Star, Clock } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

// ── Fallback services if DB is empty ────────────────────────────────────────
const FALLBACK = [
  { _id: '1', name: 'Salvage Operations',            icon: '⚓', category: 'Marine',     description: 'Recovery of ships, cargo or property after maritime accidents.' },
  { _id: '2', name: 'Offshore Operations',            icon: '🛢️', category: 'Offshore',   description: 'Underwater inspections, repairs and support for offshore structures.' },
  { _id: '3', name: 'Propeller Repair',               icon: '🔧', category: 'Repair',     description: 'Expert underwater propeller repairs and polishing services.' },
  { _id: '4', name: 'CCTV Class Inspection',          icon: '📷', category: 'Inspection', description: 'High-quality underwater CCTV inspections for vessel integrity.' },
  { _id: '5', name: 'Underwater Welding',             icon: '⚡', category: 'Repair',     description: 'Professional underwater welding for structural repairs.' },
  { _id: '6', name: 'ICCP Replacement',               icon: '🔋', category: 'Repair',     description: 'Corrosion protection system replacement for vessels.' },
  { _id: '7', name: 'UWILD Inspection',               icon: '🔍', category: 'Inspection', description: 'Underwater Inspection in Lieu of Dry-Docking. Approved by LR, BV, DNV.' },
  { _id: '8', name: 'Blanking & Cofferdam',           icon: '🛡️', category: 'Marine',     description: 'Blanking, plugging and cofferdam installation services.' },
  { _id: '9', name: 'River Training',                 icon: '🌊', category: 'Marine',     description: 'River training services across Bangladesh.' },
  { _id: '10', name: 'Recreational Scuba Diving',     icon: '🤿', category: 'Recreation', description: 'Scuba diving at Cox\'s Bazar, Saint Martin & Kaptai Lake.' },
  { _id: '11', name: 'Underwater Welding Course',     icon: '🎓', category: 'Training',   description: 'Professional underwater welding & cutting training course.' },
]

// ── Category colors ──────────────────────────────────────────────────────────
const CAT_COLORS = {
  Marine:     'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  Offshore:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Repair:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Inspection: 'bg-cyan-100   text-cyan-700   dark:bg-cyan-900/40   dark:text-cyan-300',
  Recreation: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  Training:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  General:    'bg-gray-100   text-gray-700   dark:bg-gray-800      dark:text-gray-300',
}

function getCatColor(cat) {
  return CAT_COLORS[cat] || CAT_COLORS.General
}

// ── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, onPress }) {
  return (
    <button onClick={() => onPress(service._id)}
      className="card-hover w-full text-left p-4 flex items-start gap-3
                 animate-fade-in group">

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
          <ChevronRight size={16}
            className="text-gray-300 dark:text-gray-600 flex-shrink-0
                       group-hover:text-ocean-500 group-hover:translate-x-0.5
                       transition-all duration-200" />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed
                      line-clamp-2 mb-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <span className={`badge text-[10px] ${getCatColor(service.category)}`}>
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

// ── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBanner({ name }) {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-5
                    bg-gradient-to-br from-ocean-600 via-ocean-500 to-nishi-accent
                    p-5 shadow-ocean">
      {/* Decorations */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-ocean-100 text-xs font-medium mb-0.5">
            👋 Welcome back,
          </p>
          <h2 className="text-white font-extrabold text-lg leading-tight">
            {name?.split(' ')[0] || 'User'}
          </h2>
          <p className="text-ocean-100 text-xs mt-1.5 max-w-[180px] leading-relaxed">
            Explore our professional diving services in Bangladesh
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur
                        flex items-center justify-center flex-shrink-0">
          <Waves size={32} className="text-white" />
        </div>
      </div>

      {/* Stats row */}
      <div className="relative z-10 flex gap-3 mt-4">
        {[
          { icon: Star,  label: 'Certified', sub: 'LR, BV, DNV' },
          { icon: Clock, label: 'Available', sub: '24/7 Support' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label}
            className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
            <Icon size={14} className="text-white flex-shrink-0" />
            <div>
              <p className="text-white text-[11px] font-bold leading-none">{label}</p>
              <p className="text-ocean-100 text-[10px] leading-none mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Home ────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [services,    setServices]    = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [categories,  setCategories]  = useState(['All'])
  const [activeTab,   setActiveTab]   = useState('All')
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)

  // ── Fetch services ─────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get('/services')
      .then(r => {
        const data = r.data.length > 0 ? r.data : FALLBACK
        setServices(data)
        const cats = ['All', ...new Set(data.map(s => s.category || 'General'))]
        setCategories(cats)
      })
      .catch(() => {
        setServices(FALLBACK)
        const cats = ['All', ...new Set(FALLBACK.map(s => s.category))]
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Filter ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let list = services
    if (activeTab !== 'All') list = list.filter(s => s.category === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(list)
  }, [services, activeTab, search])

  return (
    <div className="py-4">
      <HeroBanner name={user?.name} />

      {/* ─ Search ─ */}
      <div className="relative mb-4">
        <Search size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2
                     text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search services…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* ─ Category tabs ─ */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {categories.map(cat => (
          <button key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold
                        transition-all duration-200 whitespace-nowrap
              ${activeTab === cat
                ? 'bg-ocean-600 text-white shadow-ocean'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─ Services list ─ */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="section-title mb-0">
          {activeTab === 'All' ? 'All Services' : activeTab}
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 mt-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 flex gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="text-5xl mb-3">🔍</span>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No services found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setActiveTab('All') }}
            className="btn-secondary mt-4 text-sm px-4 py-2">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 mt-3">
          {filtered.map(s => (
            <ServiceCard
              key={s._id}
              service={s}
              onPress={id => navigate(`/service/${id}`, { state: { service: s } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
