import axios from 'axios'

/**
 * Auth API — all auth-related HTTP calls in one place.
 * Pages can import from here instead of writing axios calls inline.
 */

export const authAPI = {
  register: (data) =>
    axios.post('/auth/register', data).then(r => r.data),

  login: (data) =>
    axios.post('/auth/login', data).then(r => r.data),

  getProfile: () =>
    axios.get('/users/profile').then(r => r.data),

  updateProfile: (formData) =>
    axios.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  updateSettings: (data) =>
    axios.put('/users/settings', data).then(r => r.data),
}
