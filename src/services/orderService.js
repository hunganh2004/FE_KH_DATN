import api from './api'

export const orderService = {
  create: (data) => api.post('/orders', data),

  getHistory: (params) =>
    api.get('/orders', { params }).then((res) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? 0,
      totalPages: res?.pagination?.totalPages ?? 0,
      page: res?.pagination?.page ?? 1,
    })),

  getDetail: (id) => api.get(`/orders/${id}`),

  cancel: (id) => api.patch(`/orders/${id}/cancel`),

  validateCoupon: (data) => api.post('/coupons/validate', data),
}
