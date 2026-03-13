import { useState, useEffect } from 'react'
import { Search, Trash2, User, Mail,
         Phone, MapPin, RefreshCw, Users } from 'lucide-react'
import axios from 'axios'

function fmt(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function UserCard({ user, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center gap-3 p-4 text-left">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0
                        ring-2 ring-gray-100 dark:ring-gray-800">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name}
                 className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ocean-400 to-ocean-600
                            flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] text-gray-400">Joined {fmt(user.createdAt)}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800
                        px-4 py-3 space-y-2 animate-fade-in">
          {[
            { icon: Mail,  label: 'Email',   val: user.email   },
            { icon: Phone, label: 'Phone',   val: user.phone   },
            { icon: User,  label: 'Age',     val: user.age ? `${user.age} yrs` : null },
            { icon: MapPin,label: 'Address', val: user.address },
          ].filter(f => f.val).map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Icon size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 min-w-[52px] text-xs">{label}:</span>
              <span className="text-gray-700 dark:text-gray-200 truncate">{val}</span>
            </div>
          ))}

          {/* Notif & theme badges */}
          <div className="flex gap-2 pt-1">
            <span className={`badge text-[10px]
              ${user.notificationsEnabled
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              🔔 Notif {user.notificationsEnabled ? 'On' : 'Off'}
            </span>
            <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 text-[10px]">
              {user.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
          </div>

          {/* Delete */}
          <button onClick={() => onDelete(user._id)}
            disabled={deleting === user._id}
            className="btn-danger w-full mt-2 text-sm py-2">
            {deleting === user._id
              ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
              : <><Trash2 size={14} /> Delete User</>
            }
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminUsers() {
  const [users,    setUsers]    = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    axios.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their orders?')) return
    setDeleting(id)
    try {
      await axios.delete(`/admin/users/${id}`)
      setUsers(p => p.filter(u => u._id !== id))
    } catch {}
    finally { setDeleting(null) }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  )

  return (
    <div className="animate-fade-in">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} registered</p>
        </div>
        <button onClick={load}
          className="btn-icon w-10 h-10 rounded-xl text-ocean-500">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="input-field pl-10" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 flex gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/5" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-600 dark:text-gray-300">
            {search ? 'No users found' : 'No users registered yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <UserCard key={u._id} user={u}
              onDelete={handleDelete} deleting={deleting} />
          ))}
        </div>
      )}
    </div>
  )
}
