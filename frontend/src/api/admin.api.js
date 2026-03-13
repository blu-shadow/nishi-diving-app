import axios from 'axios'

export const adminAPI = {
  // Dashboard
  getStats: () =>
    axios.get('/admin/stats').then(r => r.data),

  // Orders
  getOrders:   (params) => axios.get('/admin/orders', { params }).then(r => r.data),
  updateOrder: (id, data) => axios.put(`/admin/orders/${id}`, data).then(r => r.data),

  // Users
  getUsers:   () =>  axios.get('/admin/users').then(r => r.data),
  deleteUser: (id) => axios.delete(`/admin/users/${id}`).then(r => r.data),

  // App settings
  getSettings:    () =>       axios.get('/admin/settings').then(r => r.data),
  updateSettings: (data) =>   axios.put('/admin/settings', data).then(r => r.data),

  // Certificates
  getCertificates:   () =>    axios.get('/admin/certificates').then(r => r.data),
  deleteCertificate: (id) =>  axios.delete(`/admin/certificates/${id}`).then(r => r.data),

  // Upload
  uploadLogo: (formData) =>
    axios.post('/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  uploadCertificate: (formData) =>
    axios.post('/upload/certificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  // Notifications
  sendNotification: (data) =>
    axios.post('/admin/notify', data).then(r => r.data),

  // Public settings (for frontend logo/name)
  getPublicSettings: () =>
    axios.get('/upload/settings').then(r => r.data),

  getPublicCertificates: () =>
    axios.get('/upload/certificates').then(r => r.data),
}
