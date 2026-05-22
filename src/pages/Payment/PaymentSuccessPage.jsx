import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Thanh toán thành công!</h1>
      <p className="text-stone-500 mb-6">
        Đơn hàng #{orderId} đã được thanh toán và đang được xử lý.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to={`/order/${orderId}`} className="btn-primary">Xem đơn hàng</Link>
        <Link to="/" className="btn-outline">Tiếp tục mua sắm</Link>
      </div>
    </div>
  )
}
