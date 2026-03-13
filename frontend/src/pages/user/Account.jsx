import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, User, Phone, MapPin, Calendar,
         Mail, Edit3, Save, X, ShoppingBag,
         CheckCircle2, LogOut, Shield } from 'lucide-react'
import axios from 'axios'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

// ── Input Row ─────────────────────────────────────────────────────────────────
function InputRow({ icon: Icon, label, name, value, onChange, type = 'text',
                    placeholder, readOnly = false }) {
  return (
    <div>
      <label className="input-label flex items-center gap-1.5">
        <Icon size={13} className="text-gray-400" />
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`input-field ${readOnly
          ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900'
          : ''}`}
      />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Account() {
  const { user, updateUser, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate   = useNavigate()
  const fileRef    = useRef(null)

  const [editing,  setEditing]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')
  const [preview,  setPreview]  = useState(null)
  const [picFile,  setPicFile]  = useState(null)
  const [orderCount, setOrderCount] = useState(null)

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    age:     user?.age     || '',
    address: user?.address || '',
  })

  // Sync form when user changes
  useEffect(() => {
    setForm({
      name:    user?.name    || '',
      phone:   user?.phone   || '',
      age:     user?.age     || '',
      address: user?.address || '',
    })
  }, [user])

  // Fetch order count
  useEffect(() => {
    axios.get('/orders/my')
      .then(r => setOrderCount(r.data.length))
      .catch(() => setOrderCount(0))
  }, [])

  const handleChange = e => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handlePicChange = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }
    setPicFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleCancel = () => {
    setEditing(false)
    setPreview(null)
    setPicFile(null)
    setError('')
    setForm({
      name:    user?.name    || '',
      phone:   user?.phone   || '',
      age:     user?.age     || '',
      address: user?.address || '',
    })
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name cannot be empty.'); return }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('name',    form.name.trim())
      fd.append('phone',   form.phone)
      fd.append('age',     form.age)
      fd.append('address', form.address)
      if (picFile) fd.append('profilePic', picFile)

      const { data } = await axios.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updateUser(data)
      setEditing(false)
      setPreview(null)
      setPicFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const avatarSrc = preview || user?.profilePic || null

  return (
    <div className="py-4 animate-fade-in">

      {/* ─ Profile card ─ */}
      <div className="card p-5 mb-4">

        {/* Avatar + edit toggle */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden
                            ring-4 ring-ocean-100 dark:ring-ocean-900">
              {avatarSrc ? (
                <img src={avatarSrc} alt="profile"
                     className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br
                                from-ocean-400 to-ocean-600
                                flex items-center justify-center">
                  <span className="text-white font-black text-3xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Camera button (edit mode) */}
            {editing && (
              <>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl
                             bg-ocean-600 text-white shadow-ocean
                             flex items-center justify-center
                             hover:bg-ocean-700 transition-colors">
                  <Camera size={15} />
                </button>
                <input ref={fileRef} type="file"
                       accept="image/*" className="hidden"
                       onChange={handlePicChange} />
              </>
            )}
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={handleCancel}
                  className="btn-icon w-9 h-9 rounded-xl text-gray-500">
                  <X size={18} />
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="btn-primary px-4 py-2 text-sm h-9">
                  {loading
                    ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
                    : <><Save size={15} /> Save</>
                  }
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="btn-secondary px-4 py-2 text-sm h-9">
                <Edit3 size={15} />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Name + email */}
        {!editing && (
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {user?.email}
            </p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center gap-1 mt-2
                               bg-ocean-100 dark:bg-ocean-900/50
                               text-ocean-700 dark:text-ocean-300
                               text-xs font-bold px-2.5 py-1 rounded-full">
                <Shield size={11} />
                Administrator
              </span>
            )}
          </div>
        )}

        {/* Success toast */}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2.5 mb-4
                          bg-green-50 dark:bg-green-950/30
                          border border-green-200 dark:border-green-800
                          rounded-xl animate-fade-in">
            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 mb-4
                          bg-red-50 dark:bg-red-950/30
                          border border-red-200 dark:border-red-800
                          rounded-xl animate-fade-in">
            <span className="text-red-500 flex-shrink-0">⚠️</span>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          {editing ? (
            <>
              <InputRow icon={User}    label="Full Name"    name="name"
                value={form.name}    onChange={handleChange} placeholder="Your name" />
              <InputRow icon={Mail}    label="Email"        name="email"
                value={user?.email || ''} onChange={() => {}}
                readOnly placeholder="Email cannot be changed" />
              <InputRow icon={Phone}   label="Phone Number" name="phone"
                value={form.phone}   onChange={handleChange} placeholder="+88 01XXXXXXXXX"
                type="tel" />
              <InputRow icon={Calendar} label="Age"         name="age"
                value={form.age}     onChange={handleChange} placeholder="Your age"
                type="number" />
              <InputRow icon={MapPin}  label="Address"      name="address"
                value={form.address} onChange={handleChange}
                placeholder="Your full address" />
            </>
          ) : (
            /* View mode */
            <div className="space-y-3">
              {[
                { icon: Mail,     label: 'Email',   value: user?.email   },
                { icon: Phone,    label: 'Phone',   value: user?.phone   },
                { icon: Calendar, label: 'Age',     value: user?.age ? `${user.age} years` : null },
                { icon: MapPin,   label: 'Address', value: user?.address },
              ].filter(f => f.value).map(({ icon: Icon, label, value }) => (
                <div key={label}
                  className="flex items-start gap-3 py-2
                             border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <Icon size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      {value}
                    </p>
                  </div>
                </div>
              ))}

              {/* Empty profile prompt */}
              {!user?.phone && !user?.address && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Tap Edit to complete your profile
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─ Quick actions ─ */}
      <div className="space-y-3 mb-4">

        {/* My orders */}
        <button onClick={() => navigate('/orders')}
          className="card-hover w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ocean-100 dark:bg-ocean-900/50
                            flex items-center justify-center">
              <ShoppingBag size={18} className="text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                My Orders
              </p>
              <p className="text-xs text-gray-400">
                {orderCount === null
                  ? 'Loading…'
                  : `${orderCount} order${orderCount !== 1 ? 's' : ''} placed`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {orderCount !== null && orderCount > 0 && (
              <span className="badge bg-ocean-100 text-ocean-700
                               dark:bg-ocean-900/50 dark:text-ocean-300">
                {orderCount}
              </span>
            )}
            <ShoppingBag size={16} className="text-gray-300 dark:text-gray-600" />
          </div>
        </button>

        {/* Admin panel shortcut */}
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/admin')}
            className="card-hover w-full flex items-center justify-between p-4
                       border-2 border-ocean-200 dark:border-ocean-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ocean-600
                              flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-ocean-700 dark:text-ocean-300">
                  Admin Panel
                </p>
                <p className="text-xs text-gray-400">Manage orders, services & more</p>
              </div>
            </div>
            <span className="text-ocean-500 text-xs font-bold">Open →</span>
          </button>
        )}
      </div>

      {/* ─ Logout ─ */}
      <button onClick={handleLogout}
        className="btn-danger w-full gap-2">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}
