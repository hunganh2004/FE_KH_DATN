import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],
  add: (message, type = 'success') => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), message, type }]
  })),
  remove: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))

export default useToastStore
