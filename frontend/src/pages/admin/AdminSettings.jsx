import { useState, useEffect, useRef } from 'react'
import { Save, Upload, Image, Settings,
         Globe, MessageSquare, HelpCircle,
         Phone, Mail, MapPin, Facebook,
         Code2, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-ocean-500" />
        <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default function AdminSettings() {
  const logoRef = useRef(null)

  const [settings,    setSettings]    = useState(null)
  const [form,        setForm]        = useState({})
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoFile,    setLogoFile]    = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [logoSaving,  setLogoSaving]  = useState(false)
  const [success,     setSuccess]     = useState('')
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    axios.get('/admin/settings')
      .then(r => { setSettings(r.data); setForm(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleLogoChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleLogoUpload = async () => {
    if (!logoFile) return
    setLogoSaving(true)
    try {
      const fd = new FormData()
      fd.append('logo', logoFile)
      const { data } = await axios.post('/upload/logo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSettings(p => ({ ...p, logo: data.logo }))
      setForm(p => ({ ...p, logo: data.logo }))
      setLogoFile(null)
      setLogoPreview(null)
      showSuccess('Logo updated!')
    } catch {}
    finally { setLogoSaving(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put('/admin/settings', form)
      setSettings(data)
      showSuccess('Settings saved successfully!')
    } catch {}
    finally { setSaving(false) }
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const currentLogo = logoPreview || settings?.logo

  return (
    <div className="animate-fade-in space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">App Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your app configuration</p>
        </div>
      </div>

      {/* ─ Success toast ─ */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3
                        bg-green-50 dark:bg-green-950/30
                        border border-green-200 dark:border-green-800
                        rounded-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-green-500" />
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">{success}</p>
        </div>
      )}

      {/* ─ Logo upload ─ */}
      <Section icon={Image} title="App Logo">
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed
                          border-gray-300 dark:border-gray-700
                          flex items-center justify-center overflow-hidden flex-shrink-0
                          bg-gray-50 dark:bg-gray-800">
            {currentLogo ? (
              <img src={currentLogo} alt="logo"
                   className="w-full h-full object-contain p-1" />
            ) : (
              <Image size={28} className="text-gray-300 dark:text-gray-600" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input ref={logoRef} type="file" accept="image/*"
                   className="hidden" onChange={handleLogoChange} />
            <button onClick={() => logoRef.current?.click()}
              className="btn-secondary w-full text-sm py-2.5">
              <Upload size={15} />
              {logoFile ? 'Change Logo' : 'Upload Logo'}
            </button>
            {logoFile && (
              <button onClick={handleLogoUpload} disabled={logoSaving}
                className="btn-primary w-full text-sm py-2.5">
                {logoSaving
                  ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
                  : <><Save size={15} /> Save Logo</>
                }
              </button>
            )}
            <p className="text-xs text-gray-400 text-center">PNG, JPG — max 5MB</p>
          </div>
        </div>
      </Section>

      {/* ─ App Info ─ */}
      <Section icon={Globe} title="App Information">
        <div>
          <label className="input-label">App Name</label>
          <input name="appName" value={form.appName || ''}
            onChange={handleChange} placeholder="Nishi Diving"
            className="input-field" />
        </div>
        <div>
          <label className="input-label">About Us Text</label>
          <textarea name="aboutText" rows={4} value={form.aboutText || ''}
            onChange={handleChange}
            placeholder="Describe your company…"
            className="input-field resize-none" />
        </div>
      </Section>

      {/* ─ Contact Info ─ */}
      <Section icon={Phone} title="Contact Information">
        {[
          { name: 'phone',    label: 'Phone 1',   icon: Phone,   placeholder: '+8801XXXXXXXXX' },
          { name: 'phone2',   label: 'Phone 2',   icon: Phone,   placeholder: '+8801XXXXXXXXX' },
          { name: 'whatsapp', label: 'WhatsApp',  icon: MessageSquare, placeholder: '+8801XXXXXXXXX' },
          { name: 'email',    label: 'Email 1',   icon: Mail,    placeholder: 'you@example.com' },
          { name: 'email2',   label: 'Email 2',   icon: Mail,    placeholder: 'office@example.com' },
          { name: 'address',  label: 'Address',   icon: MapPin,  placeholder: 'Full address' },
          { name: 'facebook', label: 'Facebook URL', icon: Facebook, placeholder: 'https://facebook.com/…' },
        ].map(({ name, label, icon: Icon, placeholder }) => (
          <div key={name}>
            <label className="input-label flex items-center gap-1.5">
              <Icon size={12} />
              {label}
            </label>
            <input name={name} value={form[name] || ''}
              onChange={handleChange} placeholder={placeholder}
              className="input-field" />
          </div>
        ))}
      </Section>

      {/* ─ Help & Dev note ─ */}
      <Section icon={HelpCircle} title="Help & Developer">
        <div>
          <label className="input-label flex items-center gap-1.5">
            <HelpCircle size={12} /> Help Text
          </label>
          <textarea name="helpText" rows={3} value={form.helpText || ''}
            onChange={handleChange}
            placeholder="Message shown in the Help page…"
            className="input-field resize-none" />
        </div>
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Code2 size={12} /> Developer's Note
          </label>
          <textarea name="devNote" rows={3} value={form.devNote || ''}
            onChange={handleChange}
            placeholder="Note shown in the Settings drawer…"
            className="input-field resize-none" />
        </div>
      </Section>

      {/* ─ Save button ─ */}
      <button onClick={handleSave} disabled={saving}
        className="btn-primary w-full h-13 text-base py-4">
        {saving
          ? <span className="spinner border-white/40 border-t-white" />
          : <><Save size={18} /> Save All Settings</>
        }
      </button>
    </div>
  )
}
