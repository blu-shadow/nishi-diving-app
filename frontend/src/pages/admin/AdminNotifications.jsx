import { useState, useEffect } from 'react'
import { Bell, Send, Users, User,
         Search, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

const TEMPLATES = [
  { title: '✅ Order Confirmed',   msg: 'Your order has been confirmed. Our team will contact you shortly.' },
  { title: '🔧 Work In Progress',  msg: 'Our team has started working on your order. We will update you regularly.' },
  { title: '🎉 Order Completed',   msg: 'Your order has been completed successfully. Thank you for choosing Nishi Diving!' },
  { title: '📢 New Service Added', msg: 'We have added a new service. Check our services page for details.' },
  { title: '⏰ Reminder',          msg: 'This is a friendly reminder regarding your pending order with us.' },
]

export default function AdminNotifications() {
  const [users,    setUsers]    = useState([])
  const [mode,     setMode]     = useState('all')   // 'all' | 'single'
  const [search,   setSearch]   = useState('')
  const [selUser,  setSelUser]  = useState(null)
  const [title,    setTitle]    = useState('')
  const [message,  setMessage]  = useState('')
  const [sending,  setSending]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    axios.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
  }, [])

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const applyTemplate = (t) => {
    setTitle(t.title)
    setMessage(t.msg)
  }

  const handleSend = async () => {
    if (!title.trim())   { setError('Please enter a title.');   return }
    if (!message.trim()) { setError('Please enter a message.'); return }
    if (mode === 'single' && !selUser) { setError('Please select a user.'); return }

    setSending(true)
    setError('')
    try {
      await axios.post('/admin/notify', {
        title,
        message,
        sendToAll: mode === 'all',
        userId: mode === 'single' ? selUser._id : undefined,
      })
      setSuccess(true)
      setTitle('')
      setMessage('')
      setSelUser(null)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification.')
    } finally { setSending(false) }
  }

  return (
    <div className="animate-fade-in">

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Send Notification
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Push notifications to users
        </p>
      </div>

      {/* ─ Success ─ */}
      {success && (
        <div className="flex items-center gap-3 p-4 mb-5
                        bg-green-50 dark:bg-green-950/30
                        border border-green-200 dark:border-green-800
                        rounded-2xl animate-fade-in">
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-700 dark:text-green-400 text-sm">
              Notification Sent! 🎉
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              {mode === 'all' ? 'Sent to all users' : `Sent to ${selUser?.name}`}
            </p>
          </div>
        </div>
      )}

      {/* ─ Target selector ─ */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-ocean-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">Send To</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => { setMode('all'); setSelUser(null) }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2
                        transition-all duration-200
              ${mode === 'all'
                ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-950/40'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
              ${mode === 'all' ? 'bg-ocean-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <Users size={18} className={mode === 'all' ? 'text-white' : 'text-gray-500'} />
            </div>
            <p className={`text-sm font-bold
              ${mode === 'all' ? 'text-ocean-600 dark:text-ocean-400' : 'text-gray-600 dark:text-gray-300'}`}>
              All Users
            </p>
            <p className="text-[11px] text-gray-400">{users.length} users</p>
          </button>

          <button onClick={() => setMode('single')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2
                        transition-all duration-200
              ${mode === 'single'
                ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-950/40'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
              ${mode === 'single' ? 'bg-ocean-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <User size={18} className={mode === 'single' ? 'text-white' : 'text-gray-500'} />
            </div>
            <p className={`text-sm font-bold
              ${mode === 'single' ? 'text-ocean-600 dark:text-ocean-400' : 'text-gray-600 dark:text-gray-300'}`}>
              Specific User
            </p>
            <p className="text-[11px] text-gray-400">Choose one</p>
          </button>
        </div>

        {/* ─ User picker ─ */}
        {mode === 'single' && (
          <div className="animate-fade-in space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                className="input-field pl-10 text-sm" />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredUsers.map(u => (
                <button key={u._id} onClick={() => setSelUser(u)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl
                              transition-all text-left
                    ${selUser?._id === u._id
                      ? 'bg-ocean-50 dark:bg-ocean-950/40 ring-1 ring-ocean-400'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-ocean-200 dark:bg-ocean-800">
                    {u.profilePic ? (
                      <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-ocean-700 dark:text-ocean-300 text-xs font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  {selUser?._id === u._id && (
                    <CheckCircle2 size={16} className="text-ocean-500 flex-shrink-0 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            {selUser && (
              <div className="flex items-center gap-2 px-3 py-2
                              bg-ocean-50 dark:bg-ocean-950/30
                              border border-ocean-200 dark:border-ocean-800 rounded-xl">
                <CheckCircle2 size={14} className="text-ocean-500" />
                <p className="text-sm text-ocean-700 dark:text-ocean-300 font-medium">
                  Selected: {selUser.name}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─ Templates ─ */}
      <div className="card p-5 mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
          Quick Templates
        </h2>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button key={t.title} onClick={() => applyTemplate(t)}
              className="text-xs font-semibold px-3 py-2 rounded-xl
                         bg-gray-100 dark:bg-gray-800
                         text-gray-700 dark:text-gray-300
                         hover:bg-ocean-100 dark:hover:bg-ocean-900/40
                         hover:text-ocean-700 dark:hover:text-ocean-300
                         transition-colors border border-gray-200 dark:border-gray-700">
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* ─ Compose ─ */}
      <div className="card p-5 mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
          <Send size={16} className="text-ocean-500" />
          Compose Message
        </h2>

        <div className="space-y-4">
          <div>
            <label className="input-label">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Notification title…"
              className="input-field" maxLength={80} />
            <p className="text-[11px] text-gray-400 mt-1 text-right">{title.length}/80</p>
          </div>
          <div>
            <label className="input-label">Message *</label>
            <textarea rows={4} value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your notification message here…"
              className="input-field resize-none" maxLength={300} />
            <p className="text-[11px] text-gray-400 mt-1 text-right">{message.length}/300</p>
          </div>
        </div>
      </div>

      {/* ─ Error ─ */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4
                        bg-red-50 dark:bg-red-950/30
                        border border-red-200 dark:border-red-800
                        rounded-xl animate-fade-in">
          <span className="text-red-500">⚠️</span>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* ─ Send button ─ */}
      <button onClick={handleSend} disabled={sending}
        className="btn-primary w-full py-4 text-base">
        {sending ? (
          <span className="spinner border-white/40 border-t-white" />
        ) : (
          <>
            <Send size={18} />
            Send to {mode === 'all' ? `All ${users.length} Users` : (selUser?.name || 'Selected User')}
          </>
        )}
      </button>
    </div>
  )
}
