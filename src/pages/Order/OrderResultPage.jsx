import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'

export default function OrderResultPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const status = searchParams.get('status') // 'failed' nếu thanh toán online thất bại

  const success = status !== 'failed'

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {success ? (
        <>
          <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Đặt hàng thành công!</h1>
          <p className="text-stone-500 mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng #{orderId} đang được xử lý.</p>
          <div className="flex gap-3 justify-center">
            <Link to={`/order/${orderId}`} className="btn-primary">Xem đơn hàng</Link>
            <Link to="/" className="btn-outline">Tiếp tục mua sắm</Link>
          </div>
        </>
      ) : (
        <>
          <XCircle size={72} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Thanh toán thất bại</h1>
          <p className="text-stone-500 mb-6">Đơn hàng #{orderId} vẫn được giữ. Bạn có thể thử thanh toán lại.</p>
          <div className="flex gap-3 justify-center">
            <Link to={`/order/${orderId}`} className="btn-primary">Xem đơn hàng</Link>
            <Link to="/" className="btn-outline">Về trang chủ</Link>
          </div>
        </>
      )}
    </div>
  )
}
