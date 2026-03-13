import axios from 'axios'

export const serviceAPI = {
  // Public — get all active services
  getAll: () =>
    axios.get('/services').then(r => r.data),

  // Public — get one service
  getById: (id) =>
    axios.get(`/services/${id}`).then(r => r.data),

  // Admin — get all (including inactive)
  adminGetAll: () =>
    axios.get('/admin/services').then(r => r.data),

  // Admin — create
  create: (data) =>
    axios.post('/services', data).then(r => r.data),

  // Admin — update
  update: (id, data) =>
    axios.put(`/services/${id}`, data).then(r => r.data),

  // Admin — delete
  remove: (id) =>
    axios.delete(`/services/${id}`).then(r => r.data),
}
