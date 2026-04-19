import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import useCartStore, { calcCart } from '@/store/cartStore'
import useAuthStore from '@/store/authStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const { subtotal, shippingFee, total } = calcCart(items)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-stone-200 mb-4" />
        <h2 className="text-xl font-semibold text-stone-600 mb-2">Giỏ hàng trống</h2>
        <p className="text-stone-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
        <Link to="/" className="btn-primary">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => {
            const price = item.variant?.sale_price ?? item.variant?.price ?? item.product.sale_price ?? item.product.price
            const image = item.product.primary_image || '/placeholder-product.png'
            return (
              <div key={item.key} className="card p-4 flex gap-4">
                <Link to={`/product/${item.product.slug}`}>
                  <img src={image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="font-medium text-stone-800 hover:text-emerald-600 line-clamp-2 text-sm">
                    {item.product.name}
                  </Link>
                  {item.variant && <p className="text-xs text-stone-400 mt-0.5">{item.variant.name}</p>}
                  <p className="text-emerald-600 font-bold mt-1">{formatPrice(price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.key)} className="text-stone-300 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-2 py-1 hover:bg-stone-50 text-sm">−</button>
                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-2 py-1 hover:bg-stone-50 text-sm">+</button>
                  </div>
                  <p className="text-sm font-semibold text-stone-700">{formatPrice(price * item.quantity)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold text-stone-800 mb-4">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm text-stone-600 mb-2">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600 mb-4">
              <span>Phí vận chuyển</span>
              {shippingFee === 0
                ? <span className="text-emerald-600 font-medium">Miễn phí</span>
                : <span>{formatPrice(shippingFee)}</span>
              }
            </div>
            {shippingFee > 0 && subtotal < 500000 && (
              <p className="text-xs text-stone-400 mb-4 -mt-2">
                Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship
              </p>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-stone-800 mb-5">
              <span>Tổng cộng</span>
              <span className="text-emerald-600">{formatPrice(total)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full py-3 text-base">
              Tiến hành đặt hàng
            </button>
            <Link to="/" className="block text-center text-sm text-stone-400 hover:text-stone-600 mt-3">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
