import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Save, X,
         ToggleLeft, ToggleRight, Wrench } from 'lucide-react'
import axios from 'axios'

const CATEGORIES = ['Marine', 'Offshore', 'Repair', 'Inspection', 'Recreation', 'Training', 'General']
const ICONS = ['🌊','⚓','🛢️','🔧','📷','⚡','🔋','🛡️','🔍','🤿','🎓','🚢','⛽','🏗️','🔩']

const EMPTY = { name: '', description: '', icon: '🌊', category: 'General', price: '', isActive: true, order: 0 }

// ── Service Form Modal ────────────────────────────────────────────────────────
function ServiceModal({ service, onClose, onSave }) {
  const [form,   setForm]   = useState(service || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const isEdit = !!service?._id

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())        { setError('Service name is required.'); return }
    if (!form.description.trim()) { setError('Description is required.');  return }
    setSaving(true)
    try {
      if (isEdit) {
        const { data } = await axios.put(`/services/${service._id}`, form)
        onSave(data, 'edit')
      } else {
        const { data } = await axios.post('/services', form)
        onSave(data, 'add')
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50
                      max-w-lg mx-auto bg-white dark:bg-gray-900
                      rounded-3xl shadow-2xl overflow-hidden
                      max-h-[90vh] flex flex-col animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-ocean-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon w-9 h-9 rounded-xl">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Icon picker */}
          <div>
            <label className="input-label">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button"
                  onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center
                              transition-all border-2
                    ${form.icon === ic
                      ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-950/50 scale-110'
                      : 'border-transparent bg-gray-100 dark:bg-gray-800 hover:border-gray-300'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="input-label">Service Name *</label>
            <input value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Propeller Repair"
              className="input-field" />
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description *</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the service…"
              className="input-field resize-none" />
          </div>

          {/* Category */}
          <div>
            <label className="input-label">Category</label>
            <select value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="input-label">Price / Quote</label>
            <input value={form.price}
              onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              placeholder="e.g. ৳ 50,000 or Contact for pricing"
              className="input-field" />
          </div>

          {/* Order */}
          <div>
            <label className="input-label">Display Order</label>
            <input type="number" value={form.order}
              onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
              className="input-field" min={0} />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between card p-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Active
              </p>
              <p className="text-xs text-gray-400">Visible to users</p>
            </div>
            <button type="button"
              onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className={form.isActive ? 'text-green-500' : 'text-gray-400'}>
              {form.isActive
                ? <ToggleRight size={28} />
                : <ToggleLeft  size={28} />
              }
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30
                          border border-red-200 dark:border-red-800
                          rounded-xl px-4 py-3">
              ⚠️ {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="btn-secondary flex-1">
            <X size={15} /> Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
            {saving
              ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
              : <><Save size={15} /> {isEdit ? 'Update' : 'Add Service'}</>
            }
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null) // null | 'add' | service obj
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    axios.get('/admin/services')
      .then(r => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = (data, type) => {
    if (type === 'add') setServices(p => [data, ...p])
    else setServices(p => p.map(s => s._id === data._id ? data : s))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? Orders using it will still exist.')) return
    setDeleting(id)
    try {
      await axios.delete(`/services/${id}`)
      setServices(p => p.filter(s => s._id !== id))
    } catch {}
    finally { setDeleting(null) }
  }

  const toggleActive = async (service) => {
    const { data } = await axios.put(`/services/${service._id}`, {
      ...service, isActive: !service.isActive
    })
    setServices(p => p.map(s => s._id === data._id ? data : s))
  }

  return (
    <div className="animate-fade-in">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary px-4 py-2.5">
          <Plus size={17} /> Add Service
        </button>
      </div>

      {/* ─ List ─ */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 flex gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <Wrench size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-600 dark:text-gray-300">No services yet</p>
          <button onClick={() => setModal('add')} className="btn-primary mt-4">
            <Plus size={16} /> Add First Service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s._id}
              className={`card p-4 flex items-start gap-3
                          transition-opacity duration-200
                          ${!s.isActive ? 'opacity-50' : ''}`}>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-ocean-50 dark:bg-ocean-950/50
                              flex items-center justify-center text-2xl flex-shrink-0">
                {s.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">
                    {s.name}
                  </p>
                  <span className={`badge text-[10px]
                    ${s.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {s.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {s.description}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-ocean-600 dark:text-ocean-400 font-semibold">
                    {s.price || 'Contact for pricing'}
                  </span>
                  <span className="text-[11px] text-gray-400">{s.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(s)}
                  title={s.isActive ? 'Hide' : 'Show'}
                  className={`btn-icon w-9 h-9 rounded-xl
                    ${s.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-950'
                                 : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {s.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => setModal(s)}
                  className="btn-icon w-9 h-9 rounded-xl text-ocean-500
                             hover:bg-ocean-50 dark:hover:bg-ocean-950">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id}
                  className="btn-icon w-9 h-9 rounded-xl text-red-400
                             hover:bg-red-50 dark:hover:bg-red-950">
                  {deleting === s._id
                    ? <span className="spinner w-4 h-4 border-red-300 border-t-red-500" />
                    : <Trash2 size={16} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─ Modal ─ */}
      {modal && (
        <ServiceModal
          service={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
