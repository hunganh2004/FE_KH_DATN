import api from './api'
import { mockAuthService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const realAuthService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

export const authService = USE_MOCK ? mockAuthService : realAuthService
