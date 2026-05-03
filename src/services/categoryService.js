import api from './api'

export const categoryService = {
  // GET /categories — trả về cây cha-con
  getCategories: () => api.get('/categories'),

  // GET /pet-types
  getPetTypes: () => api.get('/pet-types'),
}
