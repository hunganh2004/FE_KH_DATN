import api from './api'
import { mockAuthService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const authService = USE_MOCK ? mockAuthService : {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  changePassword: (data) => api.patch('/auth/password', data),
}
