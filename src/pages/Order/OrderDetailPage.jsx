import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatPrice, formatDateTime } from '@/utils/format'
import { orderService } from '@/services/orderService'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipping', 'delivered']

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã huỷ',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getDetail(id)
      .then((res) => {
        const order = res?.pk_order_id ? res : (res?.data ?? res)
        setOrder(order)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return
    try {
      await orderService.cancel(id)
      setOrder(o => ({ ...o, order_status: 'cancelled' }))
    } catch (err) {
      alert(err?.message || 'Không thể huỷ đơn hàng.')
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-stone-400">Đang tải...</div>
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-stone-400">Không tìm thấy đơn hàng.</div>

  const currentStep = STATUS_STEPS.indexOf(order.order_status)
  const isCancelled = order.order_status === 'cancelled'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Đơn hàng #{order.pk_order_id}</h1>
        <Link to="/account/orders" className="text-sm text-emerald-600 hover:underline">← Lịch sử đơn hàng</Link>
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStep ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center hidden sm:block ${i <= currentStep ? 'text-emerald-600 font-medium' : 'text-stone-400'}`}>
                    {STATUS_LABELS[s]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-red-600 text-sm font-medium">
          Đơn hàng đã bị huỷ
        </div>
      )}

      {/* Shipping info */}
      <div className="card p-4 mb-4">
        <p className="text-xs text-stone-400 mb-1">Giao đến</p>
        <p className="font-medium text-sm">{order.receiver} · {order.phone}</p>
        <p className="text-sm text-stone-500">{order.shipping_address}</p>
      </div>

      {/* Items */}
      <div className="card p-4 mb-4 space-y-3">
        {order.items?.map((item) => (
          <div key={item.pk_order_item_id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center text-xl">🐾</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
              <p className="text-xs text-stone-400">x{item.quantity}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <p className="text-sm font-semibold">{formatPrice(item.unit_price * item.quantity)}</p>
              {order.order_status === 'delivered' && (
                <Link
                  to={`/order/${order.pk_order_id}/review/${item.pk_order_item_id}`}
                  className="text-xs text-emerald-600 border border-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
                >
                  Đánh giá
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-stone-600"><span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
        {order.discount_amount > 0 && (
          <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(order.discount_amount)}</span></div>
        )}
        <div className="flex justify-between text-stone-600"><span>Phí vận chuyển</span><span>{formatPrice(order.shipping_fee)}</span></div>
        <div className="border-t pt-2 flex justify-between font-bold text-stone-800">
          <span>Tổng cộng</span>
          <span className="text-emerald-600 text-base">{formatPrice(order.total)}</span>
        </div>
      </div>

      {order.order_status === 'pending' && (
        <button onClick={handleCancel} className="btn-outline text-red-500 border-red-300 hover:bg-red-50 w-full py-2.5">
          Huỷ đơn hàng
        </button>
      )}
    </div>
  )
}
