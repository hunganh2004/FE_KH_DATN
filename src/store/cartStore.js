import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (product, variant = null, quantity = 1) => set((state) => {
        const key = `${product.pk_product_id}-${variant?.pk_variant_id ?? 'base'}`
        const existing = state.items.find(i => i.key === key)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            )
          }
        }
        return { items: [...state.items, { key, product, variant, quantity }] }
      }),

      updateQuantity: (key, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(i => i.key !== key)
          : state.items.map(i => i.key === key ? { ...i, quantity } : i)
      })),

      removeItem: (key) => set((state) => ({
        items: state.items.filter(i => i.key !== key)
      })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)

// Helper tính toán ngoài store — không bị ảnh hưởng bởi persist
export function calcCart(items) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = i.variant?.sale_price ?? i.variant?.price ?? i.product.sale_price ?? i.product.price
    return sum + price * i.quantity
  }, 0)
  const shippingFee = subtotal > 0 && subtotal < 500000 ? 30000 : 0
  const total = subtotal + shippingFee
  return { itemCount, subtotal, shippingFee, total }
}

export default useCartStore
