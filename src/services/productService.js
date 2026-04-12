import api from './api'
import { mockProductService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const productService = USE_MOCK ? mockProductService : {
  getList: (params) => api.get('/products', { params }),
  getDetail: (slug) => api.get(`/products/${slug}`),
  getRecommendations: (params) => api.get('/recommendations', { params }),
  getByCategory: (slug, params) => api.get(`/categories/${slug}/products`, { params }),
  search: (params) => api.get('/products/search', { params }),
}
