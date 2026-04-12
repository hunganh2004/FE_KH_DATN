import api from './api'
import { mockOrderService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const orderService = USE_MOCK ? mockOrderService : {
  create: (data) => api.post('/orders', data),
  getHistory: (params) => api.get('/orders', { params }),
  getDetail: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
}
