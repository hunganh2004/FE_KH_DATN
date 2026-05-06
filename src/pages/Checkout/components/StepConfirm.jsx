import { formatPrice } from '@/utils/format'
import { getPrimaryImage } from '@/utils/image'
import useCartStore, { calcCart } from '@/store/cartStore'
import ProductImage from '@/components/ui/ProductImage'

const METHOD_LABELS = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
}

export default function StepConfirm({ orderData, items, loading, onBack, onSubmit }) {
  const { items: cartItems } = useCartStore()
  const { subtotal, shippingFee, total } = calcCart(cartItems)

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Xác nhận đơn hàng</h2>

      {/* Address */}
      <div className="card p-4 mb-4">
        <p className="text-xs text-stone-400 mb-1">Giao đến</p>
        <p className="font-medium text-sm">{orderData.address?.receiver} · {orderData.address?.phone}</p>
        <p className="text-sm text-stone-500">{orderData.address?.street}, {orderData.address?.commune}, {orderData.address?.province}</p>
      </div>

      {/* Items */}
      <div className="card p-4 mb-4 space-y-3">
        {items.map((item) => {
          const price = item.variant?.sale_price ?? item.variant?.price ?? item.product.sale_price ?? item.product.price
          return (
            <div key={item.key} className="flex items-center gap-3">
              <ProductImage src={getPrimaryImage(item.product)} alt="" className="w-12 h-12 rounded-lg object-cover" wrapClass="w-12 h-12 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                {item.variant && <p className="text-xs text-stone-400">{item.variant.name}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{formatPrice(price * item.quantity)}</p>
                <p className="text-xs text-stone-400">x{item.quantity}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="card p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Tạm tính</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Phí vận chuyển</span>
          {shippingFee === 0
            ? <span className="text-emerald-600 font-medium">Miễn phí</span>
            : <span>{formatPrice(shippingFee)}</span>
          }
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Thanh toán</span><span>{METHOD_LABELS[orderData.paymentMethod]}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-stone-800">
          <span>Tổng cộng</span>
          <span className="text-emerald-600 text-base">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-1 py-3" disabled={loading}>Quay lại</button>
        <button onClick={onSubmit} className="btn-primary flex-1 py-3" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  )
}
