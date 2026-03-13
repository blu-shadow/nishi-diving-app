import { useState, useEffect } from 'react'
import { Award, Shield, Users, Anchor, ExternalLink,
         CheckCircle2, Building2, ZoomIn, X } from 'lucide-react'
import axios from 'axios'

// ── Approvals list ────────────────────────────────────────────────────────────
const APPROVALS = ['LR', 'BV', 'RINA', 'IRS', 'KR', 'ABS', 'DNV']

const ISO_CERTS = [
  { code: 'ISO 9001', label: 'Quality Management' },
  { code: 'ISO 14001', label: 'Environmental Management' },
  { code: 'ISO 18001', label: 'Health & Safety Management' },
]

const STATS = [
  { icon: Anchor,  value: '2021',  label: 'Established'    },
  { icon: Shield,  value: '7+',    label: 'Class Approvals' },
  { icon: Award,   value: 'ISO',   label: 'Certified'       },
  { icon: Users,   value: '24/7',  label: 'Support'         },
]

// ── Certificate image viewer ──────────────────────────────────────────────────
function CertViewer({ cert, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/80 backdrop-blur-sm animate-fade-in p-4"
         onClick={onClose}>
      <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full
                     bg-white dark:bg-gray-800 shadow-lg z-10
                     flex items-center justify-center text-gray-600
                     dark:text-gray-300 hover:bg-gray-100">
          <X size={18} />
        </button>
        <div className="card overflow-hidden">
          {cert.fileType === 'image' || cert.filePath?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
            <img src={cert.filePath} alt={cert.name}
                 className="w-full object-contain max-h-[75vh]" />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Award size={48} className="text-ocean-400" />
              <p className="font-semibold text-gray-800 dark:text-gray-200">{cert.name}</p>
              <a href={cert.filePath} target="_blank" rel="noopener noreferrer"
                 className="btn-primary text-sm px-4 py-2">
                <ExternalLink size={15} />
                Open PDF
              </a>
            </div>
          )}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300">
              {cert.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function About() {
  const [settings,     setSettings]     = useState(null)
  const [certificates, setCertificates] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [viewCert,     setViewCert]     = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/upload/settings'),
      axios.get('/upload/certificates'),
    ])
      .then(([s, c]) => {
        setSettings(s.data)
        setCertificates(c.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const aboutText = settings?.aboutText ||
    'Nishi Salvage & Diving is a Commercial Diving Company based in Chattogram, Bangladesh. We provide a wide variety of diving services, Salvage Service and Ship and Offshore Structure Repair, Fabrication and Modification Services.'

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Hero ─ */}
      <div className="relative rounded-3xl overflow-hidden mb-5
                      bg-gradient-to-br from-nishi-secondary via-ocean-800 to-ocean-600
                      p-6 shadow-ocean">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-16
                        bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          {settings?.logo ? (
            <img src={settings.logo} alt="logo"
                 className="w-16 h-16 rounded-2xl object-contain
                            bg-white/20 p-1 ring-2 ring-white/30" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur
                            flex items-center justify-center ring-2 ring-white/30">
              <span className="text-white font-black text-3xl">N</span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-white leading-tight">
              {settings?.appName || 'Nishi Diving'}
            </h1>
            <p className="text-ocean-200 text-xs mt-0.5">
              Salvage & Diving — Bangladesh
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-[11px] font-medium">Active & Operating</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 grid grid-cols-4 gap-2 mt-5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label}
              className="flex flex-col items-center gap-1
                         bg-white/15 rounded-xl py-2.5 px-1">
              <Icon size={14} className="text-white/80" />
              <span className="text-white font-extrabold text-sm leading-none">{value}</span>
              <span className="text-ocean-200 text-[9px] font-medium leading-tight text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─ About Text ─ */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={18} className="text-ocean-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">About Us</h2>
        </div>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {aboutText}
          </p>
        )}
      </div>

      {/* ─ Class Approvals ─ */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-ocean-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">Class Approvals</h2>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {APPROVALS.map(code => (
            <div key={code}
              className="flex items-center justify-center
                         bg-ocean-50 dark:bg-ocean-950/50
                         border border-ocean-100 dark:border-ocean-900
                         rounded-xl py-2.5">
              <span className="text-ocean-700 dark:text-ocean-300
                               font-extrabold text-sm">
                {code}
              </span>
            </div>
          ))}
        </div>

        {/* ISO certs */}
        <div className="space-y-2">
          {ISO_CERTS.map(c => (
            <div key={c.code}
              className="flex items-center gap-2.5 py-2
                         border-t border-gray-50 dark:border-gray-800">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {c.code}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {c.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ Certificates from Admin ─ */}
      <div>
        <h2 className="section-title flex items-center gap-2">
          <Award size={18} className="text-ocean-500" />
          Certificates & Documents
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i}
                className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="card p-6 flex flex-col items-center gap-2 text-center">
            <Award size={36} className="text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No certificates uploaded yet
            </p>
            <p className="text-xs text-gray-400">
              Admin can upload certificates from the admin panel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {certificates.map(cert => (
              <button key={cert._id}
                onClick={() => setViewCert(cert)}
                className="relative group rounded-2xl overflow-hidden
                           bg-gray-100 dark:bg-gray-800 aspect-square
                           hover:ring-2 hover:ring-ocean-400
                           transition-all duration-200">

                {cert.fileType === 'image' ||
                 cert.filePath?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img src={cert.filePath} alt={cert.name}
                       className="w-full h-full object-cover
                                  group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center
                                  justify-center gap-2">
                    <Award size={32} className="text-ocean-400" />
                    <span className="text-xs font-semibold text-gray-600
                                     dark:text-gray-300 px-2 text-center line-clamp-2">
                      {cert.name}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ocean-900/0
                                group-hover:bg-ocean-900/40
                                transition-all duration-200
                                flex items-center justify-center">
                  <ZoomIn size={24}
                    className="text-white opacity-0 group-hover:opacity-100
                               transition-opacity duration-200 drop-shadow-lg" />
                </div>

                {/* Name label */}
                <div className="absolute bottom-0 left-0 right-0
                                bg-gradient-to-t from-black/60 to-transparent
                                px-2 pb-2 pt-4">
                  <p className="text-white text-[10px] font-semibold
                                 line-clamp-1 drop-shadow">
                    {cert.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─ Certificate viewer modal ─ */}
      {viewCert && (
        <CertViewer cert={viewCert} onClose={() => setViewCert(null)} />
      )}
    </div>
  )
}
