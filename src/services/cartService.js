import api from './api'

// Cart service — luôn gọi API thật (không có mock tương đương server-side)
export const cartService = {
  getCart: () => api.get('/cart'),

  addItem: (product_id, variant_id, quantity) =>
    api.post('/cart', { product_id, variant_id: variant_id || null, quantity }),

  updateItem: (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity }),

  removeItem: (itemId) =>
    api.delete(`/cart/${itemId}`),

  clearCart: () =>
    api.delete('/cart'),
}
