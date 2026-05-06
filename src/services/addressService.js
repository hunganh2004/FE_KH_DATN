import api from './api'

export const addressService = {
  getAll: () => api.get('/users/addresses'),
  add: (data) => api.post('/users/addresses', data),
  update: (id, data) => api.put(`/users/addresses/${id}`, data),
  remove: (id) => api.delete(`/users/addresses/${id}`),
  setDefault: (id) => api.patch(`/users/addresses/${id}/default`),
}
