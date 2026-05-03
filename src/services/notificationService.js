import api from './api'
import { mockUserService } from '@/mocks/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const realNotificationService = {
  getAll: () => api.get('/notifications'),

  getUnreadCount: () => api.get('/notifications/unread-count'),

  markRead: (id) => api.patch(`/notifications/${id}/read`),

  markAllRead: () => api.patch('/notifications/read-all'),

  delete: (id) => api.delete(`/notifications/${id}`),
}

// Adapter mock để khớp interface
const mockNotificationService = {
  getAll: () => mockUserService.getNotifications().then((res) => res?.items ?? []),
  getUnreadCount: () =>
    mockUserService.getNotifications().then((res) => ({
      unread_count: (res?.items ?? []).filter((n) => n.is_read === 0).length,
    })),
  markRead: (id) => mockUserService.markNotificationRead(id),
  markAllRead: () => Promise.resolve({ message: 'OK' }),
  delete: () => Promise.resolve({ message: 'OK' }),
}

export const notificationService = USE_MOCK ? mockNotificationService : realNotificationService
