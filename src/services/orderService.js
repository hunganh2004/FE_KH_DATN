import api from './api'
import { mockOrderService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const realOrderService = {
  create: (data) => api.post('/orders', data),

  getHistory: (params) =>
    api.get('/orders', { params }).then((res) => ({
      items: res.data ?? [],
      total: res.pagination?.total ?? 0,
      totalPages: res.pagination?.totalPages ?? 0,
      page: res.pagination?.page ?? 1,
    })),

  getDetail: (id) => api.get(`/orders/${id}`),

  cancel: (id) => api.patch(`/orders/${id}/cancel`),

  validateCoupon: (data) => api.post('/coupons/validate', data),
}

export const orderService = USE_MOCK ? mockOrderService : realOrderService
