import { create } from 'zustand'
import { categoryService } from '@/services/categoryService'

const toArray = (val) => (Array.isArray(val) ? val : val?.data ?? [])

const useCategoryStore = create((set, get) => ({
  tree: [],
  petTypes: [],
  loaded: false,

  init: async () => {
    if (get().loaded) return
    try {
      const [treeRes, petTypesRes] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getPetTypes(),
      ])
      set({
        tree: toArray(treeRes),
        petTypes: toArray(petTypesRes),
        loaded: true,
      })
    } catch {
      set({ loaded: true })
    }
  },
}))

useCategoryStore.getState().init()

export default useCategoryStore
