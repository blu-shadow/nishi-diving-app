import axios from 'axios'

export const orderAPI = {
  // Place a new order
  create: (data) =>
    axios.post('/orders', data).then(r => r.data),

  // Get current user's orders
  getMyOrders: () =>
    axios.get('/orders/my').then(r => r.data),

  // Get single order by ID
  getById: (id) =>
    axios.get(`/orders/${id}`).then(r => r.data),
}
