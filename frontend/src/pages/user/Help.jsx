import { useState, useEffect } from 'react'
import { ChevronDown, MessageCircle, Phone, Mail,
         Facebook, HelpCircle, Clock, MapPin } from 'lucide-react'
import axios from 'axios'

// ── Static FAQs ───────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What services does Nishi Diving provide?',
    a: 'We provide a wide range of commercial diving services including salvage operations, underwater welding & cutting, propeller repair, CCTV class inspection, UWILD, ICCP replacement, offshore operations, and recreational scuba diving.'
  },
  {
    q: 'Which classification societies approve your services?',
    a: 'We are approved by Lloyd\'s Register (LR), Bureau Veritas (BV), RINA, Indian Register of Shipping (IRS), Korean Register (KR), American Bureau of Shipping (ABS), and DNV.'
  },
  {
    q: 'How do I place an order?',
    a: 'Simply browse our services from the Home page, tap on any service, and press "Book This Service". Fill in your requirements and location, then submit. Our team will confirm within 24 hours.'
  },
  {
    q: 'What areas do you serve?',
    a: 'We serve all major ports and waterways in Bangladesh including Chittagong Port, Mongla Port, and Payra Port. We also operate across Bangladesh\'s territorial waters.'
  },
  {
    q: 'How can I track my order status?',
    a: 'Go to the Account page and tap "My Orders". You can see real-time status updates — Pending, Confirmed, In Progress, Completed, or Cancelled. You will also receive notifications for every update.'
  },
  {
    q: 'Do you offer underwater welding training?',
    a: 'Yes! We provide professional Underwater Welding & Cutting courses. Go to the Home page, tap the "Underwater Welding Course" service, and place a booking request.'
  },
  {
    q: 'What is UWILD?',
    a: 'UWILD stands for Underwater Inspection in Lieu of Dry-Docking. It allows vessels to undergo classification surveys underwater without going to a dry dock, saving time and cost. We are approved by all major class societies.'
  },
  {
    q: 'Is your team available 24/7?',
    a: 'Our office is open Saturday–Thursday, 9:30 AM to 6:00 PM. However, for emergency inquiries and correspondence, we are available 24/7 including weekends and government holidays.'
  },
]

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`card overflow-hidden transition-all duration-200
                     ${open ? 'shadow-ocean' : ''}`}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-lg bg-ocean-100 dark:bg-ocean-900/50
                           text-ocean-600 dark:text-ocean-400
                           flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <span className={`text-sm font-semibold leading-snug
            ${open
              ? 'text-ocean-600 dark:text-ocean-400'
              : 'text-gray-800 dark:text-gray-200'}`}>
            {faq.q}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300
                      ${open ? 'rotate-180 text-ocean-500' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="pl-9">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Contact Card ──────────────────────────────────────────────────────────────
function ContactCard({ icon: Icon, label, value, href, color }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="card-hover flex items-center gap-3 p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                       flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</p>
      </div>
    </a>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Help() {
  const [settings, setSettings] = useState(null)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    axios.get('/upload/settings').then(r => setSettings(r.data)).catch(() => {})
  }, [])

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const phone    = settings?.phone    || '+8801712202165'
  const email    = settings?.email    || 'nishidiving@gmail.com'
  const whatsapp = settings?.whatsapp || '+8801712202165'
  const facebook = settings?.facebook || 'https://www.facebook.com/profile.php?id=100090424453177'
  const address  = settings?.address  || 'Nishi House, Uttor Agrabad, Muhuri Para, Chattogram'

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Header ─ */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={22} className="text-ocean-500" />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Help Center
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Find answers or get in touch with us
        </p>
      </div>

      {/* ─ Contact cards ─ */}
      <div className="mb-6">
        <h2 className="section-title">Contact Us</h2>
        <div className="grid grid-cols-2 gap-3">
          <ContactCard
            icon={Phone}  label="Call Us"   value={phone}
            href={`tel:${phone}`}
            color="bg-green-500"
          />
          <ContactCard
            icon={MessageCircle} label="WhatsApp" value="Chat Now"
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            color="bg-emerald-500"
          />
          <ContactCard
            icon={Mail}     label="Email"    value={email}
            href={`mailto:${email}`}
            color="bg-ocean-500"
          />
          <ContactCard
            icon={Facebook} label="Facebook" value="Our Page"
            href={facebook}
            color="bg-blue-600"
          />
        </div>

        {/* Office hours */}
        <div className="card p-4 mt-3 flex items-start gap-3">
          <Clock size={18} className="text-ocean-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Office Hours
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Saturday – Thursday &nbsp;·&nbsp; 9:30 AM – 6:00 PM<br />
              <span className="text-ocean-600 dark:text-ocean-400 font-semibold">
                Emergency inquiries: 24/7
              </span>
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="card p-4 mt-3 flex items-start gap-3">
          <MapPin size={18} className="text-ocean-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
              Head Office
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {address}
            </p>
          </div>
        </div>
      </div>

      {/* ─ Help text from admin ─ */}
      {settings?.helpText && (
        <div className="card p-4 mb-6 bg-ocean-50 dark:bg-ocean-950/30
                        border border-ocean-100 dark:border-ocean-900">
          <p className="text-sm text-ocean-700 dark:text-ocean-300 leading-relaxed">
            💬 {settings.helpText}
          </p>
        </div>
      )}

      {/* ─ FAQ ─ */}
      <div>
        <h2 className="section-title">Frequently Asked Questions</h2>

        {/* Search FAQs */}
        <div className="relative mb-4">
          <HelpCircle size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search FAQs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state py-10">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-semibold text-gray-600 dark:text-gray-300">No results found</p>
            <button onClick={() => setSearch('')}
              className="btn-secondary mt-3 text-sm px-4 py-2">
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
