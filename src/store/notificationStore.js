import { create } from 'zustand'
import { notificationService } from '@/services/notificationService'

const useNotificationStore = create((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async () => {
    try {
      const res = await notificationService.getUnreadCount()
      const count = res?.data?.unread_count ?? res?.unread_count ?? 0
      set({ unreadCount: count })
    } catch {}
  },

  decrement: (by = 1) => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - by) })),

  reset: () => set({ unreadCount: 0 }),
}))

export default useNotificationStore
