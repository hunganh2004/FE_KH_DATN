import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistService } from '@/services/wishlistService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ pk_wishlist_id?, product }]

      // ── Fetch từ server ─────────────────────────────────────────────────
      fetchWishlist: async () => {
        if (USE_MOCK) return
        try {
          const data = await wishlistService.getWishlist()
          set({ items: data ?? [] })
        } catch {
          // silent
        }
      },

      isWishlisted: (productId) =>
        get().items.some(i => (i.product?.pk_product_id ?? i.pk_product_id) === productId),

      // ── Toggle (add/remove) ─────────────────────────────────────────────
      toggle: async (product) => {
        const productId = product.pk_product_id
        const exists = get().isWishlisted(productId)

        if (USE_MOCK) {
          set((state) => {
            if (exists) {
              return { items: state.items.filter(i => i.product.pk_product_id !== productId) }
            }
            return {
              items: [...state.items, {
                pk_wishlist_id: Date.now(),
                product,
                added_at: new Date().toISOString(),
              }],
            }
          })
          return
        }

        // Server mode — optimistic update
        if (exists) {
          set((state) => ({
            items: state.items.filter(i =>
              (i.product?.pk_product_id ?? i.pk_product_id) !== productId
            ),
          }))
          try {
            await wishlistService.remove(productId)
          } catch {
            await get().fetchWishlist() // rollback
          }
        } else {
          set((state) => ({
            items: [...state.items, { product, added_at: new Date().toISOString() }],
          }))
          try {
            await wishlistService.add(productId)
            await get().fetchWishlist() // sync để lấy pk_wishlist_id
          } catch {
            await get().fetchWishlist() // rollback
          }
        }
      },

      get count() { return get().items.length },
    }),
    { name: 'wishlist-storage' }
  )
)

export default useWishlistStore
