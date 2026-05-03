import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartService } from '@/services/cartService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ── Helper tính toán (dùng chung cho cả local và server cart) ──────────────
export function calcCart(items) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = i.variant?.sale_price ?? i.variant?.price
      ?? i.product?.sale_price ?? i.product?.price ?? 0
    return sum + price * i.quantity
  }, 0)
  const shippingFee = subtotal > 0 && subtotal < 500000 ? 30000 : 0
  const total = subtotal + shippingFee
  return { itemCount, subtotal, shippingFee, total }
}

// ── Normalize item từ API về shape thống nhất ──────────────────────────────
function normalizeServerItem(item) {
  return {
    key: `${item.product?.pk_product_id}-${item.variant?.pk_variant_id ?? 'base'}`,
    pk_cart_item_id: item.pk_cart_item_id,
    product: item.product,
    variant: item.variant ?? null,
    quantity: item.quantity,
  }
}

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      // ── Fetch từ server (chỉ dùng khi USE_MOCK=false) ──────────────────
      fetchCart: async () => {
        if (USE_MOCK) return
        set({ loading: true })
        try {
          const data = await cartService.getCart()
          set({ items: (data ?? []).map(normalizeServerItem) })
        } catch {
          // silent fail — giữ nguyên local items
        } finally {
          set({ loading: false })
        }
      },

      // ── Add item ────────────────────────────────────────────────────────
      addItem: async (product, variant = null, quantity = 1) => {
        if (USE_MOCK) {
          set((state) => {
            const key = `${product.pk_product_id}-${variant?.pk_variant_id ?? 'base'}`
            const existing = state.items.find(i => i.key === key)
            if (existing) {
              return {
                items: state.items.map(i =>
                  i.key === key ? { ...i, quantity: i.quantity + quantity } : i
                ),
              }
            }
            return { items: [...state.items, { key, product, variant, quantity }] }
          })
          return
        }
        // Server mode
        try {
          await cartService.addItem(product.pk_product_id, variant?.pk_variant_id, quantity)
          await get().fetchCart()
        } catch (err) {
          throw err
        }
      },

      // ── Update quantity ─────────────────────────────────────────────────
      updateQuantity: async (key, quantity) => {
        if (USE_MOCK) {
          set((state) => ({
            items: quantity <= 0
              ? state.items.filter(i => i.key !== key)
              : state.items.map(i => i.key === key ? { ...i, quantity } : i),
          }))
          return
        }
        const item = get().items.find(i => i.key === key)
        if (!item?.pk_cart_item_id) return
        try {
          await cartService.updateItem(item.pk_cart_item_id, quantity)
          await get().fetchCart()
        } catch (err) {
          throw err
        }
      },

      // ── Remove item ─────────────────────────────────────────────────────
      removeItem: async (key) => {
        if (USE_MOCK) {
          set((state) => ({ items: state.items.filter(i => i.key !== key) }))
          return
        }
        const item = get().items.find(i => i.key === key)
        if (!item?.pk_cart_item_id) return
        try {
          await cartService.removeItem(item.pk_cart_item_id)
          set((state) => ({ items: state.items.filter(i => i.key !== key) }))
        } catch (err) {
          throw err
        }
      },

      // ── Clear cart ──────────────────────────────────────────────────────
      clearCart: async () => {
        if (USE_MOCK) {
          set({ items: [] })
          return
        }
        try {
          await cartService.clearCart()
        } catch {
          // silent
        } finally {
          set({ items: [] })
        }
      },
    }),
    { name: 'cart-storage' }
  )
)

export default useCartStore
