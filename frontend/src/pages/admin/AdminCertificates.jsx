import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Award, Plus,
         FileText, Image, X } from 'lucide-react'
import axios from 'axios'

export default function AdminCertificates() {
  const fileRef = useRef(null)

  const [certs,    setCerts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [name,     setName]     = useState('')
  const [file,     setFile]     = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [uploading,setUploading]= useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  useEffect(() => {
    axios.get('/admin/certificates')
      .then(r => setCerts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleFile = e => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setName(n => n || f.name.replace(/\.[^.]+$/, ''))
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f))
    else setPreview(null)
    setError('')
  }

  const handleUpload = async () => {
    if (!file)       { setError('Please select a file.'); return }
    if (!name.trim()){ setError('Please enter a certificate name.'); return }
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('certificate', file)
      fd.append('name', name.trim())
      const { data } = await axios.post('/upload/certificate', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCerts(p => [data, ...p])
      setFile(null)
      setName('')
      setPreview(null)
      fileRef.current.value = ''
      setSuccess('Certificate uploaded!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return
    setDeleting(id)
    try {
      await axios.delete(`/admin/certificates/${id}`)
      setCerts(p => p.filter(c => c._id !== id))
    } catch {}
    finally { setDeleting(null) }
  }

  const fmt = d => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="animate-fade-in">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Certificates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{certs.length} uploaded</p>
        </div>
        <Award size={24} className="text-ocean-500" />
      </div>

      {/* ─ Upload card ─ */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={18} className="text-ocean-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">Upload Certificate</h2>
        </div>

        {/* File picker */}
        <input ref={fileRef} type="file"
               accept="image/*,.pdf" className="hidden"
               onChange={handleFile} />

        <button onClick={() => fileRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl p-6
                      flex flex-col items-center gap-3 mb-4 transition-colors
                      ${file
                        ? 'border-ocean-400 bg-ocean-50 dark:bg-ocean-950/30'
                        : 'border-gray-300 dark:border-gray-700 hover:border-ocean-400 bg-gray-50 dark:bg-gray-800'}`}>
          {preview ? (
            <img src={preview} alt="" className="h-24 object-contain rounded-xl" />
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText size={40} className="text-ocean-400" />
              <p className="text-sm font-semibold text-ocean-600 dark:text-ocean-400">
                {file.name}
              </p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700
                              flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Click to select file
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Images (PNG, JPG) or PDF — max 10MB
                </p>
              </div>
            </>
          )}
        </button>

        {file && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="input-label">Certificate Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. DNV Approval Certificate 2024"
                className="input-field" />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30
                            border border-red-200 dark:border-red-800
                            rounded-xl px-4 py-3">
                ⚠️ {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30
                            border border-green-200 dark:border-green-800
                            rounded-xl px-4 py-3">
                ✅ {success}
              </p>
            )}

            <div className="flex gap-2">
              <button onClick={() => { setFile(null); setPreview(null); setName(''); fileRef.current.value = '' }}
                className="btn-secondary flex-1 text-sm py-2.5">
                <X size={15} /> Clear
              </button>
              <button onClick={handleUpload} disabled={uploading}
                className="btn-primary flex-1 text-sm py-2.5">
                {uploading
                  ? <span className="spinner w-4 h-4 border-white/40 border-t-white" />
                  : <><Upload size={15} /> Upload</>
                }
              </button>
            </div>
          </div>
        )}

        {success && !file && (
          <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30
                        border border-green-200 border-green-800
                        rounded-xl px-4 py-3 text-center animate-fade-in">
            ✅ {success}
          </p>
        )}
      </div>

      {/* ─ Certificates grid ─ */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-square rounded-2xl
                                    bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="empty-state py-12">
          <Award size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-500 dark:text-gray-400">
            No certificates yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {certs.map(cert => (
            <div key={cert._id}
              className="relative group card overflow-hidden">

              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800
                              flex items-center justify-center overflow-hidden">
                {cert.fileType === 'image' ||
                 cert.filePath?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img src={cert.filePath} alt={cert.name}
                       className="w-full h-full object-cover
                                  group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4">
                    <FileText size={36} className="text-ocean-400" />
                    <span className="text-xs text-center text-gray-500 dark:text-gray-400
                                     font-medium line-clamp-2">
                      {cert.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Delete button (hover) */}
              <button onClick={() => handleDelete(cert._id)}
                disabled={deleting === cert._id}
                className="absolute top-2 right-2
                           w-8 h-8 rounded-xl bg-red-500 text-white
                           flex items-center justify-center shadow-lg
                           opacity-0 group-hover:opacity-100
                           transition-opacity duration-200
                           hover:bg-red-600">
                {deleting === cert._id
                  ? <span className="spinner w-3 h-3 border-white/40 border-t-white" />
                  : <Trash2 size={14} />
                }
              </button>

              {/* Name + date */}
              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200
                               truncate leading-tight">
                  {cert.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{fmt(cert.uploadedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
