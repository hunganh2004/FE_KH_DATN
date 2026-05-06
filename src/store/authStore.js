import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({
        // Normalize: đảm bảo luôn có pk_user_id dù API trả về id hay pk_user_id
        user: user ? { ...user, pk_user_id: user.pk_user_id ?? user.id } : null,
        token,
      }),

      logout: () => set({ user: null, token: null }),

      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'auth-storage' }
  )
)

export default useAuthStore
