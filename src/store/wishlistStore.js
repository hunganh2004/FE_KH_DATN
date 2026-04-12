import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ pk_wishlist_id, product }]

      isWishlisted: (productId) =>
        get().items.some(i => i.product.pk_product_id === productId),

      toggle: (product) => set((state) => {
        const exists = state.items.some(i => i.product.pk_product_id === product.pk_product_id)
        if (exists) {
          return { items: state.items.filter(i => i.product.pk_product_id !== product.pk_product_id) }
        }
        return {
          items: [...state.items, {
            pk_wishlist_id: Date.now(),
            product,
            added_at: new Date().toISOString(),
          }]
        }
      }),

      remove: (productId) => set((state) => ({
        items: state.items.filter(i => i.product.pk_product_id !== productId)
      })),

      get count() { return get().items.length },
    }),
    { name: 'wishlist-storage' }
  )
)

export default useWishlistStore
